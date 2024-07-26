import PrimitiveDatatableCell from 'lightning/primitiveDatatableCell';
import { api } from 'lwc';
import { classSetToString } from 'lightning/utilsPrivate';
import { toDate } from 'lightning/internationalizationLibrary';
import cellWithStandardLayout from './cellWithStandardLayout.html';
import bareCustomCell from './bareCustomCell.html';
import labelEdit from '@salesforce/label/LightningDatatable.edit';
import labelEditHasError from '@salesforce/label/LightningDatatable.editHasError';
import labelTrue from '@salesforce/label/LightningDatatable.true';
import labelFalse from '@salesforce/label/LightningDatatable.false';

// Same constant (TOOLTIP_ALLOWANCE) as used in lightning/datatable/rowNumber.js
// If making change to this, make sure to modify in rowNumber.js as well
const TOOLTIP_ALLOWANCE = 20;
const i18n = {
    edit: labelEdit,
    editHasError: labelEditHasError,
    true: labelTrue,
    false: labelFalse,
};

function isSpreadComputedAlignment(computedAlignment) {
    return (
        !computedAlignment ||
        computedAlignment === 'left' ||
        (computedAlignment !== 'center' && computedAlignment !== 'right')
    );
}

export default class PrivateCellFactory extends PrimitiveDatatableCell {
    @api types;
    @api alignment;
    @api value;
    @api displayValue;
    @api iconName;
    @api iconLabel;
    @api iconPosition;
    @api iconAlternativeText;
    @api editable;
    @api displayReadOnlyIcon;
    @api hasError;
    @api columnLabel;
    @api columnSubType;
    @api typeAttribute0;
    @api typeAttribute1;
    @api typeAttribute2;
    @api typeAttribute3;
    @api typeAttribute4;
    @api typeAttribute5;
    @api typeAttribute6;
    @api typeAttribute7;
    @api typeAttribute8;
    @api typeAttribute9;
    @api typeAttribute10;
    // typeAttribute21 and typeAttribute21 used by treegrid
    @api typeAttribute21;
    @api typeAttribute22;

    @api wrapTextMaxLines;

    _wrapText = false;
    _rowHasError = false;

    @api
    get wrapText() {
        return this._wrapText;
    }

    set wrapText(value) {
        if (value) {
            this.classList.add('slds-cell-wrap');
        } else {
            this.classList.remove('slds-cell-wrap');
        }

        this._wrapText = value;
    }

    @api
    get columnType() {
        return this._columnType;
    }

    set columnType(value) {
        if (value === 'tree') {
            this.classList.add('slds-no-space');
        }
        this._columnType = value;
    }

    getActionableElements() {
        const result = Array.from(
            this.template.querySelectorAll('[data-navigation="enable"]')
        );

        const customType = this.refs.customCell;

        if (customType) {
            const wrapperActionableElements =
                customType.getActionableElements();
            wrapperActionableElements.forEach((elem) => result.push(elem));
        }
        return result;
    }

    /**
     *  Getters for each type used in the template to include the correct formatted component.
     *  When any new type is added, getter should be added here to be used in the template
     */

    isType(typeName) {
        return typeName === this.columnType || typeName === this.columnSubType;
    }

    get isText() {
        return this.isType('text');
    }

    get isNumber() {
        return this.isType('number');
    }

    get isCurrency() {
        return this.isType('currency');
    }

    get isPercent() {
        return this.isType('percent');
    }

    get isEmail() {
        return this.isType('email');
    }

    get isDateTime() {
        return this.isType('date');
    }

    get isPhone() {
        return this.isType('phone');
    }

    get isUrl() {
        return this.isType('url');
    }

    get isLocation() {
        return this.isType('location');
    }

    get isReference() {
        return this.isType('reference');
    }

    get isRowNumber() {
        if (this.isType('rowNumber')) {
            const error = this.typeAttribute0;
            this._rowHasError =
                error && error.title && error.messages ? true : false;
            return true;
        }

        return false;
    }

    get isAction() {
        return this.isType('action');
    }

    get isButton() {
        return this.isType('button');
    }

    get isButtonIcon() {
        return this.isType('button-icon');
    }

    get isBoolean() {
        return this.isType('boolean');
    }

    get isDateLocal() {
        return this.isType('date-local');
    }

    isLtrType() {
        const { columnType } = this;
        return (
            columnType === 'url' ||
            columnType === 'email' ||
            columnType === 'phone'
        );
    }

    get hasTreeData() {
        return this.columnType === 'tree';
    }

    get isCustomType() {
        const { types } = this;
        return types ? types.isCustomType(this.columnType) : false;
    }

    /**
     * Returns true for all standard cells that are indicated as being editable
     * or for any custom cell that is not only indicated as being editable
     * but is also using a standard cell layout
     */
    get isEditable() {
        const { types } = this;
        if (types) {
            return this.editable && types.isEditableType(this.columnType);
        }
        return false;
    }

    render() {
        const { columnType, types } = this;
        if (
            types &&
            types.isCustomType(columnType) &&
            !types.isStandardCellLayoutForCustomType(columnType)
        ) {
            return bareCustomCell;
        }
        return cellWithStandardLayout;
    }

    /**
     *  Getters related to styling of the wrapper or the types.
     */

