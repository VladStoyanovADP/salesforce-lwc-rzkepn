import {
    getCellByKeys,
    getRowByKey,
    getRowIndexByKey,
    HEADER_ROW_KEY,
} from './indexes';
import { isNonNegativeInteger } from './utils';
import {
    getCurrentSelectionLength,
    getSelectedRowsKeys,
    isDisabledRow,
    SELECTABLE_HEADER_TYPE,
} from './rowSelectionShared';
import { setInliningProperties } from './rowsInlining';

const MAX_ROW_SELECTION_DEFAULT = undefined;

const ROWS_ACTION = {
    SELECT_ALL_ROWS: 'selectAllRows',
    DESELECT_ALL_ROWS: 'deselectAllRows',
    ROW_SELECT: 'rowSelect',
    ROW_DESELECT: 'rowDeselect',
};

/************************** EVENT HANDLERS **************************/

/**
 * Marks all possible rows as selected depending on the max-row-selection value.
 * Fires the `rowselection` event with the new set of selected rows.
 *
 * @param {CustomEvent} event - `selectallrows`
 */
export function handleSelectAllRows(event) {
    event.stopPropagation();
    markAllRowsSelected(this.state);
    this.fireSelectedRowsChange(this.getSelectedRows(), {
        action: ROWS_ACTION.SELECT_ALL_ROWS,
    });
}

/**
 * Marks all rows as de-selected. Does not need to account for max-row-selection.
 * Fires the `rowselection` event with the new set of selected rows.
 * @param {CustomEvent} event - `deselectallrows`
 */
export function handleDeselectAllRows(event) {
    event.stopPropagation();
    markAllRowsDeselected(this.state);
    this.fireSelectedRowsChange(this.getSelectedRows(), {
        action: ROWS_ACTION.DESELECT_ALL_ROWS,
    });
}

/**
 * Handles selection of row(s)
 * 1. Marks the relevant rows as selected
 *     Depends on whether a single row or multiple rows (interval) were selected
 * 2. Records the last selected row's row key value in the state
 * 3. Fires the `rowselection` event with the new selected rows in the details object
 *
 * @param {CustomEvent} event - `selectrow` event
 */
export function handleSelectRow(event) {
    event.stopPropagation();
    const { state } = this;
    const { rowKeyValue, isMultiple } = event.detail;
    const fromRowKey = isMultiple
        ? getLastRowSelection(state) || rowKeyValue
        : rowKeyValue;
    markSelectedRowsInterval(state, fromRowKey, rowKeyValue);
    state.lastSelectedRowKey = rowKeyValue;
    this.fireSelectedRowsChange(this.getSelectedRows(), {
        action: ROWS_ACTION.ROW_SELECT,
        value: rowKeyValue,
    });
}

/**
 * Handles the de-selection of row(s)
 * 1. Marks the relevant rows as de-selected
 *     Depends on whether a single row or multiple rows (interval) was de-selected
 * 2. Records the last selected row's row key value in the state
 * 3. Fires the `rowselection` event with the new selected rows in the details object
 *
 * @param {CustomEvent} event - `deselectrow` event
 */
export function handleDeselectRow(event) {
    event.stopPropagation();
    const { state } = this;
    const { rowKeyValue, isMultiple } = event.detail;
    const fromRowKey = isMultiple
        ? getLastRowSelection(state) || rowKeyValue
        : rowKeyValue;
    markDeselectedRowsInterval(state, fromRowKey, rowKeyValue);
    state.lastSelectedRowKey = rowKeyValue;
    this.fireSelectedRowsChange(this.getSelectedRows(), {
        action: ROWS_ACTION.ROW_DESELECT,
        value: rowKeyValue,
    });
}

/**
 * Handles the `rowselection` event
 */
export function handleRowSelectionChange() {
    updateBulkSelectionState(this.state);
}

/************************** ROW SELECTION **************************/

/**
 * Marks all rows as selected.
 * Retrieve all rows from the state object. Iterate over these rows; for each:
 *     1. If the index is less than the specified max-row-selection value or
 *        if max-row-selection is not specified at all, set `isSelected` and
 *        `ariaSelected` to true and resolve `classnames` to reflect that the
 *        row is selected on each row object.
 *     2. If max-row-selection has been reached, mark the remaining rows
 *        to reflect that they are not selected and disable them.
 *
 * @param {Object} state - The datatable state
 */
