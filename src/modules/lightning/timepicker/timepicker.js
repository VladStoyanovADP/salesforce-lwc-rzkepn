/* eslint-disable @lwc/lwc/no-api-reassignments */
import labelInvalidDate from '@salesforce/label/LightningDateTimePicker.invalidDate';
import labelRangeOverflow from '@salesforce/label/LightningDateTimePicker.rangeOverflow';
import labelRangeUnderflow from '@salesforce/label/LightningDateTimePicker.rangeUnderflow';
import labelRequired from '@salesforce/label/LightningControl.required';
import labelHelpTextAlternativeText from '@salesforce/label/LightningInput.helptextAlternativeText';
import { api, track } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { getTimeToHighlight } from './utils';
import { classSet, formatLabel } from 'lightning/utils';
import {
    isBefore,
    isAfter,
    normalizeISOTime,
    parseFormattedTime,
    getTimeFormatFromStyle,
    getISOTimeString,
} from 'lightning/internationalizationLibrary';
import { removeTimeZoneSuffix } from 'lightning/iso8601Utils';
import {
    normalizeBoolean,
    synchronizeAttrs,
    normalizeString,
    computeAriaInvalid,
    reflectAttribute,
    isNativeComponent,
    isCSR,
} from 'lightning/utilsPrivate';
import { normalizeVariant, VARIANT } from 'lightning/inputUtils';

const i18n = {
    invalidDate: labelInvalidDate,
    rangeOverflow: labelRangeOverflow,
    rangeUnderflow: labelRangeUnderflow,
    required: labelRequired,
    helpTextAlternativeText: labelHelpTextAlternativeText,
};

const STEP = 15; // in minutes
const TIME_STYLE = {
    SHORT: 'short',
    MEDIUM: 'medium',
    LONG: 'long',
};

export default class LightningTimePicker extends LightningShadowBaseClass {
    static delegatesFocus = true;

    @track _disabled = false;
    @track _required = false;
    @track _displayValue = null;
    @track _value = null;
    @track _min;
    @track _max;
    @track _items = [];
    @track _fieldLevelHelp;
    @track _variant = 'lookup';
    @track _mainInputId;
    @track _errorMessage;
    @track _readonly = true;
    @track _describedByElements = [];

    @api rootAriaNode;

    /**
     * Controls auto-filling of the input. Set the attribute to pass
     * through autocomplete values to be interpreted by the browser.
     * By default autocomplete is off to avoid overlap of dropdowns.
     * @type {string}
     */
    @api autocomplete = 'off';

    @api ariaLabelledByElement;
    @api ariaControlsElement;
    @api ariaDetailsElements;
    @api ariaLabel;
    @api ariaDisabled;
    @api label;
    @api name;
    @api placeholder = '';
    @api accessKey;

    @api
    get comboboxComponent() {
        return this.template.querySelector('lightning-base-combobox');
    }

    @api messageWhenValueMissing;
    _ariaDescribedByElements;
    _timeStyle = TIME_STYLE.SHORT;

    @api
    get messageWhenBadInput() {
        return (
            this._messageWhenBadInput ||
            formatLabel(
                i18n.invalidDate,
                getTimeFormatFromStyle(this.timeStyle, true)
            )
        );
    }
    set messageWhenBadInput(message) {
        this._messageWhenBadInput = message;
    }

    @api
    get messageWhenRangeOverflow() {
        // using isoValue since the manually entered time could have seconds/milliseconds and the locale format generally doesn't have this precision
        return (
            this._messageWhenRangeOverflow ||
            formatLabel(
                i18n.rangeOverflow,
                normalizeISOTime(this.max, this.timeStyle).isoValue
            )
        );
    }
    set messageWhenRangeOverflow(message) {
        this._messageWhenRangeOverflow = message;
    }

    @api
    get messageWhenRangeUnderflow() {
        return (
            this._messageWhenRangeUnderflow ||
            formatLabel(
                i18n.rangeUnderflow,
                normalizeISOTime(this.min, this.timeStyle).isoValue
            )
        );
    }
    set messageWhenRangeUnderflow(message) {
        this._messageWhenRangeUnderflow = message;
    }

    set ariaDescribedByElements(el) {
        if (Array.isArray(el)) {
            this._ariaDescribedByElements = el;
        } else {
            this.ariaDescribedByElements = [el];
        }
    }

    @api
    get ariaDescribedByElements() {
        return this._ariaDescribedByElements;
    }

