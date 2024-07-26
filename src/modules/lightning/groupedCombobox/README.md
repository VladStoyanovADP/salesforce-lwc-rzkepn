# lightning-grouped-combobox

> `lightning-grouped-combobox` is internal-only. It's not yet supported for use by customers on the Salesforce platform.

-   [Overview](#overview)
-   [Implementing Autocomplete Behavior](#implementing-autocomplete-behavior)
-   [Updating Dropdown Items](#updating-dropdown-items)
-   [Attributes](#attributes)
-   [Methods](#methods)
-   [Custom Events](#custom-events)
-   [Usage Considerations](#usage-considerations)
-   [Aura Examples](#aura-examples)
-   [LWC Examples](#lwc-examples)

## Overview

`lightning-grouped-combobox` displays dropdown options with icons and autocomplete (typeahead) support. Optionally it supports a filter and pills. It uses `lightning-base-combobox` internally and provides you with full control over the displayed data. You can handle the text input with your own custom behavior.

This component is based on [combobox (grouped options)](https://lightningdesignsystem.com/components/combobox/#Grouped-options), [grouped comboboxes](<https://lightningdesignsystem.com/components/combobox/#Grouped-Comboboxes-(Cross-entity-Polymorphic)>) and [autocomplete combobox](https://lightningdesignsystem.com/components/combobox/#Autocomplete-Combobox) in the Lightning Design System.

In Lightning Experience, many autocomplete components are implemented using `lightning-grouped-combobox`.

Here's an example on how to implement typeahead using `lightning-grouped-combobox`. You must handle user input and set the items for the dropdown options, which is described in detail in the next sections.

```html
<lightning-grouped-combobox
    label="Contact"
    placeholder="Search Contacts..."
    items={_contactItems}
    input-text={_inputText}
    show-activity-indicator={_showSpinner}
    ontextinput={handleContactInput}
    onselect={handleContactSelect}
>
</lightning-grouped-combobox>
```

## Implementing Autocomplete Behavior

A combobox with autocomplete behavior allows you to select an option from the dropdown list. The list can change depending on the text input. Displaying a subset of items is useful when the list is very large, as user input can display and update the options that match the input.

In this example, a set of items provided by `defaultContactItems` is displayed in the dropdown list as a user types text in the input field. Optionally, you can display a spinner while the the input text and items are being matched. If no items are found, you can provide an option to create a new record or perform advanced search on the typed text.

```javascript

import { LightningElement, track } from `lwc`;

const defaultContactItems = [{ type: 'option-inline',
                               iconName: 'utility:add',
                               text: 'New Contact',
                               value: 'actionNewContact'}];

export default class AutocompleteExample extends LightningElement {
    @track _contactItems;
    @track _inputText;
    @track _showSpinner;

    connectedCallback() {
       // You can set _contactItems here to most-used-contacts, along with an action
       // to create a new contact
        this._contactItems = defaultContactItems;
    }

    handleContactInput(event) {
        const enteredText = event.target.inputText.toLowerCase();

        this._showSpinner = false;
        if (enteredText === '') {
            this._contactItems = defaultContactItems;
        } else {
            this._showSpinner = true;
            // In a more realistic scenario you’d get the matching data from the server
            // instead and transform it into items
            this._contactItems = this.findMatchingContacts(enteredText);
            this._contactItems.push({
                type: 'option-inline',
                iconName: 'utility:add',
                text: 'New Contact',
                value: 'actionNewContact',
            });
            this._contactItems.unshift({
                type: 'option-inline',
                iconName: 'utility:search',
                text: `"${enteredText}" in Contacts`,
                value: 'actionSearchContacts',
            });

            this._showSpinner = false;

        }
    }

    handleContactSelect(event) {
        alert(`You selected ${event.detail.value}`);
    }

    findMatchingContacts(enteredText) {
        // Go to the server and fetch the matching contacts, each contact would have .Id
        // and .FullName properties
        const matchingContactsFromTheServer = [];
        return matchingContactsFromTheServer.map(contact => {
            return {
                type: 'option-inline',
                iconName: 'standard:contact',
                text: contact.FullName,
                value: contact.Id
            };
        });
    }
}
```

## Updating Dropdown Items

The dropdown list is displayed if there's at least one item. If `items` is empty, the dropdown is hidden.

`items` support the following types: `option-inline ` and `option-card`. Grouping of items, which is a list of items with an associated label, are also supported.

`option-inline` is an inline option that supports a left icon and text, and `option-card` supports left/right icons, text and subText. Items can have any combination of the above.

Here’s an example of items without groups, using inline options:

```javascript
[
	 {
		type: 'option-inline',
		text: 'John Doe',
		iconName: 'standard:contact'
        iconAlternativeText: 'Contact icon',
        value: 'a07B0000001fDrS' // ID of the contact
	 },
	 {
		type: 'option-inline',
		text: 'Jane Dowson',
		iconName: 'standard:contact'
        iconAlternativeText: 'Contact icon',
        value: 'a07B0000001gAbCD' // ID of the contact
	 }
]
```

Here's an example that uses a card option:

```javascript
[
    {
        type: 'option-card',
        text: 'Global Media',
        subText: '(905) 555-1212',
        iconName: 'standard:account',
        iconAlternativeText: 'Account icon',
        value: 'b07B0000001gDeFg', // ID of the account
    },
];
```

Here's an example that defines several groups of inline options.

```javascript
[
  { label: "Group One", items: [ {type: 'option-inline', … }, … ] },
  { label: "Group Two", items: [ {type: 'option-inline', … }, … ] },
...
]
```

To highlight part of the text or subtext in a dropdown item that matches user input, use the `"highlight: true"` property and pass the text you want to highlight to `text` and `subText`. This example bolds `Glob` in the `Global` text.

```javascript
	text: [{text: ‘Glob’, highlight: true}, {text: ‘al’}]
```

## Attributes

Use the following attributes to customize `lightning-grouped-combobox`.

| Attribute Name                   | Type                                                                                                                                                                                                                                           | Description                                                                                                                                                                                                                                      |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| label                            | string                                                                                                                                                                                                                                         | The text label for the combobox.                                                                                                                                                                                                                 |
| placeholder                      | string                                                                                                                                                                                                                                         | The placeholder text on the input field. The default is 'Select an Item'.                                                                                                                                                                        |
| input-text                       | string                                                                                                                                                                                                                                         | The default text or existing value in the input field.                                                                                                                                                                                           |
| items                            | object                                                                                                                                                                                                                                         | The list of items that's displayed in the dropdown. This list can be updated to match user input. See the **Updating Dropdown Items** section.                                                                                                   |
| variant                          | string                                                                                                                                                                                                                                         | Changes the appearance of the combobox. Supported variants include `label-hidden`, `label-stacked`, and `label-inline`. The default is `standard`.                                                                                               |
| input-icon-name                  | string                                                                                                                                                                                                                                         | The icon that appears on the input field. The default is `utility:search`.                                                                                                                                                                       |
| input-icon-size                  | string                                                                                                                                                                                                                                         | The size of the icon that appears on the input field. The default is `x-small`.                                                                                                                                                                  |
| input-icon-alternative-text      | string                                                                                                                                                                                                                                         | The alternative text for the icon that's displayed on the input field.                                                                                                                                                                           |
| input-maxlength                  | integer                                                                                                                                                                                                                                        | The maximum number of characters allowed for the input field.                                                                                                                                                                                    |
| show-activity-indicator          | boolean                                                                                                                                                                                                                                        | Displays a spinner in the input field to indicate activity. The default is false.                                                                                                                                                                |
| show-dropdown-activity-indicator | boolean                                                                                                                                                                                                                                        | Displays a spinner in the dropdown list to indicate activity. The default is false.                                                                                                                                                              |
| value                            | string                                                                                                                                                                                                                                         | When not-empty flags to the component that a valid selection has been made, used only for constraint validation in conjunction with the `required` attribute. If empty, and `required` is set to true the component will be in an invalid state. |
| required                         | boolean                                                                                                                                                                                                                                        | Specifies whether an input value is required. The default is false. When `true` must be used in conjunction with `value`.                                                                                                                        |
| disabled                         | boolean                                                                                                                                                                                                                                        | Specifies whether the input field is disabled. Disabled fields are grayed out and users cannot interact with them. The default is false.                                                                                                         |
| field-level-help                 | string                                                                                                                                                                                                                                         | Help text detailing the purpose and function of the combobox, displayed on hover.                                                                                                                                                                |
| readonly                         | boolean                                                                                                                                                                                                                                        | Specifies whether the input field is read-only. The default is false.                                                                                                                                                                            |
| validity                         | boolean                                                                                                                                                                                                                                        | Represents the validity states that an element is in, with respect to constraint validation.                                                                                                                                                     |
| pills                            | object                                                                                                                                                                                                                                         | A list of pills that includes the `type`, `href`, `label`, `iconName`, and `alternativeText`. Pills are used for multi-selection and appear under the input.                                                                                     |
| input-pill                       | The pill that appears in the input field, which is supported for single-selection. Displaying this pill prevents you from typing or selecting another option. An "x" button is present on the pill for the user to remove the selected option. |

Pass in the following key-value pairs to `items`.

| Key Name                 | Type   | Description                                                                                        |
| ------------------------ | ------ | -------------------------------------------------------------------------------------------------- |
| type                     | string | Supported types include `option-inline` and `option-card`.                                         |
| iconName                 | string | The icon that appears on the left of the option name.                                              |
| iconSize                 | string | Supported by `option-card` only. The size of the icon that appears on the left of the option name. |
| iconAlternativeText      | string | Assistive text for the icon that appears on the left of the option name                            |
| rightIconName            | string | The icon that appears on the right of the option name. Supported for the `option-card` type only.  |
| rightIconSize            | string | The size of the icon that appears on the right of the option name. The default is `small`.         |
| rightIconAlternativeText | string | Assistive text for the icon that appears on the right of the option name.                          |
| text                     | string | The text to display for the option.                                                                |
| subText                  | string | The subtitle to display below the text. Supported for `option-card` only.                          |
| value                    | string | The value associated with the option.                                                              |

## Methods

**`blur()`**

Removes focus from the input element.

**`focus()`**

Sets focus on the input element.

**`focusAndOpenDropdownIfNotEmpty()`**

Displays the dropdown list if there is at least one item or `show-dropdown-activity-indicator` is set to true.

**`checkValidity()`**

Indicates whether the combobox has any validity errors. Returns the valid attribute value (Boolean) on the ValidityState object.

**`reportValidity()`**

Displays the error messages and returns false if the input is invalid. If the input is valid, `reportValidity()` clears displayed error messages and returns true.

**`setCustomValidity(message)`**

Sets a custom error message to be displayed when the combobox value is submitted.

message (string) - The string that describes the error. If message is an empty string, the error message is cleared.

## Custom Events

**`dropdownopenrequest`**

The event fired when the dropdown list is requested to be opened. An empty dropdown won't be opened. However, you can lazy load the dropdown options for the dropdown to open.

**`endreached`**

The event fired when the bottom of the dropdown list is reached while scrolling.

**`pillremove`**

The event fired when a pill's remove button is pressed.
`event.detail` returns the pill that has had its remove button pressed.

**`textchange`**

The event fired when the text in the input has been committed by the user, either by pressing Enter, or by blurring away from the input. Use this when you don't need to respond to live user typing.
Use `event.target.inputText` to return the updated text input.

**`textinput`**

The event fired when the input text changes. Use this when you want to react to live-typing of the text. Use `event.target.inputText` to return the updated text input.

**`select`**

The event fired when an item is selected on the dropdown list, either through keyboard interaction or via mouse interaction. `event.detail.value` returns the value of the selected item.

**`selectfilter`**

The event fired when an item is selected on the object filter, either through keyboard interaction or via mouse interaction. `event.detail.value` returns the value of the selected item.

## Usage Considerations

When customizing autocomplete behavior for `lightning-grouped-combobox`, consider the following use cases.

-   Display default options when the input is focused or display matches only when more than X character have been typed
-   Display a visual cue to show when the data is loaded from the server-side, on the input, or inside the dropdown list
-   Display default items when there are no matches such as enabling an option to create a new record or hide the dropdown list

If you want a dropdown component that doesn't need autocomplete behavior, consider using either `lightning-combobox` or `lightning-picklist`. The latter displays a simple dropdown list for single selection, and a dual listbox for multiple selection. `lightning-picklist` displays the native `select` element on mobile devices. For example, base components like `lightning-input-address` and `lightning-input-field` use `lightning-picklist` internally.

## Examples

For an Aura implementation, see `exampleGroupedCombobox.cmp` in this repo. For an LWC implementation, see `lightning-lookup-desktop` in this repo.
