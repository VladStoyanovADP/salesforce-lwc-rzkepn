import { api } from 'lwc';
import { classSet } from 'lightning/utils';
import {
    normalizeString,
    normalizeBoolean,
    reflectAttribute,
} from 'lightning/utilsPrivate';
// remove-next-line-for-c-namespace
import { Tooltip, TooltipType } from 'lightning/tooltipLibrary';
import LightningPrimitiveButton from 'lightning/primitiveButton';

const DEFAULT_SIZE = 'medium';
const DEFAULT_VARIANT = 'border';

/**
 * An icon-only button that retains state.
 */
export default class LightningButtonIconStateful extends LightningPrimitiveButton {
    static delegatesFocus = true;

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
     * The variant changes the appearance of button-icon.
     * Accepted variants include border, border-filled, and border-inverse.
     * This value defaults to border.
     *
     * @type {string}
     * @default border
     */
    @api variant = DEFAULT_VARIANT;

    /**
     * The Lightning Design System name of the icon.
     * Names are written in the format 'utility:down' where 'utility' is the category,
     * and 'down' is the specific icon to be displayed.
     * Only utility icons can be used in this component.
     *
     * @type {string}
     */
    @api iconName;

    /**
     * The size of the button-icon component.
     * Options include xx-small, x-small, small, and medium.
     * This value defaults to medium.
     *
     * @type {string}
     * @default medium
     */
    @api size = DEFAULT_SIZE;

    /**
     * The alternative text used to describe the icon.
     * This text should describe what happens when you click the button,
     * for example 'Upload File', not what the icon looks like, 'Paperclip'.
     *
     * @type {string}
     */
    @api alternativeText;

    get computedTitle() {
        return this.title || this.alternativeText || null;
    }

    get normalizedVariant() {
        return normalizeString(this.variant, {
            fallbackValue: DEFAULT_VARIANT,
            validValues: ['border', 'border-filled', 'border-inverse'],
        });
    }

    get normalizedSize() {
        return normalizeString(this.size, {
            fallbackValue: DEFAULT_SIZE,
            validValues: ['xx-small', 'x-small', 'small', 'medium'],
        });
    }

    /**
     * Specifies whether the button is in a selected state.
     * This value defaults to false.
     * @type {boolean}
     */
    @api
    get selected() {
        return this.state.selected || false;
    }

    set selected(value) {
        this.state.selected = normalizeBoolean(value);
    }

    get computedAriaPressed() {
        return String(this.selected);
    }

    get computedButtonClass() {
        const classes = classSet(super.computedButtonClass);
        classes.add('slds-button_icon');
        const { normalizedSize, normalizedVariant } = this;

        switch (normalizedSize) {
            case 'small':
                classes.add('slds-button_icon-small');
                break;
            case 'x-small':
                classes.add('slds-button_icon-x-small');
                break;
            case 'xx-small':
                classes.add('slds-button_icon-xx-small');
                break;
            case 'medium': // no size modifier
            default:
        }
        classes.add({
            'slds-button_icon-border': normalizedVariant === 'border',
            'slds-button_icon-border-filled':
                normalizedVariant === 'border-filled',
            // TODO: These two styles should be combined into 'slds-button_icon-border-inverse' when W-4561664 is fixed
            'slds-button_icon-border slds-button_icon-inverse':
                normalizedVariant === 'border-inverse',
            'slds-is-selected': this.selected === true,
        });
        return classes.toString();
    }

    // remove-next-line-for-c-namespace
    /**
     * Text to display when the user mouses over or focuses on the button.
     * The tooltip is auto-positioned relative to the button and screen space.
     * @type {string}
     * @param {string} value - The plain text string for the tooltip
     */
    @api
    get tooltip() {
        return this._tooltip ? this._tooltip.value : undefined;
    }

    // remove-next-line-for-c-namespace
    set tooltip(value) {
        this.tooltipValue = value;
        if (this._tooltip) {
            this._tooltip.value = value;
        } else if (value && this.rendered) {
            this.createTooltip(value);
        }
    }

    // remove-next-line-for-c-namespace
    _tooltip = null;
    tooltipValue = null;
    tooltipType = TooltipType.Info;

    /**
     * Generate a tooltip with the specified value and current tooltip type
     *
     * @param {*} value - The plain text string for the tooltip
     */
    createTooltip(value) {
        this._tooltip = new Tooltip(value, {
            root: this,
            target: () => this.template.querySelector('button'),
            type: this.tooltipType,
        });
        this._tooltip.initialize();
    }

    /**
     * Sets focus on the button.
     */
    @api
    focus() {
        this.template.querySelector('button').focus();
    }

    renderedCallback() {
        // initialize aria attributes in primitiveButton
        super.renderedCallback();
        // button inherits from primitiveButton, button.css not working in this case.
        // change host style to disable pointer event.
        this.template.host.style.pointerEvents = this.disabled ? 'none' : '';

        reflectAttribute(this, 'variant', this.normalizedVariant);
        reflectAttribute(this, 'size', this.normalizedSize);
        reflectAttribute(this, 'selected', this.selected);
        reflectAttribute(this, 'disabled', this.disabled);

        // remove-next-line-for-c-namespace
        if (this.tooltipValue && !this._tooltip) {
            this.createTooltip(this.tooltipValue);
        }
    }

    disconnectedCallback() {
        if (this._tooltip) {
            this._tooltip.disconnect();
        }
    }
}
