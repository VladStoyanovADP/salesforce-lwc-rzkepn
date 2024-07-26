import labelSelectItem from '@salesforce/label/LightningDatatable.selectItem';
import PrimitiveDatatableCell from 'lightning/primitiveDatatableCell';
import { api } from 'lwc';
import { keyCodes } from 'lightning/utilsPrivate';
import checkbox from './checkbox.html';
import radio from './radio.html';
import { getRealDOMId, synchronizeAttrs } from 'lightning/utilsPrivate';

const i18n = {
    selectItem: labelSelectItem,
};

export default class PrimitiveCellCheckbox extends PrimitiveDatatableCell {
    _columnHeaderId = '';
    @api rowIndex = 0;
    @api isSelected = false;
    @api isDisabled = false;
    @api type = 'checkbox';
    @api dtContextId;
    @api
    get columnHeaderId() {
        return this._columnHeaderId;
    }

    set columnHeaderId(id) {
        this._columnHeaderId = id || '';
        const labelId = this.computedLabelId;
        if (labelId) {
            synchronizeAttrs(this.refs.input, {
                'aria-labelledby': `${labelId} ${this._columnHeaderId}`,
            });
        }
    }

    render() {
        if (this.type === 'radio') {
            return radio;
        }
        return checkbox;
    }

    renderedCallback() {
        //give input the correct aria-labelledby value
        synchronizeAttrs(this.refs.input, {
            'aria-labelledby': `${this.computedLabelId} ${this.columnHeaderId}`,
        });
    }

    get computedLabelId() {
        if (this.isConnected && this.refs) {
            return getRealDOMId(this.refs.label);
        }
        return null;
    }

    get selectItemAssistiveText() {
        return `${i18n.selectItem} ${this.rowIndex + 1}`;
    }

    get labelId() {
        //give different ids for radio vs checkbox inputs
        const labelType = this.type === 'radio' ? 'radio' : 'check';
        return `${labelType}-button-label-${this.rowIndex + 1}`;
    }

    get computedOptionName() {
        return `${this.dtContextId}-options`;
    }

    handleRadioClick(event) {
        event.stopPropagation();

        if (!this.isSelected) {
            this.dispatchSelection(false);
        }
    }

    /**
     * We control the checkbox behaviour with the state and we handle it in the container,
     * but we need to prevent default in order to avoid the checkbox to change state
     * with the click and the generated click in the input from the label
     *
     * @param {Object} event - click event of the checkbox
     */
    handleCheckboxClick(event) {
        // click was catch on the input, stop propagation to avoid to be handled in container.
        // ideally you can let it bubble and be handled in there, but there is a raptor issue:
        // https://git.soma.salesforce.com/raptor/raptor/issues/838
        event.stopPropagation();
        this.dispatchSelection(event.shiftKey);
    }

    handleCheckboxContainerClick(event) {
        if (!this.isDisabled) {
            // click was catch in the label, the default its to activate the checkbox,
            // lets prevent it to avoid to send a double event.
            event.preventDefault();
            this.dispatchSelection(event.shiftKey);
        }
    }

    handleCheckboxContainerMouseDown(event) {
        // Prevent selecting text by Shift+click
        if (event.shiftKey) {
            event.preventDefault();
        }
    }

    handleRadioKeyDown(event) {
        const keyCode = event.keyCode;

        if (keyCode === keyCodes.left || keyCode === keyCodes.right) {
            // default behavior for radios is to select the prev/next radio with the same name
            event.preventDefault();
        }
    }

    dispatchSelection(isMultipleSelection) {
        const { rowKeyValue, colKeyValue } = this;
        const actionName = !this.isSelected ? 'selectrow' : 'deselectrow';
        // eslint-disable-next-line lightning-global/no-custom-event-identifier-arguments
        const actionEvent = new CustomEvent(actionName, {
            bubbles: true,
            composed: true,
            detail: {
                rowKeyValue,
                colKeyValue,
                isMultiple: isMultipleSelection,
            },
        });

        this.dispatchEvent(actionEvent);
    }
}
