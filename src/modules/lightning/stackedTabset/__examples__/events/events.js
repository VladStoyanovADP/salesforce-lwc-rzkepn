import { LightningElement, track } from 'lwc';

export default class Events extends LightningElement {
    @track selectedTab = '';

    handleTabClick(e) {
        this.selectedTab = e.target.label;
    }
}
