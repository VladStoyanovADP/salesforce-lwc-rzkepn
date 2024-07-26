import { LightningElement, api, track, unwrap } from 'lwc';
import divTemplate from './templates/div/div.html';
import tableTemplate from './templates/table/table.html';
import labelAriaLiveActionMode from '@salesforce/label/LightningDatatable.ariaLiveActionMode';
import labelAriaLiveNavigationMode from '@salesforce/label/LightningDatatable.ariaLiveNavigationMode';
import { EVENTS as FORMATTED_LOOKUP_EVENTS } from 'lightning/formattedLookup';
import { generateUniqueId } from 'lightning/inputUtils';
import MultiColumnSortingModal from 'lightning/multiColumnSortingModal';
import {
    getLinkInfo,
    hasLinkProvider,
    updateRawLinkInfo,
} from 'lightning/routingService';
import {
    classSetToString,
    isSafari,
    normalizeBoolean,
    normalizeString,
    synchronizeAttrs,
} from 'lightning/utilsPrivate';
import { LightningDatatableResizeObserver } from './resizeObserver';
import { ColumnWidthManager } from './columnWidthManager';
import { getDefaultState } from './state';
import { setColumns } from './columns';
import {
    getCustomerColumnWidths,
    getResizerDefaultState,
    resizeColumnWithDelta,
    setMaxColumnWidth,
    setMinColumnWidth,
    setResizeColumnDisabled,
    setResizeStep,
    updateColumnWidthsMetadata,
} from './columnResizer';
import { setErrors } from './errors';
import {
    setKeyField,
    recomputeCellStyles,
    updateCells,
    updateCellClassForRoleBasedMode,
    updateRowsAndCells,
} from './rows';
import {
    handleCellButtonClick,
    handleLoadDynamicActions,
    handleRowActionTriggered,
} from './rowLevelActions';
import { setRowNumberOffset } from './rowNumber';
import {
    handleDeselectAllRows,
    handleDeselectRow,
    handleRowSelectionChange,
    handleSelectAllRows,
    handleSelectRow,
    setMaxRowSelection,
    setSelectedRowsKeys,
    syncSelectedRowsKeys,
    updateBulkSelectionState,
} from './rowSelection';
import {
    getCurrentSelectionLength,
    getSelectedRowsKeys,
} from './rowSelectionShared';
import {
    handleHeaderActionMenuClosed,
    handleHeaderActionMenuOpening,
    handleHeaderActionTriggered,
    updateHeaderInternalActions,
} from './headerActions';
import { getCellByKeys, getRowByKey } from './indexes';
import {
    handleLoadMoreCheck,
    handlePrefetch,
    setEnableInfiniteLoading,
    setLoading,
    getLoadMoreOffset,
    setLoadMoreOffset,
} from './infiniteLoading';
import {
    cancelInlineEdit,
    closeInlineEdit,
    getDirtyValues,
    handleEditCell,
    handleInlineEditFinish,
    handleInlineEditPanelScroll,
    handleMassCheckboxChange,
    isInlineEditTriggered,
    openInlineEditOnActiveCell,
    setDirtyValues,
} from './inlineEdit';
import {
    addFocusStylesToActiveCell,
    datatableHasFocus,
    FOCUS_CLASS,
    getActiveCellElement,
    getCellElementChild,
    getCellElementFromEventTarget,
    handleDatatableFocusIn,
    handleDatatableFocusOut,
    handleKeydownOnCell,
    handleKeydownOnTable,
    handlePrimitiveDatatableCellClick,
    handlePrimitiveDatatableCellFocus,
    handlePrimitiveDatatableCellKeydown,
    isActiveCell,
    isCellElement,
    KEYBOARD_ACTION_MODE,
    KEYBOARD_NAVIGATION_MODE,
    reactToKeyboardOnRow,
    refocusCellElement,
    setBlurActiveCell,
    setCellClickedForFocus,
    setCellToFocusFromPrev,
    setFocusActiveCell,
    syncActiveCell,
    unsetRowNavigationMode,
    updateActiveCellTabIndexAfterSync,
    updateCellTabIndex,
    updateCellToFocusFromPrev,
    updateTabIndexActiveCell,
    updateTabIndexActiveRow,
    updateRowNavigationMode,
    updateRowTabIndex,
} from './keyboard';
import { setVirtualize, RenderManager } from './renderManager';
import {
    setDefaultSortDirection,
    setSortedBy,
    setSortedDirection,
    updateSorting,
} from './sort';
import {
    getGridContainerFromScrollerY,
    getScrollerX,
    getScrollerY,
    isLoadMore,
    isObjectLike,
    isRenderModeInline,
    isRenderModeRoleBased,
} from './utils';
import { setWrapTextMaxLines } from './wrapText';
import {
    handleVariableRowHeights,
    resetRowHeights,
    findFirstVisibleIndex,
    addTableHeight,
} from './virtualization';
import DatatableTypes from './types';

const { PrivateLookupItemPickedEvent } = FORMATTED_LOOKUP_EVENTS;

const i18n = {
    ariaLiveNavigationMode: labelAriaLiveNavigationMode,
    ariaLiveActionMode: labelAriaLiveActionMode,
};

/**
 * A table that displays rows and columns of data.
 */
export default class LightningDatatable extends LightningElement {
    /**
     * Usage of State Object vs Private Variable:
     * This is by no means a definitive set of rules and we should add/modify these
     * guidelines with time as we work on the datatable and find specific reasons.
     *
     * In general, the main reason for using the `state` object is to take advantage
     * of LWC's reactivity. In the `state` object we store properties that are required
     * to trigger an update/re-render of the datatable.
     *
     * There are no observable perf implications of using the state object vs
     * private variables. See W-10006095 for details.
     *
     * Guidelines:
     *     1. If possible, avoid adding properties to the state object if it does not
     *        trigger an update or re-render of the datatable.
     *     2. You may look to add properties to the state object if that property is
     *        required in different areas of the datatable and/or if not adding to the
     *        state will significantly add to the complexity of the component.
     *     3. Goal: Breakdown the 'state' object - Right now the state object contains a
     *        lot of metadata and we pass around the monolith everywhere even when most
     *        of the information is not required. If you have the opportunity, look to
     *        separate or break down the state object even if that means adding a new
     *        tracked object. This will help us logically separate various modules over
     *        time and pass around only necessary information leading to cleaner,
     *        more readable and organized code.
     */

    // Tracked Objects
    @track state = getDefaultState();
    @track widthsData = getResizerDefaultState();

    // Private Variables
    _actionsMinHeightStyle = ''; // Min height required while actions menu is opened
    _checkboxColumnHeaderId = null;
    _columnWidthManager;
    _customerSelectedRows = null;
    _datatableId = generateUniqueId('lgt-datatable');
    _draftValues = [];
    _isResizing = false; // Whether resizing is in progress
    _lastRenderedRow = null; // last rendered row, used for UTAM
    _positionRelationship;
    _privateTypes = {};
    _rawColumns = [];
    _renderConfig;
    _renderManager;
    _renderMode = 'default';
    _renderedTemplate = tableTemplate;
    _shouldResetFocus = false; // used to ensure focus isn't lost from changes in renderedRows
    _suppressBottomBar = false;
    _widthObserver; // Instance of LightningDatatableResizeObserver
    _hasSetInitialCustomTypes = false;
    _shouldResetCustomTypes = false;
    _headerHeight = '';
    _recalculateHeaderHeight = false;

    /************************* PUBLIC PROPERTIES *************************/

    /**
     * Public property for passing `aria-label` down to the child table element.
     */
    @api ariaLabel = null;

    /**
     * Public property for passing `aria-labelledby` down to the child table element.
     */
    @api ariaLabelledBy = null;

    /**
     * Public property for passing `aria-describedby` down to the child table element.
     */
    ariaDescribedBy = null;

    /**
     * Specifies how column widths are calculated. Set to 'fixed' for columns with equal widths.
     * Set to 'auto' for column widths that are based on the width of the column content and the table width. The default is 'fixed'.
     * @type {String}
     * @default fixed
     */
    @api
    get columnWidthsMode() {
        return this.widthsData.columnWidthsMode;
    }

    set columnWidthsMode(value) {
        const { widthsData } = this;
        const normalizedValue = normalizeString(value, {
            fallbackValue: 'fixed',
            validValues: ['fixed', 'auto'],
        });
        // Untracked state change.
        this._columnWidthManager.columnWidthMode = normalizedValue;
        if (widthsData.columnWidthsMode !== normalizedValue) {
            // Tracked state changes.
            this._columnWidthManager.handleWidthModeChange(this.state.columns);
        }
        // Untracked state change.
        widthsData.columnWidthsMode = normalizedValue;
    }

