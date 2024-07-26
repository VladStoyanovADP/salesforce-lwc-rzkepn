import { clamp } from './utils';
import { getColumnWidth, getTotalWidthsData } from './widthManagerShared';

const MIN_MAX_THRESHOLD = 0.5;
const TRUNCATION_ALLOWANCE = 20;

/**
 * Calculates the total width of all columns
 *
 * @param {Array} columnWidths An array of column widths
 * @returns {Number} The total width of all columns
 */
function getTotalColumnWidth(columnWidths) {
    let total = 0;
    for (let i = 0, { length } = columnWidths; i < length; i += 1) {
        total += columnWidths[i];
    }
    return total;
}

/**
 * Determines the new width of a column of after removing a set amount
 *
 * @param {Number} currentWidth The current width of the column in pixels
 * @param {Number} widthToRemove The proposed amount of width to remove in pixels
 * @param {Number} minColumnWidth The minimum width the column can be in pixels
 * @returns {Number} The new width of the column in pixels
 */
function getReducedWidth(currentWidth, widthToRemove, minColumnWidth) {
    return Math.max(currentWidth - widthToRemove, minColumnWidth);
}

/**
 * Determines the new width of a column of after adding a set amount
 *
 * @param {Number} currentWidth The current width of the column in pixels
 * @param {Number} widthToRemove The proposed amount of width to add in pixels
 * @param {Number} maxColumnWidth The maximum width the column can be in pixels
 * @returns {Number} The new width of the column in pixels
 */
function getEnlargedWidth(currentWidth, widthToAdd, maxColumnWidth) {
    return Math.min(currentWidth + widthToAdd, maxColumnWidth);
}

/**
 * Determines the expected table width
 *
 * @param {Number} availableWidth The available width for the entire table
 * @param {Object} widthsData The widths data
 * @returns {Number} The expected width of the table
 */
function getExpectedTableWidth(availableWidth, widthsData) {
    const minTotalFlexibleWidth =
        widthsData.totalFlexibleColumns * widthsData.minColumnWidth;
    const minExpectedTableWidth =
        minTotalFlexibleWidth +
        widthsData.totalFixedWidth +
        widthsData.totalResizedWidth;
    return widthsData.totalFlexibleColumns === 0
        ? minExpectedTableWidth
        : Math.max(minExpectedTableWidth, availableWidth);
}

/**
 * Strategy for columns that automatically determine their widths.
 */
export class AutoWidthStrategy {
    // Instance array to hold column width ratios either calculated from visual distribution of column labels
    // or from distribution of data amongst the columns. These ratios are reused except when datatable reacts
    // to changes in data or columns and other variables at which point they are recalculated.
    columnWidthRatios = [];

    // Object used to store `minColumnWidth`, `maxColumnWidth`, along with other metadata like `totalFixedColumns`
    // Refer: widthManagerShared.js getTotalWidthsData
    columnWidthData = {};

    // Object which holds columns with min width (+ threshold) and columns with max width (-threshold)
    // It is used in redistribution of extra space that is left or taken up while calculating auto widths
    columnWidthsDistribution = {};

    constructor(minColumnWidth, maxColumnWidth, wrapTextMaxLines = 3) {
        this.columnWidthData = {
            minColumnWidth,
            maxColumnWidth,
            wrapTextMaxLines,
        };
        this.columnWidthsDistribution.colsWithMinWidth = [];
        this.columnWidthsDistribution.colsWithMaxWidth = [];
    }

    /**
     * Sets the minimum column width
     *
     * @param {Number} value The minimum column width in pixels
     */
    set minColumnWidth(value) {
        this.columnWidthData.minColumnWidth = value;
    }

    /**
     * Sets the maximum column width
     *
     * @param {Number} value The maximum column width in pixels
     */
    set maxColumnWidth(value) {
        this.columnWidthData.maxColumnWidth = value;
    }

    /**
     * Sets the maximum number of lines text can wrap on to
     *
     * @param {Number} value The maximum number of lines
     */
    set wrapTextMaxLines(value) {
        this.columnWidthData.wrapTextMaxLines = value;
    }

