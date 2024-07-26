import commonDigits from '@salesforce/i18n/common.digits';
import commonCalendarData from '@salesforce/i18n/common.calendarData';
import defaultCalendar from '@salesforce/i18n/defaultCalendar';
import defaultNumberingSystem from '@salesforce/i18n/defaultNumberingSystem';
import calendarData from '@salesforce/i18n/calendarData';
import decimalSeparator from '@salesforce/i18n/number.decimalSeparator';
import groupingSeparator from '@salesforce/i18n/number.groupingSeparator';
import percentSign from '@salesforce/i18n/number.percentSign';
import plusSign from '@salesforce/i18n/number.plusSign';
import minusSign from '@salesforce/i18n/number.minusSign';
import exponentialSign from '@salesforce/i18n/number.exponentialSign';
import superscriptingExponentSign from '@salesforce/i18n/number.superscriptingExponentSign';
import perMilleSign from '@salesforce/i18n/number.perMilleSign';
import infinity from '@salesforce/i18n/number.infinity';
import nan from '@salesforce/i18n/number.nan';
import currencySymbol from '@salesforce/i18n/number.currencySymbol';

/**
 * Given an object instance, generate an object with the same properties, with property name ordered alphabetically, and undefined properties removed.
 *
 * @param value Object to process
 * @returns Generated object with properties only
 */
function extractProperties(value) {
    // Return primitive value as is
    const valueType = typeof value;
    if (valueType === 'string' ||
        valueType === 'number' ||
        valueType === 'boolean' ||
        valueType === 'undefined') {
        return value;
    }
    if (valueType === 'object') {
        // Array is an object
        if (Array.isArray(value)) {
            const newValue = [];
            // Keep sort order
            for (const arrayValue of value) {
                newValue.push(extractProperties(arrayValue));
            }
            return newValue;
        }
        else {
            const newValue = {};
            // Normalize property order by sorting it before assignment
            const propNames = Object.getOwnPropertyNames(value).sort();
            for (const propName of propNames) {
                const propValue = extractProperties(value[propName]);
                // Normalize property value by assigning only defined values to properties
                if (propValue !== undefined) {
                    newValue[propName] = propValue;
                }
            }
            return newValue;
        }
    }
    return undefined;
}
/**
 * A Map-like object with normalized key
 */
class Cache {
    /**
     * Constructs an empty instance.
     *
     * @constructor
     */
    constructor() {
        /** Internal map object */
        this.map = new Map();
    }
    /**
     * Checks whether this cache contains provided key.
     *
     * @param key Cache key
     * @returns 'true' if cache has this key
     */
    has(key) {
        const newKey = this.normalize(key);
        return this.map.has(newKey);
    }
    /**
     * Returns the cached value for provided key, or undefined if key is unavailable
     *
     * @param key Cache key
     * @returns Cache value
     */
    get(key) {
        const newKey = this.normalize(key);
        return this.map.get(newKey);
    }
    /**
     * Sets provided value to provided cache key. Current cached value will be overwritten if cache key exists.
     *
     * @param key Cache key. Examples: {prop: 'prop value', nested: { nestedProp: 'nestedProp value' }}
     * @param value Cache value
     * @returns Current cache instance
     */
    set(key, value) {
        const newKey = this.normalize(key);
        this.map.set(newKey, value);
        return this;
    }
    /**
     * Removes all cached values.
     *
     * @returns void
     */
    clear() {
        return this.map.clear();
    }
    /**
     * Given a cache key, normalize the key to a string.
     *
     * @param key Cache key
     * @returns Normalized cached key string
     */
    normalize(key) {
        const newKey = extractProperties(key);
        return JSON.stringify(newKey);
    }
}

const dateTimeFormatCache = new Map();
/**
 * Clears the cache
 */
function clearDateTimeFormatCache() {
    dateTimeFormatCache.clear();
}
/**
 * Instantiate or returns a cached value of {@link Intl.DateTimeFormat}, instantiated with given options.
 *
 * @param locale {string} Locale
 * @param options {Intl.DateTimeFormatOptions} Formatter options
 * @returns {Intl.DateTimeFormat} Formatter instance
 */
function getDateTimeFormat(locale = 'en-US', options = {}) {
    if (!dateTimeFormatCache.has(locale)) {
        dateTimeFormatCache.set(locale, new Cache());
    }
    if (!dateTimeFormatCache.get(locale).has(options)) {
        const instance = new Intl.DateTimeFormat(locale, options);
        dateTimeFormatCache.get(locale).set(options, instance);
    }
    return dateTimeFormatCache.get(locale).get(options);
}

/**
 * Escapes a string to use in Javascript regular expression
 *
 * @param value String value to include in a regex
 * @returns {string} Escaped value
 */
function escapeRegex(value) {
    return value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}
/** Map of calendar name used on Intl to its CLDR counterpart */
const intlCalendarMap = {
    gregory: 'gregorian',
};
/**
 * Resolves Intl calendar name to CLDR calendar name
 *
 * @param calendar {string} Calendar name for Intl
 * @returns {string} Calendar name for CLDR
 */
function intlCalendarToCldr(calendar) {
    return Object.prototype.hasOwnProperty.call(intlCalendarMap, calendar)
        ? intlCalendarMap[calendar]
        : calendar;
}
const eraDateRegex = /^([-]?[0-9]+)-([0-9]{1,2})-([0-9]{1,2})$/;
/**
 * Parses the date string on CLDR era start/end data to year/month/day property object.
 *
 * @private
 * @param value {string} Era date value to parse
 * @returns Resolved date value
 */
function parseEraDate(value) {
    if (value && eraDateRegex.test(value)) {
        const matches = value.match(eraDateRegex);
        return {
            year: parseInt(matches[0], 10),
            month: parseInt(matches[0], 10),
            day: parseInt(matches[0], 10),
        };
    }
    return undefined;
}
// function compareDate(l: { year: number, month: number, day: number }, r: { year: number, month: number, day: number }): number {
//     if (l.year < r.year || (l.year === r.year && l.month < r.month) || (l.year === r.year && l.month === r.month && l.day < r.day)) return -1;
//     if (l.year > r.year || (l.year === r.year && l.month > r.month) || (l.year === r.year && l.month === r.month && l.day > r.day)) return 1;
//     return 0;
// }
/**
 * Resolves a date with year that is indexed to a specific era to its gregorian year value. e.g. Reiwa 3, January 1st for Japanese imperial calendar will resolve to 2021
 *
 * @param eraIndex {number} Era index
 * @param year {number} Year in era
 * @param month {number} Month in era
 * @param day {number} Day in era
 * @param calendarType {string} Calendar type. e.g. "gregorian"
 * @param common {LocaleCommonDataCalendarData} Locale common calendar data
 * @returns {number} Positive gregorian year for AD, negative gregorian year for BC
 */
function getGregorianYear(eraIndex, year, month, day, calendarType = 'gregorian', calendarData) {
    if (calendarType === 'gregorian') {
        // Fast path for gregorian
        // eraIndex === 0 if BC. A negative BC is a positive AD, vice versa
        return eraIndex === 0 ? -year : year;
    }
    else if (calendarData && calendarData.calendarSystem === 'solar' && calendarData.eras) {
        // non-gregorian solar calendars
        const eras = Object.keys(calendarData.eras)
            .sort()
            .map((k) => calendarData.eras[k]);
        if (eraIndex >= eras.length || eraIndex < 0) {
            // NOTE: Should we start with era that match today, rather than last era if invalid?
            eraIndex = eras.length - 1;
        }
        const era = eras[eraIndex];
        const yearAdjusted = year > 0 ? year - 1 : year < 0 ? year + 1 : 0;
        // We can only have either _start or _end on era
        if (era._end) {
            // This can only be the first era (eras[0]) that counts down (gregorian, coptic, ethiopic)
            const eraEnd = parseEraDate(era._end);
            if (!eraEnd)
                return undefined; // Report to Unicode
            return eraEnd.year - yearAdjusted;
        }
        else if (era._start) {
            const eraStart = parseEraDate(era._start);
            if (!eraStart)
                return undefined; // Report to Unicode
            return eraStart.year + yearAdjusted;
        }
    }
    else if (calendarData && calendarData.calendarSystem !== 'solar' && calendarData.eras) {
        // TODO: non-gregorian non-solar calendars
        return year;
    }
    return undefined;
}
/**
 * Extracts localized digits on a string and convert it to an array of integers
 *
 * @param value {string} String value
 * @param localeDigits {string[]} Array of localized digits. e.g. ["0",...,"9"] for "latn"
 * @returns {number[]} Array of integers from string. e.g. [1,2,3] for "123" for "latn"
 */
