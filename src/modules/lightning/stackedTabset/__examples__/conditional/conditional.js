import { LightningElement, track } from 'lwc';

export default class Conditinal extends LightningElement {
    @track show;

    handleToggle() {
        this.show = !this.show;
    }
}
