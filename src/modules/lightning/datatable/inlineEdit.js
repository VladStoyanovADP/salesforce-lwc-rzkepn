import {
    startPositioning,
    stopPositioning,
    Direction as DIRECTION,
} from 'lightning/positionLibrary';
import {
    setFocusActiveCell,
    reactToTabBackward,
    reactToTabForward,
    getActiveCellElement,
    isActiveCellEditable,
    NAVIGATION_DIR,
    getCellElementFromEventTarget,
} from './keyboard';
import { updateRowsAndCells } from './rows';
import { getStateColumnIndex } from './columns';
import { resetErrors } from './errors';
import { setAriaSelectedOnCell, unsetAriaSelectedOnCell } from './rowSelection';
import {
    getCurrentSelectionLength,
    getSelectedRowsKeys,
    isSelectedRow,
} from './rowSelectionShared';
import { isObjectLike } from './utils';
import { hasOwnProperties } from 'lightning/utilsPrivate';
import { getCellByKeys, getUserRowByKey, isValidCell } from './indexes';

const IEDIT_PANEL_SELECTOR = '[data-iedit-panel="true"]';
const HIDE_PANEL_THRESHOLD = 5; // hide panel on scroll

/************************** EVENT HANDLERS **************************/

/**
 * Event handler to open/start the inline edit flows that are triggered by datatable cells
 *
 * @param {CustomEvent} event - An object representing the event that was fired by the datatable cell for
 *                              which to open the inline edit panel. Must be valid and truthy.
 */
export function handleEditCell(event) {
    const cellElement = getCellElementFromEventTarget(event.target);
    openInlineEdit(this, cellElement);
}

/**
 * Handles the completion of inline edit.
 * Closes and destroys the panel and processes completion of the edit
 *
 * @param {CustomEvent} event - `ieditfinished`
 */
export function handleInlineEditFinish(event) {
    stopPanelPositioning(this);
    const { reason, rowKeyValue, colKeyValue } = event.detail;
    processInlineEditFinish(this, reason, rowKeyValue, colKeyValue);
    // Set private draftValues var to new value
    this._draftValues = this.draftValues;
}

/**
 * Sets the `aria-selected` value on the cell based on the checked value
 * If the mass update checkbox is checked, set aria-selected on those cells
 * which are to be updated to true
 * If not, set aria-selected to true on only the cell that is being edited
 */
export function handleMassCheckboxChange(event) {
    const state = this.state;
    if (event.detail.checked) {
        setAriaSelectedOnAllSelectedRows(state);
    } else {
        const { inlineEdit: inlineEditState } = state;
        unsetAriaSelectedOnAllSelectedRows(this.state);
        setAriaSelectedOnCell(
            state,
            inlineEditState.rowKeyValue,
            inlineEditState.colKeyValue
        );
    }
}

/**
 * Handles management of the inline edit panel when user scrolls horizontally or vertically.
 * On either horizontal or vertical scroll:
 *   - If the user scrolls past the pre-determined threshold,
 *     hide the inline edit panel and process the completion of inline edit.
 *   - If the user scrolls within the pre-determined threshold,
 *     keep the panel open but reposition it to align with the cell
 *
 * @param {Event} event - `scroll`
 * @returns
 */
export function handleInlineEditPanelScroll(event) {
    const { state } = this;
    const { inlineEdit: inlineEditState } = state;
    const { isPanelVisible } = inlineEditState;

    if (!isPanelVisible) {
        return;
    }

    let delta = 0;
    const { target: scroller } = event;

    // When user scrolls vertically.
    if (scroller.classList.contains('slds-scrollable_y')) {
        const scrollY = scroller.scrollTop;
        if (this._lastScrollY == null) {
            this._lastScrollY = scrollY;
        } else {
            delta = Math.abs(this._lastScrollY - scrollY);
        }
    } else {
        // When user scrolls horizontally.
        const scrollX = scroller.scrollLeft;
        if (this._lastScrollX == null) {
            this._lastScrollX = scrollX;
        } else {
            delta = Math.abs(this._lastScrollX - scrollX);
        }
    }

    // If user has scrolled past threshold,
    // reset stored scroll values, hide panel and
    // process inline edit completion
    if (delta > HIDE_PANEL_THRESHOLD) {
        const { rowKeyValue, colKeyValue } = inlineEditState;
        this._lastScrollX = null;
        this._lastScrollY = null;
        stopPanelPositioning(this);
        processInlineEditFinish(this, 'lost-focus', rowKeyValue, colKeyValue);
    } else {
        // we want to keep the panel attached to the cell before
        // reaching the threshold and hiding the panel
        repositionPanel(this);
    }
}

