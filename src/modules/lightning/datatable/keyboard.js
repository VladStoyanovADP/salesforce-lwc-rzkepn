import {
    getShadowActiveElements,
    isRTL,
    keyCodes,
} from 'lightning/utilsPrivate';
import {
    getCellByKeys,
    getCellFromIndexes,
    HEADER_ROW_KEY,
    isValidCell,
} from './indexes';
import { fireRowToggleEvent } from './tree';
import { findFirstVisibleIndex } from './virtualization';
import { getColDataSelector, getRowDataSelector, getScrollerY } from './utils';

// SLDS Class for Focus
export const FOCUS_CLASS = 'slds-has-focus';

// Keyboard Navigation Modes
export const KEYBOARD_NAVIGATION_MODE = 'NAVIGATION';
export const KEYBOARD_ACTION_MODE = 'ACTION';

// Pixel Values
const TOP_MARGIN = 80;
const BOTTOM_MARGIN = 80;
const SCROLL_OFFSET = 20;

// Key Code Values
const ARROW_RIGHT = 39;
const ARROW_LEFT = 37;
const ARROW_DOWN = 40;
const ARROW_UP = 38;
const ENTER = 13;
const ESCAPE = 27;
const TAB = 9;
const SPACE = 32;

// Navigation Direction
export const NAVIGATION_DIR = isRTL()
    ? {
          RIGHT: -1,
          LEFT: 1,
          USE_CURRENT: 0,
          RESET: 2,
          TAB_FORWARD: -1,
          TAB_BACKWARD: 1,
      }
    : {
          RIGHT: 1,
          LEFT: -1,
          USE_CURRENT: 0,
          RESET: 2,
          TAB_FORWARD: 1,
          TAB_BACKWARD: -1,
      };

/***************************** KEYDOWN HANDLERS *****************************/

/**
 * Handler for the `privatecellkeydown` event that is fired by
 * lightning-primitive-datatable-cell.
 * This component is extended by primitive-cell-factory, primitive-cell-checkbox
 * and primitive-header-factory.
 *
 * Typically this handler is invoked when the user is in ACTION mode and the
 * user keys down on a cell that contains actionable items (ex. edit button, links,
 * email, buttons).
 *
 * @param {Event} event Custom DOM event (privatecellkeydown) sent by the cell
 */
export function handleKeydownOnCell(event) {
    event.stopPropagation();
    reactToKeyboardInActionMode(this, event);
}

/**
 * Handler for keydown on the <table> element or the corresponding [role="grid"]
 * on the role-based table.
 *
 * This handler is invoked whenever a keydown occurs on the table. However, we
 * only react to the keyboard here if the user is in Navigation mode OR in Action
 * mode when the cell does not have actionable items (like buttons, links etc).
 *
 * The Action mode keydowns are filtered out here. If a keydown occurs on an actionable
 * element, the target element will not be the cell element (td/th, role=gridcell etc).
 * The target element in that case will likely be the components extending
 * primitiveDatatableCell (primitive-cell-factory/primitive-cell-checkbox/primitive-header-factory)
 * Those events are handled by `handleKeydownOnCell()` and the remaining are
 * handled by this function.
 *
 * @param {Event} event
 */
export function handleKeydownOnTable(event) {
    // Checks if the keydown happened on a cell element and not
    // on an actionable element when in Action Mode.
    if (isCellElement(event.target)) {
        reactToKeyboardInNavMode(this, event);
    }
}

/**
 * Changes the datatable state based on the keyboard event sent from the cell component.
 * The result of those changes may trigger a re-render on the table
 *
 * @param {Object} dt - The datatable instance
 * @param {Event} event Custom DOM event sent by the cell
 * @returns {Object} Mutated state
 */
function reactToKeyboardInActionMode(dt, event) {
    const { refs, state, template } = dt;
    switch (event.detail.keyCode) {
        case ARROW_LEFT:
            reactToArrowLeft(state, template, refs, event);
            break;
        case ARROW_RIGHT:
            reactToArrowRight(state, template, refs, event);
            break;
        case ARROW_UP:
            reactToArrowUp(state, template, refs, event);
            break;
        case ARROW_DOWN:
            reactToArrowDown(state, template, refs, event);
            break;
        case ENTER:
        case SPACE:
            reactToEnter(state, template, refs, event);
            break;
        case ESCAPE:
            reactToEscape(state, template, refs, event);
            break;
        case TAB:
            reactToTab(state, template, refs, event);
            break;
        default:
            break;
    }
}

function reactToKeyboardInNavMode(dt, event) {
    const { refs, state, template } = dt;
    const {
        activeCell: { colKeyValue, rowKeyValue },
    } = state;
    const { keyCode, shiftKey } = event;
    const syntheticEvent = {
        detail: {
            colKeyValue,
            rowKeyValue,
            keyCode,
            shiftKey,
        },
        preventDefault: () => {},
        stopPropagation: () => {},
    };
    // We need event.preventDefault so that actions like arrow up or down
    // does not scroll the table but instead sets focus on the right cells
    switch (event.keyCode) {
        case ARROW_LEFT:
            event.preventDefault();
            reactToArrowLeft(state, template, refs, syntheticEvent);
            break;
        case ARROW_RIGHT:
            event.preventDefault();
            reactToArrowRight(state, template, refs, syntheticEvent);
            break;
        case ARROW_UP:
            event.preventDefault();
            reactToArrowUp(state, template, refs, syntheticEvent);
            break;
        case ARROW_DOWN:
            event.preventDefault();
            reactToArrowDown(state, template, refs, syntheticEvent);
            break;
        case ENTER:
        case SPACE:
            event.preventDefault();
            reactToEnter(state, template, refs, syntheticEvent);
            break;
        case ESCAPE:
            // td, th or div[role=gridcell/rowheader] is the active element in the
            // action mode if cell doesn't have action elements; hence this can be
            // reached and we should react to escape as exiting from action mode
            syntheticEvent.detail.keyEvent = event;
            reactToEscape(state, template, refs, syntheticEvent);
            break;
        case TAB:
            reactToTab(state, template, refs, syntheticEvent);
            break;
        default:
            break;
    }
}

function reactToArrowLeft(state, template, refs, event) {
    const { rowKeyValue, colKeyValue } = event.detail;
    const { colIndex } = getCellByKeys(state, rowKeyValue, colKeyValue);
    // Move from navigation mode to row mode when user
    // arrows left when in nav mode and on the first column
    if (colIndex === 0 && canBeRowNavigationMode(state)) {
        // Tracked state change.
        // Move from cell to row.
        setBlurActiveCell(state, template);
        // Untracked state change.
        setRowNavigationMode(state);
        // Tracked state change.
        setFocusActiveRow(state, template, refs);
    } else {
        const nextColIndex = getNextIndexLeft(state, colIndex);
        if (nextColIndex === undefined) {
            return;
        }
        setBlurActiveCell(state, template);
        // Untracked state change.
        // Update activeCell.
        state.activeCell = getCellByKeys(
            state,
            rowKeyValue,
            state.columns[nextColIndex].colKeyValue
        );
        // Tracked state change.
        setFocusActiveCell(state, template, refs, NAVIGATION_DIR.LEFT);
    }
}

