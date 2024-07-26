import { getColumnWidth, getTotalWidthsData } from './widthManagerShared';

/**
 * Determines the expected table width
 *
 * @param {Number} availableWidth The available width for the entire table
 * @param {Object} widthsData The widths metadata object
 * @returns {Number} The expected width of the table
 */
function getExpectedTableWidth(availableWidth, widthsData) {
    const {
        totalFixedWidth,
        totalResizedWidth,
        totalFlexibleColumns,
        minColumnWidth,
    } = widthsData;
    const minTotalFlexibleWidth = totalFlexibleColumns * minColumnWidth;
    const minExpectedTableWidth =
        minTotalFlexibleWidth + totalFixedWidth + totalResizedWidth;
    return widthsData.totalFlexibleColumns === 0
        ? minExpectedTableWidth
        : Math.max(minExpectedTableWidth, availableWidth);
}

/**
 * Strategy for columns with defined fixed widths.
 */
export class FixedWidthStrategy {
    widthsData = {};

    constructor(minColumnWidth, maxColumnWidth) {
        this.widthsData = { minColumnWidth, maxColumnWidth };
    }

    /**
     * Sets the minimum column width
     *
     * @param {Number} value The minimum width
     */
    set minColumnWidth(value) {
        this.widthsData.minColumnWidth = value;
    }

    /**
     * Sets the maximum column width
     *
     * @param {Number} value The maximum width
     */
    set maxColumnWidth(value) {
        this.widthsData.maxColumnWidth = value;
    }

    /**
     * Get adjusted column widths either from defined widths in columnDefs or by dividing total width
     * equally amongst the possible columns
     *
     * @param {Object} datatableInterface Interface to datatable with callbacks giving width information
     * @param {Array} _columns The untracked column definitions
     * @returns {Object} columnWidths: [], expectedTableWidth: (number)
     */
    getAdjustedColumnWidths(datatableInterface, _columns) {
        const totalWidthsData = getTotalWidthsData(this.widthsData, _columns);
        const availableWidth = datatableInterface.getAvailableWidthFromDom();
        const expectedTableWidth = getExpectedTableWidth(
            availableWidth,
            totalWidthsData
        );
        const expectedFlexibleColumnWidth = this.getFlexibleColumnWidth(
            totalWidthsData,
            expectedTableWidth
        );
        const columnWidths = [];
        for (let colIndex = 0; colIndex < _columns.length; colIndex += 1) {
            const width =
                getColumnWidth(_columns[colIndex]) ||
                expectedFlexibleColumnWidth;
            columnWidths[colIndex] = width;
        }
        return { columnWidths };
    }

    /**
     * Determines the expected flexible column width
     *
     * @param {Object} widthsData The widths metadata object
     * @param {Number} totalTableWidth The total available width for the table
     * @returns {Number} The column width
     */
    getFlexibleColumnWidth(widthsData, totalTableWidth) {
        const {
            totalFixedWidth,
            totalResizedWidth,
            totalFlexibleColumns,
            minColumnWidth,
            maxColumnWidth,
        } = widthsData;
        const totalFlexibleWidth =
            totalTableWidth - totalFixedWidth - totalResizedWidth;
        const avgFlexibleColumnWidth = Math.floor(
            totalFlexibleWidth / totalFlexibleColumns
        );
        const allowedSpace = Math.max(avgFlexibleColumnWidth, minColumnWidth);
        return Math.min(maxColumnWidth, allowedSpace);
    }
}
