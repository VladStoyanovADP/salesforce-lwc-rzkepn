import { api } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { numberFormat } from 'lightning/internationalizationLibrary';
import { toFormattedNumber } from 'lightning/utilsPrivate';

/**
 * Displays formatted numbers for decimals, currency, and percentages.
 */
export default class LightningFormattedNumber extends LightningShadowBaseClass {
    /**
     * The value to be formatted.
     * @type {number}
     * @required
     */
    @api value;

    /**
     * The number formatting style to use. Possible values are decimal, currency,
     * percent, and percent-fixed. This value defaults to decimal.
     * @type {string}
     * @default decimal
     */
    @api formatStyle = 'decimal';

    /**
     * Only used if format-style='currency', this attribute determines which currency is
     * displayed. Possible values are the ISO 4217 currency codes, such as 'USD' for the US dollar.
     * @type {string}
     *
     */
    @api currencyCode;

    /**
     * Determines how currency is displayed. Possible values are symbol, code, and name. This value defaults to symbol.
     * @type {string}
     * @default symbol
     */
    @api currencyDisplayAs = 'symbol';

    /**
     * The minimum number of integer digits that are required. Possible values are from 1 to 21.
     * @type {number}
     *
     */
    @api minimumIntegerDigits;

    /**
     * The minimum number of fraction digits that are required.
     * @type {number}
     *
     */
    @api minimumFractionDigits;

    /**
     * The maximum number of fraction digits that are allowed.
     * @type {number}
     *
     */
    @api maximumFractionDigits;

    /**
     * The minimum number of significant digits that are required. Possible values are from 1 to 21.
     * @type {number}
     *
     */
    @api minimumSignificantDigits;

    /**
     * The maximum number of significant digits that are allowed. Possible values are from 1 to 21.
     * @type {number}
     *
     */
    @api maximumSignificantDigits;

    get formattedNumber() {
        return toFormattedNumber(this, numberFormat);
    }
}

LightningFormattedNumber.interopMap = {
    props: {
        formatStyle: 'style',
    },
};
