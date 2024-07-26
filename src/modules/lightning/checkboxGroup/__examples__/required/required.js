import { LightningElement } from 'lwc';

export default class CheckboxGroupRequired extends LightningElement {
    value = [];

    get options() {
        return [
            { label: 'Ross', value: 'option1' },
            { label: 'Rachel', value: 'option2' },
        ];
    }
}
