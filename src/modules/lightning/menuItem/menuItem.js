import { api, track } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet } from 'lightning/utils';
import {
    normalizeBoolean,
    normalizeString,
    keyCodes,
} from 'lightning/utilsPrivate';
import { sanitizeURL, FALLBACK_URL } from 'lightning/utilsPrivate';

const selectedClass = 'slds-is-selected';

/**
 * Represents a list item in a menu.
 */
export default class LightningMenuItem extends LightningShadowBaseClass {
    static validationOptOut = ['class'];

    /**
     * A value associated with the menu item.
     * @type {string}
     */
    @api value;

    /**
     * Text of the menu item.
     * @type {string}
     */
    @api label;

    /**
     * The name of an icon to display after the text of the menu item.
     * @type {string}
     */
    @api iconName;

    /**
     * The name of a file that's downloaded when clicking a link in the menu item. Used with the href attribute.
     * @type {string}
     */
    @api download;

    @track _accesskey = null;
    @track _disabled = false;
    @track _tabindex = '-1';
    @track _checked = undefined;
    @track _isDraft = false;
    @track _target = null;

    /**
     * The name of an icon to display before the text of the menu item.
     * @type {string}
     */
    @api prefixIconName;

    /**
     * URL for a link to use for the menu item.
     * @type {string}
     */
    @api href;

    /**
     * Describes the reason for showing the draft indicator.
     * This is required when is-draft is present on the lightning-menu-item tag.
     * @type {string}
     */
    @api draftAlternativeText;

    connectedCallback() {
        super.connectedCallback();
        this.setAttribute('role', 'presentation');
    }

    /**
     * If present, a draft indicator is shown on the menu item.
     * A draft indicator is denoted by blue asterisk on the left of the menu item.
     * When you use a draft indicator, include alternative text for accessibility using draft-alternative-text.
     * @type {boolean}
     * @default false
     */
    @api
    get isDraft() {
        return this._isDraft;
    }

    set isDraft(value) {
        this._isDraft = normalizeBoolean(value);
    }

    /**
     * The keyboard shortcut for the menu item.
     * @type {string}
     */
    @api
    get accessKey() {
        return this._accesskey;
    }

    set accessKey(newValue) {
        this._accesskey = newValue;
        this.handleAccessKeyChange(newValue);
    }

    /**
     * Reserved for internal use. Use tabindex instead to indicate if an element should be focusable.
     * tabindex can be set to 0 or -1.
     * The default tabindex value is 0, which means that the menu item is focusable and
     * participates in sequential keyboard navigation. The value -1 means
     * that the menu item is focusable but does not participate in keyboard navigation.
     * @type {number}
     */
    @api
    get tabIndex() {
        return this._tabindex;
    }

    set tabIndex(newValue) {
        this._tabindex = newValue;
        this.handleTabIndexChange(newValue);
    }

    /**
     * Determines how a link in the href attribute is opened. Valid values include '_self' and '_blank'.
     * The default is '_self', which opens the link in the current browser tab.
     * '_blank' opens the link in a new browser tab.
     * @type {string}
     * @default undefined
     */
    @api
    get target() {
        return this._target;
    }

    set target(newValue) {
        this._target = normalizeString(newValue, {
            fallbackValue: null,
            validValues: ['_self', '_blank'],
        });
    }

    handleAccessKeyChange(value) {
        this._accesskey = value;
    }

    handleTabIndexChange(value) {
        this._tabindex = value;
    }

    get computedAccessKey() {
        return this._accesskey;
    }

    get computedTabIndex() {
        return this._tabindex;
    }

