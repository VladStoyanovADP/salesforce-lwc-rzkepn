---
examples:
    - name: basic
      label: Basic Select
      description: A simple dropdown menu with a selection required.
    - name: multiple
      label: Multiple Select
      description: A dropdown menu with multiple selection enabled.
    - name: disabled
      label: Disabled Select
      description: A dropdown menu with disabled state.
    - name: hidden
      label: Hidden Select
      description: A dropdown menu with hidden label.
    - name: inline
      label: Inline Select
      description: A dropdown menu with inline label.
---

`lightning-select` enables single and multiple selection on a menu of options using the HTML `select` element and `option` elements. To specify whether multiple options can be selected, use the `multiple` attribute. The `size` attribute can be used to specify how many options are visible at once. `lightning-select` also accepts most general form input attributes such as `required` and `disabled`.

Here's an example on how to create a menu of options. Pass a default value to the `value` attribute to make it selected by default when the component loads.

```html
<lightning-select
    value={selectVal}
    label="Select a product"
    options={productOptions}
    onchange={handleChange}
></lightning-select>
```

In your JavaScript, define an array of options. Each option has a `value` and `label` property. The `value` is returned when you select an option. The `label` value is the text that's displayed on the menu.

```javascript
import { LightningElement } from 'lwc';

export default class SimpleSelect extends LightningElement {
    selectVal = '';
    productOptions = [
        {
            label: '--None--',
            value: '',
        },
        {
            label: 'Sales',
            value: 'sales',
        },
        {
            label: 'Marketing',
            value: 'marketing',
        },
        {
            label: 'Service',
            value: 'service',
        },
    ];

    handleChange(event) {
        this.selectVal = event.detail.value;
    }
}
```

Selecting an option triggers the `change` event, which calls the
`onchange` handler. To check which option is selected,
use `event.detail.value`. If your `value` attribute is null, `event.detail.value` returns an empty string.

## Selecting Multiple Options

To enable multiple selection of options, use the `multiple` attribute. You can use the `size` attribute to specify the number of options to display by default.

```html
<lightning-select
    value={selectVal}
    label="Select a product"
    options={productOptions}
    onchange={handleChange}
    multiple
    size="3"
></lightning-select>
```

When you specify `multiple`, most browsers will show a scrolling list box instead of a single line dropdown. Alternatively, use the [lightning-dual-listbox](/docs/component-library/bundle/lightning-dual-listbox/) component to move options between two lists and reorder the list options.

## Creating Options

To create menu options, pass in the following properties to the `options` attribute.

| Property | Type    | Description                                                              |
| -------- | ------- | ------------------------------------------------------------------------ |
| label    | string  | The text that displays next to a checkbox.                               |
| value    | string  | The string that's used to identify which checkbox is selected.           |
| disabled | boolean | If true, the option is not selectable and users cannot interact with it. |

## Input Validation

Client-side input validation is available for this component. You can make
the selection required by adding the `required` attribute. An error message is
automatically displayed when an item is not selected and the element is `required`.

To check the validity states of an input, use the `validity` attribute, which
is based on the `ValidityState` object. You can access the validity states in
your JavaScript. This `validity` attribute returns an object with
`boolean` attributes.

You can override the default message by providing your own value for
`message-when-value-missing`.

Here's an example that displays a custom field-level message when a user interacts with the component but does not select an option.

```html
<lightning-select
    value={selectVal}
    label="Select a product"
    options={productOptions}
    onchange={handleChange}
    required
    message-when-value-missing="Which area can we help you with?"
>
</lightning-select>
```

Set the default value to an empty string so that an option is not selected by default.

```js
import { LightningElement } from 'lwc';

export default class RequiredSelect extends LightningElement {
    selectVal = '';
    productOptions = [
        {
            label: '--None--',
            value: '',
        },
        {
            label: 'Sales',
            value: 'sales',
        },
        {
            label: 'Marketing',
            value: 'marketing',
        },
        {
            label: 'Service',
            value: 'service',
        },
    ];

    handleChange(event) {
        this.selectVal = event.detail.value;
    }
}
```

## Custom Validity Error Messages

