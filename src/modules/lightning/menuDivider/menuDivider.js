import { api, track } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet } from 'lightning/utils';
import { normalizeString as normalize } from 'lightning/utilsPrivate';

/**
 * Creates a divider in the list of items for lightning-button-menu.
 */
export default class LightningMenuDivider extends LightningShadowBaseClass {
    @track _variant = 'standard';

    connectedCallback() {
        super.connectedCallback();
        this.setAttribute('role', 'separator');
    }

    /**
     * The variant changes the spacing above and below the divider.
     * Accepted variants include standard and compact. The compact variant
     * decreases the space. This value defaults to standard.
     *
     * @type {string}
     * @default standard
     */
    @api
    get variant() {
        return this._variant;
    }

    set variant(value) {
        this._variant = normalize(value, {
            fallbackValue: 'standard',
            validValues: ['standard', 'compact'],
        });
    }

    get computedClass() {
        return classSet({
            'slds-has-divider_top-space': this.variant === 'standard',
            'slds-has-divider_top': this.variant === 'compact',
        }).toString();
    }
}
