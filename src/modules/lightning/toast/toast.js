import { api, track } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import {
    makeAbsoluteUrl,
    normalizeString,
    isMacOS,
    isiOS,
    isCSR,
} from 'lightning/utilsPrivate';
import {
    instanceName,
    properties,
    requiredProperties,
} from 'lightning/overlayUtils';
import { classSet } from 'lightning/utils';
import { ShowToastEvent } from 'lightning/showToastEvent';
import { LightningResizeObserver } from 'lightning/resizeObserver';
import ToastContainer from 'lightning/toastContainer';

import formFactorPropertyName from '@salesforce/client/formFactor';

import closeButtonTitleText from '@salesforce/label/LightningToast.close';
import iconInfoAltText from '@salesforce/label/LightningToast.infoLabel';
import iconWarningAltText from '@salesforce/label/LightningToast.warningLabel';
import iconSuccessAltText from '@salesforce/label/LightningToast.successLabel';
import iconErrorAltText from '@salesforce/label/LightningToast.errorLabel';
import macNavigationAssistiveText from '@salesforce/label/LightningToast.macNavigationAssistiveText';
import genericNavigationAssistiveText from '@salesforce/label/LightningToast.genericNavigationAssistiveText';

import { getCurrentRegionAttributeName } from 'lightning/f6Controller';

const MODE_DISMISSIBLE = 'dismissible';
const MODE_STICKY = 'sticky';

const VARIANT_INFO = 'info';
const VARIANT_WARNING = 'warning';
const VARIANT_ERROR = 'error';
const VARIANT_SUCCESS = 'success';

export const DEFAULT_TOAST_VARIANT = VARIANT_INFO;
export const DEFAULT_TOAST_MODE = MODE_STICKY;

const DURATION_LINK = 9600;
const DURATION_NO_LINK = 4800;
const MIN_BROWSER_WIDTH = 480;

/**
 * A notification element used to convey a label.
 */
export default class Toast extends LightningShadowBaseClass {
    static [instanceName] = 'lightning-toast';
    static [properties] = [
        'variant',
        'mode',
        'label',
        'labelLinks',
        'message',
        'messageLinks',
    ];
    static [requiredProperties] = ['label'];

    // Normalized variant value.
    _variant = DEFAULT_TOAST_VARIANT;
    // Normalized mode value.
    _mode;

    // ID of timeout to determine whether there is a running timer.
    timeoutId = null;
    // callback function to unregister the current toast from its container
    unregisterCallback = null;

    firstRender = true;
    closing = false;
    hide = false;

    // flag to indicate if toast is currently focused
    _isFocused = false;

    closeButtonTitleText = closeButtonTitleText;

    assistiveText =
        isMacOS || isiOS
            ? macNavigationAssistiveText
            : genericNavigationAssistiveText;

    // pre-processed toast label string
    _label;
    // pre-processed toast message string
    _message;

    // reference of resizeObserver on the host element
    _resizeObserver;

    // flag indicate if the current form factor is small
    _isSmallFormFactor;

    // reference to portrait media query
    _portraitMatchMedia;

    // reference to the handler function for changing screen orientation
    _screenOrientationChangeHandler;

    // boolean indicates if the current browser width is less than MIN_BROWSER_WIDTH
    @track _isSmallerBrowserWidth;

    // an array of { url, label }, which will replace the {0}... {N} placeholders in label string or
    // a map of { name: { url, label } } which will replaced the {name} ... {anotherName} placeholders in label string
    @api labelLinks;

    // an array of { url, label }, which will replace the {0}... {N} placeholders in message string or
    // a map of { name: { url, label } } which will replaced the {name} ... {anotherName} placeholders in message string
    @api messageLinks;

    /**
     * return true if label has link
     */
    get hasLabelLink() {
        return this.hasLinkData(this.labelLinks);
    }

    /**
     * return true if message has link
     */
    get hasMessageLink() {
        return this.hasLinkData(this.messageLinks);
    }

    /**
     * label of the toast
     * @type {string} return the string of toast label which can contain anchor tags
     * @required
     */
    @api get label() {
        return this.buildLinks(this._label, this.labelLinks) || '';
    }

    set label(value) {
        this._label = value;
    }

    /**
     * message of the toast
     * @type {string} return the string of toast message which can contain anchor tags
     * @required
     */
    @api get message() {
        return this.buildLinks(this._message, this.messageLinks) || '';
    }

    set message(value) {
        this._message = value;
    }

