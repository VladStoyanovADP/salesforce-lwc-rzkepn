import { api } from 'lwc';

import LightningOverlay from 'lightning/overlay';
import OverlayAlert from 'overlay/alert';

export default class OverlayDemo extends LightningOverlay {
    @api header = 'Header';

    @api body = 'Body';

    @api options = [];

    handleOptionClick(e) {
        const { target } = e;
        const id = parseInt(target.dataset.id, 10);
        const option = this.options.find((x) => x.id === id);
        OverlayAlert.open({
            header: 'Are you sure?',
            body: `You selected "${option.label}".`,
            okayText: `Yes, ${option.label}`,
        }).then((result) => {
            if (result === 'okay') {
                this.close(parseInt(target.dataset.id, 10));
            }
        });
    }

    handleDismiss() {
        this.close(0);
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
