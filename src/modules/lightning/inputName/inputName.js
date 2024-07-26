import labelFirstName from '@salesforce/label/LightningInputName.firstName';
import labelInformalName from '@salesforce/label/LightningInputName.informalName';
import labelLastName from '@salesforce/label/LightningInputName.lastName';
import labelMiddleName from '@salesforce/label/LightningInputName.middleName';
import labelNone from '@salesforce/label/LightningInputName.none';
import labelRequired from '@salesforce/label/LightningControl.required';
import labelSalutation from '@salesforce/label/LightningInputName.salutation';
import labelSuffix from '@salesforce/label/LightningInputName.suffix';
import labelHelpTextAlternativeText from '@salesforce/label/LightningInput.helptextAlternativeText';
import { api } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet, formatLabel } from 'lightning/utils';
import {
    assert,
    normalizeBoolean,
    classListMutation,
    isCSR,
    reflectAttribute,
} from 'lightning/utilsPrivate';
import {
    isEmptyString,
    InteractingState,
    FieldConstraintApi,
    normalizeVariant,
    VARIANT,
} from 'lightning/inputUtils';
import { getFieldsOrder } from './nameFormatter';

const FIELD_TYPE = {
    INPUT: 'input',
    PICKLIST: 'combobox',
};

const DEFAULT_MAXLENGTH = 40;

const DEFAULT_FIELD_META = {
    salutation: { inputType: FIELD_TYPE.PICKLIST },
    firstName: {},
    middleName: {},
    informalName: {},
    lastName: { maxlength: 80, required: true },
    suffix: {},
};

const i18n = {
    firstName: labelFirstName,
    informalName: labelInformalName,
    lastName: labelLastName,
    middleName: labelMiddleName,
    none: labelNone,
    required: labelRequired,
    salutation: labelSalutation,
    suffix: labelSuffix,
    helpTextAlternativeText: labelHelpTextAlternativeText,
};

/**
 * Represents a name compound field.
 */
export default class LightningInputName extends LightningShadowBaseClass {
    static delegatesFocus = true;

    /**
     * Reserved for internal use.
     */
    @api salutationLabel;

    /**
     * Reserved for internal use.
     */
    @api firstNameLabel;

    /**
     * Reserved for internal use.
     */
    @api middleNameLabel;

    /**
     * Reserved for internal use.
     */
    @api lastNameLabel;

    /**
     * Reserved for internal use.
     */
    @api suffixLabel;

    /**
     * Reserved for internal use.
     */
    @api informalNameLabel;

    /**
     * The label of the input name field.
     * @type {string}
     */
    @api label;
    /**
     * Displays a list of salutation options, such as Dr. or Mrs., provided as label-value pairs.
     * @type {list}
     */
    @api options;
    /**
     * List of fields to be displayed on the component. This value defaults to
     * ['firstName', 'salutation', 'lastName']. Other field values include middleName,
     * informalName, suffix.
     * @type {list}
     */
    @api fieldsToDisplay = ['firstName', 'salutation', 'lastName'];

    _salutation = '';
    _lastName = '';
    _firstName = '';
    _middleName = '';
    _informalName = '';
    _suffix = '';
    _disabled = false;
    _readonly = false;
    _required = false;
    _variant;
    _fieldLevelHelp;

    connectedCallback() {
        super.connectedCallback();
        this._connected = true;
        if (isCSR) {
            this.classList.add('slds-form-element', 'slds-form-compound');
            this.updateClassList();
        }
        this.interactingState = new InteractingState({
            debounceInteraction: true,
        });
        this.interactingState.onenter(() => {
            this.dispatchEvent(new CustomEvent('focus'));
        });
        this.interactingState.onleave(() => {
            this.showHelpMessageIfInvalid();
            this.dispatchEvent(new CustomEvent('blur'));
        });
    }

    updateClassList() {
        classListMutation(this.classList, {
            'slds-form-element_stacked': this.variant === VARIANT.LABEL_STACKED,
            'slds-form-element_horizontal':
                this.variant === VARIANT.LABEL_INLINE,
        });
    }

    disconnectedCallback() {
        this._connected = false;
    }

    /**
     * Displays the Salutation field as a dropdown menu. Use the options attribute to provide salutations in an array of label-value pairs.
     * @type {string}
     *
     */
    @api
    get salutation() {
        return this._salutation;
    }

    set salutation(value) {
        this._salutation = value;
    }

    /**
     * Displays the First Name field.
     * @type {string}
     *
     */
    @api
    get firstName() {
        return this._firstName;
    }