function reactToArrowRight(state, template, refs, event) {
    const { rowKeyValue, colKeyValue } = event.detail;
    const { colIndex } = getCellByKeys(state, rowKeyValue, colKeyValue);
    const nextColIndex = getNextIndexRight(state, colIndex);
    if (nextColIndex === undefined) {
        return;
    }
    setBlurActiveCell(state, template);
    // Untracked state change.
    // Update activeCell.
    state.activeCell = getCellByKeys(
        state,
        rowKeyValue,
        state.columns[nextColIndex].colKeyValue
    );
    setFocusActiveCell(state, template, refs, NAVIGATION_DIR.RIGHT);
}

function reactToArrowUp(state, template, refs, event) {
    const { rowKeyValue, colKeyValue, keyEvent } = event.detail;
    const { rowIndex } = getCellByKeys(state, rowKeyValue, colKeyValue);
    const nextRowIndex = getNextIndexUp(state, rowIndex);
    if (
        nextRowIndex === undefined ||
        (state.hideTableHeader && nextRowIndex === -1)
    ) {
        return;
    }

    if (keyEvent) {
        keyEvent.stopPropagation();
    }
    // Tracked state change.
    setBlurActiveCell(state, template);
    // Untracked state change.
    // Update activeCell.
    state.activeCell = getCellByKeys(
        state,
        nextRowIndex === -1 ? HEADER_ROW_KEY : state.rows[nextRowIndex].key,
        colKeyValue
    );
    // Tracked state change.
    setFocusActiveCell(state, template, refs, NAVIGATION_DIR.USE_CURRENT);
}

function reactToArrowDown(state, template, refs, event) {
    const { rowKeyValue, colKeyValue, keyEvent } = event.detail;
    const { rowIndex } = getCellByKeys(state, rowKeyValue, colKeyValue);
    const nextRowIndex = getNextIndexDown(state, rowIndex);
    if (
        nextRowIndex === undefined ||
        (state.hideTableHeader && nextRowIndex === -1)
    ) {
        return;
    }

    if (keyEvent) {
        keyEvent.stopPropagation();
    }
    // Tracked state change.
    setBlurActiveCell(state, template);
    // Untracked state change.
    // Update activeCell.
    state.activeCell = getCellByKeys(
        state,
        nextRowIndex === -1 ? HEADER_ROW_KEY : state.rows[nextRowIndex].key,
        colKeyValue
    );
    // Tracked state change.
    setFocusActiveCell(state, template, refs, NAVIGATION_DIR.USE_CURRENT);
}

function reactToEnter(state, template, refs, event) {
    if (state.keyboardMode === KEYBOARD_NAVIGATION_MODE) {
        // Untracked state change.
        state.keyboardMode = KEYBOARD_ACTION_MODE;
        const { keyCode, keyEvent } = event.detail;
        const { rowIndex, colIndex } = state.activeCell;
        if (keyEvent) {
            keyEvent.preventDefault();
        }
        const info = { action: undefined };
        if (keyCode === SPACE) {
            info.action = 'space';
        } else if (keyCode === ENTER) {
            info.action = 'enter';
        }
        // Tracked state changes.
        setModeActiveCell(state, template, info);
        updateCellTabIndex(state, rowIndex, colIndex, -1);
    }
}

function reactToEscape(state, template, refs, event) {
    if (state.keyboardMode === KEYBOARD_ACTION_MODE) {
        // When the table is in action mode this event shouldn't bubble
        // because if the table in inside a modal it should prevent the modal closes
        event.detail.keyEvent.stopPropagation();
        // Untracked state change.
        state.keyboardMode = KEYBOARD_NAVIGATION_MODE;
        // Tracked state changes.
        setModeActiveCell(state, template);
        setFocusActiveCell(state, template, refs, NAVIGATION_DIR.RESET);
    }
}

function reactToTab(state, template, refs, event) {
    event.preventDefault();
    event.stopPropagation();

    const { detail } = event;
    const direction = getTabDirection(detail.shiftKey);
    const isExitCell = isActiveCellAnExitCell(state, direction);

    // If in ACTION mode.
    if (state.keyboardMode === KEYBOARD_ACTION_MODE) {
        // If not on last or first cell, tab through each cell of the grid.
        if (isExitCell === false) {
            // Prevent default key event in action mode when actually moving within the grid.
            const { keyEvent } = detail;
            if (keyEvent) {
                keyEvent.preventDefault();
            }
            // Tab in proper direction based on shift key press.
            if (direction === 'BACKWARD') {
                reactToTabBackward(state, template, refs);
            } else {
                reactToTabForward(state, template, refs);
            }
        } else {
            // Untracked state change.
            // Exit ACTION mode.
            state.keyboardMode = KEYBOARD_NAVIGATION_MODE;
            // Tracked state change.
            setModeActiveCell(state, template);
            // Untracked state change.
            state.isExitingActionMode = true;
        }
    } else {
        // Untracked state change.
        state.isExitingActionMode = true;
    }
}

export function reactToTabForward(state, template, refs) {
    const { nextColIndex, nextRowIndex } = getNextIndexOnTab(state, 'FORWARD');
    // Tracked state change.
    setBlurActiveCell(state, template);
    // Untracked state change.
    // Update activeCell.
    state.activeCell = getCellByKeys(
        state,
        nextRowIndex === -1 ? HEADER_ROW_KEY : state.rows[nextRowIndex].key,
        state.columns[nextColIndex].colKeyValue
    );
    // Tracked state change.
    setFocusActiveCell(state, template, refs, NAVIGATION_DIR.TAB_FORWARD, {
        action: 'tab',
    });
}

export function reactToTabBackward(state, template, refs) {
    const { nextColIndex, nextRowIndex } = getNextIndexOnTab(state, 'BACKWARD');
    // Tracked state change.
    setBlurActiveCell(state, template);
    // Untracked state change.
    // Update activeCell.
    state.activeCell = getCellByKeys(
        state,
        nextRowIndex === -1 ? HEADER_ROW_KEY : state.rows[nextRowIndex].key,
        state.columns[nextColIndex].colKeyValue
    );
    // Tracked state change.
    setFocusActiveCell(state, template, refs, NAVIGATION_DIR.TAB_BACKWARD, {
        action: 'tab',
    });
}

function getTabDirection(shiftKey) {
    return shiftKey ? 'BACKWARD' : 'FORWARD';
}

/**
 * Retrieve the next index values for row & column when tab is pressed
 * @param {Object} state - datatable state
 * @param {String} direction - 'FORWARD' or 'BACKWARD'
 * @returns {Object} - nextRowIndex, nextColIndex values, isExitCell boolean
 */
function getNextIndexOnTab(state, direction = 'FORWARD') {
    const { rowIndex, colIndex } = state.activeCell;
    // decide which function to use based on the value of direction
    return direction === 'BACKWARD'
        ? getNextIndexOnTabBackward(state, rowIndex, colIndex)
        : getNextIndexOnTabForward(state, rowIndex, colIndex);
}

