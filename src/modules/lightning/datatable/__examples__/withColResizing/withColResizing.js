import { LightningElement } from 'lwc';
import generateData from './generateData';

// Add <datatable-with-col-resizing></datatable-with-col-resizing> to the lwr-playground to see table

const columns = [
    { label: 'Label', fieldName: 'name' },
    { label: 'Website', fieldName: 'website', type: 'url' },
    { label: 'Phone', fieldName: 'phone', type: 'phone' },
    { label: 'Balance', fieldName: 'amount', type: 'currency' },
    { label: 'CloseAt', fieldName: 'closeAt', type: 'date' },
];

export default class DatatableWithResize extends LightningElement {
    data = [];
    columns = columns;
    mode = 'fixed';
    resizeStep = 10;

    connectedCallback() {
        this.data = generateData({ amountOfRecords: 25 });
    }

    changeWidthsMode() {
        this.mode = this.mode === 'fixed' ? 'auto' : 'fixed';
    }

    increaseResizeStep() {
        this.resizeStep += 10;
    }

    decreaseResizeStep() {
        this.resizeStep =
            this.resizeStep > 10 ? (this.resizeStep -= 10) : this.resizeStep;
    }

    addColumn() {
        const cols = Array.from(this.columns);
        cols.push({ label: 'ID', fieldName: 'id' });
        this.columns = cols;
    }
}
