/* Contains mock data for modal testing */

const formData = [
    {
        name: null,
        value: null,
        type: 'heading',
        numTabsToNext: 1,
    },
    {
        name: 'assignedTo',
        value: 'Jonathan Marks',
        type: 'text',
        numTabsToNext: 1,
    },
    {
        name: 'teamName',
        value: 'Chrome Webdrivers',
        type: 'text',
        numTabsToNext: 1,
    },
    {
        name: 'statusValue',
        value: 'New',
        result: 'new',
        type: 'combobox',
        numTabsToNext: 1,
    },
    {
        name: 'personalSettings',
        value: 'Updated',
        type: 'text',
        numTabsToNext: 1,
    },
    {
        name: 'slaSerialNum',
        value: '8675997511',
        type: 'text',
        numTabsToNext: 1,
    },
    {
        name: 'slaExpireDate',
        value: 'Sep 8, 2021',
        result: '2021-09-08',
        type: 'datepicker',
        numTabsToNext: 2,
    },
    {
        name: 'slaExpireTime',
        value: 8,
        result: '02:00:00.000',
        type: 'timepicker',
        numTabsToNext: 1,
    },
    {
        name: 'location',
        value: 'Downtown Offices',
        type: 'text',
        numTabsToNext: 1,
    },
    {
        name: 'selectedLangs',
        value: 'English, Spanish, Chinese',
        type: 'text',
        numTabsToNext: 2,
    },

    {
        name: 'addressBilling.country',
        value: 3,
        result: 'SP',
        type: 'combobox',
        numTabsToNext: 1,
    },
    {
        name: 'addressBilling.street',
        value: '32184 Excellent Street',
        type: 'text',
        numTabsToNext: 1,
    },
    {
        name: 'addressBilling.city',
        value: 'Lowertown',
        type: 'text',
        numTabsToNext: 1,
    },
    {
        name: 'addressBilling.province',
        value: 4,
        result: 'GO',
        type: 'combobox',
        numTabsToNext: 1,
    },
    {
        name: 'addressBilling.postalCode',
        value: '8K2J3P1',
        type: 'text',
        numTabsToNext: 2,
    },

    {
        name: 'addressShipping.country',
        value: 2,
        result: 'CN',
        type: 'combobox',
        numTabsToNext: 1,
    },
    {
        name: 'addressShipping.street',
        value: '32342 Postland Avenue',
        type: 'text',
        numTabsToNext: 1,
    },
    {
        name: 'addressShipping.city',
        value: 'Uppertown',
        type: 'text',
        numTabsToNext: 1,
    },
    {
        name: 'addressShipping.province',
        value: 2,
        result: 'GX',
        type: 'combobox',
        numTabsToNext: 1,
    },
    {
        name: 'addressShipping.postalCode',
        value: '8782399-219',
        type: 'text',
        numTabsToNext: 0,
    },
];

module.exports = {
    formData,
};
