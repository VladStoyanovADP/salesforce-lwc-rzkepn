---
examples:
    - name: text
      label: Text Input (default)
      description: Text input fields are for entering single-line text.
    - name: textAdvanced
      label: Text Input (Advanced)
      description: Text input fields with event handling and data binding.
    - name: date
      label: Date Input
      description: Date input fields provide a date picker for entering a date.
    - name: datetime
      label: Date/Time Input
      description: Date/Time input fields provide a date and time picker for entering a date and time.
    - name: timebasic
      label: Time Input (Basic)
      description: Time input fields provide a dropdown list of time values in 15-minute increments.
    - name: timeadvanced
      label: Time Input (Advanced)
      description: Time input fields support earliest and latest time input.
    - name: color
      label: Color Input
      description: Color input fields provide a color swatch for entering a HEX or RGB value.
    - name: file
      label: File Input
      description: File input fields support upload of single or multiple files and can restrict the accepted file types.
    - name: email
      label: Email Input
      description: Email input fields are for entering email addresses.
    - name: password
      label: Password Input
      description: Password input fields obscure your text input.
    - name: tel
      label: Telephone Input
      description: Telephone input fields support number pattern matching.
    - name: url
      label: URL Input
      description: URL input fields support URL pattern matching.
    - name: number
      label: Number Input
      description: Number input fields support decimal, percentage, and currency values.
    - name: checkboxbasic
      label: Checkbox
      description: Checkbox options can be required or disabled.
    - name: checkboxbutton
      label: Checkbox Button
      description: Checkbox buttons can be required or disabled.
    - name: toggle
      label: Toggle
      description: Toggle buttons can be required or disabled.
    - name: search
      label: Search Input
      description: Search input fields enable search queries.
---

A `lightning-input` component creates an HTML `<input>` element. This component
supports the following input types:

-   `checkbox`
-   `checkbox-button`
-   `date`
-   `datetime`/`datetime-local`
-   `time`
-   `email`
-   `file`
-   `password`
-   `search`
-   `tel`
-   `url`
-   `number`
-   `text` (default)
-   `toggle`

There is no behavioral difference between the `datetime` and `datetime-local` types.

The following HTML input types aren't supported.

-   `button`
-   `hidden`
-   `image`
-   `radio`
-   `reset`
-   `submit`
-   `week`
-   `month`

Use [`lightning-button`](bundle/lightning-button/documentation)
instead for input types `button`, `reset`, and
`submit`.

Use [`lightning-radio-group`](bundle/lightning-radio-group/documentation)
instead of input type `radio` for radio buttons.

Use [`lightning-combobox`](bundle/lightning-combobox/documentation) or input type `number` instead of input types `week` and `month`. The `week` and `month` types are browser-dependent and may cause issues with styling, accessibility, and general functionality in specific browsers.

When working with forms that interact with Salesforce records, consider using the record form components. The `lightning-record-form`, `lightning-record-view-form`, and `lightning-record-edit-form` components provide a form-based UI that's metadata-driven. The components are automatically wired up to your record data, labels, and field-level help text. For more information, see [Work with Records Using Base Components](https://developer.salesforce.com/docs/platform/lwc/guide/data-get-user-input-intro).