export function markAllRowsSelected(state) {
    const { maxRowSelection, rows } = state;
    const selectedRowsKeys = {};
    for (let i = 0, { length: rowCount } = rows; i < rowCount; i += 1) {
        const row = rows[i];
        if (maxRowSelection === undefined || i < maxRowSelection) {
            selectedRowsKeys[row.key] = true;
            setRowSelectedAttributes(row, true);
        } else {
            row.isDisabled = true;
            setRowSelectedAttributes(row, false);
        }
    }
    state.selectedRowsKeys = selectedRowsKeys;
}

/**
 * Marks all rows as de-selected.
 * Retrieve all rows from the state object. Iterate over these rows; for each row
 * set `isSelected` and `ariaSelected` to false and enable the row. Also resolve
 * the `classnames` for the row to reflect that it is not selected.
 *
 * @param {Object} state - The datatable state
 */
export function markAllRowsDeselected(state) {
    const { rows } = state;
    for (let i = 0, { length: rowCount } = rows; i < rowCount; i += 1) {
        const row = rows[i];
        row.isDisabled = false;
        setRowSelectedAttributes(row, false);
    }
    state.selectedRowsKeys = {};
}

/**
 * Marks rows as selected for all rows within the interval.
 * An interval is created when the user had initially selected a cell,
 * then does a Shift + click on a different row selection checkbox.
 * By doing so, all the rows (and checkboxes) between those two rows
 * will all be selected.
 *
 * Note that this function is also used not only for intervals but also
 * for single row selections. In that case, the startRowKey and
 * endRowKey will both have the same value.
 *
 * This does not handle the case when the header checkbox that selects
 * all rows of the table is clicked. That is handled by - `handleSelectAllRows`
 *
 * @param {Object} state - The datatable state
 * @param {String} startRowKey - row key value of the first row that was selected (start of the interval)
 * @param {String} endRowKey - row key value of the last row that was selected (end of the interval)
 */
function markSelectedRowsInterval(state, startRowKey, endRowKey) {
    const { rows } = state;
    const { start, end } = getRowIntervalIndexes(state, startRowKey, endRowKey);
    const total = state.maxRowSelection || rows.length;
    let rowIndex = start;
    let maxSelectionReached;
    while (rowIndex <= end && !maxSelectionReached) {
        markRowSelected(state, rows[rowIndex].key);
        maxSelectionReached = getCurrentSelectionLength(state) >= total;
        rowIndex += 1;
    }
}

/**
 * Marks rows as de-selected for all rows within the interval.
 * An interval for de-selection is created when the user ended selection or
 * de-selects a row and then does a Shift + click on a row that was previously selected.
 * By doing so, all the rows (and checkboxes) between the two rows will be de-selected
 *
 * Note that this function is also used not only for intervals but also
 * for single row de-selections. In that case, the startRowKey and
 * endRowKey will both have the same value.
 *
 * This does not handle the case when the header checkbox is clicked to de-select all rows
 * That is handledd by - `handleDeselectAllRows`
 *
 * @param {Object} state - The datatable state
 * @param {String} startRowKey - row key value of the first row that was selected (start of the interval)
 * @param {String} endRowKey - row key value of the last row that was selected (end of the interval)
 */
function markDeselectedRowsInterval(state, startRowKey, endRowKey) {
    const { rows, selectedRowsKeys } = state;
    const { start, end } = getRowIntervalIndexes(state, startRowKey, endRowKey);

    for (let rowIndex = start; rowIndex <= end; rowIndex += 1) {
        const row = rows[rowIndex];
        setRowSelectedAttributes(row, false);
        // Setting to `false` instead of using `delete` for better performance.
        selectedRowsKeys[row.key] = false;
        if (getCurrentSelectionLength(state) === state.maxRowSelection - 1) {
            markDeselectedRowEnabled(state);
        }
    }
}

/**
 * Marks a row with the specified row key value as selected. This is done by:
 *     1. Sets `isSelected`, `ariaSelected` to true and resolves `classnames`
 *        to that which reflect that the row is selected, on the row object.
 *        These are used by the template to render the appropriate values.
 *     2. If max-row-selection > 1 (checkbox/multi-selection),
 *         a. If with this selection, the max-row-selection value is reached,
 *            disable all the other un-selected rows
 *         b. Add the row key value of that row to the state
 *     3. If max-row-selection = 1 (radio button selector),
 *         a. If another row was previously selected before, de-select that row
 *         b. Add the row key value of that row to the state
 *
 * @param {Object} state - The datatable state
 * @param {String} rowKeyValue - row key value of row to mark selected
 */
