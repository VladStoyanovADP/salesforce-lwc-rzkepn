import labelInvalidDate from '@salesforce/label/LightningDateTimePicker.invalidDate';
import labelRangeOverflow from '@salesforce/label/LightningDateTimePicker.rangeOverflow';
import labelRangeUnderflow from '@salesforce/label/LightningDateTimePicker.rangeUnderflow';
import labelMinRangeMessage from '@salesforce/label/LightningDateTimePicker.minRangeMessage';
import labelMaxRangeMessage from '@salesforce/label/LightningDateTimePicker.maxRangeMessage';
import labelMinAndMaxRangeMessage from '@salesforce/label/LightningDateTimePicker.minAndMaxRangeMessage';
import labelRequired from '@salesforce/label/LightningControl.required';
import labelSelectDateFor from '@salesforce/label/LightningDateTimePicker.selectDateFor';
import labelHelpTextAlternativeText from '@salesforce/label/LightningInput.helptextAlternativeText';
import { api, track } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import {
    normalizeISODate,
    parseFormattedDate,
    getDateFormatFromStyle,
} from 'lightning/internationalizationLibrary';
import {
    startPositioning,
    stopPositioning,
    Direction,
} from 'lightning/positionLibrary';
import { classSet, formatLabel } from 'lightning/utils';
import {
    normalizeBoolean,
    normalizeAriaAttribute,
    normalizeString,
    synchronizeAttrs,
    getRealDOMId,
    isIE11,
    computeAriaInvalid,
    reflectAttribute,
    isCSR,
} from 'lightning/utilsPrivate';
import {
    generateUniqueId,
    normalizeVariant,
    VARIANT,
} from 'lightning/inputUtils';
import {
    handleKeyDownOnDatePickerIcon,
    handleBasicKeyDownBehaviour,
} from './keyboard';
import AriaObserver from 'lightning/ariaObserver';

const i18n = {
    invalidDate: labelInvalidDate,
    rangeOverflow: labelRangeOverflow,
    rangeUnderflow: labelRangeUnderflow,
    minRangeMessage: labelMinRangeMessage,
    maxRangeMessage: labelMaxRangeMessage,
    minAndMaxRangeMessage: labelMinAndMaxRangeMessage,
    required: labelRequired,
    selectDateFor: labelSelectDateFor,
    helpTextAlternativeText: labelHelpTextAlternativeText,
};

const ARIA_CONTROLS = 'aria-controls';
const ARIA_DETAILS = 'aria-details';
const ARIA_LABEL = 'aria-label';
const ARIA_DISABLED = 'aria-disabled';
const ARIA_LABELLEDBY = 'aria-labelledby';
const ARIA_DESCRIBEDBY = 'aria-describedby';
const ARIA_INVALID = 'aria-invalid';
const DATE_STYLE = {
    SHORT: 'short',
    MEDIUM: 'medium',
    LONG: 'long',
};

export default class LightningDatePicker extends LightningShadowBaseClass {
    @track _disabled = false;
    @track _readonly = false;
    @track _required = false;
    @track _value = null;
    @track _calendarVisible = false;
    @track _displayValue = null;
    @track _errorMessage = '';
    @track _fieldLevelHelp;
    @track _variant;
    @api accessKey;

    _min;
    _max;
    _userMaxValue;
    _userMinValue;
    _displayMin;
    _displayMax;
    _dateStyle = DATE_STYLE.MEDIUM;

    @api label;
    @api name;
    @api placeholder;

    /**
     * Controls auto-filling of the input. Set the attribute to pass
     * through autocomplete values to be interpreted by the browser.
     * By default autocomplete is off to avoid overlap of dropdown.
     * @type {string}
     */
    @api autocomplete = 'off';

    @api messageWhenValueMissing;

    @api
    get rootAriaNode() {
        if (this.ariaObserver) {
            return this.ariaObserver.root;
        }
        return null;
    }

    set rootAriaNode(root) {
        if (this.ariaObserver) {
            this.ariaObserver.root = root;
        }
    }

