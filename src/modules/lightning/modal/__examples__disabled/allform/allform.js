import { LightningElement } from 'lwc';
import ModalDemoAllForm from 'modal/demoallform';

export default class ModalAllForm extends LightningElement {
    demoResult = 'unset';

    handleDemoModal() {
        ModalDemoAllForm.open({
            // LightningModal
            size: 'medium',
            // this becomes 'label'
            heading: 'Edit Contact Information',
            description: 'Edit the contact information for Sales Opportunities',
            // ModalDemo
            options: [
                {
                    id: 1,
                    variant: 'neutral',
                    label: 'Close',
                    triggerCancel: true,
                },
                {
                    id: 2,
                    variant: 'neutral',
                    label: 'Disable Close Button',
                    toggleDisableClose: true,
                },
                {
                    id: 3,
                    variant: 'neutral',
                    label: 'Open Next Modal',
                    triggerSecondModal: true,
                },
                {
                    id: 4,
                    variant: 'brand',
                    label: 'Save Data',
                    triggerSubmit: true,
                },
            ],
        }).then((result) => {
            if (result === null) {
                this.demoResult = 'dismiss';
            } else {
                this.demoResult = JSON.stringify(result);
            }
        });
    }
}
