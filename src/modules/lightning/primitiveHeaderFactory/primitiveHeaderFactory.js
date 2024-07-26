import labelChooseARow from '@salesforce/label/LightningDatatable.chooseARow';
import labelChooseARowSelectAll from '@salesforce/label/LightningDatatable.chooseARowSelectAll';
import labelSelectAll from '@salesforce/label/LightningDatatable.selectAll';
import labelSort from '@salesforce/label/LightningDatatable.sort';
import labelSortAsc from '@salesforce/label/LightningDatatable.sortAsc';
import labelSortDesc from '@salesforce/label/LightningDatatable.sortDesc';
import labelSortNone from '@salesforce/label/LightningDatatable.sortNone';
import sortingMenuMultiColumnSort from '@salesforce/label/LightningDatatable.sortingMenuMultiColumnSort';
import sortingMenuRows from '@salesforce/label/LightningDatatable.sortingMenuRows';
import sortingMenuColumns from '@salesforce/label/LightningDatatable.sortingMenuColumns';
import sortingMenuTooltip from '@salesforce/label/LightningDatatable.sortingMenuTooltip';
import PrimitiveDatatableCell from 'lightning/primitiveDatatableCell';
import { api, track } from 'lwc';
import {
    classListMutation,
    classSetToString,
    getRealDOMId,
} from 'lightning/utilsPrivate';

import selectable from './selectableHeader.html';
import sortable from './sortableHeader.html';
import nonsortable from './nonsortableHeader.html';
import sortingMenu from './sortingMenuHeader.html';

const SELECTABLE_HEADER_TYPE = 'SELECTABLE_CHECKBOX';
const SORTING_MENU_HEADER_TYPE = 'SELECTABLE_BUTTON_MENU';

const i18n = {
    chooseARow: labelChooseARow,
    chooseARowSelectAll: labelChooseARowSelectAll,
    selectAll: labelSelectAll,
    sort: labelSort,
    sortAsc: labelSortAsc,
    sortDesc: labelSortDesc,
    sortNone: labelSortNone,
    sortingMenuMultiColumnSort,
    sortingMenuRows,
    sortingMenuColumns,
    sortingMenuTooltip,
};

/**
 * A table column header.
 */
export default class PrimitiveHeaderFactory extends PrimitiveDatatableCell {
    // Tracked objects
    @track _def = {};

    // Private variables
    _resizable;
    _sortable = false;
    _hideHeader = false;
    _wrapTableHeader = false;

    /************************** PUBLIC ATTRIBUTES ***************************/

    @api actions;
    @api colIndex;
    @api columnWidth;
    @api dtContextId;
    @api headerHeight;
    @api resizestep;
    @api showCheckbox = false;
    @api sorted;
    @api sortedDirection;
    @api showActionsMenu;
    @api wrapTextMaxLines;

    /**
     * Retrieves the computed header DOM `id`
     *
     * @return {string} The DOM `id`
     */
    @api
    get computedColumnHeaderId() {
        const el = this.refs.columnHeader;
        return getRealDOMId(el);
    }

    /**
     * Defines the data type for the column
     *
     * @type {string}
     */
    @api
    get def() {
        return this._def;
    }

    set def(value) {
        this._def = value;
        this.updateElementClasses();
    }

    /**
     * Defines whether the table header is hidden
     *
     * @type {boolean}
     */
    @api
    get hideHeader() {
        return this._hideHeader;
    }

    set hideHeader(value) {
        this._hideHeader = value;
        this.updateElementClasses();
    }

    /**
     * Defines whether the table header is wrapped
     *
     * @type {boolean}
     */
    @api
    get wrapTableHeader() {
        return this._wrapTableHeader;
    }

    set wrapTableHeader(value) {
        this._wrapTableHeader = value;
        this.updateElementClasses();
    }

    /**
     * Defines whether the column is resizable
     *
     * @type {boolean}
     */
    @api
    get resizable() {
        return this._resizable;
    }

    set resizable(value) {
        this._resizable = value;
        this.updateElementClasses();
    }

    /**
     * Defines whether the column is sortable
     *
     * @type {boolean}
     */
    @api
    get sortable() {
        return this._sortable;
    }

    set sortable(value) {
        this._sortable = value;
        this.updateElementClasses();
    }

    /************************** PUBLIC METHODS ***************************/

    /**
     * Retrieves the header cell's height
     *
     * @return {string} The height of the cell
     */
    @api
    getDomHeight() {
        const child = this.template.querySelector('.slds-hyphenate');
        if (child) {
            return child.offsetHeight;
        }
        return '';
    }

