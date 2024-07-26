import { api, track } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet } from 'lightning/utils';
import {
    assert,
    normalizeBoolean,
    normalizeString,
    isCSR,
} from 'lightning/utilsPrivate';
import subPage from '@salesforce/label/LightningVerticalNavigation.subPage';

const ALLOWED_CHILDREN = [
    'LIGHTNING-VERTICAL-NAVIGATION-ITEM',
    'LIGHTNING-VERTICAL-NAVIGATION-ITEM-BADGE',
    'LIGHTNING-VERTICAL-NAVIGATION-ITEM-ICON',
];

/**
 * A vertical list of links that either take the user to another page or parts of the page the user is in.
 * @slot default Placeholder for lightning-vertical-navigation-section and lightning-vertical-navigation-overflow.
 */
export default class LightningVerticalNavigation extends LightningShadowBaseClass {
    @track _compact;
    @track _shaded;
    @track _selectedItem;

    /**
     * Specify true to reduce spacing between navigation items. This value defaults to false.
     * @param {Boolean} compact - Specify true to reduce spacing between navigation items.
     */
    set compact(compact) {
        this._compact = normalizeBoolean(compact);
    }

    /**
     * If present, spacing between navigation items is reduced.
     * @type {boolean}
     * @default false
     */
    @api
    get compact() {
        return this._compact || false;
    }

    /**
     * Specify true when the vertical navigation is sitting on top of a shaded background. This value defaults to false.
     * @param {Boolean} shaded - Specify true when the vertical navigation is sitting on top of a shaded background.
     */
    set shaded(shaded) {
        this._shaded = normalizeBoolean(shaded);
    }

    /**
     * If present, the vertical navigation is displayed on top of a shaded background.
     * @type {boolean}
     * @default false
     */
    @api
    get shaded() {
        return this._shaded || false;
    }

    /**
     * Name of the navigation item to make active.
     * @param {String} selectedItem - Name of the navigation item to make active.
     */
    set selectedItem(selectedItem) {
        this.selectNavigationItem(
            normalizeString(selectedItem, { toLowerCase: false })
        );
    }

    /**
     * Name of the navigation item to make active.
     * An active item is highlighted in blue.
     * @type {string}
     */
    @api
    get selectedItem() {
        return this._selectedItem || '';
    }

    get ariaLabel() {
        return this.privateAriaLabel || subPage;
    }

    set ariaLabel(ariaLabel) {
        this.privateAriaLabel = ariaLabel;
    }

    get computedClass() {
        const classes = classSet('slds-nav-vertical');
        if (this.shaded) {
            classes.add('slds-nav-vertical_shade');
        }
        if (this.compact) {
            classes.add('slds-nav-vertical_compact');
        }
        return classes.toString();
    }

    connectedCallback() {
        super.connectedCallback();
        this.addItemEventListeners();
    }

    addItemEventListeners() {
        if (isCSR) {
            this.addEventListener(
                'privateitemregister',
                this.handleItemRegister.bind(this)
            );
            this.addEventListener(
                'privateitemselect',
                this.handleItemSelect.bind(this)
            );
        }
    }

    removeItemEventListeners() {
        if (isCSR) {
            this.removeEventListener(
                'privateitemregister',
                this.handleItemRegister.bind(this)
            );
            this.removeEventListener(
                'privateitemselect',
                this.handleItemSelect.bind(this)
            );
        }
    }

    /**
     * @name verticalNavigationItems
     * @type {Array}
     * @private
     * Array that holds all the child vertical-navigation-item, vertical-navigation-item-badge & vertical-navigation-item-icon items.
     */
    verticalNavigationItems = [];

    handleItemRegister(event) {
        event.stopPropagation(); // suppressing event since its not part of vertical-navigation public API

        const target = event.target,
            callbacks = event.detail.callbacks,
            itemName = event.detail.name,
            isItemSelected = this._selectedItem === itemName;

        assert(
            target.nodeType in ALLOWED_CHILDREN,
            'Attempt was made to register unsupported type.'
        );

        if (target.nodeType in ALLOWED_CHILDREN) {
            const navigationItem = {
                name: itemName,
                callbacks,
            };
            this.verticalNavigationItems.push(navigationItem);
        }

        if (isItemSelected) {
            callbacks.select();
        }
    }

    handleItemSelect(event) {
        event.stopPropagation(); // suppressing event since its not part of vertical-navigation public API
        this.selectNavigationItem(event.detail.name);
    }

    /**
     * Selects the child navigation item with the specified name.
     * @param {String} itemName - label of the selected child navigation item.
     */
    selectNavigationItem(itemName) {
        if (isCSR) {
            // dispatch before events
            const beforeselectevent = new CustomEvent('beforeselect', {
                cancelable: true,
                detail: {
                    name: itemName,
                },
            });
            this.dispatchEvent(beforeselectevent);

            if (!beforeselectevent.defaultPrevented) {
                // select navigation item
                this.verticalNavigationItems.forEach((navigationItem) => {
                    if (navigationItem.name === itemName) {
                        navigationItem.callbacks.select();
                    } else {
                        navigationItem.callbacks.deselect();
                    }
                });
                // update state
                this._selectedItem = itemName;

                // fire after events
                this.dispatchEvent(
                    new CustomEvent('select', {
                        detail: {
                            name: itemName,
                        },
                    })
                );
            }
        }
    }

    disconnectedCallback() {
        this.removeItemEventListeners();
    }
}