`lightning-select` supports `setCustomValidity()` from HTML5's Constraint Validation API.
To set an error message, provide a quoted string to display.
To reset the error message, set the message to an empty string (""). See
details at [https://www.w3.org/TR/html52/sec-forms.html#dom-htmlinputelement-setcustomvalidity](https://www.w3.org/TR/html52/sec-forms.html#dom-htmlinputelement-setcustomvalidity).

This example shows how to display a custom error message with `setCustomValidity()` and `reportValidity()`.

```html
<lightning-select
    name="myselect"
    value={selectVal}
    label="Select a product"
    options={productOptions}
    onchange={handleChange}
    required
></lightning-select>

<lightning-button label="Register" onclick={register}></lightning-button>
```

When you click the **Register** button, the `register()` function displays a custom error message if no option is selected, or clears the error message if an option has been selected.

```javascript
import { LightningElement } from 'lwc';

export default class CustomSelectError extends LightningElement {
    selectVal = '';
    productOptions = [
        {
            label: '--None--',
            value: '',
        },
        {
            label: 'Sales',
            value: 'sales',
        },
        {
            label: 'Marketing',
            value: 'marketing',
        },
        {
            label: 'Service',
            value: 'service',
        },
    ];

    handleChange(event) {
        this.selectVal = event.detail.value;
    }

    register(event) {
        const selectCmp = this.template.querySelector('lightning-select');
        if (this.selectVal === '') {
            selectCmp.setCustomValidity('You have not selected an option');
        } else {
            selectCmp.setCustomValidity('');
        }
        // Display the error without user interaction
        selectCmp.reportValidity();
    }
}
```

#### Component Styling

`lightning-select` implements the
[select](https://www.lightningdesignsystem.com/components/select/) blueprint in the Salesforce Lightning Design System (SLDS).

You can use a combination of the `variant` and `class` attributes to customize the dropdown menu.

##### Variants

Use the `variant` attribute with one of these values to position the labels differently relative to the dropdown menu.

-   `standard` is the default, which displays the label above the dropdown menu.
-   `label-hidden` hides the label but make it available to assistive technology. If you provide a value for `field-level-help`, the tooltip icon is still displayed.
-   `label-inline` aligns the label and dropdown menu horizontally.
-   `label-stacked` places the label above the dropdown menu.

##### Customize Component Styling

To apply additional styling, use the SLDS [utility classes](https://www.lightningdesignsystem.com/utilities/alignment) with the `class` attribute. For example, you can add padding on the top of the component using the `slds-p-top_medium` SLDS class.

To apply custom styling, define a custom class using the `class` attribute. Use SLDS styling hooks to customize the component's styles. For example, specify the border color on the `select` element using the `--slds-c-select-color-border` custom property.

```css
.my-select {
    --slds-c-select-color-border: red;
}
```

See [Styling Hooks Overview](https://www.lightningdesignsystem.com/components/select/#Styling-Hooks-Overview) for a list of CSS custom properties.

## Usage Considerations

`lightning-select` uses `delegatesFocus` to manage focus. `tabindex` is not supported. See [Handle Focus](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-focus) for more information.

Option groupings and disabled options are currently not supported.

`lightning-select` has usage differences from its Aura counterpart (`lightning:select`). [`lightning:select`](https://developer.salesforce.com/docs/component-library/bundle/lightning:select/example) does not support multiple selection, and it takes in menu options as subcomponents in `lightning:select`. `lightning:select` doesn't currently support multiple selection.

Alternatively, consider using [`lightning-combobox`](https://developer.salesforce.com/docs/component-library/bundle/lightning-combobox) if your dropdown menu doesn't need mobile support or multiple selection.

#### Accessibility

You must provide a text label for accessibility to make the information
available to assistive technology. The `label` attribute creates an HTML label
element for your input component. To hide a label from view and make it
available to assistive technology, use the `label-hidden` variant.

On desktop, select multiple options by clicking an option and dragging up or down the list. Alternatively, hold the Ctrl, Command, or Shift keys (depending on your operating system) and then click multiple options to select or deselect them. For more information, see [Selecting multiple options](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#Usage_notes) in the MDN web docs.

## Custom Events

**`change`**

The event fired when an option is selected.

The `change` event returns the following parameter.

| Parameter | Type   | Description                       |
| --------- | ------ | --------------------------------- |
| value     | string | The value of the selected option. |

The event properties are as follows.

| Property   | Value | Description                                                                                               |
| ---------- | ----- | --------------------------------------------------------------------------------------------------------- |
| bubbles    | true  | This event bubbles up through the DOM.                                                                    |
| cancelable | false | This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event. |
| composed   | true  | This event propagates outside of the component in which it was dispatched.                                |