    /**
     * Retrieves the header cell's width
     *
     * @return {string} The width of the cell
     */
    @api
    getDomWidth() {
        const { child } = this.refs;
        if (child) {
            return child.offsetWidth;
        }
        return '';
    }

    /************************** PRIVATE GETTERS **************************/

    get shouldWrapText() {
        const { _wrapTableHeader } = this;
        return (
            _wrapTableHeader === 'all' ||
            (_wrapTableHeader === 'by-column' && this._def.wrapText)
        );
    }

    /**
     * Computes the styles for the column
     *
     * @return {string} The computed inline styles
     */
    get columnStyles() {
        const { columnWidth } = this;
        const outlineStyle = this._sortable ? '' : 'outline:none;';

        // In RTL, we need to explicitly position the column headers.
        // We do this by setting the offset (in pixels) from the start of the table.
        const offsetStyle =
            document.dir === 'rtl' ? `right: ${this._def.offset}px;` : '';
        const widthStyle = columnWidth ? `width: ${columnWidth}px;` : '';
        const heightStyle = this.headerHeight
            ? `height: ${this.headerHeight}`
            : '';

        return `
            ${widthStyle}
            ${outlineStyle}
            ${offsetStyle}
            ${heightStyle}
        `;
    }

    /**
     * Computes the classes for the column
     *
     * @return {string} The computed classes
     */
    get computedClass() {
        const { actions } = this;
        return classSetToString({
            'slds-cell-fixed': true,
            'slds-has-button-menu':
                // inline hasActions
                actions.customerActions.length > 0 ||
                actions.internalActions.length > 0,
        });
    }

    /**
     * Computes the sort classes for the column
     *
     * @return {string} The computed sort classes
     */
    get computedSortClass() {
        const { sortedDirection } = this;
        return classSetToString({
            'slds-th__action slds-text-link_reset': true,
            'slds-is-sorted': this.sorted,
            'slds-is-sorted_asc': sortedDirection === 'asc',
            'slds-is-sorted_desc': sortedDirection === 'desc',
        });
    }

    /**
     * Computes styling for header label
     */
    get getHeaderLabelClass() {
        return this.shouldWrapText
            ? 'slds-line-clamp slds-hyphenate'
            : 'slds-truncate';
    }

    /**
     * Computes styling for header label
     */
    get getHeaderLabelStyle() {
        return this.shouldWrapText
            ? `--lwc-lineClamp: ${this.wrapTextMaxLines || 'none'}`
            : '';
    }

    /**
     * Get th Action styles (needed for wrapping headers)
     *
     * @return {string} The computed classes
     */
    get thActionStyles() {
        return this.headerHeight ? `height: ${this.headerHeight}` : '';
    }

    /**
     * Computes an option name
     *
     * @return {string} The computed option name
     */
    get computedOptionName() {
        return `${this.dtContextId}-options`;
    }

    /**
     * Determines if the header has actions available
     *
     * @return {boolean} Whether the header has available actions
     */
    get hasActions() {
        const { actions } = this;
        return (
            actions.customerActions.length > 0 ||
            actions.internalActions.length > 0
        );
    }

    /**
     * Computes column header label
     *
     * @return {string} The computed column header label
     */
    get computedColumnHeaderLabel() {
        return this.showCheckbox
            ? this.i18n.chooseARowSelectAll
            : this.i18n.chooseARow;
    }

    /**
     * Returns the header's aria role
     *
     * @return {string|boolean} The aria role for the header
     */
    get headerRole() {
        if (
            this._sortable ||
            // inline isResizable
            (this._resizable && this._def.resizable !== false)
        ) {
            return 'button';
        }
        return false;
    }

    /**
     * Determines if the header is regular (unselectable and not sorting menu)
     *
     * @return {boolean} Whether the header is regular
     */
    get isRegularHeader() {
        return (
            this._def.type !== SELECTABLE_HEADER_TYPE &&
            this._def.type !== SORTING_MENU_HEADER_TYPE
        );
    }

    /**
     * Determines if the header is resizable
     *
     * @return {boolean} Whether the header is resizable
     */
    get isResizable() {
        return this._resizable && this._def.resizable !== false;
    }

    /**
     * Returns the internationalization language mapping
     *
     * @return {Object} The i18n mapping
     */
    get i18n() {
        return i18n;
    }

    /**
     * Returns the header's resize step
     *
     * @return {number} The resize step for the header
     */
    get resizeStep() {
        return this.resizestep;
    }