export function markRowSelected(state, rowKeyValue) {
    const row = getRowByKey(state, rowKeyValue);
    const prevSelectionLength = getCurrentSelectionLength(state);
    const total = state.maxRowSelection || state.rows.length;

    setRowSelectedAttributes(row, true);

    let { selectedRowsKeys } = state;
    if (total > 1) {
        selectedRowsKeys[row.key] = true;
        if (prevSelectionLength + 1 === total) {
            markDeselectedRowDisabled(state);
        }
    } else {
        if (prevSelectionLength === 1) {
            const prevSelectedRow = getRowByKey(
                state,
                Object.keys(selectedRowsKeys)[0]
            );
            setRowSelectedAttributes(prevSelectedRow, false);
            selectedRowsKeys = {};
            state.selectedRowsKeys = selectedRowsKeys;
        }
        selectedRowsKeys[row.key] = true;
    }
}

/**
 * Iterates over the row key values passed in and sets the relevant
 * values on the row object to reflect that it is selected.
 * Sets `isSelected`, `ariaSelected` and `classnames` on the row object
 * which are used by the template to render the appropriate values.
 *
 * @param {Object} state - The datatable state
 * @param {Array} keys - a list of row key values to be marked selected
 */
function markRowsSelectedByKeys(state, keys) {
    for (let i = 0, { length } = keys; i < length; i += 1) {
        const row = getRowByKey(state, keys[i]);
        setRowSelectedAttributes(row, true);
    }
}

/**
 * Iterates over the row key values passed in and un-sets the relevant
 * values on the row object to reflect that it is not selected.
 * Sets `isSelected`, `ariaSelected` to false and resolves `classnames`
 * to one which reflects that the row is not selected on the row object.
 * These are used by the template to render the appropriate values.
 *
 * @param {Object} state - The datatable state
 * @param {Array} keys - a list of row key values to be marked selected
 */
function markRowsDeselectedByKeys(state, keys) {
    for (let i = 0, { length } = keys; i < length; i += 1) {
        const row = getRowByKey(state, keys[i]);
        setRowSelectedAttributes(row, false);
    }
}

/**
 * Marks all deselected rows as disabled. This prevents the user
 * from selecting any more rows.
 * This is typically called once the selection has reached the
 * max-row-selection value and no more rows are allowed to be selected.
 *
 * @param {Object} state - datatable's state object
 */
export function markDeselectedRowDisabled(state) {
    const { rows, selectedRowsKeys } = state;
    for (let i = 0, { length: rowCount } = rows; i < rowCount; i += 1) {
        const row = rows[i];
        if (!selectedRowsKeys[row.key]) {
            row.isDisabled = true;
        }
    }
}

/**
 * Marks all the deselected rows as enabled. This allows the user
 * to select more rows.
 * This is typically called when the maximum number of rows were
 * previously selected but a row was deselected, now allowing
 * any other row to be selected - for this, all rows should be enabled
 *
 * @param {Object} state - The datatable state
 */
export function markDeselectedRowEnabled(state) {
    const { rows, selectedRowsKeys } = state;
    for (let i = 0, { length: rowCount } = rows; i < rowCount; i += 1) {
        const row = rows[i];
        if (!selectedRowsKeys[row.key]) {
            row.isDisabled = false;
        }
    }
}

/************************** SELECTED ROW KEYS **************************/

/**
 * This is called when the `selected-rows` attribute is set on the datatable
 * The 'value' parameter should be an Array of key-field values. If it is not an array,
 * we throw an error stating so and all rows are de-selected.
 *
 * If the 'value' param is valid, we filter the 'value' array for only the valid keys.
 * If the number of valid keys exceeds the max-row-selection value, we use only the
 * number of keys from the valid list as that of the max-row-selection value.
 *
 * Compute the differences between the currently selected rows vs
 * the newly selected rows to find out which rows need to be additionally
 * selected and de-selected.
 * Based on the above computation, mark rows as selected or de-selected and
 * set the new `selectedRowsKeys` in the state object.
 *
 * If we select the max number of rows allowed and if max-row-selection > 1 (multi-select),
 * disable all the other rows.
 * If the previous selection had reached the max limit and the new selection
 * is less than the limit, re-enable the de-selected rows to allow for new selection.
 *
 * @param {Object} state - The datatable state
 * @param {Array} value - key-field values of rows to set as selected
 */
