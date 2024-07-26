import labelClipText from '@salesforce/label/LightningDatatable.clipText';
import labelShowActions from '@salesforce/label/LightningDatatable.showActions';
import labelWrapText from '@salesforce/label/LightningDatatable.wrapText';
import { LightningElement, api, track } from 'lwc';
import { deepCopy } from 'lightning/utilsPrivate';
import { formatLabel } from 'lightning/utils';

const i18n = {
    clipText: labelClipText,
    showActions: labelShowActions,
    wrapText: labelWrapText,
};

/**
 * A header-level action.
 */
export default class PrimitiveHeaderActions extends LightningElement {
    // Tracked objects
    @track containerRect;
    @track _internalActions = [];
    @track _customerActions = [];

    // Private variables
    static delegatesFocus = true;
    _actionMenuAlignment;

    /************************** PUBLIC ATTRIBUTES ***************************/

    @api colKeyValue;

    /**
     * Defines the actions on a header cell
     *
     * @type {Object}
     */
    @api
    get actions() {
        return this._actions;
    }

    set actions(value) {
        this._actions = value;
        this.updateActions();
    }

    /**
     * Defines the label of the column header
     *
     * @type {String}
     */

    @api columnHeader;

    /************************** PUBLIC METHODS ***************************/

    /**
     * Sets focus on a lightning-button-menu
     */
    @api
    focus() {
        const btnMenu = this.refs.buttonMenu;

        if (btnMenu) {
            btnMenu.focus();
        }
    }

    /************************** PRIVATE GETTERS **************************/

    /**
     * Returns the internationalization definition object
     *
     * @return {Object} The i18n definition object
     */
    get i18n() {
        return i18n;
    }

    /**
     * Determines whether or not a header has actions
     *
     * @return {Boolean}
     */
    get hasActions() {
        return (
            this._internalActions.length > 0 || this._customerActions.length > 0
        );
    }

    /**
     * Determines whether or not a header has an action divider
     *
     * @return {Boolean}
     */
    get hasActionsDivider() {
        return (
            this._internalActions.length > 0 && this._customerActions.length > 0
        );
    }

    /************************ EVENT DISPATCHERS **************************/

    /**
     * Handles opening a menu
     *
     * @param {Event} event
     */
    handleMenuOpen(event) {
        event.preventDefault();
        event.stopPropagation();

        this.elementRect = this.refs.buttonMenu.getBoundingClientRect();

        this.dispatchEvent(
            new CustomEvent('privatecellheaderactionmenuopening', {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: {
                    actionsCount:
                        this._internalActions.length +
                        this._customerActions.length,
                    dividersCount: this.hasActionsDivider ? 1 : 0,
                    saveContainerPosition: (containerRect) => {
                        this.containerRect = containerRect;
                    },
                },
            })
        );
    }

    /**
     * Handles closing a menu
     */
    handleMenuClose() {
        this.dispatchEvent(
            new CustomEvent('privatecellheaderactionmenuclosed', {
                bubbles: true,
                composed: true,
                cancelable: true,
            })
        );
    }

    /**
     * Handles selecting an action
     *
     * @param {Event} event
     */
    handleActionSelect(event) {
        const action = event.detail.value;

        this.dispatchEvent(
            new CustomEvent('privatecellheaderactiontriggered', {
                composed: true,
                bubbles: true,
                cancelable: true,
                detail: {
                    action: deepCopy(action._action),
                    actionType: action._type,
                    colKeyValue: this.colKeyValue,
                },
            })
        );
    }

    /************************* HELPER FUNCTIONS **************************/

    /**
     * Updates the actions object
     */
    updateActions() {
        const actionTypeReducer = (type) => (actions, action) => {
            const overrides = { _type: type, _action: action };
            actions.push(Object.assign({}, action, overrides));

            return actions;
        };

        this._internalActions = this.getActionsByType('internalActions').reduce(
            actionTypeReducer('internal'),
            []
        );

        this._customerActions = this.getActionsByType('customerActions').reduce(
            actionTypeReducer('customer'),
            []
        );

        // TODO: W-8389508 Refactor so menu is outside of header
        this._actionMenuAlignment =
            this._actions.menuAlignment &&
            this._actions.menuAlignment.replace('auto-', '');
    }

    /**
     * Returns actions by action type
     *
     * @param {String} type The action type to filter by
     * @return {Array} An array of actions that match the provided type
     */
    getActionsByType(type) {
        return Array.isArray(this._actions[type]) ? this._actions[type] : [];
    }

    get alternativeText() {
        return formatLabel(i18n.showActions, this.columnHeader || '');
    }
}
