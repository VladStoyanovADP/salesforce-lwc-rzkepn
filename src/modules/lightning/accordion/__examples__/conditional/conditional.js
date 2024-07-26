import { LightningElement } from 'lwc';

export default class LightningExampleAccordionConditional extends LightningElement {
    activeSectionMessage = '';
    isDVisible = false;

    handleToggleSection(event) {
        this.activeSectionMessage =
            'Open section name:  ' + event.detail.openSections;
    }

    handleToggleSectionD() {
        this.isDVisible = !this.isDVisible;
    }

    get isMessageVisible() {
        return this.activeSectionMessage.length > 0;
    }
}
