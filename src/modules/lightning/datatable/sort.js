import { assert } from 'lightning/utilsPrivate';

/**
 * Sets the default sort direction. When clicking on a header to sort,
 * the default sort direction is applied first. Clicking again reverses it
 *
 * @param {Object} state The current datatable state
 * @param {String} value The value to update the default sort direction to
 */
export function setDefaultSortDirection(state, value) {
    if (value === 'asc' || value === 'desc') {
        state.defaultSortDirection = value;
        return;
    }
    assert(
        false,
        `The "defaultSortDirection" value passed into lightning:datatable
        is incorrect, "defaultSortDirection" value should be one of
        'asc' or 'desc'.`
    );
}

/**
 * Sets the current sort direction.
 * In the case an invalid sort direction is provided, throw
 * an error providing resolution information. In an error case,
 * `sortedDirection` will be `undefined`
 *
 * @param {Object} state The datatable state
 * @param {String|String[]} value The value or values to update the sort direction to
 */
export function setSortedDirection(state, value) {
    if (typeof value === 'string' && (value === 'asc' || value === 'desc')) {
        state.sortedDirection = value;
    } else if (Array.isArray(value)) {
        // If value is an array, validate each item
        value.forEach((item) => {
            assert(
                item === 'asc' || item === 'desc',
                `The "sortedDirection" value passed into lightning:datatable
                is incorrect. All values should be one of 'asc' or 'desc'.`
            );
        });
        state.sortedDirection = value;
    } else {
        assert(
            false,
            `The "sortedDirection" value passed into lightning:datatable
            is incorrect. It should be either a single value of 'asc' or 'desc'
            or an array of such values.`
        );
    }
}

/**
 * Sets the current sort value. The value should match the name
 * of a given column in the datatable. In the case that a
 * non-string value is provided, the sort value with fallback
 * to `undefined`
 *
 * @param {Object} state The datatable state
 * @param {String|String[]} value The value or values to update the sort state to
 */
export function setSortedBy(state, value) {
    if (typeof value === 'string' || Array.isArray(value)) {
        state.sortedBy = value;
    } else {
        state.sortedBy = undefined;
    }
}

/**
 * Applies sorting to each datatable column
 *
 * @param {Object} state The current datatable state
 */
export function updateSorting(state) {
    const { columns, defaultSortDirection, sortedBy, sortedDirection } = state;

    // Determine if sortedBy is an array
    const isSortedByArray = Array.isArray(sortedBy);

    for (let i = 0, { length } = columns; i < length; i += 1) {
        const col = columns[i];
        if (
            col.sortable &&
            (isSortedByArray
                ? sortedBy.includes(col.name)
                : sortedBy === col.name)
        ) {
            col.sorted = true;
            col.sortAriaLabel =
                sortedDirection === 'desc' ? 'descending' : 'ascending';
            col.sortedDirection = isSortedByArray
                ? sortedDirection[sortedBy.indexOf(col.name)]
                : sortedDirection;

            // If sortedBy is an array, set col.sorted to the index in the array + 1 because
            // 0 index is considered falsely in javascript Otherwise, set it to true
            col.sorted = isSortedByArray
                ? sortedBy.indexOf(col.name) + 1
                : true;
        } else {
            col.sorted = false;
            col.sortAriaLabel = col.sortable ? 'other' : null;
            col.sortedDirection = defaultSortDirection;
        }
    }
}
