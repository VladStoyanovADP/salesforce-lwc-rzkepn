import { LightningElement } from 'lwc';
import ModalDemoAllFormFullCompound from 'modal/demoallformfullcompound';

// this form is loosely based on SLDS form element blueprint, Compound Variant
// https://www.lightningdesignsystem.com/components/form-element/#Compound
// + uses sizing utils: https://www.lightningdesignsystem.com/utilities/sizing/

export default class ModalAllFormCompound extends LightningElement {
    demoResult = 'unset';

    handleDemoModal() {
        ModalDemoAllFormFullCompound.open({
            // LightningModal
            size: 'full',
            // this becomes 'label'
            heading: 'Form Element Compound Variant',
            description:
                'Recreating lighntning-input-address using SLDS form element and sizing utils',
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
