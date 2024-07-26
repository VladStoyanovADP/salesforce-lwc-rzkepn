import { LightningElement, api } from 'lwc';
import { assert } from 'lightning/utilsPrivate';

import TextTpl from './text.html';
import PhoneTpl from './phone.html';
import EmailTpl from './email.html';
import PercentTpl from './percent.html';
import UrlTpl from './url.html';
import CurrencyTpl from './currency.html';
import NumberTpl from './number.html';
import BooleanTpl from './boolean.html';
import DateLocalTpl from './dateLocal.html';
import DateTpl from './date.html';
import DefaultTpl from './default.html';

const TYPE_TEMPLATE_MAPPINGS = {
    text: TextTpl,
    phone: PhoneTpl,
    email: EmailTpl,
    percent: PercentTpl,
    url: UrlTpl,
    currency: CurrencyTpl,
    number: NumberTpl,
    boolean: BooleanTpl,
    'date-local': DateLocalTpl,
    date: DateTpl,
};
const INVALID_TYPE_MESSAGE = 'column type not supported for inline edit';

export default class LightningPrimitiveDatatableIeditTypeFactory extends LightningElement {
    // Private Variables
    columnLabel;

    /***************************** PUBLIC PROPERTIES *****************************/

    @api editedValue;
    @api required;
    @api typeAttributes;

    @api
    get columnDef() {
        return this._columnDef;
    }

    set columnDef(value) {
        assert(
            // eslint-disable-next-line no-prototype-builtins
            TYPE_TEMPLATE_MAPPINGS.hasOwnProperty(value.type) ||
                value.editableCustomType,
            INVALID_TYPE_MESSAGE
        );

        this._columnDef = value;
        this.columnLabel = value.label;
    }

    /**
     * Checks if type is an custom type that is editable and
     * has an editTemplate that contains [data-inputable="true"]
     * Used when checking if cell can actually be edited
     */
    @api
    get isEditableCustomValid() {
        return this.isValidCustomType && this.concreteComponent;
    }

    @api
    get value() {
        if (this.columnDef.type === 'boolean') {
            return this.concreteComponent.checked;
        }
        return this.concreteComponent.value;
    }

    @api
    get validity() {
        return this.concreteComponent.validity;
    }

    /***************************** PUBLIC METHODS *****************************/

    /**
     * Focuses on the input component that is rendered by the type factory
     */
    @api
    focus() {
        if (this.concreteComponent) {
            this.concreteComponent.focus();
        }
    }

    /**
     * Displays error message if the input is invalid
     */
    @api
    showHelpMessageIfInvalid() {
        this.concreteComponent.showHelpMessageIfInvalid();
    }

    /***************************** PRIVATE GETTERS *****************************/

    get columnType() {
        return this._columnDef.type;
    }

    get concreteComponent() {
        return this.template.querySelector('[data-inputable="true"]');
    }

    /**
     * Returns editTemplate defined for custom type template
     */
    get customEditTemplate() {
        return this._columnDef.editTemplate;
    }

    /**
     * Retrieves the date set in the column and converts it to a value
     * that can be passed into lightning-input type="datetime"
     */
    get editedDateValue() {
        const dateValue = new Date(this.editedValue);

        if (this.editedValue === null || isNaN(dateValue.getTime())) {
            return '';
        }

        return dateValue.toISOString();
    }

    /**
     * Checks this custom type is editable and has editTemplate defined
     */
    get isValidCustomType() {
        return (
            this._columnDef.editableCustomType && this._columnDef.editTemplate
        );
    }

    /**
     * For percent, currency types use if step passed in, if not fallback to default
     * @returns {*|string}
     */
    get typeAttributeStep() {
        return (
            (this._columnDef &&
                this._columnDef.typeAttributes &&
                this._columnDef.typeAttributes.step) ||
            '0.01'
        );
    }

    /***************************** EVENT HANDLERS *****************************/

    handleComponentFocus() {
        this.dispatchEvent(new CustomEvent('focus'));
    }

    handleComponentBlur() {
        this.dispatchEvent(new CustomEvent('blur'));
    }

    handleComponentChange() {
        this.showHelpMessageIfInvalid();
    }

    /***************************** LIFECYCLE HOOKS *****************************/

    /**
     * Renders the appropriate template based on the column type
     */
    render() {
        return this.isValidCustomType
            ? this.customEditTemplate
            : TYPE_TEMPLATE_MAPPINGS[this.columnType] || DefaultTpl;
    }

    /**
     * Attaches event handlers for `focus`, `blur` and `change` events
     */
    renderedCallback() {
        if (this.concreteComponent) {
            this.concreteComponent.addEventListener(
                'focus',
                this.handleComponentFocus.bind(this)
            );
            this.concreteComponent.addEventListener(
                'blur',
                this.handleComponentBlur.bind(this)
            );
            this.concreteComponent.addEventListener(
                'change',
                this.handleComponentChange.bind(this)
            );
        }
    }
}