function stringToDigits(value, localeDigits) {
    const digits = [];
    [...value].forEach((char) => {
        const digit = localeDigits.indexOf(char);
        if (digit >= 0) {
            digits.push(digit);
        }
    });
    return digits.reverse();
}
/**
 * Extracts localized digits on a string and convert it to an integer
 *
 * @param value {string} String value
 * @param digits {string} Localized digits. e.g. "0123456789" for "latn"
 * @returns {number} Integer value. e.g. 123 for "123" for "latn"
 */
function parseDigits(value, digits) {
    return stringToDigits(value, Array.from(digits)).reduce((int, cur, idx) => (int += cur * 10 ** idx), 0);
}
/**
 * @private
 */
function getDigitsRegexPatternInternal(digits, extras = '') {
    // Optimze for sequential codepoints
    if (digits.length > 1 &&
        digits.reduce((sum, digit, idx, arr) => idx === 0
            ? true
            : sum && digit.codePointAt(0) - arr[idx - 1].codePointAt(0) === 1, false)) {
        return '[' + [digits[0], digits[digits.length - 1]].join('-') + escapeRegex(extras) + ']';
    }
    return '[' + digits.join('') + escapeRegex(extras) + ']';
}
/**
 * Generates an optimized regular expression for given localized digits.
 * We would want a regular expression of [0-9] instead of [0123456789],
 * or [\u{660}-\u{669}] instead of [\u{660}\u{661}\u{662}\u{663}\u{664}\u{665}\u{666}\u{667}\u{668}\u{669}] for arabic.
 *
 * @param digits {string} Localized digit string. e.g. "0123456789" for "latn"
 * @param extras {string} Extra characters to include in regular expression range
 * @returns {string} Optimized regular expression for given digits
 */
function getDigitsRegexPattern(digits, extras = '') {
    return getDigitsRegexPatternInternal(Array.from(digits), extras);
}
let utcFormat;
/**
 * This formats to "MM/dd/yyyy, hh:mm" in English (United States) specifically
 */
function getUtcFormat() {
    if (!utcFormat) {
        utcFormat = new Intl.DateTimeFormat('en-US', {
            timeZone: 'UTC',
            hourCycle: 'h23',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        });
    }
    return utcFormat;
}
/**
 * This matches for "MM/dd/yyyy, hh:mm"
 * Group 0: month
 * Group 1: date
 * Group 2: year
 * Group 3: hour
 * Group 4: minutes
 */
const EN_US_DATE_REGEXP = /(\d+).(\d+).(\d+),?\s+(\d+).(\d+)(.(\d+))?/;
const EN_US_DATE_INDEX_DAY = 1;
const EN_US_DATE_INDEX_HOUR = 3;
const EN_US_DATE_INDEX_MINUTE = 4;
const TIMEZONE_DATEFORMATS = new Map();
/**
 * Parses date string in specific "MM/dd/yyyy, hh:mm" format to its respected parts.
 *
 * @param value Date string value in "MM/dd/yyyy, hh:mm" format
 * @returns Array of parsed strings based on groups defined at EN_US_DATE_REGEXP
 */
function parseEnUsDate(value) {
    const dateString = value.replace(/[\u200E\u200F]/g, ''); // Cleanse
    return [].slice.call(EN_US_DATE_REGEXP.exec(dateString), 1).map(Math.floor);
}
/**
 * Given two date parts parsed by parseEnUsDate, return the difference in minutes.
 *
 * @param date1 Date parts
 * @param date2 Date parts
 * @returns Difference in minutes
 */
function diffMinutes(date1, date2) {
    let day = date1[EN_US_DATE_INDEX_DAY] - date2[EN_US_DATE_INDEX_DAY];
    const hour = date1[EN_US_DATE_INDEX_HOUR] - date2[EN_US_DATE_INDEX_HOUR];
    const min = date1[EN_US_DATE_INDEX_MINUTE] - date2[EN_US_DATE_INDEX_MINUTE];
    if (day > 15) {
        day = -1;
    }
    if (day < -15) {
        day = 1;
    }
    return 60 * (24 * day + hour) + min;
}
/**
 * Return timezone offset of given date in minutes
 *
 * @param timeZoneId Time zone
 * @param date Date object
 * @returns Number of time offset in minutes
 */
function getTimeZoneOffset(timeZone, date) {
    if (!TIMEZONE_DATEFORMATS.has(timeZone)) {
        // This must be the same locale (English (United States)) and options as getUtcFormat, minus the timeZone difference
        TIMEZONE_DATEFORMATS.set(timeZone, new Intl.DateTimeFormat('en-US', {
            timeZone: timeZone,
            hourCycle: 'h23',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        }));
    }
    const dateFormat = TIMEZONE_DATEFORMATS.get(timeZone);
    return diffMinutes(parseEnUsDate(getUtcFormat().format(date)), parseEnUsDate(dateFormat.format(date)));
}
/**
 * Validates week
 *
 * @param week {Number} Week number
 * @returns {boolean} true if the week is valid
 */
function isValidWeek(week) {
    return (Number.isInteger(week) && week >= 1 /*week starts at 1 */ && week <= 53); /* at most we only have 53 weeks */
}
/**
 * Validates day of week
 *
 * @param dayOfWeek {Number} dayOfWeek number
 * @returns {boolean} true if the day of week is valid
 */
function isValidDayOfWeek(dayOfWeek) {
    return (Number.isInteger(dayOfWeek) &&
        dayOfWeek >= 1 /* day of week starts at 1 */ &&
        dayOfWeek <= 7); /* day of week ends at 7 */
}
/**
 * Validates month
 *
 * @param month {Number} Month number
 * @returns {boolean} true if the month is valid
 */
function isValidMonth(month) {
    return is31DayMonth(month) || is30DayMonth(month) || month === 2;
}
/**
 * Check if the month has 31 days
 *
 * @param month {Number} Month number
 * @returns {boolean} true if the month has 31 days
 */
function is31DayMonth(month) {
    return (month === 1 ||
        month === 3 ||
        month === 5 ||
        month === 7 ||
        month === 8 ||
        month === 10 ||
        month === 12);
}
/**
 * Check if the month has 30 days
 *
 * @param month {Number} Month number
 * @returns {boolean} true if the month has 30 days
 */
function is30DayMonth(month) {
    return month === 4 || month === 6 || month === 9 || month === 11;
}
/**
 * Check if ordinal is valid
 *
 * @param ordinal {Number} Ordinal number
 * @param isLeapYear {boolean}
 * @returns {boolean} true if the ordinal is valid
 */
function isValidOrdinal(ordinal, isLeapYear) {
    return (Number.isInteger(ordinal) &&
        ordinal >= 1 /* ordinal day starts at 1 */ &&
        ((isLeapYear && ordinal <= 366) /* at most we only have 366 days for leap year */ ||
            (!isLeapYear && ordinal <= 365))); /* at most we only have 366 days for leap year */
}
/**
 * Validate date
 *
 * @param month {Number} Month number
 * @param day {Number} Day number
 * @param isLeapYear {boolean} Indicates whether its a leap year
 * @returns {boolean} true if the date is valid
 */
function isValidDate(month, day, isLeapYear) {
    return (isValidMonth(month) &&
        Number.isInteger(day) &&
        day >= 1 /* 0 is not a date */ &&
        ((day <= 30 && is30DayMonth(month)) /* validation for 30 day months */ ||
            (day <= 31 && is31DayMonth(month)) /* validation for 31 day months */ ||
            (isLeapYear && month === 2 && day <= 29) /* february, leap year */ ||
            (!isLeapYear && month === 2 && day <= 28))); /* february, non leap year */
}

/**
 * Calendar holds broken down data of an instance in time to calendar parts (year, month, day, etc). This helps in calendar arithmetic (e.g. change time zones, add days, etc)
 */