/************************** EVENT DISPATCHER **************************/

/**
 * Dispatches the `cellchange` event with the `draftValues` in the
 * detail object.
 *
 * @param {Object} dt - The datatable instance
 * @param {Object} changes - Object containing cell changes
 */
function dispatchCellChangeEvent(dt, changes) {
    dt.dispatchEvent(
        new CustomEvent('cellchange', {
            detail: {
                draftValues: getResolvedCellChanges(dt.state, changes),
            },
        })
    );
}

/************************** INLINE EDIT STATE MANAGEMENT **************************/

export function isInlineEditTriggered(state) {
    return hasOwnProperties(state.inlineEdit.dirtyValues);
}

export function cancelInlineEdit(dt) {
    const { state, _privateTypes } = dt;
    resetErrors(state);
    state.inlineEdit.dirtyValues = {};
    dt._draftValues = [];
    updateRowsAndCells(state, _privateTypes);
}

export function closeInlineEdit(dt) {
    const { inlineEdit: inlineEditState } = dt.state;

    if (inlineEditState.isPanelVisible) {
        processInlineEditFinish(
            dt,
            'lost-focus',
            inlineEditState.rowKeyValue,
            inlineEditState.colKeyValue
        );
    }
}

/**
 * Handles processing when the datatable has finished an inline edit flow.
 * Evaluates if data from the inline edit panel should be saved or not.
 * Data should be saved
 *   - if inline edit was not canceled by the user and
 *   - if in mass inline edit, the 'Apply' button is clicked (don't save when focus is lost) and
 *   - if the cell being edited is a valid cell
 *
 * If the data should be saved, check that the value has changed or if mass edit is enabled.
 * If so, one or more cells need to reflect the updated value.
 * All changes to the cell(s) (`cellChange`) are stored in the following format:
 * cellChange = {
 *   rowKeyValue1: {
 *     colKeyValue: 'changed value'
 *   },
 *   rowKeyValue2: {
 *     colKeyValue: 'changed value'
 *   }
 * }
 *
 * The above cell changes are used to update state.inlineEdit.dirtyValues.
 * The draft values are retrieved using the cell changes that were gathered here and
 * the `cellchange` event is dispatched passing the draftValues in the detail object.
 *
 * If the user inline edit panel lost focus, the datatable should react accordingly.
 *
 * @param {Object} dt - The datatable instance
 * @param {string} reason - reason to finish the edit; valid reasons are: edit-canceled | lost-focus | tab-pressed | submit-action
 * @param {string} rowKeyValue - row key of the edited cell
 * @param {string} colKeyValue - column key of the edited cell
 */
function processInlineEditFinish(dt, reason, rowKeyValue, colKeyValue) {
    const { state, template, refs } = dt;
    const { inlineEdit: inlineEditState } = state;

    const shouldSaveData =
        isValidCell(state, rowKeyValue, colKeyValue) &&
        reason !== 'edit-canceled' &&
        !(reason === 'lost-focus' && inlineEditState.massEditEnabled);

    if (shouldSaveData) {
        const panel = template.querySelector(IEDIT_PANEL_SELECTOR);
        const isValidEditValue = panel.validity.valid;
        const currentValue = getCellByKeys(
            state,
            rowKeyValue,
            colKeyValue
        ).value;
        const { isMassEditChecked: updateAllSelectedRows, value: editValue } =
            panel;

        if (
            isValidEditValue &&
            (editValue !== currentValue || updateAllSelectedRows)
        ) {
            const changes = {
                [rowKeyValue]: {
                    [colKeyValue]: editValue,
                },
            };
            if (updateAllSelectedRows) {
                const selectedRowsKeys = getSelectedRowsKeys(state);
                for (let i = 0; i < selectedRowsKeys.length; i += 1) {
                    const otherRowKeyValue = selectedRowsKeys[i];
                    changes[otherRowKeyValue] = {
                        [colKeyValue]: editValue,
                    };
                }
            }

            updateDirtyValues(state, changes);
            dispatchCellChangeEvent(dt, changes);

            // TODO: do we need to update all rows in the dt or just the one that was modified?
            updateRowsAndCells(state, dt._privateTypes);
        }
    }

    if (reason !== 'lost-focus') {
        if (reason === 'tab-pressed-next') {
            reactToTabForward(state, template, refs);
        } else if (reason === 'tab-pressed-prev') {
            reactToTabBackward(state, template, refs);
        } else {
            setFocusActiveCell(
                state,
                template,
                refs,
                NAVIGATION_DIR.USE_CURRENT
            );
        }
    }

    unsetAriaSelectedOnAllSelectedRows(state);
    unsetAriaSelectedOnCell(state, rowKeyValue, colKeyValue);

    // Tracked state change.
    inlineEditState.isPanelVisible = false;
}