    /**
     * Returns the sort order label in the appropriate language
     *
     * @return {string} Language-specific sort order label
     */
    get sortedOrderLabel() {
        if (this.sorted) {
            return this.sortedDirection === 'desc'
                ? i18n.sortDesc
                : i18n.sortAsc;
        }
        return i18n.sortNone;
    }

    /************************** LIFECYCLE HOOKS **************************/

    /**
     * Renders the appropriate template: selectableHeader.html,
     * sortableHeader.html, or nonsortableHeader.html.
     * By default, nonsortableHeader.html is rendered
     */
    render() {
        const { type } = this._def;
        if (type === SELECTABLE_HEADER_TYPE) {
            return selectable;
        } else if (
            type === SORTING_MENU_HEADER_TYPE ||
            (type === 'action' && this._def.isLastCol && this.showActionsMenu)
        ) {
            return sortingMenu;
        } else if (this._sortable) {
            return sortable;
        }
        return nonsortable;
    }

    renderedCallback() {
        if (this._def.type === SELECTABLE_HEADER_TYPE) {
            if (this.showCheckbox) {
                this.updateBulkSelectionCheckbox();
            }
            const columnHeaderEvent = new CustomEvent('privatecolumnheaderid', {
                detail: this.computedColumnHeaderId,
            });
            this.dispatchEvent(columnHeaderEvent);
        }
    }

    disconnectedCallback() {
        if (this._def.type === SELECTABLE_HEADER_TYPE) {
            const columnHeaderEvent = new CustomEvent('privatecolumnheaderid', {
                detail: null,
            });
            this.dispatchEvent(columnHeaderEvent);
        }
    }

    /************************** EVENT HANDLERS ***************************/

    /**
     * Handles a sorting click on a header
     *
     * @param {Event} event
     */
    handleSortingClick(event) {
        event.preventDefault();

        if (this._sortable) {
            event.stopPropagation();
            this.fireSortedColumn();
            this.fireCellFocusByClickEvent();
        }
    }

    /************************ EVENT DISPATCHERS **************************/

    /**
     * Handles selecting all rows
     */
    handleSelectAllRows() {
        const { rowKeyValue, colKeyValue } = this;
        const actionName =
            this._def.bulkSelection === 'none'
                ? 'selectallrows'
                : 'deselectallrows';
        // eslint-disable-next-line lightning-global/no-custom-event-identifier-arguments
        const actionEvent = new CustomEvent(actionName, {
            bubbles: true,
            composed: true,
            detail: {
                rowKeyValue,
                colKeyValue,
            },
        });

        this.dispatchEvent(actionEvent);
    }

    /**
     * Notifies the parent datatable component by firing a private event with
     * the details of the sort action
     */
    fireSortedColumn() {
        const { columnKey, fieldName } = this._def;
        const event = new CustomEvent('privateupdatecolsort', {
            bubbles: true,
            composed: true,
            detail: {
                columnKey,
                fieldName,
                sortDirection: this.getTargetSortDirection(),
            },
        });

        this.dispatchEvent(event);
    }

    handleSortingMenuSelection(event) {
        event.stopPropagation();
        const selectedItemValue = event.detail.value;
        if (selectedItemValue === 'MultiColumnSorting') {
            // open modal
            const e = new CustomEvent('privateopensortingmodal', {
                bubbles: true,
                composed: true,
            });
            this.dispatchEvent(e);
        }
    }

    /************************* HELPER FUNCTIONS **************************/

    /**
     * Updates classes based on sort, resize and header eligibility
     */
    updateElementClasses() {
        classListMutation(this.classList, {
            'slds-is-sortable': this._sortable,
            // inline isResizable
            'slds-is-resizable':
                this._resizable && this._def.resizable !== false,
            'slds-assistive-text': this._hideHeader,
        });
    }

    /**
     * Determines the opposite direction to sort on based on the current direction
     *
     * @return {string} The new sort direction
     */
    getTargetSortDirection() {
        if (this.sorted) {
            return this.sortedDirection === 'desc' ? 'asc' : 'desc';
        }
        return this.sortedDirection;
    }

    /**
     * Determines the state of the header "all" checkbox based on current selections
     */
    updateBulkSelectionCheckbox() {
        const { bulkSelection } = this._def;
        const allCheckbox = this.refs.selectAll;
        allCheckbox.indeterminate = bulkSelection === 'some';

        // Note: since we have to handle the indeterminate state,
        //       this is to remove a raptor warning `Unnecessary update of property "checked"`
        allCheckbox.checked = !(bulkSelection === 'none');
    }
}