class Calendar {
    /**
     * @constructor
     * @param timeZone {string} Time zone of this instance
     */
    constructor(timeZone) {
        this.year = 0;
        this.month = 1;
        this.day = 1;
        this.hour = 0;
        this.minute = 0;
        this.second = 0;
        this.millisecond = 0;
        this.timeZone = timeZone;
    }
    /**
     * Clears the data on this calendar instance
     */
    clear() {
        this.year = 0;
        this.month = 1;
        this.day = 1;
        this.hour = 0;
        this.minute = 0;
        this.second = 0;
        this.millisecond = 0;
    }
    /**
     * Converts this calendar instance to an equivalent Javascript Date instance
     *
     * @param smallYearOffset {number} Offset year to use if this calendar year is a two-digit year
     * @returns {Date} Date instance
     */
    getDate(smallYearOffset = 2000) {
        // Adjust year if two digits and below
        if (this.year < 100 && this.year >= 0) {
            this.year += smallYearOffset;
        }
        // Date is constructed with date & time in local (browser) time zone
        const localDate = new Date(this.year, this.month - 1, this.day, this.hour, this.minute, this.second, this.millisecond);
        if (this.timeZone) {
            const localOffset = localDate.getTimezoneOffset();
            const timeZoneOffset = getTimeZoneOffset(this.timeZone, localDate);
            const offset = localOffset - timeZoneOffset;
            // Return local date if offset equals, else adjust millisecond and return adjusted date
            if (Math.floor(offset) !== 0) {
                const adjustedDate = new Date(localDate.getTime() - offset * 60 * 1000);
                return adjustedDate;
            }
        }
        return localDate;
    }
}

/**
 * Tokenize string value of CLDR date time format string to array of tokens.
 *
 * Ref: https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Format_Patterns
 *
 * @param value CLDR date time format pattern
 * @returns Array of tokens
 */
function tokenizeDateTimePattern(value) {
    // Notes regarding single quote escape:
    // <quote>
    // Literal text, which is output as-is when formatting, and must closely match when parsing. Literal text can include:
    // * Any characters other than A..Z and a..z, including spaces and punctuation.
    // * Any text between single vertical quotes ('xxxx'), which may include A..Z and a..z as literal text.
    // * Two adjacent single vertical quotes (''), which represent a literal single quote, either inside or outside quoted text.
    // </quote>
    // Ref: https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Format_Patterns
    // e.g.
    // '' -> [text(')]
    // 'a' -> [text(a)]
    // 'ymd' -> [text(ymd)]
    // ''a -> [text('), token(a)]
    // ''' -> [text(')]
    // '''' -> [text('')]
    // 'a''b' -> [text(a'b)]
    // ' '' ' -> [text( ' )]
    const tokenValues = [...'GyYQqM<wWdDFEecabBhHKkmsSAxXOvVXxZz']; // DateTimePatternToken.type
    const tokens = [];
    let isEscapedText = false;
    let isPrevSingleQuote = false;
    [...value].forEach((char) => {
        // tokenValue is defined if it is a known token character.
        const tokenValue = tokenValues.indexOf(char) >= 0 ? char : undefined;
        let isCharText = false;
        // Set single quoted mode
        if ((tokenValue !== undefined || char !== "'") && isPrevSingleQuote) {
            isEscapedText = !isEscapedText;
        }
        // Process
        if (tokenValue !== undefined && !isEscapedText) {
            if (tokens.length > 0 && tokens[tokens.length - 1].type === tokenValue) {
                // Current character is same as previous token. extending token length
                let tokenLength = tokens[tokens.length - 1].length;
                tokenLength = tokenLength === undefined ? 1 : tokenLength + 1;
                tokens[tokens.length - 1].length = tokenLength;
            }
            else if (tokenValue !== undefined) {
                // Current character is a known token
                tokens.push({
                    // @ts-ignore
                    type: tokenValue,
                    length: 1,
                });
            }
            isPrevSingleQuote = false;
        }
        else if (char === "'" && !isPrevSingleQuote) {
            isPrevSingleQuote = true;
        }
        else if (char === "'" && isPrevSingleQuote) {
            // Treat two single quotes as one single quote text
            isCharText = true;
            isPrevSingleQuote = false; // Consume current single quote
        }
        else {
            // Treat others as text
            isCharText = true;
            isPrevSingleQuote = false; // Consumed current single quote
        }
        if (isCharText) {
            // Add as text token
            // Extend last token if it is a text token
            if (tokens.length > 0 && tokens[tokens.length - 1].type === undefined) {
                // Previous token is text, extending token text
                let tokenText = tokens[tokens.length - 1].text;
                tokenText = tokenText === undefined ? char : tokenText + char;
                tokens[tokens.length - 1].text = tokenText;
            }
            else {
                // Previous token is not text, creating new text token
                tokens.push({
                    text: char,
                });
            }
        }
    });
    return tokens;
}
/**
 * Gets symbols for given CLDR date time format token from CLDR locale data.
 *
 * @param token CLDR date time format token
 * @param calendarData Locale data for calendar
 * @returns Map of symbols from locale data for given token. e.g. {'0':'january','1':'february',...}
 */
function getSymbols(token, calendarData) {
    switch (token) {
        case 'a':
        case 'aa':
        case 'aaa':
            return calendarData.dayPeriods.format.abbreviated;
        case 'aaaa':
            return calendarData.dayPeriods.format.wide;
        case 'aaaaa':
            return calendarData.dayPeriods.format.narrow;
        case 'G':
            return calendarData.eras.eraAbbr;
        case 'GGGG':
            return calendarData.eras.eraNames;
        case 'GGGGG':
            return calendarData.eras.eraNarrow;
        case 'MMM':
            return calendarData.months.format.abbreviated;
        case 'MMMM':
            return calendarData.months.format.wide;
        case 'MMMMM':
            return calendarData.months.format.narrow;
        case 'EEEE':
            return calendarData.days.format.wide;
        case 'EEEEE':
            return calendarData.days.format.narrow;
        case 'EEEEEE':
            return calendarData.days.format.abbreviated;
        default:
            return {};
    }
}
/**
 * Gets the token type for CLDR date time format token, whether it is numeric, specific digit numeric, or string
 *
 * @param value CLDR date time format token
 * @returns -1 if token is not numeric, 0 if token is of arbitrary digits, >= 1 if token is of specific digit
 */
function getTokenDigits(token) {
    switch (token.type) {
        case 'y': // Year
        case 'd': // DayOfMonth
        case 'K': // Hour0011
        case 'H': // Hour0023
        case 'h': // Hour0112
        case 'k': // Hour0124
        case 'm': // Minute
        case 's': // Second
        case 'S': // SecondFractional
        case 'A': // MilliSecond
        // eslint-disable-next-line no-fallthrough
        case 'Q': // Quarter
            return token.length === 2 ? 2 : 0;
        case 'M': // Month
        case 'e': // WeekDayLocal
        case 'c': // WeekDayLocalStandalone
            switch (token.length) {
                case 1:
                    return 0;
                case 2:
                    return 2;
                default:
                    return -1;
            }
    }
    return -1;
}
/** Cache regex */
const regexps = new Map();
/**
 * Generates the expression object that contains regex and tokens used on the regex groups based on given pattern and locale data.
 *
 * @param pattern CLDR date time format pattern
 * @param digits Used digits
 * @param calData Locale data for calendar
 * @returns DateTimePattenExpression
 */
function getExpression$1(pattern, digits, calData) {
    const tokens = tokenizeDateTimePattern(pattern);
    const groups = [];
    const digitsRange = getDigitsRegexPattern(digits);
    let exprValue = '^[\\s]*'; // trim leading whitespace
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token.text !== undefined && token.text !== '') {
            // text
            exprValue += '(' + escapeRegex(token.text) + ')';
            groups.push(token);
        }
        else if (token.type !== undefined) {
            const tokenString = token.type.repeat(token.length);
            const digits = getTokenDigits(token);
            if (digits === -1) {
                if (tokenString === 'z') {
                    // time zone is free text w/o whitespace
                    exprValue += '([^\\s]+)';
                }
                else {
                    // non-numeric symbols
                    const symbols = getSymbols(tokenString, calData);
                    exprValue +=
                        '(' +
                            Object.keys(symbols)
                                .map((k) => escapeRegex(symbols[k]))
                                .join('|') +
                            ')';
                }
                groups.push(token);
            }
            else if (digits === 0) {
                // arbitrary digits
                exprValue += '(' + digitsRange + '+)';
                groups.push(token);
            }
            else if (digits > 0) {
                // exact digits
                exprValue += '(' + digitsRange + '{1,' + digits + '})';
                groups.push(token);
            }
        }
    }
    exprValue += '[\\s]*$'; // trim trailing whitespace
    if (!regexps.has(exprValue)) {
        regexps.set(exprValue, new RegExp(exprValue));
    }
    return { regexp: regexps.get(exprValue), groups };
}
/**
 * Utility to return the first key of object property by its value.
 *
 * @param parent Target object
 * @param value Property value to find
 * @returns Property key
 */
