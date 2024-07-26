/**
 * This function returns the initial state of the datatable.
 * The state object is further manipulated while it is passed around by datatable
 *
 * TODO: Check to see if there are other items that need to be added to the default state
 *
 * @returns {Object} Intial state of the datatable
 */
export function getDefaultState() {
    return {
        // columns
        columns: [],
        hadTreeDataTypePreviously: false,
        hideCheckboxColumn: false,
        showActionsMenu: false,
        treeColumn: undefined,

        // rows
        data: [],
        hasCalledUpdateRowsAndCells: false,
        keyField: undefined,
        rows: [],
        checkboxCells: [],
        lookupCells: [],
        shownUrlCells: [],

        // row selection
        selectedRowsKeys: {},
        lastSelectedRowKey: undefined,
        maxRowSelection: undefined,

        hideTableHeader: false,
        wrapTableHeader: 'by-column',

        // indexes:
        headerIndexes: [],
        indexes: {}, // cannot use a Map because they aren't trackable

        // keyboard
        keyboardMode: 'NAVIGATION',
        rowMode: false,
        activeCell: undefined,
        tabindex: 0,
        cellToFocusNext: null,
        cellClicked: false,
        normalized: false,

        // header actions
        wrapTextMaxLines: undefined,

        // sort
        sortedBy: undefined,
        sortedDirection: undefined,
        defaultSortDirection: 'asc',

        // row number
        showRowNumberColumn: false,
        rowNumberOffset: 0,

        // infinite loading
        enableInfiniteLoading: false,
        loadMoreOffset: 20,
        isLoading: false,

        // table render mode
        renderModeInline: false,
        renderModeRoleBased: false,

        // viewport rendering and virtualization
        enableViewportRendering: undefined,
        virtualize: '',
        bufferSize: 5, // number of extra rows rendered on each side outside of viewport
        rowHeight: 30.5,
        renderedRowCount: 0,
        firstVisibleIndex: 0, // first row that should be visible in viewport
        heightCache: {}, // cache of row heights
        offsets: [0],
        offsetRanges: [],
        firstRowOffset: 0, // how many pixels scrollTop is from top of first visible row
        tableHeight: 0,
        shouldResetHeights: false,

        // inline edit
        inlineEdit: {
            rowKeyValue: undefined,
            colKeyValue: undefined,
            columnDef: {},
            dirtyValues: {},
            editedValue: undefined,
            isPanelVisible: false,
            massEditEnabled: false,
            massEditSelectedRows: undefined,
            resolvedAttributeTypes: {},
        },

        // errors
        errors: {
            rows: {},
            table: {},
        },

        // table rendered flag
        hasRenderedFirstTime: false,
    };
}
