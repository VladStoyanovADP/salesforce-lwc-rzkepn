import { classSetToString } from 'lightning/utilsPrivate';

const CLASS_SET_PROTOTYPE = {
    add(className) {
        if (typeof className === 'string') {
            this[className] = true;
        } else {
            Object.assign(this, className);
        }
        return this;
    },
    invert() {
        const keys = Object.keys(this);
        for (let i = 0, { length } = keys; i < length; i += 1) {
            const key = keys[i];
            this[key] = !this[key];
        }
        return this;
    },
    toString() {
        return classSetToString(this);
    },
};

const NON_NEGATIVE_INTEGER_REGEXP = /^\d+$/;
const POSITIVE_INTEGER_REGEXP = /^[0-9]*[1-9][0-9]*$/;
const RENDER_MODE_INLINE_REGEXP = /\binline\b/;
const RENDER_MODE_ROLE_BASED_REGEXP = /\brole-based\b/;

/**
 * Escapes double quotes. Later can be
 * extended in future for any other use case.
 */
export function escapeDoubleQuotes(value) {
    if (typeof value == 'string') {
        return value.replace(/"/g, '\\"');
    }
    return value;
}

/**
 * Determines if a given value is object-like.
 *
 * @param {*} value Any value to check for object-like status
 * @returns {Boolean} Whether the value is object-like
 */
export const isObjectLike = function (value) {
    return typeof value === 'object' && value !== null;
};

/**
 * Creates an object of CSS class names based on a given config.
 * Then, attaches an interface for managing the classes.
 *
 * @param {String | Object} config The initial class configuration
 * @returns An interface, as defined in the `proto` method.
 */
export function classSet(config) {
    return typeof config === 'string'
        ? { __proto__: CLASS_SET_PROTOTYPE, [config]: true }
        : Object.assign({ __proto__: CLASS_SET_PROTOTYPE }, config);
}

/**
 * Clamps a value between a minimum and maximum value
 *
 * @param {Number} num The input number
 * @param {Number} min The minimum value the number can be
 * @param {Number} max The maximum value the number can be
 * @returns The clamped number
 */
export function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}

export function getColDataSelector(colKeyValue) {
    return `[data-col-key-value="${escapeDoubleQuotes(colKeyValue)}"]`;
}

export function getRowDataSelector(rowKeyValue) {
    return `[data-row-key-value="${escapeDoubleQuotes(rowKeyValue)}"]`;
}

/**
 * Gets the grid container element from the scrollerY element.
 *
 * @param {Node} scrollerY The scrollerY element
 * @returns {Node} The grid container element
 */
export function getGridContainerFromScrollerY(scrollerY) {
    if (!scrollerY) {
        return null;
    }
    const { firstElementChild: gridContainer } = scrollerY;
    return gridContainer;
}

/**
 * Gets the scrollerX element from the template.
 *
 * @param {Node} template The datatable template
 * @param {Object} refs The datatable refs
 * @returns {Node} The scrollerX element
 */
export function getScrollerX(template, refs) {
    return (
        (refs && refs.scrollerX) || template.querySelector('.slds-scrollable_x')
    );
}

/**
 * Gets the scrollerY element from the template.
 *
 * @param {Node} template The datatable template
 * @param {Object} refs The datatable refs
 * @returns {Node} The scrollerY element
 */
export function getScrollerY(template, refs) {
    return (
        (refs && refs.scrollerY) || template.querySelector('.slds-scrollable_y')
    );
}

/**
 * Tests if value represents an integer greater than 0.
 *
 * @param {Integer} value Value to test
 * @returns {Boolean} Whether the value is greater than 0
 */
export function isPositiveInteger(value) {
    return POSITIVE_INTEGER_REGEXP.test(value);
}

/**
 * Tests if value represents 0 or an integer greater than 0.
 *
 * @param {Integer} value Value to test
 * @returns {Boolean} Whether the value is greater than or equal to 0
 */
export function isNonNegativeInteger(value) {
    return NON_NEGATIVE_INTEGER_REGEXP.test(value);
}

/**
 * Tests if render mode is inline.
 *
 * @param {String} renderMode The render mode to test
 * @returns {Boolean} Whether the render mode is inline
 */
export function isRenderModeInline(renderMode) {
    return RENDER_MODE_INLINE_REGEXP.test(renderMode);
}

/**
 * Tests if render mode is role-based.
 *
 * @param {String} renderMode The render mode to test
 * @returns {Boolean} Whether the render mode is role-based
 */
export function isRenderModeRoleBased(renderMode) {
    return RENDER_MODE_ROLE_BASED_REGEXP.test(renderMode);
}

/**
 * Accepts a value which may be an Integer or String and tests that value
 * with respect to the numberType:
 *     a. numberType - positive: if value > 0
 *     b. numberType - non-negative: if value >= 0
 * If the value fails the test, the fallback value is returned
 *
 * @param {String} attrName Name of attribute to normalize
 * @param {Integer | String} value Value to normalize
 * @param {String} numberType Number type to validate against: positive / non-negative
 * @param {Integer} fallback Value to return if validation fails
 * @returns {Integer} Returns normalized value if validation passes; else returns fallback
 */
export function normalizeNumberAttribute(
    attrName,
    value,
    numberType,
    fallback
) {
    let warningMessage;
    if (numberType === 'positive') {
        if (isPositiveInteger(value)) {
            return Number.parseInt(value, 10);
        }

        warningMessage = `The attribute "${attrName}" value passed in is incorrect. "${attrName}" value should be an integer > 0.`;
    } else if (numberType === 'non-negative') {
        if (isNonNegativeInteger(value)) {
            return Number.parseInt(value, 10);
        }

        warningMessage = `The attribute "${attrName}" value passed in is incorrect. "${attrName}" value should be an integer >= 0.`;
    } else {
        warningMessage =
            'Invalid number type during normalization of number attribute';
    }
    // eslint-disable-next-line no-console
    console.warn(warningMessage);
    return fallback;
}

/**
 * Utility for calculating the scroll offset.
 *
 * TODO: move into scroller-specific utility when more scroll-related functionality
 * needs to be shared between libraries.
 *
 * @param {HTMLElement} el Target element of the scroll
 * @returns {Number} The scroll offset from the table's end
 */
export function getScrollOffsetFromTableEnd(el) {
    return (
        el.scrollHeight - el.parentNode.scrollTop - el.parentNode.clientHeight
    );
}

/**
 * Utility to check if new data just added
 * extra rows to old data by comparing hashes
 *
 * @param {Array} prevData - previous datatable data
 * @param {Array} newData - current datatable data
 * @returns {Boolean} true if new data is extension of old data
 */
export function isLoadMore(prevData, newData) {
    const prevLength = prevData.length;
    const slicedNewData = newData.slice(0, prevLength);
    return hashArray(prevData) === hashArray(slicedNewData);
}

function hashArray(value) {
    const str = JSON.stringify(value);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        hash = (hash << 5) - hash + code;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}
