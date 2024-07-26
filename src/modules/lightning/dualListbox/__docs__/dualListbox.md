---
examples:
    - name: simple
      label: Simple Dual Listbox
      description: A simple dual listbox with options. Use the onchange event handler to capture what's selected.
    - name: selected
      label: Dual Listbox with Default Selected Options
      description: This dual listbox shows some pre-selected options.
    - name: required
      label: Dual Listbox with Required Selected Options
      description: This dual listbox shows required selected options.
    - name: minmax
      label: Dual listbox with Minimum and Maximum Required Options
      description: This dual listbox requires you to select a minimum and maximum number of options.
---

A `lightning-dual-listbox` component represents two side-by-side listboxes.
Select one or more options in the list on the left. Move selected options to
the list on the right. The order of the selected options is maintained and you
can reorder options.

Here's an example that creates a simple dual listbox with 8 options. Options
7, 2 and 3 are selected under the second listbox. Options 2 and 7
are required options.

```html
<template>
    <lightning-dual-listbox
        id="selectOptions"
        name="Select Options"
        label="Select Options"
        source-label="Available Options"
        selected-label="Selected Options"
        options={listOptions}
        value={defaultOptions}
        required-options={requiredOptions}
        onchange={handleChange}
    >
    </lightning-dual-listbox>
</template>
```

```javascript
import { LightningElement } from 'lwc';
export default class MyComponentName extends LightningElement {
    listOptions = [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
        { value: '3', label: 'Option 3' },
        { value: '4', label: 'Option 4' },
        { value: '5', label: 'Option 5' },
        { value: '6', label: 'Option 6' },
        { value: '7', label: 'Option 7' },
        { value: '8', label: 'Option 8' },
    ];

    defaultOptions = ['7', '2', '3'];

    requiredOptions = ['2', '7'];

    handleChange(event) {
        // Get the list of the "value" attribute on all the selected options
        const selectedOptionsList = event.detail.value;
        alert(`Options selected: ${selectedOptionsList}`);
    }
}
```

To specify the number of options users can select, use the `min` and `max`
attributes. For example, if you set `min` to 3 and `max` to 8, users must
select at least 3 options and at most 8 options.

#### Input Validation

Client-side input validation is available for this component. Note that disabled fields are always valid.

To check the validity states of the input, use the `validity` attribute to return an object with read-only `boolean` attributes.

-   `rangeOverflow`
-   `rangeUnderflow`
-   `valueMissing`
-   `valid`
    For more information on the `validity` attribute, see [lightning-input](bundle/lightning-input/documentation).

#### Error Messages

When an input validation fails, the following messages are displayed by default.

-   `rangeOverflow`: Select at most [max] options
-   `rangeUnderflow`: At least [min] options must be selected
-   `valueMissing`: An option must be selected

[max] and [min] refer to the numerical values for the `max` and `min` attributes you provide.

You can override the default messages by providing your own values for these attributes: `message-when-range-overflow`, `message-when-range-underflow`, and `message-when-value-missing`.

#### Custom Validity Error Messages

To programmatically display error messages on invalid fields, use the `reportValidity()` method. For custom validity error messages, display the message using `setCustomValidity()` and `reportValidity()`. For more information, see [lightning-input](bundle/lightning-input/documentation).

#### Component Styling

`lightning-dual-listbox` implements the [Dueling Picklist](https://www.lightningdesignsystem.com/components/dueling-picklist/) blueprint
in the Salesforce Lightning Design System (SLDS).

##### Variants

Use the `variant` attribute with one of these values to position the labels differently relative to the picklist field.

-   `standard` is the default
-   `label-hidden` hides the label visually but makes it available to assistive technology. If you provide a value for `field-level-help`, the tooltip icon is still displayed.
-   `label-inline` aligns the label next to the picklist field
-   `label-stacked` places the label above the picklist field

##### Customize Component Styling

To apply additional styling, use the SLDS [utility classes](https://www.lightningdesignsystem.com/utilities/alignment) with the `class` attribute.

To customize the SLDS styles on the "Move selection to Selected" or "Move selection up" buttons, use SLDS styling hooks. For more information, see [Style Components Using Lightning Design System Styling Hooks](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-css-custom-properties) in the Lightning Web Components Developer Guide.

#### Usage Considerations

To retrieve the selected values, use the `onchange` handler.

```
handleChange(event) {
    // Retrieve an array of the selected options
    const selectedOptionsList = event.detail.value;
    alert(`Options selected: ${selectedOptionsList}`);
}
```

The `onchange` handler is triggered when you click the left and right buttons to
move options from one list to another or when you change the order of options
in the selected options list.

#### Accessibility

Use the following keyboard shortcuts to work with dual listboxes.

-   Click - Select a single option.
-   Cmd+Click - Select multiple options or deselect selected options.
-   Shift+Click - Select all options between the current and last clicked option.

When focus is on options:

-   Up Arrow - Move selection to previous option.
-   Down Arrow - Move selection to next option.
-   Cmd/Ctrl+Up Arrow - Move focus to previous option.
-   Cmd/Ctrl+Down Arrow - Move focus to next option.
-   Ctrl+Space - Toggle selection of focused option.
-   Cmd/Ctrl+Right Arrow - Move selected options to right listbox.
-   Cmd/Ctrl+Left Arrow - Move selected options to left listbox.
-   Tab - Move focus to the buttons or between boxes.

When focus is on a button:

-   Enter - Perform the operation associated with that button.

#### Custom Events

**`change`**

The event fired when an item is selected in the combobox.

The `change` event returns the following parameter.

| Parameter | Type   | Description                               |
| --------- | ------ | ----------------------------------------- |
| value     | string | A comma-separated list of selected items. |

The event properties are as follows.

| Property   | Value | Description                                                                                               |
| ---------- | ----- | --------------------------------------------------------------------------------------------------------- |
| bubbles    | true  | This event bubbles up through the DOM.                                                                    |
| cancelable | false | This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event. |
| composed   | true  | This event propagates outside of the component in which it was dispatched.                                |
