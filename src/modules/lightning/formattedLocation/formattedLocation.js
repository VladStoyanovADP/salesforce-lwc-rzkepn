import { api } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { toFormattedLocation } from 'lightning/utilsPrivate';

/**
 * Displays a geolocation in decimal degrees using the format [latitude, longitude].
 */
export default class LightningFormattedLocation extends LightningShadowBaseClass {
    /**
     * The latitude of the geolocation. Latitude values must be within -90 and 90.
     * @type {number}
     * @required
     */
    @api latitude;

    /**
     * The longitude of the geolocation. Longitude values must be within -180 and 180.
     * @type {number}
     * @required
     */
    @api longitude;

    get formattedLocation() {
        return toFormattedLocation(this);
    }
}