    /**
     * Array of the columns object that's used to define the data types.
     * Required properties include 'label', 'fieldName', and 'type'. The default type is 'text'.
     * See the Documentation tab for more information.
     * @type {Array}
     */
    @api
    get columns() {
        return this._rawColumns;
    }

    set columns(value) {
        const _rawColumns = Array.isArray(value) ? value : [];
        this._rawColumns = _rawColumns;
        this.updateColumns(_rawColumns);
        this._columnWidthManager.handleColumnsChange(this.state.columns);
    }

    /**
     * The array of data to be displayed.
     * @type {Array}
     */
    @api
    // eslint-disable-next-line @lwc/lwc/valid-api
    get data() {
        return this.state.data;
    }

    set data(value) {
        const { _customerSelectedRows, state } = this;
        const { data: previousData, columns } = state;
        const data = Array.isArray(value) ? value : [];
        const isInfiniteLoading = isLoadMore(previousData, data);

        // Untracked state change.
        state.data = data;
        if (!isInfiniteLoading && data.length && columns.length) {
            this._columnWidthManager.handleDataChange(columns);
        }

        // do necessary updates since rows have changed
        if (this.hasValidKeyField && this.isConnected) {
            this.updateRows();
        }
        if (isInfiniteLoading) {
            addTableHeight(state, previousData, data);
        } else {
            // if data is new, reset all virtualization data
            state.heightCache = {};
            state.offsets = [0];
            state.offsetRanges = [{ start: 0, end: 0 }];
            state.firstVisibleIndex = 0;
            state.tableHeight = state.rowHeight * state.rows.length;
        }
        if (_customerSelectedRows) {
            this.setSelectedRows(_customerSelectedRows);
        }
    }

    /**
     * Specifies the default sorting direction on an unsorted column.
     * Valid options include 'asc' and 'desc'.
     * The default is 'asc' for sorting in ascending order.
     * @type {String}
     * @default asc
     */
    @api
    get defaultSortDirection() {
        return this.state.defaultSortDirection;
    }

    set defaultSortDirection(value) {
        const { state } = this;
        setDefaultSortDirection(state, value);
        updateSorting(state);
    }

    /**
     * The current values per row that are provided during inline edit.
     * @type {Object}
     */
    @api
    get draftValues() {
        return getDirtyValues(this.state);
    }

    set draftValues(value) {
        const { state } = this;
        this._draftValues = value;
        setDirtyValues(state, value);

        if (this.isConnected && this.hasValidKeyField) {
            this.updateRowsAndCells();
        }

        updateActiveCellTabIndexAfterSync(state);
    }

    /**
     * If present, you can load a subset of data and then display more
     * when users scroll to the end of the table.
     * Use with the onloadmore event handler to retrieve more data.
     * @type {Boolean}
     * @default false
     */
    @api
    get enableInfiniteLoading() {
        return this.state.enableInfiniteLoading;
    }

    set enableInfiniteLoading(value) {
        const { state } = this;
        // Untracked state change.
        setEnableInfiniteLoading(state, value);
        handlePrefetch.call(this);
    }

    /**
     * Specifies an object containing information about cell level, row level, and table level errors.
     * When it's set, error messages are displayed on the table accordingly.
     * @type {Object}
     */
    @api
    get errors() {
        return this.state.errors;
    }

    set errors(value) {
        const { state } = this;
        setErrors(state, value);
        if (this.isConnected) {
            updateCells(state);
        }
    }

    /**
     * If present, the checkbox column for row selection is hidden.
     * @type {Boolean}
     * @default false
     */
    @api
    get hideCheckboxColumn() {
        return this.state.hideCheckboxColumn;
    }

    set hideCheckboxColumn(value) {
        const { _rawColumns, state } = this;
        const normalizedValue = normalizeBoolean(value);

        this._columnWidthManager.handleCheckboxColumnChange(
            state.hideCheckboxColumn,
            normalizedValue,
            state.columns
        );
        // Untracked state changes.
        state.hideCheckboxColumn = normalizedValue;
        // update the columns metadata again to update the status.

        if (this.isConnected) {
            this.updateColumns(_rawColumns);
        } else if (_rawColumns) {
            // Component has not yet rendered so
            // tree state should be reset to default
            state.hadTreeDataTypePreviously = false;
            state.treeColumn = undefined;
            // Tracked state change.
            setColumns(state, _rawColumns, this._privateTypes);
        }
    }

    /**
     * If present, the actions menu is displayed to enable users to do advanced sorting.
     * @type {Boolean}
     * @default false
     */
    @api
    get showActionsMenu() {
        return this.state.showActionsMenu;
    }

    set showActionsMenu(value) {
        const { state } = this;
        const normalizedValue = normalizeBoolean(value);

        this._columnWidthManager.handleActionsColumnChange(
            state.showActionsMenu,
            normalizedValue,
            state.columns
        );

        state.showActionsMenu = normalizedValue;
        // update the columns metadata again to update the status.
        this.updateColumns(this._rawColumns);
    }

    /**
     * If present, the table header is hidden.
     * @type {Boolean}
     * @default false
     */
    @api
    get hideTableHeader() {
        return this.state.hideTableHeader;
    }

    set hideTableHeader(value) {
        // Untracked state change.
        this.state.hideTableHeader = normalizeBoolean(value);
    }

    /**
     * Specifies how the table header is wrapped. Set to 'all' to wrap all column headers.
     * Set to 'none' to clip all column headers. Set to 'by-column' to wrap/clip column headers
     * based on the wrap/clip setting for that individual column. The default is 'by-column'.
     * @type {String}
     * @default by-column
     */
    @api
    get wrapTableHeader() {
        return this.state.wrapTableHeader;
    }

    set wrapTableHeader(value) {
        // Untracked state change.
        this.state.wrapTableHeader = normalizeString(value, {
            fallbackValue: 'by-column',
            validValues: ['all', 'by-column', 'none'],
        });

        if (this.state.wrapTableHeader !== 'none') {
            this._recalculateHeaderHeight = true;
        } else {
            this._headerHeight = '';
        }
    }

    /**
     * If present, a spinner is shown to indicate that more data is loading.
     * @type {Boolean}
     * @default false
     */
    @api
    get isLoading() {
        return this.state.isLoading;
    }

    set isLoading(value) {
        // Tracked state change.
        setLoading(this.state, value);
    }

    /**
     * Required for better performance. Associates each row with a unique ID.
     * key-field is case sensitive and must match the value you provide in the data array.
     * @type {String}
     * @required
     */
    @api
    get keyField() {
        return this.state.keyField;
    }

    set keyField(value) {
        const { state } = this;
        // Untracked state change.
        setKeyField(state, value);
        // Tracked state change.
        setDirtyValues(state, this._draftValues);
        if (this.isConnected) {
            this.updateRows();
        }
    }

    /**
     * Determines when to trigger infinite loading based on
     * how many pixels the table's scroll position is from the bottom of the table.
     * The default is 20.
     * @type {Number}
     * @default 20
     */
    @api
    get loadMoreOffset() {
        return getLoadMoreOffset(this.state);
    }

    set loadMoreOffset(value) {
        setLoadMoreOffset(this.state, value);
    }

    /**
     * The maximum width for all columns.
     * The default is 1000px.
     * @type {Number}
     * @default 1000px
     */
    @api
    get maxColumnWidth() {
        return this.widthsData.maxColumnWidth;
    }

    set maxColumnWidth(value) {
        const { widthsData } = this;
        // Tracked state changes.
        setMaxColumnWidth(this.state.columns, widthsData, value);
        // Untracked state change.
        this._columnWidthManager.maxColumnWidth = widthsData.maxColumnWidth;
    }

    /**
     * The maximum number of rows that can be selected. Value should be a positive integer
     * Checkboxes are used for selection by default,
     * and radio buttons are used when maxRowSelection is 1.
     * @type {Number}
     */
    @api
    get maxRowSelection() {
        return this.state.maxRowSelection;
    }

    set maxRowSelection(value) {
        const { state } = this;
        if (!state.hasCalledUpdateRowsAndCells) {
            // Tracked state changes.
            this.updateRowsAndCells();
        }
        const previousSelectionLength = getCurrentSelectionLength(state);
        // A mix of tracked and untracked state changes.
        setMaxRowSelection(state, value, this._datatableId);
        if (previousSelectionLength > 0) {
            this.fireSelectedRowsChange(this.getSelectedRows());
        }
    }

    /**
     * The minimum width for all columns.
     * The default is 50px.
     * @type {Number}
     * @default 50px
     */
    @api
    get minColumnWidth() {
        return this.widthsData.minColumnWidth;
    }

    set minColumnWidth(value) {
        const { widthsData } = this;
        // Tracked state change.
        setMinColumnWidth(this.state.columns, widthsData, value);
        // Untracked state change.
        this._columnWidthManager.minColumnWidth = widthsData.minColumnWidth;
    }

