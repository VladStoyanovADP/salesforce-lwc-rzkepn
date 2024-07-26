import { LightningElement } from 'lwc';
import generateData from './generateData';

// Add <datatable-with-errors></datatable-with-errors> to the lwr-playground to see the table

const columns = [
    { label: 'Label', fieldName: 'name', editable: true },
    { label: 'Website', fieldName: 'website', type: 'url', editable: true },
    { label: 'Phone', fieldName: 'phone', type: 'phone', editable: true },
    { label: 'Balance', fieldName: 'amount', type: 'currency' },
    { label: 'CloseAt', fieldName: 'closeAt', type: 'date', editable: true },
];

export default class DatatableWithError extends LightningElement {
    data = [];
    columns = columns;
    errors = {};

    connectedCallback() {
        this.data = generateData({ amountOfRecords: 100 });
    }

    triggerError() {
        this.errors = {
            rows: {
                1: {
                    title: 'We found 2 errors.',
                    messages: [
                        'Enter a valid name',
                        'Verify the phone number and try again.',
                    ],
                    fieldNames: ['name', 'phone'],
                },
            },
            table: {
                title: 'Your entry cannot be saved. Fix the errors and try again.',
                messages: [
                    'Row 1 name must be valid text',
                    'Row 1 phone number is invalid',
                ],
            },
        };
    }
}
