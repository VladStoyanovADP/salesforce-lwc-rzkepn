// TODO: when migrating off aura, remove functions
// and variables only needed for numberOptions
import locale from '@salesforce/i18n/locale';
import { getNumberFormat } from 'lightning/i18nService';

// For possible parameters, see the Intl.NumberFormat spec:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat#Parameters

export const STYLE = {
    DECIMAL: 'decimal',
    CURRENCY: 'currency',
    PERCENT: 'percent',
};
const CURRENCY_DISPLAY = {
    CODE: 'code', // USD
    SYMBOL: 'symbol', // $
    NAME: 'name', // US Dollars
};
const SAFE_NUM_LENGTH = 15;
const SAFE_NUM_REGEXP = /0+$/;

function toNumber(value) {
    return parseInt(value, 10);
}

/**
 * Gets portion of skeleton for decimal portion of number
 */
function getFractionSkeleton(skeleton) {
    const format = skeleton.split(';')[0];
    return format.split('.')[1] || '';
}

/**
 * Sets minimum and maximum fraction digits in options based on
 * default skeleton and current values; needed to adjust skeleton
 *
 * @param {string} skeleton
 */
function normalizeFractionDigits(skeleton, options) {
    const fractionSkeleton = getFractionSkeleton(skeleton);
    const defaultMinimum = fractionSkeleton.replace(/[^0]/g, '').length; // number of 0s in skeleton
    const defaultMaximum = fractionSkeleton.replace(/[^0#]/g, '').length; // number of 0s and #s in skeleton
    const minDigits = toNumber(options.minimumFractionDigits);
    const maxDigits = toNumber(options.maximumFractionDigits);
    if (!isFinite(options.minimumFractionDigits)) {
        // min fraction digits shouldn't be more than max digits
        options.minimumFractionDigits = Math.min(
            defaultMinimum,
            isNaN(maxDigits) ? defaultMinimum : maxDigits
        );
    }
    if (!isFinite(options.maximumFractionDigits) || maxDigits < minDigits) {
        // max fraction digits shouldn't be less than min digits
        options.maximumFractionDigits = Math.max(
            defaultMaximum,
            isNaN(minDigits) ? defaultMaximum : minDigits
        );
    }
}

/**
 * Gets the fraction/decimal portion of the number formatting
 * string based on the provided formatting options
 *
 * @param {Object} options - number formatting options
 * @returns {string}
 */
function getFractionPart(options) {
    const { minimumFractionDigits, maximumFractionDigits } = options;
    return (
        '.' +
        '0'.repeat(minimumFractionDigits) +
        '#'.repeat(maximumFractionDigits - minimumFractionDigits)
    );
}

/**
 * Updates "skeleton" for number format
 * based on the formatting options provided
 *
 * @param {string} skeleton - outline for number format
 * @param {Object} options - number formatting options
 * @returns {string} updated skeleton
 */
export function updateFractionPart(skeleton, options) {
    normalizeFractionDigits(skeleton, options);
    const fractionPart = getFractionPart(options);
    return addFractionsToPattern(skeleton, fractionPart);
}

/**
 * Updates provided pattern to use provided
 * fractionPart for fraction/decimal portion
 * @param {string} pattern - current string for number format
 * @param {string} fractionPart - string to use for fraction part of number formatting
 * @returns {string} updated pattern
 */
function addFractionsToPattern(pattern, fractionPart) {
    if (!fractionPart) {
        return pattern;
    }

    // if pattern has two formats (one for positive and one for negative numbers), add fractions to both patterns
    if (pattern.indexOf(';') > 0) {
        const [positivePattern, negativePattern] = pattern.split(';');
        return `${addFractionsToPattern(
            positivePattern,
            fractionPart
        )};${addFractionsToPattern(negativePattern, fractionPart)}`;
    }

    // If the pattern already has a fraction part, replace it with the fractions calculated from the options
    if (pattern.indexOf('.') > 0) {
        return pattern.replace(/\.(0|#)*/, fractionPart);
    }

    // If the pattern doesn't have a fraction part, we need to add it to the pattern
    // We need to add the fraction part after the last digit (represented by '0' or '#')
    const position =
        Math.max(pattern.lastIndexOf('0'), pattern.lastIndexOf('#')) + 1;
    return [
        pattern.slice(0, position),
        fractionPart,
        pattern.slice(position),
    ].join('');
}

/**
 * Gets count of numbers in last "grouping" before decimal
 * e.g. for en-IN pattern "#,##,##0.###" this returns 3
 * @param {Object} skeleton
 * @returns {Number}
 */
function getGroupingCount(skeleton) {
    const match = skeleton.match(/,[#0]*\./);
    return match ? match[0].length - 2 : 0;
}

/**
 * Updates integer part of string representation for number format
 * for number as needed based on minimumIntegerDigits option
 *
 * @param {string} skeleton - string of default number format
 * @param {Object} options - number format options
 * @returns skeleton with integer part updated for options
 */
export function updateIntegerPart(skeleton, options) {
    const minimumIntegerDigits = options.minimumIntegerDigits;
    const groupingCount = getGroupingCount(skeleton);
    if (!minimumIntegerDigits) {
        return skeleton;
    }
    if (minimumIntegerDigits <= groupingCount) {
        // handle case where number will include grouping e.g., "1,234"
        return skeleton.replace(
            /,[#0]*\./,
            ',' +
                '#'.repeat(groupingCount - minimumIntegerDigits) +
                '0'.repeat(minimumIntegerDigits) +
                '.'
        );
    }
    // handle case where number will not include grouping e.g., "123"
    return skeleton.replace(
        /[#0]*\./,
        '0'.repeat(minimumIntegerDigits - groupingCount) +
            ',' +
            '0'.repeat(groupingCount) +
            '.'
    );
}

/**
 * Gets string for how to display currency for provided
 * currency code and display style by formatting value
 * and removing remainder of string a set
 *
 * @param {string} code - currency code to format number with
 * @param {string} currencyDisplay - style for displaying currency
 * @returns {string} for currency
 */
function getBestMatchCurrencySymbol(code, currencyDisplay) {
    const opts = {
        style: STYLE.CURRENCY,
        currency: code,
        minimumFractionDigits: 0,
    };
    if (currencyDisplay) {
        opts.currencyDisplay = currencyDisplay;
    }
    const nf = getNumberFormat(locale, opts);
    return nf.format(2).replace(/2/g, '');
}

/**
 * Returns string for how currency should be displayed
 * based on provided number formatting options
 *
 * @param {Object} options - number formatting options
 * @returns {string} for how currency will show in formatted number
 */
export function getCurrency(options) {
    const currencyDisplay = options.currencyDisplay || CURRENCY_DISPLAY.SYMBOL;
    if (
        currencyDisplay === CURRENCY_DISPLAY.SYMBOL ||
        currencyDisplay === CURRENCY_DISPLAY.NAME
    ) {
        return getBestMatchCurrencySymbol(options.currency, currencyDisplay);
    }
    return options.currency; // if displaying code no formatting needed
}

/**
 * Updates "skeleton" to include currency code/name
 * based on provided currencyCode and options
 *
 * @param {string} skeleton - current number formatting skeleton
 * @param {string} currencyCode - currency code to use
 * @param {Object} options - number formatting options
 * @returns {string} updated skeleton
 */
export function updateCurrencySymbol(skeleton, currencyCode, options) {
    const symbol = String.fromCharCode(164); // corresponds to "¤"
    if (options.currencyDisplay === CURRENCY_DISPLAY.NAME) {
        // append the currency code at the end
        return skeleton.replace(symbol, '') + currencyCode;
    }
    return skeleton.replace(symbol, currencyCode);
}

/**
 * Determines whether or not the provided value has more
 * significant digits than what Intl.NumberFormat supports
 *
 * @param {Number|String} value - value to check
 * @returns {boolean} true if value exceeds safe length for Intl.NumberFormat
 */
export function exceedsSafeLength(value) {
    const numberAsString = value.toString();
    const [intPart, fractionPart] = numberAsString.split('.');
    // This count strips out insignificant trailing zeroes in the fraction part of the number.
    const digitCount =
        intPart.length +
        (fractionPart ? fractionPart.replace(SAFE_NUM_REGEXP, '').length : 0);
    return digitCount >= SAFE_NUM_LENGTH;
}
