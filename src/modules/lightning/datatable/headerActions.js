import { unwrap } from 'lwc';
import { getUserColumnIndex } from './columns';
import { getInternalActions, handleTriggeredAction } from './wrapText';

// Height of a clickable menu item
const ACTION_REM_HEIGHT = 2.125;

// Height of the menu divider, 1 rem + 1px (1/16px)
const DIVIDER_REM_HEIGHT = 1.0625;

/************************** PUBLIC METHODS ***************************/

/**
 * Overrides the actions with the internal ones, plus the customer ones.
 *
 * @param {Object} state The state of the datatable
 */
export function updateHeaderInternalActions(state) {
    const { columns } = state;
    const { length: colCount } = columns;
    for (let colIndex = 0; colIndex < colCount; colIndex += 1) {
        const col = columns[colIndex];
        col.actions.internalActions = getInternalActions(state, col);
    }
}

/**
 * For internal actions, handles triggering the action.
 * Then dispatches the header action event.
 *
 * @param {Event} event
 */
export function handleHeaderActionTriggered(event) {
    event.stopPropagation();

    const { action, actionType, colKeyValue } = event.detail;

    if (actionType !== 'customer') {
        handleTriggeredAction(this, action, colKeyValue);
    }

    dispatchHeaderActionEvent(this, action, colKeyValue);
}

/**
 * Calculates the size and positioning of the header action
 * menu when it is opened.
 *
 * @param {Event} event
 */
export function handleHeaderActionMenuOpening(event) {
    event.stopPropagation();
    event.preventDefault();

    const actionsHeight = event.detail.actionsCount * ACTION_REM_HEIGHT;
    const dividersHeight = event.detail.dividersCount * DIVIDER_REM_HEIGHT;
    const wrapperHeight = 1;
    this._actionsMinHeightStyle = `min-height:${
        actionsHeight + dividersHeight + wrapperHeight
    }rem`;
    event.detail.saveContainerPosition(this.getViewableRect());
}

/**
 * Resets header action menu height when closed.
 */
export function handleHeaderActionMenuClosed() {
    this._actionsMinHeightStyle = '';
}

/************************** PRIVATE METHODS ***************************/

/**
 * Dispatches the `headeraction` event.
 *
 * @param {Object} dt The datatable
 * @param {Object} action The action to dispatch
 * @param {String} colKeyValue The column to dispatch the action on
 */
function dispatchHeaderActionEvent(dt, action, colKeyValue) {
    const userColumnIndex = getUserColumnIndex(dt.state, colKeyValue);
    const customerColumnDefinition = dt.columns[userColumnIndex];

    dt.dispatchEvent(
        new CustomEvent('headeraction', {
            detail: {
                action: unwrap(action),
                columnDefinition: unwrap(customerColumnDefinition),
            },
        })
    );
}
