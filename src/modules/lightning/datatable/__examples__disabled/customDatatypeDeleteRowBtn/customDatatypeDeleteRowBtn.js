import { LightningElement, api } from 'lwc';
import { baseNavigation } from 'lightning/datatableKeyboardMixins';
import template from './customDatatypeDeleteRowBtn.html';

export default class CustomDatatypeDeleteRowBtn extends baseNavigation(
    LightningElement
) {
    @api internalTabIndex;
    // Required for mixins
    render() {
        return template;
    }
}