function getNextIndexOnTabForward(state, rowIndex, colIndex) {
    const columnsCount = state.columns.length;
    if (columnsCount > colIndex + 1) {
        return {
            nextRowIndex: rowIndex,
            nextColIndex: colIndex + 1,
        };
    }
    return {
        nextRowIndex: getNextIndexDownWrapped(state, rowIndex),
        nextColIndex: 0,
    };
}

function getNextIndexOnTabBackward(state, rowIndex, colIndex) {
    const columnsCount = state.columns.length;
    if (colIndex > 0) {
        return {
            nextRowIndex: rowIndex,
            nextColIndex: colIndex - 1,
        };
    }
    return {
        nextRowIndex: getNextIndexUpWrapped(state, rowIndex),
        nextColIndex: columnsCount - 1,
    };
}

/**
 * This set of keyboard actions is specific to tree-grid.
 *
 * When the user first tabs into the tree-grid, the user is set in row mode
 * and the entire row is highlighted.
 *
 * Keyboard Interaction Model:
 *  Arrow Up: Moves focus to the row above
 *  Arrow Down: Moves focus to the row below
 *  Arrow Right: Expands the row to reveal nested items if any
 *               Pressing the right arrow again will set focus on a cell
 *               and will remove the user from row mode and place them in navigation mode
 *  Arrow Left: If cell is expanded, this will collapse the expanded row
 *
 * @param {Object} dt - The datatable instance
 * @param {Object} event - The keydown event
 * @returns Mutated state
 */
export function reactToKeyboardOnRow(dt, event) {
    const { refs, state, template } = dt;
    // TODO: Adapt this selector to also work in a role-based table once tree-grid is also migrated
    const { localName } = event.target;
    if (
        localName &&
        localName.indexOf('tr') !== -1 &&
        isRowNavigationMode(state)
    ) {
        switch (event.detail.keyCode) {
            case ARROW_LEFT:
                reactToArrowLeftOnRow(dt, state, template, refs, event);
                break;
            case ARROW_RIGHT:
                reactToArrowRightOnRow(dt, state, template, refs, event);
                break;
            case ARROW_UP:
                reactToArrowUpOnRow(state, template, refs, event);
                break;
            case ARROW_DOWN:
                reactToArrowDownOnRow(state, template, refs, event);
                break;
            default:
                break;
        }
    }
}

function reactToArrowLeftOnRow(dt, state, template, refs, event) {
    const { rowKeyValue, rowHasChildren, rowExpanded, rowLevel } = event.detail;
    // Check if row needs to be collapsed.
    // If not, go to parent and focus there.
    if (rowHasChildren && rowExpanded) {
        fireRowToggleEvent(dt, rowKeyValue, rowExpanded);
    } else if (rowLevel > 1) {
        const { treeColumn } = state;
        if (treeColumn) {
            const { colKeyValue } = treeColumn;
            const { rowIndex } = getCellByKeys(state, rowKeyValue, colKeyValue);
            const parentIndex = getRowParentIndex(state, rowLevel, rowIndex);
            if (parentIndex !== -1) {
                // Tracked state change.
                setBlurActiveRow(state, template);
                // Untracked state change.
                // Update activeCell for the row.
                state.activeCell = getCellByKeys(
                    state,
                    state.rows[parentIndex].key,
                    colKeyValue
                );
                // Tracked state change.
                setFocusActiveRow(state, template, refs);
            }
        }
    }
}

function reactToArrowRightOnRow(dt, state, template, refs, event) {
    const { rowKeyValue, rowHasChildren, rowExpanded } = event.detail;
    // Check if row needs to be expanded.
    // Expand row if has children and is collapsed.
    // Otherwise, make this.state.rowMode = false.
    // Move tabIndex 0 to first cell in the row and focus there.
    if (rowHasChildren && !rowExpanded) {
        fireRowToggleEvent(dt, rowKeyValue, rowExpanded);
    } else {
        // Tracked state change.
        // Move from row to cell.
        setBlurActiveRow(state, template);
        // Untracked state change.
        unsetRowNavigationMode(state);
        // Tracked state change.
        setFocusActiveCell(state, template, refs, NAVIGATION_DIR.USE_CURRENT);
    }
}

function reactToArrowUpOnRow(state, template, refs, event) {
    // Move tabIndex 0 one row down.
    const { rowKeyValue, keyEvent } = event.detail;
    const { treeColumn } = state;

    keyEvent.stopPropagation();
    keyEvent.preventDefault();

    if (treeColumn) {
        const { colKeyValue } = treeColumn;
        const { rowIndex } = getCellByKeys(state, rowKeyValue, colKeyValue);
        const prevRowIndex = getNextIndexUpWrapped(state, rowIndex);
        if (prevRowIndex !== -1) {
            // Tracked state change.
            setBlurActiveRow(state, template);
            // Untracked state change.
            // Update activeCell for the row.
            state.activeCell = getCellByKeys(
                state,
                state.rows[prevRowIndex].key,
                colKeyValue
            );
            // Tracked state change.
            setFocusActiveRow(state, template, refs);
        }
    }
}

function reactToArrowDownOnRow(state, template, refs, event) {
    // Move tabIndex 0 one row down.
    const { rowKeyValue, keyEvent } = event.detail;
    const { treeColumn } = state;

    keyEvent.stopPropagation();
    keyEvent.preventDefault();

    if (treeColumn) {
        const { colKeyValue } = treeColumn;
        const { rowIndex } = getCellByKeys(state, rowKeyValue, colKeyValue);
        const nextRowIndex = getNextIndexDownWrapped(state, rowIndex);
        if (nextRowIndex !== -1) {
            // Tracked state change.
            setBlurActiveRow(state, template);
            // Untracked state change.
            // Update activeCell for the row.
            state.activeCell = getCellByKeys(
                state,
                state.rows[nextRowIndex].key,
                colKeyValue
            );
            // Tracked state change.
            setFocusActiveRow(state, template, refs);
        }
    }
}

/***************************** ACTIVE CELL *****************************/

function getDefaultActiveCell(state) {
    const { columns } = state;
    const { length: colCount } = columns;
    if (colCount) {
        let colIndex = 0;
        let existCustomerColumn = false;
        for (let i = 0; i < colCount; i += 1) {
            colIndex = i;
            if (columns[i].internal !== true) {
                existCustomerColumn = true;
                break;
            }
        }
        if (!existCustomerColumn) {
            colIndex = 0;
        }
        const { rows } = state;
        return getCellByKeys(
            state,
            rows.length > 0 ? rows[0].key : HEADER_ROW_KEY,
            columns[colIndex].colKeyValue
        );
    }

    return undefined;
}

function setDefaultActiveCell(state) {
    state.activeCell = getDefaultActiveCell(state);
}

/**
 * Given a datatable template and state, returns an LWC component reference that represents
 * the currently active cell in the table.
 *
 * @param {Object} template - The datatable template
 * @param {Object} state - The datatable state
 */
