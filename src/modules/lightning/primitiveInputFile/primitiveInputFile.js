import {  api } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { isNativeComponent, reflectAttribute } from 'lightning/utilsPrivate';
import labelRequired from '@salesforce/label/LightningControl.required';
import labelInputFileBodyText from '@salesforce/label/LightningInputFile.bodyText';
import labelInputFileButtonLabel from '@salesforce/label/LightningInputFile.buttonLabel';

const i18n = {
    required: labelRequired,
    inputFileBodyText: labelInputFileBodyText,
    inputFileButtonLabel: labelInputFileButtonLabel,
};

export default class LightningPrimitiveInputFile extends LightningShadowBaseClass {
    _files = null;
    _helpMessage = '';

    /************************* PUBLIC PROPERTIES *************************/

    @api accept;
    @api accessKey;
    @api ariaInvalid;
    @api disabled;
    @api label;
    @api labelClass;
    @api multiple;
    @api name;
    @api readOnly;
    @api required;
    @api ariaLabel;
    @api ariaKeyShortcuts;
    @api ariaDisabled;
    @api ariaRoleDescription;

    @api
    get files() {
        return this._files;
    }

    @api
    get inputElement() {
        return this.template.querySelector('input');
    }

    @api
    get ariaDescribedByElements() {
        return this.template.querySelector('[data-help-message]');
    }

    @api
    get ariaLabelledByElements() {
        return [
            this.template.querySelector('[data-form-label]'),
            this.template.querySelector('[data-file-selector-label]'),
        ];
    }

    @api
    get isNativeShadow() {
        return this._isNativeShadow;
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

    /************************* PRIVATE GETTERS *************************/

    get i18n() {
        return i18n;
    }

    /************************** EVENT HANDLERS **************************/

    handleDropFiles(event) {
        this._files = event.dataTransfer && event.dataTransfer.files;
        this.dispatchEvent(new CustomEvent('change'));
        // drop doesn't trigger focus/blur, so use event
        // to call reportValidity instead of interacting state
        this.dispatchEvent(new CustomEvent('reportvalidity'));
    }

    handleBlur() {
        this.dispatchEvent(new CustomEvent('blur'));
    }

    handleFocus() {
        this.dispatchEvent(new CustomEvent('focus'));
    }

    handleFileClick() {
        this.inputElement.value = null;
    }

    handleChange() {
        this._files = this.inputElement.files;
        this.dispatchEvent(new CustomEvent('change'));
    }

    /************************** LIFECYCLE HOOKS **************************/

    connectedCallback() {
        super.connectedCallback();
        this._isNativeShadow = isNativeComponent(this);
    }
}
