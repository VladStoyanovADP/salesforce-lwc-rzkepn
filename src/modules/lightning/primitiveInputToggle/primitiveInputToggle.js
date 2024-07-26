import { api } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import {
    isNativeComponent,
    normalizeAriaAttribute,
    reflectAttribute,
} from 'lightning/utilsPrivate';
import { VARIANT } from 'lightning/inputUtils';
import labelRequired from '@salesforce/label/LightningControl.required';


const i18n = {
    required: labelRequired,
};

export default class LightningPrimitiveInputToggle extends LightningShadowBaseClass {
    _checked;
    _value = '';
    _ariaLabel;
    _cachedInputElement;
    _helpMessage = '';
    _messageToggleActive;
    _messageToggleInactive;

    initialRender = false;

    @api accessKey;
    @api disabled;
    @api label;
    @api name;
    @api readOnly;
    @api required;
    @api ariaInvalid;
    @api ariaKeyShortcuts;
    @api ariaDisabled;
    @api ariaRoleDescription;

    /**
     * Text shown for the active state of a toggle. The default is "Active".
     * @type {string}
     */
    @api messageToggleActive;

    /**
     * Text shown for the inactive state of a toggle. The default is "Inactive".
     * @type {string}
     */
    @api messageToggleInactive;

    @api
    get value() {
        return this._value;
    }
    set value(newValue) {
        // value can only be a string
        this._value =
            typeof newValue === 'number' || typeof newValue === 'string'
                ? String(newValue)
                : '';
    }

    @api
    get checked() {
        if (this.initialRender) {
            return this.inputElement.checked;
        }
        return this._checked;
    }
    set checked(value) {
        value = Boolean(value);
        this._checked = value;
        if (this.initialRender) {
            this.inputElement.checked = this._checked;
        }
    }

    @api
    get ariaDescribedByElements() {
        return [
            this.template.querySelector('[data-help-message]'),
            this.template.querySelector('data-toggle-description'),
        ];
    }

    @api
    get isNativeShadow() {
        return this._isNativeShadow;
    }

    @api
    get ariaLabel() {
        return this._ariaLabel;
    }
    set ariaLabel(value) {
        this._ariaLabel = normalizeAriaAttribute(value);
    }

    @api
    get inputElement() {
        // cache the input in order to reduce dom queries
        if (!this._cachedInputElement) {
            let inputElement = this.template.querySelector('input');
            this._cachedInputElement = inputElement;
        }
        return this._cachedInputElement;
    }

    @api
    get helpMessage() {
        return this._helpMessage;
    }
    set helpMessage(message) {
        this._helpMessage = message;
        reflectAttribute(this, 'invalid', Boolean(message));
    }

    @api
    get variant() {
        return this._variant;
    }
    set variant(variant) {
        this._variant = variant;
        reflectAttribute(this, 'variant', variant);
    }

    get computedLabelClass() {
        return this.variant === VARIANT.LABEL_HIDDEN
            ? 'slds-form-element__label slds-assistive-text'
            : 'slds-form-element__label';
    }

    get i18n() {
        return i18n;
    }

    handleBlur() {
        this.dispatchEvent(new CustomEvent('blur'));
    }

    handleFocus() {
        this.dispatchEvent(new CustomEvent('focus'));
    }

    handleChange(event) {
        this._checked = event.target.checked;
        const changeEvent = new CustomEvent('change', {
            detail: {
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
        if (!this.initialRender) {
            this.inputElement.checked = this.checked;
            this.inputElement.value = this._value;
            this.initialRender = true;
        }
    }

    disconnectedCallback() {
        this._cachedInputElement = undefined;
    }
}