    /**
     * Get adjusted column widths from existing ratios which are based on data cells room taken
     * or based on column labels space in headers. If `recomputeAutoWidthRatios` is true or ratios
     * are empty, new ratios are calculated. Widths are distributed as per defined widths or as per
     * ratio. Any remaining space or extra space taken is then redistributed in second pass.
     *
     * @param {Object} datatableInterface Interface to datatable with callbacks giving width information
     * @param {Object} columns Column definitions array with defined widths and other attributes
     * @param {Boolean} recomputeAutoWidthRatios Whether ratios should be recalculated
     * @returns {Object} columnWidths: [], expectedTableWidth: (number)
     */
    getAdjustedColumnWidths(
        datatableInterface,
        columns,
        recomputeAutoWidthRatios
    ) {
        const widthsData = getTotalWidthsData(this.columnWidthData, columns);
        const availableWidth = datatableInterface.getAvailableWidthFromDom();
        const expectedTableWidth = getExpectedTableWidth(
            availableWidth,
            widthsData,
            columns
        );

        this.resetColumnWidthsDistribution();

        if (recomputeAutoWidthRatios || this.columnWidthRatios.length === 0) {
            this.calculateColumnWidthRatios(
                datatableInterface,
                columns,
                widthsData
            );
        }

        // If the lengths don't match, return
        if (
            recomputeAutoWidthRatios &&
            this.columnWidthRatios.length !== columns.length
        ) {
            return { columnWidths: [] };
        }

        // First pass - Distribute widths as per ratios or defined widths if there are any
        const columnWidths = this.distributeWidthFromRatios(
            expectedTableWidth,
            columns,
            widthsData
        );
        const columnWidthsSum = getTotalColumnWidth(columnWidths);

        // Second pass - There could be excess width remaining due to clamping to `maxWidth`
        // or we might have used more space due to clamping to `minWidth `in certain cases.
        // This could be more prominent in `autoWidthStrategy` than in `fixedWidthStrategy`
        // that columns get extreme widths (i.e `min` or `max`).
        // We need to redistribute this space using below methods.
        if (expectedTableWidth > columnWidthsSum) {
            // We have more space, let's redistribute space
            this.redistributeExtraWidth(
                expectedTableWidth,
                columnWidths,
                columns
            );
        } else if (expectedTableWidth < columnWidthsSum) {
            // We have to take away used space
            this.redistributeDeficitWidth(
                expectedTableWidth,
                columnWidths,
                columns
            );
        }
        return { columnWidths };
    }

    /**
     * Calculates the ratios for each cell based on available space for a given row.
     *
     * @param {Array} cellWidths An array of the cell widths
     * @param {Number} totalWidth The total available width
     * @returns {Array} An array of cell width ratios
     */
    getRatios(cellWidths, totalWidth) {
        const { length } = cellWidths;
        const ratios = Array(length);
        for (let i = 0; i < length; i += 1) {
            ratios[i] = (100 * cellWidths[i]) / totalWidth;
        }
        return ratios;
    }

    /**
     * Calculates and sets the column width ratios object.
     *
     * @param {Object} datatableInterface The datatable
     * @param {Array} columns The column definitions
     * @param {Object} widthsData The widths data
     */
    calculateColumnWidthRatios(datatableInterface, columns, widthsData) {
        // Take into account columns with text wrapping
        const { wrapTextMaxLines } = widthsData;
        const dataCellWidths = datatableInterface.getDataCellWidths();
        for (
            let colIndex = 0, { length } = dataCellWidths;
            colIndex < length;
            colIndex += 1
        ) {
            const col = columns[colIndex];
            if (col) {
                if (col.wrapText) {
                    const width = dataCellWidths[colIndex];
                    dataCellWidths[colIndex] = width / wrapTextMaxLines;
                } else {
                    const { fixedWidth } = col;
                    if (fixedWidth) {
                        dataCellWidths[colIndex] = fixedWidth;
                    }
                }
            }
        }
        this.setColumnWidthRatios(
            datatableInterface.getTableElementWidth(),
            dataCellWidths,
            datatableInterface.getHeaderCellWidths(),
            widthsData
        );
    }

    /**
     * Calculates and creates the column width ratios array.
     *
     * @param {Number} tableScrollWidth The width of the table that is hidden behind a hotizontal scroll
     * @param {Array} dataCellWidths An array of the widths of the data cells
     * @param {Array} headerCellWidths An array of the widths of the header cells
     * @param {Object} widthsData The unwrapped widths data
     */
    setColumnWidthRatios(
        tableScrollWidth,
        dataCellWidths,
        headerCellWidths,
        widthsData
    ) {
        // Reset ratios
        this.columnWidthRatios = [];

        if (tableScrollWidth > 0) {
            const { totalFixedWidth, totalResizedWidth } = widthsData;

            if (dataCellWidths.length === 0) {
                if (headerCellWidths.length > 0) {
                    const totalHeaderWidth = headerCellWidths.reduce(
                        (total, width) => {
                            total += width;
                            return total;
                        },
                        0
                    );

                    const totalFlexibleWidth =
                        totalHeaderWidth - totalFixedWidth - totalResizedWidth;
                    // Calculate ratio from header cells
                    this.columnWidthRatios = this.getRatios(
                        headerCellWidths,
                        totalFlexibleWidth
                    );
                }
            } else {
                const totalCellWidth = dataCellWidths.reduce((total, width) => {
                    total += width;
                    return total;
                }, 0);
                const totalFlexibleWidth =
                    Math.min(tableScrollWidth, totalCellWidth) -
                    totalFixedWidth -
                    totalResizedWidth;

                // Calculate ratio from data cells
                this.columnWidthRatios = this.getRatios(
                    dataCellWidths,
                    totalFlexibleWidth
                );
            }
        }
    }

