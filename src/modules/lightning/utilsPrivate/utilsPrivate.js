import formFactor from '@salesforce/client/formFactor';
import { isCSR } from './ssr';

export { assert } from './assert';
export {
    ARIA,
    ARIA_TO_CAMEL,
    isAriaDescriptionSupported,
    updateAriaInvalidOnElement,
    computeAriaInvalid,
} from './aria';
export { EventEmitter } from './eventEmitter';
export { toNorthAmericanPhoneNumber } from './phonify';
export * from './linkUtils';
export {
    isAbsoluteUrl,
    makeAbsoluteUrl,
    sanitizeURL,
    FALLBACK_URL,
} from './url';
export { deepCopy, arraysEqual, ArraySlice } from './utility';
export { guid } from './guid';
export { classListMutation } from './classListMutation';
export { classSetToString } from './classSet';
export { makeEverythingExceptElementInert, restoreInertness } from './inert';
export { hasAnimation } from './animation';
export {
    normalizeBoolean,
    normalizeNumber,
    normalizeString,
    normalizeArray,
    normalizeAriaAttribute,
} from './normalize';
export {
    keyCodes,
    runActionOnBufferedTypedCharacters,
    normalizeKeyValue,
    isShiftMetaOrControlKey,
} from './keyboard';
export { raf } from './scroll';
export { isChrome, isIE11, isSafari } from './browser';
export { observePosition } from './observers';
export { hasOnlyAllowedVideoIframes } from './videoUtils';
export {
    parseToFormattedLinkifiedParts,
    parseToFormattedParts,
} from './linkify';
export { isValidPageReference } from './pageReference';
export { isMacOS, isWindowsOS, isiOS, isAndroidOS } from './os';
export {
    VALID_HEADING_LEVELS,
    isHeadingLevelValid,
} from './ariaLevelHeadingUtils.js';
export {
    toDateTimeFormatOptions,
    toFormattedDate,
    toFormattedLocation,
    toFormattedNumber,
} from './formatUtils';
export { isTextIgnoreRTL } from './textUtils';
export {
    isValidDate,
    isValidLatitude,
    isValidLongitude,
    isValidPhone,
} from './validationUtils';
export { isCSR };

const LIGHTNING_TAG_REGEXP = /^LIGHTNING/i;
const LIGHTNING_DASH_NAME_REGEXP = /-\w/g;

function dashWordCharReplacement(dashWordCharMatch) {
    return dashWordCharMatch[1].toUpperCase();
}

function synchronizeHTMLElementAttrs(element, attrs) {
    const attrNames = Object.keys(attrs);
    for (let i = 0, { length } = attrNames; i < length; i += 1) {
        const attrName = attrNames[i];
        const attrValue = attrs[attrName];
        if (attrValue) {
            element.setAttribute(attrName, attrValue);
        } else {
            element.removeAttribute(attrName);
        }
    }
}

function synchronizeLightningElementAttrs(element, attrs) {
    const attrNames = Object.keys(attrs);
    for (let i = 0, { length } = attrNames; i < length; i += 1) {
        const attrName = attrNames[i];
        const attrValue = attrs[attrName];
        const normalizedName = attrName.replace(
            LIGHTNING_DASH_NAME_REGEXP,
            dashWordCharReplacement
        );
        element[normalizedName] = attrValue || null;
    }
}

/**
 * @param {HTMLElement} element Element to act on
 * @param {Object} values values and attributes to set, if the value is
 *                        falsy it the attribute will be removed
 */
export function synchronizeAttrs(element, attrs) {
    if (element) {
        if (LIGHTNING_TAG_REGEXP.test(element.tagName)) {
            synchronizeLightningElementAttrs(element, attrs);
        } else {
            synchronizeHTMLElementAttrs(element, attrs);
        }
    }
}

/**
 * Update the element's attribute with given value.
 * If value is false, the attribute is removed from the element.
 *
 * @param {Object} element - Element
 * @param {string} attrName - Attribute name
 * @param {string|boolean} value - Attribute value
 */
export function reflectAttribute(element, attrName, value) {
    if (!element) {
        return;
    }

    if (typeof value === 'string') {
        element.setAttribute(attrName, value);
    } else if (value === true) {
        element.setAttribute(attrName, '');
    } else if (!value) {
        element.removeAttribute(attrName);
    } else {
        console.warn(`Invalid attribute value for "${attrName}": ${value}`);
    }
}

/**
 * Get the actual DOM id for an element
 * @param {HTMLElement|String} el The element to get the id for (string will just be returned)
 *
 * @returns {String} The DOM id or null
 */
export function getRealDOMId(el) {
    if (typeof el === 'string') {
        return el.length > 0 ? el : null;
    }
    return typeof el === 'object' && el !== null ? el.getAttribute('id') : null;
}

/**
 * Returns the active element traversing shadow roots
 * @returns {Element} Active Element inside shadow
 */
export function getShadowActiveElement() {
    let activeElement = document.activeElement;
    while (activeElement.shadowRoot && activeElement.shadowRoot.activeElement) {
        activeElement = activeElement.shadowRoot.activeElement;
    }
    return activeElement;
}

/**
 * Returns the active elements at each shadow root level
 * @returns {Array} Active Elements  at each shadow root level
 */
export function getShadowActiveElements() {
    let activeElement = document.activeElement;
    const shadowActiveElements = [];
    while (
        activeElement &&
        activeElement.shadowRoot &&
        activeElement.shadowRoot.activeElement
    ) {
        shadowActiveElements.push(activeElement);
        activeElement = activeElement.shadowRoot.activeElement;
    }
    if (activeElement) {
        shadowActiveElements.push(activeElement);
    }
    return shadowActiveElements;
}