function getKeyByValue(parent, value) {
    for (const key in parent) {
        if (Object.prototype.hasOwnProperty.call(parent, key) && parent[key] === value) {
            return key;
        }
    }
    return undefined;
}
/**
 * Utility to return the CLDR locale data key from locale data by its value.
 * e.g. symbol='February', token={type:'M',length:'MMM'} returns '1'
 *
 * @param symbol Value to search
 * @param token CLDR date time format token to search
 * @param data Locale data for calendar
 * @returns CLDR key name
 */
function getKeyFromSymbol(symbol, token, data) {
    const tokenString = token.type.repeat(token.length);
    switch (token.type) {
        case 'G': // Era
            switch (tokenString) {
                case 'G':
                    return getKeyByValue(data.eras.eraNames, symbol);
                case 'GGGG':
                    return getKeyByValue(data.eras.eraNarrow, symbol);
                case 'GGGGG':
                    return getKeyByValue(data.eras.eraAbbr, symbol);
            }
            break;
        case 'M': // Month
        case 'L': // MonthStandalone
            switch (tokenString) {
                case 'MMM': // abbreviated/short
                    return getKeyByValue(data.months.format.abbreviated, symbol);
                case 'MMMM': // wide/long
                    return getKeyByValue(data.months.format.wide, symbol);
                case 'MMMMM': // narrow
                    return getKeyByValue(data.months.format.narrow, symbol);
                case 'LLL': // abbreviated/short
                    return getKeyByValue(data.months['stand-alone'].short, symbol);
                case 'LLLL': // wide/long
                    return getKeyByValue(data.months['stand-alone'].wide, symbol);
                case 'LLLLL': // narrow
                    return getKeyByValue(data.months['stand-alone'].narrow, symbol);
            }
            break;
        case 'a': // PeriodAmPm
        case 'b': // PeriodAmPmNoonMidnight
        case 'B': // PeriodFlexible
            if (token.length >= 1 && token.length <= 3)
                return getKeyByValue(data.dayPeriods.format.abbreviated, symbol);
            if (token.length === 4)
                return getKeyByValue(data.dayPeriods.format.wide, symbol);
            if (token.length === 5)
                return getKeyByValue(data.dayPeriods.format.narrow, symbol);
            break;
        case 'E': // WeekDay:
        case 'e': // WeekDayLocal // Same keys as WeekDay. But index of monday changes per locale
        case 'c': // WeekDayLocalStandalone: // Same keys as WeekDay. But index of monday changes per locale
            switch (tokenString) {
                // abbreviated
                case 'E':
                case 'EE':
                case 'EEE':
                case 'eee':
                case 'ccc':
                    return getKeyByValue(data.days.format.abbreviated, symbol);
                // wide/long
                case 'EEEE':
                case 'eeee':
                case 'cccc':
                    return getKeyByValue(data.days.format.wide, symbol);
                // narrow
                case 'EEEEE':
                case 'eeeee':
                case 'ccccc':
                    return getKeyByValue(data.days.format.abbreviated, symbol);
                // short
                case 'EEEEEE':
                case 'eeeeee':
                case 'cccccc':
                    return getKeyByValue(data.days.format.short, symbol);
            }
            break;
    }
    return undefined;
}

/*
 * CLDR locale specific types
 */
/**
 * Keys used on LocaleDataDatesCalendar for months
 */
const MONTHS_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

/**
 * Date/time parser implementation based on CLDR locale data
 *
 * @author aazizy
 */
class DateTimeParseImpl {
    /**
     * @constructor
     * @param options {DateTimeParseOptions} Options
     */
    constructor(options) {
        // Build data
        const data = {
            commonDigits,
            commonCalendarData,
            defaultCalendar,
            defaultNumberingSystem,
            calendarData,
        };
        // Resolve options
        this.calendarType = options.calendar
            ? intlCalendarToCldr(options.calendar)
            : data.defaultCalendar;
        const numSys = options.numberingSystem
            ? options.numberingSystem
            : data.defaultNumberingSystem;
        const timeZone = options.timeZone ? options.timeZone : undefined;
        options.numberingSystem = numSys;
        options.timeZone = timeZone;
        this.options = options;
        this.digits = data.commonDigits[numSys];
        this.commonCalendarData = data.commonCalendarData[this.calendarType];
        this.calendarData = data.calendarData[this.calendarType];
        // Generating expression here becuse we want to do this only once.
        this.expr = getExpression$1(this.options.pattern, this.digits, this.calendarData);
    }
    /**
     * {@inheritdoc}
     */
    parse(value) {
        const matches = value.match(this.expr.regexp);
        if (!matches || matches.length <= this.expr.groups.length) {
            throw new Error("Invalid date: '" + value + "' for pattern: '" + this.options.pattern + "'");
        }
        const cal = new Calendar(this.options.timeZone);
        cal.clear();
        let era;
        let dayPeriod;
        this.expr.groups.forEach((group, groupIndex) => {
            if (group.type === undefined) {
                // Skip text (separators, space etc)
                return;
            }
            const match = matches[groupIndex + 1];
            if (getTokenDigits(group) >= 0) {
                // Parse digits
                // This is lenient parsing right now.
                // We should throw exception for strict parsing, if digits are not in range.
                // e.g.
                // 'K' should validate against 0 <= cal.hour && cal.hour <= 11
                // 'h' should validate against 1 <= cal.hour && cal.hour <= 12
                switch (group.type) {
                    case 'y': // Year
                        cal.year = parseDigits(match, this.digits);
                        break;
                    case 'M': // Month
                        cal.month = parseDigits(match, this.digits);
                        break;
                    case 'd': // DayOfMonth
                        cal.day = parseDigits(match, this.digits);
                        break;
                    case 'K': // Hour0011
                        cal.hour = parseDigits(match, this.digits);
                        break;
                    case 'H': // Hour0023
                        cal.hour = parseDigits(match, this.digits);
                        break;
                    case 'h': // Hour0112
                        cal.hour = parseDigits(match, this.digits);
                        break;
                    case 'k': // Hour0124
                        cal.hour = parseDigits(match, this.digits);
                        break;
                    case 'm': // Minute
                        cal.minute = parseDigits(match, this.digits);
                        break;
                    case 's': // Second
                        cal.second = parseDigits(match, this.digits);
                        break;
                    case 'A': // MilliSecond
                        cal.millisecond = parseDigits(match, this.digits);
                        break;
                }
            }
            else {
                // Parse symbols
                const key = getKeyFromSymbol(match, group, this.calendarData);
                if (key) {
                    switch (group.type) {
                        case 'G': // Era
                            era = parseInt(key, 10);
                            break;
                        case 'M': // Month
                        case 'L': // MonthStandalone
                            cal.month = MONTHS_KEYS.indexOf(key) + 1; // Calendar month is one indexed
                            break;
                        case 'a': // PeriodAmPm
                        case 'b': // PeriodAmPmNoonMidnight
                        case 'B': // PeriodFlexible
                            dayPeriod = key;
                            break;
                    }
                }
            }
        });
        // Adjust year
        if (era !== undefined && era >= 0) {
            const adjustedYear = getGregorianYear(era, cal.year, cal.month, cal.day, this.calendarType, this.commonCalendarData);
            if (adjustedYear !== undefined)
                cal.year = adjustedYear;
        }
        // Adjust hours based period
        if (dayPeriod !== undefined) {
            switch (dayPeriod) {
                case 'am':
                case 'morning1':
                case 'morning2':
                    // NOOP
                    break;
                case 'pm':
                case 'afternoon1':
                case 'afternoon2':
                case 'evening1':
                case 'night1':
                    if (cal.hour >= 0 && cal.hour < 12)
                        cal.hour += 12;
                    break;
                case 'midnight':
                    if (cal.hour === 12)
                        cal.hour = 0;
                    break;
            }
        }
        return cal.getDate();
    }
}

const cldrParserCache = new Cache();
/**
 * Clears the cache
 */
function clearDateTimeCLDRParserCache() {
    cldrParserCache.clear();
}
/**
 * Instantiate or returns a cached value of a CLDR-based date time parser, instantiated with given a parser options.
 *
 * @param options {DateTimeParseOptions} Parser options
 * @returns {DateTimeParse} Parser instance
 */
function getDateTimeCLDRParser(options) {
    if (!cldrParserCache.has(options)) {
        cldrParserCache.set(options, new DateTimeParseImpl(options));
    }
    return cldrParserCache.get(options);
}

