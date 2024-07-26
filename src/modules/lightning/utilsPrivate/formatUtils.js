import {
    isValidDate,
    isValidLatitude,
    isValidLongitude,
} from './validationUtils';

/**
 * Convert a LightningFormattedDate instance (or similar) to a dateTimeFormat
 * options object.
 *
 * @param {LightningFormattedDateLike} instance
 *      An instance of the LightningFormattedDate class,
 *      or config object matching the public API.
 * @returns {object} The dateTimeFormat options object.
 */
export function toDateTimeFormatOptions(instance) {
    const options = {
        weekday: instance.weekday,
        era: instance.era,
        year: instance.year,
        month: instance.month,
        day: instance.day,
        hour: instance.hour,
        hourCycle: undefined,
        hour12: undefined,
        minute: instance.minute,
        second: instance.second,
        timeZoneName: instance.timeZoneName,
        timeZone: instance.timeZone,
    };
    const { hour12 } = instance;
    // If hour12 is set, then we use it, otherwise locale defaults will be used
    if (instance._hour12Set) {
        // TODO: W-7787708: Remove hourCycle workaround below when possible.
        // W-7583911: Temporarily works around an hourCycle spec bug that only Chrome has
        // implemented causing the default hourCycle to be 'h24' rather than 'h23' when hour12 is
        // false in 12-hour locales. Chrome ends up displaying times like '24:45'. Spec bug fix PR:
        // https://github.com/tc39/ecma402/pull/436/files
        if (hour12 === false) {
            options.hourCycle = 'h23';
        } else {
            options.hour12 = hour12;
        }
    }
    return options;
}

/**
 * Convert a LightningFormattedDate instance (or similar) to a string.
 * Allows for formatting a date without the overhead of instantiating a whole
 * component.
 *
 * @param {LightningFormattedDateLike} instance
 *      An instance of the LightningFormattedDate class,
 *      or config object matching the public API.
 * @returns {string} The date as a string.
 */
export function toFormattedDate(instance, dateTimeFormat) {
    const { value } = instance;
    if (isValidDate(value)) {
        const formatted = dateTimeFormat(
            toDateTimeFormatOptions(instance)
        ).format(value);
        if (formatted) {
            return formatted;
        }
    }
    // eslint-disable-line no-console
    console.warn(
        `<lightning-formatted-date-time> The value attribute accepts either a Date object, a timestamp, or a valid ISO8601 formatted string ` +
            `with timezone offset. but we are getting the ${typeof value} value "${value}" instead.`
    );
    return '';
}

/**
 * Convert a LightningFormattedLocation instance (or similar) to a string.
 * Allows for formatting a location without the overhead of instantiating a whole
 * component.
 *
 * @param {LightningFormattedLocationLike} instance
 *      An instance of the LightningFormattedLocation class,
 *      or config object matching the public API.
 * @returns {string} The latitude and longitude as a string.
 */
export function toFormattedLocation(instance) {
    const { latitude, longitude } = instance;
    if (isValidLatitude(latitude) && isValidLongitude(longitude)) {
        return `${latitude}, ${longitude}`;
    }
    // eslint-disable-next-line no-console
    console.warn(
        `<lightning-formatted-location> expects latitude in range [-90.0, 90.0], longitude in range [-180.0, 180.0].`
    );
    return '';
}

/**
 * Convert a LightningFormattedNumber instance (or similar) to a string.
 * Allows for formatting a number without the overhead of instantiating a whole
 * component.
 *
 * @param {LightningFormattedNumberLike} instance
 *      An instance of the LightningFormattedNumber class,
 *      or config object matching the public API.
 * @returns {string} The number as a string.
 */
export function toFormattedNumber(instance, numberFormat) {
    const { value } = instance;
    if (
        value !== null &&
        value !== undefined &&
        value !== '' &&
        isFinite(value)
    ) {
        const { formatStyle } = instance;
        const options = {
            style: formatStyle,
            currency: instance.currencyCode,
            currencyDisplay: instance.currencyDisplayAs,
            minimumIntegerDigits: instance.minimumIntegerDigits,
            minimumFractionDigits: instance.minimumFractionDigits,
            maximumFractionDigits: instance.maximumFractionDigits,
            minimumSignificantDigits: instance.minimumSignificantDigits,
            maximumSignificantDigits: instance.maximumSignificantDigits,
        };

        const valueAsString = String(value);

        let valueToFormat = valueAsString;

        // percent-fixed just divides the value by 100
        // before passing to the library, this is to deal with the
        // fact that percentages in salesforce are 0-100, not 0-1
        if (formatStyle === 'percent-fixed') {
            options.style = 'percent';

            valueToFormat = parseFloat(value) / 100;

            // If the number contains fraction digits and is not in an exponent format
            if (
                valueAsString.indexOf('.') > 0 &&
                valueAsString.indexOf('e') < 0
            ) {
                // Depending on the input number, division by 100 may lead to rounding errors
                // (e.g 0.785 / 100 is 0.007850000000000001), so we need to round back
                // to the correct precision, that is - existing number of fractional digits
                // plus extra 2 for division by 100.
                valueToFormat = valueToFormat.toFixed(
                    valueAsString.split('.')[1].length + 2
                );
            }
        }
        return numberFormat(options).format(valueToFormat);
    }

    return '';
}
