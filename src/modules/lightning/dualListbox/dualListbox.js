import labelComponentAssistiveText from '@salesforce/label/LightningDualListbox.componentAssistiveText';
import labelDownButtonAssistiveText from '@salesforce/label/LightningDualListbox.downButtonAssistiveText';
import labelMaxError from '@salesforce/label/LightningDualListbox.maxError';
import labelMaxHelp from '@salesforce/label/LightningDualListbox.maxHelp';
import labelMinErrorPlural from '@salesforce/label/LightningDualListbox.minErrorPlural';
import labelMinErrorSingular from '@salesforce/label/LightningDualListbox.minErrorSingular';
import labelMinHelp from '@salesforce/label/LightningDualListbox.minHelp';
import labelMinRequiredErrorPlural from '@salesforce/label/LightningDualListbox.minRequiredErrorPlural';
import labelMinRequiredErrorSingular from '@salesforce/label/LightningDualListbox.minRequiredErrorSingular';
import labelOptionLockAssistiveText from '@salesforce/label/LightningDualListbox.optionLockAssistiveText';
import labelRequired from '@salesforce/label/LightningControl.required';
import labelRequiredError from '@salesforce/label/LightningDualListbox.requiredError';
import labelRequiredOptionError from '@salesforce/label/LightningDualListbox.requiredOptionError';
import labelUpButtonAssistiveText from '@salesforce/label/LightningDualListbox.upButtonAssistiveText';
import labelMoveSelectionToAssistiveText from '@salesforce/label/LightningDualListbox.moveSelectionToAssistiveText';
import labelMoveToAssistiveText from '@salesforce/label/LightningDualListbox.moveToAssistiveText';
import labelLoadingText from '@salesforce/label/LightningCombobox.loadingText';
import labelMovedOptionsSingular from '@salesforce/label/LightningDualListbox.movedOptionsSingular';
import labelMovedOptionsPlural from '@salesforce/label/LightningDualListbox.movedOptionsPlural';
import labelVerticallyMovedOptionsText from '@salesforce/label/LightningDualListbox.verticallyMovedOptions';
import labelHelpTextAlternativeText from '@salesforce/label/LightningInput.helptextAlternativeText';
import { api, track } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { handleKeyDownOnOption } from './keyboard';
import { classSet, formatLabel } from 'lightning/utils';
import {
    assert,
    normalizeBoolean,
    getRealDOMId,
    classListMutation,
    reflectAttribute,
    isCSR,
} from 'lightning/utilsPrivate';
import {
    InteractingState,
    FieldConstraintApi,
    normalizeVariant,
    VARIANT,
} from 'lightning/inputUtils';

const i18n = {
    componentAssistiveText: labelComponentAssistiveText,
    downButtonAssistiveText: labelDownButtonAssistiveText,
    maxError: labelMaxError,
    maxHelp: labelMaxHelp,
    minErrorPlural: labelMinErrorPlural,
    minErrorSingular: labelMinErrorSingular,
    minHelp: labelMinHelp,
    minRequiredErrorPlural: labelMinRequiredErrorPlural,
    minRequiredErrorSingular: labelMinRequiredErrorSingular,
    optionLockAssistiveText: labelOptionLockAssistiveText,
    required: labelRequired,
    requiredError: labelRequiredError,
    requiredOptionError: labelRequiredOptionError,
    upButtonAssistiveText: labelUpButtonAssistiveText,
    moveSelectionToAssistiveText: labelMoveSelectionToAssistiveText,
    moveToAssistiveText: labelMoveToAssistiveText,
    loadingText: labelLoadingText,
    movedOptionsSingular: labelMovedOptionsSingular,
    movedOptionsPlural: labelMovedOptionsPlural,
    helpTextAlternativeText: labelHelpTextAlternativeText,
    verticallyMovedOptionsText: labelVerticallyMovedOptionsText,
};

/**
 * A pair of listboxes that enables multiple options to be selected and reordered.
 */
