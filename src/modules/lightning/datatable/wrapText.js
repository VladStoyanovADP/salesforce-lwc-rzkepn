import labelClipText from '@salesforce/label/LightningDatatable.clipText';
import labelWrapText from '@salesforce/label/LightningDatatable.wrapText';
import { normalizeBoolean } from 'lightning/utilsPrivate';
import { getStateColumnIndex } from './columns';
import { updateCell } from './rows';
import { normalizeNumberAttribute } from './utils';

const NON_WRAPPABLE_TYPES = new Set([
    'action',
    'boolean',
    'button',
    'button-icon',
    'date-local',
    'rowNumber',
]);

const i18n = {
    clipText: labelClipText,
    wrapText: labelWrapText,
};

/************************** WRAP TEXT STATE **************************/

/**
 * Normalizes the value for the column's wrapText property
 * Based on cell type and current wrapText value.
 *
 * @param {Object} col The datatable column definition
 */
export function setWrapTextState(col) {
    if (!NON_WRAPPABLE_TYPES.has(col.type)) {
        col.wrapText = normalizeBoolean(col.wrapText);
    } else {
        col.wrapText = false;
    }
}

/************************** WRAP TEXT MAX LINES **************************/

/**
 * Normalizes and sets wrapTextMaxLines in datatable state object.
 * The normalized value should be a positive integer or it'll fall back to undefined.
 *
 * @param {Object} state The datatable state
 * @param {Integer} value The maximum lines allowed
 */
export function setWrapTextMaxLines(state, value) {
    state.wrapTextMaxLines = normalizeNumberAttribute(
        'wrapTextMaxLines',
        value,
        'positive',
        undefined
    );
    state.shouldResetHeights = true;
}

/**
 * Sets the `wrapText` and `wrapTextMaxLines` values in the cell object for all cells in a column.
 * These values are used by primitiveCellFactory to set the required classes on the cell for wrapping
 *
 * @param {Object} state Datatable's state object
 * @param {Number} colIndex The column index to update
 * @param {String} colKeyValue The column key value to look up wrap text configuration
 */
function updateWrapTextAndMaxLinesValuesInCells(state, colIndex) {
    const { rows } = state;
    for (let i = 0; i < rows.length; i += 1) {
        updateCell(state, i, colIndex);
    }
}

/************************** HEADER ACTIONS **************************/

/**
 * Returns an object representing the two internal header actions that datatable
 * provides - Wrap Text and Clip Text.
 * Each header action contains a label, title, action name and its selected value (checked)
 *
 * @param {Object} state The datatable state
 * @param {Object} col The datatable column definition
 * @returns {Array} An array of wrap text actions
 */
export function getInternalActions(state, col) {
    // Must be done first to ensure isTextWrapped correctly resolves.
    setWrapTextState(col);
    // If not hidden and isWrapable, sets the internal actions.
    if (col.hideDefaultActions || NON_WRAPPABLE_TYPES.has(col.type)) {
        return [];
    }
    const isTextWrapped = col.wrapText || false;
    const { clipText, wrapText } = i18n;
    return [
        {
            label: wrapText,
            title: wrapText,
            checked: isTextWrapped,
            name: 'wrapText',
        },
        {
            label: clipText,
            title: clipText,
            checked: !isTextWrapped,
            name: 'clipText',
        },
    ];
}

/**
 * If the action is an internal action and if the wrapText value for a column
 * needs to be changed in the state, change it to the new value and update
 * the check mark to represent the currently selected action
 *
 * @param {Object} dt The datatable
 * @param {String} action Action that was selected/triggered
 * @param {String} colKeyValue Column key value
 */
export function handleTriggeredAction(dt, action, colKeyValue) {
    const { name } = action;
    const isWrapText = name === 'wrapText';
    if (isWrapText || name === 'clipText') {
        const { state } = dt;
        const colIndex = getStateColumnIndex(state, colKeyValue);
        const col = state.columns[colIndex];
        // If state should be changed
        if (col.wrapText !== isWrapText) {
            state.shouldResetHeights = true;
            col.wrapText = isWrapText;
            updateSelectedOptionInHeaderActions(state, colKeyValue);
        }
    }
    dt._recalculateHeaderHeight = true;
}

/**
 * Update the 'checked' value of the each action to show which action is selected
 * and which action is not selected.
 *
 * @param {Object} state The datatable state.
 * @param {String} colKeyValue The column key.
 */
function updateSelectedOptionInHeaderActions(state, colKeyValue) {
    const colIndex = getStateColumnIndex(state, colKeyValue);
    if (colIndex === -1) {
        return;
    }
    const { columns } = state;
    const col = columns[colIndex];
    const { internalActions } = col.actions;

    for (let i = 0; i < internalActions.length; i += 1) {
        const action = internalActions[i];
        const { name } = action;
        if (name === 'wrapText') {
            action.checked = col.wrapText;
        } else if (name === 'clipText') {
            action.checked = !col.wrapText;
        }
    }

    updateWrapTextAndMaxLinesValuesInCells(state, colIndex);

    // Force a refresh on this column, because the wrapText checked value changed.
    col.actions = Object.assign({}, col.actions);
}
