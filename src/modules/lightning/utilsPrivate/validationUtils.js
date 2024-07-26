import { isValidISODateTimeString } from 'lightning/iso8601Utils';

const MAX_LONGITUDE = 180.0;
const MAX_LATITUDE = 90.0;

/**
 * Determine if a value is a valid date.
 *
 * @param {any} value The value to validate.
 * @returns {boolean} Whether the provided value is a valid date or not.
 */
export function isValidDate(value) {
    if (value === null || value === undefined || value === '') {
        return false;
    }
    return isFinite(value) || isValidISODateTimeString(value);
}

/**
 * Determine if a value is a valid latitude.
 *
 * @param {any} value The value to validate.
 * @returns {boolean} Whether the provided value is a valid latitude or not.
 */
export function isValidLatitude(value) {
    return (
        value !== null &&
        value !== undefined &&
        value !== '' &&
        isFinite(value) &&
        Math.abs(value) <= MAX_LATITUDE
    );
}

/**
 * Determine if a value is a valid longitude.
 *
 * @param {any} value The value to validate.
 * @returns {boolean} Whether the provided value is a valid longitude or not.
 */
export function isValidLongitude(value) {
    return (
        value !== null &&
        value !== undefined &&
        value !== '' &&
        isFinite(value) &&
        Math.abs(value) <= MAX_LONGITUDE
    );
}

/**
 * Determine if a value is a valid phone value.
 *
 * @param {any} value The value to validate.
 * @returns {boolean} Whether the provided value is a valid phone value or not.
 */
export function isValidPhone(value) {
    return typeof value === 'string' && value !== '';
}
