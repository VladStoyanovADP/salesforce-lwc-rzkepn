import { api } from 'lwc';
import LightningOverlay from 'lightning/overlay';

export default class OverlayAlert extends LightningOverlay {
    @api header = 'Header';

    @api body = 'Body';

    @api okayText = 'Okay';

    @api cancelText = 'Cancel';

    handleOkay() {
        this.close('okay');
    }

    handleCancel() {
        this.close('cancel');
    }

    handleDismiss() {
        this.close('dismiss');
    }

    hasFocus = false;
    renderedCallback() {
        if (!this.hasFocus) {
            const close = this.template.querySelector('header > button');
            close.focus();
            this.hasFocus = true;
        }
    }
}
