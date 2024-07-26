import labelPillError from '@salesforce/label/LightningPill.error';
import labelPillRemove from '@salesforce/label/LightningPill.remove';
import labelPillWarning from '@salesforce/label/LightningPill.warning';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { api, track } from 'lwc';
import {
    classListMutation,
    normalizeBoolean,
    makeAbsoluteUrl,
    reflectAttribute,
} from 'lightning/utilsPrivate';
import link from './link.html';
import plain from './plain.html';
import plainLink from './plainLink.html';
import { updateRawLinkInfo } from 'lightning/routingService';
import { formatLabel } from 'lightning/utils';
import { relatedTarget as buttonRelatedTarget } from 'lightning/buttonIcon';

const i18n = {
    pillError: labelPillError,
    pillRemove: labelPillRemove,
    pillWarning: labelPillWarning,
};

const VARIANT = {
    PLAIN: 'plain',
    PLAIN_LINK: 'plainLink',
    LINK: 'link',
};

export const relatedTarget = Symbol('relatedTarget');

function modifyAttribute(el, name, value) {
    if (!el.isPlainLink) {
        if (value !== null && value !== undefined && value !== '') {
            el.setAttribute(name, value);
        } else {
            el.removeAttribute(name);
        }
    } else {
        el.removeAttribute(name);
    }
}
/**
 * A pill displays a label that can contain links and can be removed from view.
 * @slot default Placeholder for an image, such as an icon or avatar.
 */
export default class LightningPill extends LightningShadowBaseClass {
    /**
     * The URL of the page that the link goes to.
     * @type {string}
     */
    @api
    get href() {
        return this._href;
    }
    set href(value) {
        this._href = value;
        if (this._connected && (this.isPlainLink || this.isLink)) {
            this.updateLinkInfo(value);
        }
    }
    @track _href;

    /**
     * The text label that displays in the pill.
     * @type {string}
     * @required
     */
    @api label;

    /**
     * The name for the pill. This value is optional and can be used to identify the pill in a callback.
     * @type {string}
     */
    @api name;

    @track _role;
    @track _ariaSelected;
    @track _hasMedia = true;
    @track _hasError;
    @track _tabIndex;
    @track _standardContainer;
    @track _variant;

    /**
     * The variant changes the appearance of the pill.
     * Accepted variants include link, plain, and plainLink.
     * The default variant is link, which creates a link in the pill when you specify the href attribute.
     * The plain variant renders the pill without a link and ignores the href attribute.
     * The plainLink variant is reserved for internal use.
     * @type {string}
     * @default link
     */
    //@api variant = VARIANT.LINK;
    @api
    get variant() {
        return this._variant || VARIANT.LINK;
    }

    set variant(value) {
        // work around for verification of accepted variants as normalizeString method does not
        // account for camel case attribute values.
        let acceptedValues = [VARIANT.LINK, VARIANT.PLAIN, VARIANT.PLAIN_LINK];
        if (acceptedValues.indexOf(value) !== -1) {
            this._variant = value;
        } else {
            this._variant = VARIANT.LINK;
        }
        reflectAttribute(this, 'variant', this._variant);
    }

    _connected = false;
    _dispatcher = () => {};

    render() {
        if (this.isPlainLink) {
            return plainLink;
        } else if (this.isPlain) {
            return plain;
        }
        return link;
    }

    /**
     * If present, the pill is shown with a red border and an error icon on the left of the label.
     * @type {boolean}
     * @default false
     */
    @api
    get hasError() {
        return this._hasError || false;
    }
    set hasError(value) {
        this._hasError = normalizeBoolean(value);
    }

    checkMediaElement() {
        if (!this._mediaElement) {
            this._mediaElement = this.template.querySelector('slot');
        }
        return (
            this._mediaElement && this._mediaElement.assignedNodes().length > 0
        );
    }
    renderedCallback() {
        // Avoid a timing issue due to LWC v6's native custom element lifecycle:
        // https://github.com/salesforce/lwc/releases/v6.0.0#new-timing
        // This check for slotted content needs to occur after the connectedCallbacks for the slotted
        // components have already executed.
        Promise.resolve().then(() => {
            // check if a component was passed into the slot
            this._hasMedia = this.checkMediaElement();
            const wrapper = this.template.querySelector('span');

            classListMutation(wrapper.classList, {
                'slds-pill': true,
                'slds-pill_link': this.isPlainLink || this.isLink,
                'slds-has-error': this.hasError,
            });

            // set attributes to self if variant is plain or link
            modifyAttribute(this, 'tabindex', this.tabIndex);
            modifyAttribute(this, 'role', this.role);
            modifyAttribute(this, 'aria-selected', this.ariaSelected);
        });
    }