export function getActiveCellElement(template, state) {
    const { activeCell } = state;
    return activeCell
        ? getCellElement(
              template,
              activeCell.rowKeyValue,
              activeCell.colKeyValue
          )
        : undefined;
}

/**
 * Returns if the pair rowKeyValue, colKeyValue are the current activeCell values
 *
 * @param {Object} state - datatable state
 * @param {String} rowKeyValue  - the unique row key value
 * @param {String} colKeyValue {string} - the unique col key value
 * @returns {Boolean} - true if rowKeyValue, colKeyValue are the current activeCell values.
 */
export function isActiveCell(state, rowKeyValue, colKeyValue) {
    const { activeCell } = state;
    if (activeCell) {
        const {
            rowKeyValue: currentRowKeyValue,
            colKeyValue: currentColKeyValue,
        } = activeCell;
        return (
            currentRowKeyValue === rowKeyValue &&
            currentColKeyValue === colKeyValue
        );
    }
    return false;
}

/**
 * It check if in the current (data, columns) the activeCell still valid.
 * When data changed the activeCell could be removed, then we check if there is cellToFocusNext
 * which is calculated from previously focused cell, if so we sync to that
 * If active cell is still valid we keep it the same
 *
 * @param {Object} state - The datatable state
 */
export function syncActiveCell(state) {
    const { activeCell } = state;
    if (!activeCell || !stillValidActiveCell(state)) {
        // Untracked state changes.
        if (activeCell && state.cellToFocusNext) {
            // There is previously focused cell.
            setNextActiveCellFromPrev(state);
        } else {
            // There is no active cell or there is no previously focused cell.
            setDefaultActiveCell(state);
        }
    }
}

/**
 * Sets the next active if there is a previously focused active cell
 * Logic is:
 * if the rowIndex is existing one - cell = (rowIndex, 0)
 * if the rowIndex is > the number of rows (focused was last row or more) = (lastRow, lastColumn)
 * for columns
 * same as above except if the colIndex is > the number of cols (means no data) = set it to null??
 * @param {object} state - datatable state
 */
function setNextActiveCellFromPrev(state) {
    const { rowIndex, colIndex } = state.cellToFocusNext;
    const { columns, rows } = state;
    const { length: rowCount } = rows;
    let nextRowIndex = rowIndex;
    if (nextRowIndex > rowCount - 1) {
        // row index not existing after update to new 5 > 5-1, 6 > 5-1,
        nextRowIndex = rowCount - 1;
    }
    const { length: colCount } = columns;
    let nextColIndex = colIndex;
    if (nextColIndex > colCount - 1) {
        // col index not existing after update to new
        nextColIndex = colCount - 1;
    }
    const nextActiveCell = getCellFromIndexes(
        state,
        nextRowIndex,
        nextColIndex
    );
    // Untracked state changes.
    if (nextActiveCell) {
        state.activeCell = nextActiveCell;
    } else {
        setDefaultActiveCell(state);
    }
    state.keyboardMode = KEYBOARD_NAVIGATION_MODE;
}

/**
 * Check if we're in an escape/exit cell (first or last of grid)
 * @param {Object} state - The datatable state
 * @param {String} direction - 'FORWARD' or 'BACKWARD'
 * @returns {Boolean} - if the current cell is or isn't an exit cell
 */
export function isActiveCellAnExitCell(state, direction) {
    // get next tab index values
    const { rowIndex, colIndex } = state.activeCell;
    const { nextRowIndex, nextColIndex } = getNextIndexOnTab(state, direction);
    // is it an exit cell?
    if (
        // if first cell and moving backward
        (rowIndex === -1 &&
            colIndex === 0 &&
            nextRowIndex !== -1 &&
            nextColIndex !== 0) ||
        // or if last cell and moving forward
        (rowIndex !== -1 && nextRowIndex === -1 && nextColIndex === 0)
    ) {
        return true;
    }

    return false;
}

function setModeActiveCell(state, template, info) {
    const cellElement = getActiveCellElement(template, state);
    const cellElementChild = getCellElementChild(cellElement);
    if (cellElementChild) {
        const { keyboardMode } = state;
        if (typeof cellElementChild.setMode === 'function') {
            cellElementChild.setMode(keyboardMode, info);
        } else {
            // Tracked state change.
            setMode(state.activeCell, cellElementChild, keyboardMode, info);
        }
    }
}

function stillValidActiveCell(state) {
    const { activeCell, indexes } = state;
    if (activeCell) {
        if (activeCell.rowKeyValue === HEADER_ROW_KEY && state.rows.length) {
            const { columns } = state;
            let sortable = false;
            for (let colIndex = 0; colIndex < columns.length; colIndex += 1) {
                if (columns[colIndex].sortable) {
                    sortable = true;
                    break;
                }
            }
            if (!sortable) {
                return false;
            }
        }
        const indexedCell = indexes[activeCell.cellKeyValue];
        // reset activeCell in case the rowIndex changed
        // changed but not the cellKeyValue
        if (indexedCell) {
            state.activeCell = indexedCell;
        }
        return indexedCell !== undefined;
    }
    return false;
}

/***************************** CELL ELEMENT  *****************************/

export function getCellElement(template, rowKeyValue, colKeyValue) {
    const cellElement = template.querySelector(
        `${getRowDataSelector(rowKeyValue)} ${getColDataSelector(colKeyValue)}`
    );
    return cellElement || undefined;
}

export function getCellElementChild(cellElement) {
    const firstElementChild = cellElement
        ? cellElement.firstElementChild
        : undefined;
    /*const localName = firstElementChild ? firstElementChild.localName : '';
    if (localName === 'span') {
        // span wrapper
        const cellDiv = firstElementChild.firstElementChild;
        if (cellDiv && cellDiv.localName === 'div') {
            // cell div
            return cellDiv;
        }
    } else if (localName === 'div') {
        // lightning-primitive-custom-cell
        return firstElementChild.firstElementChild;
    }*/
    // lightning-primitive-cell-factory or checkbox cell span
    return firstElementChild;
}

export function getCellElementFromEventTarget(target) {
    const cellElement = target.closest(
        '[role="gridcell"],[role="columnheader"],[role="rowheader"]'
    );
    return cellElement || undefined;
}

/***************************** PRIMITIVE CELL METHODS *****************************/

function canMoveBackward(cell) {
    return cell.currentInputIndex > 0;
}

function canMoveForward(cell) {
    const { actionableElementsCount } = cell;
    return (
        actionableElementsCount > 1 &&
        cell.currentInputIndex < actionableElementsCount - 1
    );
}

function canMoveLeft(cell) {
    return isRTL() ? canMoveForward(cell) : canMoveBackward(cell);
}

function canMoveRight(cell) {
    return isRTL() ? canMoveBackward(cell) : canMoveForward(cell);
}

function fireCellKeydown(cell, cellElementChild, keyEvent) {
    const { rowKeyValue, colKeyValue } = cell;
    const { keyCode, shiftKey } = keyEvent;

    cellElementChild.dispatchEvent(
        new CustomEvent('privatecellkeydown', {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                rowKeyValue,
                colKeyValue,
                keyCode,
                shiftKey,
                keyEvent,
            },
        })
    );
}

