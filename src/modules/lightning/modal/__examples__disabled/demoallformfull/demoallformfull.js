import { api } from 'lwc';
import LightningModal from 'lightning/modal';
import ModalAllMulti from 'modal/allmulti';

// this form is loosely based on SLDS form blueprint, Stacked Alignment
// https://www.lightningdesignsystem.com/components/form-element/#Stacked-Alignment

export default class ModalForm extends LightningModal {
    @api heading = '';
    @api options = [];

    buttonOptions = [
        {
            id: 1,
            variant: 'neutral',
            label: 'Close This Modal',
            focusName: 'focus-footer-button-01',
        },
    ];

    // toggle disable close button state
    toggleCloseButtonLabel = {
        label: 'Disable Close Button',
        labelToggle: 'Enable Close Button',
    };
    computedDisableCloseLabel = this.toggleCloseButtonLabel.label;

    // form fields
    assignedTo = null;
    teamName = null;
    securityAssessReq = true;
    statusValue = 'inProgress';
    personalSettings = null;
    slaSerialNum = null;
    slaExpireDate = null;
    slaExpireTime = null;
    location = null;
    selectedLangs = null;

    addressBilling = {
        street: '',
        city: '',
        province: '',
        postalCode: '',
        country: 'US',
    };
    addressShipping = {
        street: '',
        city: '',
        province: '',
        postalCode: '',
        country: 'US',
    };

    openSecondModal() {
        ModalAllMulti.open({
            size: 'small',
            heading: 'Second Modal w/ higher z-index',
            description: 'A description of the second modal',
            // ModalDemo
            options: this.buttonOptions,
        }).then((result) => {
            if (result === null) {
                this.demoResult = { action: 'dismissed' };
            } else {
                this.demoResult = result;
            }
        });
    }

    handleButtonOpenSecondModal() {
        this.openSecondModal();
    }

    handleButtonToggleDisableButton() {
        const newDisableCloseValue = !this.disableClose;
        this.disableClose = newDisableCloseValue;
        this.computedDisableCloseLabel = newDisableCloseValue
            ? this.toggleCloseButtonLabel.labelToggle
            : this.toggleCloseButtonLabel.label;
    }

    // handle events in the form
    handleButtonSubmit() {
        const data = this.compileData();
        const dataAsString = JSON.stringify(data);
        this.close(dataAsString);
    }

    handleButtonCancel() {
        this.close({ action: 'cancel' });
    }

    handleTextInput(event) {
        const { detail, target } = event;
        const inputElem = target.shadowRoot.querySelector('input');
        const inputName = inputElem.getAttribute('name');
        if (inputName) {
            this[inputName] = detail.value || '';
        }
    }

    handleDateInput(event) {
        const { detail, target } = event;
        const pickerElem = target.shadowRoot.querySelector(
            'lightning-datepicker'
        );
        const inputElem = pickerElem.shadowRoot.querySelector('input');
        const inputName = inputElem.getAttribute('name');
        if (inputName) {
            this[inputName] = detail.value || '';
        }
    }

    handleTimeInput(event) {
        const { detail, target } = event;
        const pickerElem = target.shadowRoot.querySelector(
            'lightning-timepicker'
        );
        const comboBoxElem = pickerElem.shadowRoot.querySelector(
            'lightning-base-combobox'
        );
        const inputElem = comboBoxElem.shadowRoot.querySelector('input');
        const inputName = inputElem.getAttribute('name');
        if (inputName) {
            this[inputName] = detail.value || '';
        }
    }

    handleChangeStatus(event) {
        this.statusValue = event.detail.value;
    }

    handleChangeBilling(event) {
        const { street, city, province, country, postalCode } = event.detail;
        this.addressBilling = { street, city, province, country, postalCode };
    }

    handleChangeShipping(event) {
        const { street, city, province, country, postalCode } = event.detail;
        this.addressShipping = { street, city, province, country, postalCode };
    }

    get statusOptions() {
        return [
            { label: 'New', value: 'new' },
            { label: 'In Progress', value: 'inProgress' },
            { label: 'Finished', value: 'finished' },
        ];
    }

    // these are by no means intended to be complete country or province lists
    // only enough values to provide some examples to choose from
    countryProvinceMap = {
        US: [
            { label: 'California', value: 'CA' },
            { label: 'Texas', value: 'TX' },
            { label: 'Washington', value: 'WA' },
        ],
        CN: [
            { label: 'GuangDong', value: 'GD' },
            { label: 'GuangXi', value: 'GX' },
            { label: 'Sichuan', value: 'SC' },
        ],
        CA: [
            { label: 'Alberta', value: 'AB' },
            { label: 'British Columbia', value: 'BC' },
            { label: 'Manitoba', value: 'MB' },
            { label: 'New Brunswick', value: 'NB' },
            { label: 'Newfoundland and Labrador', value: 'NL' },
            { label: 'Nova Scotia', value: 'NS' },
            { label: 'Ontario', value: 'ON' },
            { label: 'Prince Edward Island', value: 'PE' },
            { label: 'Quebec', value: 'QC' },
            { label: 'Saskatchewan', value: 'SK' },
        ],
        SP: [
            { label: 'Ávila', value: 'AV' },
            { label: 'Burgos', value: 'BU' },
            { label: 'Cantabria', value: 'S' },
            { label: 'Goiás', value: 'GO' },
            { label: 'Paraíba', value: 'PB' },
            { label: 'Tyrol', value: 'TIR' },
        ],
    };

    countryOptions = [
        { label: 'United States', value: 'US' },
        { label: 'China', value: 'CN' },
        { label: 'Canada', value: 'CA' },
        { label: 'Spain', value: 'SP' },
    ];

    get getProvinceOptsBilling() {
        return this.countryProvinceMap[this.addressBilling.country];
    }

    get getProvinceOptsShipping() {
        return this.countryProvinceMap[this.addressShipping.country];
    }

    get getCountryOptsBilling() {
        return this.countryOptions;
    }

    get getCountryOptsShipping() {
        return this.countryOptions;
    }

    compileData() {
        const {
            addressShipping,
            addressBilling,
            statusValue,
            assignedTo,
            teamName,
            securityAssessReq,
            personalSettings,
            slaSerialNum,
            slaExpireDate,
            slaExpireTime,
            location,
            selectedLangs,
        } = this;
        return {
            addressShipping,
            addressBilling,
            statusValue,
            assignedTo,
            teamName,
            securityAssessReq,
            personalSettings,
            slaSerialNum,
            slaExpireDate,
            slaExpireTime,
            location,
            selectedLangs,
        };
    }
}