Alternatively, to create your own custom UI to work with Salesforce records, use `lightning-input` with the `lightning/ui*Api` wire adapters and functions, such as `getRecord` and `updateRecord`. For more information, see [Use the Wire Service with Base Components](https://developer.salesforce.com/docs/platform/lwc/guide/data-wire-base-components).

The `label` attribute is required. If you don't want to display a label,
specify the `variant="label-hidden"` attribute. See **Accessibility** for more
information.

You can define an action for input events like `blur`,
`focus`, and `change`. For example, to handle a `change` event on the
component when the value of the component is changed, use the `onchange`
attribute. The component also provides a `commit` event, which the
HTML `<input>` does not have. See **Event Handling**
for details.

#### Checkbox

Checkboxes let you select one or more options. `lightning-input type="checkbox"` is useful for creating single checkboxes. If you are working
with a group of checkboxes, use [`lightning-checkbox-group`](bundle/lightning-checkbox-group/documentation) instead.

```html
<template>
    <lightning-input type="checkbox" label="Red" checked> </lightning-input>
    <lightning-input type="checkbox"> </lightning-input>
</template>
```

The checkbox implements the [checkbox](https://www.lightningdesignsystem.com/components/checkbox/) blueprint in SLDS.

To apply custom styling, use the `:host` selector. Use SLDS styling hooks to customize the component's styles. For example, change the checkmark color and background color when an option is selected.

```css
:host {
    --slds-c-checkbox-color-background-checked: green;
    --slds-c-checkbox-mark-color-foreground: yellow;
}
```

See [Styling Hooks Overview](https://www.lightningdesignsystem.com/components/checkbox/#Styling-Hooks-Overview) for a list of CSS custom properties.

#### Checkbox-button

Checkbox buttons let you select one or more options with an alternative visual
design.

```html
<template>
    <lightning-input
        type="checkbox-button"
        label="Add pepperoni"
        checked
        value="pepperoni"
    >
    </lightning-input>
    <lightning-input type="checkbox-button" label="Add salami" value="salami">
    </lightning-input>
</template>
```

#### Color

A color picker enables you to specify a color using a color picker or by
entering the color into a text field.

```html
<template>
    <lightning-input type="color" label="Color" value="#EEEEEE">
    </lightning-input>
</template>
```

#### Date

A date input field includes a text input to type a date and a date picker
to select a date.

On mobile devices, this component uses the native date picker, which ignores the `date-style` attribute. The native date picker uses the user's device settings for names of months and weekdays, the input date format, and the calendar type.

On desktop, this component uses a date picker styled with the Lightning Design System. This picker uses the user's Salesforce language setting for names of months and weekdays, and the user's Salesforce locale setting for the date format. The entered date is validated against the user's Salesforce locale format during the `blur` event.

The component uses `date-style="medium"` by default to display the date
in a medium-length style, such as Jan 7, 2020 in the en-US locale.
To display a short style such as 1/7/2020, set `date-style="short"` in the component.
To display a long style such as January 7, 2020, set `date-style="long"`.

The date entered must be valid for the user's Salesforce locale, and match one of the
short, medium, or long styles. If the date entered is valid, the component accepts
the input and reformats it to the specified `date-style` during the `blur` event.
For example, if the component specifies `date-style="long"` and you enter 1/7/2020
in the en-US locale, the component reformats it to January 7, 2020.

The component accepts a month value of `13` to accommodate conditions that sometimes require a 13th month in a year. For most locales, if you enter `13` for the month, the component converts the date to the first month of the following year during the `blur` event.

Use the `value` attribute to supply an initial value for the date as an ISO8601 formatted date string,
such as `2020-11-03`.

Set `min` and `max` to ISO8601 formatted date strings to constrain the allowed date values. The date picker shows
dates outside the min and max range in gray as a visual cue. Although users can select a date outside the range,
the `blur` event triggers the field to display a validation error message. For a list of default error messages, see **Error Messages**. You can specify your own error messages for the `min` and `max` validation errors using the `message-when-range-underflow` and `message-when-range-overflow` attributes.

You can guide users with a `field-level-help` tooltip and a `placeholder` prompt in the text field,
as explained in **Adding Field-Level Help and Placeholder Text**.

On desktop, the datepicker calendar clips behind other components on the page if the parent container of `lightning-input` has a smaller width or height than the calendar. To prevent clipping, give the parent container a minimum width of 285px and minimum height of 310px.

By default, the datepicker calendar renders above all modals and the main Salesforce header.

```html
<template>
    <lightning-input type="date" label="Birthday"> </lightning-input>
</template>
```

#### Datetime

A datetime field includes a text input to type a date and a date picker
to select a date, and similar fields for typing or picking a time.

On mobile devices, this component uses the native datetime picker, which ignores the `date-style` and `time-style` attributes. The native datetime picker uses the user's device settings for names of months and weekdays, the input datetime format, and the calendar type.

##### Desktop

On desktop, `lightning-input` provides its own date/time picker that's styled with
the Lightning Design System. Your Salesforce locale setting determines the acceptable
date and time formats you can type in the fields and the format displayed in the fields
after you pick a date and time. Your Salesforce language setting determines the names
of months and weekdays displayed in the date picker calendar, and the labels of the date
and time fields.

The date and time you enter are automatically validated against your Salesforce locale
format during the `blur` event. The date and time displayed reflect your Salesforce time
zone setting. Use the `timezone` attribute to specify a different time zone in IANA time
zone database format. For example, specify `timezone="America/New_York"` for US Eastern
Time or `timezone="GMT"` for Greenwich Mean Time.

The component uses `date-style="medium"` by default to display the date
in a medium-length style, such as Jan 7, 2020 in the en-US locale.
To display a short style such as 1/7/2020, set `date-style="short"` in the component.
To display a long style such as January 7, 2020, set `date-style="long"`.

The date entered must be valid for the user's Salesforce locale, and match one of the
short, medium, or long styles. If the date entered is valid, the component accepts
the input and reformats it to the specified `date-style` during the `blur` event.
For example, if the component specifies `date-style="long"` and a user enters 1/7/2020
in the en-US locale, the component reformats it to January 7, 2020.

The component accepts a month value of `13` to accommodate conditions that sometimes require a 13th month in a year. For most locales, if you enter `13` for the month, the component converts the date to the first month of the following year during the `blur` event.

The component uses `time-style="short"` by default to display the time without seconds,
such as 6:53 PM in the en-US locale. To display time including seconds,
set `time-style="medium"` or `time-style="long"`. The medium and long styles currently
have the same formatting.

Your Salesforce locale setting determines the time format you can type in the field
or select in the time picker, either 12-hr time with AM/PM or 24-hr time format.

Use the `value` attribute to optionally supply an initial value for the date and time as an
ISO8601 formatted datetime string such as `2020-11-03T18:13:41Z`.

Set `min` and `max` to ISO8601 formatted datetime strings to constrain the allowed date and time values. The date picker shows
dates outside the min and max range in gray as a visual cue. Users can still select a date and time outside the range,
but the `blur` event triggers the field to display a validation error message. For a list of default error messages, see **Error Messages**. You can specify your own error message using the `message-when-range-underflow` and `message-when-range-overflow` attributes.

You can guide users with a `field-level-help` tooltip, as explained in **Adding Field-Level Help and Placeholder Text**.

On desktop, the datepicker calendar clips behind other components on the page if the parent container of `lightning-input` has a smaller width or height than the calendar. To prevent clipping, give the parent container a minimum width of 285px and minimum height of 310px.

By default, the datepicker calendar renders above all modals and the main Salesforce header.

**Note**: Set the same time zone on your mobile device and in Salesforce to avoid confusion and potential validation
issues. For example, suppose the current time is 4:00 PM ET. Your mobile device is set to the America/New_York time zone and
you're interacting with Salesforce while it's set to the America/Los_Angeles time zone. When you tap an empty date/time field
on the mobile device, the native date/time picker automatically selects the current device time, 4:00 PM.
Since the current time is 1:00 PM in Salesforce, this input time is in the future. If there's a validation rule stating that
the value must be earlier than the current time, for example, the value is invalid. This occurs only
because of the time zone discrepancy, and only on mobile devices when the date/time field is initially empty.

```html
<template>
    <lightning-input type="datetime" label="Created date"> </lightning-input>
</template>
```

#### Email

An input field for entering an email address. UTF-8 encoding is supported for international email addresses. Valid email addresses include `name@example` and `name@example.com`. The email pattern is automatically validated during the `blur` event.

```html
<template>
    <lightning-input type="email" label="Email"> </lightning-input>
</template>
```

To restrict email input to match a certain pattern, use the `pattern` attribute to specify a
regular expression. For example, pass in `pattern=".+@example.com"` to accept an email address only
from the domain example.com. When using `pattern`, you can provide a custom validation error message using the `message-when-pattern-mismatch` attribute.

You can also include a hint of what a user can enter using the `placeholder` attribute.
The placeholder text is displayed on the field before a user enters an input, but it doesn't validate input.

```html
<template>
    <lightning-input
        type="email"
        label="Email"
        pattern=".+@example.com"
        placeholder="username@example.com"
    >
    </lightning-input>
</template>
```

To specify the maximum number of characters for an email address, use the `maxlength` attribute.
When using `maxlength`, you can provide a custom validation error message using the `message-when-too-long` attribute.

```html
<template>
    <lightning-input
        type="email"
        label="Email"
        maxlength="50"
        message-when-too-long="Your email address must not be more than 50 characters."
    >
    </lightning-input>
</template>
```

To specify the minimum number of characters for an email address, use the `minlength` attribute.
When using `minlength`, you can provide a custom validation error message using the `message-when-too-short` attribute.

```html
<template>
    <lightning-input
        type="email"
        label="Email"
        minlength="5"
        message-when-too-short="Your email address must be more 5 characters."
    >
    </lightning-input>
</template>
```

When `multiple` is used, the email field expects a single email address or a comma-separated list of email addresses. For example, `my@example.com,your@example.com` with or without a space after the comma.

```html
<template>
    <lightning-input type="email" label="Email" multiple> </lightning-input>
</template>
```

#### File

An input field for selecting files to upload using an `Upload Files` button or a drag-and-drop zone. This field accepts files up to 3.5 MB.

To retrieve the list of selected files, use
`event.target.files` in the `onchange` event handler. Your selected files are returned in a `FileList` object, each specified as a `File` object with the `size` and `type` attributes.

```html
<template>
    <lightning-input
        type="file"
        label="Attachment"
        accept="image/png, .zip"
        onchange={handleFilesChange}
        multiple
    >
    </lightning-input>
</template>
```

`lightning-input type="file"` handles file selection only. Implement your own file uploading. For example, wire up your component to an Apex controller that handles file uploads. Alternatively, use the
[`lightning-file-upload`](bundle/lightning-file-upload/documentation) component for an integrated way to upload files to records.

#### Number

An input field for entering a number. When working with numerical input, you
can use the attributes `max`, `min`, and `step`.

The attributes `maxlength`, `minlength`, and `pattern` can't be used with `number` type because they are for string data.

```html
<template>
    <lightning-input type="number" label="Number" value="12345">
    </lightning-input>
</template>
```

To specify valid increments for numerical fields, use the `step` attribute. The value of `step` constrains the numbers
that users can enter. If you don't specify `step`, the default value of 1 allows users to enter only integers.

To enable decimal number entry, specify a value for `step` that represents the number of decimal places accepted and
the increment. For example, specifying `step=".01"` permits numbers such as 0.99 and 123456.78. Specifying `step=".20"` permits
numbers such as 18.60 but not 18.61 or 18.70.

If a user enters a number that doesn't match the `step` value, the browser flags it as invalid. Some browsers can round the number instead.

```html
<template>
    <lightning-input type="number" label="Number" step=".01" value="123.45">
    </lightning-input>
</template>
```

To format numerical input as a percentage or currency, set `formatter` to
`percent` or `currency` respectively. To allow for decimal numbers,
specify the `step` attribute as well.

```html
<template>
    <lightning-input
        type="number"
        label="Price"
        value="12345"
        formatter="currency"
        step=".01"
    >
    </lightning-input>
</template>
```

For the `percent` formatter, the entered number is multiplied by 100 on blur to display the percentage. For example, when you enter .75 the value displays as 75%. When you enter 1, the value displays as 100%. To enter a percentage value as is, use `formatter="percent-fixed"`. When you enter .75, the value displays as .75%, and when you enter 1, the value displays as 1%.

```html
<template>
    <lightning-input type="number" label="Enter a decimal value" step="0.001">
    </lightning-input>
    <lightning-input
        type="number"
        label="Enter a percentage value"
        formatter="percent"
        step="0.01"
    >
    </lightning-input>
    <lightning-input
        type="number"
        label="Enter a dollar amount"
        formatter="currency"
        step="0.01"
    >
    </lightning-input>
</template>
```

Number formatting is based on the Intl.NumberFormat object and follows ISO guidelines, displaying a value based on the org currency and your Salesforce locale. For example, when using `formatter="currency" step=".01"`, entering "123.45" displays "€123,45" if your org's currency is set to EUR and your Salesforce locale is German. Your Salesforce locale is also used to determine if the number you entered is valid.

#### Number Validation

The number field does not let you type invalid characters, although anything can be pasted in. When a field contains invalid characters, a default field-level error is displayed on blur and the `value` property returns an empty string.
The invalid input continues to be displayed to allow the user to correct the entry. See the **Input Validation** and **Error Messages** sections for more information. Valid characters include digits, number shortcuts, exponential numbers, positive and negative signs, and decimal separators.

The `lightning-input` component uses the Javascript `parseFloat()` function to convert input value strings to numbers. Very large numbers with more than approximately 15 or 16 total digits can lose precision and appear to be rounded. Browsers can handle this loss of numeric precision differently, causing variation in decimal point rounding.

For example, `parseFloat("12345678901234.12345")` is stored in memory as `12345678901234.123`, which appears rounded. The parsed value in memory is used for validation, not the entered number. As a result, a number that should be invalid can be accepted as valid due to the loss of precision in the stored value. If your `lightning-input` component
sets `step="0.0001"`, the entered value `12345678901234.12345` is invalid. However, the stored value
`12345678901234.123` is valid, so the entered value is accepted.

##### Digits

Digits are the numbers 0 to 9. Invalid placement of 0's are removed. For example, `010` results in `10`. Trailing zeros after the decimal separator are also removed to match any given `step` pattern.

##### Number Shortcuts

Shortcuts such as `k`, `K`, `m`, `M`, `b`, `B`, `t`, and `T` are allowed. For the en-US locale, when you enter `1k` the field displays `1,000`. Entering `1m` results in `1,000,000`. When the input field is focused, the input value is the multiplied number. For example, entering `1k` results in `1,000` on blur, and `1000` when the input is focused again.

Shortcuts are not supported via the `value` attribute.

##### Exponential Numbers

The letter `e` or `E` is accepted when entering an exponential number. For example, when you enter `2e2` the field displays `200` on blur, and `2e2` when the input is focused again.

##### Positive and Negative Signs

Use `+` and `-` characters to represent positive and negative numbers. The positive `+` sign is removed on blur. If your number starts with `+.` or `-.`, `0` is added before the decimal separator. For example, entering `+.2` results in `0.2` on blur.

##### Decimal Separators

Decimal separators are valid when you use the `step` attribute. Only the `.` and `,` decimal separators are allowed. If your number starts with a decimal separator, `0` is added before the decimal separator. For example, entering `.2` results in `0.2` on blur.

##### Step

We recommend using a maximum of 9 decimal places for `value` and a maximum of 15 decimal places for `step`. Browsers exhibit inconsistencies in number calculation when you use more decimal places.

For example, a `value` of `9.9999999999` has more than 9 decimal places, and is interpreted as `10.0` by some browsers. If `step` is `0.01`, `stepMismatch` validates as false when you enter `9.9999999999` because `10.0` matches the step. The `messageWhenStepMismatch` validation message isn't displayed and the field incorrectly displays as valid.

Similar behavior occurs when `step` has a value such as `0.000000000000001`, which is more than 15 decimal places.

#### Password

An input field for entering a password. Characters you enter are masked.

```html
<template>
    <lightning-input type="password" label="Password"> </lightning-input>
</template>
```

Use the `value` attribute to optionally supply an initial value for the password. Use `pattern` to pass
a regular expression to validate the password characters.

You can guide users with a `field-level-help` tooltip and a `placeholder` prompt in the text field,
as explained in **Adding Field-Level Help and Placeholder Text**.

#### Range

A slider control for entering a number. When working with numerical input, you
can use attributes like `max`, `min`, and `step`.

The attributes `maxlength`, `minlength`, and `pattern` can't be used with `range` type because they are for string data.

```html
<template>
    <lightning-input type="range" label="Number" min="0" max="10">
    </lightning-input>
</template>
```

#### Search

An input field for entering a search string. This field displays the Lightning
Design System search utility icon.

```html
<template>
    <lightning-input type="search" label="Search"> </lightning-input>
</template>
```

To indicate activity in the search field with a spinner, such as data loading, include the `is-loading` attribute.

```html
<template>
    <lightning-input type="search" label="Search" is-loading> </lightning-input>
</template>
```

#### Tel

An input field for entering a telephone number. Use the `pattern` attribute to
define a pattern for field validation.

```html
<template>
    <lightning-input
        type="tel"
        label="Telephone"
        value="343-343-3434"
        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
    >
    </lightning-input>
</template>
```

#### Text

An input field for entering text. This is the default input type.

The `value` attribute for this input type only supports string values. To clear a text field by setting the `value` attribute, use `""` to specify an empty string because `null` isn't supported.

```html
<template>
    <lightning-input label="Name"> </lightning-input>
</template>
```

#### Time

A time field includes a text input to type a time and a time picker
to select a time.

On mobile devices, this component uses the native time picker, which ignores the `time-style` attribute. The native time picker uses the user's device settings for the input time format.

On desktop, this component uses a time picker styled with the Lightning Design System. This picker uses the user's Salesforce locale setting for the time format, either 12-hr time with AM/PM or 24-hr time format. The entered date and time are validated against the user's Salesforce locale format during the `blur` event.

By default, the time picker renders above all modals and the main Salesforce header.

The component uses the attribute `time-style="short"` by default, so the time picker
displays time without seconds. To display time including seconds, set `time-style="medium"`.

Use the `value` attribute to optionally supply an initial time as an ISO8601 formatted time string
such as `14:00:00.000`.

Set `min` and `max` to ISO8601 formatted time strings to constrain the allowed time value. The time picker displays time values that are within the range only. If you type a time that's outside the range, the `blur` event triggers the field to display a validation error message. For a list of default error messages, see **Error Messages**. You can specify your own error messages for the `min` and `max` validation errors using the `message-when-range-underflow` and `message-when-range-overflow` attributes.

You can guide users with a `field-level-help` tooltip and a `placeholder` prompt in the text field,
as explained in **Adding Field-Level Help and Placeholder Text**.

```html
<template>
    <lightning-input type="time" label="Time"> </lightning-input>
</template>
```

#### Toggle

A checkbox toggle for selecting one of two given values. Use the
`message-toggle-active` and `message-toggle-inactive` attributes to specify labels
displayed under the toggle for each state. By default the labels are Active
and Inactive. To omit labels, set these attributes to empty strings.

```html
<template>
    <lightning-input type="toggle" label="Toggle value" checked>
    </lightning-input>
</template>
```

A toggle is similar to a checkbox; it presents a binary choice. However, a toggle is self-contained and is designed to be used in a form with only one field. When you switch a toggle on or off, the change for that item should save immediately.

The toggle implements the [checkbox toggle](https://www.lightningdesignsystem.com/components/checkbox-toggle/) blueprint in SLDS.

To apply custom styling, use the `:host` selector. Use SLDS styling hooks to customize the component's styles. For example, change the toggle switch color and toggle background color.

```css
:host {
    --slds-c-checkbox-toggle-switch-color-background: orange;
    --slds-c-checkbox-toggle-color-background-checked: green;
}
```

See [Styling Hooks Overview](https://www.lightningdesignsystem.com/components/checkbox-toggle/#Styling-Hooks-Overview) for a list of CSS custom properties.

By default, the toggle component expands to 100% of the available width. To limit the size of the toggle component, wrap it with an element that specifies the appropriate width.

```html
<template>
    <div style="width:fit-content">
        <lightning-input type="toggle" label="Toggle value" checked>
        </lightning-input>
    </div>
</template>
```

#### URL

An input field for entering a URL. The address must include the protocol, such
as http:// or ftp://. The URL pattern is automatically validated during the
`blur` event. To enter the address without the protocol, such as
www.example.com, use the default `type="text"` instead.

```html
<template>
    <lightning-input type="url" label="Website"> </lightning-input>
</template>
```

#### Input Validation

Client-side input validation is available for this component. For example, an
error message is displayed when a URL or email address is expected for an
input type of `url` or `email`. Note that disabled and read-only inputs are
always valid.

You can define additional field requirements. For example, to set a maximum
value on a number field, use the `max` attribute.

```html
<template>
    <lightning-input type="number" value="500" label="Quantity" max="1000">
    </lightning-input>
</template>
```

To check the validity states of an input, use the `validity` attribute, which
is based on the Constraint Validation API. To determine if a field is valid,
you can access the validity states in JavaScript. Let's say
you have the following input field.

```html
<template>
    <lightning-input
        class="input"
        label="Enter some text"
        onblur={handleBlur}
    >
    </lightning-input>
</template>
```

The `validity` attribute returns true for the `valid` property because all constraint validations are met,
and in this case there are none.

```javascript
import { LightningElement } from 'lwc';

export default class DemoInput extends LightningElement {

    handleBlur(event) {
        var input = this.template.querySelector(".input");
        console.log(input.validity.valid); //returns true
    }
```

For example, you have the following form with several fields and a button. To
display error messages on invalid fields, use the `reportValidity()` method.

```html
<template>
    <lightning-input label="First name" placeholder="First name" required>
    </lightning-input>
    <lightning-input label="Last name" placeholder="Last name" required>
    </lightning-input>
    <lightning-button type="submit" label="Submit" onclick={handleClick}>
    </lightning-button>
</template>
```

Validate the fields in JavaScript.

```javascript
export default class InputHandler extends LightningElement {
    value = 'initial value';

    handleClick(evt) {
        console.log('Current value of the input: ' + evt.target.value);

        const allValid = [
            ...this.template.querySelectorAll('lightning-input'),
        ].reduce((validSoFar, inputCmp) => {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);
        if (allValid) {
            alert('All form entries look valid. Ready to submit!');
        } else {
            alert('Please update the invalid form entries and try again.');
        }
    }
}
```

This `validity` attribute returns an object with the following read-only `boolean`
properties. One property is set to true and the rest are false, depending on attributes
set on the input field and the user's entry.

-   `badInput`: Indicates that the value is invalid for any input type.
-   `customError`: Indicates that a custom error has been set. See **Custom Validity Error Messages**.
-   `patternMismatch`: Indicates that the value doesn't match the specified `pattern` attribute for `email`, `password`, `search`, `tel`, `text`, or `url` input types.
-   `rangeOverflow`: Indicates that the value is greater than the specified `max` attribute for `number`, `range`, `date`, `datetime`, or `time` input types.
-   `rangeUnderflow`: Indicates that the value is less than the specified `min` attribute for `number`, `range`, `date`, `datetime`, or `time` input types.
-   `stepMismatch`: Indicates that the value doesn't match the specified `step` attribute for `number` or `range` input types.
-   `tooLong`: Indicates that the value exceeds the specified `maxlength` attribute for `email`, `password`, `search`, `tel`, `text`, or `url` input types.
-   `tooShort`: Indicates that the value is less than the specified `minlength` attribute for `email`, `password`, `search`, `tel`, `text`, or `url` input types.
-   `typeMismatch`: Indicates that the value doesn't match the required syntax for `email` or `url` input types.
-   `valueMissing`: Indicates that an empty value is provided when `required` attribute is set for any input type.
-   `valid`: True if none of the preceding properties are true.

#### Error Messages

When an input validation fails, a default message is displayed. You can provide your own values for the error messages to override the default messages. Specify your message using an attribute that corresponds to the validity error that's returned, as shown in the following table.

| Validity Error    | Default Message                                                              | Attribute to Override Default   |
| ----------------- | ---------------------------------------------------------------------------- | ------------------------------- |
| `badInput`        | Enter a valid value.                                                         | `message-when-bad-input`        |
| `patternMismatch` | Your entry does not match the allowed pattern.                               | `message-when-pattern-mismatch` |
| `rangeOverflow`   | The number is too high.                                                      | `message-when-range-overflow`   |
|                   | Value must be `[max]` or earlier. (for types `date`, `datetime`, and `time`) |                                 |
| `rangeUnderflow`  | The number is too low.                                                       | `message-when-range-underflow`  |
|                   | Value must be `[min]` or later. (for types `date`, `datetime`, and `time`)   |                                 |
| `stepMismatch`    | Your entry isn't a valid increment.                                          | `message-when-step-mismatch`    |
| `tooLong`         | Your entry is too long.                                                      | `message-when-too-long`         |
| `tooShort`        | Your entry is too short.                                                     | `message-when-too-short`        |
| `typeMismatch`    | You have entered an invalid format.                                          | `message-when-type-mismatch`    |
| `valueMissing`    | Complete this field.                                                         | `message-when-value-missing`    |

Note that the `badInput` validity error for `date` and `datetime` fields displays a default message that varies by locale. For example, "Your entry does not match the allowed format MMM d, yyyy" is displayed for en-US locale, but a different date format is shown for a different locale.

To override the default error message, use the corresponding attribute. For example, you have a text input with a minimum length of 5. If users enter fewer than five characters,
the validity error returned is `tooShort` and the default message is "Your entry is too short." Use the `message-when-too-short` attribute to display a different error message.

```html
<template>
    <lightning-input
        label="First Name"
        minlength="5"
        message-when-too-short="Your entry must be at least 5 characters."
    >
    </lightning-input>
</template>
```

#### Custom Validity Error Messages

The component supports `setCustomValidity()` from HTML5's Constraint
Validation API. To set an error message, provide a quoted string to display.
To reset the error message, set the message to an empty string (""). See
details at [https://www.w3.org/TR/html52/sec-forms.html#dom-htmlinputelement-setcustomvalidity](https://www.w3.org/TR/html52/sec-forms.html#dom-htmlinputelement-setcustomvalidity).

This example shows how to display a custom error message with
`setCustomValidity()` and `reportValidity()`. The component is a simple text
input with a button.

```html
<template>
    <lightning-input class="inputCmp" label="Enter your name:">
    </lightning-input>
    <lightning-button label="Register" onclick={register}> </lightning-button>
</template>
```

The `register()` function compares the input entered by the user to a
particular text string. If true, `setCustomValidity()` sets the custom error
message. The error message is displayed immediately using `reportValidity()`.

Note that when the comparison isn't true, you should set the error message to
an empty string to zero out any messages that might have been set on previous
calls.

```javascript
import { LightningElement } from 'lwc';
export default class MyComponent extends LightningElement {
    register(event) {
        var inputCmp = this.template.querySelector('.inputCmp');
        var value = inputCmp.value;
        // is input valid text?
        if (value === 'John Doe') {
            inputCmp.setCustomValidity('John Doe is already registered');
        } else {
            inputCmp.setCustomValidity(''); // if there was a custom error before, reset it
        }
        inputCmp.reportValidity(); // Tells lightning-input to show the error right away without needing interaction
    }
}
```

#### Using Autocomplete in Input Fields

Some input types can be autofilled, based on your browser's support of the feature.
The `autocomplete` attribute passes through its value to the browser.
These `lightning-input` types support the `autocomplete` attribute:

-   `email`
-   `search`
-   `tel`
-   `text`
-   `url`

The values `on` and `off` are supported, but the behavior depends on the browser. Some browsers might ignore the passed value.

See [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) for more information.

#### Adding Field-Level Help and Placeholder Text

To provide a hint for entering information in the field, specify help text with the `field-level-help` attribute. For example, describe the characters required in a `password` input. Field level help adds an info icon next to the input label, with a tooltip displaying the specified help text.

To provide sample input in the field, use the `placeholder` attribute. For example, in a `url` input, show a URL in the correct format.

```html
<template>
    <lightning-input
        label="Event Name"
        placeholder="Grand Opening"
        field-level-help="The event name must 50 characters or less"
        maxlength="50"
    >
    </lightning-input>
</template>
```

`field-level-help` isn't supported for `file`, `toggle`, and `checkbox-button` types.

`placeholder` is supported for `date`, `email`, `number`, `password`, `search`, `tel`, `text`, `time`, and `url` input types only. The `placeholder` support for `date` and `time` is a Salesforce addition and is not part of the [HTML5 standard](https://html.spec.whatwg.org/multipage/input.html#input-type-attr-summary).

#### Data Binding

Bind the input value to a property in your component's JavaScript class. `lightning-input` uses the `onchange` event handler to listen a change to its value. For more information, see [Data Binding in a Template](https://developer.salesforce.com/docs/platform/lwc/guide/js-props-getter).

#### Event Handling

The native HTML `<input>` element provides two events, `input` and `change`. The `lightning-input` component provides
two custom events, `change` and `commit`.

The component's `change` event behaves the same as the native `input` and `change` events together.
It fires whenever you change the input value, as the `<input>` element's `input` event does.
It also fires when you finish changing the input, as the `<input>` element's `change` event does.

The component's `commit` event fires only when you finish changing the input,
which is the same behavior as the HTML `<input>` element's `change` event.

The component doesn't provide an `input` event because the behavior is provided in the `change` event.

To summarize, the component's `change` event is equivalent to the `input` and `change` events of
the `<input>` element. The component's `commit` event is equivalent to the `change` event of
the `<input>` element.

The `change` event fires at different times, depending on the specific input type.
For information about the `change` event for the `<input>` element, see
[developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event).

See the **Custom Events** section for more information about the component's events.

#### Handling Number Input

In general, use `oncommit` to handle changes to number inputs. Use `onchange` for use cases where you want to process each character entered right away. For example, use `onchange` if you want to echo the content entered in another field as it is entered.

For input type `number`, the component sets the `value` to '' (an empty string) when the number input becomes invalid. The `change` event is fired each time the value changes, even when the value is set to an empty string. This enables you to reset the field in your `onchange` handler when input is invalid. Use separate variables to set the value of the number input and retrieve it.

#### Handling Selections

When working with checkboxes and toggle
switches, use `this.template.querySelectorAll` to retrieve the array of components. You can
use `.filter` to determine which elements are checked or unchecked. The following
example displays the values of the selected checkboxes.

```html
<template>
    <lightning-input
        type="checkbox"
        label="Red"
        onchange={handleCheckboxChange}
    >
    </lightning-input>
    <lightning-input
        type="checkbox"
        label="Blue"
        onchange={handleCheckboxChange}
    >
    </lightning-input>
    <lightning-input
        type="checkbox"
        label="Green"
        onchange={handleCheckboxChange}
    >
    </lightning-input>

    <p>Checked items: {selection}</p>
</template>
```

When you select a checkbox, the `handleCheckboxChange` function updates the `selection` property
to display a list of selected checkboxes.

```javascript
import { LightningElement } from 'lwc';

export default class CheckboxExample extends LightningElement {
    selection;

    handleCheckboxChange() {
        // Query the DOM
        const checked = Array.from(
            this.template.querySelectorAll('lightning-input')
        )
            // Filter down to checked items
            .filter((element) => element.checked)
            // Map checked items to their labels
            .map((element) => element.label);
        this.selection = checked.join(', ');
    }
}
```

To programmatically set a checkbox or checkbox button to `checked`, query the element using a custom data attribute. You can't query the internal elements of a Lightning web component. This example uses a custom attribute `data-element` to query the element. The checkbox is selected by clicking a button.

```html
<template>
    <lightning-input
        type="checkbox"
        data-element="subscribe-checkbox"
        label="Subscribe"
    >
    </lightning-input>
    <lightning-button
        label="Subscribe"
        onclick={handleSubscribe}
    ></lightning-button>
</template>
```

Set the element's `checked` property to `true`.

```javascript
import { LightningElement } from 'lwc';

export default class CheckboxExample extends LightningElement {
    handleSubscribe(event) {
        this.template
            .querySelectorAll('[data-element="subscribe-checkbox"]')
            .forEach((element) => {
                element.checked = true;
            });
    }
}
```

#### Set and Read Selection Indexes

The `selection-start` and `selection-end` attribute values are passed through to the `<input>` element. Only the input type `text` is currently supported. The `selection-start` value specifies the index of the first character selected in the input element, while the `selection-end` value specifies the index of the last character selected. Index values start at 0.

This example selects the characters from index 0 to the end when you click the button.

```html
<template>
    <lightning-input
        type="text"
        label="Enter some text"
        value={textvalue}
        onchange={handleChange}
    ></lightning-input>
    <lightning-button
        label="Focus selection"
        onclick={handleClick}
    ></lightning-button>
</template>
```

In JavaScript, the `selectionEnd` property
is set to the length of the current input value.

```javascript
import { LightningElement } from 'lwc';

export default class DemoInputSelection extends LightningElement {
    textvalue = 'initial value';
    handleChange(event) {
        this.textvalue = event.detail.value;
    }
    handleClick(event) {
        let input = this.template.querySelector('lightning-input');
        let end = input.value.length;
        input.selectionStart = 0;
        input.selectionEnd = end;
        // Optionally, focus to highlight the selected characters
        // input.focus();
    }
}
```

#### Design Guidelines

For a single line of plain text input, use `lightning-input`. For multiple lines of plain text input, use `lightning-textarea` instead. For more specific input such as with numbers or email addresses, use the `type` attribute. Specifying `type` ensures that built-in validation can be applied to your data input.

In most contexts, a stacked label (`standard` or `label-stacked` variant) results in better readability and clarity. Use horizontal labels (`label-inline` variant) only if you need to conserve vertical space and have fewer than 10 fields.

To group related fields together, such as individual parts of an address, use compound input components like `lightning-input-address` or `lightning-input-location`. For name fields, use `lightning-input-name`.

#### Component Styling

`lightning-input` implements the
[input](https://www.lightningdesignsystem.com/components/input/) blueprint in the Salesforce Lightning Design System (SLDS).

To apply additional styling, use the SLDS [utility classes](https://www.lightningdesignsystem.com/utilities/alignment) with the `class` attribute.

This example creates two fields using `lightning-input` in a compound row similar to the [SLDS form fields](https://www.lightningdesignsystem.com/components/form-element/#Fields).

```html
<fieldset class="slds-form-element slds-form-element_compound">
    <legend class="slds-form-element__legend slds-form-element__label">
        Name
    </legend>
    <div class="slds-form-element__control">
        <div class="slds-form-element__row">
            <div class="slds-size_1-of-2">
                <lightning-input label="First Name"></lightning-input>
            </div>
            <div class="slds-size_1-of-2">
                <lightning-input label="Last Name"></lightning-input>
            </div>
        </div>
    </div>
</fieldset>
```

To apply custom styling, use the `:host` selector. Use SLDS styling hooks to customize the component's styles. For example, change the background color of the input fields using the `--slds-c-input-color-background` custom property.

```css
:host {
    --slds-c-input-color-background: orange;
}
```

See [Styling Hooks Overview](https://www.lightningdesignsystem.com/components/input/#Styling-Hooks-Overview) for a list of CSS custom properties.

#### Usage Considerations

`maxlength` limits the number of characters you can enter. The
`message-when-too-long` error message isn't triggered because you can't type more
than the number of characters allowed. However, you can use the
`message-when-pattern-mismatch` and `pattern` attributes to
trigger a message on blur when too many characters are entered.

```html
<template>
    <lightning-input
        type="text"
        message-when-pattern-mismatch="Too many characters"
        pattern=".{0,5}"
        label="Enter up to 5 characters"
    >
    </lightning-input>
</template>
```

You can use custom labels that display translated values on input fields. For more information,
see [Access Labels](https://developer.salesforce.com/docs/platform/lwc/guide/create-labels).

The `lightning-input` component has these limitations when running in the Playground and the Mini-Playground in the Examples tab of this Component Reference.

-   The `timezone` attribute currently doesn't work, so the time is formatted using the runtime system's timezone.
-   The input types `date`, `time`, and `datetime` are limited to the en-US locale. Other locales are currently not supported in Playground.

#### Accessibility

You must provide a text label for accessibility to make the information
available to assistive technology. The `label` attribute creates an HTML
`<label>` element for your input component. To hide a label from view and make
it available to assistive technology, use the `label-hidden` variant.

Specify the `aria-labelledby` attribute and `variant="label-hidden"` to
provide a custom label for assistive devices. Although the `label` attribute is
still required, the `<label>` element is not rendered in this case.

```html
<template>
    <p id="otherlabel">
        Your Event Name
        <lightning-input
            label="Event"
            variant="label-hidden"
            aria-labelledby="otherlabel"
        >
        </lightning-input>
    </p>
</template>
```

`lightning-input` sets the `aria-invalid` attribute to match the validity state of the input field for assistive technology. If the `validity` attribute returns a true value for the `valid` property, then `aria-invalid` is false. If the `validity` attribute returns a true value for any property other than `valid`, then `aria-invalid` is true. When the component is initially loaded, `aria-invalid` is set to false. This prevents fields that are marked required from being announced as invalid before you enter anything.

When a field-level error is displayed, `lightning-input` links the input field to the error message using the `aria-describedby` attribute, which enables assistive technology to announce the error message on the input field.

#### Custom Events

**`change`**

The event fired when a value is changed in the input field.

The `change` event returns one of the following `event.target` parameters, depending on input type.

| Parameter | Type    | Description                                                                                                                                                                |
| --------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| checked   | boolean | For input types `checkbox` and `checkbox-button`, the value of `checked` attribute. See **Change Event Handling** for an example of working with an array of inputs.       |
| files     | Object  | For input type `file`, the list of selected files returned in a `FileList` object, each specified as a `File` object with the `size` and `type` attributes. See **Files**. |
| value     | string  | For other input types, returns the input value.                                                                                                                            |

The event properties are as follows.

| Property   | Value | Description                                                                                               |
| ---------- | ----- | --------------------------------------------------------------------------------------------------------- |
| bubbles    | true  | This event bubbles up through the DOM.                                                                    |
| cancelable | false | This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event. |
| composed   | true  | This event propagates outside of the component in which it was dispatched.                                |

**`commit`**

The event fired when you press Enter after interacting with the input, or move away from the input so it loses focus. For the input type `search` the event is also fired when you click the "x" button to clear the search. For the input type `number` the event is also fired when you press Up/Down arrow keys to change the number.

The `commit` event doesn’t return any parameters.

The event properties are as follows.

| Property   | Value | Description                                                                                               |
| ---------- | ----- | --------------------------------------------------------------------------------------------------------- |
| bubbles    | false | This event does not bubble.                                                                               |
| cancelable | false | This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event. |
| composed   | false | This event does not propagate outside of the component in which it was dispatched.                        |

#### LWC Recipes

The [LWC Recipes GitHub repository](https://github.com/trailheadapps/lwc-recipes) contains code examples for Lightning Web Components that you can test in an org.

For a recipe that uses `lightning-input`, see the following components in the LWC Recipes repo.

-   `c-lds-create-record`
-   `c-misc-modal`
-   `c-wire-get-picklist-values`

#### See Also

[Access Elements the Component Owns](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-dom-work)
