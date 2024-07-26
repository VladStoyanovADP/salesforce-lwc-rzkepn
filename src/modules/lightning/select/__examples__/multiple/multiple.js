import { LightningElement } from 'lwc';

export default class SelectMultiple extends LightningElement {
    value = '';

    get options() {
        return [
            { label: 'Apple', value: 'apple' },
            { label: 'Blueberry', value: 'blueberry' },
            { label: 'Cherry', value: 'cherry' },
            { label: 'Pumpkin', value: 'pumpkin' },
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
    }
}
