import { api } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { isCSR } from 'lightning/utilsPrivate';
const DEFAULT_HREF = '#';

/**
 * An item in the hierarchy path of the page the user is on.
 */
export default class LightningBreadcrumb extends LightningShadowBaseClass {
    static validationOptOut = ['class'];
    /**
     * The URL of the page that the breadcrumb goes to.
     * @type {string}
     */
    @api href;

    /**
     * The text label for the breadcrumb.
     * @type {string}
     * @required
     */
    @api label;

    /**
     * The name for the breadcrumb component. This value is optional and can be
     * used to identify the breadcrumb in a callback.
     *
     * @type {string}
     */
    @api name;

    _ariaCurrent;

    /**
     * Reserved for internal use.
     */
    @api
    get ariaCurrent() {
        return this._ariaCurrent;
    }

    set ariaCurrent(value) {
        this._ariaCurrent = value;
    }

    get computedHref() {
        return this.href || DEFAULT_HREF;
    }

    /**
     * Sets focus on the link.
     */
    @api
    focus() {
        if (this.connected) {
            this.linkElement.focus();
        }
    }

    /**
     * Removes focus on the link.
     */
    @api
    blur() {
        if (this.connected) {
            this.linkElement.blur();
        }
    }

    get linkElement() {
        return isCSR ? this.template.querySelector('a') : null;
    }

    /**
     * if href was empty, prevent default to avoid adding # to URL
     * @param e
     */
    handleClick(e) {
        if (!this.href) {
            e.preventDefault();
        }
    }

    connectedCallback() {
        super.connectedCallback();
        this.connected = true;
        // add default CSS classes to custom element tag
        this.classList.add('slds-breadcrumb__item');

        this.setAttribute('role', 'listitem');
    }

    disconnectedCallback() {
        this.connected = false;
    }
}