/************************** INLINE EDIT **************************/

/**
 * Opens the inline edit panel for the given target element/cell. This function is the endpoint of all
 * event-driven open inline edit flows but can also be used to open the inline edit panel in a direct
 * programmatic fashion.
 *
 * - Open and position the inline edit panel relative to the cell it was opened from.
 * - Retrieve and set the required inline edit properties in the state object.
 * - Resolve typeAttributes from the column definition so that it can be passed down to the inline edit panel input
 * - Set aria-selected to `true` on the cell which is being edited
 * - Once the panel is open, set focus on the input element
 *
 * @param {Object} dt - The datatable instance. Must be a truthy and valid datatable reference.
 * @param {Object} target - The LWC component instance (lightning-primitive-cell-factory) representing the cell in the
 *                          datatable for which the inline edit panel is to be opened. Must be a truthy and valid reference.
 */
function openInlineEdit(dt, cellElement) {
    startPanelPositioning(dt, cellElement);

    const { state, template, _privateTypes: types } = dt;
    const { inlineEdit: inlineEditState } = state;

    if (inlineEditState.isPanelVisible) {
        // A special case when we are trying to open a edit but we have one open. (click on another edit while editing)
        // in this case we will need to process the values before re-open the edit panel with the new values or we may lose the edition.
        processInlineEditFinish(
            dt,
            'lost-focus',
            inlineEditState.rowKeyValue,
            inlineEditState.colKeyValue
        );
    }

    const { rowKeyValue } = cellElement.parentElement.dataset;
    const { colKeyValue } = cellElement.dataset;
    const cell = getCellByKeys(state, rowKeyValue, colKeyValue);
    const { colIndex } = cell;
    const col = state.columns[colIndex];

    inlineEditState.isPanelVisible = true;
    inlineEditState.rowKeyValue = rowKeyValue;
    inlineEditState.colKeyValue = colKeyValue;
    inlineEditState.columnDef = col;
    inlineEditState.editedValue = cell.value;
    inlineEditState.massEditSelectedRows = getCurrentSelectionLength(state);
    inlineEditState.massEditEnabled =
        inlineEditState.massEditSelectedRows > 1 &&
        isSelectedRow(state, rowKeyValue);

    const { typeAttributes } = col || {};
    if (typeAttributes) {
        // When the inline edit panel is opened resolve the typeAttributes if available
        // then assign the resolved values to inlineEdit.resolvedTypeAttributes.
        inlineEditState.resolvedTypeAttributes = resolveNestedTypeAttributes(
            state,
            rowKeyValue,
            colIndex,
            types,
            typeAttributes
        );
    }

    setAriaSelectedOnCell(state, rowKeyValue, colKeyValue);

    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
        const panel = template.querySelector(
            'lightning-primitive-datatable-iedit-panel'
        );
        if (!panel.isEditableValid) {
            // if panel can't be edited, cancel edit process
            processInlineEditFinish(
                dt,
                'edit-canceled',
                inlineEditState.rowKeyValue,
                inlineEditState.colKeyValue
            );
        } else {
            // if panel can be edited, focus
            panel.focus();
        }
    }, 0);
}

/**
 * Attempts to open the inline edit panel for the datatable's currently active cell. If the active cell is not
 * editable, then the panel is instead opened for the first editable cell in the table. Used to open inline edit
 * in a direct, programmatic fashion.
 *
 * If there is no data in the table or there are no editable cells in the table then calling this function
 * results in a no-op.
 *
 * @param {Object} dt - The datatable instance. Must be a truthy and valid datatable reference.
 */
export function openInlineEditOnActiveCell(dt) {
    const { state } = dt;
    if (state.data && state.data.length > 0) {
        if (!isActiveCellEditable(state)) {
            const firstEditableCell = getFirstEditableCell(dt);
            if (firstEditableCell) {
                state.activeCell = firstEditableCell;
                setFocusAndOpenInlineEdit(dt);
            }
        } else {
            setFocusAndOpenInlineEdit(dt);
        }
    }
}

