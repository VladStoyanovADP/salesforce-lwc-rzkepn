import { LightningElement } from 'lwc';

export default class SelectInline extends LightningElement {
    selectVal = '';
    productOptions = [
        {
            label: '--None--',
            value: '',
        },
        {
            label: 'Sales',
            value: 'sales',
        },
        {
            label: 'Marketing',
            value: 'marketing',
        },
        {
            label: 'Service',
            value: 'service',
        },
    ];

    handleChange(event) {
        this.selectVal = event.detail.value;
    }
}