export function setSelectedRowsKeys(state, value) {
    if (Array.isArray(value)) {
        const { maxRowSelection } = state;
        const previousSelectionLength = getCurrentSelectionLength(state);
        let selectedRows = filterValidKeys(state, value);
        if (selectedRows.length > maxRowSelection) {
            // eslint-disable-next-line no-console
            console.warn(
                `The number of keys in selectedRows for lightning:datatable exceeds the limit defined by maxRowSelection.`
            );
            selectedRows = selectedRows.slice(0, maxRowSelection);
        }

        // Convert the selectedRows Array to an Object that state.selectedRowKeys expects
        // ['a', 'b'] -> { a : true, b : true}
        const selectedRowsKeys = normalizeSelectedRowsKey(selectedRows);

        // Compute differences between currently selected rows and
        // newly selected row keys. The diff will tell which new rows
        // need to be selected and which already selected rows need to
        // be deselected
        const selectionOperations = getSelectedDiff(state, selectedRows);
        const deselectionOperations = getDeselectedDiff(
            state,
            selectedRowsKeys
        );
        markRowsSelectedByKeys(state, selectionOperations);
        markRowsDeselectedByKeys(state, deselectionOperations);
        state.selectedRowsKeys = selectedRowsKeys;

        const { length: selectedRowsCount } = selectedRows;
        // If we select the max number of rows allowed and if max-row-selection > 1 (multi-select),
        // disable all the other rows to prevent further selection
        if (selectedRowsCount === maxRowSelection && maxRowSelection > 1) {
            markDeselectedRowDisabled(state);
        } else if (
            selectedRowsCount < maxRowSelection &&
            previousSelectionLength === maxRowSelection
        ) {
            // If the previous selection had reached the max limit and the new selection
            // is less than the limit, re-enable the de-selected rows to allow for new selection.
            markDeselectedRowEnabled(state);
        }
    } else {
        // eslint-disable-next-line no-console
        console.error(
            `The "selectedRows" passed into "lightning:datatable" must be an Array with the keys of the selected rows. We receive instead ${value}`
        );
        markAllRowsDeselected(state);
    }
}

export function syncSelectedRowsKeys(state, selectedRows) {
    let changed = false;
    const { keyField, selectedRowsKeys } = state;
    const { length: selectedRowCount } = selectedRows;
    if (Object.keys(selectedRowsKeys).length !== selectedRowCount) {
        changed = true;
        // Untracked state change.
        state.selectedRowsKeys = updateSelectedRowsKeysFromSelectedRows(
            selectedRows,
            keyField
        );
    } else {
        for (let i = 0; i < selectedRowCount; i += 1) {
            const row = selectedRows[i];
            if (!selectedRowsKeys[row[keyField]]) {
                changed = true;
                // Untracked state change.
                state.selectedRowsKeys = updateSelectedRowsKeysFromSelectedRows(
                    selectedRows,
                    keyField
                );
                break;
            }
        }
    }
    if (changed) {
        const total = state.maxRowSelection || state.rows.length;
        if (total > 1) {
            // Tracked state changes.
            if (selectedRowCount < total) {
                markDeselectedRowEnabled(state);
            } else {
                markDeselectedRowDisabled(state);
            }
        }
    }
    // Tracked state change.
    updateBulkSelectionState(state);
    return {
        ifChanged(callback) {
            if (changed && typeof callback === 'function') {
                callback(selectedRows);
            }
        },
    };
}

function updateSelectedRowsKeysFromSelectedRows(selectedRows, keyField) {
    const selectedRowsKeys = {};
    for (let i = 0, { length } = selectedRows; i < length; i += 1) {
        const row = selectedRows[i];
        selectedRowsKeys[row[keyField]] = true;
    }
    return selectedRowsKeys;
}

function normalizeSelectedRowsKey(keys) {
    const selectedRowsKeys = {};
    for (let i = 0, { length } = keys; i < length; i += 1) {
        selectedRowsKeys[keys[i]] = true;
    }
    return selectedRowsKeys;
}

function filterValidKeys(state, keys) {
    const filtered = [];
    const { rows } = state;
    if (rows.length) {
        const { indexes } = state;
        for (let i = 0, { length } = keys; i < length; i += 1) {
            const key = keys[i];
            if (indexes[key]) {
                filtered.push(key);
            }
        }
    }
    return filtered;
}

/************************** LAST SELECTED ROW KEYS **************************/

/**
 * Returns the row key value of the row that was last selected
 * Returns undefined if the row key value is invalid
 *
 * @param {Object} state - The datatable state.
 * @returns {String | undefined } the row key or undefined.
 */
