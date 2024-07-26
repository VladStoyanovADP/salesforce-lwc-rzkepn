import { LightningElement } from 'lwc';

import OverlayAlert from 'overlay/alert';
import OverlayDemo from 'overlay/demo';
import OverlayPanel from 'overlay/panel';

export default class OverlayBasic extends LightningElement {
    confirmResult = 'unset';

    handleConfirmModal() {
        OverlayAlert.open({
            header: 'Are you sure?',
            body: 'Click cancel or okay below to get a string result.',
        }).then((result) => {
            this.confirmResult = result;
        });
    }

    confirmAltResult = 'unset';

    handleConfirmAltModal() {
        OverlayAlert.open({
            header: 'Do you like this demo?',
            body: '...',
            okayText: 'Yes',
            cancelText: 'Also Yes',
        }).then((result) => {
            this.confirmAltResult = result;
        });
    }

    demoResult = 'unset';

    handleDemoModal() {
        OverlayDemo.open({
            header: 'Select an Option',
            body: 'From the list below select an item',
            options: [
                { id: 1, label: 'Option 1' },
                { id: 2, label: 'Option 2' },
            ],
        }).then((result) => {
            if (result === 0) {
                this.demoResult = 'dismiss';
            } else {
                this.demoResult = result;
            }
        });
    }

    panelResult = 'unset';

    handlePanel() {
        OverlayPanel.open({
            header: 'Select an Option',
            body: 'From the list below select an item',
        }).then((result) => {
            this.demoResult = result;
        });
    }
}