    /**
     * @typedef RenderManagerConfig
     * @type {Object}
     * @property {Boolean} viewportRendering - Specifies whether to defer rendering of rows outside the viewport until the user begins scrolling. To use this feature, create a fixed-height container element for lightning-datatable.
     * @property {Number} rowHeight - Specifies the height of a row, in px
     * @property {String} virtualize - specifies whether to enable virtualization. This requires the "role-based" render mode and a fixed-height container for lightning-datatable
     */

    /**
     * Enables and configures advanced rendering modes.
     * It supports properties 'bufferSize' and 'rowHeight'.
     *
     * @type {RenderManagerConfig} value - config object for datatable rendering
     */
    @api
    get renderConfig() {
        return this._renderConfig;
    }

    set renderConfig(value) {
        if (isObjectLike(value)) {
            this._renderManager.configure(
                this.state,
                this.getWrapperHeight,
                value
            );
            this._renderManager.updateViewportRendering(
                this.state,
                this.gridContainer,
                true
            );
            this._renderConfig = value;
        }
    }

    /**
     * Allows developer to opt-in to a role-based table.
     * Allowed options - "role-based" or "default"
     * `role-based` -> Renders <div>
     * `default`    -> Renders <table>
     */
    /**
     * Reserved for internal use.
     */
    @api
    get renderMode() {
        return this._renderMode;
    }

    set renderMode(value) {
        const { _renderConfig, state } = this;
        const renderMode = normalizeString(value, {
            fallbackValue: 'default',
            validValues: [
                'default',
                'inline',
                'role-based',
                'role-based-inline',
            ],
        });
        const renderModeInline = isRenderModeInline(renderMode);
        const renderModeRoleBased = isRenderModeRoleBased(renderMode);

        this._renderMode = renderMode;
        // Untracked state changes.
        state.hasRenderedFirstTime = false;
        state.hasRenderedTable = false;
        state.renderModeInline = renderModeInline;
        state.renderModeRoleBased = renderModeRoleBased;
        if (this.isConnected) {
            // Tracked state changes.
            this.updateRowsAndCells();
        }
        if (_renderConfig) {
            setVirtualize(state, _renderConfig.virtualize);
        }
        updateCellClassForRoleBasedMode(state);
    }

    /**
     * If present, column resizing is disabled.
     * @type {Boolean}
     * @default false
     */
    @api
    get resizeColumnDisabled() {
        return this.widthsData.resizeColumnDisabled;
    }

    set resizeColumnDisabled(value) {
        // Untracked state change.
        setResizeColumnDisabled(this.widthsData, value);
    }

    /**
     * The width to resize the column when a user presses left or right arrow.
     * The default is 10px.
     * @type {Number}
     * @default 10px
     */
    @api
    get resizeStep() {
        return this.widthsData.resizeStep;
    }

    set resizeStep(value) {
        // Tracked state change.
        setResizeStep(this.widthsData, value);
    }

    /**
     * Determines where to start counting the row number.
     * The default is 0.
     * @type {Number}
     * @default 0
     */
    @api
    get rowNumberOffset() {
        return this.state.rowNumberOffset;
    }

    set rowNumberOffset(value) {
        const { state } = this;
        // Untracked state change.
        setRowNumberOffset(state, value);
        // Tracked state changes.
        this._columnWidthManager.handleRowNumberOffsetChange(
            state,
            this.widthsData
        );
    }

    /**
     * Enables programmatic row selection with a list of key-field values.
     * @type {list}
     */
    @api
    get selectedRows() {
        return getSelectedRowsKeys(this.state);
    }

    set selectedRows(value) {
        if (!this.state.hasCalledUpdateRowsAndCells) {
            this.updateRowsAndCells();
        }
        this._customerSelectedRows = value;
        this.setSelectedRows(value);
    }

    /**
     * If present, the row numbers are shown in the first column.
     * @type {Boolean}
     * @default false
     */
    @api
    get showRowNumberColumn() {
        return this.state.showRowNumberColumn;
    }

    set showRowNumberColumn(value) {
        const { state, _rawColumns } = this;
        // A mix of tracked and untracked state changes.
        this._columnWidthManager.handleRowNumberColumnChange(
            state.rowNumberOffset,
            value,
            state.columns
        );
        // Untracked state change.
        state.showRowNumberColumn = normalizeBoolean(value);

        if (this.isConnected) {
            this.updateColumns(_rawColumns);
        } else if (_rawColumns) {
            // Component has not yet rendered so
            // tree state should be reset to default
            state.hadTreeDataTypePreviously = false;
            state.treeColumn = undefined;
            // Tracked state change.
            setColumns(state, _rawColumns, this._privateTypes);
        }
    }

    /**
     * The column key or fieldName(s) that controls the sorting order.
     * Sort the data using the onsort event handler.
     * @type {String|String[]}
     */
    @api
    get sortedBy() {
        return this.state.sortedBy;
    }

    set sortedBy(value) {
        const { state } = this;
        setSortedBy(state, value);
        updateSorting(state);
    }

    /**
     * Specifies the sorting direction.
     * Sort the data using the onsort event handler.
     * Valid options include a single value of 'asc' or 'desc' or an array of such values.
     * @type {String|String[]}
     */
    @api
    get sortedDirection() {
        return this.state.sortedDirection;
    }

    set sortedDirection(value) {
        const { state } = this;
        setSortedDirection(state, value);
        updateSorting(state);
    }

    /**
     * If present, the footer that displays the Save and Cancel buttons is hidden during inline editing.
     * @type {Boolean}
     * @default false
     */
    @api
    get suppressBottomBar() {
        return this._suppressBottomBar;
    }

    set suppressBottomBar(value) {
        this._suppressBottomBar = normalizeBoolean(value);
    }

    /**
     * This value specifies the number of lines after which the
     * content will be cut off and hidden. It must be at least 1 or more.
     * The text in the last line is truncated and shown with an ellipsis.
     * @type {Integer}
     */
    @api
    get wrapTextMaxLines() {
        return this.state.wrapTextMaxLines;
    }

    set wrapTextMaxLines(value) {
        const { state } = this;
        // Untracked state changes.
        setWrapTextMaxLines(state, value);
        this._columnWidthManager.wrapTextMaxLines = state.wrapTextMaxLines;
        if (this.isConnected) {
            updateCells(state);
        }
    }

    /************************** PUBLIC METHODS ***************************/

    /**
     * Returns data in each selected row.
     * @returns {Array} An array of data in each selected row.
     */
    @api
    getSelectedRows() {
        const { state } = this;
        if (!state.hasCalledUpdateRowsAndCells) {
            this.updateRowsAndCells();
        }
        const data = unwrap(state.data);
        const { rows } = state;
        const selectedRows = [];
        for (let i = 0, { length: rowCount } = rows; i < rowCount; i += 1) {
            const row = rows[i];
            if (row.isSelected) {
                // Collect tracked data.
                selectedRows.push(data[i]);
            }
        }
        return selectedRows;
    }

    /**
     * Opens the inline edit panel for the datatable's currently active cell. If the active cell is not
     * editable, then the panel is instead opened for the first editable cell in the table. Given two
     * distinct cells, C_x and C_y, C_x is considered "first" in the cell ordering if the following condition
     * evaluates to true:
     *
     * (C_x.rowIndex < C_y.rowIndex) || (C_x.rowIndex === C_y.rowIndex && C_x.columnIndex < C_y.columnIndex)
     *
     * If there is no data in the table or there are no editable cells in the table then calling this function
     * results in a no-op.
     */
    @api
    openInlineEdit() {
        if (!this.state.hasCalledUpdateRowsAndCells) {
            this.updateRowsAndCells();
        }
        openInlineEditOnActiveCell(this);
    }

    /************************** PRIVATE GETTERS **************************/

    get gridContainer() {
        return getGridContainerFromScrollerY(
            getScrollerY(this.template, this.refs)
        );
    }

    get computedTableContainerClass() {
        return classSetToString({
            'slds-table_header-fixed_container': !this.state.hideTableHeader,
            'slds-scrollable_x': !this._isResizing,
        });
    }

    get computedTableClass() {
        const { state } = this;
        const headerType = state.hideTableHeader ? 'hidden' : 'fixed';
        return classSetToString({
            'slds-table': true,
            [`slds-table_header-${headerType}`]: true,
            'slds-table_bordered': true,
            'slds-table_edit': true,
            'slds-table_resizable-cols': !this.widthsData.resizeColumnDisabled,
            'slds-tree slds-table_tree': !!state.treeColumn,
        });
    }

    get computedTableRole() {
        return this.state.treeColumn ? 'treegrid' : 'grid';
    }

