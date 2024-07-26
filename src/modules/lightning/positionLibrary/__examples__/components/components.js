import { LightningElement, api } from 'lwc';

export default class PlaygroundCompoennts extends LightningElement {
    @api component;

    get isHelpText() {
        return this.component === 'helpText';
    }

    get isButtonMenu() {
        return this.component === 'button-menu';
    }

    get isComboBox() {
        return this.component === 'combobox';
    }

    get isDatePicker() {
        return this.component === 'datepicker';
    }

    get comboBoxOptions() {
        return [
            { label: 'New', value: 'new' },
            { label: 'In Progress', value: 'inProgress' },
            { label: 'Finished', value: 'finished' },
        ];
    }
}
