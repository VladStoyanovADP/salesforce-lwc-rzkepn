import { LightningElement } from 'lwc';
import generateData from './generateData';

// Add <datatable-with-row-selection></datatable-with-row-selection> to the lwr-playground to see the table

const columns = [
    { label: 'Label', fieldName: 'name' },
    { label: 'Website', fieldName: 'website', type: 'url' },
    { label: 'Phone', fieldName: 'phone', type: 'phone' },
    { label: 'Balance', fieldName: 'amount', type: 'currency' },
    { label: 'CloseAt', fieldName: 'closeAt', type: 'date' },
];

export default class DatatableWithRowSelection extends LightningElement {
    data = [];
    columns = columns;
    selectedRows = ['1', '2', '4'];
    maxRowSelection = 4;

    connectedCallback() {
        this.data = generateData({ amountOfRecords: 100 });
    }

    increaseMaxRowSelection() {
        this.maxRowSelection += 1;
    }

    decreaseMaxRowSelection() {
        this.maxRowSelection =
            this.maxRowSelection > 0
                ? (this.maxRowSelection -= 1)
                : this.maxRowSelection;
    }
}
