import labelCollapseBranch from '@salesforce/label/LightningPrimitiveCellTree.collapseBranch';
import labelExpandBranch from '@salesforce/label/LightningPrimitiveCellTree.expandBranch';
import { LightningElement, api } from 'lwc';
import { classSet, formatLabel } from 'lightning/utils';
import { normalizeString, normalizeBoolean } from 'lightning/utilsPrivate';

const i18n = {
    collapseBranch: labelCollapseBranch,
    expandBranch: labelExpandBranch,
};

export default class PrivateTreeGridCellToggle extends LightningElement {
    @api rowKeyValue;
    @api colKeyValue;
    @api value;
    @api displayValue;

    _expanded = false;
    _hasChildren = false;

    _tabindex = 0;

    get computedButtonClass() {
        return classSet('slds-button slds-button_icon slds-m-right_x-small')
            .add({
                'slds-is-disabled': !this.hasChildren,
            })
            .toString();
    }

    @api
    get tabIndex() {
        return -1;
    }

    set tabIndex(newValue) {
        this.setAttribute('tabindex', newValue);
        this._tabindex = newValue;
    }

    get buttonTabIndex() {
        return this._tabindex;
    }

    @api
    get hasChildren() {
        return this._hasChildren;
    }

    set hasChildren(value) {
        this._hasChildren = normalizeBoolean(value);
    }

    @api
    get isExpanded() {
        return this._expanded;
    }

    set isExpanded(value) {
        this._expanded = normalizeBoolean(value);
    }

    get buttonTitle() {
        let title =
            normalizeString(this.displayValue) !== ''
                ? this.displayValue
                : this.value;
        if (this.isExpanded) {
            return formatLabel(i18n.collapseBranch, title);
        }
        return formatLabel(i18n.expandBranch, title);
    }

    handleChevronClick() {
        const customEvent = new CustomEvent('privatetogglecell', {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                name: this.rowKeyValue,
                nextState: this.isExpanded ? false : true, // True = expanded, False = collapsed
            },
        });
        this.dispatchEvent(customEvent);
    }

    @api
    focus() {
        this.refs.button.focus();
    }
}
