import { LightningElement, api, track } from 'lwc';
import { normalizeBoolean } from 'lightning/utilsPrivate';
import { getLinkInfo } from 'lightning/routingService';
import { PrivateLookupItemPickedEvent } from './events';

export const EVENTS = {
    PrivateLookupItemPickedEvent,
};

export default class LightningFormattedLookup extends LightningElement {
    /**
     * {string} The related name/record name to display
     */
    @api displayValue;

    /**
     * Reserved for internal use. Use tabindex instead to indicate if an element should be focusable.
     * A value of 0 means that the element is focusable and
     * participates in sequential keyboard navigation. A value of -1 means
     * that the element is focusable but does not participate in keyboard navigation.
     * @type {number}
     *
     */
    @api tabIndex;

    /**
     * @param {string} value - The record id to point to.
     */
    set recordId(value) {
        // hanging value on state makes sure changes
        // trigger a re-render
        this.state.recordId = value;
        // re-fetch url info
        this.updateLinkData();
    }

    @api
    get recordId() {
        return this.state.recordId;
    }

    /**
     * {boolean} Determines if the output is navigable or not along
     * with the url and dispatcher returned from routing-service
     */
    @api
    get disabled() {
        return this.state.disabled;
    }
    set disabled(value) {
        this.state.disabled = normalizeBoolean(value);
        this.isNavigable =
            !this.disabled && !!this.dispatcher && !!this.state.url;
    }

    _connected;

    // Specifies whether we need to dynamically manage the data-navigation attribute
    // to reflect whether we are focusable or not. "data-navigation" is used by datatable
    // to determine whether a custom element is focusable
    _dataNavigation;

    dispatcher;

    @track
    state = {
        disabled: false,
        recordId: null,
        url: null,
        isNavigable: false,
    };

    constructor() {
        super();
        this._connected = false;
        this.dispatcher = null;
    }

    /**
     * Lifecycle callback for connected.
     * @returns {undefined}
     */
    connectedCallback() {
        // this is to guard getLinkInfo, which will
        // not work if called before the component is connected
        this._connected = true;
        this.updateLinkData();

        // "data-navigation" is part of the public API for building an accessible cell component
        // for use inside lightning-datatable and lightning-tree-grid. Because this component is
        // only conditionally focusable, we need to check for its existence to determine whether
        // we need to manage it dynamically.
        if (this.getAttribute('data-navigation') === 'enable') {
            this._dataNavigation = true;
            this.removeAttribute('data-navigation');
        }
    }

    /**
     * Lifecycle callback for disconnected
     * @returns {undefined}
     */
    disconnectedCallback() {
        this._connected = false;
    }

    /**
     * Sets focus on the element.
     */
    @api
    focus() {
        if (this.anchor) {
            this.anchor.focus();
        }
    }

    /**
     * Removes keyboard focus from the element.
     */
    @api
    blur() {
        if (this.anchor) {
            this.anchor.blur();
        }
    }

    /**
     * Simulates a mouse click on the url and navigates to it using the specified target.
     */
    @api
    click() {
        if (this.anchor) {
            this.anchor.click();
        }
    }

    get anchor() {
        if (this._connected && this.isNavigable) {
            return this.template.querySelector('a');
        }
        return undefined;
    }

    get isNavigable() {
        return this.state.isNavigable;
    }

    set isNavigable(value) {
        const normalizedValue = normalizeBoolean(value);
        this.state.isNavigable = normalizedValue;

        if (this._connected && this._dataNavigation) {
            if (normalizedValue) {
                this.setAttribute('data-navigation', 'enable');
            } else {
                this.removeAttribute('data-navigation');
            }
        }
    }

    /**
     * Fetch info for the link url
     * async, updates this.state
     * @returns {undefined}
     */
    updateLinkData() {
        if (this._connected && this.state.recordId) {
            getLinkInfo(this, {
                stateType: 'standard__recordPage',
                attributes: {
                    recordId: this.state.recordId,
                    actionName: 'view',
                },
            }).then((linkInfo) => {
                this.state.url = linkInfo.url;
                this.dispatcher = linkInfo.dispatcher;
                this.isNavigable =
                    !this.disabled && !!this.dispatcher && !!this.state.url;
            });
        }
    }

    /**
     * Handles the click event on the link.
     * @param {Event} event The event that triggered this handler.
     * @returns {undefined}
     */
    handleClick(event) {
        this.dispatchEvent(
            new PrivateLookupItemPickedEvent({
                recordId: this.recordId,
            })
        );

        this.dispatcher(event);
    }
}
