import { LightningElement, api } from 'lwc';

export default class CustomDatatypeNumber extends LightningElement {
    @api value;
    get range() {
        return this.value > 50000 ? 'High' : 'Low';
    }
    get computedClass() {
        return this.value > 50000
            ? 'slds-text-color_success'
            : 'slds-text-color_error';
    }

    get computedIcon() {
        return this.value > 50000 ? 'utility:arrowup' : 'utility:arrowdown';
    }

    get iconVariant() {
        return this.value > 50000 ? 'success' : 'error';
    }
}
