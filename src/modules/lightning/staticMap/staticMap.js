import lang from '@salesforce/i18n/lang';
import formFactor from '@salesforce/client/formFactor';
import labelTitleWithAddress from '@salesforce/label/LightningMap.titleWithAddress';
import labelTitleWithoutAddress from '@salesforce/label/LightningMap.iframeTitle';
import { api, track } from 'lwc';
import { ratioToScale, calculateSize } from './util';
import {
    registerMessageHandler,
    unregisterMessageHandler,
    createMessage,
    postMessage,
} from 'lightning/messageDispatcher';
import { buildMapSourceUrl } from 'lightning/mapUtils';
import { isEmptyString } from 'lightning/inputUtils';
import { formatLabel } from 'lightning/utils';
import { isCSR } from 'lightning/utilsPrivate';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';

const EVENT_NAME = {
    LOADING_MAP: 'loadingMap',
    STATIC_MAP_LOADED: 'lightning:staticMapLoaded',
};

const i18n = {
    titleWithAddress: labelTitleWithAddress,
    titleWithoutAddress: labelTitleWithoutAddress,
};

export default class LightningStaticMap extends LightningShadowBaseClass {
    @api width;
    @api height;
    @api street;
    @api city;
    @api province;
    @api postalCode;
    @api country;
    @api title;

    _zoom = 14;
    _scale = 1;
    _mapType = 'roadmap';
    _format = 'png';

    apiDomain = `*`;

    @track _mapLoaded = false;

    canRenderIframe = false;

    connectedCallback() {
        if (isCSR) {
            this._dispatchId = registerMessageHandler((event) => {
                this.handleMessage(event);
            });
            this._scale = ratioToScale();
        }
        // If the server did not render content, the iframe can be rendered immediately
        this.canRenderIframe =
            isCSR && !this.template.querySelector('.slds-iframe-container');
    }

    renderedCallback() {
        // The iframe should be rendered after hydration in the CSR context
        this.canRenderIframe = true;
    }

    disconnectedCallback() {
        if (this._dispatchId) {
            unregisterMessageHandler(this._dispatchId);
        }
    }

    @track _latitude;
    @api
    get latitude() {
        return this._latitude;
    }
    set latitude(value) {
        if (value != null && value !== '') {
            this._latitude = parseFloat(value);
        }
    }

    @track _longitude;
    @api
    get longitude() {
        return this._longitude;
    }
    set longitude(value) {
        if (value != null && value !== '') {
            this._longitude = parseFloat(value);
        }
    }

    get size() {
        if (!this._size) {
            this._size = calculateSize(this.width, this.height, formFactor);
        }
        return `${this._size.width}x${this._size.height}`;
    }

    get markers() {
        return `color:red|${this.address}`;
    }

    get mapStyle() {
        if (this._mapLoaded) {
            return 'border: 0px; top: 0; left: 0; right: 0; bottom: 0; position: relative; overflow: hidden; display: inherit';
        }
        return 'display:none';
    }

    get hasValidAddress() {
        return !!(this.province || this.country || this.postalCode);
    }

    get staticMapSrc() {
        if (this.hasValidAddress) {
            return buildMapSourceUrl({
                resource: 'staticMap',
                center: this.address,
                size: this.size,
                zoom: this._zoom,
                scale: this._scale,
                maptype: this._mapType,
                format: this._format,
                markers: this.markers,
                locale: lang,
            });
        }

        return '';
    }

    get latLongString() {
        if (
            this.latitude != null &&
            this.latitude >= -90.0 &&
            this.latitude <= 90.0 &&
            this.longitude != null &&
            this.longitude >= -180.0 &&
            this.longitude <= 180.0
        ) {
            return `${this.latitude},${this.longitude}`;
        }
        return null;
    }

    get addressString() {
        return `${this.street || ''} ${this.city || ''} ${
            this.province || ''
        } ${this.postalCode || ''} ${this.country || ''}`;
    }

    get address() {
        // if latitude/longitude specified use that to avoid expensive Google geo-coding processing
        return this.latLongString || this.addressString;
    }

    /**
     * getter for the i18 constant containing the localized strings
     */
    get i18n() {
        return i18n;
    }

    get mapTitle() {
        if (isEmptyString(this.title)) {
            let titleAddress =
                (this.addressString && this.addressString.trim()) ||
                (this.latLongString && this.latLongString.trim());
            if (isEmptyString(titleAddress)) {
                return this.i18n.titleWithoutAddress;
            }
            return formatLabel(this.i18n.titleWithAddress, titleAddress);
        }
        return this.title;
    }

    handleMessage(data) {
        if (data.event === EVENT_NAME.STATIC_MAP_LOADED) {
            this._mapLoaded = true;
        }
    }

    sendMessage(event, params) {
        if (this._handler) {
            const message = createMessage(
                this._dispatchId,
                event,
                params || {}
            );
            postMessage(this._handler, message, '*');
        }
    }

    handleIframeLoad(event) {
        this._handler = event.detail.callbacks.postToWindow;
        this.sendMessage(EVENT_NAME.LOADING_MAP, {});
    }
}
