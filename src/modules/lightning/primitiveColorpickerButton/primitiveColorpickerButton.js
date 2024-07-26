import labelA11yTriggerText from '@salesforce/label/LightningColorPicker.a11yTriggerText';
import labelA11yDefaultText from '@salesforce/label/LightningColorPicker.a11yDefaultText';
import { api, track } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { Direction, AutoPosition } from 'lightning/positionLibrary';
import { normalizeBoolean, reflectAttribute } from 'lightning/utilsPrivate';

const i18n = {
    a11yTriggerText: labelA11yTriggerText,
    a11yDefaultText: labelA11yDefaultText,
};
export default class PrimitiveColorpickerButton extends LightningShadowBaseClass {
    static delegatesFocus = true;

    @track _isColorPickerPanelOpen = false;
    @track _value = '';
    @track _disabled = false;
    @api ariaDisabled;

    @api
    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }

    @api
    get assistiveValue() {
        return this.value ? this.value : this.i18n.a11yDefaultText;
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
    focus() {
        const button = this.template.querySelector('button');
        return button && button.focus();
    }

    @api
    blur() {
        const button = this.template.querySelector('button');
        return button && button.blur();
    }

    get colorInputStyle() {
        return `background: ${this.value || '#5679C0'};`;
    }

    handleColorPickerToggleClick(event) {
        event.preventDefault();
        this._isColorPickerPanelOpen = !this._isColorPickerPanelOpen;

        if (this._isColorPickerPanelOpen) {
            this.startColorPickerPositioning();
        } else {
            this.stopColorPickerPositioning();
        }
    }

    startColorPickerPositioning() {
        if (!this._autoPosition) {
            this._autoPosition = new AutoPosition(this);
        }

        this._autoPosition.start({
            target: () =>
                this.template.querySelector(
                    'button.slds-color-picker__summary-button'
                ),
            element: () =>
                this.template
                    .querySelector('lightning-color-picker-panel')
                    .shadowRoot.querySelector('section'),
            align: {
                horizontal: Direction.Left,
                vertical: Direction.Top,
            },
            targetAlign: {
                horizontal: Direction.Left,
                vertical: Direction.Bottom,
            },
            autoFlip: true,
        });
    }

    stopColorPickerPositioning() {
        if (this._autoPosition) {
            this._autoPosition.stop();
        }
    }

    handleUpdateColorEvent(event) {
        event.stopPropagation();
        const detail = event.detail;
        this._isColorPickerPanelOpen = false;
        this.stopColorPickerPositioning();
        this.dispatchEvent(
            new CustomEvent('change', {
                detail,
            })
        );
    }

    get i18n() {
        return i18n;
    }
}