    /**
     * Resets the column width distribution.
     */
    resetColumnWidthsDistribution() {
        this.columnWidthsDistribution.colsWithMinWidth = [];
        this.columnWidthsDistribution.colsWithMaxWidth = [];
    }

    /**
     * Allocates width to a column as per defined width or as per ratio.
     *
     * @param {Number} availableWidth Available width for the table
     * @param {Object} columns Column definitions in state
     * @param {Object} widthsData Metadata regarding widths includes `max`, `min`, `flexiblewidth`, `fixedwidth`
     */
    distributeWidthFromRatios(availableWidth, columns, widthsData) {
        const columnWidths = [];
        for (let colIndex = 0; colIndex < columns.length; colIndex += 1) {
            const col = columns[colIndex];
            const width =
                getColumnWidth(col) ||
                this.getColumnWidthFromRatio(
                    availableWidth,
                    widthsData,
                    colIndex
                );
            columnWidths[colIndex] = width;
        }
        return columnWidths;
    }

    /**
     * Calculates column width of a given column from the ratio.
     * Clamps to `minColWidth` and `maxColWidth`.
     * Also sets housekeeping data for `colsWithMaxWidth` threshold and `colsWithMinWidth` threshold.
     *
     * @param {Number} availableWidth Available width for the table
     * @param {Object} widthsData Metadata regarding widths includes max, min, flexiblewidth, fixedwidth
     * @param {Number} colIndex Column number
     */
    getColumnWidthFromRatio(availableWidth, widthsData, colIndex) {
        const {
            totalFixedWidth,
            totalResizedWidth,
            minColumnWidth,
            maxColumnWidth,
        } = widthsData;
        const widthRatio = this.columnWidthRatios[colIndex];
        const totalFlexibleWidth =
            availableWidth - totalFixedWidth - totalResizedWidth;
        const calculatedWidth =
            Math.floor((totalFlexibleWidth * widthRatio) / 100) +
            TRUNCATION_ALLOWANCE;
        const { colsWithMinWidth, colsWithMaxWidth } =
            this.columnWidthsDistribution;
        const minWidthThreshold =
            minColumnWidth + Math.ceil(MIN_MAX_THRESHOLD * minColumnWidth);
        if (calculatedWidth < minWidthThreshold) {
            colsWithMinWidth.push(colIndex);
        }
        const maxWidthThreshold =
            maxColumnWidth - Math.ceil(MIN_MAX_THRESHOLD * maxColumnWidth);
        if (calculatedWidth > maxWidthThreshold) {
            colsWithMaxWidth.push(colIndex);
        }
        return clamp(calculatedWidth, minColumnWidth, maxColumnWidth);
    }