    /**
     * The variant of the toast element.
     * This value is optional and is used to determine the icon, background color, and text color of the toast element.
     * Options: 'info', 'warning', 'success', 'error'
     * @type {string}
     * @default 'info'
     */
    @api
    get variant() {
        return this._variant;
    }

    set variant(value) {
        this._variant = this.normalizeVariant(value);
    }

    /**
     * The mode of the toast.
     * This value is optional and is used to determine whether the toast can be closed by the
     * user via a close button and whether the toast disappears after a set time period.
     * Options: 'dismissible', 'sticky'
     * @type {string}
     * @default 'sticky' - see calculateDefaultMode()
     */
    @api
    get mode() {
        return this._mode;
    }

    set mode(value) {
        this._mode = this.normalizeMode(value);
    }

    /**
     * Return the icon name.
     * The icon is based on the variant of the toast.
     * @returns {string} - The icon name.
     */
    get iconName() {
        return `utility:${this._variant}`;
    }

    /**
     * Class of the toast to include the CSS class for variant and class for closing animation.
     * @returns {string} - CSS classes of the toast as a string
     */
    get toastClass() {
        return classSet(
            `slds-notify slds-notify_toast fix-notify_toast_animation slds-theme_${this._variant}`
        )
            .add({
                closing: this.closing,
                'slds-hide': this.hide,
                'fix-slds-notify--mobile': this.isSmallerBrowserWidth,
            })
            .toString();
    }

    get toastElement() {
        return this.template.querySelector('.slds-notify_toast');
    }

    /**
     * Return true if toast currently displayed in a mobile environment or a smaller screen width
     * @returns {boolean}
     */
    get isSmallerBrowserWidth() {
        return this._isSmallFormFactor || this._isSmallerBrowserWidth;
    }

    /**
     * Return the value of the close icon size
     * @returns {string} - 'medium' if toast shown in a small form factor or smaller screen, otherwise, 'large'
     */
    get closeIconSize() {
        return this.isSmallerBrowserWidth ? 'medium' : 'large';
    }

    /**
     * CSS classes for the close button container
     * @return {string}
     */
    get closeIconContainerClass() {
        // the style of lightning-button-icon with 'bare' variant is different on mobile devices VS desktop.
        // In desktop, the component is designed to have its width and height to be determined by its icon size
        // In mobile devices, the component is designed to its width and height to be larger than its icon size to
        // accomodate tapping with finger instead of the more precise mouse cursor.
        // Due to the lightning-button-icon size differences between desktop and mobile devices, the final position of the close button is different.
        // We need to shift the position of the close button back to the right place by adding `fix-slds-notify--mobile__close` class when it is
        // shown in a mobile device.
        return classSet('slds-notify__close').add({
            'fix-slds-notify--mobile__close': this._isSmallFormFactor,
        });
    }

    /**
     * Alternative text for the toast icon.
     * @returns {string} - Alternative text of icon.
     */
    get iconAlternativeText() {
        if (this._variant === VARIANT_WARNING) {
            return iconWarningAltText;
        } else if (this._variant === VARIANT_SUCCESS) {
            return iconSuccessAltText;
        } else if (this._variant === VARIANT_ERROR) {
            return iconErrorAltText;
        }
        return iconInfoAltText;
    }

    /**
     * Set focus on the element with content css class selector
     */
    @api focus() {
        this._isFocused = true;
        this.template.querySelector('[data-content]').focus();
    }

    /**
     * Normalize the variant to a valid value.
     * @param {string} variant - The user-inputted variant value.
     * @returns {string} - The normalized variant that is the default variant ('info') if the user-inputted variant is invalid or the valid user-inputted variant if it is valid.
     */
    normalizeVariant(variant) {
        return normalizeString(variant, {
            fallbackValue: DEFAULT_TOAST_VARIANT,
            validValues: [
                VARIANT_INFO,
                VARIANT_SUCCESS,
                VARIANT_WARNING,
                VARIANT_ERROR,
            ],
        });
    }

    /**
     * Normalize the mode to a valid value.
     * @param {string} mode - The user-inputted mode value.
     * @returns {string} - The normalized mode that is the default mode ('dismissible') if the user-inputted mode is invalid or the valid user-inputted mode if it is valid.
     */
    normalizeMode(mode) {
        return normalizeString(mode, {
            validValues: [MODE_DISMISSIBLE, MODE_STICKY],
        });
    }