function getLastRowSelection(state) {
    const { lastSelectedRowKey } = state;
    const keyIsValid =
        lastSelectedRowKey !== undefined &&
        getRowByKey(state, lastSelectedRowKey) !== undefined;

    return keyIsValid ? lastSelectedRowKey : undefined;
}

/************************** INPUT TYPES **************************/

/**
 * Computes whether or not the input type rendered for row selection needs to change
 * The input type may need to change if:
 *     1. The max-row-selection value was previously 1 and is now either
 *        greater than 1 or is undefined OR
 *     2. The max-row-selection value was previously greater than 1 or undefined
 *        and is now 1 OR
 *     3. Previous max-row-selection value was 0 OR
 *     4. New max-row-selection value is 0
 *
 * @param {Number} previousMaxRowSelection
 * @param {Number} newMaxRowSelection
 * @returns {Boolean}
 */
export function inputTypeNeedsToChange(
    previousMaxRowSelection,
    newMaxRowSelection
) {
    return (
        previousMaxRowSelection === 0 ||
        newMaxRowSelection === 0 ||
        (previousMaxRowSelection === 1 &&
            // is newMaxRowSelection multi-selection
            (newMaxRowSelection > 1 || newMaxRowSelection === undefined)) ||
        (newMaxRowSelection === 1 &&
            // is previousMaxRowSelection multi-selection
            (previousMaxRowSelection > 1 ||
                previousMaxRowSelection === undefined))
    );
}

export function updateRowSelectionInputType(state, datatableId) {
    const isInputTypeCheckbox = state.maxRowSelection !== 1;
    const type = isInputTypeCheckbox ? 'checkbox' : 'radio';
    const { rows } = state;

    // Determine if inlining props need resetting
    // And which column to reset if so
    let resetInliningProps = false;
    let checkboxColIndex;
    if (state.renderModeInline && !state.hideCheckboxColumn) {
        resetInliningProps = true;
        checkboxColIndex = state.showRowNumberColumn ? 1 : 0;
    }

    for (let i = 0, { length: rowCount } = rows; i < rowCount; i += 1) {
        // Tracked state changes.
        const row = rows[i];
        row.inputType = type;
        row.isDisabled = isDisabledRow(state, row.key);
        if (resetInliningProps) {
            setInliningProperties(
                state,
                row.cells[checkboxColIndex],
                isInputTypeCheckbox,
                datatableId
            );
        }
    }
}

/************************** MAX ROW SELECTION **************************/

/**
 * Sets maxRowSelection to the provided value,
 * only keeping up to maxRowSelection values selected.
 *
 * Use input type checkbox if maxRowSelection > 1
 * and input type is radio if maxRowSelection = 1.
 * Invalid values are set to default and an error is logged
 *
 * @param {Object} state - The datatable state
 * @param {Number | String} - value to set for maxRowSelection
 */
export function setMaxRowSelection(state, value, datatableId) {
    const previousSelectedRowsKeys = getSelectedRowsKeys(state);
    // Tracked state changes.
    markAllRowsDeselected(state);
    if (isNonNegativeInteger(value)) {
        const previousMaxRowSelection = state.maxRowSelection;
        const newMaxRowSelection = Number(value);
        // Untracked state change.
        state.maxRowSelection = newMaxRowSelection;
        // Reselect up to maxRowSelection rows.
        const numberOfRows = Math.min(
            previousSelectedRowsKeys.length,
            newMaxRowSelection
        );
        for (let i = 0; i < numberOfRows; i += 1) {
            // Tracked state changes.
            markRowSelected(state, previousSelectedRowsKeys[i]);
        }
        if (
            inputTypeNeedsToChange(previousMaxRowSelection, newMaxRowSelection)
        ) {
            // Tracked state changes.
            updateRowSelectionInputType(state, datatableId);
            updateBulkSelectionState(state);
        }
    } else {
        // Untracked state change.
        state.maxRowSelection = MAX_ROW_SELECTION_DEFAULT;
        // suppress console error if no value is passed in
        if (value !== null && value !== undefined) {
            // eslint-disable-next-line no-console
            console.error(
                `The maxRowSelection value passed into lightning:datatable should be a positive integer. We receive instead (${value}).`
            );
        }
    }
}

/************************** BULK SELECTION STATE **************************/