const intlRelativeTimeFormatCache = new Map();
/**
 * Clears the cache
 */
function clearRelativeTimeFormatCache() {
    intlRelativeTimeFormatCache.clear();
}
/**
 * Instantiate or returns a cached value of {@see Intl.RelativeTimeFormat}, instantiated with given options.
 *
 * @param options {Intl.RelativeTimeFormatOptions} Formatter options
 * @returns {Intl.RelativeTimeFormat} Formatter instance
 */
function getRelativeTimeFormat(locale = 'en-US', options = {}) {
    if (!intlRelativeTimeFormatCache.has(locale)) {
        intlRelativeTimeFormatCache.set(locale, new Cache());
    }
    if (!intlRelativeTimeFormatCache.get(locale).has(options)) {
        intlRelativeTimeFormatCache
            .get(locale)
            .set(options, new Intl.RelativeTimeFormat(locale, options));
    }
    return intlRelativeTimeFormatCache.get(locale).get(options);
}

const numberFormatCache = new Map();
/**
 * Clears the cache
 */
function clearNumberFormatCache() {
    numberFormatCache.clear();
}
/**
 * Instantiate or returns a cached value of {@see Intl.NumberFormat}, instantiated with given options.
 *
 * @param locale {string} Locale
 * @param options {Intl.NumberFornatOptions} Formatter options
 * @returns {Intl.NumberFormat} Formatter instance
 */
function getNumberFormat(locale = 'en-US', options = {}) {
    if (!numberFormatCache.has(locale)) {
        numberFormatCache.set(locale, new Cache());
    }
    if (!numberFormatCache.get(locale).has(options)) {
        numberFormatCache.get(locale).set(options, new Intl.NumberFormat(locale, options));
    }
    return numberFormatCache.get(locale).get(options);
}

/**
 * Calls getExpression and returns either only a positive expression, or a positive and negative expression if the pattern specifies different patterns for negative values
 *
 * @param pattern {string} Number pattern as used on CLDR
 * @param isNegative {boolean} If this pattern is for negative value. Defaults to false
 * @param digits {string} String of 10 characters used as digits. e.g. "0123456789" for latm numbering system
 * @param symbols {LocaleDataNumberSymbol} Symbols used in number pattern. See LocaleDataNumberSymbol
 * @param currencySymbol {string} Currency symbol used. e.g. "$"
 * @returns {NumberParseExpressions} A map value of positive and/or negative expression
 */
function getExpressions(pattern, digits, symbols, currencySymbol, lenient) {
    const patterns = pattern.split(';');
    if (patterns.length >= 2) {
        return {
            positive: getExpression(patterns[0], false, digits, symbols, currencySymbol, lenient),
            negative: getExpression(patterns[1], true, digits, symbols, currencySymbol, lenient),
        };
    }
    return {
        positive: getExpression(pattern, false, digits, symbols, currencySymbol, lenient),
    };
}
/**
 * Given a pattern and locale data, generates the regular expression and its matching group definitions, to be used when parsing a number string value.
 *
 * @param pattern {string} Number pattern as used on CLDR
 * @param isNegative {boolean} If this pattern is for negative value. Defaults to false
 * @param digits {string} String of 10 characters used as digits. e.g. "0123456789" for latm numbering system
 * @param symbols {LocaleDataNumberSymbol} Symbols used in number pattern. See LocaleDataNumberSymbol
 * @param currencySymbol {string} Currency symbol used. e.g. "$"
 * @returns {NumberParseExpression} Generate expression and its matching group definition for parsing given number pattern
 */
function getExpression(pattern, isNegative = false, digits, symbols, currencySymbol, lenient) {
    const groups = [];
    // Parse pattern
    let fractionalZeros = 0; // TODO: Used when min/max digits is implemented
    let integerZeros = 0; // TODO: Used when min/max digits is implemented
    // const exponentialDigits = 0; // TODO: support exponential
    // const exponentialLeadingZeros = 0; // TODO: support exponential
    const integerSeparatorIntervals = []; // Normal: [3], lakh/crore: [3,2]
    // let fractionalSeparatorRepeat = -1; // Normal: 0 // NOTE: This is used for parsing
    const exponentialPosition = pattern.indexOf('E');
    // TODO: parse exponent
    const decimalPattern = exponentialPosition > 0 ? pattern.slice(0, exponentialPosition) : pattern.slice(0);
    const decimalPosition = decimalPattern.indexOf('.');
    const integerPattern = decimalPosition >= 0 ? decimalPattern.slice(0, decimalPosition) : decimalPattern.slice(0);
    let integerSeparatorInterval = 0;
    let integerDigitsStarted = false;
    let hasPlusSign = false;
    let hasMinusSign = false;
    // Read right to left
    const integerPatternChars = [];
    [...integerPattern].forEach((char) => integerPatternChars.push(char));
    integerPatternChars.reverse();
    [...integerPatternChars].forEach((char) => {
        switch (char) {
            case '.':
                // Ignore decimal sign
                break;
            case '+':
                hasPlusSign = true;
                groups.push({ token: 'plusSign' });
                break;
            case '-':
                hasMinusSign = true;
                groups.push({ token: 'minusSign' });
                break;
            case '%':
                groups.push({ token: 'percentSign' });
                break;
            case '¤':
                groups.push({ token: 'currencySign' });
                break;
            case '0':
                integerZeros++;
            // Continue as digits (#)
            // eslint-disable-next-line no-fallthrough
            case '#':
                // this.integerDigits++;
                integerSeparatorInterval++;
                if (!integerDigitsStarted) {
                    groups.push({ token: 'integer' });
                    integerDigitsStarted = true;
                }
                break;
            case ',':
                integerSeparatorIntervals.push(integerSeparatorInterval);
                // integerSeparatorRepeat = integerSeparatorIntervals.length - 1; // repeat the last interval
                integerSeparatorInterval = 0;
                break;
            default:
                groups.push({ token: 'string', value: char });
        }
    });
    groups.reverse();
    if (decimalPosition >= 0) {
        groups.push({ token: 'decimalSign' });
        const fractionalPattern = decimalPattern.slice(decimalPosition);
        let fractionalDigitsStarted = false;
        // Read left to right
        [...fractionalPattern].forEach((char) => {
            switch (char) {
                case '.':
                    // Ignore decimal sign
                    break;
                case '+':
                    hasPlusSign = true;
                    groups.push({ token: 'plusSign' });
                    break;
                case '-':
                    hasMinusSign = true;
                    groups.push({ token: 'minusSign' });
                    break;
                case '%':
                    groups.push({ token: 'percentSign' });
                    break;
                case '¤':
                    groups.push({ token: 'currencySign' });
                    break;
                case '0':
                    fractionalZeros++;
                // Continue as digits (#)
                // eslint-disable-next-line no-fallthrough
                case '#':
                    if (!fractionalDigitsStarted) {
                        groups.push({ token: 'fraction' });
                        fractionalDigitsStarted = true;
                    }
                    break;
                case ',':
                    break;
                default:
                    groups.push({ token: 'string', value: char });
            }
        });
    }
    // Generate expression
    let exprValue = '';
    for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        switch (group.token) {
            case 'integer':
                // Integer part must always has at least one digit (The least is 0)
                exprValue +=
                    '(' +
                        getDigitsRegexPattern(digits, integerSeparatorIntervals.length > 0 ? symbols.group : '') +
                        '+)';
                break;
            case 'fraction':
                // Fractional part is optional if lenient, or min fractional digits is 0
                exprValue +=
                    '(' +
                        getDigitsRegexPattern(digits, integerSeparatorIntervals.length > 0 ? symbols.group : '') +
                        '+)';
                if (lenient || (decimalPosition > 0 && fractionalZeros <= 0)) {
                    exprValue += '?';
                }
                break;
            case 'decimalSign':
                // Decimal sign is optional if lenient, or if min fractional digits is 0 (fractional is optional)
                exprValue += '(' + escapeRegex(symbols.decimal) + ')';
                if (lenient || (decimalPosition > 0 && fractionalZeros <= 0)) {
                    exprValue += '?';
                }
                break;
            case 'plusSign':
                // Optional
                exprValue += '(' + escapeRegex(symbols.plusSign) + ')?';
                break;
            case 'minusSign':
                // Optional
                exprValue += '(' + escapeRegex(symbols.minusSign) + ')?';
                break;
            case 'percentSign':
                // Optional
                exprValue += '(' + escapeRegex(symbols.percentSign) + ')?';
                break;
            case 'currencySign':
                // Optional
                exprValue += '(' + escapeRegex(currencySymbol) + ')?';
                break;
            case 'string':
                if (group.value !== undefined) {
                    // Group to \s if value is all whitespace
                    if (/^\s+$/.test(group.value)) {
                        exprValue += '(\\s+)' + (lenient ? '?' : '');
                    }
                    else {
                        exprValue += '(' + escapeRegex(group.value) + ')';
                    }
                }
                break;
        }
    }
    // Prepend optional plus/minus sign if not available in pattern
    if (!isNegative) {
        if (!hasPlusSign && !hasMinusSign) {
            exprValue =
                '(' +
                    escapeRegex(symbols.plusSign) +
                    '|' +
                    escapeRegex(symbols.minusSign) +
                    ')?' +
                    exprValue;
            groups.unshift({ token: 'plusOrMinusSign' });
        }
        else if (!hasPlusSign) {
            exprValue = '(' + escapeRegex(symbols.plusSign) + ')?' + exprValue;
            groups.unshift({ token: 'plusSign' });
        }
        else if (!hasMinusSign) {
            exprValue = '(' + escapeRegex(symbols.minusSign) + ')?' + exprValue;
            groups.unshift({ token: 'minusSign' });
        }
    }
    const expr = new RegExp(exprValue);
    return {
        expr,
        groups,
        isNegative,
        minIntegerDigits: integerZeros,
        minFractionalDigits: fractionalZeros,
    };
}
/**
 *
 * @param value {string} String value to parse
 * @param useNegativeExpr {boolean} Use negativeExpr to parse this value instead of the default positiveExpr
 * @param positiveExpr {NumberParseExpression} Expression to use to parse this value for positive values
 * @param negativeExpr {NumberParseExpression} Expression to use to parse this value for negative values
 * @param digits {string} String of 10 characters used as digits. e.g. "0123456789" for latm numbering system
 * @param symbols {LocaleDataNumberSymbol} Symbols used in number pattern
 */
