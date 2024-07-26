import { LightningElement } from 'lwc';

import ModalDemo from 'modal/demo';

export default class OverlayBasic extends LightningElement {
    demoResult = 'unset';

    handleDemoModal() {
        ModalDemo.open({
            // LightningModal
            size: 'large',
            // ModalDemo
            header: 'Select an Option',
            body: 'Select an option:',
            options: [
                { id: 1, label: 'Option 1' },
                { id: 2, label: 'Option 2' },
            ],
        }).then((result) => {
            if (result === null) {
                this.demoResult = 'dismiss';
            } else {
                this.demoResult = result;
            }
        });
    }
}
