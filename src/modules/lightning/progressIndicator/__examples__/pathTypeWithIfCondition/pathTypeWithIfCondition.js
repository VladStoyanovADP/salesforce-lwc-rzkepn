import { LightningElement } from 'lwc';

export default class ProgressIndicatorPathTypeWithIfCondition extends LightningElement {
    showStep4 = true;

    toggleStep4() {
        this.showStep4 = !this.showStep4;
    }
}
