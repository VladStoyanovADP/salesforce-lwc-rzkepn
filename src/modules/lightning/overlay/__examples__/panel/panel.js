import { api } from 'lwc';
import LightningOverlay from 'lightning/overlay';

export default class OverlayPanel extends LightningOverlay {
    @api header = 'Header';

    @api body = 'Body';

    handleDismiss() {
        this.close('dismiss');
    }

    hasFocus = false;
    renderedCallback() {
        if (!this.hasFocus) {
            const close = this.template.querySelector('div > button');
            close.focus();
            this.hasFocus = true;
        }
    }
}
