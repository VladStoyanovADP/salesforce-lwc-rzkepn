import locale from '@salesforce/i18n/locale';
import { api, track } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { normalizeBoolean } from 'lightning/utilsPrivate';
import { addressFormat } from 'lightning/internationalizationLibrary';

const MAP_HOST = 'https://www.google.com/maps?q=';

/**
 * Displays a formatted address with a link to the given location on Google Maps.
 * The link is opened in a new tab.
 * A static map can be displayed with the address for better context.
 */
export default class LightningFormattedAddress extends LightningShadowBaseClass {
    @track
    state = {
        street: '',
        city: '',
        province: '',
        country: '',
        postalCode: '',
        latitude: '',
        longitude: '',
        disabled: false,
    };

    @track href;

    /**
     * The locale of the address. The default value is 'en-US'.
     * @type {string}
     */
    @api locale = locale;

    /**
     * The street detail for the address.
     * @type {string}
     *
     */
    @api
    get street() {
        return this.state.street;
    }
    set street(value) {
        this.state.street = value;
    }

    /**
     * The city detail for the address.
     * @type {string}
     *
     */
    @api
    get city() {
        return this.state.city;
    }
    set city(value) {
        this.state.city = value;
    }

    /**
     * The province detail for the address.
     * @type {string}
     *
     */
    @api
    get province() {
        return this.state.province;
    }
    set province(value) {
        this.state.province = value;
    }

    /**
     * The country detail for the address.
     * @type {string}
     *
     */
    @api
    get country() {
        return this.state.country;
    }
    set country(value) {
        this.state.country = value;
    }

    /**
     * The postal code detail for the address.
     * @type {string}
     *
     */
    @api
    get postalCode() {
        return this.state.postalCode;
    }
    set postalCode(value) {
        this.state.postalCode = value;
    }

    /**
     * The latitude of the location if known. Latitude values must be within -90 and 90.
     * @type {number}
     *
     */
    @api
    get latitude() {
        return this.state.latitude;
    }
    set latitude(value) {
        this.state.latitude = value;
    }

    /**
     * The longitude of the location if known. Longitude values must be within -180 and 180.
     * @type {number}
     *
     */
    @api
    get longitude() {
        return this.state.longitude;
    }
    set longitude(value) {
        this.state.longitude = value;
    }

    /**
     * If present, the address is displayed as plain text and cannot be clicked or focused on.
     * @type {boolean}
     * @default false
     */
    @api
    get disabled() {
        return this.state.disabled;
    }
    set disabled(value) {
        this.state.disabled = normalizeBoolean(value);
    }

    @track _showStaticMap;

    /**
     * Displays a static map of the location using Google Maps. This value defaults to false.
     * @default false
     */
    @api
    get showStaticMap() {
        return this._showStaticMap || false;
    }
    set showStaticMap(value) {
        this._showStaticMap = normalizeBoolean(value);
    }

    /**
     * Simulates a mouse click on the address
     * and navigates to Google Maps on a new tab.
     */
    @api
    click() {
        if (this.addressLink) {
            this.addressLink.click();
        }
    }

    /**
     * Workaround for LWC Issue #1028
     * https://github.com/salesforce/lwc/issues/1028
     *
     * When we have two nested conditional templates wrapping
     * an iteration template, LWC fails to clear the template's content
     */
    get showPlainText() {
        return this.hasValue && this.isPlainText;
    }

    get showMapLink() {
        return this.hasValue && this.isMapLink;
    }

    get isPlainText() {
        return this.disabled;
    }

    get isMapLink() {
        return !this.disabled;
    }

    get hasValue() {
        return !!(
            this.street ||
            this.city ||
            this.province ||
            this.country ||
            this.postalCode
        );
    }

    get address() {
        const [langCode, countryCode] = this.locale.split('-');
        return (
            addressFormat.formatAddressAllFields(langCode, countryCode, {
                address: this.street,
                city: this.city,
                state: this.province,
                country: this.country,
                zipCode: this.postalCode,
            }) || ''
        );
    }

    get addressLines() {
        return this.address.split('\n');
    }

    get mapQuery() {
        const { address, latitude, longitude } = this;
        return latitude && longitude ? `${latitude},${longitude}` : address;
    }

    get internalTabIndex() {
        return this.getAttribute('tabindex');
    }

    get mapUrl() {
        return encodeURI(MAP_HOST) + encodeURIComponent(this.mapQuery);
    }

    get addressLink() {
        return this.template.querySelector('a');
    }
}
