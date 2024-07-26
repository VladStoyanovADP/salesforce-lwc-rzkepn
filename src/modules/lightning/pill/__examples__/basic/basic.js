import { LightningElement } from 'lwc';

export default class Basic extends LightningElement {
    infoText;

    handleRemove() {
        this.infoText = 'Remove button was clicked';
    }
}
