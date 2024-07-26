import { api, track } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { dateTimeFormat } from 'lightning/internationalizationLibrary';
import {
    normalizeBoolean,
    toDateTimeFormatOptions,
    toFormattedDate,
} from 'lightning/utilsPrivate';

/**
 * Displays formatted date and time.
 */
export default class LightningFormattedDateTime extends LightningShadowBaseClass {
    /**
     * The value to be formatted, which can be a Date object, timestamp, or an ISO8601 formatted string.
     * @type {object}
     *
     */
    @api value;

    /**
     * Specifies how to display the day of the week. Allowed values are narrow, short, or long.
     * @type {string}
     *
     */
    @api weekday;

    /**
     * Allowed values are narrow, short, or long.
     * @type {string}
     *
     */
    @api era;

    /**
     * Allowed values are numeric or 2-digit.
     * @type {string}
     *
     */
    @api year;

    /**
     * Allowed values are 2-digit, numeric, narrow, short, or long.
     * @type {string}
     *
     */
    @api month;

    /**
     * Allowed values are numeric or 2-digit.
     * @type {string}
     *
     */
    @api day;

    /**
     * Allowed values are numeric or 2-digit.
     * @type {string}
     *
     */
    @api hour;

    /**
     * Allowed values are numeric or 2-digit.
     * @type {string}
     *
     */
    @api minute;

    /**
     * Allowed values are numeric or 2-digit.
     * @type {string}
     *
     */
    @api second;

    /**
     * Allowed values are short or long. For example, the Pacific time zone would display as 'PST'
     * if you specify 'short', or 'Pacific Standard Time' if you specify 'long.'
     * @type {string}
     *
     */
    @api timeZoneName;

    /**
     * The time zone for date and time display. Use this attribute only if you want to override the default, which is the time zone
     * set on the user device. Specify a time zone from the IANA time zone database (https://www.iana.org/time-zones). For example, set
     * the value to 'Pacific/Honolulu' to display Hawaii time. The short code UTC is also accepted.
     * @type {string}
     *
     */
    @api timeZone;

    @track _hour12 = false;
    @track _hour12Set = false;

    /**
     * Determines whether time is displayed as 12-hour. If false, time displays as 24-hour. The default setting is determined by the user's locale.
     * Set the value using a variable. If set to any string directly, the component interprets its value as true.
     * @type {boolean}
     *
     */
    @api
    get hour12() {
        return this._hour12;
    }

    set hour12(value) {
        // If hour12 is not explicitly set, or when it's set to undefined, then locale default is used instead.
        if (value === undefined) {
            this._hour12Set = false;
            this._hour12 = value;
        } else {
            this._hour12Set = true;
            this._hour12 = normalizeBoolean(value);
        }
    }

    get formattedValue() {
        return toFormattedDate(this, dateTimeFormat);
    }

    getOptions() {
        return toDateTimeFormatOptions(this);
    }
}
