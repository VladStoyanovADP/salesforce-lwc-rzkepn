/**
 * Dispatches an event when a row is toggled to be expanded or collapsed.
 *
 * @param {Object} dt - The datatable instance
 * @param {String} rowKeyValue The row key being acted upon
 * @param {Boolean} expanded The current expand/collapse state of the row
 */
export function fireRowToggleEvent(dt, rowKeyValue, expanded) {
    dt.dispatchEvent(
        new CustomEvent('privatetogglecell', {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                name: rowKeyValue,
                nextState: expanded ? false : true, // True = expanded, False = collapsed
            },
        })
    );
}