    setNormalisedIsoDateMin() {
        const normalizedDate = normalizeISODate(
            this._userMinValue,
            this._dateStyle
        );
        if (normalizedDate.isoValue) {
            this._min = normalizedDate.isoValue;
            this._displayMin = normalizedDate.displayValue;
        }
    }

    @api
    get min() {
        return this._min;
    }
    set min(value) {
        // W-7702418: We previously always set the raw value and should continue to do so unless
        // normalization of the given value is possible.
        this._min = value;
        this._displayMin = value;
        this._userMinValue = value;

        this.setNormalisedIsoDateMin();
    }

    setNormalisedIsoDateMax() {
        const normalizedDate = normalizeISODate(
            this._userMaxValue,
            this._dateStyle
        );
        if (normalizedDate.isoValue) {
            this._max = normalizedDate.isoValue;
            this._displayMax = normalizedDate.displayValue;
        }
    }

    @api
    get max() {
        return this._max;
    }
    set max(value) {
        // W-7702418: We previously always set the raw value and should continue to do so unless
        // normalization of the given value is possible.
        this._max = value;
        this._displayMax = value;
        this._userMaxValue = value;

        this.setNormalisedIsoDateMax();
    }

    @api
    get messageWhenBadInput() {
        return (
            this._messageWhenBadInput ||
            formatLabel(
                this.i18n.invalidDate,
                getDateFormatFromStyle(this.dateStyle, true)
            )
        );
    }
    set messageWhenBadInput(message) {
        this._messageWhenBadInput = message;
    }

    @api
    get messageWhenRangeOverflow() {
        return (
            this._messageWhenRangeOverflow ||
            formatLabel(this.i18n.rangeOverflow, this._displayMax)
        );
    }
    set messageWhenRangeOverflow(message) {
        this._messageWhenRangeOverflow = message;
    }

    @api
    get messageWhenRangeUnderflow() {
        return (
            this._messageWhenRangeUnderflow ||
            formatLabel(this.i18n.rangeUnderflow, this._displayMin)
        );
    }
    set messageWhenRangeUnderflow(message) {
        this._messageWhenRangeUnderflow = message;
    }

    // setter is required to properly trigger update
    @api
    get ariaLabel() {
        return this._ariaLabel;
    }

    set ariaLabel(val) {
        this._ariaLabel = val;
        this.synchronizeA11y();
    }

    @api
    get ariaDisabled() {
        return this._ariaDisabled;
    }

    set ariaDisabled(val) {
        this._ariaDisabled = val;
        this.synchronizeA11y();
    }

    _ariaLabelledBy;
    _ariaControls;
    _ariaDetails;
    _ariaDescribedBy = [];

    set ariaLabelledByElement(el) {
        this._ariaLabelledBy = el;
        if (this.ariaObserver) {
            this.ariaObserver.connect({
                attribute: ARIA_LABELLEDBY,
                targetSelector: 'input',
                relatedNodeIds: getRealDOMId(this._ariaLabelledBy),
            });
        }
    }

    @api
    get ariaLabelledByElement() {
        return this._ariaLabelledBy;
    }

    set ariaControlsElement(el) {
        this._ariaControls = el;
        if (this.ariaObserver) {
            this.ariaObserver.connect({
                attribute: ARIA_CONTROLS,
                targetSelector: 'input',
                relatedNodeIds: getRealDOMId(this.ariaControlsElement),
            });
        }
    }

    @api
    get ariaControlsElement() {
        return this._ariaControls;
    }

    set ariaDetailsElements(el) {
        this._ariaDetails = el;
        if (this.ariaObserver) {
            this.ariaObserver.connect({
                attribute: ARIA_DETAILS,
                targetSelector: 'input',
                relatedNodeIds: getRealDOMId(this.ariaDetailsElements),
            });
        }
    }

    @api
    get ariaDetailsElements() {
        return this._ariaDetails;
    }