function fireCellFocusByClickEvent(cell, cellElementChild) {
    const { rowKeyValue, colKeyValue } = cell;

    cellElementChild.dispatchEvent(
        new CustomEvent('privatecellfocusedbyclick', {
            bubbles: true,
            composed: true,
            detail: {
                rowKeyValue,
                colKeyValue,
            },
        })
    );
}

export function handlePrimitiveDatatableCellClick(event) {
    const { state } = this;
    const cellElement = state.renderModeInline
        ? getCellElementFromEventTarget(event.target)
        : undefined;

    if (cellElement) {
        const cellElementChild = getCellElementChild(cellElement);
        const cell = getCellByKeys(
            state,
            cellElement.parentElement.dataset.rowKeyValue,
            cellElement.dataset.colKeyValue
        );
        fireCellFocusByClickEvent(cell, cellElementChild);
    }
}

export function handlePrimitiveDatatableCellFocus(event) {
    const { state } = this;
    const cellElement = state.renderModeInline
        ? getCellElementFromEventTarget(event.target)
        : undefined;

    if (cellElement) {
        const cellElementChild = getCellElementChild(cellElement);
        const cell = getCellByKeys(
            this.state,
            cellElement.parentElement.dataset.rowKeyValue,
            cellElement.dataset.colKeyValue
        );
        if (cell.keyboardMode === KEYBOARD_ACTION_MODE) {
            // Tracked state change.
            setFocusToActionableElement(
                cell,
                cellElementChild,
                cell.currentInputIndex
            );
        }
    }
}

export function handlePrimitiveDatatableCellKeydown(event) {
    const { state } = this;
    const { target } = event;
    // Don't continue if clicking on a cell factory
    // Or the outer td/th element and div equivalent
    const cellElement =
        state.renderModeInline &&
        target.tagName !== 'LIGHTNING-PRIMITIVE-CELL-FACTORY' &&
        !target.getAttribute('role')
            ? getCellElementFromEventTarget(event.target)
            : undefined;

    if (cellElement === undefined) {
        return;
    }

    const cellElementChild = getCellElementChild(cellElement);
    const cell = getCellByKeys(
        state,
        cellElement.parentElement.dataset.rowKeyValue,
        cellElement.dataset.colKeyValue
    );
    const { keyboardMode } = cell;
    const { keyCode, shiftKey } = event;

    // if it is in Action mode, then traverse to the next or previous
    // focusable element.
    // if there is no focusable element, or reach outside of the range, then move to
    // previous or next cell.
    if (keyboardMode === KEYBOARD_ACTION_MODE) {
        let passThroughEvent = keyCode !== keyCodes.shift;
        if (keyCode === keyCodes.left) {
            if (canMoveLeft(cell)) {
                // There are still actionable element before the current one
                // move to the previous actionable element.
                event.preventDefault();
                // Tracked state changes.
                if (isRTL()) {
                    moveToNextActionableElement(cell, cellElementChild);
                } else {
                    moveToPrevActionableElement(cell, cellElementChild);
                }
                passThroughEvent = false;
            }
        } else if (keyCode === keyCodes.right) {
            if (canMoveRight(cell)) {
                // There are still actionable element before the current one
                // move to the previous actionable element.
                event.preventDefault();
                // Tracked state changes.
                if (isRTL()) {
                    moveToPrevActionableElement(cell, cellElementChild);
                } else {
                    moveToNextActionableElement(cell, cellElementChild);
                }
                passThroughEvent = false;
            }
        } else if (keyCode === keyCodes.tab) {
            // If in action mode, try to navigate through the element inside.
            // Always prevent the default tab behavior so that the tab will
            // not focus outside of the table.
            if (shiftKey) {
                // Moving backward.
                if (canMoveBackward(cell)) {
                    event.preventDefault();
                    // Tracked state change.
                    moveToPrevActionableElement(cell, cellElementChild);
                    passThroughEvent = false;
                }
            } else {
                // Moving forward.
                // eslint-disable-next-line no-lonely-if
                if (canMoveForward(cell)) {
                    event.preventDefault();
                    // Tracked state change.
                    moveToNextActionableElement(cell, cellElementChild);
                    passThroughEvent = false;
                }
            }
        }
        if (passThroughEvent) {
            fireCellKeydown(cell, cellElementChild, event);
        }
    } else if (keyboardMode === KEYBOARD_NAVIGATION_MODE) {
        // click the header, press enter, it does not go to action mode without this code.
        if (
            keyCode === keyCodes.left ||
            keyCode === keyCodes.right ||
            keyCode === keyCodes.up ||
            keyCode === keyCodes.down ||
            keyCode === keyCodes.enter
        ) {
            fireCellKeydown(cell, cellElementChild, event);
        }
    }
}

function getActionableElements(cellElementChild) {
    const result = Array.from(
        cellElementChild.querySelectorAll('[data-navigation="enable"]')
    );

    const customType = cellElementChild.querySelector(
        'lightning-primitive-custom-cell'
    );

    if (customType) {
        const wrapperActionableElements = customType.getActionableElements();
        wrapperActionableElements.forEach((elem) => result.push(elem));
    }
    return result;
}

function moveToNextActionableElement(cell, cellElementChild) {
    // Tracked state change.
    setFocusToActionableElement(
        cell,
        cellElementChild,
        cell.currentInputIndex + 1
    );
}

function moveToPrevActionableElement(cell, cellElementChild) {
    // Tracked state change.
    setFocusToActionableElement(
        cell,
        cellElementChild,
        cell.currentInputIndex - 1
    );
}

/**
 * method to resetCurrentInputIndex when navigating from cell-to-cell
 * called in navigation or action mode
 *
 * @param {Object} cell - The tracked datatable cell
 * @param {Object} cellElementChild - The cell element child
 * @param {number} direction -1, 1, 2
 * @param {string} incomingMode is the new mode, needed because a cell can be in action mode but new mode being
 * set can be navigation mode
 */
function resetCurrentInputIndex(
    cell,
    cellElementChild,
    direction,
    incomingMode
) {
    // Tracked state changes.
    if (direction === -1) {
        const { length } = getActionableElements(cellElementChild);
        cell.currentInputIndex = length ? length - 1 : 0;
    } else if (direction === 1 || direction === 2) {
        cell.currentInputIndex = 0;
    }
    // when esc is pressed on a cell to enter navigation mode, other cells are still
    // in action mode till we call setMode above. So need to check new incoming mode too if action mode
    // otherwise we try to focus on an inner element with delegatesFocus and tabIndex -1 and
    // it moves focus out of table
    if (
        incomingMode === KEYBOARD_ACTION_MODE &&
        cell.keyboardMode === KEYBOARD_ACTION_MODE
    ) {
        // Tracked state change.
        setFocusToActionableElement(
            cell,
            cellElementChild,
            cell.currentInputIndex
        );
    }
}

