import { isRTL, normalizeBoolean } from 'lightning/utilsPrivate';
import { clamp, getScrollerY, normalizeNumberAttribute } from './utils';

/**
 * Returns the default state/values of the resizer metadata.
 *
 * @returns {Object} - resizer default state
 */
export function getResizerDefaultState() {
    return {
        columnWidths: [],
        columnWidthsMode: 'fixed',
        maxColumnWidth: 1000,
        minColumnWidth: 50,
        resizeColumnDisabled: false,
        resizeStep: 10,
        tableWidth: 0,
    };
}

export const RESIZER_DEFAULT_STATE = getResizerDefaultState();

/***************** GETTERS / SETTERS *****************/

export function setResizeColumnDisabled(widthsData, value) {
    // Untracked state change.
    widthsData.resizeColumnDisabled = normalizeBoolean(value);
}

export function setResizeStep(widthsData, value) {
    // Tracked state change.
    widthsData.resizeStep = normalizeNumberAttribute(
        'resizeStep',
        value,
        'non-negative',
        RESIZER_DEFAULT_STATE.resizeStep
    );
}

export function setMinColumnWidth(columns, widthsData, value) {
    // Untracked state changes.
    widthsData.minColumnWidth = normalizeNumberAttribute(
        'minColumnWidth',
        value,
        'non-negative',
        RESIZER_DEFAULT_STATE.minColumnWidth
    );
    // Tracked state change.
    updateColumnWidthsMetadata(columns, widthsData);
}

export function setMaxColumnWidth(columns, widthsData, value) {
    // Untracked state change.
    widthsData.maxColumnWidth = normalizeNumberAttribute(
        'maxColumnWidth',
        value,
        'non-negative',
        RESIZER_DEFAULT_STATE.maxColumnWidth
    );
    // Tracked state change.
    updateColumnWidthsMetadata(columns, widthsData);
}

/***************************** RESIZE LOGIC *****************************/

/**
 * Resizes a column width.
 *
 * @param {Object} columns - The column definitions
 * @param {Object} widthsData - The widths data
 * @param {number} colIndex - The index of the column based on state.columns
 * @param {number} width - The new width is gonna be applied
 */
export function resizeColumn(columns, widthsData, colIndex, width) {
    const col = columns[colIndex];
    const { columnWidths } = widthsData;
    const currentWidth = columnWidths[colIndex];
    const { minWidth, maxWidth } = col;
    const newWidth = clamp(width, minWidth, maxWidth);
    if (currentWidth !== newWidth) {
        const newDelta = newWidth - currentWidth;
        // Untracked state changes.
        columnWidths[colIndex] = newWidth;
        widthsData.tableWidth += newDelta;
        // Tracked state changes.
        col.columnWidth = newWidth;
        col.style = newWidth ? `width: ${newWidth}px;` : '';
        // Workaround for header positioning issues in RTL
        if (isRTL()) {
            // update column offsets
            for (let i = colIndex + 1; i < columns.length; i += 1) {
                // Tracked state change.
                columns[i].offset += newDelta;
            }
        }
        // Tracked state change.
        col.isResized = true;
    }
}

/**
 * Resize a column width with an additional delta.
 *
 * @param {object} columns - The column definitions
 * @param {object} widthsData - The widths data
 * @param {number} colIndex - The index of the column based on state.columns
 * @param {number} delta - The delta that creates the new width
 */
export function resizeColumnWithDelta(columns, widthsData, colIndex, delta) {
    const currentWidth = widthsData.columnWidths[colIndex];
    resizeColumn(columns, widthsData, colIndex, currentWidth + delta);
}

export function updateColumnWidthsMetadata(columns, widthsData) {
    const { maxColumnWidth, minColumnWidth } = widthsData;
    for (let colIndex = 0; colIndex < columns.length; colIndex += 1) {
        const col = columns[colIndex];
        if (!col.internal) {
            col.maxWidth = maxColumnWidth;
            col.minWidth = minColumnWidth;
        }
        const { initialWidth } = col;
        if (initialWidth) {
            const { minWidth: min, maxWidth: max } = col;
            col.initialWidth = clamp(initialWidth, min, max);
        }
    }
}

/**
 * Returns the current widths for customer columns.
 *
 * @param {Object} columns - The columns of the table
 * @param {Object} widthsData - The data regarding column and table widths
 * @returns {Array} - The widths collection, every element
 * belong to a column with the same index in column prop
 */
export function getCustomerColumnWidths(columns, widthsData) {
    const widths = [];
    const { columnWidths } = widthsData;
    for (let colIndex = 0; colIndex < columns.length; colIndex += 1) {
        if (columns[colIndex].internal !== true) {
            widths.push(columnWidths[colIndex]);
        }
    }
    return widths;
}

/**
 * It returns if table is rendered and not hidden.
 *
 * @param {Node} template - The datatable template
 * @param {Object} refs - The datatable refs
 * @returns {boolean} - Whether the datatable is rendered and not hidden on the page
 */
export function isTableRenderedVisible(template, refs) {
    const scrollerY = getScrollerY(template, refs);
    return (
        scrollerY &&
        !!(
            scrollerY.offsetParent ||
            scrollerY.offsetHeight ||
            scrollerY.offsetWidth
        )
    );
}