    set firstName(value) {
        this._firstName = value;
    }

    /**
     * Displays the Middle Name field.
     * @type {string}
     *
     */
    @api
    get middleName() {
        return this._middleName;
    }

    set middleName(value) {
        this._middleName = value;
    }

    /**
     * Displays the Informal Name field.
     * @type {string}
     *
     */
    @api
    get informalName() {
        return this._informalName;
    }

    set informalName(value) {
        this._informalName = value;
    }

    /**
     * Displays the Last Name field.
     * @type {string}
     *
     */
    @api
    get lastName() {
        return this._lastName;
    }

    set lastName(value) {
        this._lastName = value;
    }

    /**
     * Displays the Suffix field.
     * @type {string}
     *
     */
    @api
    get suffix() {
        return this._suffix;
    }

    set suffix(value) {
        this._suffix = value;
    }

    /**
     * If present, the input name field is disabled and users cannot interact with it.
     * @type {boolean}
     * @default false
     */
    @api
    get disabled() {
        return this._disabled;
    }

    set disabled(value) {
        this._disabled = normalizeBoolean(value);
    }

    /**
     * If present, the input name field is read-only and cannot be edited.
     * @type {boolean}
     * @default false
     */
    @api
    get readOnly() {
        return this._readonly;
    }

    set readOnly(value) {
        this._readonly = normalizeBoolean(value);
    }

    /**
     * If present, the input name field must be filled out before the form is submitted.
     * A red asterisk is displayed on the Last Name field. An error
     * message is displayed if a user interacts with the Last Name
     * field and does not provide a value.
     * @type {boolean}
     * @default false
     */
    @api
    get required() {
        return this._required;
    }

    set required(value) {
        this._required = normalizeBoolean(value);
    }

    /**
     * The variant changes the appearance of a name compound field.
     * Accepted variants include standard, label-hidden, label-inline, and label-stacked.
     * This value defaults to standard.
     * Use label-hidden to hide the label but make it available to assistive technology.
     * Use label-inline to horizontally align the label and name fields.
     * Use label-stacked to place the label above the name fields.
     * @type {string}
     * @default standard
     */
    @api
    get variant() {
        return this._variant || VARIANT.STANDARD;
    }

    set variant(value) {
        this._variant = normalizeVariant(value);
        reflectAttribute(this, 'variant', this.variant);
        this.updateClassList();
    }

    set fieldLevelHelp(value) {
        this._fieldLevelHelp = value;
    }

    /**
     * Help text detailing the purpose and function of the input.
     * @type {string}
     *
     */
    @api
    get fieldLevelHelp() {
        return this._fieldLevelHelp;
    }

    /**
     * Sets focus on the first input field.
     */
    @api
    focus() {
        this.template.querySelector('[data-field]').focus();
    }

