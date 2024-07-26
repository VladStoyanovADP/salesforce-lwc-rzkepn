import { LightningElement, api } from 'lwc';
import mix from 'lightning/mixinBuilder';
import { baseNavigation } from 'lightning/datatableKeyboardMixins';
import template from './customDatatypeLink.html';

export default class CustomDatatypeLink extends mix(LightningElement).with(
    baseNavigation
) {
    @api url;
    @api label;

    render() {
        return template;
    }
}
