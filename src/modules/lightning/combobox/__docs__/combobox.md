---
examples:
    - name: basic
      label: Basic Combobox
      description: A combobox enables you to select only one option. Use the onchange event handler to capture what's selected.
    - name: required
      label: Combobox with Selection Required
      description: This combobox requires a selection by specifying the required attribute. If you do not select an option after first interaction, an error is displayed.
    - name: disabled
      label: Disabled Combobox
      description: A disabled combobox is grayed out and can't be clicked.
---

`lightning-combobox` is an input element that enables single selection from a
list of options. The result of the selection is stored as the value of the
input. Multiple selection is currently not supported. To support multiple selection, use `lightning-dual-listbox` instead.

This component implements the
[combobox](https://www.lightningdesignsystem.com/components/combobox/) blueprint in the Salesforce Lightning Design System.

This example creates a list of options with a default selection that's specified with the `value` attribute.
The `options` attribute specifies the name of an array of items for the dropdown list.

```html
<template>
    <lightning-combobox
        name="status"
        label="Status"
        placeholder="Choose Status"
        value={value}
        onchange={handleChange}
        options={statusOptions}
    >
    </lightning-combobox>
    <p>Selected option: {value}</p>
</template>
```

In your JavaScript, define an array of options. Each option corresponds to a list item on the
dropdown list. Define the content of each option by specifying a `value` property and
a `label` property. The `label` value is displayed for the item in the rendered dropdown list, while
the `value` property's value is stored when the item is selected.

Define an optional `description` property to add a line of descriptive text for each option. The
descriptive text displays below the label of the list item.
When adding descriptions, specify a description for each item in a list.
If some items are missing descriptions, the text of the items can be misaligned.

```javascript
import { LightningElement } from 'lwc';
export default class ComboboxExample extends LightningElement {
    statusOptions = [
        { value: 'new', label: 'New', description: 'A new item' },
        {
            value: 'in-progress',
            label: 'In Progress',
            description: 'Currently working on this item',
        },
        {
            value: 'finished',
            label: 'Finished',
            description: 'Done working on this item',
        },
    ];

    value = 'new';

    handleChange(event) {
        // Get the string of the "value" attribute on the selected option
        this.value = event.detail.value;
    }
}
```

Selecting an option triggers the `change` event, which calls the
`handleChange` function. To check which option has been clicked,
use `event.detail.value`.

#### Input Validation

Client-side input validation is available for this component. You can make
the selection required by adding the `required` attribute. An error message is
automatically displayed when an item is not selected and the element is required.

To check the validity states of an input, use the `validity` attribute, which
is based on the `ValidityState` object. You can access the validity states in
your Javascript. This `validity` attribute returns an object with
`boolean` attributes. See [lightning-input](/docs/component-library/bundle/lightning-input/documentation) for more information.

You can override the default message by providing your own value for
`message-when-value-missing`.

#### Usage Considerations

Special characters like `"` must be escaped. For example, you want to display
`"New"`.

```javascript
const options = [
    { value: '"new"', label: '"New"' },
    { value: 'expired', label: 'Expired' },
];
```

When using single quotes in your value, escape the quote with a double slash
instead of a single slash.

`lightning-combobox` doesn't currently support autocomplete or typeahead. The `autocomplete` attribute is reserved for internal use.

`lightning-combobox` appears above all modals and the Salesforce global header.

On mobile devices, `lightning-combobox` has the following limitations.

-   The dropdown menu doesn't scroll correctly when there isn't enough room to display the complete list of options.
-   The mobile viewport doesn't display the dropdown menu correctly especially if the component is placed near the bottom of the page.

We recommend using the HTML `<select>` element on mobile instead.

#### Accessibility

You must provide a text label for accessibility to make the information
available to assistive technology. The `label` attribute creates an HTML label
element for your component. To hide a label from view and make it
available to assistive technology, use the `label-hidden` variant.

This component uses `button` elements for select-only comboboxes to comply with the [Lightning Design System combobox blueprint](https://www.lightningdesignsystem.com/components/combobox/#%22Input%22-markup).

#### Custom Events

**`change`**

The event fired when an item is selected in the combobox.

The `change` event returns the following parameter.

| Parameter     | Type   | Description                       |
| ------------- | ------ | --------------------------------- |
| selectedValue | string | The value of the selected option. |

The event properties are as follows.

| Property   | Value | Description                                                                                               |
| ---------- | ----- | --------------------------------------------------------------------------------------------------------- |
| bubbles    | true  | This event bubbles up through the DOM.                                                                    |
| cancelable | false | This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event. |
| composed   | true  | This event propagates outside of the component in which it was dispatched.                                |

**`open`**

The event fired when the dropdown is opened.

The `open` event does not return any parameters.

| Property   | Value | Description                                                                                                |
| ---------- | ----- | ---------------------------------------------------------------------------------------------------------- |
| bubbles    | false | This event does not bubble.                                                                                |
| cancelable | false | This event has no default behavior that can be canceled. You cannot call `preventDefault()` on this event. |
| composed   | false | This event does not propagate outside of the component in which it was dispatched.                         |