function parseNumber(value, useNegativeExpr = false, positiveExpr, negativeExpr, digits, symbols) {
    // Parse with negative expression first if available and return if value is valid
    if (!useNegativeExpr && negativeExpr) {
        const result = parseNumber(value, true, positiveExpr, negativeExpr, digits, symbols);
        if (!isNaN(result))
            return result;
    }
    // Parse using provided negative expression if requested
    const expr = useNegativeExpr && negativeExpr ? negativeExpr : positiveExpr;
    const matches = value.match(expr.expr);
    if (!matches) {
        return NaN;
    }
    let hasMinusSign = false;
    let hasPlusSign = false;
    let isPercentPattern = false;
    let integerPart = '';
    let fractionPart = '';
    const groupRegex = new RegExp(escapeRegex(symbols.group), 'g');
    for (let i = 0; i < expr.groups.length; i++) {
        const group = expr.groups[i];
        isPercentPattern = isPercentPattern || group.token === 'percentSign';
        const match = matches[i + 1];
        if (!match)
            continue;
        switch (group.token) {
            case 'integer':
                integerPart += parseDigits(match.replace(groupRegex, ''), digits);
                break;
            case 'fraction':
                fractionPart += parseDigits(match.replace(groupRegex, ''), digits);
                break;
            case 'plusSign':
                hasPlusSign = true;
                break;
            case 'minusSign':
                hasMinusSign = true;
                break;
            case 'plusOrMinusSign':
                switch (match) {
                    case symbols.plusSign:
                        hasPlusSign = true;
                        break;
                    case symbols.minusSign:
                        hasMinusSign = true;
                        break;
                }
                break;
        }
    }
    // Build number
    if (hasMinusSign && hasPlusSign) {
        throw new Error('String has both plus and minus sign');
    }
    let result = NaN;
    // Remove leading zeros on integer
    integerPart.replace(/\b0+\B/, '');
    if (isPercentPattern) {
        // Shift 2 digits to the right (divide by 100) if pattern contains percent sign
        fractionPart = integerPart.slice(-2).padStart(2, '0') + fractionPart;
        integerPart = integerPart.slice(0, -2).padStart(1, '0');
        let num = (hasMinusSign ? '-' : '') + integerPart;
        if (fractionPart !== '') {
            num += '.' + fractionPart;
        }
        result = Number.parseFloat(num);
    }
    else {
        let num = (hasMinusSign ? '-' : '') + integerPart;
        if (expr.minFractionalDigits === undefined ||
            (expr.minFractionalDigits !== undefined &&
                expr.minFractionalDigits <= 0 &&
                fractionPart === '')) {
            // Treat as integer if fraction is optional
            result = Number.parseInt(num);
        }
        else {
            if (fractionPart !== '') {
                num += '.' + fractionPart;
            }
            result = Number.parseFloat(num);
        }
    }
    // Negate result if negative expression is used
    return useNegativeExpr && negativeExpr ? -result : result;
}
/**
 * Number parser implementation
 *
 * @author aazizy
 */
class NumberParseImpl {
    /**
     * @constructor
     * @param options {NumberParseOptions} Options used for this parser instance
     */
    constructor(options) {
        // Build data
        const data = {
            commonDigits,
            defaultNumberingSystem,
            currencySymbol,
            symbols: {
                decimal: decimalSeparator,
                group: groupingSeparator,
                percentSign: percentSign,
                plusSign: plusSign,
                minusSign: minusSign,
                exponential: exponentialSign,
                superScriptingExponent: superscriptingExponentSign,
                perMille: perMilleSign,
                infinity: infinity,
                nan: nan,
            },
        };
        // Resolve options
        options.numberingSystem = options.numberingSystem
            ? options.numberingSystem
            : data.defaultNumberingSystem;
        this.options = options;
        this.digits = data.commonDigits[options.numberingSystem];
        this.symbols = data.symbols;
        this.currencySymbol = data.currencySymbol;
        this.lenient = !(options.lenient === false); // Default is true
        // Generating expression here becuse we want to do this only once.
        const exprs = getExpressions(this.options.pattern, this.digits, this.symbols, this.currencySymbol, this.lenient);
        this.positiveExpr = exprs.positive;
        this.negativeExpr = exprs.negative;
    }
    /**
     * @inheritdoc
     */
    parse(value) {
        return parseNumber(value, true, this.positiveExpr, this.negativeExpr, this.digits, this.symbols);
    }
}

const NumberParseCache = new Cache();
/**
 * Clears the cache
 */
function clearNumberParserCache() {
    NumberParseCache.clear();
}
/**
 * Instantiate or returns a cached value of {@see NumberParse}, instantiated with given options.
 *
 * @param options {NumberParseOptions} Parser options
 * @returns {NumberParse} Parser instance
 */
function getNumberParser(options) {
    if (!NumberParseCache.has(options)) {
        NumberParseCache.set(options, new NumberParseImpl(options));
    }
    return NumberParseCache.get(options);
}

/**
 * Regular expression for parsing ISO-8601 datetime string.
 *
 * RegExp is thread safe so we can reuse this to match across instances.
 *
 * Please group indices accordingly if expression is updated.
 *
 * Ref https://en.wikipedia.org/wiki/ISO_8601
 */
