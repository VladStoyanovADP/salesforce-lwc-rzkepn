import { LightningElement, track } from 'lwc';
import {
    EXAMPLES_COLUMNS_DEFINITION_BASIC,
    EXAMPLES_DATA_BASIC,
} from './sampleData';

export default class TreeGridExpanded extends LightningElement {
    @track currentExpandedRows;

    // definition of columns for the tree grid
    gridColumns = EXAMPLES_COLUMNS_DEFINITION_BASIC;

    // data provided to the tree grid
    gridData = EXAMPLES_DATA_BASIC;

    // list of names for rows that are expanded
    gridExpandedRows = [
        '123556',
        '123556-A',
        '123556-B',
        '123556-B-B',
        '123557',
    ];

    // retrieve the list of rows currently marked as expanded
    getCurrentExpandedRows() {
        const treegrid = this.template.querySelector('.lgc-example-treegrid');
        this.currentExpandedRows = treegrid.getCurrentExpandedRows().toString();
    }
}
