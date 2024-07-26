import { normalizeNumberAttribute } from './utils';
import labelRowLevelErrorAssistiveText from '@salesforce/label/LightningDatatable.rowLevelErrorAssistiveText';
import { formatLabel } from 'lightning/utils';

const CHAR_WIDTH = 10;
const ROW_NUMBER_PADDING = 12;
const ROW_NUMBER_COLUMN_TYPE = 'rowNumber';

export const ROW_NUMBER_INITIAL_WIDTH = 52;
export const TOOLTIP_ALLOWANCE = 20;

const i18n = {
    rowLevelErrorAssistiveText: labelRowLevelErrorAssistiveText,
};

/**
 * Normalizes the passed in value to a non-negative number
 * and sets it to the rowNumberOffset in the state.
 * If the value is invalid, it falls back to 0.
 */
export function setRowNumberOffset(state, value) {
    state.rowNumberOffset = normalizeNumberAttribute(
        'rowNumberOffset',
        value,
        'non-negative',
        0 // default rowNumberOffset value
    );
}

/**
 * Calculates the width of the row number column.
 * This takes into account the number of digits in the row number
 * (ex. 3 for 100 rows), padding in the cell and
 * space allowance for the error tooltip which is rendered in this cell.
 *
 * @param {Object} state - The datatable state
 * @returns
 */
export function getAdjustedRowNumberColumnWidth(state) {
    const numberOfChars = String(
        state.rows.length + state.rowNumberOffset
    ).length;
    return Math.max(
        CHAR_WIDTH * numberOfChars +
            ROW_NUMBER_PADDING /* padding */ +
            TOOLTIP_ALLOWANCE /* primitive-tooltip */,
        ROW_NUMBER_INITIAL_WIDTH
    );
}

/**
 * Retrieves the column index of the row number column
 * Returns -1 if the row number column is not present
 *
 * @param {Object} state - The datatable state
 * @returns {Number} index of row number column. Returns -1 if not present
 */
export function getRowNumberColumnIndex(state) {
    if (state.showRowNumberColumn) {
        const { columns } = state;
        for (let i = 0, { length } = columns; i < length; i += 1) {
            if (columns[i].type === ROW_NUMBER_COLUMN_TYPE) {
                return i;
            }
        }
    }
    return -1;
}

/**
 * Constructs columns definition error object containing the title, error messages and alt text.
 *
 * @param {Object} rowErrors - object containing metadata of errors in the row
 * @param {String} rowTitle - value of the cell which has the scope of the row/rowheader
 * @returns
 */
export function getRowNumberError(rowErrors, rowTitle) {
    const { cells, fieldNames, messages, title } = rowErrors || {};
    let numberOfErrors = 0;
    if (cells) {
        numberOfErrors = Object.keys(cells).length;
    } else if (fieldNames) {
        numberOfErrors = fieldNames.length;
    }
    const alternativeText = formatLabel(
        i18n.rowLevelErrorAssistiveText,
        rowTitle || '',
        numberOfErrors
    );
    return { title, messages, alternativeText };
}

/**
 * Constructs and returns the column definition for the row number column
 * Column definition contains the row number column's row type and
 * the error object containing the title, error messages and alt text
 *
 * @param {Object} rowErrors - object containing metadata of errors in the row
 * @param {String} rowTitle - value of the cell which has the scope of the row/rowheader
 * @returns
 */
export function getRowNumberErrorColumnDef(rowErrors, rowTitle) {
    return {
        type: ROW_NUMBER_COLUMN_TYPE,
        typeAttributes: {
            error: getRowNumberError(rowErrors, rowTitle),
        },
    };
}
