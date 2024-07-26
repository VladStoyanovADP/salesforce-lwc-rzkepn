/* eslint-disable @lwc/lwc/no-api-reassignments */

import labelRequired from '@salesforce/label/LightningControl.required';
import labelHelpTextAlternativeText from '@salesforce/label/LightningInput.helptextAlternativeText';
import { api, track } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet, formatLabel } from 'lightning/utils';
import {
    normalizeBoolean,
    classListMutation,
    decorateInputForDragon,
    reflectAttribute,
    setDecoratedDragonInputValueWithoutEvent,
    computeAriaInvalid,
    isNativeComponent,
    isCSR,
} from 'lightning/utilsPrivate';
import {
    InteractingState,
    normalizeVariant,
    FieldConstraintApiWithProxyInput,
    isEmptyString,
    VARIANT,
} from 'lightning/inputUtils';
import { TouchScroller } from 'lightning/touchScrollLibrary';
import AriaObserver from 'lightning/ariaObserver';

const i18n = {
    required: labelRequired,
    helpTextAlternativeText: labelHelpTextAlternativeText,
};

/**
 * Represents a multiline text input field.
 */
export default class LightningTextarea extends LightningShadowBaseClass {
    static delegatesFocus = true;

    // Private Variables
    @track _maxLength;
    @track _minLength;
    @track _defaultValue = '';
    @track _disabled = false;
    @track _required = false;
    @track _readOnly = false;
    @track _variant;

    @track _helpMessage;
    @track _fieldLevelHelp;
    _ariaDescribedBy = '';
    _ariaLabelledBy = '';
    _helpMessageChanged = false;
    ariaObserver = null;

    static validationOptOut = ['class'];

    /************************* PUBLIC PROPERTIES *************************/

    /**
     * Controls auto-filling of the field. Set the attribute to pass
     * through autocomplete values to be interpreted by the browser.
     * @type {string}
     */
    @api autocomplete;

    /**
     * Text that describes the textarea input field.
     * @type {string}
     * @required
     */
    @api label;

    /**
     * Text that is displayed when the field is empty,
     * to prompt the user for a valid entry.
     * @type {string}
     */
    @api placeholder;

    /**
     * Specifies the name of an input element.
     * @type {string}
     */
    @api name;

    // Validity related messages
    /**
     * Error message to be displayed when a bad input is detected.
     * @type {string}
     */
    @api messageWhenBadInput;

    /**
     * Error message to be displayed when the value is too short.
     * @type {string}
     */
    @api messageWhenTooShort;

    /**
     * Error message to be displayed when the value is too long.
     * @type {string}
     */
    @api messageWhenTooLong;

    /**
     * Error message to be displayed when the value is missing.
     * @type {string}
     */
    @api messageWhenValueMissing;

    /**
     * The keyboard shortcut for input field.
     * @type {string}
     */
    @api accessKey;

    /**
     * Aria Described by value on parent lighting-textarea
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
     * aria-labelled-by value on parent lighting-textarea.
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

    /**
     * The maximum number of characters allowed in the textarea.
     * @type {number}
     */
    @api
    get maxLength() {
        return this._maxLength;
    }

    set maxLength(value) {
        this._maxLength = value;
        this._updateProxyInputAttributes('maxlength');
    }

    /**
     * The minimum number of characters allowed in the textarea.
     * @type {number}
     */
    @api
    get minLength() {
        return this._minLength;
    }

    set minLength(value) {
        this._minLength = value;
        this._updateProxyInputAttributes('minlength');
    }

    /**
     * The value of the textarea input, also used as the default value during init.
     * @type {string}
     */
    @api
    get value() {
        return this._value;
    }

    set value(value) {
        // W-5026729 - On IE11, set same value again, will trigger another input event.
        if (this._value !== value) {
            this._value = value || '';
            if (this._connected) {
                // We're connected, so no longer need to update the default value, change the actual value instead
                this._setInputValue(this._value);
            } else {
                this._defaultValue = this._value;
            }
        }

        this._updateProxyInputAttributes('value');
    }

    /**
     * If present, the textarea field is disabled and users cannot interact with it.
     * @type {boolean}
     * @default false
     */
    @api
    get disabled() {
        return this._disabled;
    }

    set disabled(value) {
        this._disabled = normalizeBoolean(value);
        this._updateProxyInputAttributes('disabled');
    }

    /**
     * The help text that appears in a popover.
     * Set field-level help to provide an informational tooltip on the textarea input field.
     */
    @api
    get fieldLevelHelp() {
        return this._fieldLevelHelp;
    }

    set fieldLevelHelp(value) {
        this._fieldLevelHelp = value;
    }

