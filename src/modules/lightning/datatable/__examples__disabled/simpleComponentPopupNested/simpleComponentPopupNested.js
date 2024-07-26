import { LightningElement, api } from 'lwc';

export default class CustomComponent extends LightningElement {
    // Passing internal tab index down from parent.
    @api internalTabIndex;
    buttonLabel1 = 'XYZ';
    priceOptions;
    priceOptions1 = [
        { label: 'Sales', value: 'option1' },
        { label: 'Force', value: 'option2' },
    ];
    // When inside the popup we want to ensure that the keypresses do no bubble up to the table
    handleKeyDown(event) {
        event.stopPropagation();
    }

    openPopup() {
        const referenceElement = this.template.querySelector(
            'lightning-button-icon'
        );
        // Show the popup relative to the button, and left-align
        // the top of the popup with the bottom of the button
        this.popup.show(referenceElement, {
            reference: { horizontal: 'left', vertical: 'bottom' },
            popup: { horizontal: 'left', vertical: 'top' },
        });
    }

    closePopup() {
        this.popup.close();
    }

    get popup() {
        return this.template.querySelector('lightning-popup');
    }
}