export function isRTL() {
    // document does not exist on server and MRT does not support RTL below the root component (https://gus.lightning.force.com/lightning/r/ADM_Epic__c/a3QEE000000KEOb2AO/view)
    return isCSR && document.dir === 'rtl';
}

export function isUndefinedOrNull(value) {
    return value === null || value === undefined;
}

export function isNotUndefinedOrNull(value) {
    return !isUndefinedOrNull(value);
}

const DEFAULT_MODAL_ZINDEX = 9000;
const DEFAULT_ZINDEX_OFFSET = 100;
const DEFAULT_ZINDEX_BASELINE = DEFAULT_MODAL_ZINDEX + DEFAULT_ZINDEX_OFFSET;
/**
 * Returns the zIndex baseline from slds zIndex variable --lwc-zIndexModal.
 * @returns {Number} zIndex baseline
 */
export function getZIndexBaseline() {
    // When SLDS styles are present, typically on Core
    // this currently resolves to: '9000' (string)
    // If function is called in server context, use default as window and document are not available.
    const modalZindexValueLwc = isCSR
        ? (
              window.getComputedStyle(document.documentElement) ||
              document.documentElement.style
          ).getPropertyValue('--lwc-zIndexModal')
        : DEFAULT_MODAL_ZINDEX;

    const baseZindexModalLwc = parseInt(modalZindexValueLwc, 10);

    return isNaN(baseZindexModalLwc)
        ? DEFAULT_ZINDEX_BASELINE
        : baseZindexModalLwc + DEFAULT_ZINDEX_OFFSET;
}

export function timeout(interval) {
    return new Promise((resolve) => {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(resolve, interval);
    });
}

export function animationFrame() {
    return new Promise((resolve) => {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        window.requestAnimationFrame(resolve);
    });
}

/**
 *
 * Decorates an input element to fire an "input"
 * event when the value is directly set.
 *
 * @param {HTMLElement} element The element to decorate.
 *
 */
export function decorateInputForDragon(element) {
    const valuePropertyDescriptor = getInputValuePropertyDescriptor(element);

    Object.defineProperty(element, 'value', {
        set(value) {
            valuePropertyDescriptor.set.call(this, value);
            this.dispatchEvent(new CustomEvent('input'));
        },
        get: valuePropertyDescriptor.get,
        enumerable: true,
        configurable: true,
    });
}

function getInputValuePropertyDescriptor(element) {
    return Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(element),
        'value'
    );
}

export function setDecoratedDragonInputValueWithoutEvent(element, value) {
    const valuePropertyDescriptor = getInputValuePropertyDescriptor(element);
    return valuePropertyDescriptor.set.call(element, value);
}

/**
 * Escape HTML string
 * @param {String} html An html string
 * @returns {String} The escaped html string
 */
export function escapeHTML(html) {
    return html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export const BUTTON_GROUP_ORDER = {
    FIRST: 'first',
    MIDDLE: 'middle',
    LAST: 'last',
    ONLY: 'only',
};

/**
 * returns the SLDS class for the given group order
 * @param groupOrder
 * @returns {string}
 */
export function buttonGroupOrderClass(groupOrder) {
    return {
        [BUTTON_GROUP_ORDER.FIRST]: 'slds-button_first',
        [BUTTON_GROUP_ORDER.MIDDLE]: 'slds-button_middle',
        [BUTTON_GROUP_ORDER.LAST]: 'slds-button_last',
        [BUTTON_GROUP_ORDER.ONLY]: 'single-button',
    }[groupOrder];
}

/**
 * Checks if the given lightning component is native
 * @param {Object} cmp LightningElement instance
 * @returns {Boolean} Whether the lightning component is native
 */
export function isNativeComponent(cmp) {
    return cmp?.template && !cmp.template.synthetic;
}

/**
 * Determine if event is of type FocusEvent (blur or focus). This is required
 * in some cases to prevent these events from bubbling to ensure parity between synthetic
 * and native shadow.
 *
 * 'focus' and 'blur' events that have been propagated manually via CustomEvents are not considered
 * FocusEvents.
 *
 * Corresponding LWC issue: https://github.com/salesforce/lwc/issues/1244
 * Corresponding LBC bug: @W-13236327
 *
 */
export function isBubblingFocusEvent(event) {
    const focusEvents = ['focus', 'blur'];
    return event instanceof FocusEvent && focusEvents.includes(event.type);
}

/**
 * Checks if a desktop browser is being used in the enviroment
 * @returns {Boolean} is a desktop browser being used
 */
export function isDesktopBrowser() {
    return formFactor === 'Large';
}

const { hasOwn: ObjectHasOwn } = Object;
const { hasOwnProperty: ObjectProtoHasOwnProperty } = Object.prototype;

/**
 * Determines if a given object has the specified key as a direct property.
 *
 * @param {Object} object The object to check
 * @param {string} key The property key
 * @returns {Boolean} Whether the given key is a direct property of the object.
 */
export const hasOwn =
    typeof ObjectHasOwn === 'function'
        ? ObjectHasOwn
        : function hasOwn(object, key) {
              return ObjectProtoHasOwnProperty.call(object, key);
          };

/**
 * Determines if a given object has any direct properties.
 *
 * @param {Object} object The object to check
 * @returns {Boolean} Whether the object has direct properties.
 */
export function hasOwnProperties(object) {
    for (let key in object) {
        if (hasOwn(object, key)) {
            return true;
        }
    }
    return false;
}

// observable that observers can subscribe and get notified when it changes
export { default as Observable } from './observable';
