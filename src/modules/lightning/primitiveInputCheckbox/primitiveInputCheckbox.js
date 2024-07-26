import { classSet } from 'lightning/utils';
import { VARIANT } from 'lightning/inputUtils';
import labelRequired from '@salesforce/label/LightningControl.required';
import { api } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';


import { isNativeComponent, reflectAttribute } from 'lightning/utilsPrivate';

export default class LightningPrimitiveInputCheckbox extends LightningShadowBaseClass {
    @api required;
    @api readOnly;
    @api label;
    @api labelHidden;
    @api helptextAlternativeText;
    @api fieldLevelHelp;
    @api ariaInvalid;
    @api ariaLabel;
    @api accessKey;
    @api name;
    @api disabled;
    @api ariaKeyShortcuts;
    @api ariaDisabled;
    @api ariaRoleDescription;

    @api
    get checked() {
        return this._checked;
    }
    set checked(value) {
        this._setChecked(value);
    }

    @api
    get helpMessage() {
        return this._helpMessage;
    }

    set helpMessage(message) {
        this._helpMessage = message;
        reflectAttribute(this, 'invalid', !!message);
    }

    @api
    get variant() {
        return this._variant;
    }
    set variant(variant) {
        this._variant = variant;
        reflectAttribute(this, 'variant', variant);
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

    labelRequired = labelRequired;
    _helpMessage;

    get isStandardVariant() {
        return (
            this.variant === VARIANT.STANDARD ||
            this.variant === VARIANT.LABEL_HIDDEN
        );
    }

    get isLabelHidden() {
        return this.variant === VARIANT.LABEL_HIDDEN;
    }

    get computedCheckboxClass() {
        return classSet('slds-checkbox')
            .add({ 'slds-checkbox_standalone': !this.isStandardVariant })
            .toString();
    }

    get computedLabelClass() {
        return classSet('slds-form-element__label')
            .add({ 'slds-assistive-text': this.isLabelHidden })
            .toString();
    }

    handleBlur() {
        this.dispatchEvent(new CustomEvent('blur'));
    }

    handleFocus() {
        this.dispatchEvent(new CustomEvent('focus'));
    }

    _setChecked(value) {
        value = Boolean(value);
        this._checked = value;
        reflectAttribute(this, 'checked', this.checked);
        if (this.rendered && this.inputElement.checked !== value) {
            this.inputElement.checked = this._checked;
        }
    }

    handleChange(event) {
        this._setChecked(event.target.checked);

        const changeEvent = new CustomEvent('change', {
            detail: {
                composed: true,
                bubbles: true,
                checked: event.target.checked,
            },
        });
        this.dispatchEvent(changeEvent);
    }

    handleClick() {
        if (this.template.activeElement === null) {
            this.template.querySelector("[type='checkbox']").focus();
        }
    }

    connectedCallback() {
        super.connectedCallback();
        this._isNativeShadow = isNativeComponent(this);
    }

    renderedCallback() {
        if (!this.rendered) {
            this.inputElement.checked = this.checked;
        }
        reflectAttribute(this, 'disabled', this.disabled);
        this.rendered = true;
    }

    disconnectedCallback() {
        this.cachedInputElement = undefined;
        this.rendered = false;
    }
}
