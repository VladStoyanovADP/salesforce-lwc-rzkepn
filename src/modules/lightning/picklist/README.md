# lightning-picklist

> `lightning-picklist` is internal-only. It's not yet supported for use by customers on the Salesforce platform.

-   [Overview](#overview)
-   [Single Selection](#single-selection)
-   [Multiple Selection](#multiple-selection)
-   [Component Attributes](#component-attributes)
-   [Option Attributes](#option-attributes)
-   [Methods](#methods)
-   [Custom Events](#custom-events)
-   [Usage Considerations](#usage-considerations)

## Overview

`lightning-picklist` presents a [combobox](https://developer.salesforce.com/docs/component-library/bundle/lightning-combobox/example) for single selection and a [dual listbox](<(https://developer.salesforce.com/docs/component-library/bundle/lightning-dual-listbox/example)>) for multiple selection. On mobile screens, `lightning-picklist` presents a native select component.

`lightning-picklist` is based on [picklist](https://lightningdesignsystem.com/components/picklist) and the [dueling picklist](https://lightningdesignsystem.com/components/picklist) blueprints in the Lightning Design System.

## Single Selection

To create a dropdown menu for single selection, pass the `label` and `value` pairs to the `options` attribute. When the value is undefined or null, the `--None--` option is selected.

```html
<lightning-picklist
    label="Status"
    value={picklistVal}
    options={statusOptions}
    onchange={handleChange}
>
</lightning-picklist>
```

```js
import { LightningElement } from 'lwc';

export default class SingleSelection extends LightningElement {
    picklistVal = '';
    statusOptions = [
        { value: 'new', label: 'New' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'finished', label: 'Finished' },
    ];

    handleChange(event) {
        this.picklistVal = event.detail.value;
    }
}
```

## Multiple Selection

For multiple selection, include the `multiple` attribute. Providing your own `selected-label` and `source-label` for the dual listbox is currently not supported.

```html
<lightning-picklist
    label="Languages"
    value={picklistVal}
    options={langOptions}
    onchange={handleChange}
    multiple
>
</lightning-picklist>
```

```js
import { LightningElement } from 'lwc';

export default class MultipleSelection extends LightningElement {
    picklistVal = '';
    langOptions = [
        { value: 'en', label: 'English' },
        { value: 'cn', label: 'Chinese' },
        { value: 'de', label: 'German' },
        { value: 'jp', label: 'Japanese' },
    ];

    handleChange(event) {
        this.picklistVal = event.detail.value;
    }
}
```

## Component Attributes

Use the following attributes to customize `lightning-picklist`.

| Attribute Name          | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ----------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| autocomplete            | string  | Reserved for internal use. The `readonly` attribute is used on the input field and the field cannot be autofilled.                                                                                                                                                                                                                                                                                                            |
| disabled                | boolean | Specifies whether the menu is disabled and users cannot interact with it. The default is false. When the picklist is empty, it is disabled by default. If the picklist is explicitly set to be disabled, it stays disabled even when new options are provided.                                                                                                                                                                |
| field-level-help        | string  | Help text detailing the purpose and function of the menu of options. The text is displayed in a tooltip above the menu.                                                                                                                                                                                                                                                                                                       |
| label                   | string  | The text label for an option.                                                                                                                                                                                                                                                                                                                                                                                                 |
| multiple                | boolean | Specifies whether multiple options can be selected. A dueling picklist displays with two lists. The default is false.                                                                                                                                                                                                                                                                                                         |
| name                    | string  | The identifier for the component.                                                                                                                                                                                                                                                                                                                                                                                             |
| options                 | object  | An array of menu options with key-value pair for `label` and `value`.                                                                                                                                                                                                                                                                                                                                                         |
| placeholder             | string  | The placeholder text on the input field. The default is an empty string.                                                                                                                                                                                                                                                                                                                                                      |
| required                | boolean | Specifies whether an option must be selected. The default is false. When the picklist is required only one option is available, that option is automatically selected.                                                                                                                                                                                                                                                        |
| size                    | number  | The number of rows in the list that should be visible at one time. Use `size` with `multiple`. Valid values are between 3 to 10. The default is 4. The size is set to 4 if you provide a value not between 3 to 10.                                                                                                                                                                                                           |
| show-activity-indicator | boolean | Displays a spinner at the bottom of the options. If `multiple` is used, the spinner is displayed in the first list. The default is false.                                                                                                                                                                                                                                                                                     |
| validity                | object  | Represents the validity states that an element can be in, with respect to constraint validation.                                                                                                                                                                                                                                                                                                                              |
| value                   | string  | The value of the selected option. If empty and `required` is set to true, the component is in an invalid state.                                                                                                                                                                                                                                                                                                               |
| variant                 | string  | The variant changes the appearance of an input field. Accepted variants include standard, `label-inline`, `label-hidden`, and `label-stacked`. This value defaults to standard, which displays the label above the field. `label-hidden` hides the label but make it available to assistive technology. `label-inline` horizontally aligns the label and input field. `label-stacked` places the label above the input field. |

## Option Attributes

An option represents an item in the dropdown menu. Pass in the following key-value pairs to the `options` component attribute.

| Key Name | Type   | Description                            |
| -------- | ------ | -------------------------------------- |
| label    | string | The label for the option or menu item. |
| value    | object | The value associated with the option.  |

## Methods

**`blur()`**

Removes focus from the input element.

**`checkValidity()`**

Indicates whether the select element has any validity errors. Returns the valid attribute value (Boolean) on the ValidityState object.

**`focus()`**

Sets focus on the input element.

**`reportValidity()`**

Displays the error messages and returns false if the input is invalid. If the input is valid, `reportValidity()` clears displayed error messages and returns true.

**`setCustomValidity(message)`**

Sets a custom error message to be displayed when a form is submitted.

-   `message` (string) - Describes the error. If `message` is an empty string, the error is reset.

**`showHelpMessageIfInvalid()`**

Displays an error message on an invalid select field. An invalid field fails at least one constraint validation and returns false when `checkValidity()` is called.

## Custom Events

**`change`**

The event fired when an option is selected. `event.detail.value` returns the selected value.

**`open`**

The event fired when the dropdown menu is opened.

## Usage Considerations

`lightning-picklist` displays the native `select` element on mobile devices. If you don't need to work with smaller screen sizes, use `lightning-combobox` and `lightning-dual-listbox` for desktop.

`lightning-picklist` doesn't currently support autocomplete. To display dropdown options with icons and autocomplete (typeahead) support, consider using `lightning-grouped-combobox` or `lightning-grouped-mobile-combobox`.

`lightning-picklist` can be used as an Aura component. For example:

```html
<aura:component>
    <aura:attribute
        name="options"
        type="List"
        default="[
        { label: 'English', value: 'en' },
        { label: 'German', value: 'de' },
        { label: 'Spanish', value: 'es' },
        { label: 'French', value: 'fr' },
        { label: 'Italian', value: 'it' }]"
    />
    <aura:attribute name="value" type="String" default="fr" />
    <lightning:picklist
        label="Status"
        options={!v.options}
        value={!v.value}
    />
</aura:component>
```

## Examples

See the `lightning-input-address` and `lightning-input-field` components in this repo.
