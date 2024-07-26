import { LightningElement } from 'lwc';
import ModalDemoAllFormHoriz from 'modal/demoallformhoriz';

// this form is loosely based on SLDS form element blueprint, Horizontal Variant
// https://www.lightningdesignsystem.com/components/form-element/#Horizontal
// sizing utils not in use: https://www.lightningdesignsystem.com/utilities/sizing/

export default class ModalAllFormHoriz extends LightningElement {
    demoResult = 'unset';

    handleDemoModal() {
        ModalDemoAllFormHoriz.open({
            // LightningModal
            size: 'large',
            // this becomes 'label'
            heading: 'Form Element Horizontal Variant',
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