function setFocusToActionableElement(cell, cellElementChild, activeInputIndex) {
    const actionableElements = getActionableElements(cellElementChild);
    const { length: actionableElementsLength } = actionableElements;
    // Tracked state changes.
    cell.actionableElementsCount = actionableElementsLength;
    if (actionableElementsLength) {
        if (
            activeInputIndex > 0 &&
            activeInputIndex < actionableElementsLength
        ) {
            // try to locate to the previous active index of previous row.
            actionableElements[activeInputIndex].focus();
            cell.currentInputIndex = activeInputIndex;
        } else {
            actionableElements[0].focus();
            cell.currentInputIndex = 0;
        }
    }
    // TODO: Fire event back to the datatable, so that the activeInputIndex can be
    // stored in the datatable level state.  So that when user use up and down arrow to
    // navigate through the datatable in ACTION mode, we can remember the active input position
}

function setMode(cell, cellElementChild, keyboardMode, info) {
    const normalizedInfo = info || { action: 'none' };
    // Tracked state changes.
    cell.keyboardMode = keyboardMode;
    if (keyboardMode === KEYBOARD_ACTION_MODE) {
        cell.internalTabIndex = 0;
        // focus without changing tabIndex doesn't work W-6185168
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            setFocusToActionableElement(
                cell,
                cellElementChild,
                cell.currentInputIndex
            );
        }, 0);

        const actionableElements = getActionableElements(cellElementChild);
        const { length: actionableElementsLength } = actionableElements;

        // check if we have an edit button first (tab should open the inline edit)
        if (normalizedInfo.action === 'tab') {
            for (let i = 0; i < actionableElementsLength; i += 1) {
                const elem = actionableElements[i];
                if (elem.getAttribute('data-action-edit')) {
                    elem.click();
                    break;
                }
            }
        } else if (actionableElementsLength === 1) {
            const elem = actionableElements[0];
            const defaultActions =
                elem.getAttribute('data-action-triggers') || '';
            if (defaultActions.indexOf(normalizedInfo.action) !== -1) {
                elem.click();
            }
        }
    } else {
        cell.internalTabIndex = -1;
    }
}

/***************************** FOCUS MANAGEMENT *****************************/

/**
 * It set the focus to the current activeCell, this operation imply multiple changes
 * - update the tabIndex of the activeCell
 * - set the current keyboard mode
 * - set the focus to the cell
 * @param {Object} state - The datatable state
 * @param {Node} template - The custom element template `this.template`
 * @param {Object} refs - The datatable refs
 * @param {Integer} direction - The direction (-1 left, 1 right and 0 for no direction) its used to know which actionable element to activate.
 * @param {Object} info - Extra information when setting the cell mode; currently only set when pressing tab
 * @param {Boolean} [shouldScroll = true] - Whether scrollTop should be adjusted when setting focus
 */
export function setFocusActiveCell(
    state,
    template,
    refs,
    direction,
    info,
    shouldScroll = true
) {
    const { keyboardMode } = state;
    const { rowIndex, colIndex } = state.activeCell;
    let cellElement = getActiveCellElement(template, state);

    state.activeCell.hasFocus = !(info && isActiveCellValid(state));

    updateCellTabIndex(state, rowIndex, colIndex);

    // if the cell wasn't found, but does exist in the table, scroll to where it should be
    if (shouldScroll && !cellElement && isActiveCellValid(state)) {
        scrollToCell(state, template, refs, rowIndex);
    }

    const rowKeyValue =
        cellElement && cellElement.parentElement.dataset.rowKeyValue;

    return new Promise((resolve) => {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            // reset cell element if falsy or no longer valid
            if (
                !cellElement ||
                !isValidCell(
                    state,
                    rowKeyValue,
                    cellElement.dataset.colKeyValue
                )
            ) {
                cellElement = getActiveCellElement(template, state);
            }
            if (cellElement) {
                const cellElementChild = getCellElementChild(cellElement);
                const { activeCell } = state;
                if (cellElementChild) {
                    if (direction) {
                        if (
                            typeof cellElementChild.resetCurrentInputIndex ===
                            'function'
                        ) {
                            cellElementChild.resetCurrentInputIndex(
                                direction,
                                keyboardMode
                            );
                        } else {
                            resetCurrentInputIndex(
                                activeCell,
                                cellElement,
                                direction,
                                keyboardMode
                            );
                        }
                    }
                    if (typeof cellElementChild.addFocusStyles === 'function') {
                        cellElementChild.addFocusStyles();
                    }
                }
                cellElement.classList.add(FOCUS_CLASS);
                // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#parameters
                cellElement.focus({ preventScroll: !shouldScroll });
                if (cellElementChild) {
                    if (typeof cellElementChild.setMode === 'function') {
                        cellElementChild.setMode(keyboardMode, info);
                    } else {
                        setMode(
                            activeCell,
                            cellElementChild,
                            keyboardMode,
                            info
                        );
                    }
                }
                if (shouldScroll) {
                    // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView#parameters
                    cellElement.scrollIntoView({
                        block: 'nearest',
                        inline: 'nearest',
                    });
                }
            }
            resolve();
        }, 0);
    });
}

/**
 * It blur to the current activeCell, this operation imply multiple changes
 * - blur the activeCell
 * - update the tabIndex to -1
 * @param {Object} state - The datatable state
 * @param {Node} template - The custom element root `this.template`
 */
export function setBlurActiveCell(state, template) {
    const { activeCell } = state;
    if (activeCell) {
        const { rowIndex, colIndex } = activeCell;
        state.activeCell.hasFocus = false;
        let cellElement = getActiveCellElement(template, state);
        const rowKeyValue =
            cellElement && cellElement.parentElement.dataset.rowKeyValue;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            // check cellElement; value may have changed
            if (
                !cellElement ||
                !isValidCell(
                    state,
                    rowKeyValue,
                    cellElement.dataset.colKeyValue
                )
            ) {
                cellElement = getActiveCellElement(template, state);
            }
            if (cellElement) {
                const { activeElement } = document;
                const cellElementChild = getCellElementChild(cellElement);
                if (cellElementChild) {
                    if (
                        typeof cellElementChild.removeFocusStyles === 'function'
                    ) {
                        if (activeElement === cellElementChild) {
                            cellElementChild.blur();
                        }
                        cellElementChild.removeFocusStyles(true);
                    } else {
                        state.activeCell.internalTabIndex = -1;
                        if (cellElement.contains(activeElement)) {
                            cellElement.blur();
                        }
                    }
                }
                cellElement.classList.remove(FOCUS_CLASS);
            }
        }, 0);
        updateCellTabIndex(state, rowIndex, colIndex, -1);
    }
}

/**
 * Sets the row and col index of cell to focus next if
 * there is state.activecell
 * datatable has focus
 * there is state.indexes
 * there is no  previously set state.cellToFocusNext
 * Indexes are calculated as to what to focus on next
 * @param {Object} state - The datatable state
 * @param {Object} template - The datatable element
 */