export default class LightningDualListbox extends LightningShadowBaseClass {
    static validationOptOut = ['class'];
    // Component attributes
    /**
     * Label for the source options listbox.
     * @type {string}
     * @required
     */
    @api sourceLabel;

    /**
     * Label for the selected options listbox.
     * @type {string}
     * @required
     */
    @api selectedLabel;

    /**
     * Label for the dual listbox.
     * @type {string}
     * @required
     */
    @api label;

    /**
     * A list of options that are available for selection. Each option has the following attributes: label and value.
     * @type {object[]}
     * @required
     */
    @api options;

    /**
     * Minimum number of options required in the selected options listbox.
     * @type {number}
     */
    @api min = 0;

    /**
     * Maximum number of options allowed in the selected options listbox.
     * @type {number}
     */
    @api max;

    // inputable interface attributes
    /**
     * Specifies the name of an input element.
     * @type {string}
     */
    @api name;

    _showActivityIndicator = false;
    @track _requiredOptions = [];
    @track _selectedValues = [];
    _variant;
    _disabled;
    _disableReordering = false;
    _required = false;
    _addButtonLabel;
    _removeButtonLabel;
    _upButtonLabel;
    _downButtonLabel;
    _size;
    errorMessage = '';
    @track highlightedOptions = [];
    focusableInSource;
    focusableInSelected;
    @track highlightedOptionsLabel = [];

    _messageToDisplay = '';

    isFocusOnList = false;

    /**
     * Error message to be displayed when the value is missing and input is required.
     * @type {string}
     */
    @api messageWhenValueMissing = i18n.requiredError;

    /**
     * Error message to be displayed when a range overflow is detected.
     * @type {string}
     */
    @api
    get messageWhenRangeOverflow() {
        return this._messageWhenRangeOverflow || this._overflowMessage;
    }

    set messageWhenRangeOverflow(message) {
        this._messageWhenRangeOverflow = message;
    }

    /**
     * Error message to be displayed when a range underflow is detected.
     * @type {string}
     */
    @api
    get messageWhenRangeUnderflow() {
        return this._messageWhenRangeUnderflow || this._underflowMessage;
    }

    set messageWhenRangeUnderflow(message) {
        this._messageWhenRangeUnderflow = message;
    }

    /**
     * If present, the listbox is disabled and users cannot interact with it.
     * @type {string}
     */
    @api
    get disabled() {
        return this._disabled || false;
    }

    set disabled(value) {
        this._disabled = normalizeBoolean(value);
    }

    /**
     * If present, the user must add an item to the selected listbox before submitting the form.
     * @type {string}
     * @default false
     */
    @api
    get required() {
        return this._required;
    }

    set required(value) {
        this._required = normalizeBoolean(value);
    }

    /**
     * A list of default options that are included in the selected options listbox. This list is populated with values from the options attribute.
     * @type {list}
     */
    @api
    get value() {
        return this._selectedValues;
    }

    set value(newValue) {
        this.updateHighlightedOptions(newValue);
        this._selectedValues = newValue || [];
        if (this._connected) {
            this.addRequiredOptionsToValue();
        }
    }

    /**
     * A list of required options that cannot be removed from selected options listbox. This list is populated with values from the options attribute.
     * @type {list}
     */
    @api
    get requiredOptions() {
        return this._requiredOptions;
    }

    set requiredOptions(newValue) {
        this._requiredOptions = newValue || [];
        if (this._connected) {
            this.addRequiredOptionsToValue();
        }
    }

    /**
     * The variant changes the appearance of the dual listbox.
     * Accepted variants include standard, label-hidden, label-inline, and label-stacked.
     * This value defaults to standard.
     * Use label-hidden to hide the label but make it available to assistive technology.
     * Use label-inline to horizontally align the label and dual listbox.
     * Use label-stacked to place the label above the dual listbox.
     * @type {string}
     */
    @api
    get variant() {
        return this._variant || VARIANT.STANDARD;
    }

    set variant(value) {
        this._variant = normalizeVariant(value);
        this.updateClassList();
        reflectAttribute(this, 'variant', this._variant);
    }

