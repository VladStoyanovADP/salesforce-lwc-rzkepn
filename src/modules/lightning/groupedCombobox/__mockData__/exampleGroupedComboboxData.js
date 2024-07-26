const exampleData = {};

exampleData.exampleInlineOption = {
    type: 'option-inline',
    iconName: 'utility:search',
    text: 'Advanced Search...',
    value: 'actionSearchAdvanced',
};
exampleData.exampleCardOption = {
    type: 'option-card',
    text: 'Global Media',
    iconName: 'standard:account',
    subText: '(905) 555-1212',
    value: 'accountGlobalMedia',
};
exampleData.exampleCardOptionHighlighted = {
    type: 'option-card',
    text: 'Global Media',
    highlight: true,
    iconName: 'standard:account',
    subText: '(905) 555-1212',
    value: 'accountGlobalMediaOptionHighlighted',
};
exampleData.exampleDataWithHighlightedCard = [
    exampleData.exampleInlineOption,
    exampleData.exampleCardOptionHighlighted,
    exampleData.exampleCardOption,
];
exampleData.exampleGroups = [
    exampleData.exampleInlineOption,
    {
        label: 'Group 1',
        items: [Object.assign({}, exampleData.exampleInlineOption)],
    },
    {
        label: 'Group 2',
        items: [
            exampleData.exampleCardOptionHighlighted,
            exampleData.exampleInlineOption,
            exampleData.exampleCardOption,
        ],
    },
    {
        label: 'Group 3',
        items: [
            exampleData.exampleCardOptionHighlighted,
            exampleData.exampleInlineOption,
            exampleData.exampleCardOption,
        ],
    },
];
exampleData.exampleItems = [
    exampleData.exampleInlineOption,
    exampleData.exampleCardOption,
];
exampleData.exampleItemsManyRecords = [...new Array(50)].map(
    () => exampleData.exampleCardOption
);

exampleData.examplePills = [
    {
        type: 'icon',
        href: 'https://www.salesforce.com/',
        label: 'Pill 1 Label',
        iconName: 'standard:event',
        alternativeText: 'white event icon in a pink square',
    },
    {
        type: 'icon',
        href: 'https://www.salesforce.com/',
        label: 'Pill 2 Label',
        iconName: 'standard:account',
        alternativeText: 'white account icon in a blue square',
    },
];

export default exampleData;
