---
examples:
    - name: base
      label: Basic Name Fields
      description: Name fields can have predefined values.
    - name: required
      label: Required Name Fields
      description: When name fields are marked as required, a field-level error is thrown if Last Name is blank.
    - name: disabled
      label: Disabled Name Fields
      description: Disabled name fields are grayed out and you cannot interact with them.
    - name: readOnly
      label: Read-Only Name Fields
      description: Read-only name fields are not editable.
    - name: fieldLevelHelp
      label: Name Fields with Field-Level Help
      description: Field-level help guides users with information about the name fields.
---

A `lightning-input-name` component is a name compound field represented by HTML
`input` elements of type `text`. The Salutation field is a dropdown menu that
accepts an array of label-value pairs.

By default, `lightning-input-name` displays Salutation, First Name, and Last Name fields.
Use the `fields-to-display` attribute to specify a different list of fields to display. The component supports these field names for `fields-to-display`.

-   `firstName`
-   `lastName`
-   `middleName`
-   `informalName`
-   `suffix`
-   `salutation`

The locale set in Salesforce user preferences determines the order the fields are presented.

To provide initial values for fields, specify the field names as attributes in the component, using the dash-separated format of the field names. For example, specify `first-name` instead of `firstName`. Use the `options` attribute to specify the values to display in the Salutation dropdown menu.

This example creates a simple input name, consisting of just the First Name and Last Name fields, without specifying initial values. The rendered fields display default placeholder text.

```html
<template>
    <div>
        <lightning-input-name label="My Name" fields-to-display={fields}>
        </lightning-input-name>
    </div>
</template>
```

JavaScript file:

```javascript
import { LightningElement } from 'lwc';

export default class InputName extends LightningElement {
    fieldList = ['firstName', 'lastName'];
    get fields() {
        return this.fieldList;
    }
}
```

This example creates an input name that specifies values for first name, middle
name, last name, informal name, suffix. The Salutation dropdown menu is set to display
"Mr." by default. The `fields-to-display` attribute determines which fields are
rendered. Although all possible fields are specified inside the component, only the
First Name and Last Name display.

```html
<template>
    <div>
        <lightning-input-name
            label="Contact Name"
            first-name="John"
            middle-name="Middleton"
            last-name="Doe"
            informal-name="Jo"
            suffix="The 3rd"
            salutation="Mr."
            options={salutationOptions}
            fields-to-display={fields}
        >
        </lightning-input-name>
    </div>
</template>
```

JavaScript file:

```javascript
import { LightningElement } from 'lwc';

export default class InputName extends LightningElement {
    salutationsList = [
        { label: 'Mr.', value: 'Mr.' },
        { label: 'Ms.', value: 'Ms.' },
        { label: 'Mrs.', value: 'Mrs.' },
        { label: 'Dr.', value: 'Dr.' },
        { label: 'Prof.', value: 'Prof.' },
    ];

    get salutationOptions() {
        return this.salutationsList;
    }

    fieldList = ['firstName', 'lastName'];
    get fields() {
        return this.fieldList;
    }
}
```

`lightning-input-name` uses the `onchange` event handler to listen to a change to its field values.

```html
<p>Your first name: {firstname}</p>
<lightning-input-name
    label="Name"
    first-name={firstname}
    middle-name="Middleton"
    last-name="Doe"
    options={salutationOptions}
    onchange={handleChange}></lightning-input-name>
```

To bind the input value on the name fields, use the `event.target` property.

```js
import { LightningElement } from 'lwc';

export default class InputNameBase extends LightningElement {
    firstname = 'John';
    salutationsList = [
        { label: 'Mr.', value: 'Mr.' },
        { label: 'Ms.', value: 'Ms.' },
        { label: 'Mrs.', value: 'Mrs.' },
        { label: 'Dr.', value: 'Dr.' },
        { label: 'Prof.', value: 'Prof.' },
    ];

    get salutationOptions() {
        return this.salutationsList;
    }

    handleChange(event) {
        this.firstname = event.target.firstName;
    }
}
```

See the __Custom Events__ section for a list of `event.target` properties. For more information, see [Data Binding in a Template](https://developer.salesforce.com/docs/platform/lwc/guide/js-props-getter).

#### Usage Considerations

You can use custom labels that display translated values. For more information, see the
[Access Static Resources, Labels, Internationalization Properties, and User IDs](https://developer.salesforce.com/docs/platform/lwc/guide/create-global-value-providers).

This component uses `button` elements for dropdown menus to comply with the [Lightning Design System combobox blueprint](https://www.lightningdesignsystem.com/components/combobox/#%22Input%22-markup) for select-only comboboxes.

#### Input Validation

When you set `required`, a red asterisk is displayed on the Last Name
field to indicate that it's required. An error message is displayed below the
Last Name field if a user interacted with it and left it blank. The `required`
attribute is not enforced and you must validate it before submitting a form
that contains a name compound field.

To check the validity states of an input, use the `validity` attribute, which
is based on the `ValidityState` object of the Constraint Validation API. You can access the validity states in
your JavaScript. This `validity` attribute returns an object with
`boolean` properties. For more information, see the
[`lightning-input`](bundle/lightning-input/documentation) documentation.

Let's say you have a `lightning-button` component that calls the `handleClick`
method. You can display the error message when a user clicks the
button without providing a value for the Last Name field.

```javascript
handleClick: () => {
    var name = this.template.querySelector('lightning-input-name');
    var isValid = name.checkValidity();
    if (isValid) {
        alert('Creating new contact for ' + this.name);
    } else {
        name.showHelpMessageIfInvalid();
    }
};
```

You can override the default message by providing your own value for `messageWhenValueMissing`.

To programmatically display error messages on invalid fields, use the `reportValidity()` method. For custom validity error messages, display the message using `setCustomValidityForField()` and `reportValidity()`. For more information, see the [`lightning-input`](/docs/component-library/bundle/lightning-input/documentation) documentation.

#### Custom Events

**`change`**

The event fired when an item is changed in the `lightning-input-name` component.

The `change` event returns the following parameters.

| Parameter    | Type   | Description                           |
| ------------ | ------ | ------------------------------------- |
| salutation   | string | The value of the salutation field.    |
| firstName    | string | The value of the first name field.    |
| middleName   | string | The value of the middle name field.   |
| lastName     | string | The value of the last name field.     |
| informalName | string | The value of the informal name field. |
| suffix       | string | The value of the suffix field.        |
| validity     | object | The validity state of the element.    |

The `change` event properties are as follows.

| Property   | Value | Description                                                                                               |
| ---------- | ----- | --------------------------------------------------------------------------------------------------------- |
| bubbles    | true  | This event bubbles up through the DOM.                                                                    |
| cancelable | false | This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event. |
| composed   | true  | This event propagates outside of the component in which it was dispatched.                                |

#### See Also

[Use Wire Service with Base Components](https://developer.salesforce.com/docs/platform/lwc/guide/data-wire-base-components)
