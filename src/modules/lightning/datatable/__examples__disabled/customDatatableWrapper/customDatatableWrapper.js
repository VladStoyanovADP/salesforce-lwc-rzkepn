import { LightningElement, track } from 'lwc';

// Add <datatable-custom-datatable-wrapper></datatable-custom-datatable-wrapper> to the lwr-playground to see the table

const columns = [
    {
        label: 'Reorder',
        type: 'orderingButtons',
        fixedWidth: 90,
        fieldName: 'id',
        typeAttributes: {
            isFirstRow: { fieldName: 'isFirstRow' },
            isLastRow: { fieldName: 'isLastRow' },
        },
    },
    {
        label: 'Account Name',
        type: 'customName',
        typeAttributes: {
            accountName: { fieldName: 'name' },
        },
    },
    {
        label: 'Website',
        fieldName: 'website',
        type: 'customLink',
        typeAttributes: {
            label: { fieldName: 'name' },
            tooltip: { fieldName: 'name' },
        },
        hideDefaultActions: true,
        actions: [
            { label: 'Action 1', name: 'action1' },
            { label: 'Action 2', name: 'action2' },
        ],
    },
    {
        label: 'Amount',
        type: 'customNumber',
        fieldName: 'amount',
        editable: true,
        typeAttributes: {
            min: 0,
        },
    },
    { label: 'Icon', type: 'iconPill' },
    {
        label: '',
        type: 'deleteRowButton',
        fieldName: 'id',
        fixedWidth: 70,
        typeAttributes: {
            attrA: { fieldName: 'attrA' },
            attrB: { fieldName: 'attrB' },
        },
    },
];

const exampleData = [
    {
        id: 1,
        name: 'Name 1',
        website: 'https://www.google.com',
        amount: 200.0,
        isFirstRow: true,
        isLastRow: false,
    },
    {
        id: 2,
        name: 'Name 2',
        website: 'https://www.salesforce.com',
        amount: 500000.0,
        isFirstRow: false,
        isLastRow: false,
    },
    {
        id: 3,
        name: 'Name 3',
        website: 'https://www.quora.com',
        amount: 600.0,
        isFirstRow: false,
        isLastRow: true,
    },
];

export default class CustomDatatableWrapper extends LightningElement {
    @track data = exampleData;
    @track columns = columns;
}
