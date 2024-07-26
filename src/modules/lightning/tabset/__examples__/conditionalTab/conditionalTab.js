import { LightningElement } from 'lwc';

export default class TabsetConditionalTab extends LightningElement {
    showTabFour;

    toggleOptionalTab() {
        this.showTabFour = !this.showTabFour;
    }
}
