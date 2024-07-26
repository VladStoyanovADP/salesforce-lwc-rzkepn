import {  api } from 'lwc';
import {
    reflectAttribute,
    normalizeBoolean,
    isNativeComponent,
} from 'lightning/utilsPrivate';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';

export default class LightningPrimitiveInputColor extends LightningShadowBaseClass {
    @api ariaLabel;
    @api ariaInvalid;
    @api accessKey;
    @api name;
    @api required;
    @api readOnly;
    @api label;
    @api ariaKeyShortcuts;
    @api ariaDisabled;
    @api ariaRoleDescription;

    _checked = false;
    _disabled = false;
    _helpMessage = '';

    rendered = false;
    initialValueSet = false;

    /**
     * If present, the checkbox is selected.
     * @type {boolean}
     * @default false
     */
    @api
    get checked() {
        // checkable inputs can be part of a named group, in that case there won't be a change event thrown and so
        // the internal tracking _checked would be out of sync with the actual input value.
        if (this.initialValueSet) {
            return this.inputElement.checked;
        }
        return this._checked;
    }

    set checked(value) {
        this._checked = normalizeBoolean(value);

        if (this.rendered) {
            this.inputElement.checked = this._checked;
        }
        reflectAttribute(this, 'checked', this.checked);
    }

    /**
     * If present, the input field is disabled and users cannot interact with it.
     * @type {boolean}
     * @default false
     */
    @api
    get disabled() {
        return this._disabled;
    }

    set disabled(value) {
        this._disabled = normalizeBoolean(value);
        reflectAttribute(this, 'disabled', this.disabled);
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
    get inputElement() {
        if (!this.cachedInputElement) {
            let inputElement = this.template.querySelector('input');
            this.cachedInputElement = inputElement;
        }
        return this.cachedInputElement;
    }

    @api
    get ariaDescribedByElements() {
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
        this.cachedInputElement = undefined;
        this.initialValueSet = false;
        this.rendered = false;
    }

    renderedCallback() {
        this.rendered = true;
        if (!this.initialValueSet) {
            this.inputElement.checked = this._checked;
            this.initialValueSet = true;
        }
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

    handleClick() {
        if (this.template.activeElement === null) {
            this.template.querySelector("[type='checkbox']").focus();
        }
    }

    /********* EVENT DISPATCHERS *********/

    dispatchChangeEventWithDetail(detail) {
        this.dispatchEvent(
            new CustomEvent('change', {
                composed: true,
                detail,
            })
        );
    }

    dispatchChangeEvent() {
        const detail = {};
        this._checked = this.inputElement.checked;
        reflectAttribute(this, 'checked', this._checked);
        detail.checked = this._checked;
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
