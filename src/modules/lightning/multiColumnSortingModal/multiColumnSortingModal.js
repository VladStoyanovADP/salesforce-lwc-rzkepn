import LightningModal from 'lightning/modal';
import Toast from 'lightning/toast';
import { track, api } from 'lwc';
import modalTitle from '@salesforce/label/LightningMultiColumnSortingModal.modalTitle';
import firstRuleHeading from '@salesforce/label/LightningMultiColumnSortingModal.firstRuleHeading';
import otherRuleHeading from '@salesforce/label/LightningMultiColumnSortingModal.otherRuleHeading';
import addRule from '@salesforce/label/LightningMultiColumnSortingModal.addRule';
import ruleLimit from '@salesforce/label/LightningMultiColumnSortingModal.ruleLimit';
import ruleLimitReached from '@salesforce/label/LightningMultiColumnSortingModal.ruleLimitReached';
import clearButton from '@salesforce/label/LightningMultiColumnSortingModal.clearButton';
import cancelButton from '@salesforce/label/LightningMultiColumnSortingModal.cancelButton';
import applyButton from '@salesforce/label/LightningMultiColumnSortingModal.applyButton';
import duplicateValueValidation from '@salesforce/label/LightningMultiColumnSortingModal.duplicateValueValidation';
import multiColumnSortingToast from '@salesforce/label/LightningDatatable.multiColumnSortingToast';
import ascending from '@salesforce/label/LightningPrimitiveColumnSorter.ascending';
import descending from '@salesforce/label/LightningPrimitiveColumnSorter.descending';
import { generateUniqueId } from 'lightning/inputUtils';
import { formatLabel } from 'lightning/utils';
const i18n = {
    modalTitle,
    firstRuleHeading,
    otherRuleHeading,
    addRule,
    ruleLimit,
    ruleLimitReached,
    clearButton,
    cancelButton,
    applyButton,
    duplicateValueValidation,
    multiColumnSortingToast,
    ascending,
    descending,
};

// represents a rule that has not been configured with sorting settings
const getEmptyRule = () => ({
    selectedColumn: undefined,
    sortOrder: 'asc', // default sort order is set to 'ascending'
});

// base state: two rules that are not configured with sorting settings
const initialRules = [getEmptyRule(), getEmptyRule()];

export default class MultiColumnSortingModal extends LightningModal {
    // lightning-datatable instance
    @api dtInstance;
    size = 'small';
    @track rules = initialRules;

    // variable track if validation errors are present
    validInputs = true;
    _modalBody;
    _scrollToBottom = false;

    get i18n() {
        return i18n;
    }

    /**
     * On initial load, the modal will create rules based on the passed in attributes:
     * 'sortedBy' and 'sortedDirection'
     */
    connectedCallback() {
        const { sortedBy, sortedDirection } = this.dtInstance;
        this.clearRules(); // reset rules
        if (Array.isArray(sortedBy) || Array.isArray(sortedDirection)) {
            if (
                sortedBy &&
                sortedDirection &&
                sortedBy.length === sortedDirection.length
            ) {
                let length = Math.min(sortedBy.length, 5); // 5 rules is the max limit
                // Create rules based on sortedBy and sortedDirection
                for (let i = 0; i < length; i += 1) {
                    this.rules[i] = {
                        selectedColumn: sortedBy[i],
                        sortOrder: sortedDirection[i],
                    };
                }
                // set `isDupe` property on this.rules so renderedCallback can report validity
                this.setDuplicates(this.rules);
            }
        }
    }

    renderedCallback() {
        const { comboboxInputs, rules } = this;
        const duplicateEntryExists = rules.some((rule) => rule.isDupe);

        const lastRuleSelected =
            rules.length >= 2 &&
            rules[rules.length - 1].selectedColumn !== undefined;

        // report validity if user has clicked on apply button, if there is a duplicate entry, or if the
        // last rule was selected
        if (
            this.validationThroughApplyButton ||
            duplicateEntryExists ||
            lastRuleSelected
        ) {
            if (duplicateEntryExists) {
                comboboxInputs.forEach((combobox, index) => {
                    combobox.setCustomValidity(
                        rules[index].isDupe
                            ? this.i18n.duplicateValueValidation
                            : ''
                    );
                });
            }
            this.reportValidity(comboboxInputs);
            this.validationThroughApplyButton = false;
        }

        // scroll to appropriate element
        this.handleScrolling();
    }

    // getter to get all `lightning-primitive-column-sorter` elements
    get columnSorters() {
        return Array.from(
            this.template.querySelectorAll('lightning-primitive-column-sorter')
        );
    }

