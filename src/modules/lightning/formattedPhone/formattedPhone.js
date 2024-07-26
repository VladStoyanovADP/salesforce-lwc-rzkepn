import { api } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { toNorthAmericanPhoneNumber } from 'lightning/utilsPrivate';

/**
 * Displays a phone number as a hyperlink with the tel: URL scheme.
 */
export default class LightningFormattedPhone extends LightningShadowBaseClass {
    /**
     * Sets the phone number to display.
     * @type {number}
     *
     */
    @api value;

    /**
     * If present, the phone number displays as plain text instead of a link.
     * The number cannot be clicked or receive focus.
     * @type {boolean}
     * @default false
     */
    @api disabled = false;

    /**
     * Reserved for internal use. Use tabindex instead to indicate if an element should be focusable.
     * A value of 0 means that the element is focusable and
     * participates in sequential keyboard navigation. A value of -1 means
     * that the element is focusable but does not participate in keyboard navigation.
     * @type {number}
     *
     */
    @api tabIndex;

    _connected = false;

    connectedCallback() {
        this._connected = true;
    }

    disconnectedCallback() {
        this._connected = false;
    }

    /**
     * Sets focus on the element.
     */
    @api
    focus() {
        if (this.phoneAnchor) {
            this.phoneAnchor.focus();
        }
    }

    /**
     * Removes keyboard focus from the element.
     */
    @api
    blur() {
        if (this.phoneAnchor) {
            this.phoneAnchor.blur();
        }
    }

    /**
     * Simulates a mouse click on the phone number and opens the default phone app.
     */
    @api
    click() {
        const anchor = this.phoneAnchor;
        if (anchor && anchor.click) {
            anchor.click();
        }
    }

    get phoneAnchor() {
        if (this._connected && this.showLink && !this.disabled) {
            return this.template.querySelector('a');
        }
        return undefined;
    }

    get showLink() {
        return this.value != null && this.value !== '';
    }

    get formattedPhoneNumber() {
        return toNorthAmericanPhoneNumber(this.value);
    }

    get link() {
        return `tel:${this.value}`;
    }
}
