---
examples:
    - name: basic
      label: Basic Checkbox Group
      description: A checkbox group contains at least two checkboxes. This example presets the selected value to the first option.
    - name: required
      label: Checkbox Group with Required Selection
      description: This checkbox group requires a selection by specifying the required attribute. If you do not select an option after first interaction, an error is displayed.
    - name: disabled
      label: Disabled Checkbox Group
      description: This checkbox group specifies the disabled attribute. The disabled options are grayed out and you can't change the selection.
---

A `lightning-checkbox-group` component represents a checkbox group that enables
selection of single or multiple options.

If the `required` attribute is set, at least one checkbox must be
selected. When a user interacts with the checkbox group and doesn't make a
selection, an error message is displayed. You can provide a custom error
message using the `message-when-value-missing` attribute.

If the `disabled` attribute is set, checkbox selections can't be
changed.

This example creates a checkbox group with two options and `option1` is
selected by default. At least one checkbox must be selected because the `required`
attribute is specified.

```html
<template>
    <lightning-checkbox-group
        name="checkboxGroup"
        label="Checkbox Group"
        options={options}
        value={value}
        onchange={handleChange}
        required
    >
    </lightning-checkbox-group>
</template>
```

The `value` attribute contains an array of checkboxes. To select a checkbox, pass in its value to the `value` attribute.
In this example, only `option1` is selected.

```javascript
//mycomponentname.js

import { LightningElement } from 'lwc';
export default class MyComponentName extends LightningElement {
    options = [
        { label: 'Ross', value: 'option1' },
        { label: 'Rachel', value: 'option2' },
    ];

    // Select option1 by default
    value = ['option1'];

    handleChange(event) {
        const changeValue = event.detail.value;
        alert(changeValue);
    }
}
```

To retrieve the values when a checkbox
is selected or deselected, use `event.detail.value` in the `change` event handler.

#### Creating Checkboxes

To create checkboxes, pass in the following properties to the `options` attribute.

| Property | Type   | Description                                                    |
| -------- | ------ | -------------------------------------------------------------- |
| label    | string | The text that displays next to a checkbox.                     |
| value    | string | The string that's used to identify which checkbox is selected. |

#### Input Validation

Client-side input validation is available for this component. For example, an error message is displayed when the checkbox group is marked required and no option is selected. Note that a disabled checkbox group is always valid.

The validation occurs for the checkbox group, not for an individual checkbox. To override the default message "Complete this field" displayed when a selection on a checkbox group is required and no option is selected, use the `message-when-value-missing` attribute. This message is displayed when you remove focus from the checkbox group.

The `validity` attribute returns the ValidityState object, with the following supported properties.

-   `valid`: Returns true if the checkbox group meets all its validation constraints.
-   `valueMissing`: Returns true if a selection in the checkbox group is required but no checkbox is selected.

Other properties such as `badInput` are not supported.

This example creates a checkbox group that requires a selection and a button that checks validity when clicked.

```html
<template>
    <lightning-checkbox-group
        label="Select a color"
        options={options}
        value={value}
        required
    ></lightning-checkbox-group>
    <lightning-button
        label="Check validity"
        onclick={handleValidity}
    ></lightning-button>
</template>
```

For checkbox groups that are required, the `checkValidity()` method returns true if at least one checkbox is selected, or false if none is selected. Calling `checkValidity()` is equivalent to returning `validity.valid` on the checkbox group.

To programmatically display error messages on an invalid checkbox group, use the `reportValidity()` method.

```javascript
import { LightningElement } from 'lwc';

export default class CheckboxGroupRequiredValidity extends LightningElement {
    value = [];
    message = '';

    get options() {
        return [
            { label: 'Red', value: 'red' },
            { label: 'Green', value: 'green' },
            { label: 'Blue', value: 'blue' },
        ];
    }
    handleValidity(e) {
        var checkboxGroup = this.template.querySelector(
            'lightning-checkbox-group'
        );
        if (checkboxGroup.checkValidity()) {
            this.message = "That's a great selection!";
        } else {
            // Shows the error immediately without user interaction
            checkboxGroup.reportValidity();
            this.message = 'Select your favorite color and try again.';
        }
    }
}
```

For custom validity error messages, display the message using `setCustomValidity()` and `reportValidity()`. `setCustomValidity()` overrides the error message you provide using the `message-when-value-missing` attribute. For more information, see the [lightning-input](/docs/component-library/bundle/lightning-input/documentation) documentation.

#### Component Styling

`lightning-checkbox-group` implements the [checkbox](https://www.lightningdesignsystem.com/components/checkbox/) blueprint in the Salesforce Lightning Design System (SLDS).

You can use a combination of the `variant` and `class` attributes to customize the checkbox group.

##### Variants

Use the `variant` attribute with one of these values to apply different label positioning.

-   `label-hidden` hides the checkbox group label but make it available to assistive technology. This variant does not hide the option labels.
-   `label-inline` horizontally aligns the checkbox group label and options.
-   `label-stacked` places the checkbox group label above the options.
-   `standard` is the default value, which displays the checkbox group label above the options.

##### Customize Component Styling

To apply additional styling, use the SLDS [utility classes](https://www.lightningdesignsystem.com/utilities/alignment) with the `class` attribute.

This example adds a box theme around the checkbox group using an SLDS class.

```html
<lightning-checkbox-group
    class="slds-box"
    label="Select a color"
    options={options}
    value={value}
>
</lightning-checkbox-group>
```

To apply custom styling, use the `:host` selector. Use SLDS styling hooks to customize the component's styles. For example, change the checkmark color and background color when an option is selected.

```css
:host {
    --slds-c-checkbox-color-background-checked: green;
    --slds-c-checkbox-mark-color-foreground: yellow;
}
```

See [Styling Hooks Overview](https://www.lightningdesignsystem.com/components/checkbox/#Styling-Hooks-Overview) for a list of CSS custom properties.

#### Usage Considerations

`lightning-checkbox-group` is useful for grouping a set of checkboxes. If you
have a single checkbox, use `lightning-input type="checkbox"` instead.

#### Accessibility

The checkbox group is nested in a `fieldset` element that contains a `legend`
element. The legend contains the `label` value. The `fieldset` element enables
grouping of related checkboxes to facilitate tabbing navigation and speech
navigation for accessibility purposes. Similarly, the `legend` element
improves accessibility by enabling a caption to be assigned to the `fieldset`.
