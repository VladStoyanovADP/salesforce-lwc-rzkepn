import { LightningElement } from 'lwc';

export default class Basic extends LightningElement {
    isSelected = false;

    handleClick() {
        this.isSelected = !this.isSelected;
    }
}
