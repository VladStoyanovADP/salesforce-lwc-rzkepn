import {  api } from 'lwc';
import { classSet } from 'lightning/utils';
import { VARIANT } from 'lightning/inputUtils';
import { isNativeComponent } from 'lightning/utilsPrivate';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';

export default class LightningPrimitiveInputRadio extends LightningShadowBaseClass {
    @api variant;
    @api ariaInvalid;
    @api ariaKeyShortcuts;
    @api ariaDisabled;
    @api ariaRoleDescription;
    @api accessKey;
    @api name;
    @api required;
    @api readOnly;
    @api disabled;
    @api label;
    @api ariaLabel;
    @api helpMessage;

    @api
    get checked() {
        return this._checked;
    }

    /**
     * Sets the checked state of the input and reflects the attribute if required.
     */
    set checked(value) {
        this._setChecked(value);
    }

    @api
    get ariaDescribedByElements() {
        return this.template.querySelector('[data-help-message]');
    }

    @api
    get isNativeShadow() {
        return this._isNativeShadow;
    }

    @api
    get inputElement() {
        if (!this._cachedInputElement) {
            let inputElement = this.template.querySelector('input');
            this._cachedInputElement = inputElement;
        }
        return this._cachedInputElement;
    }

    get isLabelHidden() {
        return this.variant === VARIANT.LABEL_HIDDEN;
    }

    get computedLabelClass() {
        return classSet('slds-form-element__label')
            .add({ 'slds-assistive-text': this.isLabelHidden })
            .toString();
    }

    _setChecked(value) {
        value = Boolean(value);
        this._checked = value;
        if (this.rendered && this.inputElement.checked !== this._checked) {
            this.inputElement.checked = this._checked;
        }
    }

    handleBlur() {
        this.dispatchEvent(new CustomEvent('blur'));
    }

    handleFocus() {
        this.dispatchEvent(new CustomEvent('focus'));
    }

    handleChange(event) {
        this._setChecked(event.target.checked);

        const changeEvent = new CustomEvent('change', {
            bubbles: true,
            composed: true,
            detail: {
                checked: event.target.checked,
            },
        });
        this.dispatchEvent(changeEvent);
    }

    connectedCallback() {
        super.connectedCallback();
        this._isNativeShadow = isNativeComponent(this);
    }

    renderedCallback() {
        if (!this.rendered) {
            this.inputElement.checked = this.checked;
        }
        this.rendered = true;
    }

    disconnectedCallback() {
        this._cachedInputElement = undefined;
        this.rendered = false;
    }
}
