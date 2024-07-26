//myCustomTypeDatatable.js
import LightningDatatable from 'lightning/datatable';
import customInputTemplate from './customInput.html';
import customComponentTemplate from './nestedSimpleComponentParent.html';

export default class MyCustomTypeDatatable extends LightningDatatable {
    static customTypes = {
        customInput: {
            template: customInputTemplate,
            standardCellLayout: true,
        },
        customComponent: {
            template: customComponentTemplate,
            standardCellLayout: false,
        },
    };
}