    // getter to get all `lightning-combobox` elements from all the `lightning-primitive-column-sorter` elements
    get comboboxInputs() {
        return this.columnSorters.map((sorter) => sorter.combobox);
    }

    // getter to get the `lightning-modal-body's` `[part='modal-body']`
    get modalBody() {
        if (!this._modalBody) {
            this._modalBody = this.template.querySelector(
                'lightning-modal-body'
            ).shadowRoot.firstChild;
        }
        return this._modalBody;
    }

    get rulesWithData() {
        const { rules } = this;
        return rules.map((rule, index) => ({
            key: generateUniqueId('sorter'),
            ...rule, // sortOrder and selectedColumn
            heading:
                index === 0 ? i18n.firstRuleHeading : i18n.otherRuleHeading,
            unselectedInitialRules:
                rules.length <= 2 &&
                (rules[0].selectedColumn === undefined ||
                    rules[1].selectedColumn === undefined), // used to disable up/down movement when only 1 out of 2 rules are configured
            disabledTrash: rules.length < 3, // user should not be able to delete rules if there are only 2
            // if first two rules are not selected, the second rule should have disabled input
            disableInputs:
                index === 1 &&
                rules[index - 1].selectedColumn === undefined &&
                rules[index].selectedColumn === undefined,
        }));
    }

    /**
     * an additional 'value' property needs to be added for `lightning-combobox` in the
     * `primitive-column-sorter` to function properly
     */
    get processedColumns() {
        const filteredColumns = this.dtInstance.columns.filter(
            (column) => column.label && column.sortable
        );
        const processedColumns = filteredColumns.map((column) => {
            return {
                ...column,
                value: column.fieldName, // Set the 'value' property to the same value as 'fieldName'
            };
        });
        return processedColumns;
    }

    /**
     * Text to indicate if the sorting rule limit has been reached.
     */
    get ruleLimitText() {
        if (this.rules.length >= 5) {
            return i18n.ruleLimitReached;
        }
        return i18n.ruleLimit;
    }

    /**
     * inline style for the rule limit text;
     */
    get ruleLimitTextStyle() {
        return this.ruleLimitText === i18n.ruleLimitReached
            ? 'color:#8C4B02;'
            : '';
    }

    /**
     * Disable the add new rule button
     */
    get isAddRuleButtonDisabled() {
        const unselectedRuleExists = this.rules.some(
            (rule) => rule.selectedColumn === undefined
        );
        return (
            unselectedRuleExists || this.rules.length >= 5 || !this.validInputs
        );
    }

    /**
     * Disable the apply button
     */
    get isApplyButtonDisabled() {
        const rulesWithSelectedColumns = this.rules.filter(
            (rule) => rule.selectedColumn !== undefined
        );
        return rulesWithSelectedColumns.length < 2 || !this.validInputs;
    }

    /**
     * Disable the clear button
     */
    get isClearButtonDisabled() {
        return (
            this.rules[0].selectedColumn === undefined ||
            this.rules[1].selectedColumn === undefined
        );
    }

    /**
     * Handles adding a new rule from the 'add rule' button
     */
    handleAddRule() {
        this._scrollToBottom = true; // scroll to new rule
        this.rules.push(getEmptyRule());
    }

    /**
     * Handles the 'delete' event which is dispatched from `primitive-column-sorter` elements
     */
    handleDeleteRule(event) {
        const ruleIndexToDelete = event.target.index;
        this.rules.splice(ruleIndexToDelete, 1);
        // Update 'isDupe' property
        this.setDuplicates(this.rules);
    }

    /**
     * Handles the 'selection' event which is dispatched from `primitive-column-sorter` elements
     */
    handleSelectionChange(event) {
        const { index, selectedColumn, sortOrder } = event.detail;
        // Get the existing rule object at the specified index
        const existingRule = this.rules[index];
        if (existingRule) {
            const newColumnSelection =
                existingRule.selectedColumn !== selectedColumn;
            // Update the existing rule object with the new selectedColumn and sortOrder
            existingRule.selectedColumn = selectedColumn;
            existingRule.sortOrder = sortOrder;
            if (newColumnSelection) {
                // Update 'isDupe' property
                this.setDuplicates(this.rules, index);
            }
        }
    }

    /**
     * Handles the 'moveup' or 'movedown' event which is dispatched from `primitive-column-sorter` elements
     */
    handleRuleMovement(event) {
        const { rules } = this;
        const dir = event.type;
        const ruleIndexToMove = event.target.index;
        const ruleIndexToSwitch =
            dir === 'moveup' ? ruleIndexToMove - 1 : ruleIndexToMove + 1;

        // Switch rules
        const tempRule = rules[ruleIndexToMove];
        rules[ruleIndexToMove] = rules[ruleIndexToSwitch];
        rules[ruleIndexToSwitch] = tempRule;
    }