export function updateBulkSelectionState(state) {
    const columns = state.columns || {};
    for (let colIndex = 0; colIndex < columns.length; colIndex += 1) {
        const col = columns[colIndex];
        if (col.type === SELECTABLE_HEADER_TYPE) {
            const {
                maxRowSelection,
                rows: { length: rowCount },
            } = state;
            const total = maxRowSelection || rowCount;
            const selected = getCurrentSelectionLength(state);
            // Force a rerender of this column by replacing the tracked object.
            // Required to pass treegrid unit tests.
            const updatedCol = Object.assign({}, col);
            if (selected) {
                updatedCol.bulkSelection = selected === total ? 'all' : 'some';
            } else {
                updatedCol.bulkSelection = 'none';
            }
            updatedCol.isBulkSelectionDisabled =
                maxRowSelection === 0 || rowCount === 0;
            // Replace old column with shallow cloned and updated column.
            columns[colIndex] = updatedCol;
            return;
        }
    }
}

/************************** HELPER FUNCTIONS **************************/

/**
 * Gets the interval of row indexes based on the start and end row key values
 * Retrieves the index of the row with startRowKey and the same with endRowKey
 * Returns an object that contains the start index which is the lower index value of the two
 * and the end index which is the higher value of the two.
 *
 * @param {Object} state - The datatable state
 * @param {String} startRowKey - The row key value of the first row that was selected (start of the interval)
 * @param {String} endRowKey - The row key value of the last row that was selected (end of the interval)
 * @returns {Object} - An object with start index and end index
 */
function getRowIntervalIndexes(state, startRowKey, endRowKey) {
    const start =
        startRowKey === HEADER_ROW_KEY
            ? 0
            : getRowIndexByKey(state, startRowKey);
    const end = getRowIndexByKey(state, endRowKey);

    return {
        start: Math.min(start, end),
        end: Math.max(start, end),
    };
}

/**
 * Sets aria-selected to 'true' on the cell identified by the rowKeyValue and colKeyValue.
 * This will reflect on the td or th or corresponding element in the role-based table.
 *
 * Note: This change is volatile, and will be reset (lost) in the next index regeneration.
 *
 * @param {Object} state - The datatable state
 * @param {String} rowKeyValue - The row key of the cell to mark selected
 * @param {String} colKeyValue - The column key of the cell to mark selected
 */
export function setAriaSelectedOnCell(state, rowKeyValue, colKeyValue) {
    const cell = getCellByKeys(state, rowKeyValue, colKeyValue);
    if (cell) {
        cell.ariaSelected = 'true';
    }
}

/**
 * Sets aria-selected to 'false' on the cell identified by the rowKeyValue and colKeyValue.
 * This aria-selected attribute will be removed from the cell (if it was previously added))
 * on the td or th or the corresponding element in the role-based table.
 *
 * Note: This change is volatile, and will be reset (lost) in the next index regeneration.
 *
 * @param {Object} state - The datatable state
 * @param {String} rowKeyValue - The row key of the cell to select
 * @param {String} colKeyValue - The column key of the cell to select
 */
export function unsetAriaSelectedOnCell(state, rowKeyValue, colKeyValue) {
    const cell = getCellByKeys(state, rowKeyValue, colKeyValue);
    if (cell) {
        cell.ariaSelected = false;
    }
}

/**
 * Sets `isSelected`, `ariaSelected` to true | false and resolves `classnames`
 * to one which reflects the selected value of the row on the row object.
 * These are used by the template to render the appropriate values.
 *
 * @param {Object} row - The row
 * @param {Boolean} selectedValue - Whether the row is selected
 */
function setRowSelectedAttributes(row, selectedValue) {
    row.ariaSelected = selectedValue;
    row.classnames = `slds-hint-parent${
        selectedValue ? ' slds-is-selected' : ''
    }`;
    row.isSelected = selectedValue;
}

function getSelectedDiff(state, selectedRows) {
    const filtered = [];
    const { selectedRowsKeys } = state;
    for (let i = 0, { length } = selectedRows; i < length; i += 1) {
        const rowKeyValue = selectedRows[i];
        if (!selectedRowsKeys[rowKeyValue]) {
            filtered.push(rowKeyValue);
        }
    }
    return filtered;
}

function getDeselectedDiff(state, value) {
    const filtered = [];
    const { selectedRowsKeys } = state;
    const keys = Object.keys(selectedRowsKeys);
    for (let i = 0, { length } = keys; i < length; i += 1) {
        const rowKeyValue = keys[i];
        if (selectedRowsKeys[rowKeyValue] && !value[rowKeyValue]) {
            filtered.push(rowKeyValue);
        }
    }
    return filtered;
}