    get isSpreadAlignment() {
        return isSpreadComputedAlignment(this.computedAlignment);
    }

    // Note: this should be passed from above, but we dont have a defined architecture that lets customize / provide defaults
    // on cell attributes per type.
    get computedAlignment() {
        const { alignment } = this;
        if (alignment) {
            return alignment;
        }
        const { columnType } = this;
        // is centered by default type
        if (columnType === 'button-icon') {
            return 'center';
        }
        // is numbered based type
        if (
            columnType === 'currency' ||
            columnType === 'number' ||
            columnType === 'percent'
        ) {
            return 'right';
        }
        return alignment;
    }

    get hasLeftIcon() {
        if (this.iconName) {
            const { iconPosition } = this;
            return !iconPosition || iconPosition === 'left';
        }
        return false;
    }

    get hasRightIcon() {
        return this.iconName ? this.iconPosition === 'right' : false;
    }

    get shouldDisplayReadOnlyIcon() {
        return !this.isEditable && this.displayReadOnlyIcon === true;
    }

    get computedCellDivClass() {
        const { columnType, _wrapText } = this;
        const isActionType =
            'action' === columnType || 'action' === this.columnSubType;
        return classSetToString({
            'slds-truncate':
                columnType !== 'button-icon' && !isActionType && !_wrapText,
            'slds-hyphenate': _wrapText,
            'slds-line-clamp': _wrapText,
            'ltr-content-in-rtl': document.dir === 'rtl' && this.isLtrType(),
        });
    }

    get computedMarginClassWhenLeftIconExists() {
        return this.hasLeftIcon ? 'slds-m-left_x-small' : '';
    }

    get computedWrapperClass() {
        const { columnType, computedAlignment } = this;
        const isActionType =
            'action' === columnType || 'action' === this.columnSubType;
        return classSetToString({
            'slds-grid': true,
            'slds-no-space': columnType === 'tree',
            'slds-align_absolute-center': isActionType,
            'slds-grid_align-end': computedAlignment === 'right',
            'slds-grid_align-center': computedAlignment === 'center',
            'slds-grid_align-spread':
                isSpreadComputedAlignment(computedAlignment),
        });
    }

    get computedRowNumberStyle() {
        return this._rowHasError ? '' : `padding-left: ${TOOLTIP_ALLOWANCE}px;`;
    }

    get editIconAssistiveText() {
        const suffix = this.hasError ? ` ${i18n.editHasError}` : '';
        return `${i18n.edit} ${this.columnLabel}${suffix}`;
    }

    /**
     *  Getters related to manipulating value or attributes of any type go here.
     *  When any new type is added, getter should be added here if there is need.
     */

    get urlTarget() {
        return this.typeAttribute1 || '_self';
    }

    get urlTooltip() {
        if (this.typeAttribute2 === '') {
            return '';
        }
        return this.typeAttribute2 || this.value;
    }

    get isChecked() {
        return !!this.value;
    }

    get dateValue() {
        // Supported values can be passed directly to lightning-formatted-date-time but
        // non-supported formats need to be passed through Date constructor to avoid
        // customer breakages for the time being. Ideally the use of toDate here will be
        // temporary and we can remove use of the Date constructor in the future
        return toDate(this.value);
    }

    get computedDateLocalDay() {
        return this.typeAttribute0 || 'numeric';
    }

    get computedDateLocalMonth() {
        return this.typeAttribute1 || 'short';
    }

    get computedDateLocalYear() {
        return this.typeAttribute2 || 'numeric';
    }

    get computedCssStyles() {
        if (this._wrapText) {
            return `${'--lwc-lineClamp'}: ${this.wrapTextMaxLines || 'none'}`;
        }
        return null;
    }

    get booleanCellAssistiveText() {
        return this.value ? i18n.true : i18n.false;
    }

    /**
     *  Event handlers below this.
     *  If listening to any event on the wrapper or any type add the handler here
     */

    // Inline edit button
    handleEditButtonClick() {
        const { rowKeyValue, colKeyValue } = this;
        const event = new CustomEvent('privateeditcell', {
            bubbles: true,
            composed: true,
            detail: {
                rowKeyValue,
                colKeyValue,
            },
        });
        this.dispatchEvent(event);
    }

    // Overridden click handler from the datatable-cell.
    handleClick() {
        if (!this.classList.contains('slds-has-focus')) {
            this.addFocusStyles();
            this.fireCellFocusByClickEvent();
        }
    }

    fireCellFocusByClickEvent() {
        let needsRefocusOnCellElement = false;
        const { template } = this;
        const { activeElement } = this.template;
        // pass a flag for IE11 to refocus on the cell element if the activeElement is not
        // something focusable in the cell or the cell td/th itself
        if (
            activeElement &&
            (activeElement === template.querySelector('div:first-child') ||
                activeElement ===
                    template.querySelector('span.slds-grid:first-child'))
        ) {
            needsRefocusOnCellElement = true;
        }
        const { rowKeyValue, colKeyValue } = this;
        const event = new CustomEvent('privatecellfocusedbyclick', {
            bubbles: true,
            composed: true,
            detail: {
                rowKeyValue,
                colKeyValue,
                needsRefocusOnCellElement,
            },
        });

        this.dispatchEvent(event);
    }
}