    /**
     * If present, the textarea field is read-only and cannot be edited.
     * @type {boolean}
     * @default false
     */
    @api
    get readOnly() {
        return this._readOnly;
    }

    set readOnly(value) {
        this._readOnly = normalizeBoolean(value);
        this._updateProxyInputAttributes('readonly');
    }

    /**
     * If present, the textarea field must be filled out before the form can be submitted.
     * @type {boolean}
     */
    @api
    get required() {
        return this._required;
    }

    set required(value) {
        this._required = normalizeBoolean(value);
        this._updateProxyInputAttributes('required');
    }

    /**
     * The variant changes the appearance of the textarea.
     * Accepted variants include standard, label-hidden, label-inline, and label-stacked.
     * This value defaults to standard.
     * Use label-hidden to hide the label but make it available to assistive technology.
     * Use label-inline to horizontally align the label and textarea.
     * Use label-stacked to place the label above the textarea.
     * @type {string}
     * @default standard
     */
    @api
    get variant() {
        return this._variant || VARIANT.STANDARD;
    }

    set variant(value) {
        this._variant = normalizeVariant(value);
        reflectAttribute(this, 'variant', this._variant);
        this.updateHostClassList();
    }

    /**
     * Represents the validity states of the textarea input, with respect to constraint validation.
     * @type {object}
     */
    @api
    get validity() {
        return this._constraint.validity;
    }

    /************************** PUBLIC METHODS **************************/

    /**
     * Returns the valid attribute value (Boolean) on the ValidityState object.
     * @returns {boolean} Indicates whether the textarea meets all constraint validations.
     */
    @api
    checkValidity() {
        return this._constraint.checkValidity();
    }

    /**
     * Displays the error messages and returns false if the input is invalid.
     * If the input is valid, reportValidity() clears displayed error messages and returns true.
     * @returns {boolean} - The validity status of the textarea.
     */
    @api
    reportValidity() {
        return this._constraint.reportValidity((message) => {
            this._helpMessage = message;
            this._helpMessageChanged = true;
        });
    }

    /**
     * Sets a custom error message to be displayed when the textarea value is submitted.
     * @param {string} message - The string that describes the error. If message is an empty string, the error message is reset.
     */
    @api
    setCustomValidity(message) {
        this._constraint.setCustomValidity(message);
    }

    /**
     * Displays error messages on invalid fields.
     * An invalid field fails at least one constraint validation and returns false when checkValidity() is called.
     */
    @api
    showHelpMessageIfInvalid() {
        this.reportValidity();
    }

    /**
     * Sets focus on the textarea field.
     */
    @api
    focus() {
        if (this._connected) {
            this.inputElement.focus();
        }
    }

    /**
     * Removes focus from the textarea field.
     */
    @api
    blur() {
        if (this._connected) {
            this.inputElement.blur();
        }
    }

    /**
     * Replace a range of text in textarea with a new string.
     * @param {string} replacement - The string to insert.
     * @param {number} start - The 0-based index of the first character to replace.
     * @param {number} end - The 0-based index of the character after the last character to replace.
     * @param {string} selectMode - A string defining how the selection should be set after the text has been replaced.
     *     Possible values:
     *       - 'select': selects the newly inserted text.
     *       - 'start': moves the selection to just before the inserted text.
     *       - 'end': moves the selection to just after the inserted text.
     *       - 'preserve': attempts to preserve the selection. This is the default.
     */
    @api
    setRangeText() {
        if (this._connected) {
            this.inputElement.setRangeText.apply(this.inputElement, arguments);
            this.value = this.inputElement.value;
        }
    }

    /************************** PRIVATE GETTERS **************************/

    get isLabelHidden() {
        return this.variant === VARIANT.LABEL_HIDDEN;
    }

    get i18n() {
        return i18n;
    }

    get computedLabelClass() {
        return classSet('slds-form-element__label')
            .add({ 'slds-assistive-text': this.isLabelHidden })
            .toString();
    }

    get inputElement() {
        if (this._inputElement) {
            return this._inputElement;
        }
        this._inputElement = isCSR
            ? this.template.querySelector('textarea')
            : null;
        decorateInputForDragon(this._inputElement);
        return this._inputElement;
    }