    get computedTableStyle() {
        const tableLayout = this._columnWidthManager.isAutoResizingUpdateQueued
            ? 'auto'
            : 'fixed';
        let style = `table-layout: ${tableLayout};`;
        const { tableWidth } = this.widthsData;
        if (tableWidth) {
            style += `width: ${tableWidth}px;`;
        }
        return style;
    }

    /**
     * Resets row-number counter to offset to show
     * correct value when row number column is present
     * and adds necessary position and height styles when
     * virtualization is enabled
     */
    get computedTbodyStyle() {
        const { state } = this;
        const { rowNumberOffset } = state;
        let style = '';
        if (state.showRowNumberColumn && rowNumberOffset >= 0) {
            const { firstVisibleIndex, bufferSize } = state;
            const firstRenderedRow = Math.max(
                firstVisibleIndex - bufferSize,
                0
            );
            const rowNumber = firstRenderedRow + rowNumberOffset;
            style += `counter-reset: row-number ${rowNumber};`;
        }
        if (state.virtualize) {
            const { tableHeight } = state;
            style += `position:relative;height:${tableHeight}px`;
        }
        return style;
    }

    /**
     * Sets the min height and the table width on the container
     * that wraps [role="grid"].
     * 1. Min Height is required for the case when the header actions
     *    dropdown is opened and there are no rows present. The dropdown
     *    would be cut off. To prevent that, we set a min height on the table.
     * 2. The table width is required for horizontal scroll. If the table
     *    is overflowing horizontally, we need to set the width in order
     *    to be able to view the remaining columns on scroll.
     */
    get computedScrollerYStyle() {
        const minHeight = this._actionsMinHeightStyle
            ? `${this._actionsMinHeightStyle};`
            : '';
        if (this._columnWidthManager.isAutoResizingUpdateQueued) {
            return `${minHeight}overflow-x:auto`;
        }
        const { tableWidth } = this.widthsData;
        return tableWidth ? `width: ${tableWidth}px;` : '';
    }

    get computedScrollerXStyle() {
        let style = 'height: 100%;';
        if (this.showStatusBar) {
            style += 'padding-bottom: 3rem;';
        }
        if (this._columnWidthManager.isAutoResizingUpdateQueued) {
            style += 'overflow-x: auto;';
        }
        if (this.state.wrapTableHeader !== 'none') {
            // update padding style for dynamic header height when header can wrap
            style += `padding-top: max(2rem, ${this._headerHeight})`;
        }
        return style;
    }

    /**
     * Private method to get computedCheckboxColumnHeaderId
     * from checkboxColumnHeaderElement for
     * aria-labelledby in checkbox column
     */
    get computedCheckboxColumnHeaderId() {
        return this._checkboxColumnHeaderId;
    }

    get computedAriaLiveClassForNavMode() {
        const isNavMode = this.state.keyboardMode === KEYBOARD_NAVIGATION_MODE;
        return classSetToString({
            'slds-hide': !isNavMode,
            'slds-assistive-text': isNavMode,
        });
    }

    get computedAriaLiveClassForActionMode() {
        const isActionMode = this.state.keyboardMode === KEYBOARD_ACTION_MODE;
        return classSetToString({
            'slds-hide': !isActionMode,
            'slds-assistive-text': isActionMode,
        });
    }

    /**
     * aria-rowcount is the count of TRs in the table
     * It includes the # of rows of data + column header row (since this is also a TR)
     * A table with no rows of data still has an aria-rowcount of 1
     */
    get ariaRowCount() {
        const { state } = this;
        if (!state.hasCalledUpdateRowsAndCells) {
            this.updateRowsAndCells();
        }
        return state.rows.length + 1;
    }

    get hasValidKeyField() {
        if (typeof this.state.keyField === 'string') {
            return true;
        }
        // eslint-disable-next-line no-console
        console.error(
            `The "keyField" is a required attribute of lightning:datatable.`
        );
        return false;
    }

    get hasResizebleColumns() {
        return !this.widthsData.resizeColumnDisabled;
    }

    get renderedRows() {
        const { state } = this;
        if (!state.hasCalledUpdateRowsAndCells) {
            this.updateRowsAndCells();
        }
        const { virtualize, rows, renderedRowCount } = state;
        if (virtualize) {
            const { firstIndex, lastIndex } =
                this._renderManager.getRenderedRange(state);
            this._lastRenderedRow = lastIndex + 1; // UTAM rows are 1-indexed
            // we shouldn't lose focus from re-renders caused by a change in renderedRows
            this._shouldResetFocus = true;
            return rows.slice(firstIndex, lastIndex);
        }
        if (state.enableViewportRendering) {
            this._lastRenderedRow = renderedRowCount;
            return rows.slice(0, renderedRowCount);
        }
        this._lastRenderedRow = rows.length;
        return rows;
    }

    get showSelectAllCheckbox() {
        return this.state.maxRowSelection !== 1;
    }

    get showStatusBar() {
        return !this._suppressBottomBar && isInlineEditTriggered(this.state);
    }

    get tableError() {
        return this.state.errors.table;
    }

    get i18n() {
        return i18n;
    }

    /************************** LIFECYCLE HOOKS **************************/

    /**
     * Initialize the following:
     * 1. DatatableTypes
     * 2. ColumnWidthManager
     * 3. RenderManager
     */
    constructor() {
        super();

        this._columnWidthManager = new ColumnWidthManager(this.widthsData);
        this._privateTypes = new DatatableTypes(this.constructor.customTypes);
        this._hasSetInitialCustomTypes =
            !!this._privateTypes.privateCustomTypes.size;

        this._renderManager = new RenderManager();
        this.getWrapperHeight = () => {
            const scrollerX = getScrollerX(this.template, this.refs);
            const paddingTop =
                parseFloat(getComputedStyle(scrollerX).paddingTop) || 0;
            return scrollerX.offsetHeight - paddingTop;
        };
    }

    /**
     * Attach event handlers for various events on `lightning-datatable`
     */
    connectedCallback() {
        const { template } = this;

        // Row selection and de-selection
        this.addEventListener('rowselection', (event) => {
            this.handleRowSelectionChange(event);
        });
        template.addEventListener('selectallrows', (event) => {
            this.handleSelectionCellClick(event);
        });
        template.addEventListener('deselectallrows', (event) => {
            this.handleSelectionCellClick(event);
        });
        template.addEventListener('selectrow', (event) => {
            this.handleSelectionCellClick(event);
        });
        template.addEventListener('deselectrow', (event) => {
            this.handleSelectionCellClick(event);
        });
        // Column resizing
        template.addEventListener('resizecol', (event) => {
            this.handleResizeColumn(event);
        });
        // Column sorting
        template.addEventListener('privateupdatecolsort', (event) => {
            this.handleUpdateColumnSort(event);
        });
        // Cell interaction
        template.addEventListener('privatecellkeydown', (event) => {
            this.handleKeydownOnCell(event);
        });
        template.addEventListener('privatecellfocusedbyclick', (event) => {
            this.handleCellFocusByClick(event);
        });
        template.addEventListener('privatecellfalseblurred', (event) => {
            this.handleFalseCellBlur(event);
        });
        // Inlined cell interaction
        template.addEventListener('click', (event) => {
            this.handlePrimitiveDatatableCellClick(event);
        });
        template.addEventListener('focus', (event) => {
            this.handlePrimitiveDatatableCellFocus(event);
        });
        template.addEventListener('keydown', (event) => {
            this.handlePrimitiveDatatableCellKeydown(event);
        });
        // Row level actions
        template.addEventListener('privatecellactiontriggered', (event) => {
            this.handleRowActionTriggered(event);
        });
        template.addEventListener('privatecellactionmenuopening', (event) => {
            this.handleLoadDynamicActions(event);
        });
        template.addEventListener('privatecellbuttonclicked', (event) => {
            this.handleCellButtonClick(event);
        });
        // Header actions
        template.addEventListener(
            'privatecellheaderactionmenuopening',
            (event) => {
                this.handleHeaderActionMenuOpening(event);
            }
        );
        template.addEventListener(
            'privatecellheaderactionmenuclosed',
            (event) => {
                this.handleHeaderActionMenuClosed(event);
            }
        );
        template.addEventListener(
            'privatecellheaderactiontriggered',
            (event) => {
                this.handleHeaderActionTriggered(event);
            }
        );
        // Open sorting modal
        template.addEventListener('privateopensortingmodal', (event) => {
            this.handleOpenSortingModal(event);
        });
        // Inline edit
        template.addEventListener('privateeditcell', (event) => {
            this.handleEditCell(event);
        });

        this.updateColumnsAndRows();
    }

