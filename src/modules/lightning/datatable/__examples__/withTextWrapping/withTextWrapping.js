import { LightningElement } from 'lwc';
import generateData from './generateData';

// Add <datatable-with-text-wrapping></datatable-with-text-wrapping> to the lwr-playground to see the table

const columns = [
    { label: 'Label', fieldName: 'name' },
    {
        label: 'Description',
        fieldName: 'description',
        wrapText: true,
    },
    { label: 'Website', fieldName: 'website', type: 'url' },
    { label: 'Phone', fieldName: 'phone', type: 'phone' },
    { label: 'Balance', fieldName: 'amount', type: 'currency' },
    { label: 'CloseAt', fieldName: 'closeAt', type: 'date' },
];

export default class DatatablewithTextWrapping extends LightningElement {
    data = [];
    columns = columns;
    wrapTextMaxLines;

    connectedCallback() {
        this.data = generateData({ amountOfRecords: 25 });
    }

    changeTextWrappingMaxLines() {
        this.wrapTextMaxLines = 3;
    }
}
