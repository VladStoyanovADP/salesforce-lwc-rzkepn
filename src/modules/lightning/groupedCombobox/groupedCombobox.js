/* eslint-disable @lwc/lwc/no-api-reassignments */

import labelRequired from '@salesforce/label/LightningControl.required';
import labelPlaceholder from '@salesforce/label/LightningCombobox.placeholder';
import labelHelpTextAlternativeText from '@salesforce/label/LightningInput.helptextAlternativeText';
import { api, track } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet, formatLabel } from 'lightning/utils';
import {
    assert,
    synchronizeAttrs,
    reflectAttribute,
} from 'lightning/utilsPrivate';
import {
    isEmptyString,
    generateUniqueId,
    InteractingState,
    FieldConstraintApi,
    normalizeVariant,
    VARIANT,
} from 'lightning/inputUtils';

const i18n = {
    required: labelRequired,
    helpTextAlternativeText: labelHelpTextAlternativeText,
    placeholder: labelPlaceholder,
};

export default class LightningGroupedCombobox extends LightningShadowBaseClass {
    static validationOptOut = ['class'];

    @api label;
    @api inputIconName = 'utility:search';
    @api inputIconSize = 'x-small';
    @api inputIconAlternativeText;
    // TODO: Consider renaming this to `inputMaxLength`
    @api inputMaxlength;
    // TODO: Rename to `showInputActivityIndicator`
    @api showActivityIndicator = false;
    @api showDropdownActivityIndicator = false;
    @api placeholder = i18n.placeholder;

    // Validity related message
    @api messageWhenValueMissing = i18n.required;

    @api name;
    @api value;
    @api required = false;
    @api disabled = false;
    @api readOnly = false;

    @api inputPill;
    @api filterLabel;
    @api filterItems;
    @api filterInputText;

    /**
     * Whether disable the highlighting default item behavior
     *
     * @type {boolean}
     * @memberof LightningGroupedCombobox
     */
    @api disableDefaultHighlight;

    @api customRole = 'combobox';
    @api customAriaHasPopup = 'listbox';

    @track _pills;

    @track _variant;
    @track _items = [];

    @track _expandPillContainer = true;
    @track _highlightedOptionElementId = '';
    @track _helpMessage;
    @track _fieldLevelHelp;
    @track _inputText = '';

    _filterInputId;
    _mainInputId;
    _initialized = false;

    constructor() {
        super();
        this._mainInputId = generateUniqueId();
        this._filterInputId = generateUniqueId();
    }

    connectedCallback() {
        super.connectedCallback();
        this._connected = true;
        this.classList.add('slds-form-element');

        this.interactingState = new InteractingState({
            // keeps interacting state when switching between two comboboxes and the pill container
            debounceInteraction: true,
        });

        this.interactingState.onleave(() => {
            this.reportValidity();
        });
    }

    renderedCallback() {
        if (!this._initialized) {
            this._initialized = true;
            this.inputText = this._inputText;
        }

        this.synchronizeA11y();
        reflectAttribute(
            this.template.querySelector('[data-lookup]'),
            'data-filter-on',
            this.computedHasFilter
        );
    }

    disconnectedCallback() {
        this._connected = false;
    }

    @api
    get inputText() {
        return this._inputText;
    }

    set inputText(text) {
        this._inputText = text;
        if (this._connected) {
            this.template.querySelector('[data-lookup]').inputText = text;
        }
    }

    @api
    get pills() {
        return this._pills;
    }

    set pills(newPills) {
        assert(Array.isArray(newPills), '"pills" must be an array.');

        if (this._connected && (!newPills || newPills.length === 0)) {
            if (this._focusOnPills) {
                // check why requestAnimationFrame is needed, something is stealing focus otherwise
                // eslint-disable-next-line @lwc/lwc/no-async-operation
                requestAnimationFrame(() => {
                    this.lookupCombobox.focus();
                });
            }
        }

        this._pills = newPills;
    }

    @api
    get fieldLevelHelp() {
        return this._fieldLevelHelp;
    }

    set fieldLevelHelp(value) {
        this._fieldLevelHelp = value;
    }

    @api
    get variant() {
        return this._variant || VARIANT.STANDARD;
    }

    set variant(value) {
        this._variant = normalizeVariant(value);
    }

    set items(items = []) {
        this._items = items;

        if (items) {
            assert(Array.isArray(items), '"items" must be an array.');
        }
    }

    @api
    get items() {
        return this._items;
    }

    @api
    highlightInputText() {
        if (this._connected) {
            this.lookupCombobox.highlightInputText();
        }
    }

    /**
     * Sets focus on the input element.
     */
    @api
    focus() {
        if (this._connected) {
            this.lookupCombobox.focus();
        }
    }

    @api
    focusAndOpenDropdownIfNotEmpty() {
        if (this._connected) {
            this.lookupCombobox.focusAndOpenDropdownIfNotEmpty();
        }
    }

    /**
     * Removes focus from the input element.
     */
    @api
    blur() {
        if (this._connected) {
            this.lookupCombobox.blur();
        }
    }

    @api
    get validity() {
        return this._constraint.validity;
    }

    @api
    checkValidity() {
        return this._constraint.checkValidity();
    }

    @api
    reportValidity() {
        return this._constraint.reportValidity((message) => {
            // manage invalid attribute on the base combobox
            // this is done to allow css to target invalid base-combobox state
            // we may want to update the logic in base combobox to handle this
            // more generally once more usages like grouped, lookupaddress etc. are migrated
            reflectAttribute(
                this.template.querySelector('lightning-base-combobox'),
                'invalid',
                !this.checkValidity()
            );
            this._helpMessage = message;
        });
    }