    /**
     * Number of items that display in the listboxes before vertical scrollbars are displayed. Determines the vertical size of the listbox.
     * @type {number}
     * @default
     */
    @api
    get size() {
        return this._size;
    }
    set size(value) {
        this._size = value;
    }

    /**
     * Help text detailing the purpose and function of the dual listbox.
     * @type {string}
     */
    @api fieldLevelHelp;

    /**
     * If present, the Up and Down buttons used for reordering the selected list items are hidden.
     * @type {boolean}
     * @default false
     */
    @api
    get disableReordering() {
        return this._disableReordering;
    }

    set disableReordering(value) {
        this._disableReordering = normalizeBoolean(value);
    }

    /**
     * If present, a spinner is displayed in the first listbox to indicate loading activity.
     * @type {boolean}
     * @default false
     */
    @api
    get showActivityIndicator() {
        return this._showActivityIndicator;
    }

    set showActivityIndicator(value) {
        this._showActivityIndicator = normalizeBoolean(value);
    }

    /**
     * Sets focus on the first option from either list.
     * If the source list doesn't contain any options, the first option on the selected list is focused on.
     */
    @api
    focus() {
        // focus on the first option from either list
        // if nothing on source, then it'll pick the one on selected
        const firstOption = isCSR
            ? this.template.querySelector(`div[data-index='0']`)
            : null;
        if (firstOption) {
            firstOption.focus();
            this.updateSelectedOptions(firstOption, true, false);
        }
    }

    /**
     * Represents the validity states that an element can be in, with respect to constraint validation.
     * @type {object}
     */
    @api
    get validity() {
        return this._constraint.validity;
    }

    /**
     * Returns the valid attribute value (Boolean) on the ValidityState object.
     * @returns {boolean} Indicates whether the dual listbox meets all constraint validations.
     */
    @api
    checkValidity() {
        return this._constraint.checkValidity();
    }

    /**
     * Displays the error messages and returns false if the input is invalid.
     * If the input is valid, reportValidity() clears displayed error messages and returns true.
     * @returns {boolean} - The validity status of the input fields.
     */
    @api
    reportValidity() {
        return this._constraint.reportValidity((message) => {
            this.errorMessage = message;
        });
    }

    /**
     * Sets a custom error message to be displayed when the dual listbox value is submitted.
     * @param {string} message - The string that describes the error. If message is an empty string, the error message
     *     is reset.
     */
    @api
    setCustomValidity(message) {
        this._constraint.setCustomValidity(message);
    }

    /**
     * Displays an error message if the dual listbox value is required.
     */
    @api
    showHelpMessageIfInvalid() {
        this.reportValidity();
    }

    connectedCallback() {
        super.connectedCallback();
        this.classList.add('slds-form-element');
        this.updateClassList();
        this.keyboardInterface = this.selectKeyboardInterface();

        this._connected = true;
        this.addRequiredOptionsToValue();

        // debounceInteraction since DualListbox has multiple focusable elements
        this.interactingState = new InteractingState({
            debounceInteraction: true,
        });
        this.interactingState.onenter(() => {
            if (isCSR) {
                this.dispatchEvent(new CustomEvent('focus'));
            }
        });
        this.interactingState.onleave(() => {
            this.showHelpMessageIfInvalid();
            if (isCSR) {
                this.dispatchEvent(new CustomEvent('blur'));
            }

            // reset the optionToFocus otherwise dualListbox will steal the focus any time it's rerendered.
            this.optionToFocus = null;
        });
    }

    updateClassList() {
        classListMutation(this.classList, {
            'slds-form-element_stacked': this.variant === VARIANT.LABEL_STACKED,
            'slds-form-element_horizontal':
                this.variant === VARIANT.LABEL_INLINE,
        });
    }

    renderedCallback() {
        this.assertRequiredAttributes();
        if (this.disabled) {
            return;
        }

        if (this.optionToFocus) {
            // value could have an apostrophe, which is why we need to escape it otherwise the queryselector will not work
            const option = isCSR
                ? this.template.querySelector(
                      `div[data-value='${this.optionToFocus.replace(
                          /'/g,
                          "\\'"
                      )}']`
                  )
                : null;
            if (option) {
                this.isFocusOnList = true;
                option.focus();
            }
        }
    }