export function setCellToFocusFromPrev(state, template) {
    const { activeCell } = state;
    if (
        activeCell &&
        !state.cellToFocusNext &&
        datatableHasFocus(state, template)
    ) {
        const { length: rowCount } = state.rows;
        const lastIndex = rowCount - 1;
        const { length: colCount } = state.columns;
        let { rowIndex, colIndex } = activeCell;
        colIndex = 0; // default point to the first column
        if (rowIndex === lastIndex) {
            // if it is last row, make it point to its previous row
            rowIndex = lastIndex;
            colIndex = colCount ? colCount - 1 : 0;
        }
        // Untracked state change.
        state.cellToFocusNext = {
            rowIndex,
            colIndex,
        };
    }
}

/**
 * If the current new active still is valid (exists) then set the celltofocusnext to null.
 * @param {Object} state - The datatable state
 */
export function updateCellToFocusFromPrev(state) {
    if (
        state.activeCell &&
        state.cellToFocusNext &&
        stillValidActiveCell(state)
    ) {
        // If the previous focus is there and valid,  don't set the prevActiveFocusedCell.
        state.cellToFocusNext = null;
    }
}

/**
 * It adds and the focus classes to the th/td or div[role=gridcell/rowheader].
 *
 * @param {Object} state - The datatable state
 * @param {Node} template - The custom element template `this.template`
 */
export function addFocusStylesToActiveCell(state, template) {
    state.activeCell.hasFocus = true;
    const cellElement = getActiveCellElement(template, state);
    if (cellElement) {
        cellElement.classList.add(FOCUS_CLASS);
    }
}

/**
 * It set the focus to the row of current activeCell, this operation implies multiple changes
 * - update the tabIndex of the activeCell
 * - set the current keyboard mode
 * - set the focus to the row
 *
 * @param {Object} state - The datatable state
 * @param {Node} template - the custom element root `this.template`
 * @param {Object} refs - The datatable refs
 */
function setFocusActiveRow(state, template, refs) {
    const { rowIndex } = state.activeCell;
    const rowElement = getActiveCellRowElement(template, state);

    updateRowTabIndex(state, rowIndex);
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
        rowElement.focus({ preventScroll: true });
        updateScrollTop(state, template, refs, rowElement);
    }, 0);
}

/**
 * It blurs the active row, this operation implies multiple changes
 * - blur the active row
 * - update the tabIndex to -1
 * @param {Object} state - The datatable state
 * @param {Node} template - The custom element root `this.template`
 */
function setBlurActiveRow(state, template) {
    const { activeCell } = state;
    if (activeCell) {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            const rowElement = getActiveCellRowElement(template, state);
            if (document.activeElement === rowElement) {
                rowElement.blur();
            }
        }, 0);
        updateRowTabIndex(state, activeCell.rowIndex, -1);
    }
}

/**
 * This method is needed in IE11 where clicking on the cell (factory) makes the div or the span active element
 * It refocuses on the cell element td or th or div[role=gridcell/rowheader]
 * @param {Object} state - The datatable state
 * @param {Object} template - The datatable element
 * @param {Boolean} needsRefocusOnCellElement - flag indicating whether or not to refocus on the cell td/th or div[role=gridcell/rowheader]
 */
export function refocusCellElement(state, template, needsRefocusOnCellElement) {
    if (needsRefocusOnCellElement) {
        const cellElement = getActiveCellElement(template, state);
        if (cellElement) {
            cellElement.focus();
        }

        // setTimeout so that focusin happens and then we set state.cellClicked to true
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            setCellClickedForFocus(state);
        }, 0);
    } else if (!datatableHasFocus(state, template)) {
        setCellClickedForFocus(state);
    }
}

export function datatableHasFocus(state, template) {
    return state.cellClicked || isFocusInside(template);
}

function isFocusInside(currentTarget) {
    const activeElements = getShadowActiveElements();
    for (let i = 0, { length } = activeElements; i < length; i += 1) {
        if (currentTarget.contains(activeElements[i])) {
            return true;
        }
    }
    return false;
}

export function handleDatatableFocusIn(event) {
    const { state } = this;

    // Untracked state change.
    state.isExitingActionMode = false;

    // workaround for delegatesFocus issue that focusin is called when not supposed to W-6220418
    if (isFocusInside(event.currentTarget)) {
        if (state.activeCell && !state.rowMode) {
            state.activeCell.hasFocus = true;
            const cellElement = getActiveCellElement(this.template, state);
            // we need to check because of the tree,
            // at this point it may remove/change the rows/keys because opening or closing a row.
            if (cellElement) {
                const cellElementChild = getCellElementChild(cellElement);
                if (cellElementChild) {
                    if (typeof cellElementChild.addFocusStyles === 'function') {
                        cellElementChild.addFocusStyles();
                    }
                    cellElement.tabIndex = 0;
                }
                cellElement.classList.add(FOCUS_CLASS);
            }
        }
        resetCellClickedForFocus(state);
    }
}

export function handleDatatableFocusOut(event) {
    const { state } = this;
    const { currentTarget, relatedTarget } = event;
    const containsRelatedTarget =
        relatedTarget && currentTarget.contains(relatedTarget);
    // workarounds for delegatesFocus issues
    if (
        // needed for initial focus where relatedTarget is empty
        !relatedTarget ||
        // needed when clicked outside
        (relatedTarget && !containsRelatedTarget) ||
        // needed when datatable leaves focus and related target is still within datatable W-6185154
        (relatedTarget && containsRelatedTarget && state.isExitingActionMode)
    ) {
        if (state.activeCell && !state.rowMode) {
            const cellElement = getActiveCellElement(this.template, state);
            // we need to check because of the tree,
            // at this point it may remove/change the rows/keys because opening or closing a row.
            if (cellElement) {
                const cellElementChild = getCellElementChild(cellElement);
                if (
                    cellElementChild &&
                    typeof cellElementChild.removeFocusStyles === 'function'
                ) {
                    cellElementChild.removeFocusStyles();
                }
                cellElement.classList.remove(FOCUS_CLASS);
            }
        }
    }
}

/**
 * This is needed to check if datatable has lost focus but cell has been clicked recently
 * @param {Object} state - The datatable state
 */
export function setCellClickedForFocus(state) {
    state.cellClicked = true;
}

/**
 * Once the dt regains focus there is no need to set this
 *  @param {Object} state - The datatable state
 */
function resetCellClickedForFocus(state) {
    state.cellClicked = false;
}

/***************************** TABINDEX MANAGEMENT *****************************/

/**
 * It update the tabIndex value of a cell in the state for the rowIndex, colIndex passed
 * as consequence of this change
 * datatable is gonna re-render the cell affected with the new tabIndex value
 *
 * @param {Object} state - The datatable state
 * @param {number} rowIndex - the row index
 * @param {number} colIndex - the column index
 * @param {number} [tabIndex = 0] - the value for the tabIndex
 */
export function updateCellTabIndex(state, rowIndex, colIndex, tabIndex = 0) {
    if (isHeaderRow(rowIndex)) {
        state.columns[colIndex].tabIndex = tabIndex;
    } else {
        state.rows[rowIndex].cells[colIndex].tabIndex = tabIndex;
    }
}

/**
 * It updates the tabIndex value of a row in the state for the rowIndex passed
 * as consequence of this change
 * datatable is gonna re-render the row affected with the new tabindex value
 *
 * @param {Object} state - The datatable state
 * @param {number} rowIndex - the row index
 * @param {number} [tabIndex = 0] - the value for the tabindex
 */
