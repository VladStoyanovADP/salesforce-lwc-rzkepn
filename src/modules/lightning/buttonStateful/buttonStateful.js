import { api, track } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet } from 'lightning/utils';
import {
    normalizeBoolean,
    normalizeString as normalize,
    buttonGroupOrderClass,
} from 'lightning/utilsPrivate';
import { isCSR } from 'lightning/utilsPrivate';

const DEFAULT_VARIANT = 'neutral';

/**
 * A button that toggles between states.
 */
export default class LightningButtonStateful extends LightningShadowBaseClass {
    static delegatesFocus = true;

    _originalVariant = DEFAULT_VARIANT;
    _privateVariant = DEFAULT_VARIANT;

    @track
    state = {
        isClicked: false,
    };

    /**
     * Passthrough to pass disabled attribute onto button
     */
    @api disabled;

    /**
     * The name of the icon to be used in the format 'utility:check' when the state is true.
     *
     * @type {string}
     */
    @api iconNameWhenOn;

    /**
     * The name of the icon to be used in the format 'utility:add' when the state is false.
     *
     * @type {string}
     */
    @api iconNameWhenOff;

    /**
     * The name of the icon to be used in the format 'utility:close' when the state is true and the button receives focus.
     *
     * @type {string}
     */
    @api iconNameWhenHover;

    /**
     * The text to be displayed inside the button when state is false.
     *
     * @type {string}
     * @required
     */
    @api labelWhenOff;

    /**
     * The text to be displayed inside the button when state is true.
     *
     * @type {string}
     * @required
     */
    @api labelWhenOn;

    /**
     * The text to be displayed inside the button when state is true and the button receives focus.
     *
     * @type {string}
     */
    @api labelWhenHover;

    /**
     * Reserved for internal use only.
     * Describes the order of this element (first, middle or last) inside lightning-button-group.
     * @type {string}
     */
    @api groupOrder = '';

    /**
     * The variant changes the appearance of the button.
     * Accepted variants include brand, destructive, inverse, neutral, success, and text.
     *
     * @type {string}
     * @default neutral
     */
    @api
    get variant() {
        return this._originalVariant;
    }

    set variant(value) {
        this._originalVariant = value;
        this._privateVariant = this.normalizeVariant(value);
        this.reflectAttribute('variant', this._privateVariant);
    }

    /**
     * If present, the button is in the selected state.
     * @type {boolean}
     * @default false
     */
    @api
    get selected() {
        return this.state.selected || false;
    }
    set selected(value) {
        this.state.selected = normalizeBoolean(value);
    }

    renderedCallback() {
        // change host style to disable pointer event.
        this.template.host.style.pointerEvents = this.disabled ? 'none' : '';
    }

    /**
     * Sets focus on the button.
     */
    @api
    focus() {
        if (isCSR) {
            this.template.querySelector('button').focus();
        }
    }

    // update custom element's classList
    get computedButtonClass() {
        const classes = classSet('slds-button slds-button_stateful')
            .add({
                'slds-button_neutral': this._privateVariant === 'neutral',
                'slds-button_brand': this._privateVariant === 'brand',
                'slds-button_inverse': this._privateVariant === 'inverse',
                'slds-button_destructive':
                    this._privateVariant === 'destructive',
                'slds-button_success': this._privateVariant === 'success',
            })
            .add({
                'slds-not-selected': !this.selected,
                'slds-is-selected': this.selected && !this.state.isClicked,
                'slds-is-selected-clicked':
                    this.selected && this.state.isClicked,
            })
            .add(buttonGroupOrderClass(this.groupOrder));

        return classes.toString();
    }

    // normalize variant attribute
    normalizeVariant(value) {
        return normalize(value, {
            fallbackValue: DEFAULT_VARIANT,
            validValues: [
                'neutral',
                'brand',
                'inverse',
                'destructive',
                'success',
                'text',
            ],
        });
    }

    // validate labelWhenOn and output error to console if needed
    get privateLabelWhenOn() {
        let outputVal = this.labelWhenOn;

        // if valid label short circuit out
        if (this.isValidLabel(outputVal)) {
            return outputVal;
        }

        outputVal = '';
        // eslint-disable-next-line no-console
        console.warn(
            `<lightning-button-stateful> The "labelWhenOn" attribute value is required to show the label when selected has a value of true`
        );

        return outputVal;
    }

    // validate labelWhenOff and output error to console if needed
    get privateLabelWhenOff() {
        let outputVal = this.labelWhenOff;

        // if valid label short circuit out
        if (this.isValidLabel(outputVal)) {
            return outputVal;
        }

        outputVal = '';
        // eslint-disable-next-line no-console
        console.warn(
            `<lightning-button-stateful> The "labelWhenOff" attribute value is required to show the label when selected has a value of false`
        );

        return outputVal;
    }

    // validate labelWhenHover and if invalid output same value as labelWhenOn
    get privateLabelWhenHover() {
        const outputVal = this.labelWhenHover;

        // if valid label short circuit out
        if (this.isValidLabel(outputVal)) {
            return outputVal;
        }

        // if invalid label output same value as labelWhenOn
        return this.privateLabelWhenOn;
    }

    // if iconNameWhenHover is empty or missing fall back to iconNameWhenOn
    get privateIconNameWhenHover() {
        // if value exists pass it through
        if (this.iconNameWhenHover) {
            return this.iconNameWhenHover;
        }

        // if no value exists return iconNameWhenOn
        return this.iconNameWhenOn;
    }

    // set isClicked to true when button is clicked
    handleButtonClick() {
        this.state.isClicked = true;
    }

    // set isClicked to false when button is blurred
    handleButtonBlur() {
        this.state.isClicked = false;

        this.dispatchEvent(new CustomEvent('blur'));
    }

    handleButtonFocus() {
        this.dispatchEvent(new CustomEvent('focus'));
    }

    get computedAriaPressed() {
        return String(this.state.selected);
    }

    // validate a label is a string and not zero length
    isValidLabel(labelVal) {
        // if not a string or of length 0 then label is not valid
        if (typeof labelVal !== 'string' || labelVal.length === 0) {
            return false;
        }

        return true;
    }

    reflectAttribute(name, value) {
        if (value) {
            this.setAttribute(name, value);
        } else {
            this.removeAttribute(name);
        }
    }
}

LightningButtonStateful.interopMap = {
    props: {
        selected: 'state',
    },
};