    /**
     * Removes keyboard focus from the input element.
     */
    @api
    blur() {
        const inputs = this.template.querySelectorAll('[data-field]');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].blur();
        }
    }

    /**
     * Represents the validity states that an element can be in, with respect to constraint validation.
     * @type {object}
     *
     */
    @api
    get validity() {
        return this._combinedConstraint.validity;
    }

    /**
     * Returns the valid property value (Boolean) on the ValidityState object to
     * indicate whether input name fields have validity errors.
     * @returns {boolean} Indicates whether the element meets all constraint validations.
     */
    @api
    checkValidity() {
        return this._combinedConstraint.checkValidity();
    }

    /**
     * Displays error messages on the input fields if the entries are invalid.
     */
    @api
    showHelpMessageIfInvalid() {
        this.reportValidity();
    }

    /**
     * Sets a custom error message to be displayed for the input name fields when
     * the input value is submitted.
     * @param {string} message - The string that describes the error. If message is an empty string, the error message is reset.
     * @param {string} fieldName - The name of the input name field.
     */
    @api
    setCustomValidityForField(message, fieldName) {
        assert(
            DEFAULT_FIELD_META[fieldName] !== undefined,
            `Invalid 'fieldName': ${fieldName}`
        );
        this._fieldConstraints[fieldName].setCustomValidity(message);
    }

    /**
     * Displays the error messages and returns false if the input is invalid.
     * If the input is valid, reportValidity() clears displayed error messages and returns true.
     * @returns {boolean} - The validity status of the input fields.
     */
    @api
    reportValidity() {
        const valid = this.checkValidity();

        if (!this._connected) {
            return valid;
        }
        this.fieldsToDisplay.forEach((field) => {
            this._reportValidityForField(field);
        });

        return valid;
    }

    get i18n() {
        return i18n;
    }

    get isLabelHidden() {
        return this.variant === VARIANT.LABEL_HIDDEN;
    }

    get computedLegendClass() {
        return classSet('slds-form-element__label slds-form-element__legend')
            .add({ 'slds-assistive-text': this.isLabelHidden })
            .toString();
    }

    handleFocus() {
        this.interactingState.enter();
    }

    handleBlur(event) {
        this.interactingState.leave();

        const field = event.target.dataset.field;
        this._reportValidityForField(field);
    }

    handleChange(event) {
        event.stopPropagation();
        const value = event.detail.value;

        const fieldName = event.target.dataset.field;
        if (this.getFieldValue(fieldName) === value) {
            // Value didn't change. No need to dispatch.
            return;
        }

        // update the value for changing field
        this[fieldName] = value;
        this.dispatchEvent(
            new CustomEvent('change', {
                composed: true,
                bubbles: true,
                detail: {
                    salutation: this.salutation,
                    firstName: this.firstName,
                    middleName: this.middleName,
                    lastName: this.lastName,
                    informalName: this.informalName,
                    suffix: this.suffix,
                    validity: this.validity,
                },
            })
        );
    }

    initializeFieldsMetaData(fieldsOrder) {
        const fields = [];

        // setup what fields are needed with the field name
        fieldsOrder.forEach((fieldName) => {
            fields.push({ name: fieldName });
        });

        return fields;
    }

    getFieldObject(field) {
        const fieldDefault = DEFAULT_FIELD_META[field];
        const value = this[field];
        const label = this[`${field}Label`] || this.i18n[field];
        const fieldsToDisplay = this.fieldsToDisplay.map((fieldName) => {
            return fieldName.toUpperCase();
        });
        if (fieldsToDisplay.indexOf(field.toUpperCase()) > -1) {
            return {
                isInput: fieldDefault.inputType !== 'combobox',
                isCombobox: fieldDefault.inputType === 'combobox',
                required: fieldDefault.required && this.required,
                options: this.options,
                placeholder:
                    fieldDefault.inputType === 'combobox'
                        ? this.i18n.none
                        : label,
                maxlength: fieldDefault.maxlength || DEFAULT_MAXLENGTH,
                name: field,
                label,
                value,
            };
        }
        return null;
    }

    get fieldsMetaData() {
        const fieldsOrder = getFieldsOrder();
        const fieldsData = this.initializeFieldsMetaData(fieldsOrder);
        const fields = [];
        fieldsData.forEach((row) => {
            const fieldName = row.name;
            const fieldObject = this.getFieldObject(fieldName);
            if (fieldObject) {
                fields.push(fieldObject);
            }
        });
        return fields;
    }

    getFieldValue(fieldName) {
        return this[fieldName];
    }

    getFieldElement(fieldName) {
        return this.template.querySelector(`[data-field="${fieldName}"]`);
    }

    get _fieldConstraints() {
        if (!this._fieldConstraintApis) {
            // For every field to display create an appropriate constraint
            this._fieldConstraintApis = Object.keys(DEFAULT_FIELD_META).reduce(
                (constraints, field) => {
                    constraints[field] = new FieldConstraintApi(
                        () => this.getFieldElement(field),
                        {
                            valueMissing: () =>
                                !this.disabled &&
                                this.required &&
                                this.fieldsToDisplay.indexOf(field) >= 0 &&
                                DEFAULT_FIELD_META[field].required &&
                                isEmptyString(this[field]),
                        }
                    );
                    return constraints;
                },
                {}
            );
        }
        return this._fieldConstraintApis;
    }

    get _combinedConstraint() {
        if (!this._combinedConstraintApi) {
            this._combinedConstraintApi = new FieldConstraintApi(() => this, {
                customError: () =>
                    Object.values(this._fieldConstraints).some(
                        (constraint) => constraint.validity.customError
                    ),
                valueMissing: () =>
                    Object.values(this._fieldConstraints).some(
                        (constraint) => constraint.validity.valueMissing
                    ),
            });
        }
        return this._combinedConstraintApi;
    }

    _reportValidityForField(field) {
        if (this._fieldConstraints[field]) {
            this._fieldConstraints[field].reportValidity((helpMessage) => {
                const fieldElement = this.getFieldElement(field);
                fieldElement.setCustomValidity(helpMessage);
                fieldElement.reportValidity();
            });
        }
    }

    get helptextAlternativeText() {
        return formatLabel(i18n.helpTextAlternativeText, this.label);
    }
}
