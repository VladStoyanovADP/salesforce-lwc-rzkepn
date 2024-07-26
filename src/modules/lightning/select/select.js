import labelRequired from '@salesforce/label/LightningControl.required';
import labelHelpTextAlternativeText from '@salesforce/label/LightningInput.helptextAlternativeText';
import { api, track } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet, formatLabel } from 'lightning/utils';
import {
    classListMutation,
    normalizeBoolean,
    reflectAttribute,
    isNativeComponent,
    isCSR,
} from 'lightning/utilsPrivate';
import {
    FieldConstraintApi,
    InteractingState,
    isEmptyString,
    getErrorMessage,
    normalizeVariant,
    VARIANT,
} from 'lightning/inputUtils';
import AriaObserver from 'lightning/ariaObserver';

const i18n = {
    required: labelRequired,
    helpTextAlternativeText: labelHelpTextAlternativeText,
};

export default class LightningSelect extends LightningShadowBaseClass {
    static delegatesFocus = true;
    static validationOptOut = ['class'];

    /**
     * The text label for the component.
     * To hide the label but make it available to assistive technologies,
     * use the label-hidden variant.
     * @type {string}
     */
    @api label;

    /**
     * The identifier for the component.
     * @type {string}
     */
    @api name;

    /**
     * The error message that's displayed below the menu
     * when a user interacts with the menu but does not select an option.
     * @type {string}
     */
    @api messageWhenValueMissing;

    /**
     * A shortcut key that activates and focuses on the menu.
     * @type {string}
     */
    @api accessKey;

    /**
     * Reserved for internal use. Controls auto-filling of the field.
     * @type {string}
     */
    @api autocomplete;

    @track _options = [];

    _helpMessage = '';
    _selectedValue;
    _variant;
    _required = false;
    _disabled = false;
    _multiple = false;
    _fieldLevelHelp;
    _size;
    _ariaDescribedBy = '';
    _ariaLabelledBy = '';
    _helpMessageChanged = false;
    ariaObserver = null;

    constructor() {
        super();
        this.ariaObserver = new AriaObserver(this);
        this._isNativeShadow = isNativeComponent(this);
    }

    connectedCallback() {
        super.connectedCallback();
        if (!this.ariaObserver) {
            this.ariaObserver = new AriaObserver(this);
        }
        this._connected = true;
        this.classList.add('slds-form-element');
        this.updateClassList();
        this.interactingState = new InteractingState();
        this.interactingState.onleave(() => this.reportValidity());
    }

    renderedCallback() {
        if (this.isConnected) {
            this.ariaObserver.sync(this._isNativeShadow);
        }
        if (!this._rendered) {
            this.connectAriaDescribedBy();
            this.connectAriaLabelledBy();
            this._rendered = true;
        }
        if (this.options && this._selectedValue !== undefined) {
            this.selectOptionsByValue(this._selectedValue);
        }
        // If the help message changed, the help message element needs to be (un)related
        if (this._helpMessageChanged) {
            this.connectAriaDescribedBy();
            this._helpMessageChanged = false;
        }
    }

    disconnectedCallback() {
        this._connected = false;
        if (this.ariaObserver && this.ariaObserver.disconnect) {
            this.ariaObserver.disconnect();
            this.ariaObserver = null;
        }
    }

    get computedAriaInvalid() {
        return !!this._helpMessage || undefined;
    }

    /**
     * Help text detailing the purpose and function of the menu of options.
     * The text is displayed in a tooltip above the menu.
     * @type {string}
     */
    @api
    get fieldLevelHelp() {
        return this._fieldLevelHelp;
    }

    set fieldLevelHelp(value) {
        this._fieldLevelHelp = value;
    }

    /**
     * The variant changes the appearance of the dropdown menu.
     * Accepted variants include standard, label-inline, label-hidden, and label-stacked.
     * This value defaults to standard, which displays the label above the dropdown menu.
     * label-hidden hides the label but make it available to assistive technology.
     * label-inline horizontally aligns the label and dropdown menu.
     * label-stacked places the label above the dropdown menu.
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
     * Specifies whether multiple options can be selected.
     * @type {boolean}
     * @default false
     */
    @api
    get multiple() {
        return this._multiple;
    }

    set multiple(value) {
        this._multiple = normalizeBoolean(value);
        reflectAttribute(this, 'multiple', this._multiple);
    }

    /**
     * The number of rows in the list that should be visible at one time.
     * Use this attribute with the multiple attribute.
     * @type {number}
     * @default 4
     */
    @api
    get size() {
        if (!this.multiple) {
            return null;
        }

        if (this._size === undefined) {
            return '4';
        }
        return this._size;
    }

    set size(newValue) {
        this._size = newValue;
    }

    /**
     * Specifies whether an option must be selected.
     * @type {boolean}
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
     * Specifies whether the menu is disabled and users cannot interact with it.
     * @type {boolean}
     * @default false
     */
    @api
    get disabled() {
        return this._disabled;
    }

    set disabled(value) {
        this._disabled = normalizeBoolean(value);
    }

    /**
     * The value of the selected option.
     * If empty and a value is required, the component is in an invalid state.
     * @type {string}
     */
    @api
    get value() {
        return this._selectedValue;
    }

    set value(newValue) {
        this._selectedValue = newValue;
        if (this.isConnected) {
            this.selectOptionsByValue(newValue);
        }
    }

    /**
     * An array of menu options with key-value pairs for label and value.
     * @type {object}
     */
    @api
    get options() {
        return this._options;
    }

    set options(newValue) {
        this._options = newValue;

        if (this.isConnected && newValue) {
            this.selectOptionsByValue(this._selectedValue);
        }
    }