    /**
     * Renders the appropriate template - div.html or table.html,
     * based on the `render-mode` value passed in and whether or not
     * an auto resize is queued since auto mode requires table template.
     * If template is changed, resize observers are disconnected.
     *
     * By default, table.html is rendered
     */
    render() {
        const requireTableTemplate =
            this._columnWidthManager.isAutoResizingUpdateQueued;
        const templateToRender =
            this.state.renderModeRoleBased && !requireTableTemplate
                ? divTemplate
                : tableTemplate;
        if (templateToRender !== this._renderedTemplate) {
            // if private types present, don't reset custom types since template
            // change will trigger slotchange event without types actually changing
            this._shouldResetCustomTypes =
                !this._privateTypes.privateCustomTypes.size;
            const { _widthObserver } = this;
            if (_widthObserver) {
                _widthObserver.disconnect();
            }
            this._renderManager.disconnectResizeObserver();
            this._renderedTemplate = templateToRender;
        }
        return templateToRender;
    }

    renderedCallback() {
        const {
            _columnWidthManager,
            gridContainer,
            refs,
            state,
            template,
            widthsData,
        } = this;

        // Initial set of custom types should be set in renderedCallback
        // To avoid extra calls to renderedCallback after first slotchange
        if (!this._hasSetInitialCustomTypes) {
            this.setCustomTypes();
            this._hasSetInitialCustomTypes = true;
            // Return here since a re-render will occur on auto width
            // tables for column updates if custom types added
            if (
                this._privateTypes.privateCustomTypes.size &&
                widthsData.columnWidthsMode === 'auto'
            ) {
                return;
            }
        }

        // This keeps underlying table element up to date if the aria-* properties on this element is dynamically changed.
        // It does the work of removing and adding the attribute if the value is empty(ish) or a normal string.
        synchronizeAttrs(gridContainer, {
            'aria-label': this.ariaLabel,
            'aria-labelledby': this.ariaLabelledBy,
            'aria-describedby': this.ariaDescribedBy,
        });

        const { renderModeInline } = state;
        if (_columnWidthManager.isResizingUpdateQueued) {
            const { columns } = state;
            const fireResizeEvent = _columnWidthManager.shouldFireResizeEvent(
                widthsData,
                columns
            );
            // Tracked state changes.
            _columnWidthManager.adjustColumnsSize(
                template,
                refs,
                columns,
                widthsData
            );
            // Managing cell widths is required for role-based render mode.
            if (state.renderModeRoleBased) {
                recomputeCellStyles(state);
            }
            if (fireResizeEvent) {
                this.fireOnResize(false);
            }
            this._recalculateHeaderHeight = true;
            this.updateTableAndScrollerStyleOnRender();
        }

        let { _widthObserver } = this;
        if (!_widthObserver) {
            // Tracked state changes.
            _widthObserver = new LightningDatatableResizeObserver(this, () => {
                // Tracked state change.
                _columnWidthManager.adjustColumnsSizeAfterResize(
                    this,
                    state.columns,
                    widthsData
                );
                this._recalculateHeaderHeight = true;
                // Managing cell widths is required for role-based render mode.
                if (state.renderModeRoleBased) {
                    recomputeCellStyles(state);
                }
            });
            this._widthObserver = _widthObserver;
        } else if (!_widthObserver.isConnected()) {
            _widthObserver.observe(template, refs);
        }

        handlePrefetch.call(this);

        // customerSelectedRows is only valid till render, after it, the one
        // used should be the one from the state.
        this._customerSelectedRows = null;
        // Set the previous focused cell to null after render is done.
        state.cellToFocusNext = undefined;

        // Reset focus styles on re-render.
        if (this._shouldResetFocus) {
            // Since focus is now getting reset, can change this back to false.
            this._shouldResetFocus = false;
            // Don't return focus to active cell when inline edit panel is open.
            const { activeCell } = state;
            if (
                activeCell &&
                activeCell.hasFocus &&
                !state.inlineEdit.isPanelVisible
            ) {
                const cellElement = getActiveCellElement(template, state);
                const cellElementChild = getCellElementChild(cellElement);
                if (
                    !renderModeInline &&
                    cellElement &&
                    cellElementChild &&
                    !cellElementChild.classList.contains(FOCUS_CLASS)
                ) {
                    // Tracked state change.
                    setFocusActiveCell(
                        state,
                        template,
                        refs,
                        null,
                        null,
                        false
                    );
                }
            }
        }

        const { hasRenderedFirstTime, hasRenderedTable } = state;
        const virtualize = !!state.virtualize;
        const { length: rowCount } = state.rows;

        // Untracked state changes.
        // Set rendered flags BEFORE handlePrefetch() is called.
        state.hasRenderedFirstTime = true;
        state.hasRenderedTable = true;

        if (virtualize || state.enableViewportRendering) {
            const { _renderManager } = this;
            if (rowCount) {
                if (virtualize) {
                    this.updateVirtualizedRowHeights();
                }
            }
            if (!hasRenderedFirstTime) {
                const outerContainer =
                    refs?.outerContainer ||
                    template.querySelector('div.dt-outer-container');
                _renderManager.connectResizeObserver(outerContainer);
            }
            if (!_renderManager.hasWrapperHeight()) {
                _renderManager.updateWrapperHeight(this.getWrapperHeight);

                // Reset the row count if we already had one before updating the wrapper height.
                // This can happen if the number of rows was calculated before the datatable
                // was rendered.
                if (state.renderedRowCount) {
                    _renderManager.updateViewportRendering(
                        state,
                        gridContainer,
                        true
                    );
                }
            }
        }

        if (rowCount && renderModeInline && !hasRenderedTable) {
            this.updateCheckboxCellsAriaAttrs();
            if (hasLinkProvider(template)) {
                this.updateLookupCellsLinkInfo();
                this.updateUrlCellsLinkInfo();
            }
        }

        this.updateHeaderHeight();
    }

    updateHeaderHeight() {
        if (
            this.state.wrapTableHeader !== 'none' &&
            this._recalculateHeaderHeight
        ) {
            // Need to wait a frame for width changes on last render to take effect
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            requestAnimationFrame(() => {
                const headerElements = this.template.querySelectorAll(
                    '[role="columnheader"] lightning-primitive-header-factory'
                );
                let headerHeight = 0;
                for (let i = 0; i < headerElements.length; i += 1) {
                    const headerCellHeight = headerElements[i].getDomHeight();
                    if (headerCellHeight > headerHeight) {
                        headerHeight = headerCellHeight;
                    }
                }
                // Header height only accounts for the height of the text
                // Add 16 px for padding around the text
                this._headerHeight = `max(2rem, ${headerHeight + 16}px)`;
                this._recalculateHeaderHeight = false;
            });
        }
    }

    updateTableAndScrollerStyleOnRender() {
        const scrollYEle = getScrollerY(this.template, this.refs);
        const tableElement = getGridContainerFromScrollerY(scrollYEle);
        if (tableElement) {
            tableElement.style = this.computedTableStyle;
        }
        if (scrollYEle) {
            scrollYEle.style = this.computedScrollerYStyle;
        }
    }

    disconnectedCallback() {
        const { _widthObserver } = this;
        if (_widthObserver) {
            _widthObserver.disconnect();
        }

        this._renderManager.disconnectResizeObserver();
    }

    /************************** EVENT HANDLERS ***************************/

    handleCellButtonClick = handleCellButtonClick;

    handleEditCell = handleEditCell;

    handleHeaderActionMenuClosed = handleHeaderActionMenuClosed;

    handleHeaderActionMenuOpening = handleHeaderActionMenuOpening;

    handleHeaderActionTriggered = handleHeaderActionTriggered;

    handleKeydownOnCell = handleKeydownOnCell;

    handleLoadDynamicActions = handleLoadDynamicActions;

    handlePrimitiveDatatableCellClick = handlePrimitiveDatatableCellClick;

    handlePrimitiveDatatableCellFocus = handlePrimitiveDatatableCellFocus;

    handlePrimitiveDatatableCellKeydown = handlePrimitiveDatatableCellKeydown;

    handleRowSelectionChange = handleRowSelectionChange;

    handleRowActionTriggered = handleRowActionTriggered;

    handleCustomTypesChange() {
        if (this._shouldResetCustomTypes) {
            this.setCustomTypes();
        } else {
            // Event was triggered by the initial render or template change
            // after already setting custom types, so we ignore this call
            this._shouldResetCustomTypes = true;
        }
    }

    /**
     * Handles the 'keydown' event on <table> and the
     * corresponding <div> on the role-based table
     *
     * @param {KeyboardEvent} event - 'keydown'
     */
    handleTableKeydown = handleKeydownOnTable;

