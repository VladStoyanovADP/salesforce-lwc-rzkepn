import {  api } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet } from 'lightning/utils';
import { VARIANT } from 'lightning/inputUtils';
import { reflectAttribute, isNativeComponent } from 'lightning/utilsPrivate';

export default class LightningPrimitiveInputColor extends LightningShadowBaseClass {
    @api hasExternalLabel;
    @api required;
    @api accessKey;
    @api label;
    @api fieldLevelHelp;
    @api helptextAlternativeText;
    @api helpMessage;
    @api disabled;
    @api name;
    @api autocomplete;
    @api ariaLabel;
    @api ariaInvalid;
    @api ariaDisabled;
    @api ariaKeyShortcuts;
    @api placeholder;
    @api pattern;
    @api variant;

    _value = '';

    rendered = false;
    initialValueSet = false;

    @api
    focus() {
        if (this.rendered) {
            this.inputElement.focus();
        }
    }

    @api
    get value() {
        return this._value;
    }

    set value(value) {
        this._value = this.normalizeInput(value);
        if (this.rendered && this.inputElement.value !== this._value) {
            this.setInputValue(this._value);
        }
    }

    @api
    get inputElement() {
        if (!this.cachedInputElement) {
            let inputElement = this.template.querySelector('input');
            this.cachedInputElement = inputElement;
        }
        return this.cachedInputElement;
    }

    @api
    get describedByElements() {
        return this.template.querySelector('[data-help-message]');
    }

    @api
    get isNativeShadow() {
        return this._isNativeShadow;
    }

    /********* COMPONENT CALLBACKS *********/

    connectedCallback() {
        super.connectedCallback();
        this._isNativeShadow = isNativeComponent(this);
    }

    disconnectedCallback() {
        this.rendered = false;
        this.initialValueSet = false;
        this.cachedInputElement = undefined;
    }

    renderedCallback() {
        this.rendered = true;
        if (!this.initialValueSet) {
            this.inputElement.value = this._value;
            this.initialValueSet = true;
        }
        reflectAttribute(this, 'disabled', this.disabled);
        reflectAttribute(this, 'invalid', !!this.helpMessage);
        reflectAttribute(this, 'variant', this.variant);
    }

    /**
     * This value is used to compute the label's class which depends on the variant of the component
     */
    get computedColorLabelClass() {
        return classSet(
            'slds-form-element__label slds-color-picker__summary-label'
        ).add({ 'slds-assistive-text': this.isLabelHidden });
    }

    get isLabelHidden() {
        return this.variant === VARIANT.LABEL_HIDDEN;
    }

    /********* ACTION HANDLERS *********/

    handleBlur() {
        this.dispatchEvent(new CustomEvent('blur'));
    }

    handleFocus() {
        this.dispatchEvent(new CustomEvent('focus'));
    }

    handleChange(event) {
        event.stopPropagation();
        this.dispatchCommitEvent();
        this.dispatchChangeEvent();
    }

    /**
     * This event handler is used whenever a new color is selected and sets the inputElement's
     * value to the selectedColor, while focusing on the color picker button.
     * @param {*} event
     */
    handleColorChange(event) {
        const selectedColor = event.detail.color;
        if (selectedColor !== this.inputElement.value) {
            this.setInputValue(selectedColor);
            this._value = selectedColor;
            this.focus();
            this.dispatchChangeEventWithDetail({ value: selectedColor });
            this.dispatchCommitEvent();
        }

        this.template
            .querySelector('lightning-primitive-colorpicker-button')
            .focus();
    }

    handleInput(event) {
        event.stopPropagation();
        this.dispatchChangeEvent();
    }

    /********* EVENT DISPATCHERS *********/

    dispatchChangeEventWithDetail(detail) {
        this.dispatchEvent(
            new CustomEvent('change', {
                composed: true,
                bubbles: true,
                detail,
            })
        );
    }

    dispatchChangeEvent() {
        const detail = { value: this.inputElement.value };
        this._value = detail.value;
        this.dispatchChangeEventWithDetail(detail);
    }

    dispatchCommitEvent() {
        this.dispatchEvent(new CustomEvent('commit'));
    }

    /********* VALUE UPDATERS *********/

    setInputValue(value) {
        this.inputElement.value = value;
    }

    /********* HELPER METHODS *********/

    /**
     * TODO: lightning/inputUtils methods should be utilized in the second run of the input
     *       breakdown initiative.
     */
    normalizeInput(value) {
        if (typeof value === 'number' || typeof value === 'string') {
            return String(value);
        }
        return '';
    }
}
