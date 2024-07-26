import { track, api } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { normalizeISOTime } from 'lightning/internationalizationLibrary';

/**
 * Displays a formatted time in user's locale format.
 */
export default class FormattedTime extends LightningShadowBaseClass {
    @track _formattedTimeValue = null;
    _inputValue = null;

    set value(newValue) {
        const normalizedValue = this.normalizeInputValue(newValue);
        if (normalizedValue !== this._inputValue) {
            // formattedTime component currently always displays medium time format
            const normalizedTime = normalizeISOTime(normalizedValue, 'medium');

            this._inputValue = normalizedTime.isoValue;
            this._formattedTimeValue = normalizedTime.displayValue;
        }
    }

    /**
     * Time value to format.
     * @type {string}
     *
     */
    @api
    get value() {
        return this._inputValue;
    }

    get formattedTime() {
        return this._formattedTimeValue;
    }

    normalizeInputValue(value) {
        if (!value || value === '') {
            return null;
        }
        return value;
    }
}