    /**
     * Aria Described by value on parent lighting-select
     * @type {string}
     */
    @api
    get ariaDescribedBy() {
        return this._ariaDescribedBy;
    }
    set ariaDescribedBy(elements) {
        this._ariaDescribedBy = elements;
        this.connectAriaDescribedBy();
    }
    /**
     * A space-separated list of element IDs that provide labels for the
     * aria-labelled-by value on parent lighting-select.
     * @type {string}
     */
    @api
    get ariaLabelledBy() {
        return this._ariaLabelledBy;
    }
    set ariaLabelledBy(references) {
        this._ariaLabelledBy = references;
        this.connectAriaLabelledBy();
    }

    updateClassList() {
        classListMutation(this.classList, {
            'slds-form-element_stacked': this.variant === VARIANT.LABEL_STACKED,
            'slds-form-element_horizontal':
                this.variant === VARIANT.LABEL_INLINE,
        });
    }

    /**
     * Sets focus on the select element.
     */
    @api
    focus() {
        if (this.isConnected) {
            this.selectElement.focus();
        }
    }

    /**
     * Removes focus on from the select element.
     */
    @api
    blur() {
        if (this.isConnected) {
            this.selectElement.blur();
        }
    }

    /**
     * Represents the validity states that an element can be in, with respect to constraint validation.
     * @type {object}
     *
     */
    @api
    get validity() {
        return this._constraint.validity;
    }

    /**
     * Checks if the input is valid.
     * @returns {boolean} Indicates whether the element meets all constraint validations.
     */
    @api
    checkValidity() {
        return this._constraint.checkValidity();
    }

    /**
     * Sets a custom error message to be displayed when a form is submitted.
     * @param {string} message - The string that describes the error. If message is an empty string, the error message is reset.
     */
    @api
    setCustomValidity(message) {
        this._constraint.setCustomValidity(message);
        this.customErrorMessage = message;
    }

    /**
     * Displays the error messages and returns false if the input is invalid.
     * If the input is valid, reportValidity() clears displayed error messages and returns true.
     * @returns {boolean} - The validity status of the input fields.
     */
    @api
    reportValidity() {
        return this._constraint.reportValidity((message) => {
            this._helpMessage = message;
            this._helpMessageChanged = true;
        });
    }

    /**
     * Displays an error message on an invalid select field.
     * An invalid field fails at least one constraint validation
     * and returns false when checkValidity() is called.
     */
    @api
    showHelpMessageIfInvalid() {
        const validity = this.validity;
        if (validity.valid) {
            this._helpMessage = '';
            this.classList.remove('slds-has-error');
        } else {
            this.classList.add('slds-has-error');
            this._helpMessage = getErrorMessage(validity, {
                valueMissing: this.messageWhenValueMissing,
                customError: this.customErrorMessage,
            });
            this._helpMessageChanged = true;
        }
    }

    get i18n() {
        return i18n;
    }

    get selectElement() {
        return this.template.querySelector('select');
    }

    get isLabelHidden() {
        return this.variant === VARIANT.LABEL_HIDDEN;
    }

    get computedLabelClass() {
        return classSet('slds-form-element__label')
            .add({ 'slds-assistive-text': this.isLabelHidden })
            .toString();
    }

    get _constraint() {
        if (!this._constraintApi) {
            this._constraintApi = new FieldConstraintApi(() => this, {
                valueMissing: () => {
                    const isMultipleAndNoValue =
                        this.multiple &&
                        (!this.value || this.value.length === 0);
                    return (
                        !this.disabled &&
                        this.required &&
                        (isEmptyString(this.value) || isMultipleAndNoValue)
                    );
                },
            });
        }
        return this._constraintApi;
    }

    handleChange(event) {
        event.preventDefault();
        event.stopPropagation();

        this._selectedValue = this.getSelectedOptionValues();

        this.dispatchEvent(
            new CustomEvent('change', {
                bubbles: true,
                composed: true,
                detail: {
                    value: this._selectedValue,
                },
            })
        );
    }

    handleFocus() {
        this.interactingState.enter();

        this.dispatchEvent(new CustomEvent('focus'));
    }

    handleBlur() {
        this.interactingState.leave();

        this.dispatchEvent(new CustomEvent('blur'));
    }

    connectAriaDescribedBy() {
        if (isCSR) {
            this.ariaObserver.connect({
                targetSelector: 'select',
                attribute: 'aria-describedby',
                relatedNodeIds: this.ariaDescribedBy,
                relatedNodes: this.template.querySelector(
                    '[data-help-message]'
                ),
            });
        }
    }

    connectAriaLabelledBy() {
        if (isCSR) {
            this.ariaObserver.connect({
                targetSelector: 'select',
                attribute: 'aria-labelledby',
                relatedNodeIds: this.ariaLabelledBy,
            });
        }
    }

    selectOptionsByValue(optionValue) {
        if (this.multiple) {
            if (Array.isArray(optionValue)) {
                const options = this.template.querySelectorAll('option');
                options.forEach((option) => {
                    option.selected = optionValue.includes(option.value);
                });
            }
        } else {
            this.selectElement.value = optionValue;
        }
    }

    getSelectedOptionValues() {
        if (this.multiple) {
            const options = this.template.querySelectorAll('option');
            return Array.prototype.reduce.call(
                options,
                (selectedValues, option) => {
                    if (option.selected) {
                        selectedValues.push(option.value);
                    }
                    return selectedValues;
                },
                []
            );
        }
        return this.selectElement.value;
    }

    get helptextAlternativeText() {
        return formatLabel(i18n.helpTextAlternativeText, this.label);
    }
}
