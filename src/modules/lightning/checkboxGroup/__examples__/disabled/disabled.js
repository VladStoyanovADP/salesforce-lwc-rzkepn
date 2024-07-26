import { LightningElement } from 'lwc';

export default class CheckboxGroupDisabled extends LightningElement {
    value = ['option1'];

    get options() {
        return [
            { label: 'Ross', value: 'option1' },
            { label: 'Rachel', value: 'option2' },
        ];
    }
}
