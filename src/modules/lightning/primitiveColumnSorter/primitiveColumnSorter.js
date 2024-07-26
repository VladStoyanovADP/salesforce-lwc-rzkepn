import { LightningElement, api } from 'lwc';
import moveUpTooltip from '@salesforce/label/LightningPrimitiveColumnSorter.moveUpTooltip';
import moveDownTooltip from '@salesforce/label/LightningPrimitiveColumnSorter.moveDownTooltip';
import dropdownPlaceholder from '@salesforce/label/LightningPrimitiveColumnSorter.dropdownPlaceholder';
import ascending from '@salesforce/label/LightningPrimitiveColumnSorter.ascending';
import descending from '@salesforce/label/LightningPrimitiveColumnSorter.descending';
import missingValueValidation from '@salesforce/label/LightningPrimitiveColumnSorter.missingValueValidation';

const i18n = {
    moveUpTooltip,
    moveDownTooltip,
    dropdownPlaceholder,
    ascending,
    descending,
    missingValueValidation,
};

export default class PrimitiveColumnSorter extends LightningElement {
    @api firstRule;
    @api lastRule;
    @api rule;
    @api columns;
    @api index;
    _combobox;

    @api
    get combobox() {
        if (!this._combobox) {
            this._combobox = this.refs.combobox;
        }
        return this._combobox;
    }

    get i18n() {
        return i18n;
    }

    // used to group radio buttons independent from each other
    get groupName() {
        return `radioGroup_${this.index}`;
    }

    /**
     * Used to maintain radio group selection even when rules are moved up/down
     */
    get isAscendingChecked() {
        return this.rule.sortOrder === 'asc';
    }

    /**
     * Used to maintain radio group selection even when rules are moved up/down
     */
    get isDescendingChecked() {
        return this.rule.sortOrder === 'desc';
    }

    get isUpDisabled() {
        return this.rule.unselectedInitialRules || this.firstRule;
    }
    get isDownDisabled() {
        return this.rule.unselectedInitialRules || this.lastRule;
    }

    /**
     * dispatches a 'selection' event used to set the `selectedColumn` when the sorting column is selected
     * in turn, keeps the `multi-column-sorting-modal`'s this.rules property up to date.
     */
    handleColumnSelect(event) {
        this.dispatchEvent(
            new CustomEvent('selection', {
                detail: {
                    index: this.index,
                    selectedColumn: event.detail.value,
                    sortOrder: this.rule.sortOrder,
                },
            })
        );
    }

    /**
     * dispatches a 'selection' event used to set the `sortOrder` when the sorting direction is selected
     * in turn, keeps the `multi-column-sorting-modal`'s this.rules property up to date.
     */
    handleOrderChange(event) {
        this.dispatchEvent(
            new CustomEvent('selection', {
                detail: {
                    index: this.index,
                    selectedColumn: this.rule.selectedColumn,
                    sortOrder: event.target.value,
                },
            })
        );
    }

    handleDelete() {
        this.dispatchEvent(new CustomEvent('delete'));
    }

    handleMoveUp() {
        this.dispatchEvent(new CustomEvent('moveup'));
    }

    handleMoveDown() {
        this.dispatchEvent(new CustomEvent('movedown'));
    }
}
