import { api } from 'lwc';
import { classSet } from 'lightning/utils';
import { getKineticsAttributes, animate } from './kinetics';
import {
    hasAnimation,
    normalizeString as normalize,
    normalizeBoolean,
    reflectAttribute,
    isCSR,
} from 'lightning/utilsPrivate';
import LightningPrimitiveButton from 'lightning/primitiveButton';
import template from './button.html';

/**
 * A clickable element used to perform an action.
 */
export default class LightningButton extends LightningPrimitiveButton {
    static delegatesFocus = true;
    _normalizedVariant = 'neutral';
    _stretch = false;

    /**
     * The name for the button element.
     * This value is optional and can be used to identify the button in a callback.
     *
     * @type {string}
     */
    @api name;

    /**
     * The value for the button element.
     * This value is optional and can be used when submitting a form.
     *
     * @type {string}
     */
    @api value;

    /**
     * The text to be displayed inside the button.
     *
     * @type {string}
     */
    @api label;

    /**
     * Reserved for internal use only. Use the global tabindex attribute instead.
     * Set tab index to -1 to prevent focus on the button during tab navigation.
     * The default value is 0, which makes the button focusable during tab navigation.
     * @type {number}
     */
    @api tabIndex;

    /**
     * The variant changes the appearance of the button.
     * Accepted variants include base, neutral, brand, brand-outline, destructive, destructive-text, inverse, and success.
     * This value defaults to neutral.
     *
     * @type {string}
     * @default neutral
     */
    @api
    get variant() {
        return this.originalVariant;
    }

    set variant(value) {
        this.originalVariant = value;
        this._normalizedVariant = normalize(value, {
            fallbackValue: 'neutral',
            validValues: [
                'base',
                'neutral',
                'brand',
                'brand-outline',
                'destructive',
                'destructive-text',
                'inverse',
                'success',
            ],
        });
        reflectAttribute(this, 'variant', this._normalizedVariant);
    }

    /**
     * The Lightning Design System name of the icon.
     * Names are written in the format 'utility:down' where 'utility' is the category,
     * and 'down' is the specific icon to be displayed.
     *
     * @type {string}
     */
    @api iconName;

    /**
     * Describes the position of the icon with respect to the button label.
     * Options include left and right.
     * This value defaults to left.
     *
     * @type {string}
     * @default left
     */
    @api iconPosition = 'left';

    _originalStretch = false;
    _normalizedStretch = false;
    /**
     * Setting it to true allows the button to take up the entire available width.
     * This value defaults to false.
     *
     * @type {boolean}
     * @default false
     */
    @api
    get stretch() {
        return this._originalStretch;
    }

    set stretch(value) {
        this._originalStretch = value;
        this._normalizedStretch = normalizeBoolean(value);
        reflectAttribute(this, 'stretch', this._normalizedStretch);
    }

    /**
     * Specifies the type of button.
     * Valid values are button, reset, and submit.
     * This value defaults to button.
     *
     * @type {string}
     * @default button
     */
    @api type = 'button';

    _disableAnimation = false;
    /**
     * Reserved for internal use. If present, disables button animation.
     */
    @api
    get disableAnimation() {
        return this._disableAnimation;
    }
    set disableAnimation(value) {
        this._disableAnimation = normalizeBoolean(value);
    }

    render() {
        return template;
    }

    get computedButtonClass() {
        const classes = classSet(super.computedButtonClass);
        return classes
            .add({
                'slds-button_neutral': this._normalizedVariant === 'neutral',
                'slds-button_brand': this._normalizedVariant === 'brand',
                'slds-button_outline-brand':
                    this._normalizedVariant === 'brand-outline',
                'slds-button_destructive':
                    this._normalizedVariant === 'destructive',
                'slds-button_text-destructive':
                    this._normalizedVariant === 'destructive-text',
                'slds-button_inverse': this._normalizedVariant === 'inverse',
                'slds-button_success': this._normalizedVariant === 'success',
                'slds-button_stretch': this.stretch,
            })
            .toString();
    }

    get normalizedType() {
        return normalize(this.type, {
            fallbackValue: 'button',
            validValues: ['button', 'reset', 'submit'],
        });
    }

    get normalizedIconPosition() {
        return normalize(this.iconPosition, {
            fallbackValue: 'left',
            validValues: ['left', 'right'],
        });
    }

    get showIconLeft() {
        return this.iconName && this.normalizedIconPosition === 'left';
    }

    get showIconRight() {
        return this.iconName && this.normalizedIconPosition === 'right';
    }

    get computedIconClass() {
        return classSet('slds-button__icon')
            .add({
                'slds-button__icon_left':
                    this.normalizedIconPosition === 'left',
                'slds-button__icon_right':
                    this.normalizedIconPosition === 'right',
            })
            .toString();
    }

    handleButtonFocus() {
        this.dispatchEvent(new CustomEvent('focus'));
    }

    handleButtonBlur() {
        this.dispatchEvent(new CustomEvent('blur'));
    }

    handleButtonClick() {
        // In native shadow mode, parent form can't be submitted from within the
        // shadow boundary, so we need to manually find the parent form and submit.
        // Once TD-0118070 is delivered, we can access the parent form using `elementInternals.form`
        if (!this.template.synthetic && this.normalizedType === 'submit') {
            const form = this.template.host.closest('form');
            if (form) {
                form.requestSubmit();
            }
        }
    }

    /**
     * Sets focus on the button.
     */
    @api
    focus() {
        if (this._connected) {
            this.button.focus();
        }
    }

    /**
     * Simulates a mouse click on the button.
     */
    @api
    click() {
        if (this._connected) {
            this.button.click();
        }
    }

    get button() {
        return isCSR ? this.template.querySelector('button') : null;
    }

    /**
     * Once we are connected, we fire a register event so the button-group (or other) component can register
     * the buttons.
     */
    connectedCallback() {
        super.connectedCallback();
        // Set `data-render-mode` attribute in native shadow mode
        if (!this.template.synthetic) {
            this.setAttribute('data-render-mode', 'shadow');
        }
        if (!this._connected) {
            reflectAttribute(this, 'variant', this._normalizedVariant);
            this._connected = true;
        }
    }

    renderedCallback() {
        // initialize aria attributes in primitiveButton
        super.renderedCallback();
        // button inherits from primitiveButton, button.css not working in this case.
        // change host style to disable pointer event.
        this.template.host.style.pointerEvents = this.disabled ? 'none' : '';
        // setup kinetics

        if (!this.disabled && hasAnimation() && !this._disableAnimation) {
            const attributes = getKineticsAttributes(this._normalizedVariant);
            attributes.forEach(({ name, value }) => {
                this.button.setAttribute(name, value);
            });
            animate(this.button);
        } else {
            const attributes = getKineticsAttributes(this._normalizedVariant);
            attributes.forEach(({ name }) => {
                this.button.removeAttribute(name);
            });
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._connected = false;
    }
}

LightningButton.interopMap = {
    exposeNativeEvent: {
        click: true,
        focus: true,
        blur: true,
    },
};