    /**
     * Handles the 'keydown' event on data row <tr> (table-based) and div[role="row"] (role-based)
     *
     * @param {KeyboardEvent} event - 'keydown'
     */
    handleKeydownOnDataRow(event) {
        const { state } = this;
        // we probably should not be doing this unless we actually are interested in it
        if (state.keyboardMode === KEYBOARD_NAVIGATION_MODE && state.rowMode) {
            event.stopPropagation();
            const { currentTarget: tr } = event;
            reactToKeyboardOnRow(this, {
                target: tr,
                detail: {
                    keyCode: event.keyCode,
                    keyEvent: event,
                    rowExpanded: tr.getAttribute('aria-expanded') === 'true',
                    rowHasChildren: !!tr.getAttribute('aria-expanded'),
                    rowKeyValue: tr.getAttribute('data-row-key-value'),
                    rowLevel: tr.getAttribute('aria-level'),
                },
            });
        }
    }

    /**
     * Handles the 'scroll' event on the table container
     *
     * @param {Event} event - 'scroll'
     */
    handleHorizontalScroll(event) {
        handleInlineEditPanelScroll.call(this, event);
    }

    /**
     * Handles the 'scroll' event on the child of the
     * table container at div.slds-scrollable_y.
     *
     * @param {Event} event - 'scroll'
     */
    handleVerticalScroll(event) {
        const { state } = this;
        if (state.enableInfiniteLoading) {
            handleLoadMoreCheck.call(this, event);
        }

        // Tracked state changes.
        handleInlineEditPanelScroll.call(this, event);
        if (state.virtualize) {
            state.firstVisibleIndex = findFirstVisibleIndex(
                this.state,
                event.target.scrollTop
            );
        } else if (state.enableViewportRendering) {
            this._renderManager.handleScroll(state, event);
        }
    }

    /**
     * Handles the 'click' event on the <table> element and
     * the corresponding <div> in the role-based table
     *
     * @param {MouseEvent} event - 'click'
     */
    handleTableCellClick(event) {
        // handles the case when clicking on the margin/pading of the td/th
        const { target } = event;
        if (isCellElement(target)) {
            // get the row/col key value from the primitive cell.
            // const { rowKeyValue, colKeyValue } =
            //     target.querySelector(':first-child');
            const cellElement = target;
            const { state } = this;
            const { rowKeyValue } = cellElement.parentElement.dataset;
            const { colKeyValue } = cellElement.dataset;
            if (
                state.rowMode ||
                !isActiveCell(state, rowKeyValue, colKeyValue)
            ) {
                const { activeCell } = state;
                if (activeCell && state.rowMode) {
                    // Untracked state change.
                    unsetRowNavigationMode(state);
                    // Tracked state change.
                    updateRowTabIndex(state, activeCell.rowIndex, -1);
                }
                this.setActiveCell(rowKeyValue, colKeyValue);
            }
            if (!datatableHasFocus(state, this.template)) {
                // Untracked state change.
                setCellClickedForFocus(state);
            }
        }
    }

    /**
     * Handles the 'privateupdatecolsort' event on lightning-datatable
     * Used only for single column sorting from column header clicking
     * @param {CustomEvent} event - 'privateupdatecolsort'
     */
    handleUpdateColumnSort(event) {
        event.stopPropagation();
        const { fieldName, columnKey, sortDirection } = event.detail;

        this.fireSortedColumnChange(fieldName, columnKey, sortDirection);
    }

    handleCheckboxHeaderId(event) {
        this._checkboxColumnHeaderId = event.detail;
    }

    handleOpenSortingModal(event) {
        event.stopPropagation();
        MultiColumnSortingModal.open({
            dtInstance: this,
        }).then((response) => {
            if (response && response.event.defaultPrevented) {
                response.failure();
            } else if (response) {
                response.success();
            }
        });
    }

    /**
     * Handles the 'resizecol' event on lightning-datatable
     *
     * @param {CustomEvent} event - 'resizecol'
     */
    handleResizeColumn(event) {
        event.stopPropagation();
        const { state } = this;
        const { colIndex, widthDelta: delta } = event.detail;
        if (delta !== 0) {
            resizeColumnWithDelta(
                state.columns,
                this.widthsData,
                colIndex,
                delta
            );
            // Managing cell widths is required for role-based render mode.
            if (state.renderModeRoleBased) {
                recomputeCellStyles(state);
            }
            this.fireOnResize(true);
            this.fixHeaderForSafari();
            this._recalculateHeaderHeight = true;
        }
    }

    /**
     * Handles the 'privateresizestart' event on the <tr> and the corresponding
     * <div> in the role-based table on the column header row
     *
     * @param {CustomEvent} event - 'privateresizestart'
     */
    handleResizeStart(event) {
        event.stopPropagation();
        this._isResizing = true;
    }

    /**
     * Handles the 'privateresizeend' event on the <tr> and the corresponding
     * <div> in the role-based table on the column header row
     *
     * @param {CustomEvent} event - 'privateresizeend'
     */
    handleResizeEnd(event) {
        event.stopPropagation();
        this._isResizing = false;
        this.state.shouldResetHeights = true;
    }

    /**
     * Handles the `selectallrows`, `deselectallrows`, `selectrow`, `deselectrow`
     * events on lightning-datatable
     *
     * @param {CustomEvent} event - `selectallrows`, `deselectallrows`, `selectrow`, `deselectrow`
     */
    handleSelectionCellClick(event) {
        this.handleCellFocusByClick(event);
        const { type } = event;
        if (type === 'selectrow') {
            handleSelectRow.call(this, event);
        } else if (type === 'deselectrow') {
            handleDeselectRow.call(this, event);
        } else if (type === 'selectallrows') {
            handleSelectAllRows.call(this, event);
        } else if (type === 'deselectallrows') {
            handleDeselectAllRows.call(this, event);
        }
    }

    /**
     * Handles the 'privatecellfocusedbyclick' event on lightning-datatable
     *
     * @param {CustomEvent} event - 'privatecellfocusedbyclick'
     */
    handleCellFocusByClick(event) {
        event.stopPropagation();
        const { state } = this;
        const { rowKeyValue, colKeyValue, needsRefocusOnCellElement } =
            event.detail;
        if (!isActiveCell(state, rowKeyValue, colKeyValue)) {
            const { activeCell } = state;
            if (activeCell && state.rowMode) {
                unsetRowNavigationMode(state);
                updateRowTabIndex(state, activeCell.rowIndex, -1);
            }
            this.setActiveCell(rowKeyValue, colKeyValue);
            refocusCellElement(state, this.template, needsRefocusOnCellElement);
        }
    }

    /**
     * Handles the 'privatecellfalseblurred' event on lightning-datatable
     *
     * @param {CustomEvent} event - 'privatecellfalseblurred'
     */
    handleFalseCellBlur(event) {
        event.stopPropagation();
        const { state } = this;
        const { rowKeyValue, colKeyValue } = event.detail;
        if (!isActiveCell(state, rowKeyValue, colKeyValue)) {
            this.setActiveCell(rowKeyValue, colKeyValue);
        }
        // Tracked state change.
        setFocusActiveCell(state, this.template, this.refs);
    }

    /**
     * Handles the 'focusin' event on <table> and the corresponding
     * <div> on the role-based table
     *
     * @param {FocusEvent} event - 'focusin'
     */
    handleTableFocusIn = handleDatatableFocusIn;

    /**
     * Handles the 'focusout' event on <table> and the corresponding
     * <div> on the role-based table
     *
     * This gets called both when we expect the table to lose focus
     * and when the active cell loses focus after renderedRows changes
     * on a virtualized table, in which case we don't want to lose focus.
     *
     * We account for this by setting activeCell.hasFocus to the value of
     * _shouldResetFocus, which will be true if and only if focus was
     * lost due to a renderedRows change for a virtualized table.
     *
     * @param {FocusEvent} event - 'focusout'
     */
    handleTableFocusOut(event) {
        handleDatatableFocusOut.call(this, event);
        const { activeCell } = this.state;
        if (activeCell) {
            activeCell.hasFocus = this._shouldResetFocus;
        }
    }

    /**
     * Handles the 'ieditfinished' event on the inline edit panel -
     * `lightning-primitive-datatable-iedit-panel`
     *
     * @param {CustomEvent} event - 'ieditfinished'
     */
    handleInlineEditFinish = handleInlineEditFinish;

    /**
     * Handles the 'masscheckboxchange' event on the inline edit panel -
     * `lightning-primitive-datatable-iedit-panel`
     *
     * @param {CustomEvent} event - 'masscheckboxchange'
     */
    handleMassCheckboxChange = handleMassCheckboxChange;

    /**
     * Handles the 'privatesave' event on the status bar -
     * `lightning-primitive-datatable-status-bar` and
     * fires the `save` custom event
     *
     * @param {CustomEvent} event - 'privatesave'
     */
    handleInlineEditSave(event) {
        event.stopPropagation();
        event.preventDefault();
        closeInlineEdit(this);
        const { draftValues } = this;
        this.dispatchEvent(
            new CustomEvent('save', {
                detail: {
                    draftValues,
                },
            })
        );
    }

