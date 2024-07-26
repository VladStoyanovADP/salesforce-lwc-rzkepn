import { api } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';

/**
 * Creates a subheader in the list of items in lightning-button-menu.
 */
export default class LightningMenuSubheader extends LightningShadowBaseClass {
    /**
     * The text displayed in the subheader.
     * @type {string}
     */
    @api label;

    connectedCallback() {
        super.connectedCallback();
        this.setAttribute('role', 'presentation');
    }
}
