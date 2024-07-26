import { LightningElement } from 'lwc';

export default class ButtonAccesskey extends LightningElement {
    clickedButtonLabel;

    handleClick(event) {
        this.clickedButtonLabel = event.target.label;
    }
}