export function updateRowTabIndex(state, rowIndex, tabIndex = 0) {
    if (!isHeaderRow(rowIndex)) {
        // TODO what to do when rowIndex is header row
        state.rows[rowIndex].tabIndex = tabIndex;
    }
}

/**
 * Updates the tabIndex for the current activeCell.
 *
 * @param {Object} state - The datatable state
 * @param {number} [index = 0] - the value for the tabindex
 */
export function updateTabIndexActiveCell(state, index = 0) {
    if (state.activeCell && !stillValidActiveCell(state)) {
        // Untracked state change.
        syncActiveCell(state);
    }
    // Tracked state change.
    // We need to check again because maybe there is no active cell after sync.
    updateActiveCellTabIndexAfterSync(state, index);
}

/**
 * It updates the tabIndex for the row of the current activeCell.
 * This happens in rowMode of KEYBOARD_NAVIGATION_MODE
 * @param {Object} state - The datatable state
 * @param {number} [index = 0] - the value for the tabindex
 */
export function updateTabIndexActiveRow(state, index = 0) {
    if (state.activeCell && !stillValidActiveCell(state)) {
        // Untracked state change.
        syncActiveCell(state);
    }
    // Tracked state change.
    // We need to check again because maybe there is no active cell after sync.
    updateActiveRowTabIndexAfterSync(state, index);
}

/***************************** INDEX COMPUTATIONS *****************************/

function getNextIndexUp(state, rowIndex) {
    return rowIndex === -1 ? undefined : rowIndex - 1;
}

function getNextIndexDown(state, rowIndex) {
    const rowsCount = state.rows.length;
    return rowIndex + 1 < rowsCount ? rowIndex + 1 : undefined;
}

function getNextColumnIndex(columnsCount, colIndex) {
    return columnsCount > colIndex + 1 ? colIndex + 1 : undefined;
}

function getPrevColumnIndex(colIndex) {
    return colIndex > 0 ? colIndex - 1 : undefined;
}

function getNextIndexRight(state, colIndex) {
    return isRTL()
        ? getPrevColumnIndex(colIndex)
        : getNextColumnIndex(state.columns.length, colIndex);
}

function getNextIndexLeft(state, colIndex) {
    return isRTL()
        ? getNextColumnIndex(state.columns.length, colIndex)
        : getPrevColumnIndex(colIndex);
}

function getNextIndexUpWrapped(state, rowIndex) {
    const { length: rowCount } = state.rows;
    return rowIndex === -1 ? rowCount - 1 : rowIndex - 1;
}

function getNextIndexDownWrapped(state, rowIndex) {
    const { length: rowCount } = state.rows;
    return rowIndex + 1 < rowCount ? rowIndex + 1 : -1;
}

/***************************** ROW NAVIGATION MODE *****************************/

function canBeRowNavigationMode(state) {
    return state.keyboardMode === KEYBOARD_NAVIGATION_MODE && state.treeColumn;
}

function isRowNavigationMode(state) {
    return (
        state.keyboardMode === KEYBOARD_NAVIGATION_MODE &&
        state.rowMode === true
    );
}

function setRowNavigationMode(state) {
    if (state.treeColumn && state.keyboardMode === KEYBOARD_NAVIGATION_MODE) {
        state.rowMode = true;
    }
}

export function unsetRowNavigationMode(state) {
    state.rowMode = false;
}

/**
 * If new set of columns doesn't have tree data, mark it to false, as it
 * could be true earlier
 * Else if it has tree data, check if rowMode is false
 * Earlier it didn't have tree data, set rowMode to true to start
 * if rowMode is false and earlier it has tree data, keep it false
 * if rowMode is true and it has tree data, keep it true
 * @param {Object} state - The state object
 */
export function updateRowNavigationMode(state) {
    if (!state.treeColumn) {
        state.rowMode = false;
    } else if (state.rowMode === false && !state.hadTreeDataTypePreviously) {
        state.rowMode = true;
    }
}

/***************************** HELPER FUNCTIONS *****************************/

export function isCellElement(target) {
    const role = target.getAttribute('role');
    return (
        role === 'gridcell' || role === 'columnheader' || role === 'rowheader'
    );
}

function isHeaderRow(rowIndex) {
    return rowIndex === -1;
}

function getActiveCellRowElement(template, state) {
    let result;
    const { activeCell } = state;
    if (activeCell) {
        result = template.querySelector(
            getRowDataSelector(activeCell.rowKeyValue)
        );
    }
    return result || undefined;
}

export function getRowParentIndex(state, rowLevel, rowIndex) {
    const parentIndex = rowIndex - 1;
    const { rows } = state;
    for (let i = parentIndex; i >= 0; i--) {
        if (rows[i].level === rowLevel - 1) {
            return i;
        }
    }
    return -1;
}

function updateScrollTop(state, template, refs, element) {
    const scrollableY = getScrollerY(template, refs);
    const scrollingParent = scrollableY.parentElement;
    const parentRect = scrollingParent.getBoundingClientRect();
    const findMeRect = element.getBoundingClientRect();
    if (findMeRect.top < parentRect.top + TOP_MARGIN) {
        scrollableY.scrollTop -= SCROLL_OFFSET;
    } else if (findMeRect.bottom > parentRect.bottom - BOTTOM_MARGIN) {
        scrollableY.scrollTop += SCROLL_OFFSET;
    }
    findFirstVisibleIndex(state, scrollableY.scrollTop);
}

function scrollToCell(state, template, refs, rowIndex) {
    const { firstVisibleIndex, bufferSize, renderedRowCount, rowHeight } =
        state;

    let scrollTop = rowIndex * rowHeight;
    if (firstVisibleIndex > rowIndex) {
        const rowsInViewport = renderedRowCount - 2 * bufferSize;
        scrollTop = Math.max(scrollTop - rowsInViewport * rowHeight, 0);
    }

    const scrollableY = getScrollerY(template, refs);
    scrollableY.scrollTop = scrollTop;
    findFirstVisibleIndex(state, scrollTop);
}

export function isActiveCellEditable(state) {
    const { activeCell } = state;
    return activeCell ? activeCell.editable : false;
}

function isActiveCellValid(state) {
    const { activeCell } = state;
    if (activeCell) {
        return isValidCell(
            state,
            activeCell.rowKeyValue,
            activeCell.colKeyValue
        );
    }
    return false;
}

export function updateActiveCellTabIndexAfterSync(state, tabIndex = 0) {
    const { activeCell } = state;
    if (activeCell && !isRowNavigationMode(state)) {
        updateCellTabIndex(
            state,
            activeCell.rowIndex,
            activeCell.colIndex,
            tabIndex
        );
    }
}

export function updateActiveRowTabIndexAfterSync(state, tabIndex = 0) {
    const { activeCell } = state;
    if (activeCell && isRowNavigationMode(state)) {
        updateRowTabIndex(state, activeCell.rowIndex, tabIndex);
    }
}