    /**
     * Default mode is highly dependant on the variant and if there is link in label/message
     * variant = success, no link => dismissible after 3-5 seconds
     * variant = informational (no link) => mode = sticky
     * variant = warning toast (no link) => mode = sticky
     * variant = error (no link) => mode = sticky
     * any variant with link(s) => mode = sticky
     */
    calculateDefaultMode(hasLink) {
        return this._variant === VARIANT_SUCCESS && !hasLink
            ? MODE_DISMISSIBLE
            : MODE_STICKY;
    }

    /**
     * insert anchor tags to the (label/message) template
     * @param {string} template string template may contain placeholders
     * @param {object|array} links - can be:
     *  1- {url, label}] for general use case to replace the indexed placeholders in the form of {0} ... {N} in template OR
     *  2- map { 'name': {url, label} } to replace the named placeholders in the form {name} ... {anyName} in template
     * @returns {string} a string of label or message with possible anchor tags
     */
    buildLinks(template, links) {
        if (!template || !links || typeof links !== 'object') {
            return template;
        }
        // an index-based placeholder
        // i.e. "links" will be in the form of [ {url, label} ]
        if (Array.isArray(links)) {
            return template.replace(/\{(\d+)\}/gm, (match, index) => {
                return this.createAnchorTagString(match, links[index]);
            });
        }
        // a name-based placeholder
        // i.e. "links" will be in the form of { name: {url, label} }
        return template.replace(/\{(\w+)\}/gm, (match) => {
            const key = match.substring(1, match.length - 1);
            return this.createAnchorTagString(match, links[key]);
        });
    }

    createAnchorTagString(match, link) {
        if (!link) {
            return match;
        }
        const { url, label } = link;
        return `<a href='${makeAbsoluteUrl(
            url
        )}' target='_blank' title='${label}'>${label}</a>`;
    }

    /**
     * Returns true if there is an element inside of the linkData
     * @param {array|object} linkData an array or an object which contains URLs and their labels
     * @returns {boolean}
     */
    hasLinkData(linkData) {
        return (
            linkData &&
            !!(
                (Array.isArray(linkData) && linkData.length) ||
                (typeof linkData === 'object' &&
                    Object.entries(linkData).length)
            )
        );
    }

    /**
     * Return true if a link exists in both label or message slots - for the case toast is used in markup
     * or there is link defined in the labelLinks or in messageLinks - for the case toast is created dynamically
     */
    hasLink() {
        // Query select all slots (only 2: label and message).
        const slots = Array.from(this.template.querySelectorAll('slot'));
        // slots.some returns true if there is a link in any of the slots.
        return (
            slots.some((slot) => {
                // Get all the elements inside the given slot.
                const elements = slot.assignedElements();

                // elements.some returns true if there is a link in any of the elements inside the given slot.
                return elements.some((element) => {
                    return (
                        element.tagName === 'A' ||
                        element.querySelector('a') !== null
                    );
                });
            }) ||
            !!this.hasLabelLink ||
            !!this.hasMessageLink
        );
    }

    /**
     * Close click handler calls the hide() function to trigger fade out animation.
     * */
    handleCloseClick() {
        this.close();
    }

    close() {
        // Trigger fade out animation (hide after animation is done).
        this.closing = true;
    }

    /**
     * At animation end, set hide = true to hide the toast and dispatch close
     * event to signal for removal of the toast element from the DOM.
     * */
    handleAnimationEnd() {
        if (this.closing) {
            this.closing = false;
            this.hide = true;
            // eslint-disable-next-line lightning-global/no-custom-event-bubbling
            const event = new CustomEvent('close', {
                bubbles: true,
                detail: {
                    isFocused: this._isFocused,
                },
            });
            this.dispatchEvent(event);
        }
    }

    /**
     * Handle focus in event, mark current toast is in focus.
     */
    handleFocusIn() {
        this._isFocused = true;
    }
    /**
     * Handle focus out event, mark current toast is no longer in focus.
     */
    handleFocusOut() {
        this._isFocused = false;
    }

    /**
     * Register the toast with its container including callback to unregister the toast
     */
    registerWithContainer() {
        const event = new CustomEvent('privatetoastregister', {
            bubbles: true,
            cancelable: true,
            detail: {
                unregisterCallback: (unregisterCallback) => {
                    this.unregisterCallback = unregisterCallback;
                },
            },
        });
        this.dispatchEvent(event);
    }

