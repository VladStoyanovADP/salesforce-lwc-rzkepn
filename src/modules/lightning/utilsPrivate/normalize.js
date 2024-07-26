/**
A string normalization utility for attributes.
@param {String} value - The value to normalize.
@param {Object} config - The optional configuration object.
@param {String} [config.fallbackValue] - The optional fallback value to use if the given value is not provided or invalid. Defaults to an empty string.
@param {Array} [config.validValues] - An optional array of valid values. Assumes all input is valid if not provided.
@return {String} - The normalized value.
**/
export function normalizeString(value, config = {}) {
    const { fallbackValue = '', validValues, toLowerCase = true } = config;
    let normalized = (typeof value === 'string' && value.trim()) || '';
    normalized = toLowerCase ? normalized.toLowerCase() : normalized;
    if (validValues && validValues.indexOf(normalized) === -1) {
        normalized = fallbackValue;
    }
    return normalized;
}

/**
A boolean normalization utility for attributes.
@param {Any} value - The value to normalize.
@return {Boolean} - The normalized value.
**/
export function normalizeBoolean(value) {
    return typeof value === 'string' || !!value;
}

const isNotNumber = (value) => {
    // Need to make sure it is a number than check isNaN
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN#difference_between_number.isnan_and_global_isnan
    if (
        Number.isNaN(value) ||
        value === null ||
        value === undefined ||
        value === '' ||
        Array.isArray(value)
    ) {
        return true;
    }
    // to eliminate non numeric string or other non numeric-typed objects
    const convertedNumber = Number(value);
    return Number.isNaN(convertedNumber);
};

/**
 * A number normalization utility for attributes.
 * @param {number} value - The value to normalize.
 * @param {object} config -  The optional configuration object.
 * @param {number} [config.minValue] - The optional min value to check against the given value.
 * @param {number} [config.maxValue] - The optional max value to check against the given value.
 * @param {number} [config.fallbackValue] - The optional fallback value to use if the given value is not provided or outside of the min or max range
 * @return {number} - The normalized value
 */
export function normalizeNumber(value, config = {}) {
    const { fallbackValue, minValue, maxValue } = config;
    const returnValueIfInvalid =
        (typeof fallbackValue === 'number' && fallbackValue) || undefined;

    if (isNotNumber(value)) {
        return returnValueIfInvalid;
    }
    if (!isNotNumber(value) && value < minValue) {
        return returnValueIfInvalid;
    }
    if (!isNotNumber(value) && value > maxValue) {
        return returnValueIfInvalid;
    }
    // multiplying 1 is to make sure to convert from a numeric string to a number
    return value * 1;
}

export function normalizeArray(value) {
    if (Array.isArray(value)) {
        return value;
    }
    return [];
}

/**
A aria attribute normalization utility.
@param {Any} value - A single aria value or an array of aria values
@return {String} - A space separated list of aria values
**/
export function normalizeAriaAttribute(value) {
    let arias = Array.isArray(value) ? value : [value];
    arias = arias
        .map((ariaValue) => {
            if (typeof ariaValue === 'string') {
                return ariaValue.replace(/\s+/g, ' ').trim();
            }
            return '';
        })
        .filter((ariaValue) => !!ariaValue);

    return arias.length > 0 ? arias.join(' ') : null;
}
