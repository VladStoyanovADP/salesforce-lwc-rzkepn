import { LightningElement, track } from 'lwc';

export default class PopupExample extends LightningElement {
    @track enteredText = '';

    openPopup() {
        const referenceElement =
            this.template.querySelector('lightning-button');
        // Show the popup relative to the button, left-aligns the top of the popup with the bottom of the button
        this.popup.show(referenceElement, {
            reference: { horizontal: 'left', vertical: 'bottom' },
            popup: { horizontal: 'left', vertical: 'top' },
        });
    }

    handleCancel() {
        this.popup.close();
    }

    handleSave() {
        const name = this.template.querySelector('lightning-input');
        this.enteredText = name.value;

        this.popup.close();
    }

    get popup() {
        return this.template.querySelector('lightning-popup');
    }
}
