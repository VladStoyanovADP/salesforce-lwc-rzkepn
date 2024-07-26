import { LightningElement } from 'lwc';

export default class PopupExample extends LightningElement {
    openPopup() {
        const referenceElement =
            this.template.querySelector('lightning-button');
        this.popup.show(referenceElement, {
            reference: { horizontal: 'right', vertical: 'top' },
            popup: { horizontal: 'left', vertical: 'top' },
            // To accommodate the nubbin (arrow pointer)
            padding: 1,
            offset: 1.25,
        });
    }

    handleAlignmentUpdate(event) {
        this._alignment = event.target.alignment;
    }

    handleAutoFocus(event) {
        // Don't focus on the first tabbable element
        event.preventDefault();

        // Focus on the input instead
        this.template.querySelector('lightning-input').focus();
    }

    get popupClasses() {
        const { horizontal, vertical } = this._alignment;
        const nubbinClass = `slds-nubbin_${horizontal}-${vertical}`;
        return `slds-popover slds-popover_walkthrough ${nubbinClass}`;
    }

    get popup() {
        return this.template.querySelector('lightning-popup');
    }
}