    /**
     * Handles the 'privatecancel' event on the status bar -
     * `lightning-primitive-datatable-status-bar` and
     * fires the `cancel` custom event
     *
     * @param {CustomEvent} event - 'privatecancel'
     */
    handleInlineEditCancel(event) {
        event.stopPropagation();
        event.preventDefault();

        closeInlineEdit(this);

        const customerEvent = new CustomEvent('cancel', {
            cancelable: true,
        });

        this.dispatchEvent(customerEvent);

        if (!customerEvent.defaultPrevented) {
            cancelInlineEdit(this);
        }
        updateActiveCellTabIndexAfterSync(this.state);
    }

    /**
     * @event LightningDatatable#onprivatelookupitempicked We need to augment the original event LightningFormattedLookup#onprivatelookupitempicked
     * @type {Object}
     * @property {String} recordId
     * @property {Number} rowIndex
     * @property {String} rowKeyValue
     */
    /**
     * Handles the 'privatelookupitempicked' event from the lightning-formatted-lookup or force-lookup
     * `lightning-primitive-datatable-status-bar` and fires the augmented 'privatelookupitempicked' custom event
     *
     * @param {CustomEvent} event - 'privatelookupitempicked'
     * @fires LightningDatatable#onprivatelookupitempicked
     */
    handlePrivateLookupItemPicked(event) {
        event.stopPropagation();
        event.preventDefault();

        const { recordId } = event.detail;
        const { rowIndex, rowKeyValue } =
            this.computeRowLookupItemPickedInformation(event.currentTarget);

        this.dispatchEvent(
            // We will the below Eslint rule as we use a constant to apply the name of the event
            // eslint-disable-next-line lightning-global/no-custom-event-identifier-arguments
            new CustomEvent(
                FORMATTED_LOOKUP_EVENTS.PrivateLookupItemPickedEvent.NAME, // Reuse the same event's name for homogenous usage
                {
                    composed: true,
                    cancelable: true,
                    bubbles: true,
                    detail: {
                        recordId,
                        rowIndex,
                        rowKeyValue,
                    },
                }
            )
        );
    }

    /**
     * We control the checkbox behavior with the state and we handle it in the container,
     * but we need to prevent default in order to avoid the checkbox to change state
     * with the click and the generated click in the input from the label
     *
     * @param {Object} event - click event of the checkbox
     */
    handleInlinedCheckboxClick(event) {
        const { state } = this;

        // Click was catch on the input, stop propagation to avoid to be handled in container.
        // ideally you can let it bubble and be handled in there, but there is a raptor issue:
        // https://git.soma.salesforce.com/raptor/raptor/issues/838
        event.stopPropagation();

        const { currentTarget: checkboxElement } = event;
        const { parentElement: checkboxContainer } = checkboxElement;
        const { parentElement: cellElement } = checkboxContainer;
        const { colKeyValue } = cellElement.dataset;
        const { rowKeyValue } = cellElement.parentElement.dataset;
        const row = getRowByKey(state, rowKeyValue);
        this.fireInlinedCheckboxSelection(checkboxElement, row.isSelected, {
            rowKeyValue,
            colKeyValue,
            isMultiple: event.shiftKey,
        });
    }

    handleInlinedCheckboxContainerClick(event) {
        const { state } = this;
        const { currentTarget: checkboxContainer } = event;
        const { parentElement: cellElement } = checkboxContainer;
        const { rowKeyValue } = cellElement.parentElement.dataset;
        const row = getRowByKey(state, rowKeyValue);
        if (row.isDisabled) {
            return;
        }
        // Click was catch in the label, the default its to activate the checkbox,
        // lets prevent it to avoid to send a double event.
        event.preventDefault();

        const { colKeyValue } = cellElement.dataset;
        const { firstElementChild: checkboxElement } = checkboxContainer;
        this.fireInlinedCheckboxSelection(checkboxElement, row.isSelected, {
            rowKeyValue,
            colKeyValue,
            isMultiple: event.shiftKey,
        });
    }

    handleInlinedCheckboxContainerMouseDown(event) {
        // Prevent selecting text by Shift+click
        if (this.state.renderModeInline && event.shiftKey) {
            event.preventDefault();
        }
    }

