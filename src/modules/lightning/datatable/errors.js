/**
 * Sets row-level and table-level errors in datatable state object.
 * Errors being set here overwrite the previous error object in the state.
 *
 * @param {Object} state - The untracked datatable state
 */
export function setErrors(state, errors) {
    state.errors = Object.assign(
        {
            rows: {},
            table: {},
        },
        errors
    );
}

/**
 * Resets row-level and table-level errors in datatable state object.
 *
 * @param {Object} state - The datatable state
 */
export function resetErrors(state) {
    state.errors = {
        rows: {},
        table: {},
    };
}
