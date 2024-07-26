import { api, track } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';

export default class LightningBaseComboboxFormattedText extends LightningShadowBaseClass {
    @track _text = '';
    @track hasParts;

    @api
    get text() {
        return this._text;
    }

    set text(value) {
        this.hasParts = Array.isArray(value) && value.length > 0;
        if (this.hasParts) {
            // Generate keys for LWC DOM
            this._text = value.map((part, i) => ({ part, key: i }));
        } else {
            this._text = value;
        }
    }
}