    @api
    setCustomValidity(message) {
        this._constraint.setCustomValidity(message);
    }

    @api
    showHelpMessageIfInvalid() {
        this.reportValidity();
    }

    get computedUniqueHelpElementId() {
        return this._helpMessage ? this._mainInputId + '-error' : null;
    }

    get lookupCombobox() {
        return this.template.querySelector('[data-lookup]');
    }

    get i18n() {
        return i18n;
    }

    get isLabelHidden() {
        return this.variant === VARIANT.LABEL_HIDDEN;
    }

    get computedLabelClass() {
        return classSet('slds-form-element__label')
            .add({ 'slds-assistive-text': this.isLabelHidden })
            .toString();
    }

    get computedComboboxGroupClass() {
        return classSet().add({
            'slds-combobox-group': this.computedHasFilter,
        });
    }

    get computedHasFilter() {
        return Array.isArray(this.filterItems);
    }

    get computedLookupComboboxClass() {
        return classSet().add({
            'slds-has-selection':
                Array.isArray(this._pills) && this._pills.length > 0,
            'slds-combobox-addon_end': this.computedHasFilter,
        });
    }

    get _hasPills() {
        return this.pills && this.pills.length > 0;
    }

    get _constraint() {
        if (!this._constraintApi) {
            this._constraintApi = new FieldConstraintApi(() => this, {
                valueMissing: () =>
                    !this.disabled &&
                    this.required &&
                    isEmptyString(this.value),
            });
        }
        return this._constraintApi;
    }

    handleLookupReady(event) {
        this._mainInputId = event.detail.id;
    }

    handleFilterReady(event) {
        this._filterInputId = event.detail.id;
    }

    handleDropdownOpenRequest() {
        this.dispatchEvent(new CustomEvent('dropdownopenrequest'));
    }

    handleDropdownOpen() {
        this.dispatchEvent(new CustomEvent('dropdownopen'));
    }

    handlePillRemove(event) {
        if (!this.disabled) {
            this.dispatchEvent(
                new CustomEvent('pillremove', { detail: event.detail })
            );
        }
    }

    handleClick() {
        this.dispatchEvent(new CustomEvent('inputclick'));
    }

    handleTextChange(event) {
        this._inputText = event.detail.text;

        this.dispatchEvent(
            new CustomEvent('textchange', {
                detail: { text: event.detail.text },
            })
        );
    }

    handleTextInput(event) {
        this._inputText = event.detail.text;

        this.dispatchEvent(
            new CustomEvent('textinput', {
                detail: { text: event.detail.text },
            })
        );
    }

    handleSelect(event) {
        this.dispatchEvent(
            new CustomEvent('select', { detail: { value: event.detail.value } })
        );
    }

    handleSelectFilter(event) {
        const selectedFilterValue = event.detail.value;

        this.dispatchEvent(
            new CustomEvent('selectfilter', {
                detail: { value: selectedFilterValue },
            })
        );
    }

    // TODO: This should be renamed to `scrollend` or something similar (no -ed at the end)
    handleEndReached() {
        this.dispatchEvent(new CustomEvent('endreached'));
    }

    handleFocus() {
        this.interactingState.enter();
        this._expandPillContainer = true;

        this.dispatchEvent(new CustomEvent('focus'));
    }

    handlePillsFocus() {
        this.handleFocus();

        this._focusOnPills = true;
    }

    handlePillsBlur() {
        this.handleBlur();

        this._focusOnPills = false;
    }

    handleBlur() {
        // Once https://github.com/salesforce/lwc/issues/444 is fixed, consider switching to
        // `onfocusout` and `event.relatedTarget` to determine whether the focus stayed in the component,
        // this way the use of async blur can be avoided.
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        requestAnimationFrame(() => {
            this.interactingState.leave();

            this.dispatchEvent(new CustomEvent('blur'));
            if (this.pills && this.pills.length > 0) {
                // Sometimes (involves focusing on lower pills) the pill container scrolls and the top
                // line with the "+ n more" button does not show so we have to manually scroll to the top.
                // We need to figure a better solution for this.
                // eslint-disable-next-line @lwc/lwc/no-async-operation
                requestAnimationFrame(() => {
                    if (this._connected) {
                        // If a new pill has been added but the markup-conditional hasn't had a chance to
                        // initialize the pill container, and causes a null gack. Adding a quick safety
                        // check here to avoid this case
                        const pillContainer = this.template.querySelector(
                            'lightning-pill-container'
                        );
                        if (pillContainer) {
                            pillContainer.scrollTop = 0;
                        }
                    }
                });
            }
        });
    }

    synchronizeA11y() {
        const label = this.template.querySelector('[data-main-label]');
        const filterLabel = this.template.querySelector('[data-filter-label]');
        const helpMessage = this.template.querySelector('[data-help-message]');
        // const filter = this.template.querySelector('[data-filter]');
        const lookup = this.template.querySelector('[data-lookup]');
        if (helpMessage) {
            lookup.inputDescribedByElements = helpMessage.id;
        }
        synchronizeAttrs(label, {
            for: this._mainInputId,
        });
        synchronizeAttrs(filterLabel, {
            for: this._filterInputId,
        });
    }

    get helptextAlternativeText() {
        return formatLabel(i18n.helpTextAlternativeText, this.label);
    }
}
