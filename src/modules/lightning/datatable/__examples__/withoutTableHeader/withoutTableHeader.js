import { LightningElement } from 'lwc';
import generateData from './generateData';

// Add <datatable-without-table-header></datatable-without-table-header> to the lwr-playground to see the table

const columns = [
    { label: 'Label', fieldName: 'name' },
    { label: 'Website', fieldName: 'website', type: 'url' },
    { label: 'Phone', fieldName: 'phone', type: 'phone' },
    { label: 'Balance', fieldName: 'amount', type: 'currency' },
    { label: 'CloseAt', fieldName: 'closeAt', type: 'date' },
];

export default class DatatableWithoutTableHeader extends LightningElement {
    data = [];
    columns = columns;

    connectedCallback() {
        const data = generateData({ amountOfRecords: 100 });
        this.data = data;
    }
}
