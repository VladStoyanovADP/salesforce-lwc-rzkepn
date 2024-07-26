import LightningDatatable from 'lightning/datatable';
import deleteRow from './deleteRow.html';
import orderingButtons from './orderingButtons.html';
import iconPill from './iconPill.html';
import customName from './customName.html';
import customNumber from './customNumber.html';
import customLink from './customLink.html';
import customNumberEdit from './customNumberEdit.html';

export default class CustomDatatypeTable extends LightningDatatable {
    static customTypes = {
        deleteRowButton: {
            template: deleteRow,
            typeAttributes: ['attrA', 'attrB'],
        },
        orderingButtons: {
            template: orderingButtons,
            typeAttributes: ['isFirstRow', 'isLastRow'],
        },
        customLink: {
            template: customLink,
            typeAttributes: ['label', 'tooltip'],
        },
        iconPill: {
            template: iconPill,
        },
        customName: {
            template: customName,
            typeAttributes: ['accountName'],
        },
        customNumber: {
            template: customNumber,
            editTemplate: customNumberEdit,
            standardCellLayout: true,
            typeAttributes: ['min'],
        },
    };
}
