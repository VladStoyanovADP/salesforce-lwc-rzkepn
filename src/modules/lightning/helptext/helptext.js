import labelButtonAlternativeText from '@salesforce/label/LightningHelptext.buttonAlternativeText';
import { api, track } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { isValidName } from 'lightning/iconUtils';
import { normalizeString } from 'lightning/utilsPrivate';

const DEFAULT_BUTTON_ALT_TEXT = labelButtonAlternativeText;
const DEFAULT_ICON_NAME = 'utility:info';
const DEFAULT_ICON_VARIANT = 'bare';

/**
 * An icon with a text popover used for tooltips.
 */
export default class LightningHelptext extends LightningShadowBaseClass {
    // TODO: future refactoring to remove this.state convention
    @track
    state = {
        iconName: DEFAULT_ICON_NAME,
        iconVariant: DEFAULT_ICON_VARIANT,
        alternativeText: DEFAULT_BUTTON_ALT_TEXT,
    };

    /**
     * Text to be shown in the popover.
     * @type {string}
     * @param {string} value - The plain text string for the tooltip
     */
    @api
    content;

    /**
     * Reserved for internal use only. Use the global tabindex attribute instead.
     * Set tab index to -1 to prevent focus on the button during tab navigation.
     * The default value is 0, which makes the button focusable during tab navigation.
     * @type {number}
     */
    @api tabIndex;

    set iconName(value) {
        this.state.iconName = value;
    }

    /**
     * The Lightning Design System name of the icon used as the visible element.
     * Names are written in the format 'utility:info' where 'utility' is the category,
     * and 'info' is the specific icon to be displayed.
     * The default is 'utility:info'.
     * @type {string}
     * @param {string} value the icon name to use
     * @default utility:info
     */
    @api
    get iconName() {
        if (isValidName(this.state.iconName)) {
            return this.state.iconName;
        }

        return DEFAULT_ICON_NAME;
    }

    set iconVariant(value) {
        this.state.iconVariant = value;
    }

    /**
     * Changes the appearance of the icon.
     * Accepted variants include inverse, warning, error.
     * @type {string}
     * @param {string} value the icon variant to use
     * @default bare
     */
    @api
    get iconVariant() {
        // NOTE: Leaving a note here because I just wasted a bunch of time
        // investigating why both 'bare' and 'inverse' are supported in
        // lightning-primitive-icon. lightning-icon also has a deprecated
        // 'bare', but that one is synonymous to 'inverse'. This 'bare' means
        // that no classes should be applied. So this component needs to
        // support both 'bare' and 'inverse' while lightning-icon only needs to
        // support 'inverse'.
        return normalizeString(this.state.iconVariant, {
            fallbackValue: DEFAULT_ICON_VARIANT,
            validValues: ['bare', 'error', 'inverse', 'warning'],
        });
    }

    /**
     * The assistive text for the button icon. The default is "Help".
     * Screen readers announce the assistive text and help text content as {alternativeText} button {content}.
     * If not set, screen readers announce "Help button {content}".
     * The text should describe the function of the icon, for example, "Show help text".
     *
     * @type {string}
     * @param {string} value The assistive text to set
     * @default Help
     */
    @api
    get alternativeText() {
        return this.state.alternativeText;
    }

    set alternativeText(value) {
        // typeof 'string' check prevents <lightning-helptext alternative-text>
        //   from setting 'true' as the a11y help text
        // lwc treats above alternative-text as: true (typeof 'boolean')
        //   we want to prevent 'true' or empty string as a11y text, instead default to 'Help'
        if (value && typeof value === 'string' && value.trim() !== '') {
            this.state.alternativeText = value;
        } else {
            // warn why they can't unset the value
            // eslint-disable-next-line no-console
            console.warn(
                `<lightning-helptext> Invalid alternativeText value: ${value}`
            );
        }
    }

    /**
     * Sets focus on the button.
     */
    @api
    focus() {
        this.template.querySelector('lightning-button-icon').focus();
    }

    // Get the variant to be applied to button based on the icon variant
    get computedButtonVariant() {
        switch (this.iconVariant) {
            case 'inverse':
                return 'bare-inverse';
            default:
                return 'bare';
        }
    }

    // Get the class to be applied to icon based on the icon variant
    get computedIconClass() {
        switch (this.iconVariant) {
            case 'error':
                return 'slds-icon-text-error';
            case 'warning':
                return 'slds-icon-text-warning';
            default:
                return '';
        }
    }
}