    /**
     * make sure to call the function to register the toast with its container if defined,
     * as well as reset the running time if there is one, to avoid the timeout,
     * reaching 0 and creating actions on the unrendered toast element.
     */
    reset() {
        if (this.unregisterCallback) {
            this.unregisterCallback();
        }
        this._isFocused = false;
        // If timeoutId is not null, there is an active timer.
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
            this._resizeObserver = null;
        }
        if (this._portraitMatchMedia) {
            this._portraitMatchMedia.removeEventListener(
                'change',
                this._screenOrientationChangeHandler
            );
        }
        if (this._screenOrientationChangeHandler) {
            this._screenOrientationChangeHandler = null;
        }
    }

    /**
     * setup resize observer of the toast's host watching for screen screen
     */
    setupResizeObserver() {
        if (this._resizeObserver) {
            return;
        }

        const resizeObserver = new LightningResizeObserver(() => {
            if (this.isConnected) {
                this.determineSmallerScreen();
            }
        });
        resizeObserver.observe(this.template.host);
        this._resizeObserver = resizeObserver;
    }

    /**
     * add listener to handle the screen orientation change
     */
    addOrientationChangeListener() {
        this._portraitMatchMedia = window.matchMedia('(orientation: portrait)');
        this._screenOrientationChangeHandler =
            this.determineSmallerScreen.bind(this);
        this._portraitMatchMedia.addEventListener(
            'change',
            this._screenOrientationChangeHandler
        );
    }

    /**
     * determine if the current screen is less than MIN_BROWSER_WIDTH
     */
    determineSmallerScreen() {
        const browserWidth =
            (document &&
                document.documentElement &&
                document.documentElement.clientWidth) ||
            window.innerWidth;
        const isSmallerBrowserWidth = browserWidth <= MIN_BROWSER_WIDTH;
        if (isSmallerBrowserWidth !== this._isSmallerBrowserWidth) {
            this._isSmallerBrowserWidth = isSmallerBrowserWidth;
        }
    }

    /**
     * determine if it is small form factor
     */
    determineSmallFormFactor() {
        if (formFactorPropertyName === 'Small') {
            this._isSmallFormFactor = true;
        }
    }

    connectedCallback() {
        super.connectedCallback();
        this.registerWithContainer();
        this.determineSmallerScreen();
        this.determineSmallFormFactor();
        this.setupResizeObserver();
        this.addOrientationChangeListener();
    }

    renderedCallback() {
        // Track firstRender because only want to check for links and start the timeout timer on the first render.
        if (this.firstRender) {
            this.firstRender = false;
            // check if there is link in label or message
            const hasLink = this.hasLink();

            // Timeout duration is set to 9600ms if there is a link and 4800ms otherwise.
            const duration = hasLink ? DURATION_LINK : DURATION_NO_LINK;

            // if mode is not provided, the default mode will be determined according to the variant and the presence of links
            if (!this._mode) {
                this._mode = this.calculateDefaultMode(hasLink);
            }

            // If the mode is dismissible (i.e. not sticky), then the toast will disappear after the duration. Start the timer here.
            if (this._mode !== MODE_STICKY) {
                // eslint-disable-next-line @lwc/lwc/no-async-operation
                this.timeoutId = setTimeout(() => {
                    this.close();
                    this.timeoutId = null;
                }, duration);
            }
            // add the data-f6-region attribute to the toast div
            const regionAttributeName = getCurrentRegionAttributeName();
            if (regionAttributeName) {
                this.toastElement.setAttribute(regionAttributeName, '');
            }
        }
    }

    disconnectedCallback() {
        this.reset();
    }

    /**
     * Function to trigger a toast show
     * @param {object} config a map of toast attributes -> value to be set.
     * Expected shape of config:
     *  {
     *      label: <string template> - required
     *      labelLinks: [{ url, label }] or { name: { url, label } }
     *      message: <string template>
     *      messageLinks: [{ url, label }] or { name: { url, label } }
     *      variant: <info|success|warning|error>
     *      mode: <dismissible|sticky>
     *      on<eventname>: <handler function>
     *  }
     * @param {HTMLElement} source - source element which trigger the toast showing, typically this from local component
     */
    static show(config, source) {
        if (isCSR) {
            // make sure the page-level container is created
            ToastContainer.instance();
            // create and dispatch the ShowToastEvent
            const event = new ShowToastEvent({
                ...config,
                toast: this,
                source,
            });

            if (source) {
                source.dispatchEvent(event);
            } else {
                document.body.dispatchEvent(event);
            }
        }
    }
}
