import { LightningElement } from 'lwc';
import generateData from './generateData';

// Add <datatable-with-virtualization></datatable-with-virtualization> to the lwr-playground to see the table

const columns = [
    { label: 'Label', fieldName: 'name' },
    { label: 'Website', fieldName: 'website', type: 'url' },
    { label: 'Phone', fieldName: 'phone', type: 'phone' },
    { label: 'Balance', fieldName: 'amount', type: 'currency' },
    { label: 'CloseAt', fieldName: 'closeAt', type: 'date' },
];

export default class DatatableWithVirtualization extends LightningElement {
    data = [];
    columns = columns;
    renderConfig = {
        virtualize: 'vertical',
        bufferSize: 10,
    };

    connectedCallback() {
        const data = generateData({ amountOfRecords: 100 });
        this.data = data;
    }
}
