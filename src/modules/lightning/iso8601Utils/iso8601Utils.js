// TODO: remove file when migrating off aura
/*
 * Regex to test a string for an ISO8601 Date. The following formats are matched.
 *
 *  YYYY
 *  YYYY-MM
 *  YYYY-MM-DD
 *  YYYY-MM-DDThh:mmTZD
 *  YYYY-MM-DDThh:mm:ssTZD
 *  YYYY-MM-DDThh:mm:ss.STZD
 *
 *
 * @see: https://www.w3.org/TR/NOTE-datetime
 */
const ISO8601_STRICT_PATTERN =
    /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d[:]?\d\d)|Z)?)?)?)?$/i;

/* Regex to test a string for an ISO8601 partial time or full time:
 * hh:mm
 * hh:mm:ss
 * hh:mm:ss.S
 * full time = partial time + TZD
 */
const ISO8601_TIME_PATTERN =
    /^\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d[:]?\d\d)|Z)?$/i;

export const STANDARD_TIME_FORMAT = 'HH:mm:ss.SSS';
export const STANDARD_DATE_FORMAT = 'YYYY-MM-DD';
export const TIME_SEPARATOR = 'T';
const TIMEZONE_INDICATOR = /(Z|([+-])(\d{2})[:]?(\d{2}))$/i;

export function isValidISODateTimeString(dateTimeString) {
    return isValidISO8601String(dateTimeString) && isValidDate(dateTimeString);
}

export function isValidISOTimeString(timeString) {
    if (!isValidISO8601TimeString(timeString)) {
        return false;
    }

    const timeOnly = removeTimeZoneSuffix(timeString);
    return isValidDate(`2018-09-09T${timeOnly}Z`);
}

export function removeTimeZoneSuffix(dateTimeString) {
    if (typeof dateTimeString === 'string') {
        return dateTimeString.split(TIMEZONE_INDICATOR)[0];
    }
    return dateTimeString;
}

/**
 * Ensures that any valid ISO string with a milliseconds
 * component has exactly three digits
 *
 * @param {any} dateTimeString
 * @returns {any}
 */
export function padMilliseconds(dateTimeString) {
    if (
        typeof dateTimeString === 'string' &&
        (isValidDate(dateTimeString) || isValidISOTimeString(dateTimeString))
    ) {
        const millisecondIndex = dateTimeString.indexOf('.');
        let timezoneIndex = dateTimeString.search(TIMEZONE_INDICATOR);
        if (timezoneIndex === -1) {
            timezoneIndex = dateTimeString.length;
        }
        // if milliseconds present, make sure exactly 3 digits present
        if (millisecondIndex !== -1) {
            const milliseconds = dateTimeString.substring(
                millisecondIndex + 1,
                timezoneIndex
            );
            let newMilliseconds = milliseconds;
            if (milliseconds.length > 3) {
                // if more than 3 digits, cut to three digits
                newMilliseconds = newMilliseconds.substring(0, 3);
            } else if (milliseconds.length < 3) {
                // if less than 3 digits, add zeros to make it 3 digits
                const extraZeros = '0'.repeat(3 - milliseconds.length);
                newMilliseconds = `${newMilliseconds}${extraZeros}`;
            }
            // replace old milliseconds with new 3 digit milliseconds
            const start = dateTimeString.substring(0, millisecondIndex);
            const end = dateTimeString.substring(timezoneIndex);
            return `${start}.${newMilliseconds}${end}`;
        }
    }
    return dateTimeString;
}

function isValidISO8601String(dateTimeString) {
    if (typeof dateTimeString !== 'string') {
        return false;
    }
    return ISO8601_STRICT_PATTERN.test(dateTimeString);
}

function isValidISO8601TimeString(timeString) {
    if (typeof timeString !== 'string') {
        return false;
    }
    return ISO8601_TIME_PATTERN.test(timeString);
}

function isValidDate(value) {
    // Date.parse returns NaN if the argument doesn't represent a valid date
    const timeStamp = Date.parse(value);
    return isFinite(timeStamp);
}
