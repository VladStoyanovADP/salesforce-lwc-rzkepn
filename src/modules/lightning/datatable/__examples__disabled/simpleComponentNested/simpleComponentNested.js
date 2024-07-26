import { LightningElement, api } from 'lwc';

export default class CustomComponent extends LightningElement {
    // Passing internal tab index down from parent.
    @api internalTabIndex;
}