    set ariaDescribedByElements(el) {
        if (Array.isArray(el)) {
            this._ariaDescribedBy = el;
        } else {
            this._ariaDescribedBy = [el];
        }
        this.connectAriaDescribedBy();
    }

    @api
    get ariaDescribedByElements() {
        return this._ariaDescribedBy;
    }

    @api
    get ariaErrorMessageElement() {
        return this._ariaErrorMessageElement;
    }

    set ariaErrorMessageElement(element) {
        this._ariaErrorMessageElement = element;
        this.connectAriaDescribedBy();
    }

    synchronizeA11y() {
        if (!this._rendered) {
            return;
        }
        const input = this.template.querySelector('input');
        if (!input) {
            return;
        }

        synchronizeAttrs(input, {
            [ARIA_LABEL]: this._ariaLabel,
            [ARIA_DISABLED]: this._ariaDisabled,
            [ARIA_INVALID]: this.computedAriaInvalid,
        });

        // Set aria-describedby on the calendar button that opens the calendar dialog
        // to inform user of date validity (min/max). Same is done for input.
        const calendarButton = this.template.querySelector(
            'lightning-button-icon'
        );
        calendarButton.ariaDescribedBy =
            this.computedDatepickerButtonAriaDescribedby;

        if (this.isConnected) {
            this.connectAriaDescribedBy();
            this.ariaObserver.sync();
        }
    }

    renderedCallback() {
        this._rendered = true;
        this.synchronizeA11y();
    }

    @api
    get value() {
        return this._value;
    }
    set value(newValue) {
        const normalizedDate = normalizeISODate(newValue, this.dateStyle);

        this._value = normalizedDate.isoValue;
        this._displayValue = normalizedDate.displayValue;
    }