/**
 * Async function to await setting focus on an editable cell before opening inline-edit panel
 *
 * @param {Object} dt - The datatable instance
 */
// eslint-disable-next-line @lwc/lwc/no-async-await
async function setFocusAndOpenInlineEdit(dt) {
    const { state, template, refs } = dt;
    await setFocusActiveCell(state, template, refs, NAVIGATION_DIR.USE_CURRENT);
    const cellElement = getActiveCellElement(template, state);
    openInlineEdit(dt, cellElement);
}

/************************** PANEL POSITIONING **************************/

/**
 * Begin positioning the inline edit panel based on the following constraints:
 * Align to the 'top-left' edge of the inline edit panel to the `top-left` edge of the cell
 *
 * `align` refers to the alignment of the inline edit panel
 *   - horizontal - Left -> align left edge of panel
 *   - vertical   - Top  -> align top of panel
 *
 * `targetAlign` refers to the cell against which the panel should be aligned
 *   - horizontal - Left -> align panel to left edge of cell
 *   - vertical   - Top  -> align panel to top of the cell
 *
 * @param {Object} dt - The datatable instance
 * @param {HTMLElement} cellElement - The cell element on which inline edit should open
 */
function startPanelPositioning(dt, cellElement) {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    requestAnimationFrame(() => {
        // we need to discard previous binding otherwise the panel
        // will retain previous alignment
        stopPanelPositioning(dt);

        dt._positionRelationship = startPositioning(dt, {
            target: cellElement,
            element() {
                const panel = dt.template.querySelector(IEDIT_PANEL_SELECTOR);
                return panel.getPositionedElement();
            },
            autoFlip: true,
            align: {
                horizontal: DIRECTION.Left,
                vertical: DIRECTION.Top,
            },
            targetAlign: {
                horizontal: DIRECTION.Left,
                vertical: DIRECTION.Top,
            },
        });
    });
}

function stopPanelPositioning(dt) {
    const { _positionRelationship } = dt;
    if (_positionRelationship) {
        stopPositioning(_positionRelationship);
        dt._positionRelationship = undefined;
    }
}

/**
 * Repositions the inline edit panel. this does not realign the element,
 * so it doesn't fix alignment when size of panel changes
 *
 * @param {Object} dt - The datatable instance
 */
function repositionPanel(dt) {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    requestAnimationFrame(() => {
        const { _positionRelationship } = dt;
        if (_positionRelationship) {
            _positionRelationship.reposition();
        }
    });
}

/************************** DIRTY/UNSAVED VALUES **************************/

/**
 * @param {Object} state - The datatable state
 * @returns {Array} - An array of objects, each object describing the dirty values in the form { colName : dirtyValue }.
 *                   A special key is the { [keyField]: value } pair used to identify the row containing this changed values.
 *                   The returned array will be in the form - [{colName : dirtyValue, ... , [keyField]: value }, {...}, {...}]
 */
export function getDirtyValues(state) {
    return getResolvedCellChanges(state, state.inlineEdit.dirtyValues);
}

/**
 * Sets the dirty values in the datatable.
 *
 * @param {Object} state The datatable state
 * @param {Array} values An untracked array of objects, each object describing the dirty values in the form { colName : dirtyValue }.
 *                      A special key is the { [keyField]: value } pair used to identify the row containing this changed values.
 */
export function setDirtyValues(state, values) {
    const { columns, keyField } = state;
    const dirtyValues = Array.isArray(values) ? values : [];
    const result = {};
    for (let dirtyIndex = 0; dirtyIndex < dirtyValues.length; dirtyIndex += 1) {
        const rowValues = dirtyValues[dirtyIndex];
        const colKeys = Object.keys(rowValues);
        const colChanges = {};
        for (
            let colKeysIndex = 0, { length: colKeysLength } = colKeys;
            colKeysIndex < colKeysLength;
            colKeysIndex += 1
        ) {
            const externalColKeyValue = colKeys[colKeysIndex];
            for (let colIndex = 0; colIndex < columns.length; colIndex += 1) {
                const col = columns[colIndex];
                if (
                    col.columnKey === externalColKeyValue ||
                    (!col.columnKey && col.fieldName === externalColKeyValue)
                ) {
                    colChanges[col.colKeyValue] =
                        rowValues[externalColKeyValue];
                    break;
                }
            }
        }
        delete colChanges[keyField];
        result[rowValues[keyField]] = colChanges;
    }
    state.inlineEdit.dirtyValues = result;
}