    /**
     * If present, the menu item is disabled and users cannot interact with it.
     * @type {boolean}
     * @default false
     */
    @api
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = normalizeBoolean(value);
    }

    /**
     * If present, a check mark displays on the left of the menu item if it's selected.
     * @type {boolean}
     * @default false
     */
    @api
    get checked() {
        return this._checked;
    }
    set checked(value) {
        if (typeof value === 'string') {
            // handle string
            value = normalizeString(value, {
                fallbackValue: undefined,
                validValues: ['true', 'false'],
            });
            if (value !== undefined) {
                value = value === 'true';
            }
        }
        if (value !== undefined) {
            // handle boolean which is from above or user
            value = normalizeBoolean(value);
        }
        this._checked = value;

        if (this.checked === true) {
            this.classList.add(selectedClass);
        } else {
            this.classList.remove(selectedClass);
        }
    }

    get computedCheckedIconClass() {
        // note that what .slds-icon_selected does is to hide the checked icon
        return classSet(
            'slds-icon slds-icon_x-small slds-icon-text-default slds-m-right_x-small'
        )
            .add({ 'slds-icon_selected': !this.checked })
            .toString();
    }

    get computedHref() {
        return sanitizeURL(this.href);
    }

    get computedAriaChecked() {
        return this.isMenuItemCheckbox ? this.checked + '' : null;
    }

    get computedAriaDisabled() {
        // Note: Needed to explicitly set aria-disabled="true"
        return this.disabled ? 'true' : 'false';
    }

    get isMenuItemCheckbox() {
        return this.checked !== undefined;
    }

    get computedRole() {
        return this.isMenuItemCheckbox ? 'menuitemcheckbox' : 'menuitem';
    }

    handleBlur(event) {
        this.dispatchEvent(new CustomEvent('blur'));

        // we need to trigger a private blur to make it bubble and be handled by parent button-menu
        this.dispatchEvent(
            new CustomEvent('privateblur', {
                composed: true,
                bubbles: true,
                cancelable: true,
                detail: {
                    relatedTarget: event.relatedTarget,
                },
            })
        );
    }

    handleFocus() {
        // trigger a private focus to make it bubble and be handled by parent button-menu
        // this is used for resetting cancelBlur in button-menu
        this.dispatchEvent(
            new CustomEvent('privatefocus', {
                bubbles: true,
                cancelable: true,
            })
        );
    }

    handleClick(event) {
        // no action needed when item is disabled
        if (this.disabled) {
            // do nothing and return
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        // allow HREF to be followed
        if (this.href) {
            if (this.computedHref === FALLBACK_URL) {
                event.preventDefault();
            } else {
                // do nothing and take default action of navigating to the specified
                // href, unless value exists and cancelled.
                if (this.value) {
                    // override href logic
                    const cancelled = !this.dispatchSelect();
                    if (cancelled) {
                        event.preventDefault();
                    }
                }
            }
        } else {
            event.preventDefault();
            this.dispatchSelect();
        }
    }

    handleKeyDown(event) {
        // no action needed when item is disabled
        if (this.disabled) {
            // do nothing (Cant select!) and return
            event.preventDefault();
            // We do not include event.stopPropagation(); here bc we need the event
            // to pass to the menu so arrows, etc still work
            return;
        }

        if (event.keyCode === keyCodes.space) {
            // follow HREF if a value was provided
            if (this.href) {
                // trigger click behavior
                if (this.value) {
                    // override href logic
                    const cancelled = !this.dispatchSelect();
                    if (!cancelled) {
                        this.template.querySelector('a').click();
                    }
                } else {
                    this.template.querySelector('a').click();
                }
            } else {
                // if no HREF is provided follow usual select behavior
                this.dispatchSelect();
            }
        }
    }

    /**
     *
     * The select event is a non-navigational event.
     * The purpose of the event is to toggle the selected state of a menu item.
     * It will not be dispatched if a menu item has an HREF value to navigate to (other than the default).
     * This event will be handled by the parent button-menu component.
     *
     **/
    dispatchSelect() {
        if (!this.disabled) {
            return this.dispatchEvent(
                new CustomEvent('privateselect', {
                    bubbles: true,
                    cancelable: true,
                    detail: {
                        value: this.value,
                    },
                })
            );
        }
        return true;
    }

    /**
     * Sets focus on the anchor element in the menu item.
     */
    @api
    focus() {
        // set the focus on the anchor element
        this.template.querySelector('a').focus();
        // dispatch a focus event for the menu item component
        this.dispatchEvent(new CustomEvent('focus'));
    }

    /**
     * Clicks the anchor.
     */
    @api
    click() {
        const anchor = this.template.querySelector('a');
        if (anchor) {
            anchor.click();
        }
    }
}