    handleInlinedEditButtonClick(event) {
        const { state } = this;
        const cellElement = state.renderModeInline
            ? getCellElementFromEventTarget(event.target)
            : undefined;

        if (cellElement) {
            const cellElementChild = getCellElementChild(cellElement);
            cellElementChild.dispatchEvent(
                new CustomEvent('privateeditcell', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        rowKeyValue:
                            cellElement.parentElement.dataset.rowKeyValue,
                        colKeyValue: cellElement.dataset.colKeyValue,
                    },
                })
            );
        }
    }

    /************************ EVENT DISPATCHERS **************************/

    fireInlinedCheckboxSelection(checkboxElement, isSelected, detail) {
        const actionName = isSelected ? 'deselectrow' : 'selectrow';
        checkboxElement.dispatchEvent(
            // eslint-disable-next-line lightning-global/no-custom-event-identifier-arguments
            new CustomEvent(actionName, {
                bubbles: true,
                composed: true,
                detail,
            })
        );
    }

    fireSelectedRowsChange(selectedRows, config = {}) {
        this.dispatchEvent(
            new CustomEvent('rowselection', {
                detail: { selectedRows, config },
            })
        );
    }

    fireSortedColumnChange(fieldName, columnKey, sortDirection) {
        const sortEvent = new CustomEvent('sort', {
            detail: {
                fieldNames: [fieldName],
                sortDirections: [sortDirection],
                isMultiColumnSort: false,
                fieldName,
                columnKey,
                sortDirection,
            },
        });
        this.dispatchEvent(sortEvent);
    }

    fireOnResize(isUserTriggered) {
        this.dispatchEvent(
            new CustomEvent('resize', {
                detail: {
                    columnWidths: getCustomerColumnWidths(
                        this.state.columns,
                        this.widthsData
                    ),
                    isUserTriggered: !!isUserTriggered,
                },
            })
        );
    }

    /************************* HELPER FUNCTIONS **************************/

    updateRows() {
        this.updateRowsBeforeIndexes();
        this.updateRowsAndCells();
        this.updateRowsAfterIndexes();
    }

    updateRowsBeforeIndexes() {
        // Untracked state change.
        setCellToFocusFromPrev(this.state, this.template);
    }

    updateRowsAfterIndexes() {
        const { state, widthsData } = this;
        if (state.enableViewportRendering || state.virtualize) {
            this._renderManager.updateViewportRendering(
                state,
                this.gridContainer,
                !!state.virtualize
            );
        }

        // Tracked state changes.
        this._columnWidthManager.handleRowNumberOffsetChange(state, widthsData);
        // Untracked state change.
        // Unset the cellToFocusNext if the row still exists after indexes calculation.
        updateCellToFocusFromPrev(state);
        // A mix of tracked and untracked state changes.
        syncSelectedRowsKeys(state, this.getSelectedRows()).ifChanged(() => {
            // Only trigger row selection event once after all the setters have executed
            // Otherwise, event can be fired with stale data if not all setters have been triggered
            if (!this._rowSelectionEventPending) {
                this._rowSelectionEventPending = true;
                Promise.resolve().then(() => {
                    if (this._rowSelectionEventPending) {
                        this.fireSelectedRowsChange(this.getSelectedRows());
                        this._rowSelectionEventPending = false;
                    }
                });
            }
        });
        // Untracked state change.
        syncActiveCell(state);

        if (state.keyboardMode === KEYBOARD_NAVIGATION_MODE) {
            // Tracked state changes.
            updateTabIndexActiveCell(state);
            updateTabIndexActiveRow(state);
        }
        // if there is previously focused cell which was deleted set focus from cellToFocusNext
        if (state.activeCell && state.cellToFocusNext) {
            // Tracked state change.
            setFocusActiveCell(state, this.template, this.refs);
        }
    }

    updateColumns(columns) {
        setColumns(this.state, columns, this._privateTypes);
        if (this.isConnected) {
            this.updateColumnsBeforeIndexes();
            this.updateRowsAndCells();
            this.updateColumnsAfterIndexes();
        }
    }

    updateColumnsBeforeIndexes() {
        const { state } = this;
        // Untracked state changes.
        // Calculate cell to focus next before indexes are updated.
        setCellToFocusFromPrev(state, this.template);
        updateRowNavigationMode(state);
        // Tracked state changes.
        setDirtyValues(state, this._draftValues);
        // Update state.wrapText and when type is not in NON_WRAPPABLE_TYPES
        // and sets internal header actions.
        updateHeaderInternalActions(state);
    }

    updateColumnsAfterIndexes() {
        const { state, widthsData } = this;

        // Tracked state changes.
        updateBulkSelectionState(state);
        this._columnWidthManager.handleRowNumberOffsetChange(state, widthsData);
        updateColumnWidthsMetadata(state.columns, widthsData);
        // Unset the cellToFocusNext if the column still exists after indexes calculation.
        updateCellToFocusFromPrev(state);

        if (
            state.data.length > 0 &&
            state.columns.length !== widthsData.columnWidths.length
        ) {
            // Untracked state change.
            // When there are column changes, update the active cell.
            syncActiveCell(state);
        }
        if (state.keyboardMode === KEYBOARD_NAVIGATION_MODE) {
            // Tracked state changes.
            updateTabIndexActiveCell(state);
            updateTabIndexActiveRow(state);
        }
        // If there is previously focused cell which was deleted set focus from cellToFocusNext.
        if (state.activeCell && state.cellToFocusNext) {
            // Tracked state change.
            setFocusActiveCell(state, this.template, this.refs);
        }
    }

    updateColumnsAndRows() {
        this.updateColumnsBeforeIndexes(this._rawColumns);
        this.updateRowsBeforeIndexes();
        this.updateRowsAndCells();
        this.updateRowsAfterIndexes();
        this.updateColumnsAfterIndexes();
    }

    updateRowsAndCells() {
        const { state } = this;
        // Untracked state change.
        state.hasRenderedTable = false;
        // Tracked state changes.
        updateRowsAndCells(state, this._privateTypes, this._datatableId);
    }

    updateVirtualizedRowHeights() {
        const state = this.state;
        const virtualizedRows = state.virtualize && this.renderedRows.length;

        // no need to handle other virtualization/row height logic
        // if heights need to be reset
        if (state.shouldResetHeights) {
            resetRowHeights(state);
            state.shouldResetHeights = false;
        } else if (virtualizedRows) {
            handleVariableRowHeights(
                this.template,
                state,
                this.renderedRows,
                this.refs
            );
        }
    }

    setSelectedRows(value) {
        // A mix of tracked and untracked state changes.
        setSelectedRowsKeys(this.state, value);
        this.handleRowSelectionChange();
    }

    setActiveCell(rowKeyValue, colKeyValue) {
        const { state, template } = this;
        const newActiveCell = getCellByKeys(state, rowKeyValue, colKeyValue);
        // Tracked state change.
        setBlurActiveCell(state, template);
        // Untracked state change.
        state.activeCell = newActiveCell;
        // Tracked state changes.
        addFocusStylesToActiveCell(state, template);
        updateCellTabIndex(
            state,
            newActiveCell.rowIndex,
            newActiveCell.colIndex,
            0
        );
    }

    setCustomTypes() {
        const customTypesSlot = this.template.querySelector(
            'slot[name="customdatatypes"]'
        );
        if (customTypesSlot) {
            const assignedNodes = customTypesSlot.assignedNodes();
            if (assignedNodes.length) {
                const provider = assignedNodes[0];
                if (typeof provider.getDataTypes === 'function') {
                    this._privateTypes = new DatatableTypes(
                        provider.getDataTypes()
                    );
                    this.updateColumns(this._rawColumns);
                    this._columnWidthManager.handleColumnsChange(
                        this.state.columns
                    );
                }
            } else {
                // If no assigned nodes, there will be no extra slotchange event
                // We need to set this var so we don't ignore the call
                this._shouldResetCustomTypes = true;
            }
        }
    }

    /**
     * @returns {Object} containing the visible dimensions of the table { left, right, top, bottom, }
     */
    getViewableRect() {
        const { refs, template } = this;
        const scrollerY = getScrollerY(template, refs);
        const scrollerYRect = scrollerY.getBoundingClientRect();
        const scrollerX = getScrollerX(template, refs);
        const scrollerXRect = scrollerX.getBoundingClientRect();

        return {
            left: scrollerXRect.left,
            right: scrollerXRect.right,
            top: scrollerYRect.top,
            bottom: scrollerYRect.bottom,
        };
    }

    // W-6363867, W-7143375 Safari Refresh Bug
    fixHeaderForSafari() {
        if (isSafari) {
            const thead = this.template.querySelector('thead');
            if (thead) {
                /* Safari hack: hide and show the table head to force a browser repaint */
                thead.style.display = 'none';
                // eslint-disable-next-line @lwc/lwc/no-async-operation
                requestAnimationFrame(() => {
                    thead.style.display = '';
                });
            }
        }
    }

    /**
     * @returns { rowIndex: number, rowKeyValue: string } Compute the information to use to generate the lookupItemPicked event based on the row where the event comes from
     */
    computeRowLookupItemPickedInformation(currentTarget) {
        const { dataset } = currentTarget;
        // Row number always start to 1, so we convert it to be able to use
        // it for an array
        const rowIndex = Number.parseInt(dataset.rowNumber, 10) - 1;
        const { rowKeyValue } = dataset;
        return { rowIndex, rowKeyValue };
    }

    updateCheckboxCellsAriaAttrs() {
        const { _checkboxColumnHeaderId, state, template } = this;
        const { checkboxCells } = state;
        let { length: cellCount } = checkboxCells;
        // To avoid a critical performance penalty we query the template ONCE
        // instead of for EVERY cell.
        const checkboxElements = cellCount
            ? template.querySelectorAll(
                  '[data-inline-type="primitive-cell-checkbox"]'
              )
            : [];
        let scopedIdPostfix;
        for (let i = 0, { length } = checkboxElements; i < length; i += 1) {
            const cell = checkboxCells[i];
            const checkboxElem = checkboxElements[i];
            const { firstElementChild: inputElem } = checkboxElem;
            if (scopedIdPostfix === undefined) {
                const { lastElementChild: labelElem } = checkboxElem;
                const { id } = labelElem;
                scopedIdPostfix = id.slice(id.lastIndexOf('-'));
            }
            inputElem.setAttribute(
                'aria-labelledby',
                `${cell.checkboxLabelId}${scopedIdPostfix} ${_checkboxColumnHeaderId}`
            );
        }
    }

    updateLookupCellsLinkInfo() {
        const { state, template } = this;
        const { lookupCells } = state;
        const { length: cellCount } = lookupCells;
        // To avoid a critical performance penalty we query the template ONCE
        // instead of for EVERY cell.
        const lookupElements = cellCount
            ? template.querySelectorAll('[data-inline-type="formatted-lookup"]')
            : [];
        for (let i = 0, { length } = lookupElements; i < length; i += 1) {
            const cell = lookupCells[i];
            const lookupElem = lookupElements[i];
            const { value: recordId } = cell;
            // Set _handleLookupAnchorClick to untracked _cell.
            cell._handleLookupAnchorClick = () => {
                lookupElem.dispatchEvent(
                    new PrivateLookupItemPickedEvent({ recordId })
                );
            };
            if (lookupElem.getAttribute('data-navigation') === 'enable') {
                lookupElem.removeAttribute('data-navigation');
            }
            if (recordId) {
                getLinkInfo(lookupElem, {
                    stateType: 'standard__recordPage',
                    attributes: {
                        recordId,
                        actionName: 'view',
                    },
                }).then((linkInfo) => {
                    const { dispatcher, url } = linkInfo;
                    const lookupIsNavigable = !!(dispatcher && url);
                    cell.lookupIsNavigable = lookupIsNavigable;
                    cell.lookupLink = url;
                    cell._handleLookupAnchorClick = (event) => {
                        lookupElem.dispatchEvent(
                            new PrivateLookupItemPickedEvent({ recordId })
                        );
                        dispatcher.call(lookupElem, event);
                    };
                    if (lookupIsNavigable) {
                        lookupElem.setAttribute('data-navigation', 'enable');
                    } else {
                        lookupElem.removeAttribute('data-navigation');
                    }
                });
            }
        }
    }

    updateUrlCellsLinkInfo() {
        const { state, template } = this;
        const { shownUrlCells } = state;
        const { length: cellCount } = shownUrlCells;
        // To avoid a critical performance penalty we query the template ONCE
        // instead of for EVERY cell.
        const urlElements = cellCount
            ? template.querySelectorAll('[data-inline-type="formatted-url"]')
            : [];
        for (let i = 0, { length } = urlElements; i < length; i += 1) {
            const cell = shownUrlCells[i];
            const urlElem = urlElements[i];
            updateRawLinkInfo(urlElem, {
                url: cell.urlLink,
                target: cell.urlTarget,
            }).then((linkInfo) => {
                const { dispatcher, url } = linkInfo;
                // Set _handleUrlAnchorClick to untracked _cell.
                cell._handleUrlAnchorClick = (event) => {
                    dispatcher.call(urlElem, event);
                };
                cell.urlLink = url;
            });
        }
    }
}
