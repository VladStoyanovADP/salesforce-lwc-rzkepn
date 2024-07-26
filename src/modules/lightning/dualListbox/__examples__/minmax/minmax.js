import { LightningElement } from 'lwc';

export default class DualListboxMinMax extends LightningElement {
    options = [];
    values = [];
    requiredOptions = [];

    get min() {
        return 5;
    }

    get max() {
        return 10;
    }

    connectedCallback() {
        const items = [];
        for (let i = 1; i <= 15; i++) {
            items.push({
                label: `Option ${i}`,
                value: `opt${i}`,
            });
        }
        this.options.push(...items);
        this.values.push(...['opt2', 'opt4', 'opt6']);
    }
}