    get computedUniqueId() {
        return this.uniqueId;
    }

    get computedSourceListId() {
        return isCSR
            ? getRealDOMId(this.template.querySelector('[data-source-list]'))
            : 'source-list';
    }

    get computedSelectedListId() {
        return isCSR
            ? getRealDOMId(this.template.querySelector('[data-selected-list]'))
            : 'selected-list';
    }

    get ariaDisabled() {
        // aria-disabled works only with String not Boolean value
        return String(this.disabled);
    }

    get computedSourceList() {
        let sourceListOptions = [];
        if (this.options) {
            const required = this.requiredOptions;
            const values = this.value;
            sourceListOptions = this.options.filter(
                (option) =>
                    values.indexOf(option.value) === -1 &&
                    required.indexOf(option.value) === -1
            );
        }

        return this.computeListOptions(
            sourceListOptions,
            this.focusableInSource
        );
    }

    get computedSelectedList() {
        const selectedListOptions = [];
        if (this.options) {
            const optionsMap = {};
            this.options.forEach((option) => {
                optionsMap[option.value] = { ...option };
            });
            this.value.forEach((optionValue) => {
                const option = optionsMap[optionValue];
                if (option) {
                    option.isSelected = true;
                }
            });
            this.requiredOptions.forEach((optionValue) => {
                const option = optionsMap[optionValue];
                if (option) {
                    option.isLocked = true;
                    option.draggable = false;
                }
            });

            // add selected items in the given order
            this.value.forEach((optionValue) => {
                const option = optionsMap[optionValue];
                if (option) {
                    selectedListOptions.push(option);
                }
            });
        }

        return this.computeListOptions(
            selectedListOptions,
            this.focusableInSelected
        );
    }

    isOptionDisabled(elm) {
        return !!(elm?.getAttribute('aria-disabled') === 'true');
    }

    isOptionRequiredOrLocked(option) {
        return !!(
            this.requiredOptions.includes(option.value) || option.isLocked
        );
    }

    computeListOptions(options, focusableOptionValue) {
        if (options.length > 0) {
            const focusableOption = options.find((option) => {
                return (
                    option.value === focusableOptionValue &&
                    !this.isOptionRequiredOrLocked(option)
                );
            });

            const firstFocusableOption = options.find(
                (option) => !this.isOptionRequiredOrLocked(option)
            );

            const focusableValue = focusableOption
                ? focusableOption.value
                : firstFocusableOption?.value;

            return options.map((option) => {
                return this.computeOptionProperties(option, focusableValue);
            });
        }

        return [];
    }

    computeOptionProperties(option, focusableValue) {
        const isSelected = this.highlightedOptions.indexOf(option.value) > -1;
        const classList = classSet(
            'slds-listbox__option slds-listbox__option_plain slds-media slds-media_small slds-media_inline'
        )
            .add({ 'slds-is-selected': isSelected })
            .toString();

        return {
            ...option,
            tabIndex:
                !this.disabled && option.value === focusableValue ? '0' : '-1',
            selected: isSelected ? 'true' : 'false',
            classList,
        };
    }

    get computedLeftColumnClass() {
        return classSet(
            'slds-dueling-list__column slds-dueling-list__column_responsive'
        )
            .add({ 'slds-is-relative': this.showActivityIndicator })
            .toString();
    }

    get computedColumnStyle() {
        if (this.isNumber(this.size)) {
            // From the SLDS page on how to adjust the height: lightningdesignsystem.com/components/dueling-picklist/#Responsive
            const newHeight = parseInt(this.size, 10) * 2.25 + 1;
            return `height:${newHeight}rem`;
        }
        return '';
    }

    get isLabelHidden() {
        return this.variant === VARIANT.LABEL_HIDDEN;
    }

    get computedGroupLabelClass() {
        return classSet('slds-form-element__label slds-form-element__legend')
            .add({ 'slds-assistive-text': this.isLabelHidden })
            .toString();
    }