/**
 * Updates the dirty values specified in the `changes` object.
 *
 * @param {Object} state - The datatable state
 * @param {Object} changes - An object in the form of { rowKeyValue: { colKeyValue1: value, ..., colKeyValueN: value } ... }
 */
function updateDirtyValues(state, changes) {
    const dirtyValues = state.inlineEdit.dirtyValues;
    const rowKeys = Object.keys(changes);
    for (let rowKeyIndex = 0; rowKeyIndex < rowKeys.length; rowKeyIndex += 1) {
        const rowKeyValue = rowKeys[rowKeyIndex];
        if (!Object.prototype.hasOwnProperty.call(dirtyValues, rowKeyValue)) {
            dirtyValues[rowKeyValue] = {};
        }

        Object.assign(dirtyValues[rowKeyValue], changes[rowKeyValue]);
    }
}

/**
 * Constructs an array of resolved cell changes made via inline edit
 * Each array item consists of an identifier of the row and column in order to locate
 * the cell in which the changes were made
 *
 * It follows this format: [{ <columnName>: "<changes>", <keyField>: "<keyFieldIdentifier>" }]
 * Ex. [{ name: "My changes", id: "2" }]; where column name is 'name' and 'id' is the keyField
 * The keyField can be used to identify the row.
 *
 * @param {Object} state - The datatable state
 * @param {Object} rowChanges - list of cell changes to be resolved
 * @returns {Array} - array containing changes and identifiers of column and row where the changes
 *                    should be applied
 */
function getResolvedCellChanges(state, rowChanges) {
    const { columns, keyField } = state;
    const result = [];
    const changeRowKeys = Object.keys(rowChanges);
    for (
        let changeRowIndex = 0, { length: changeRowCount } = changeRowKeys;
        changeRowIndex < changeRowCount;
        changeRowIndex += 1
    ) {
        const rowKeyValue = changeRowKeys[changeRowIndex];
        const colChanges = rowChanges[rowKeyValue];
        const changeColKeys = Object.keys(colChanges);
        const { length: changeColCount } = changeColKeys;
        if (changeColCount) {
            const cellChanges = {
                // Add identifier for which row has change
                [keyField]: rowKeyValue,
            };
            // Get the changes made by column
            for (
                let changeColIndex = 0;
                changeColIndex < changeColCount;
                changeColIndex += 1
            ) {
                const colKeyValue = changeColKeys[changeColIndex];
                const colIndex = getStateColumnIndex(state, colKeyValue);
                if (colIndex !== -1) {
                    const { name: colName } = columns[colIndex];
                    cellChanges[colName] = colChanges[colKeyValue];
                }
            }
            result.push(cellChanges);
        }
    }
    return result;
}

/************************** TYPE ATTRIBUTES RESOLUTION **************************/

/**
 * Returns the resolved typeAttributes
 *
 * @param {Object} state - The datatable state
 * @param {String} rowKeyValue - The row key
 * @param {Number} colIndex - The column index
 * @param {Object} types - The type handling factory
 * @param {Object} typeAttributes - values of typeAttributes from column definition
 *
 * @returns {Object} The resolved typeAttributes.
 */
export function resolveNestedTypeAttributes(
    state,
    rowKeyValue,
    colIndex,
    types,
    typeAttributes
) {
    const col = state.columns[colIndex];
    const typeDesc = typeAttributes && types.getType(col.type);
    const attributeNames = typeDesc && typeDesc.typeAttributes;
    // Check if attrValue and typeAttributes are available.
    if (attributeNames) {
        const resolvedTypeAttributes = {};
        const { length: attributeNamesLength } = attributeNames;
        const _rowData = attributeNamesLength
            ? getUserRowByKey(state, rowKeyValue)
            : undefined;
        if (_rowData) {
            // We only want to resolve typeAttributes based on the custom types configuration
            // If the attribute is not in that configuration, the value of attrValue
            // for that will be undefined. This behavior is consistent with view cell.
            for (let i = 0; i < attributeNamesLength; i += 1) {
                const attrName = attributeNames[i];
                const attrValue = typeAttributes[attrName];
                if (attrValue) {
                    resolvedTypeAttributes[attrName] =
                        resolveNestedTypeAttributesHelper(_rowData, attrValue);
                }
            }
        }
        return resolvedTypeAttributes;
    }
    return typeAttributes;
}

/**
 * Helper function to recursively traverse and resolve the nested attrValue object.
 * For example, resolve {
 *     editTypeAttributes: {
 *         value: {
 *             fieldName: 'name'
 *         }
 *     }
 * }
 * to be ...
 * {
 *     editTypeAttributes: {
 *         value: 'resolvedValue'
 *     }
 * }
 */
