import { LightningElement } from 'lwc';

export default class ButtonMenuOnselect extends LightningElement {
    selectedItemValue;

    handleOnselect(event) {
        this.selectedItemValue = event.detail.value;
    }
}