const EXPR = /^[\s]*(((-|\+)?([0-9]{4})[-]?|--)(([0-9]{2})|([0-9]{2})[-]?([0-9]{2})|(W([0-9]{2})([-]?([0-9]))?)|[-]?([0-9]{3})))(T([0-9]{2})([:]?([0-9]{2})([:]?([0-9]{2})(\.([0-9]{3}))?)?)?(Z|(-|\+)([0-9]{2})([:]?([0-9]{2})?)?)?)?[\s]*$/;
/** (full string) ((-|+)yyyy-|--)(MM|MM-dd|Www-E|DDD)'T'hh:mm:ss.SSS('Z'|(-|+)xx:yy) */
/** (date part) ((-|+)yyyy-|--)(MM|MM-dd|Www-E|DDD) */
const INDEX_DATE = 1;
/** (year part) (-|+)yyyy-|--) */
const INDEX_YEAR_OR_NONE = INDEX_DATE + 1;
/** (-|+)? */
const INDEX_YEAR_SIGN = INDEX_YEAR_OR_NONE + 1;
/** yyyy */
const INDEX_YEAR = INDEX_YEAR_OR_NONE + 2;
/** (MM|MM-dd|Www-E|MM-dd) */
const INDEX_MONTH_MONTHDATE_WEEK_ORDINAL = INDEX_YEAR + 1;
/** MM */
const INDEX_MONTH = INDEX_MONTH_MONTHDATE_WEEK_ORDINAL + 1;
/** MM-dd */
const INDEX_MONTHDATE = INDEX_MONTH_MONTHDATE_WEEK_ORDINAL + 2;
/** (week part) Www-E */
const INDEX_WEEK = INDEX_MONTH_MONTHDATE_WEEK_ORDINAL + 4;
/** (ordinal) DDD */
const INDEX_ORDINAL = INDEX_MONTH_MONTHDATE_WEEK_ORDINAL + 8;
/** (time part) 'T'hh:mm:ss.SSS('Z'|(-|+)xx:yy) */
const INDEX_TIME = INDEX_MONTH_MONTHDATE_WEEK_ORDINAL + 9;
/** :mm:ss.SSS */
const INDEX_MINUTE = INDEX_TIME + 2;
/** :ss.SSS */
const INDEX_SECOND = INDEX_TIME + 4;
/** .SSS, (millisecond must be prefixed by a period, even on abbreviated version) */
const INDEX_MILLISECOND = INDEX_TIME + 6;
/** (timezone part) 'Z'|(-|+)xx:yy */
const INDEX_TZ = INDEX_TIME + 8;
/** :yy */
const INDEX_TZ_MINUTE = INDEX_TIME + 11;
const TIME_ONLY_EXPR = /^[\s]*(([0-9]{2})([:]?([0-9]{2})([:]?([0-9]{2})(\.([0-9]{3}))?)?)?(Z|(-|\+)([0-9]{2})([:]?([0-9]{2})?)?)?)[\s]*$/;
const TIME_ONLY_INDEX_TIME = 1;
const TIME_ONLY_INDEX_MINUTE = TIME_ONLY_INDEX_TIME + 2;
const TIME_ONLY_INDEX_SECOND = TIME_ONLY_INDEX_TIME + 4;
const TIME_ONLY_INDEX_MILLISECOND = TIME_ONLY_INDEX_TIME + 6;
const TIME_ONLY_INDEX_TZ = TIME_ONLY_INDEX_TIME + 8;
const TIME_ONLY_INDEX_TZ_MINUTE = TIME_ONLY_INDEX_TIME + 11;
/**
 * Parse an ISO-8601 datetime string representation to a Date object, or throw on unparseable value.
 *
 * This parser adheres to ISO-8601:2019, where the time separator 'T' is required, and full date part is required, and minute/second/millisecond is optional.
 *
 * Time defaults to 00:00:00.000Z if not specified.
 *
 * Timezone defaults to UTC if not specified.
 *
 * This parser tries to comply with ISO 8601:2004, which implies not supporting some of previously defined representations, such as YYMMDD, --MMDD
 *
 * Provides a more consistent cross-platform parsing for ISO-8601 (only) date strings
 * but behavior is different on each implementation and not recommended, as noted here:
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date#Timestamp_string
 *
 * @param value {string} Value to parse
 * @returns {Date} Date instance
 */