    get _constraint() {
        if (!this._constraintApi) {
            this._constraintApi = new FieldConstraintApiWithProxyInput(
                () => this,
                {
                    // Override validity.valueMissing, which was broken in Edge until May 2018.
                    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/291588/
                    valueMissing: () =>
                        this._required && isEmptyString(this._value),

                    tooShort: () =>
                        this._connected && this.inputElement.validity.tooShort,
                    tooLong: () =>
                        this._connected && this.inputElement.validity.tooLong,
                },
                'textarea'
            );

            this._constraintApiProxyInputUpdater =
                this._constraint.setInputAttributes({
                    value: () => this.value,
                    maxlength: () => this.maxLength,
                    minlength: () => this.minLength,
                    disabled: () => this.disabled,
                    readonly: () => this.readOnly,
                    required: () => this.required,
                });
        }
        return this._constraintApi;
    }

    get computedAriaInvalid() {
        return computeAriaInvalid(this._helpMessage, this.value);
    }

    get helptextAlternativeText() {
        return formatLabel(i18n.helpTextAlternativeText, this.label);
    }

    /************************** LIFECYCLE HOOKS **************************/

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
        this.updateHostClassList();
        this._connected = true;
        this.interactingState = new InteractingState();
        this.interactingState.onleave(() => this.showHelpMessageIfInvalid());
    }

    renderedCallback() {
        if (this.isConnected) {
            this.ariaObserver.sync(this._isNativeShadow);
        }
        // IE11: This is needed to work-around IE11 issue where it would append default value to the place holder,
        // instead of actually setting the value on the textarea element.
        if (!this._rendered) {
            this.connectAriaDescribedBy();
            this.connectAriaLabelledBy();
            this._rendered = true;
            this._setInputValue(this._defaultValue);

            // For non-desktop cases where ui:scroller prevents scrolling within the textarea.
            // The TouchScroller library allows touchmove events to scroll through the content of
            // the textarea but sets appropriate flags in the event to allow ui:scroller to scroll
            // the page when a content boundary is reached.
            const scrollTarget = this.template.querySelector(
                '.textarea-container'
            );
            this.touchScroller = new TouchScroller(scrollTarget);
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

    /************************** EVENT HANDLERS ***************************/

    handleFocus() {
        this.interactingState.enter();
        this.dispatchEvent(new CustomEvent('focus'));
    }

    handleBlur() {
        this.interactingState.leave();
        this.dispatchEvent(new CustomEvent('blur'));
    }

    handleChange(event) {
        // we only fire change event oninput
        // so stop native event here
        event.stopPropagation();
    }

    handleInput(event) {
        event.stopPropagation();

        // If the current value is the same as it was prior to last update, don't fire the event.
        // This allows us to fix an issue with IE11 which fires an 'input' event every time the placeholder
        // is changed, since the value isn't affected we're effectively ignoring such events.
        if (!this._connected || this._value === event.target.value) {
            return;
        }

        this.interactingState.interacting();

        this._value = this.inputElement.value;
        this._updateProxyInputAttributes('value');
        // the change event needs to propagate to elements outside of the light-DOM, hence making it composed.
        this.dispatchEvent(
            new CustomEvent('change', {
                bubbles: true,
                composed: true,
                detail: {
                    value: this._value,
                },
            })
        );
    }

    /************************** HELPER FUNCTIONS **************************/

    connectAriaDescribedBy() {
        const helpMessage = isCSR
            ? this.template.querySelector('[data-help-message]')
            : null;
        this.ariaObserver.connect({
            targetSelector: 'textarea',
            attribute: 'aria-describedby',
            relatedNodeIds: this.ariaDescribedBy,
            relatedNodes: helpMessage,
        });
    }

    connectAriaLabelledBy() {
        this.ariaObserver.connect({
            targetSelector: 'textarea',
            attribute: 'aria-labelledby',
            relatedNodeIds: this.ariaLabelledBy,
        });
    }

    _setInputValue(value) {
        // The underlying input has been modified to dispatch an 'input' event when a direct value set
        // is used to allow for Dragon Natural Speaking (which sets the value directly on the inputs instead
        // dispatching an input event against the input). Since we're in a programatic set here (ie. set
        // not resulting from a direct user interaction) we want a default setter behaviour that doesn't
        // dispatch any events.
        setDecoratedDragonInputValueWithoutEvent(this.inputElement, value);
    }

    _updateProxyInputAttributes(attributes) {
        if (this._constraintApiProxyInputUpdater) {
            this._constraintApiProxyInputUpdater(attributes);
        }
    }

    updateHostClassList() {
        classListMutation(this.classList, {
            'slds-form-element': true,
            'slds-form-element_stacked': this.variant === VARIANT.LABEL_STACKED,
            'slds-form-element_horizontal':
                this.variant === VARIANT.LABEL_INLINE,
        });
    }
}

LightningTextarea.interopMap = {
    exposeNativeEvent: {
        change: true,
        focus: true,
        blur: true,
    },
};