    /**
     * This method gives extra width that was remaining by first giving width to columns with
     * max width or within threshold of max width then by giving from all columns possible,
     * excluding fixed width columns, columns that can become max width after redistribution.
     *
     * @param {Number} expectedTableWidth Width taken by the table in the DOM
     * @param {Array} columnWidths Column widths array
     * @param {Object} columns Column definitions from state
     */
    redistributeExtraWidth(expectedTableWidth, columnWidths, columns) {
        const { colsWithMinWidth } = this.columnWidthsDistribution;
        const { length: colsWithMinWidthLength } = colsWithMinWidth;
        const widthsData = getTotalWidthsData(this.columnWidthData, columns);
        const { maxColumnWidth, totalResizedColumns, totalFixedColumns } =
            widthsData;

        let columnWidthsSum = getTotalColumnWidth(columnWidths);
        let extraSpace = 0;
        let extraWidthPerColumn = 0;
        let totalColsToDistribute = 0;

        // First distribute space to columns with min width or threshold of min width
        if (colsWithMinWidthLength > 0) {
            extraSpace = expectedTableWidth - columnWidthsSum;
            totalColsToDistribute = colsWithMinWidthLength;
            extraWidthPerColumn = Math.floor(
                extraSpace / totalColsToDistribute
            );
            for (let i = 0; i < colsWithMinWidthLength; i += 1) {
                const colIndex = colsWithMinWidth[i];
                const currentWidth = columnWidths[colIndex];
                const newWidth = getEnlargedWidth(
                    currentWidth,
                    extraWidthPerColumn,
                    maxColumnWidth
                );
                columnWidthsSum += newWidth - currentWidth;
                columnWidths[colIndex] = newWidth;
            }
        }

        extraSpace = expectedTableWidth - columnWidthsSum;

        // Now distribute to every column possible excluding columns with defined widths
        // after this distribution its still possible we might have more space remaining
        // since we couldn't add widths to majority of columns.
        if (extraSpace > 0) {
            const totalFixedWidthColumns =
                totalResizedColumns + totalFixedColumns;
            const { length: colCount } = columns;

            totalColsToDistribute = colCount - totalFixedWidthColumns;
            extraWidthPerColumn = Math.floor(
                extraSpace / totalColsToDistribute
            );
            for (let colIndex = 0; colIndex < colCount; colIndex += 1) {
                const col = columns[colIndex];
                const currentWidth = columnWidths[colIndex];
                if (!getColumnWidth(col)) {
                    const newWidth = getEnlargedWidth(
                        currentWidth,
                        extraWidthPerColumn,
                        maxColumnWidth
                    );
                    columnWidthsSum += newWidth - currentWidth;
                    columnWidths[colIndex] = newWidth;
                }
            }
        }
    }

    /**
     * This method removes extra space that was taken by first taking away width from columns with
     * max width or within threshold of max width then by taking away from all columns possible,
     * excluding fixed width columns, column with min width or can become min width after taking away.
     *
     * @param {Number} expectedTableWidth Width taken by the table in the DOM
     * @param {Array} columnWidths Column widths array
     * @param {Object} columns Column definitions from state
     */
    redistributeDeficitWidth(expectedTableWidth, columnWidths, columns) {
        const { colsWithMaxWidth } = this.columnWidthsDistribution;
        const { length: colsWithMaxWidthLength } = colsWithMaxWidth;
        const widthsData = getTotalWidthsData(this.columnWidthData, columns);
        const { minColumnWidth, totalResizedColumns, totalFixedColumns } =
            widthsData;

        let columnWidthsSum = getTotalColumnWidth(columnWidths);
        let extraSpace = expectedTableWidth - columnWidthsSum;
        let totalColsToDistribute = 0;
        let extraWidthPerColumn = 0;

        // First take away width from columns with max width or threshold of max width
        if (colsWithMaxWidthLength > 0) {
            totalColsToDistribute = colsWithMaxWidthLength;
            extraWidthPerColumn = Math.floor(
                Math.abs(extraSpace) / totalColsToDistribute
            );
            for (let i = 0, { length } = colsWithMaxWidth; i < length; i += 1) {
                const colIndex = colsWithMaxWidth[i];
                const currentWidth = columnWidths[colIndex];
                const newWidth = getReducedWidth(
                    currentWidth,
                    extraWidthPerColumn,
                    minColumnWidth
                );
                columnWidthsSum -= currentWidth - newWidth;
                columnWidths[colIndex] = newWidth;
            }
        }

        extraSpace = expectedTableWidth - columnWidthsSum;
        const totalFixedWidthColumns = totalResizedColumns + totalFixedColumns;

        // Now from every column possible excluding columns with defined widths
        // and excluding columns within minWidthThreshold
        // after this distribution its still possible we might have used more space
        // since we couldn't take away widths from majority of columns
        if (extraSpace < 0) {
            const { colsWithMinWidth } = this.columnWidthsDistribution;
            totalColsToDistribute =
                columns.length -
                (totalFixedWidthColumns + colsWithMinWidth.length);
            extraWidthPerColumn = Math.floor(
                Math.abs(extraSpace) / totalColsToDistribute
            );
            for (let colIndex = 0; colIndex < columns.length; colIndex += 1) {
                const col = columns[colIndex];
                const currentWidth = columnWidths[colIndex];
                if (
                    !colsWithMinWidth.includes(colIndex) &&
                    !getColumnWidth(col)
                ) {
                    const newWidth = getReducedWidth(
                        currentWidth,
                        extraWidthPerColumn,
                        minColumnWidth
                    );
                    columnWidthsSum -= currentWidth - newWidth;
                    columnWidths[colIndex] = newWidth;
                }
            }
        }
    }
}