    @api
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = normalizeBoolean(value);
        reflectAttribute(this, 'disabled', this._disabled);
    }

    @api
    get readOnly() {
        return this._readonly;
    }
    set readOnly(value) {
        this._readonly = normalizeBoolean(value);
        reflectAttribute(this, 'readonly', this._readonly);
    }

    @api
    get required() {
        return this._required;
    }
    set required(value) {
        this._required = normalizeBoolean(value);
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
        reflectAttribute(this, 'variant', value);
    }

    @api
    focus() {
        if (this.connected) {
            this.inputElement.focus();
        }
    }

    @api
    blur() {
        if (this.connected) {
            this.inputElement.blur();
        }
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

    @api
    hasBadInput() {
        return !!this._displayValue && this._value === null;
    }

    @api
    get dateStyle() {
        return this._dateStyle;
    }

    set dateStyle(value) {
        this._dateStyle = normalizeString(value, {
            fallbackValue: DATE_STYLE.MEDIUM,
            validValues: [DATE_STYLE.SHORT, DATE_STYLE.MEDIUM, DATE_STYLE.LONG],
        });

        const normalizedDate = normalizeISODate(this._value, this._dateStyle);
        this._displayValue = normalizedDate.displayValue;

        // W-14161407 min and max setters are being called before dateStyle is being set
        // hence updating the min max values
        this.setNormalisedIsoDateMax();
        this.setNormalisedIsoDateMin();
    }

    constructor() {
        super();
        this.uniqueId = generateUniqueId();
        this.ariaObserver = new AriaObserver(this);
    }

    connectedCallback() {
        super.connectedCallback();
        this.connected = true;
        if (!this.ariaObserver) {
            this.ariaObserver = new AriaObserver(this);
        }

        this.keyboardInterface = this.datepickerKeyboardInterface();
    }

    disconnectedCallback() {
        this.connected = false;
        this._rendered = false;
        if (this.ariaObserver) {
            this.ariaObserver.disconnect();
            this.ariaObserver = undefined;
        }
    }

    get i18n() {
        return i18n;
    }

    get isLabelHidden() {
        return this.variant === VARIANT.LABEL_HIDDEN;
    }

    get computedLabelClass() {
        return classSet('slds-form-element__label')
            .add({ 'slds-assistive-text': this.isLabelHidden })
            .toString();
    }

    get errorMessageElement() {
        return this.template.querySelector('[data-error-message]');
    }

    get rangeMessageElement() {
        return this.template.querySelector('[data-range-message]');
    }

    get computedUniqueRangeMessageElementId() {
        const el = this.template.querySelector('[data-range-message]');
        return getRealDOMId(el);
    }

    get isRangeMessageVisible() {
        return this.min || this.max;
    }

    get isCalendarVisible() {
        return this._calendarVisible;
    }

    get displayValue() {
        return this._displayValue;
    }

    get computedClass() {
        let displayClass = this.errorMessage ? 'slds-show' : 'slds-hide';
        return 'slds-form-element__help ' + displayClass;
    }

    get errorMessage() {
        return this._errorMessage;
    }

    get computedIconDisabledState() {
        return this.disabled || this.readOnly;
    }

    get ariaErrorMessageElements() {
        const elements = [this.ariaErrorMessageElement];

        if (this.errorMessage) {
            elements.push(this.errorMessageElement);
        }

        // To inform user of valid date ranges that are set via min/max attributes
        if (this.isRangeMessageVisible) {
            elements.push(this.rangeMessageElement);
        }

        return elements;
    }

    get computedAriaDescribedby() {
        const ariaValues = [];
        this._ariaDescribedBy.forEach((item) => {
            const id = getRealDOMId(item);
            if (id) {
                ariaValues.push(id);
            }
        });

        return normalizeAriaAttribute(ariaValues);
    }

    connectAriaDescribedBy() {
        if (this.ariaObserver && this._rendered) {
            this.ariaObserver.connect({
                attribute: ARIA_DESCRIBEDBY,
                targetSelector: 'input',
                relatedNodeIds: this.computedAriaDescribedby,
                relatedNodes: this.ariaErrorMessageElements,
            });
        }
    }

    get computedDatepickerButtonAriaDescribedby() {
        if (this.isRangeMessageVisible) {
            return this.computedUniqueRangeMessageElementId;
        }
        return '';
    }

    get computedSelectDateLabel() {
        return formatLabel(this.i18n.selectDateFor, this.label);
    }

    get rangeMessage() {
        if (this.min && !this.max) {
            // If only min is set
            return formatLabel(this.i18n.minRangeMessage, this._displayMin);
        } else if (this.max && !this.min) {
            // If only max is set
            return formatLabel(this.i18n.maxRangeMessage, this._displayMax);
        } else if (this.min && this.max) {
            // If both min and max are set
            return formatLabel(
                this.i18n.minAndMaxRangeMessage,
                this._displayMin,
                this._displayMax
            );
        }
        return '';
    }

    handleInputChange(event) {
        event.stopPropagation();

        // keeping the display value in sync with the element's value
        this._displayValue = event.currentTarget.value;
        this._value = parseFormattedDate(this._displayValue).value;
        this.dispatchChangeEvent();
    }

    handleInput() {
        // keeping the display value in sync with the element's value
        this._displayValue = this.inputElement.value;

        // IE11 fires an input event along with the click event when the element has a placeholder.
        // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/101220/
        // remove this block when we stop support for IE11
        if (isIE11 && this.placeholder !== undefined) {
            return;
        }

        // Making sure that the focus remains on the input and we're not triggering leave
        this.hideCalendarAndFocusTrigger();
    }

    handleInputBlur() {
        if (this._value !== null) {
            const normalizedDate = normalizeISODate(
                this._value,
                this.dateStyle
            );
            this._displayValue = normalizedDate.displayValue;
        }
        this.onFocusOut();
    }

    handleInputClick(event) {
        if (this.readOnly) {
            return;
        }

        this.calendarTrigger = event.target;

        this.showCalendar();
    }

    /**
     * When the element gains focus this function is called.
     */
    onFocusIn() {
        if (this._pendingFocusOut) {
            this._pendingFocusOut = false;
        }

        if (!this._focused) {
            this.dispatchEvent(new CustomEvent('focus'));
        }
        this._focused = true;
    }

    /**
     * When the element looses its focus this function is called.
     */
    onFocusOut() {
        // This assumes that a focusin will be dispatched after a focusout
        this._pendingFocusOut = true;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        requestAnimationFrame(() => {
            if (this._pendingFocusOut) {
                this._focused = false;
                this.hideCalendar();
                this.dispatchEvent(new CustomEvent('blur'));
            }
        });
    }

    handleDatePickerIconClick(event) {
        if (this.readOnly || this.disabled) {
            return;
        }

        this.calendarTrigger = event.target;

        this.showAndFocusCalendar();
    }

    handleInputKeydown(event) {
        this.calendarTrigger = event.target;

        handleBasicKeyDownBehaviour(event, this.keyboardInterface);
    }

    handleDatePickerIconKeyDown(event) {
        this.calendarTrigger = event.target;

        handleKeyDownOnDatePickerIcon(event, this.keyboardInterface);
    }

    handleCalendarKeyDown(event) {
        handleBasicKeyDownBehaviour(event, this.keyboardInterface);
    }

    handleDateSelect(event) {
        event.stopPropagation();

        this._value = event.detail.value;

        this._displayValue = normalizeISODate(
            this._value,
            this.dateStyle
        ).displayValue;

        this.hideCalendarAndFocusTrigger();

        this.dispatchChangeEvent();
    }

    showAndFocusCalendar() {
        this.showCalendar();

        // eslint-disable-next-line @lwc/lwc/no-async-operation
        requestAnimationFrame(() => {
            this.focusCalendar();
        });
    }

    hideCalendarAndFocusTrigger() {
        this.hideCalendar();

        if (this.calendarTrigger)
            if (this.calendarTrigger === this.calendarButtonElement) {
                // Fix for W-14258862, focus is transferred to the input element
                // instead of the button element when trigger is button
                this.inputElement.focus();
            } else {
                this.calendarTrigger.focus();
            }
    }

    focusCalendar() {
        const calendar = this.template.querySelector('lightning-calendar');
        if (calendar) {
            calendar.focus();
        }
    }

    startPositioning() {
        if (!this._relationship) {
            this._relationship = startPositioning(this, {
                target: () =>
                    this.template.querySelector(
                        'div.slds-form-element__control'
                    ),
                element: () =>
                    this.template
                        .querySelector('lightning-calendar')
                        .shadowRoot.querySelector('div'),
                align: {
                    horizontal: Direction.Right,
                    vertical: Direction.Top,
                },
                targetAlign: {
                    horizontal: Direction.Right,
                    vertical: Direction.Bottom,
                },
                autoFlip: true, // Auto flip direction if not have enough space
                leftAsBoundary: true, // horizontal flip uses target left as boundary
            });
        } else {
            this._relationship.reposition();
        }
    }

    stopPositioning() {
        if (this._relationship) {
            stopPositioning(this._relationship);
            this._relationship = null;
        }
    }

    showCalendar() {
        if (!this.isCalendarVisible) {
            this.rootElement.classList.add('slds-is-open');

            this._calendarVisible = true;
        }
    }

    hideCalendar() {
        if (this.isCalendarVisible) {
            this.rootElement.classList.remove('slds-is-open');

            this.stopPositioning();
            this._calendarVisible = false;
        }
    }

    get rootElement() {
        return this.template.querySelector('div');
    }

    get inputElement() {
        return this.template.querySelector('input');
    }

    get calendarButtonElement() {
        return this.template.querySelector('lightning-button-icon');
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

    datepickerKeyboardInterface() {
        const that = this;
        return {
            showCalendar() {
                that.showAndFocusCalendar();
            },
            hideCalendar() {
                that.hideCalendarAndFocusTrigger();
            },
            isCalendarVisible() {
                return that.isCalendarVisible;
            },
        };
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
        return computeAriaInvalid(isAriaInvalid, this.hasBadInput() || '');
    }

    get helptextAlternativeText() {
        return formatLabel(i18n.helpTextAlternativeText, this.label);
    }
}