    get computedListboxContainerClass() {
        return classSet('slds-dueling-list__options')
            .add({ 'slds-is-disabled': this.disabled })
            .toString();
    }

    get computedLockAssistiveText() {
        return formatLabel(
            this.i18n.optionLockAssistiveText,
            this.selectedLabel
        );
    }

    get i18n() {
        return i18n;
    }

    getRightButtonAssistiveText() {
        return formatLabel(
            i18n.moveSelectionToAssistiveText,
            this.selectedLabel
        );
    }

    /**
     * Label for add button.
     * @type {string}
     * @default Move selection to {selectedLabel}
     */
    get addButtonDescription() {
        return this.getRightButtonAssistiveText();
    }

    getRightButtonAssistiveLabel() {
        return formatLabel(i18n.moveToAssistiveText, this.selectedLabel);
    }

    /**
     * Label for add button.
     * @type {string}
     * @default Move to {selectedLabel}
     */
    @api
    get addButtonLabel() {
        if (this._addButtonLabel) {
            return this._addButtonLabel;
        }
        return this.getRightButtonAssistiveLabel();
    }

    set addButtonLabel(value) {
        this._addButtonLabel = value;
    }

    getLeftButtonAssistiveText() {
        return formatLabel(i18n.moveSelectionToAssistiveText, this.sourceLabel);
    }

    /**
     * Label for remove button.
     * @type {string}
     * @default "Move Selection to {sourceLabel}"
     */
    get removeButtonDescription() {
        return this.getLeftButtonAssistiveText();
    }

    getLeftButtonAssistiveLabel() {
        return formatLabel(i18n.moveToAssistiveText, this.sourceLabel);
    }

    /**
     * Label for remove button.
     * @type {string}
     * @default "Move selection to {sourceLabel}"
     */
    @api
    get removeButtonLabel() {
        if (this._removeButtonLabel) {
            return this._removeButtonLabel;
        }
        return this.getLeftButtonAssistiveLabel();
    }

    set removeButtonLabel(value) {
        this._removeButtonLabel = value;
    }

    /**
     * Label for up button.
     * @type {string}
     * @default "Move selection up"
     */
    @api
    get upButtonLabel() {
        return this._upButtonLabel || this.i18n.upButtonAssistiveText;
    }

    set upButtonLabel(value) {
        this._upButtonLabel = value;
    }

    /**
     * Label for down button.
     * @type {string}
     * @default "Move selection down"
     */
    @api
    get downButtonLabel() {
        return this._downButtonLabel || this.i18n.downButtonAssistiveText;
    }

    set downButtonLabel(value) {
        this._downButtonLabel = value;
    }

    get moveButtonsDisabled() {
        return this.disabled || this.showActivityIndicator;
    }

    handleOptionClick(event) {
        this.interactingState.interacting();
        if (this.disabled || this.isOptionDisabled(event.currentTarget)) {
            return;
        }
        const selectMultiple = event.metaKey || event.ctrlKey || event.shiftKey;
        const option = event.currentTarget;
        if (event.shiftKey) {
            this.selectAllFromLastSelectedToOption(option, false);
            return;
        }
        const selected =
            selectMultiple && option.getAttribute('aria-selected') === 'true';
        this.updateSelectedOptions(option, !selected, selectMultiple);
        this.shiftIndex = -1;
    }

    handleFocus(event) {
        this.interactingState.enter();

        // select the focused option if entering a listbox
        const element = event.target;
        if (element.role === 'option') {
            if (!this.isFocusOnList) {
                this.isFocusOnList = true;
                this.updateSelectedOptions(element, true, false);
            }
        }
    }

    handleBlur(event) {
        this.interactingState.leave();

        const element = event.target;
        if (element.role !== 'option') {
            this.isFocusOnList = false;
        }
    }

    handleRightButtonClick() {
        this.interactingState.interacting();
        this.moveOptionsBetweenLists(true);
    }

