import { LightningElement } from 'lwc';
import ModalDemoFootless from 'modal/demofootless';

export default class ModalFootless extends LightningElement {
    demoResult = 'unset';

    handleDemoModal() {
        ModalDemoFootless.open({
            // LightningModal
            size: 'small',
        }).then((result) => {
            if (result === null) {
                this.demoResult = 'dismiss';
            } else {
                this.demoResult = result;
            }
        });
    }
}
