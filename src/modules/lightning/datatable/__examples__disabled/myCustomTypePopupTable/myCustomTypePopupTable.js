//myCustomTypeDatatable.js
import LightningDatatable from 'lightning/datatable';
import customInputTemplate from './customInput.html';
import customComponentTemplate from './nestedSimpleComponentParent.html';

export default class MyCustomTypePopupTable extends LightningDatatable {
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