    handleLeftButtonClick() {
        this.interactingState.interacting();
        this.moveOptionsBetweenLists(false);
    }

    handleUpButtonClick() {
        this.interactingState.interacting();
        this.changeOrderOfOptionsInList(true);
    }

    handleDownButtonClick() {
        this.interactingState.interacting();
        this.changeOrderOfOptionsInList(false);
    }

    handleOptionKeyDown(event) {
        this.interactingState.interacting();
        if (this.disabled) {
            return;
        }
        handleKeyDownOnOption(event, this.keyboardInterface);
    }

    moveOptionsBetweenLists(addToSelect, retainFocus) {
        const isValidList = addToSelect
            ? this.selectedList === this.computedSourceListId
            : this.selectedList === this.computedSelectedListId;
        if (!isValidList) {
            return;
        }
        const toMove = this.highlightedOptions;
        const values = this.computedSelectedList.map((option) => option.value);
        const required = this.requiredOptions;
        let newValues = [];
        if (addToSelect) {
            newValues = values.concat(toMove);
        } else {
            newValues = values.filter(
                (value) =>
                    toMove.indexOf(value) === -1 || required.indexOf(value) > -1
            );
        }

        this.movedOptions(addToSelect);

        const oldSelectedValues = this._selectedValues;
        this._selectedValues = newValues;
        const invalidMove =
            this.validity.valueMissing ||
            (this.validity.rangeOverflow &&
                this.selectedList === this.computedSourceListId) ||
            (this.validity.rangeUnderflow &&
                this.selectedList === this.computedSelectedListId);

        if (invalidMove || toMove.length === 0) {
            this.showHelpMessageIfInvalid();
            this._selectedValues = oldSelectedValues;
            return;
        }

        if (retainFocus) {
            const listId = addToSelect
                ? this.computedSelectedListId
                : this.computedSourceListId;
            this.selectedList = listId;
            this.updateFocusableOption(listId, toMove[0]);
        } else {
            this.interactingState.leave();
            this.isFocusOnList = false;
            this.highlightedOptions = [];
            this.highlightedOptionsLabel = [];
            this.optionToFocus = null;
        }

        this.dispatchChangeEvent(newValues);
    }

    changeOrderOfOptionsInList(moveUp) {
        const elementList = this.getElementsOfList(this.selectedList);
        const values = this.computedSelectedList.map((option) => option.value);
        const toMove = values.filter(
            (option) => this.highlightedOptions.indexOf(option) > -1
        );
        const inValidSelection =
            !toMove.length || this.selectedList !== this.computedSelectedListId;

        if (inValidSelection) {
            return;
        }

        let start = moveUp ? 0 : toMove.length - 1;
        let index = values.indexOf(toMove[start]);

        const nextItemIndex = moveUp ? index - 1 : index + 1;
        const previousItem = this.computedSelectedList[nextItemIndex];
        const isPreviousItemLocked = !!previousItem?.isLocked;

        const inValidMove =
            (moveUp && index === 0) ||
            (!moveUp && index === values.length - 1) ||
            isPreviousItemLocked;

        if (inValidMove) {
            return;
        }

        if (moveUp) {
            while (start < toMove.length) {
                index = values.indexOf(toMove[start]);
                this.swapOptions(index, index - 1, values, elementList);
                start++;
            }
        } else {
            while (start > -1) {
                index = values.indexOf(toMove[start]);
                this.swapOptions(index, index + 1, values, elementList);
                start--;
            }
        }

        this._selectedValues = values;
        this.updateFocusableOption(this.selectedList, toMove[0]);
        this.optionToFocus = null;
        this.dispatchChangeEvent(values);
        this.selectedUpDownMovedOptions();
    }

    selectAllFromLastSelectedToOption(option, all) {
        const listId = option.getAttribute('data-type');
        this.updateCurrentSelectedList(listId, true);
        const options = this.getElementsOfList(listId);
        const end = all ? 0 : this.getOptionIndex(option);
        this.lastSelected = this.lastSelected < 0 ? end : this.lastSelected;
        const start = all ? options.length : this.lastSelected;
        let val, select;
        this.highlightedOptions = [];
        this.highlightedOptionsLabel = [];
        for (let i = 0; i < options.length; i++) {
            select = (i - start) * (i - end) <= 0;
            if (select && !this.isOptionDisabled(options[i])) {
                val = options[i].getAttribute('data-value');
                this.highlightedOptions.push(val);
            }
        }
    }

