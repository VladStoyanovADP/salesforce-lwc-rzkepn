---
examples:
    - name: basic
      label: Basic Radio Group
      description: A radio group contains at least two options and only one can be selected.
    - name: required
      label: Required Radio Group
      description: A radio group displays a field-level error if it's required and no option is selected after the first interaction.
    - name: disabled
      label: Disabled Radio Group
      description: Disabled options are grayed out and you can't interact with them.
    - name: button
      label: Radio Group with Button Type
      description: A radio group can use the button type to display a different visual style.
    - name: buttonrequired
      label: Required Radio Group with Button Type
      description: A radio button group displays a field-level error if it's required and no option is selected after the first interaction.
    - name: buttondisabled
      label: Disabled Radio Group with Button Type
      description: Disabled options are grayed out and you can't interact with them.
---

A `lightning-radio-group` component represents a group of radio buttons that permit only
one button to be selected at a time. The component renders radio button `<input>` elements
and assigns the same value to the `name` attribute for each element. The common
`name` attribute joins the elements in a group. If you select any radio button in that
group, any previously selected button in the group is deselected.

In general, we don't recommend setting the `name` attribute in `lightning-radio-group`.
The component automatically generates a unique value for `name` if none is provided. The generated value ensures
a common name for the `<input>` elements rendered for the radio button group, and is unique in the page.

See **Reusing `lightning-radio-group` in a Page** for `name` attribute considerations if you want to use the component multiple times in a page.

If the `required` attribute is specified, at least one radio button must be selected.
When a user interacts with the radio button group and doesn't make a selection, an
error message is displayed.

If the `disabled` attribute is specified, radio button selections can't be changed.

This example creates a radio button group with two options and `option1` is selected
by default. One radio button must be selected as the `required` attribute is
specified.

```html
<template>
    <lightning-radio-group
        label="Radio Button Group"
        options={options}
        value={value}
        onchange={handleChange}
        required
    >
    </lightning-radio-group>
</template>
```

You can check which values are selected by using the `value` attribute.
To retrieve the values when the selection is changed, use the `onchange` event handler and call
`event.detail.value`.

```javascript
import { LightningElement } from 'lwc';
export default class MyComponentName extends LightningElement {
    options = [
        { label: 'Ross', value: 'option1' },
        { label: 'Rachel', value: 'option2' },
    ];

    // Select option1 by default
    value = 'option1';

    handleChange(event) {
        const selectedOption = event.detail.value;
        console.log('Option selected with value: ' + selectedOption);
    }
}
```

#### Creating Radio Buttons

To create radio buttons, pass in the following properties to the `options` attribute.

| Property | Type   | Description                                                        |
| -------- | ------ | ------------------------------------------------------------------ |
| label    | string | The text that displays next to a radio button.                     |
| value    | string | The string that's used to identify which radio button is selected. |

#### Input Validation

Client-side input validation is available for this component. For example, an error message is displayed when the radio group is marked required and no option is selected. Note that a disabled radio group is always valid.

You can override the default message using `message-when-value-missing` when a radio group is required and no option is selected. This message is displayed when you remove focus from the radio group.

To programmatically display error messages on invalid fields, use the `reportValidity()` method. For custom validity error messages, display the message using `setCustomValidity()` and `reportValidity()`. For more information, see the [lightning-input](/docs/component-library/bundle/lightning-input/documentation) documentation.

#### Reusing `lightning-radio-group` in a Page

To reuse `lightning-radio-group` in a page or across multiple tabs such as in a Salesforce console app,
follow one of these suggestions.

-   Omit the `name` attribute to enable the component to automatically generate a unique name.
-   Enclose each `lightning-radio-group` component in a `<form>` element and provide your own value for `name`.

If the reused component generates a unique name, each radio button group in the page renders
`<input>` elements grouped correctly so that one value can be selected in each group.

If you provide your own `name` value and reuse the
component with the same name, each radio button group in the page uses the same `name` value for the `<input>` elements.
The result is that you can select only one value across all radio button groups, instead of
one value within a radio button group. If you require your own `name` value, enclose the
reused components in `<form>` elements to enable the page to use the same `name` value for multiple radio
button groups.

#### Component Styling

`lightning-radio-group` implements the
[radio button](https://www.lightningdesignsystem.com/components/radio-group/) blueprint in the
Salesforce Lightning Design System (SLDS).

Set `type="button"` to create a component that implements the
[radio button group](https://www.lightningdesignsystem.com/components/radio-button-group/) blueprint in SLDS.

##### Variants

Use the `variant` attribute with one of these values to change the appearance of the radio group.

-   `label-hidden` hides the radio group label but makes it available to assistive technology. This variant does not hide the option labels.
-   `label-inline` horizontally aligns the label and radio group.
-   `label-stacked` places the label above the radio group.
-   `standard` is the default variant, which displays the radio group label above the options.

##### Customize Component Styling

To apply additional styling, use the SLDS [utility classes](https://www.lightningdesignsystem.com/utilities/alignment) with the `class` attribute.

This example adds a margin around the radio group using an SLDS class.

```html
<lightning-radio-group
    label="Radio Group"
    options={options}
    value={value}
    class="slds-m-around_x-small"
>
</lightning-radio-group>
```

To apply custom styling, use the `:host` selector or define a custom class using the `class` attribute.

```html
<lightning-radio-group
    label="Radio Group"
    options={options}
    value={value}
    class="my-radio-group"
>
</lightning-radio-group>
```

When using `type="button"`, you can change the line height of the button label with SLDS styling hooks. For example, use `--slds-c-button-line-height` to reduce or increase the whitespace between lines of the text label.

```css
.my-radio-group {
    --slds-c-button-line-height: 2.875rem;
}
```

When using `type="radio"`, customize the component's styles using SLDS styling hooks from the radio group blueprint. For example, change the radio color background and checkmark.

```css
:host {
    --slds-c-radio-mark-color-foreground: #000000;
    --slds-c-radio-color-background-checked: orange;
}
```

See [Styling Hooks Overview](https://www.lightningdesignsystem.com/components/radio-group/#Styling-Hooks-Overview) for a list of CSS custom properties.

#### Accessibility

The radio group is nested in a `fieldset` element that contains a `legend`
element. The legend contains the `label` value. The `fieldset` element enables
grouping of related radio buttons to facilitate tabbing navigation and speech
navigation for accessibility purposes. Similarly, the `legend` element
improves accessibility by enabling a caption to be assigned to the `fieldset`.