    /**
     * Reserved for internal use. Specifies whether the element variant is a plain link.
     * @type {boolean}
     * @return {boolean} true if variant is a plain link.
     */
    @api
    get isPlainLink() {
        return this.variant === VARIANT.PLAIN_LINK;
    }

    get isPlain() {
        return this.variant === VARIANT.PLAIN || !this.href;
    }

    get isLink() {
        return this.variant === VARIANT.LINK && !!this.href;
    }

    /**
     * Reserved for internal use. Use tabindex instead to indicate if an element should be focusable.
     * A value of 0 means that the pill is focusable and
     * participates in sequential keyboard navigation. A value of -1 means
     * that the pill is focusable but does not participate in keyboard navigation.
     * @type {number}
     */
    @api
    get tabIndex() {
        return this._tabIndex;
    }
    set tabIndex(value) {
        this._tabIndex = value;
        modifyAttribute(this, 'tabindex', this._tabIndex);
    }

    /**
     * Reserved for internal use.
     * Specifies the aria-selected of an element.
     */
    @api
    get ariaSelected() {
        return this._ariaSelected;
    }
    set ariaSelected(value) {
        this._ariaSelected = normalizeBoolean(value);
        modifyAttribute(this, 'aria-selected', this._ariaSelected);
    }

    /**
     * Reserved for internal use.
     * Specifies the role of an element.
     */
    @api
    get role() {
        return this._role;
    }
    set role(value) {
        this._role = value;
        modifyAttribute(this, 'role', this._role);
    }

    get i18n() {
        return i18n;
    }

    get hasHref() {
        return !!this.href;
    }

    get labelElement() {
        if (!this._labelElement) {
            this._labelElement =
                this.template.querySelector('.slds-pill__label');
        }
        return this._labelElement;
    }

    get anchorElement() {
        if (!this._anchorElement) {
            this._anchorElement = this.template.querySelector('a');
        }
        return this._anchorElement;
    }

    get removeButtonElement() {
        if (!this._removeButtonElement) {
            this._removeButtonElement = this.template.querySelector(
                'lightning-button-icon'
            );
        }
        return this._removeButtonElement;
    }

    get computedPillRemoveLabel() {
        return formatLabel(this.i18n.pillRemove, this.label);
    }

    connectedCallback() {
        super.connectedCallback();
        this._connected = true;
        if (this.isPlainLink || this.isLink) {
            this.updateLinkInfo(this.href);
        }
    }

    disconnectedCallback() {
        this._connected = false;
    }

    handleClick(event) {
        if (event.target === this.removeButtonElement) {
            // click on the X button to remove the item
            this.handleRemoveClick(event);
        } else if (this.isPlainLink || this.isLink) {
            this._dispatcher(event);
        }
    }

    handleRemoveClick(event) {
        event.preventDefault();
        this.handleRemove(event);
    }

    handleRemove(event) {
        const removeEvent = new CustomEvent('remove', {
            cancelable: true,
            detail: {
                name: this.name,
            },
        });

        this.dispatchEvent(removeEvent);

        if (removeEvent.defaultPrevented) {
            event.stopPropagation();
        }
    }

    /**
     * Reserved for internal use.
     * Sets focus on the anchor element for a plainLink pill.
     */
    @api
    focusLink() {
        const el = this.anchorElement;
        if (el) {
            el.focus();
        }
    }

    /**
     * Reserved for internal use.
     * Sets focus on the remove button element for a plain pill.
     */
    @api
    focusRemove() {
        const el = this.removeButtonElement;
        if (el) {
            el.focus();
        }
    }

    updateLinkInfo(url) {
        updateRawLinkInfo(this, { url: makeAbsoluteUrl(url) }).then(
            (linkInfo) => {
                this._url = linkInfo.url;
                this._dispatcher = linkInfo.dispatcher;
            }
        );
    }

    dispatchBlurEvent(pillRelatedTarget) {
        this._hasFocus = false;
        this.dispatchEvent(
            new CustomEvent('blur', {
                detail: {
                    [relatedTarget]: pillRelatedTarget,
                },
            })
        );
    }

    handleFocus(event) {
        event.stopPropagation();
        if (!this._hasFocus) {
            this._hasFocus = true;
            this.dispatchEvent(new CustomEvent('focus'));
        }
    }

    /**
     * event.relatedTarget is the element which will receive focus next, this information
     * is used by <lightning-pill-container> in its "onblur" event handler.
     */
    handleBlur(event) {
        event.stopPropagation();
        const pillRelatedTarget =
            event.relatedTarget || event.detail?.[buttonRelatedTarget];
        if (!pillRelatedTarget || !this.template.contains(pillRelatedTarget))
            this.dispatchBlurEvent(pillRelatedTarget);
    }
}
