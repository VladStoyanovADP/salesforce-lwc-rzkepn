/**
 * Creates and returns a metadata object the contains information about the
 * number of fixed, flexible, and resized columns in the table
 *
 * @param {Object} columnWidthMetaData The initial column widths metadata
 * @param {Object} columns The state column definitions
 * @returns {Object} The computed metadata
 */
export function getTotalWidthsData(columnWidthMetaData, columns) {
    const totalWidthsData = {
        totalFixedWidth: 0,
        totalFixedColumns: 0,
        totalResizedWidth: 0,
        totalResizedColumns: 0,
        totalFlexibleColumns: 0,
        minColumnWidth: columnWidthMetaData.minColumnWidth,
        maxColumnWidth: columnWidthMetaData.maxColumnWidth,
        wrapTextMaxLines: columnWidthMetaData.wrapTextMaxLines,
    };
    for (let colIndex = 0; colIndex < columns.length; colIndex += 1) {
        const col = columns[colIndex];
        const { fixedWidth, initialWidth } = col;
        if (fixedWidth) {
            totalWidthsData.totalFixedWidth += fixedWidth;
            totalWidthsData.totalFixedColumns += 1;
        } else if (col.isResized) {
            totalWidthsData.totalResizedWidth += col.columnWidth;
            totalWidthsData.totalResizedColumns += 1;
        } else if (initialWidth) {
            totalWidthsData.totalResizedWidth += initialWidth;
            totalWidthsData.totalResizedColumns += 1;
        } else {
            totalWidthsData.totalFlexibleColumns += 1;
        }
    }
    return totalWidthsData;
}

/**
 * Gets the width of a column. If the column has a fixed width,
 * it will always return that value. If the column does not have a fixed
 * width, it will return the resized value (if applicable), otherwise
 * the initial width.
 *
 * @param {Object} column The column object
 * @returns {Number} The fixed width, resized width, or initial width of the column (in that priority order)
 */
export function getColumnWidth(column) {
    const { fixedWidth } = column;
    if (fixedWidth) {
        return fixedWidth;
    }
    return column.isResized
        ? column.columnWidth || column.initialWidth
        : column.initialWidth;
}
