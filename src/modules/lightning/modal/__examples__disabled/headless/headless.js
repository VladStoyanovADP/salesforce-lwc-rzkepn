import { LightningElement } from 'lwc';
import ModalDemoHeadless from 'modal/demoheadless';

export default class ModalAllChildren extends LightningElement {
    demoResult = 'unset';

    handleDemoModal() {
        ModalDemoHeadless.open({
            // LightningModal
            size: 'small',
            label: 'Modal Header',
            // ModalDemo
            body: 'Select an option:',
            options: [
                { id: 1, variant: 'neutral', label: 'Option 1' },
                { id: 2, variant: 'neutral', label: 'Option 2' },
                { id: 3, variant: 'brand', label: 'Main Option' },
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
