import { LightningElement } from 'lwc';
import ModalDemoAll from 'modal/demoall';

export default class ModalAll extends LightningElement {
    demoResult = 'unset';

    handleDemoModal() {
        ModalDemoAll.open({
            // LightningModal
            size: 'small',
            // ModalDemo
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
