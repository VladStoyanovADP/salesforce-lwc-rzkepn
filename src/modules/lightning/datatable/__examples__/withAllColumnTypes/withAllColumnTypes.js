import { LightningElement } from 'lwc';
import generateData from './generateData';

// Add <datatable-with-all-column-types></datatable-with-all-column-types> to the lwr-playground to see the table

const columns = [
    { label: 'Name', fieldName: 'name' },
    { label: 'Boolean', fieldName: 'boolean', type: 'boolean' },
    { label: 'Url', fieldName: 'url', type: 'url' },
    { label: 'Phone', fieldName: 'phone', type: 'phone' },
    {
        label: 'Currency',
        fieldName: 'currency',
        type: 'currency',
        typeAttributes: {
            currencyCode: 'EUR',
        },
    },
    { label: 'Date', fieldName: 'date', type: 'date' },
    {
        label: 'Date-local',
        fieldName: 'dateLocal',
        type: 'date-local',
        typeAttributes: {
            month: '2-digit',
            day: '2-digit',
        },
    },
    { label: 'Email', fieldName: 'email', type: 'email' },
    { label: 'Location', fieldName: 'location', type: 'location' },
    { label: 'Number', fieldName: 'number', type: 'number' },
    { label: 'Percent', fieldName: 'percent', type: 'percent' },
    {
        label: 'Action',
        type: 'action',
        typeAttributes: {
            rowActions: [
                { label: 'action 1', name: 'action1' },
                { label: 'action 2', name: 'action2' },
            ],
        },
    },
    {
        label: 'Button',
        type: 'button',
        typeAttributes: {
            label: 'Submit',
            name: 'submitAction',
            iconName: { fieldName: 'iconName' },
        },
    },
    {
        label: 'Button-icon',
        type: 'button-icon',
        typeAttributes: {
            label: 'Submit',
            name: 'submitAction',
            iconName: { fieldName: 'iconName' },
        },
    },
];

export default class DatatableWithAllColumnTypes extends LightningElement {
    data = [];
    columns = columns;

    connectedCallback() {
        const data = generateData({ amountOfRecords: 100 });
        this.data = data;
    }
}
