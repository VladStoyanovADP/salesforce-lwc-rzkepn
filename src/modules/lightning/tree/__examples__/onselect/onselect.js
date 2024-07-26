import { LightningElement } from 'lwc';

export default class TreeOnselect extends LightningElement {
    selectedItemValue;

    handleOnselect(event) {
        this.selectedItemValue = event.detail.name;
    }

    items = [
        {
            label: 'User',
            name: 'user',
            disabled: false,
            expanded: true,
            items: [
                {
                    label: 'Standard User',
                    name: 'standard',
                    disabled: false,
                    expanded: true,
                    items: [],
                },
                {
                    label: 'Chatter User',
                    name: 'chatter',
                    disabled: false,
                    expanded: true,
                    items: [],
                },
            ],
        },
        {
            label: 'Administrator',
            name: 'admin',
            disabled: false,
            expanded: true,
            items: [
                {
                    label: 'System Administrator',
                    name: 'sysadmin',
                    disabled: false,
                    expanded: true,
                    items: [],
                },
                {
                    label: 'Chatter Administrator',
                    name: 'chatter',
                    disabled: false,
                    expanded: true,
                    items: [],
                },
            ],
        },
        {
            label: 'Community User',
            name: 'community',
            disabled: false,
            expanded: true,
            items: [
                {
                    label: 'Community Login User',
                    name: 'community_login',
                    disabled: false,
                    expanded: true,
                    items: [],
                },
                {
                    label: 'Community Plus Login User',
                    name: 'community_plus',
                    disabled: false,
                    expanded: true,
                    items: [],
                },
            ],
        },
    ];
}