function parseDateTimeIsoString(value) {
    if (value && EXPR.test(value)) {
        return parseDateTimeString(value);
    }
    else if (value && TIME_ONLY_EXPR.test(value)) {
        return parseTimeOnlyString(value);
    }
    throw new Error("Unparseable date '" + value + "'");
}
function parseTimeOnlyString(value) {
    const matches = value.match(TIME_ONLY_EXPR);
    if (matches) {
        // Time parts
        let hour = 0;
        let minute = 0;
        let second = 0;
        let millisecond = 0;
        if (matches[TIME_ONLY_INDEX_TIME] !== undefined) {
            hour = Number(matches[TIME_ONLY_INDEX_TIME + 1]); // hh : hour part is required
            if (matches[TIME_ONLY_INDEX_MINUTE]) {
                minute = Number(matches[TIME_ONLY_INDEX_MINUTE + 1]); // mm : minute part is optional
            }
            if (matches[TIME_ONLY_INDEX_SECOND] !== undefined) {
                second = Number(matches[TIME_ONLY_INDEX_SECOND + 1]); // ss : second part is optional
            }
            if (matches[TIME_ONLY_INDEX_MILLISECOND] !== undefined) {
                millisecond = Number(matches[TIME_ONLY_INDEX_MILLISECOND + 1]); // SSS : millisecond part is optional
                // period on millisecond is required on both basic and extended format
            }
            // matches[INDEX_TZ] examples: 'Z', '+09:00', '-1100', '+09', '-11'
            if (matches[TIME_ONLY_INDEX_TZ] !== undefined) {
                // Only adjust offset if this is not UTC
                if (matches[TIME_ONLY_INDEX_TZ] !== 'Z') {
                    let offset = Number(matches[TIME_ONLY_INDEX_TZ + 2]) * 60; // offset hour part is required for non 'Z' offset
                    if (matches[TIME_ONLY_INDEX_TZ_MINUTE] !== undefined) {
                        // offset minute part is optional
                        offset += Number(matches[TIME_ONLY_INDEX_TZ_MINUTE + 1]);
                    }
                    if (matches[TIME_ONLY_INDEX_TZ + 1] === '+') {
                        // plus/minus is required for non 'Z' offset
                        // If offset is positive, substract offset from minutes
                        // e.g. 11am in +09:00 is 2am in UTC (11:00 - 09:00)
                        offset = -offset;
                    }
                    minute += offset;
                }
            }
        }
        const date = new Date();
        // Date is instantiated with runtime timezone offset.
        // We use Date.UTC to generate a timestamp and use that to instantiate the Date instance.
        const timestamp = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hour, minute, second, millisecond);
        const parsedDate = new Date(timestamp);
        return parsedDate;
    }
    throw new Error("Unparseable date '" + value + "'");
}
function parseDateTimeString(value) {
    const matches = value.match(EXPR);
    if (matches) {
        // Date/time parts in UTC
        /** This will stay undefined for  --MM-dd and --MMdd representation */
        let year;
        let isLeapYear;
        /** Only a full date can be combined with time */
        let isFullDate = true;
        let isDateExtendedFormat = false;
        if (matches[INDEX_YEAR]) {
            year = Number(matches[INDEX_YEAR]); // yyyy : year part
            if (matches[INDEX_YEAR_SIGN] && matches[INDEX_YEAR_SIGN] === '-') {
                year = -year;
            }
            isDateExtendedFormat =
                isDateExtendedFormat || matches[INDEX_YEAR_OR_NONE].endsWith('-');
        }
        let month = 1; // Defaults to Jan 1
        let day = 1; // Defaults to Jan 1
        if (year !== undefined && matches[INDEX_MONTH_MONTHDATE_WEEK_ORDINAL]) {
            isLeapYear = new Date(Date.UTC(year, 1, 29, 0, 0, 0, 0)).getUTCDate() === 29;
            isDateExtendedFormat =
                isDateExtendedFormat ||
                    matches[INDEX_MONTH_MONTHDATE_WEEK_ORDINAL].indexOf('-') >= 0;
            if (matches[INDEX_MONTH]) {
                // Only extended form YYYY-MM is allowed, not YYYYMM
                if (!matches[INDEX_YEAR_OR_NONE].endsWith('-')) {
                    throw new Error("Unparseable date '" + value + "'");
                }
                // Calendar date, with date omitted
                month = Number(matches[INDEX_MONTH]); // MM : month part
                day = 1;
                isFullDate = false;
            }
            else if (matches[INDEX_MONTHDATE]) {
                // Calendar date
                month = Number(matches[INDEX_MONTHDATE]); // MM : month part
                day = Number(matches[INDEX_MONTHDATE + 1]); // dd : date part
            }
            else if (matches[INDEX_WEEK]) {
                const week = Number(matches[INDEX_WEEK + 1]); // ww : week part
                let dayOfWeek = 1; // 1: monday, 7: sunday
                if (matches[INDEX_WEEK + 2]) {
                    dayOfWeek = Number(matches[INDEX_WEEK + 3]); // E : day of week part is optional
                }
                else {
                    isFullDate = false;
                }
                // Validate week/dayOfWeek
                if (!isValidWeek(week) || !isValidDayOfWeek(dayOfWeek)) {
                    throw new Error("Unparseable date '" + value + "'");
                }
                // Calculate month and date from Www-E
                const jan1 = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
                // Date#getDay|getUTCDay returns 0: sunday, 6: saturday
                const jan1Day = jan1.getUTCDay();
                // If 1 January is on a Monday, Tuesday, Wednesday or Thursday, it is in week 01.
                // Else 1 January is on last week of previous year (week 52 or 53)
                // So, to summarize (jan1Day: W01-1 date) is:
                // 1: Jan 1
                // 2: Dec 31
                // 3: Dec 30
                // 4: Dec 29
                // 5: Jan 4
                // 6: Jan 3
                // 0: Jan 2
                // Date constructor allows overflow of date and correctly recalculate the upper parts (month, year)
                // Source is kept verbose. This is basically doing this:
                // const weekDate = (jan1Day === 2 || jan1Day === 3 || jan1Day === 4) ? //
                //     new Date(Date.UTC(year - 1, 11, 7 * (week - 1) + (33 - jan1Day) + (dayOfWeek - 1), 0, 0, 0, 0)) : //
                //     new Date(Date.UTC(year, 0, 7 * (week - 1) + ((9 - jan1Day) % 7) + (dayOfWeek - 1), 0, 0, 0, 0));
                const week1Day1Year = jan1Day === 2 || jan1Day === 3 || jan1Day === 4 ? year - 1 : year;
                const week1Day1Month = jan1Day === 2 || jan1Day === 3 || jan1Day === 4 ? 12 : 1;
                const week1Day1Date = jan1Day === 2 || jan1Day === 3 || jan1Day === 4
                    ? 33 - jan1Day
                    : (9 - jan1Day) % 7;
                // Date constructor allows overflow of date and correctly recalculate the upper parts (month, year)
                const weekDate = new Date(Date.UTC(week1Day1Year, week1Day1Month - 1, week1Day1Date + 7 * (week - 1) + (dayOfWeek - 1), 0, 0, 0, 0));
                // Override year, month and date
                year = weekDate.getUTCFullYear();
                month = weekDate.getUTCMonth() + 1;
                day = weekDate.getUTCDate();
            }
            else if (matches[INDEX_ORDINAL]) {
                // Ordinal dates
                // 1: Jan 1, 365|366: Dec 31
                const ordinal = Number(matches[INDEX_ORDINAL]); // DDD : ordinal day part
                // Validate ordinal
                if (!isValidOrdinal(ordinal, isLeapYear)) {
                    throw new Error("Unparseable date '" + value + "'");
                }
                // Date constructor allows overflow of date and correctly recalculate the upper parts (month, year)
                const ordinalDate = new Date(Date.UTC(year, 0, ordinal, 0, 0, 0, 0));
                // Override month and date
                month = ordinalDate.getUTCMonth() + 1;
                day = ordinalDate.getUTCDate();
            }
        }
        else if (year === undefined &&
            matches[INDEX_MONTH_MONTHDATE_WEEK_ORDINAL] &&
            matches[INDEX_MONTHDATE]) {
            // Only --MM-dd and --MMdd representation do not have year defined.
            // We support this pattern by using 2000 as year since it is a leap year (to allow --02-29).
            // We can default lesser significant part (e.g. month, date, hours) and have a sensibly usable value,
            // but, this representation is not suitable for JS Date since the significant part (year) of a calendar date is missing.
            // Calendar date
            year = 2000; // year defaults 2000
            month = Number(matches[INDEX_MONTHDATE]); // MM : month part
            day = Number(matches[INDEX_MONTHDATE + 1]); // dd : date part
            isLeapYear = new Date(Date.UTC(year, 1, 29, 0, 0, 0, 0)).getUTCDate() === 29;
            isFullDate = false;
            isDateExtendedFormat =
                isDateExtendedFormat ||
                    matches[INDEX_MONTH_MONTHDATE_WEEK_ORDINAL].indexOf('-') >= 0;
        }
        else {
            throw new Error("Unparseable date '" + value + "'");
        }
        if (!isValidDate(month, day, isLeapYear)) {
            throw new Error("Unparseable date '" + value + "'");
        }
        // Time parts
        let hour = 0;
        let minute = 0;
        let second = 0;
        let millisecond = 0;
        let isTimeExtendedFormat = false;
        let isHourOnly = true;
        // matches[INDEX_TIME] examples: 'T12:34:56.789+10:00', 'T00:00Z'
        if (matches[INDEX_TIME] !== undefined) {
            if (!isFullDate) {
                throw new Error("Unparseable date '" + value + "'");
            }
            hour = Number(matches[INDEX_TIME + 1]); // hh : hour part is required
            if (matches[INDEX_MINUTE]) {
                minute = Number(matches[INDEX_MINUTE + 1]); // mm : minute part is optional
                isTimeExtendedFormat =
                    isTimeExtendedFormat || matches[INDEX_MINUTE].startsWith(':');
                isHourOnly = false;
            }
            if (matches[INDEX_SECOND] !== undefined) {
                second = Number(matches[INDEX_SECOND + 1]); // ss : second part is optional
                isTimeExtendedFormat =
                    isTimeExtendedFormat || matches[INDEX_SECOND].startsWith(':');
                isHourOnly = false;
            }
            if (matches[INDEX_MILLISECOND] !== undefined) {
                millisecond = Number(matches[INDEX_MILLISECOND + 1]); // SSS : millisecond part is optional
                // period on millisecond is required on both basic and extended format
            }
            // matches[INDEX_TZ] examples: 'Z', '+09:00', '-1100', '+09', '-11'
            if (matches[INDEX_TZ] !== undefined) {
                // Only adjust offset if this is not UTC
                if (matches[INDEX_TZ] !== 'Z') {
                    let offset = Number(matches[INDEX_TZ + 2]) * 60; // offset hour part is required for non 'Z' offset
                    if (matches[INDEX_TZ_MINUTE] !== undefined) {
                        // offset minute part is optional
                        offset += Number(matches[INDEX_TZ_MINUTE + 1]);
                    }
                    if (matches[INDEX_TZ + 1] === '+') {
                        // plus/minus is required for non 'Z' offset
                        // If offset is positive, substract offset from minutes
                        // e.g. 11am in +09:00 is 2am in UTC (11:00 - 09:00)
                        offset = -offset;
                    }
                    minute += offset;
                }
            }
            // Combined date and time must have the same format
            // Hour only is valid, and the same for both basic and extended format
            if (isDateExtendedFormat !== isTimeExtendedFormat && !isHourOnly) {
                throw new Error("Unparseable date '" + value + "'");
            }
        }
        // Date is instantiated with runtime timezone offset.
        // We use Date.UTC to generate a timestamp and use that to instantiate the Date instance.
        const timestamp = Date.UTC(year, month - 1, day, hour, minute, second, millisecond);
        return new Date(timestamp);
    }
    throw new Error("Unparseable date '" + value + "'");
}
/**
 * Parse an ISO-8601 datetime string representation to a Date object, or throw on unparseable value.
 *
 * This parser adheres to ISO-8601:2019, where the time separator 'T' is required, and full date part is required, and minute/second/millisecond is optional.
 *
 * Time defaults to 00:00:00.000Z if not specified.
 *
 * Timezone defaults to UTC if not specified.
 *
 * Only calendar (e.g. 2021-01-07) representation is supported for date part.
 * Week (e.g. 2021-W01-5 for 2021-01-07) or ordinal (e.g. 2021-007 for 2021-01-07) representations are not supported.
 */
class DateTimeIso8601Parse {
    /**
     * Constructor
     *
     * @constructor
     * @param options Options
     */
    constructor() { }
    /**
     * Parse an ISO-8601 datetime string representation to a Date object, or throw on unparseable value.
     * If parser instance constructed with a timeZone option, returned Date instance will be offsetted to that time zone.
     *
     * @param value {string} Value to parse
     * @returns {Date} Date instance
     */
    parse(value) {
        return parseDateTimeIsoString(value);
    }
}

const iso8601Parser = new DateTimeIso8601Parse();
/**
 * Instantiate or returns a cached value of a CLDR-based date time parser, instantiated with given a parser options.
 *
 * @param options {DateTimeIso8601ParseOptions} Parser options
 * @returns {DateTimeParse} Parser instance
 */
function getDateTimeISO8601Parser() {
    return iso8601Parser;
}

/**
 * Localizer
 *
 * @author aazizy
 */
function clearCache() {
    clearDateTimeFormatCache();
    clearDateTimeCLDRParserCache();
    clearRelativeTimeFormatCache();
    clearNumberFormatCache();
    clearNumberParserCache();
}

export { clearCache, getDateTimeCLDRParser, getDateTimeFormat, getDateTimeISO8601Parser, getNumberFormat, getNumberParser, getRelativeTimeFormat };
