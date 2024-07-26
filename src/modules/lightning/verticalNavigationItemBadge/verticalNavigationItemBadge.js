import labelNewItems from '@salesforce/label/LightningVerticalNavigation.newItems';
import { api, track } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { isCSR } from 'lightning/utilsPrivate';

const i18n = {
    newItems: labelNewItems,
};

const DEFAULT_HREF = 'javascript:void(0);'; // eslint-disable-line no-script-url

/**
 * A link and badge within lightning-vertical-navigation-section or lightning-vertical-navigation-overflow.
 */
export default class LightningVerticalNavigationItemBadge extends LightningShadowBaseClass {
    static validationOptOut = ['class'];
    _rendered = false;
    /**
     * The text displayed for this navigation item.
     * @type {string}
     * @required
     */
    @api label;

    /**
     * A unique identifier for this navigation item.
     * @type {string}
     * @required
     */
    @api name;

    /**
     * The number to show inside the badge. If this value is zero, the badge is hidden.
     * The default value is zero.
     * @type {number}
     * @default 0
     */
    @api badgeCount = 0;

    /**
     * Assistive text describing the number in the badge, which enhances accessibility and is not displayed to the user.
     * The default is "New Items".
     * @type {string}
     */
    @api assistiveText = i18n.newItems;

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
        return this._selected && this._rendered ? 'page' : false;
    }

    get showBadge() {
        return this.badgeCount > 0;
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