    /**
     * Dispatches the 'privateupdatecolsort' custom event to send selected data to parent component
     * Also extracts sorting orders and columns from rules and cleaning anything 'undefined'
     */
    applyRules() {
        const fieldNames = this.rules.map((rule) => rule.selectedColumn);
        const sortDirections = this.rules.map((rule) => rule.sortOrder);

        // validation to ensure that there are no invalid inputs
        this.reportValidity(this.comboboxInputs);
        this.validationThroughApplyButton = true;

        // only dispatch event with data if all inputs are valid
        if (this.validInputs) {
            // Dispatch event from datatable
            const event = new CustomEvent('sort', {
                detail: {
                    fieldNames,
                    sortDirections,
                    isMultiColumnSort: true,
                },
            });
            this.dtInstance.dispatchEvent(event);
            // Construct toast
            const toastMessage = this.getToastMessage(
                fieldNames,
                sortDirections
            );
            this.close({
                event,
                success: this.sendToast(toastMessage, 'success'),
                failure: this.sendToast(toastMessage, 'failure'),
            });
        }
    }

    getToastMessage(fieldNames, sortDirections) {
        // Method used to format the Toast notification's message
        const capitalizeFirstLetter = (str) =>
            str.charAt(0).toUpperCase() + str.slice(1);

        // constructing and formatting the toast message
        const message = fieldNames
            .map(
                (sortBy, index) =>
                    `${capitalizeFirstLetter(sortBy)} (${
                        sortDirections[index] === 'asc'
                            ? i18n.ascending
                            : i18n.descending
                    })`
            )
            .join(', ');
        return formatLabel(i18n.multiColumnSortingToast, message);
    }

    sendToast(toastMessage, variant) {
        return () => {
            Toast.show(
                {
                    label: toastMessage,
                    mode: 'dismissible',
                    variant,
                },
                this.dtInstance
            );
        };
    }

    /**
     * Handles clearing all sorting rules from the modal from the 'clear' button
     */
    clearRules() {
        this.rules = [getEmptyRule(), getEmptyRule()];
    }

    /**
     * Handles closing the modal when the 'cancel' button is clicked
     */
    cancelRules() {
        this.close();
    }

    /**
     * method to handle the scrolling to a newly added `lightning-primitive-column-sorter` or the
     * first one with a validation error present
     */
    handleScrolling() {
        // scroll to the bottom for when new `lightning-primitive-column-sorters` are added
        const { comboboxInputs } = this;
        let modalBody;
        if (this._scrollToBottom) {
            modalBody = this.modalBody;
            modalBody.scrollTop = modalBody.scrollHeight;
            this._scrollToBottom = false;
        }

        // if there are errors present, auto-scroll to the first error
        for (let i = 0; i < comboboxInputs.length; i += 1) {
            const combobox = comboboxInputs[i];
            if (combobox.classList.contains('slds-has-error')) {
                const sorter = this.columnSorters[i];
                modalBody = modalBody || this.modalBody;
                modalBody.scrollTop = sorter.offsetTop - modalBody.offsetTop;
                break;
            }
        }
    }

    /**
     * Helper function to check if there are duplicate `selectedColumn` properties for
     * each of the entries in this.rules array. if there is, then that rule gets its `isDupe`
     * property set to `true`.
     * @param {Array} rules
     * @param {Number} ruleIndexToSetLast - rule index to set 'isDupe' for last. Used in handleSelectionChange.
     */
    setDuplicates(rules, ruleIndexToSetLast) {
        const selectedColumns = new Set();
        for (let i = 0; i < rules.length; i += 1) {
            if (ruleIndexToSetLast !== i) {
                const { selectedColumn } = rules[i];
                rules[i].isDupe =
                    selectedColumn && selectedColumns.has(selectedColumn);
                selectedColumns.add(selectedColumn);
            }
        }
        if (ruleIndexToSetLast !== undefined) {
            const { selectedColumn } = rules[ruleIndexToSetLast];
            rules[ruleIndexToSetLast].isDupe =
                selectedColumn && selectedColumns.has(selectedColumn);
            selectedColumns.add(selectedColumn);
        }
        return selectedColumns;
    }

    /**
     * This function will go through the list of `lightning-combobox`s and will reportValidity()
     * on each to show the errors.
     * Sets the `validInputs` property to track if all entries are valid or not
     * @param {Array} comboboxInputs
     */
    reportValidity(comboboxInputs) {
        comboboxInputs.forEach(
            (combobox) => combobox && combobox.reportValidity()
        );
        this.validInputs = comboboxInputs.every(
            (combobox) => combobox && combobox.validity.valid
        );
    }
}
