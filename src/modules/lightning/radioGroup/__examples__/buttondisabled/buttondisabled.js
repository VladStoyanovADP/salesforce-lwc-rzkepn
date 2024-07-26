import { LightningElement } from 'lwc';

export default class RadioGroupButtonDisabled extends LightningElement {
    value = '';

    get options() {
        return [
            { label: 'Sales', value: 'option1' },
            { label: 'Force', value: 'option2' },
        ];
    }
}