    updateSelectedOptions(option, select, isMultiple) {
        if (this.isOptionDisabled(option)) {
            return;
        }

        const value = option.getAttribute('data-value');
        const listId = this.getListId(option);
        const optionIndex = this.getOptionIndex(option);
        this.updateCurrentSelectedList(listId, isMultiple);
        if (select) {
            if (this.highlightedOptions.indexOf(value) === -1) {
                this.highlightedOptions.push(value);
            }
        } else {
            this.highlightedOptions.splice(
                this.highlightedOptions.indexOf(value),
                1
            );
        }

        this.updateFocusableOption(listId, value);

        this.lastSelected = optionIndex;
    }

    addRequiredOptionsToValue() {
        if (
            !this.options ||
            !this.options.length ||
            !this._requiredOptions ||
            !this._requiredOptions.length
        ) {
            // no options/requiredOptions, just ignore
            return;
        }

        const numOfSelectedValues = this._selectedValues.length;
        const allValues = this.options.map((option) => option.value);

        const requiredValues = this._requiredOptions.filter((option) =>
            allValues.includes(option)
        );

        // add required options to the selected values as they are already displayed in the selected list
        this._selectedValues = [
            ...new Set([...requiredValues, ...this._selectedValues]),
        ];

        if (numOfSelectedValues !== this._selectedValues.length) {
            // value was changed
            this.dispatchChangeEvent(this._selectedValues);
        }
    }

    get _constraint() {
        if (!this._constraintApi) {
            this._constraintApi = new FieldConstraintApi(() => this, {
                valueMissing: () =>
                    !this.disabled &&
                    this.required &&
                    this.computedSelectedList.length < 1,
                rangeUnderflow: () =>
                    this.computedSelectedList.length < this.min,
                rangeOverflow: () =>
                    this.computedSelectedList.length > this.max,
            });
        }
        return this._constraintApi;
    }

    get _overflowMessage() {
        const minHelpMsg =
            this.min > 0 ? formatLabel(this.i18n.minHelp, this.min) : '';

        return formatLabel(this.i18n.maxError, this.max) + minHelpMsg;
    }

    get _underflowMessage() {
        const maxHelpMsg = this.max
            ? formatLabel(this.i18n.maxHelp, this.max)
            : '';
        const minRequiredError =
            this.min > 1
                ? formatLabel(this.i18n.minRequiredErrorPlural, this.min)
                : this.i18n.minRequiredErrorSingular;
        const minError =
            this.min > 1
                ? formatLabel(this.i18n.minErrorPlural, this.min)
                : this.i18n.minErrorSingular;

        return this.required
            ? minRequiredError + maxHelpMsg
            : minError + maxHelpMsg;
    }

    updateCurrentSelectedList(currentList, isMultiple) {
        if (this.selectedList !== currentList || !isMultiple) {
            if (this.selectedList) {
                this.highlightedOptions = [];
                this.highlightedOptionsLabel = [];
                this.lastSelected = -1;
            }
            this.selectedList = currentList;
        }
    }

    dispatchChangeEvent(values) {
        if (isCSR) {
            // the change event needs to propagate to elements outside of the light-DOM, hence making it composed.
            this.dispatchEvent(
                new CustomEvent('change', {
                    composed: true,
                    bubbles: true,
                    detail: { value: values },
                })
            );
        }
    }

    assertRequiredAttributes() {
        assert(
            !!this.label,
            `<lightning-dual-listbox> Missing required "label" attribute.`
        );
        assert(
            !!this.sourceLabel,
            `<lightning-dual-listbox> Missing required "sourceLabel" attribute.`
        );
        assert(
            !!this.selectedLabel,
            `<lightning-dual-listbox> Missing required "selectedLabel" attribute.`
        );
        assert(
            !!this.options,
            `<lightning-dual-listbox> Missing required "options" attribute.`
        );
    }

