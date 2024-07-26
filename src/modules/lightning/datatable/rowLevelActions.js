import { unwrap } from 'lwc';
import { getUserRowByKey } from './indexes';
import { getUserColumnIndex } from './columns';

/**
 * Handles the `privatecellactiontriggered` event on lightning-datatable
 *
 * @param {CustomEvent} event - `privatecellactiontriggered`
 */
export function handleRowActionTriggered(event) {
    event.stopPropagation();

    const { action, rowKeyValue } = event.detail;
    const selectedRow = getUserRowByKey(this.state, rowKeyValue);

    this.dispatchEvent(
        new CustomEvent('rowaction', {
            detail: {
                action: unwrap(action),
                row: unwrap(selectedRow),
            },
        })
    );
}

/**
 * Handles the `privatecellactionmenuopening` event on lightning-datatable
 *
 * @param {CustomEvent} event - `privatecellactionmenuopening`
 */
export function handleLoadDynamicActions(event) {
    event.stopPropagation();

    const {
        actionsProviderFunction,
        doneCallback,
        rowKeyValue,
        saveContainerPosition,
    } = event.detail;
    const selectedRow = getUserRowByKey(this.state, rowKeyValue);

    saveContainerPosition(this.getViewableRect());
    actionsProviderFunction(unwrap(selectedRow), doneCallback);
}

/**
 * Handles the `privatecellbuttonclicked` event on lightning-datatable
 *
 * @param {CustomEvent} event - `privatecellbuttonclicked`
 */
export function handleCellButtonClick(event) {
    event.stopPropagation();

    const { state } = this;
    const { colKeyValue, rowKeyValue } = event.detail;
    const selectedRow = getUserRowByKey(state, rowKeyValue);
    const colIndex = getUserColumnIndex(state, colKeyValue);
    const col = this._rawColumns[colIndex];

    this.dispatchEvent(
        new CustomEvent('rowaction', {
            detail: {
                action: unwrap(col.typeAttributes),
                row: unwrap(selectedRow),
            },
        })
    );
}
