import { LightningElement } from 'lwc';
import generateData from './generateData.js';
const columns = [
    {
        label: 'Custom input',
        type: 'customInput',
    },
    {
        label: 'Popup Component',
        type: 'customComponent',
    },
    { label: 'Label', fieldName: 'name' },
    { label: 'Website', fieldName: 'website', type: 'url' },
    { label: 'Phone', fieldName: 'phone', type: 'phone' },
    { label: 'Balance', fieldName: 'amount', type: 'currency' },
];
export default class MyDatatable extends LightningElement {
    data = [];
    columns = columns;
    rowOffset = 0;

    connectedCallback() {
        this.data = generateData({ amountOfRecords: 5 });
    }
}
