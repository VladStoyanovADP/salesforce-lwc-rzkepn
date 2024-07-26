// TODO: when migrating off aura, remove functions
// and vaiables only used in dateTimeOptions
import locale from '@salesforce/i18n/locale';
import mediumDateFormat from '@salesforce/i18n/dateTime.mediumDateFormat';
import getFormattingOptions from 'lightning/i18nCldrOptions';
import { getSkeleton } from './dateTimeOptions';
import { isDate } from './dateTimeUtils';
import {
    formatDateUTC,
    formatDate,
    toOtherCalendar,
    syncUTCToWallTime,
} from '../localizationService';
import { isAuraL10NAvailable } from '../utils';
import {
    isValidISODateTimeString,
    padMilliseconds,
    TIME_SEPARATOR,
} from 'lightning/iso8601Utils';
import {
    getDateTimeFormat,
    getDateTimeISO8601Parser,
} from 'lightning/i18nService';

function convertAndFormatDate(date, format, timeZone) {
    const translatedDate = toOtherCalendar(date);
    const converted = syncUTCToWallTime(translatedDate, timeZone);
    return formatDateUTC(converted, format);
}

/**
 * Tries toDateStrict; if error thrown (unparseable string),
 * logs warning and returns value from Date.parse
 *
 * @param {String|Number|Date} value
 * @returns Date
 */
export function toDate(value) {
    try {
        return toDateStrict(value);
    } catch (err) {
        console.warn(
            `'${value}' does not follow a supported date format. Please use either a timestamp, ISO8601 string, or Date object to avoid risking inconsistencies and breakages.`
        );
        return new Date(value);
    }
}

/**
 * Converts a timestamp or ISO-8601 string to a Date object
 * If a Date object is provided it is returned as-is
 *
 * @param {String|Number|Date} value
 * @returns Date
 */
function toDateStrict(value) {
    if (value && !isDate(value) && isFinite(value)) {
        // handles timestamp as number or string
        return new Date(parseInt(value, 10));
    } else if (value && !isDate(value)) {
        // handles non-timestamp string
        const strictString = padMilliseconds(value);
        return getDateTimeISO8601Parser().parse(strictString);
    }
    return value; // handles date object
}

/**
 * Returns true if the current browser supports time zones
 * for Intl other than UTC by seeing if error is thrown when
 * a non-UTC time zone is passed; should return false for IE11
 * and true for all other supported browsers.
 */
const isNonUTCSupported = (function () {
    try {
        // eslint-disable-next-line new-cap
        Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles' });
    } catch (err) {
        return false;
    }
    return true;
})();

function dateTimeFormatFallback(options) {
    const format = !useDefaultFormat(options) ? getSkeleton(options) : null;
    const { timeZone } = options;
    return {
        format: (value) => {
            // if value is an ISO date string with no time component, do not convert between timezones
            if (
                isValidISODateTimeString(value) &&
                value.indexOf(TIME_SEPARATOR) < 0
            ) {
                return formatDate(value);
            }
            // FIXME use standard methods from localizationService for parsing and formatting instead
            const dateObj = toDate(value);
            if (isDate(dateObj)) {
                if (timeZone === 'UTC') {
                    dateObj.setTime(
                        dateObj.getTime() +
                            dateObj.getTimezoneOffset() * 60 * 1000
                    );
                }
                return convertAndFormatDate(dateObj, format, timeZone);
            }
            return '';
        },
    };
}

/**
 * Returns true if Aura fallback should be used for
 * datetime formatting with provided date time optionss
 *
 * More specifically, Aura should be used on-core and
 * when no formatting options are provided or we're
 * using a non-UTC time zone on a browser that does
 * not support them
 */
function useAuraFallbackFormatting(options) {
    const { timeZone } = options;
    const isNonUTCTimeZone = timeZone && timeZone !== 'UTC';
    if (
        isAuraL10NAvailable &&
        (useDefaultFormat(options) || (!isNonUTCSupported && isNonUTCTimeZone))
    ) {
        return true;
    }
    return false;
}

/**
 * Returns true if the mediumDateFormat options should be used
 * Medium date format should be used when there are no options
 * or only options are for the time zone and hour system
 */
function useDefaultFormat(options) {
    const excludedOptions = {
        hour12: true,
        hourCycle: true,
        timeZone: true,
        timeZoneName: true,
    };
    const hasFormattingOption = Object.keys(options).some(
        (opt) => options[opt] !== undefined && !excludedOptions[opt]
    );
    return !hasFormattingOption;
}

/**
 * Creates date time formatter based on feature availability and provided options.
 * When on-core, uses Aura on IE11 or when we need default format, and uses
 * Intl.DateTimeFormat through i18nService otherwise
 *
 * @param {Object} opts - Formatting options from lightning-formatted-date-time
 * @returns {Object} - Object with "format" function
 */
export function dateTimeFormat(opts) {
    const options = opts || {};
    if (useAuraFallbackFormatting(options)) {
        return dateTimeFormatFallback(options);
    } else if (useDefaultFormat(options)) {
        // use mediumDateFormat options if not using Aura
        // and no options outside of hour system or time zone
        // need to use Object.assign so hour system and
        // time zone options work as expected when passed in
        opts = Object.assign(options, getFormattingOptions(mediumDateFormat));
    }

    return {
        format: (value) => {
            const formatter = getDateTimeFormat(locale, opts);
            return formatter.format(toDate(value));
        },
    };
}
