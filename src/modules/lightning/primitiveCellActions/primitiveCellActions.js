import labelLoadingActions from '@salesforce/label/LightningPrimitiveCellActions.loadingActions';
import labelShowActions from '@salesforce/label/LightningPrimitiveCellActions.showActions';
import { LightningElement, api, track } from 'lwc';
import { normalizeString } from 'lightning/utilsPrivate';

const DEFAULT_MENU_ALIGNMENT = 'auto-right';
const VALID_MENU_ALIGNMENT = [
    'auto-right',
    'auto-left',
    'auto',
    'left',
    'center',
    'right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
];

const i18n = {
    loadingActions: labelLoadingActions,
    showActions: labelShowActions,
};

/**
 * A cell-level action.
 */
export default class PrimitiveCellActions extends LightningElement {
    // Tracked objects
    @track containerRect;
    @track _actions = [];

    // Private variables
    static delegatesFocus = true;
    _isLoadingActions;
    _menuAlignment = DEFAULT_MENU_ALIGNMENT;

    /************************** PUBLIC ATTRIBUTES ***************************/

    @api rowKeyValue;
    @api colKeyValue;
    @api rowActions;
    @api internalTabIndex;

    /**
     * Defines the current menu alignment
     * See `VALID_MENU_ALIGNMENT` for valid menu alignment values
     * See `DEFAULT_MENU_ALIGNMENT` for the default menu alignment
     *
     * @type {string}
     */
    @api
    get menuAlignment() {
        return this._menuAlignment;
    }

    set menuAlignment(value) {
        this._menuAlignment = normalizeString(value, {
            fallbackValue: DEFAULT_MENU_ALIGNMENT,
            validValues: VALID_MENU_ALIGNMENT,
        });
    }

    /************************** PUBLIC METHODS ***************************/

    /**
     * Sets focus on a lightning-button-menu
     */
    @api
    focus() {
        if (this._connected) {
            this.refs.buttonMenu.focus();
        }
    }

    /**
     * Clicks a lightning-button-menu
     */
    @api
    click() {
        if (this._connected) {
            // focus/click without changing tabindex doesnt work W-6185168
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            setTimeout(() => {
                this.refs.buttonMenu.click();
            }, 0);
        }
    }

    /************************** PRIVATE GETTERS **************************/

    /**
     * Returns the computed menu alignment value
     *
     * @return {string} Current computed menu alignment
     */
    get computedMenuAlignment() {
        return this.menuAlignment;
    }

    /**
     * Returns the button alternative text in the appropriate language
     *
     * @return {string} Language-specific button alternative text
     */
    get buttonAlternateText() {
        return `${i18n.showActions}`;
    }

    /**
     * Returns the spinner alternative text in the appropriate language
     *
     * @return {string} Language-specific spinner alternative text
     */
    get spinnerAlternateText() {
        return `${i18n.loadingActions}`;
    }

    /************************ EVENT DISPATCHERS **************************/

    /**
     * Handles selecting an action
     *
     * @param {Event} event
     */
    handleActionSelect(event) {
        this.dispatchEvent(
            new CustomEvent('privatecellactiontriggered', {
                composed: true,
                bubbles: true,
                cancelable: true,
                detail: {
                    rowKeyValue: this.rowKeyValue,
                    colKeyValue: this.colKeyValue,
                    action: event.detail.value,
                },
            })
        );
    }

    /**
     * Handles the opening of an action menu
     */
    handleMenuOpen() {
        this.elementRect = this.refs.buttonMenu.getBoundingClientRect();

        const detail = {
            rowKeyValue: this.rowKeyValue,
            colKeyValue: this.colKeyValue,
            doneCallback: this.finishLoadingActions.bind(this),
            saveContainerPosition: (containerRect) => {
                this.containerRect = containerRect;
            },
        };

        if (typeof this.rowActions === 'function') {
            this._isLoadingActions = true;
            this._actions = [];

            detail.actionsProviderFunction = this.rowActions;
            // This callback should always be async
            Promise.resolve().then(() => {
                this.dispatchEvent(
                    new CustomEvent('privatecellactionmenuopening', {
                        composed: true,
                        bubbles: true,
                        cancelable: true,
                        detail,
                    })
                );
            });
        } else {
            this._actions = this.rowActions;
        }
    }

    /************************** LIFECYCLE HOOKS **************************/

    connectedCallback() {
        this._connected = true;
    }

    disconnectedCallback() {
        this._connected = false;
    }

    /************************* HELPER FUNCTIONS **************************/

    /**
     * Resets loading state when all actions have been loaded
     *
     * @param {object} actions - Actions displayed in the menu
     */
    finishLoadingActions(actions) {
        this._isLoadingActions = false;
        this._actions = actions;
    }
}
