import { api, track } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { isCSR } from 'lightning/utilsPrivate';

const DEFAULT_HREF = 'javascript:void(0);'; // eslint-disable-line no-script-url

/**
 * A text-only link within lightning-vertical-navigation-section or lightning-vertical-navigation-overflow.
 */
export default class LightningVerticalNavigationItem extends LightningShadowBaseClass {
    static validationOptOut = ['class'];
    _rendered = false;

    /**
     * The text displayed for the navigation item.
     * @type {string}
     * @required
     */
    @api label;

    /**
     * A unique identifier for the navigation item.
     * The name is used by the `select` event on lightning-vertical-navigation to identify which item is selected.
     * @type {string}
     * @required
     */
    @api name;

    /**
     * The URL of the page that the navigation item goes to.
     * @type {string}
     */
    @api href = DEFAULT_HREF;

    @track _selected = false;

    connectedCallback() {
        super.connectedCallback();
        this.setAttribute('role', 'listitem');
        this.classList.add('slds-nav-vertical__item');
        if (isCSR) {
            this.dispatchEvent(
                new CustomEvent('privateitemregister', {
                    bubbles: true,
                    cancelable: true,
                    detail: {
                        callbacks: {
                            select: this.select.bind(this),
                            deselect: this.deselect.bind(this),
                        },
                        name: this.name,
                    },
                })
            );
        }
    }

    renderedCallback() {
        if (!this._rendered) {
            this._rendered = true;
        }
    }

    select() {
        this._selected = true;
        this.classList.add('slds-is-active');
    }

    deselect() {
        this._selected = false;
        this.classList.remove('slds-is-active');
    }

    get ariaCurrent() {
        return this._selected && this._rendered ? 'page' : null;
    }

    handleClick(event) {
        this.dispatchEvent(
            new CustomEvent('privateitemselect', {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: {
                    name: this.name,
                },
            })
        );

        if (this.href === DEFAULT_HREF) {
            event.preventDefault();
        }
    }
}