    swapOptions(i, j, array) {
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    getElementsOfList(listId) {
        const elements = isCSR
            ? this.template.querySelectorAll(`div[data-type='${listId}']`)
            : null;
        return elements ? elements : [];
    }

    selectKeyboardInterface() {
        const that = this;
        that.shiftIndex = -1;
        that.lastShift = null;
        return {
            getShiftIndex() {
                return that.shiftIndex;
            },
            setShiftIndex(value) {
                that.shiftIndex = value;
            },
            getLastShift() {
                return that.lastShift;
            },
            setLastShift(value) {
                that.lastShift = value;
            },
            getElementsOfList(listId) {
                return that.getElementsOfList(listId);
            },
            selectAllOptions(option) {
                that.selectAllFromLastSelectedToOption(option, true);
            },
            updateSelectedOptions(option, select, isMultiple) {
                that.updateSelectedOptions(option, select, isMultiple);
            },
            moveOptionsBetweenLists(addToSelect) {
                that.moveOptionsBetweenLists(addToSelect, true);
            },
        };
    }

    getOptionIndex(optionElement) {
        return parseInt(optionElement.getAttribute('data-index'), 10);
    }

    getListId(optionElement) {
        return getRealDOMId(optionElement.parentElement.parentElement);
    }

    updateFocusableOption(listId, value) {
        if (listId === this.computedSourceListId) {
            this.focusableInSource = value;
        } else if (listId === this.computedSelectedListId) {
            this.focusableInSelected = value;
        }
        this.optionToFocus = value;
    }

    isNumber(value) {
        return value !== '' && value !== null && isFinite(value);
    }

    /**
     * If the new value is different than internal selected values,
     * we need to un-highlight the already highlighted options
     *
     * @param newValue
     */
    updateHighlightedOptions(newValue) {
        let isSame = false;
        if (
            newValue &&
            newValue.length &&
            this._selectedValues &&
            this._selectedValues.length
        ) {
            isSame =
                newValue.length === this._selectedValues.length &&
                newValue.every((option) =>
                    this._selectedValues.includes(option)
                );
        }
        if (!isSame) {
            this.highlightedOptions = [];
            this.highlightedOptionsLabel = [];
        }
    }

    movedOptions(addToSelect) {
        const listName = addToSelect ? this.selectedLabel : this.sourceLabel;

        for (let i = 0; i < this.highlightedOptions.length; i++) {
            let selectedOption = addToSelect
                ? this.computedSourceList.filter(
                      (item) => item.value === this.highlightedOptions[i]
                  )
                : this.computedSelectedList.filter(
                      (item) => item.value === this.highlightedOptions[i]
                  );
            this.highlightedOptionsLabel.push(selectedOption[0].label);
        }

        if (this.highlightedOptions.length) {
            const strToFormat =
                this.highlightedOptions.length > 1
                    ? i18n.movedOptionsPlural
                    : i18n.movedOptionsSingular;
            this._messageToDisplay = formatLabel(
                strToFormat,
                this.highlightedOptionsLabel.join(', '),
                listName
            );
        } else {
            this._messageToDisplay = '';
        }
    }

    get helptextAlternativeText() {
        return formatLabel(i18n.helpTextAlternativeText, this.label);
    }

    selectedUpDownMovedOptions() {
        let strMessage = [];
        for (let i = 0; i < this.computedSelectedList.length; i++) {
            const highlightedOption = this.highlightedOptions.indexOf(
                this.computedSelectedList[i].value
            );
            if (highlightedOption !== -1) {
                strMessage.push(
                    formatLabel(
                        i18n.verticallyMovedOptionsText,
                        this.computedSelectedList[i].label,
                        i + 1
                    )
                );
            }
        }
        if (strMessage.length === 0) {
            this._messageToDisplay = '';
        } else {
            this._messageToDisplay = strMessage.join(', ');
        }
    }
}