function resolveNestedTypeAttributesHelper(rowData, attrValue) {
    let resolvedTypeAttributes = {};
    if (!isObjectLike(attrValue)) {
        // Primitive value.
        // For example, if the typeAttributes is { count: 5},
        // 5 will be the attrValue passed in to the function.
        // nothing needs to be resolved, just return it.
        return attrValue === undefined ? resolvedTypeAttributes : attrValue;
    }
    const typeAttributesNames = Object.keys(attrValue);
    for (let i = 0, { length } = typeAttributesNames; i < length; i += 1) {
        const name = typeAttributesNames[i];
        const value = attrValue[name];
        if (value !== undefined) {
            // since resolveNestedTypeAttributes will be creating the top level attribute
            // and we  resolve values while creating the new object, the attrValue passed in
            // could be something like {fieldName: 'someField'}.
            // For example, if the typeAttributes is { targetName: {fieldName: 'name'}},
            // {fieldName: 'name'} will be the attrValue passed in to the function,
            // so we need to check if key is 'fieldName' or not and resolve it immediately.
            if (name === 'fieldName') {
                resolvedTypeAttributes = rowData[value];
            } else if (isObjectLike(value)) {
                // This is the case when attrValue is something like {label: {fieldName: 'name'}}.
                // It's an object but the value maps a field name
                const { fieldName } = value;
                if (fieldName) {
                    resolvedTypeAttributes[name] = rowData[fieldName];
                } else {
                    // Nested object case, need to recursively resolve it.
                    // For example, { targetName: {value: {fieldName: 'name'}}}}.
                    resolvedTypeAttributes[name] =
                        resolveNestedTypeAttributesHelper(rowData, value);
                }
            } else {
                // Primitive value
                resolvedTypeAttributes[name] = value;
            }
        }
    }

    return resolvedTypeAttributes;
}

/************************** HELPER FUNCTIONS **************************/

/**
 * Returns the row and column keys of the first editable cell in the table.
 * If no editable cells exist in the table then undefined is returned.
 *
 * @param {Object} dt - The datatable instance. Must be a truthy and valid datatable reference.
 */
function getFirstEditableCell(dt) {
    const { state } = dt;
    const { columns } = state;
    const editableColumns = [];
    for (let i = 0, { length } = columns; i < length; i += 1) {
        const col = columns[i];
        if (col.editable) {
            editableColumns.push(col);
        }
    }
    const { length: editableColumnsLength } = editableColumns;
    if (editableColumnsLength > 0) {
        const { rows } = state;
        for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
            const row = rows[rowIndex];
            const { key: rowKeyValue } = row;
            for (let i = 0; i < editableColumnsLength; i += 1) {
                // Loop through the editable columns in order and examine the
                // corresponding cells in the current row for editability,
                // returning the first such cell that is editable.
                const { colKeyValue } = editableColumns[i];
                const cell = getCellByKeys(state, rowKeyValue, colKeyValue);
                if (cell && cell.editable) {
                    return cell;
                }
            }
        }
    }

    return undefined;
}

/**
 * Sets `aria-selected` to true on cells whose rows are selected
 * and are in the same column as the cell being currently edited
 *
 * @param {Object} state - datatable's state object
 */
function setAriaSelectedOnAllSelectedRows(state) {
    const { colKeyValue } = state.inlineEdit;
    const { selectedRowsKeys } = state;
    const keys = Object.keys(selectedRowsKeys);
    for (let i = 0, { length } = keys; i < length; i += 1) {
        const rowKeyValue = keys[i];
        if (selectedRowsKeys[rowKeyValue]) {
            setAriaSelectedOnCell(state, rowKeyValue, colKeyValue);
        }
    }
}

/**
 * Sets `aria-selected` to false on cells whose rows are selected
 * and are in the same column as the cell being currently edited
 *
 * @param {Object} state - datatable's state object
 */
function unsetAriaSelectedOnAllSelectedRows(state) {
    const { colKeyValue } = state.inlineEdit;
    const { selectedRowsKeys } = state;
    const keys = Object.keys(selectedRowsKeys);
    for (let i = 0, { length } = keys; i < length; i += 1) {
        const rowKeyValue = keys[i];
        if (selectedRowsKeys[rowKeyValue]) {
            unsetAriaSelectedOnCell(state, rowKeyValue, colKeyValue);
        }
    }
}
