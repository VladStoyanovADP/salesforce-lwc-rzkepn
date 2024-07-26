import { LightningElement } from 'lwc';
import mix from 'lightning/mixinBuilder';
import { baseNavigation } from 'lightning/datatableKeyboardMixins';
import template from './CustomNestedComponent.html';

export default class CustomNestedComponent extends mix(LightningElement).with(
    baseNavigation
) {
    render() {
        return template;
    }
}
