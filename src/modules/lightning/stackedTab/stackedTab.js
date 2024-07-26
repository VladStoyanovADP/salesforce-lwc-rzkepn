import { LightningElement, api } from 'lwc';

export default class LightningStackedTab extends LightningElement {
    /**
     * The text to display on the tab.
     */
    @api label;

    /**
     * Icon to display. Defaults to utility:chevronright if none provided.
     * @type {string}
     */
    @api iconName = 'utility:chevronright';

    /**
     * Sets the focus on the tab, but dispatching event to parent stacked tabset.
     */
    @api
    focus() {
        this.template.querySelector('button').focus();
    }
}