    @api
    get value() {
        return this._value;
    }
    set value(newValue) {
        const normalizedValue = removeTimeZoneSuffix(newValue);
        const normalizedTime = normalizeISOTime(
            normalizedValue,
            this.timeStyle
        );

        this._value = normalizedTime.isoValue;
        this._displayValue = normalizedTime.displayValue;
    }

    @api
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = normalizeBoolean(value);
    }

    @api
    get readOnly() {
        return this._readonly;
    }
    set readOnly(value) {
        this._readonly = normalizeBoolean(value);
        if (this._readonly) {
            this._variant = VARIANT.STANDARD;
        }
    }

    @api
    get required() {
        return this._required;
    }
    set required(value) {
        this._required = normalizeBoolean(value);
    }

    @api
    hasBadInput() {
        return !!this._displayValue && this._value === null;
    }

    @api
    showHelpMessage(message) {
        if (!message) {
            this.classList.remove('slds-has-error');
            this._errorMessage = '';
        } else {
            this.classList.add('slds-has-error');
            this._errorMessage = message;
        }
    }

    set fieldLevelHelp(value) {
        this._fieldLevelHelp = value;
    }

    @api
    get fieldLevelHelp() {
        return this._fieldLevelHelp;
    }

    @api
    get variant() {
        return this._variant || VARIANT.STANDARD;
    }

    set variant(value) {
        this._variant = normalizeVariant(value);
        reflectAttribute(this, 'variant', this._variant);
    }

    @api
    get max() {
        return this._max;
    }

    set max(newValue) {
        this._max = newValue;
        if (this.connected) {
            this.rebuildAndUpdateTimeList();
        }
    }

    @api
    get min() {
        return this._min;
    }

    set min(newValue) {
        this._min = newValue;
        if (this.connected) {
            this.rebuildAndUpdateTimeList();
        }
    }

    /**
     * Sets focus on the input element.
     */
    @api
    focus() {
        if (this.connected) {
            this.getCombobox().focus();
        }
    }

    /**
     * Removes keyboard focus from the input element.
     */
    @api
    blur() {
        if (this.connected) {
            this.getCombobox().blur();
        }
    }

    @api
    get timeStyle() {
        return this._timeStyle;
    }

    set timeStyle(value) {
        this._timeStyle = normalizeString(value, {
            fallbackValue: TIME_STYLE.SHORT,
            validValues: [TIME_STYLE.SHORT, TIME_STYLE.MEDIUM, TIME_STYLE.LONG],
        });

        const normalizedDate = normalizeISOTime(this._value, this._timeStyle);
        this._displayValue = normalizedDate.displayValue;
    }

    connectedCallback() {
        super.connectedCallback();
        this._isNativeShadow = isNativeComponent(this);
        this.connected = true;
    }

    disconnectedCallback() {
        this.connected = false;
    }

    @api ariaErrorMessageElement;

    get ariaErrorMessageElements() {
        const elements = [this.ariaErrorMessageElement];
        if (this._errorMessage) {
            elements.push(this.template.querySelector('[data-error-message]'));
        }
        return elements;
    }

    synchronizeA11y() {
        const label = this.template.querySelector('label');

        synchronizeAttrs(label, {
            for: this._mainInputId,
        });
    }

    renderedCallback() {
        this.synchronizeA11y();
    }

    get comboboxLabel() {
        // @W-12765711 Set the combobox aria label when no ariaLabel provided in a cross root scenario
        // Required as label 'for' relationship will not work
        return !this.ariaLabel &&
            !this.ariaLabelledByElement &&
            this._isNativeShadow
            ? this.label
            : this.ariaLabel;
    }

    get displayValue() {
        return this._displayValue;
    }

    get items() {
        return this._items;
    }

    get i18n() {
        return i18n;
    }

    get isLabelHidden() {
        return this.variant === VARIANT.LABEL_HIDDEN;
    }

    get computedClass() {
        let displayClass = this._errorMessage ? 'slds-show' : 'slds-hide';
        return 'slds-form-element__help ' + displayClass;
    }

    get computedLabelClass() {
        return classSet('slds-form-element__label')
            .add({ 'slds-assistive-text': this.isLabelHidden })
            .toString();
    }

    handleReady(e) {
        this._mainInputId = e.detail.id;
    }

    buildTimeList() {
        // We should always display the options in the short style since m/l will add an extra :00 to the options.
        const timeList = [];
        const minTime = normalizeISOTime(
            this.min,
            TIME_STYLE.SHORT
        ).parsedValue;
        const minHour = minTime ? minTime.getHours() : 0;

        const maxTime = normalizeISOTime(
            this.max,
            TIME_STYLE.SHORT
        ).parsedValue;
        const maxHour = maxTime ? maxTime.getHours() + 1 : 24;

        const date = new Date();
        for (let hour = minHour; hour < maxHour; hour++) {
            for (let minutes = 0; minutes < 60; minutes += STEP) {
                date.setHours(hour, minutes);
                date.setSeconds(0, 0);

                if (this.isBeforeMinTime(date, minTime)) {
                    continue; // eslint-disable-line no-continue
                }

                if (this.isAfterMaxTime(date, maxTime)) {
                    break;
                }

                const isoTime = getISOTimeString(date);
                const normalizedTime = normalizeISOTime(
                    isoTime,
                    TIME_STYLE.SHORT
                );

                timeList.push({
                    type: 'option-inline',
                    text: normalizedTime.displayValue,
                    value: isoTime,
                });
            }
        }

        return timeList;
    }

    get timeList() {
        if (!this._timeList) {
            this._timeList = this.buildTimeList();
        }

        if (!this._value) {
            return this._timeList;
        }

        const timeToHighlight = getTimeToHighlight(this._value, STEP);

        const timeList = this._timeList.map((item) => {
            const itemCopy = Object.assign({}, item);
            if (item.value === this._value) {
                itemCopy.iconName = 'utility:check';
                itemCopy.checked = true;
            } else {
                itemCopy.checked = false;
            }
            if (item.value === timeToHighlight) {
                itemCopy.highlight = true;
            }
            return itemCopy;
        });
        return timeList;
    }

    rebuildAndUpdateTimeList() {
        // forcing the time list to be rebuilt
        this._timeList = null;
        this._items = this.timeList;
    }

    getCombobox() {
        return this.template.querySelector('lightning-base-combobox');
    }

    handleFocus() {
        this.dispatchEvent(new CustomEvent('focus'));
    }

    handleBlur() {
        this.dispatchEvent(new CustomEvent('blur'));
    }

    handleInputChange(event) {
        event.preventDefault();
        event.stopPropagation();

        // keeping the display value in sync with the element's value
        this._displayValue = event.detail.text;
        const { value, style } = parseFormattedTime(this._displayValue);
        this._value = value;
        if (style) {
            this._timeStyle = style;
        }

        this._items = this.timeList;

        this.dispatchChangeEvent();
    }

    handleTextInput(event) {
        event.preventDefault();
        event.stopPropagation();

        // keeping the display value in sync with the element's value
        this._displayValue = event.detail.text;
    }

    handleTimeSelect(event) {
        event.stopPropagation();

        // for some reason this event is fired without detail from grouped-combobox
        if (!event.detail) {
            return;
        }

        this._value = event.detail.value;
        this._displayValue = normalizeISOTime(
            this._value,
            this.timeStyle
        ).displayValue;

        this._items = this.timeList;
        this.dispatchChangeEvent();
    }

    handleDropdownOpenRequest() {
        this._items = this.timeList;
    }

    dispatchChangeEvent() {
        this.dispatchEvent(
            new CustomEvent('change', {
                composed: true,
                bubbles: true,
                detail: {
                    value: this._value,
                },
            })
        );
    }

    isBeforeMinTime(date, minTime) {
        const minDate = minTime || normalizeISOTime(this.min, TIME_STYLE.SHORT);
        return minDate ? isBefore(date, minDate, 'minute') : false;
    }

    isAfterMaxTime(date, maxTime) {
        const maxDate = maxTime || normalizeISOTime(this.max, TIME_STYLE.SHORT);
        return maxDate ? isAfter(date, maxDate, 'minute') : false;
    }

    get hasExternalLabel() {
        return (
            this.variant === VARIANT.LABEL_HIDDEN &&
            this.ariaLabelledByElement &&
            this.ariaLabelledByElement.length
        );
    }

    get computedAriaInvalid() {
        const dataAriaInvalid = isCSR
            ? this.template.host.getAttribute('data-aria-invalid')
            : null;
        const isAriaInvalid = dataAriaInvalid || this._errorMessage;
        return computeAriaInvalid(isAriaInvalid, this.value);
    }

    get helptextAlternativeText() {
        return formatLabel(i18n.helpTextAlternativeText, this.label);
    }
}
