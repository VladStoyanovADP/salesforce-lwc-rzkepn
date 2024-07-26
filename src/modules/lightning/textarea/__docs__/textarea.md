---
examples:
    - name: various
      label: Textarea
      description: A textarea field can hold an unlimited number of characters or a maximum number of character specified by the max-length attribute. If disabled, the field is grayed out and you can't interact with it. A required textarea field displays an error if you don't enter any input after first interaction.
---

A `lightning-textarea` component creates an HTML `textarea` element for
entering multi-line text input. A text area holds an unlimited number of
characters.

To apply a custom width for the text area, use the `class` attribute. To set the
input for the text area, set its value using the `value` attribute. Setting
this value overwrites any initial value that's provided.

The following example creates a text area with a maximum length of 300
characters.

```html
<template>
    <lightning-textarea
        value="initial value"
        label="What are you thinking about?"
        max-length="300"
    >
    </lightning-textarea>
</template>
```

The `rows` attribute and `cols` attribute are not supported. In many browsers, the text area is resizable by default, and a vertical scrollbar is displayed when the content exceeds the number of rows. Specifying the CSS width and height properties is not supported.

You can define a function in JavaScript to handle input events like
`blur`, `focus`, and `change`. For example, to handle a `change` event on
the component, use the `onchange` attribute.

To retrieve the content of the text area field, use `event.detail.value` property.

```html
<template>
    <lightning-textarea
        name="myTextArea"
        value="initial value"
        label="What are you thinking about?"
        onchange={countLength}
    >
    </lightning-textarea>
</template>
```

#### Input Validation

Client-side input validation is available for this component. Set a maximum
length using the `maxlength` attribute or a minimum length using the
`minlength` attribute. An error message is automatically displayed in the
following cases:

-   A required field is empty when `required` is present on the `lightning-textarea` tag.
-   The input value contains fewer characters than that specified by the `minlength` attribute.
-   The input value contains more characters than that specified by the `maxlength` attribute.

To check the validity states of an input, use the `validity` attribute, which
is based on the `ValidityState` object. You can access the validity states in
your JavaScript. This `validity` attribute returns an object with
`boolean` properties. For more information, see the
[`lightning-input`](bundle/lightning-input/documentation) documentation.

You can override the default message by providing your own values for
`message-when-value-missing`, `message-when-bad-input`, `message-when-too-long`, or
`message-when-too-short`.

For example, provide an error message when a required field's value is missing.

```html
<template>
    <lightning-textarea
        name="myText"
        label="Your Name"
        message-when-value-missing="This field is required."
        required
    >
    </lightning-textarea>
</template>
```

#### Inserting Text Programmatically

You can insert text programmatically in the text area with the `setRangeText()` method, replacing content
or inserting new content.

The `setRangeText()` method follows the API of the standard `HTMLInputElement.setRangeText()` method described on
[MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setRangeText).

`setRangeText()` supports these parameters.

| Parameter   | Type   | Description                                                   |
| ----------- | ------ | ------------------------------------------------------------- |
| replacement | string | The string to insert.                                         |
| start       | number | The 0-based index of the first character to replace.          |
| end         | number | The 0-based index that follows the last character to replace. |
| selectMode  | string | Defines how the selection is set after the text is inserted.  |

Valid values for selectMode are:

-   `select` - Selects the inserted text. The text area must have focus when `setRangeText()` is called.
-   `start` - Moves the selection to just before the inserted text.
-   `end` - Moves the selection to just after the inserted text.
-   `preserve` - Attempts to preserve the selection in effect before the insertion. This is the default.

To insert replacement text at the current cursor location, specify only the
replacement string and no other parameters. After the insertion, the cursor
remains in the original location. If text is selected when the insertion occurs,
the text is replaced.

This example uses `setRangeText()` to insert some text at the beginning of the line
without replacing any content.

```html
<template>
    <lightning-textarea placeholder="Type something interesting">
    </lightning-textarea>
    <lightning-button label="Insert Text" onclick={handleClick}>
    </lightning-button>
</template>
```

Setting the start and end values to 0 begins the insertion with the character at
index 0, but ends at the character before index 0. The result is that no characters are
replaced, and the text is inserted in front of the character at index 0.

The selectMode value `select` causes the inserted content to be selected. Call the `focus()`
method before `setRangeText()` to enable the selection.

```javascript
import { LightningElement } from 'lwc';

export default class SetRangeTextExample extends LightningElement {
    start = 0;
    end = 0;
    selectMode = 'select';

    handleClick() {
        const textarea = this.template.querySelector('lightning-textarea');
        textarea.focus();
        textarea.setRangeText(
            'Some new text',
            this.start,
            this.end,
            this.selectMode
        );
    }
}
```

This example inserts a space at index 10 and removes characters at index 10 through 14.
The resulting content of the text area is `0123456789 567890`.

```html
<template>
    <lightning-textarea value="012345678901234567890"> </lightning-textarea>
    <lightning-button label="Clip Text" onclick={handleClick}>
    </lightning-button>
</template>
```

You can omit the final parameter of `setRangeText()` to use the default select mode, `preserve`.

```javascript
import { LightningElement } from 'lwc';

export default class SetRangeTextExample extends LightningElement {
    handleClick() {
        const textarea = this.template.querySelector('lightning-textarea');
        textarea.setRangeText(' ', 10, 15);
    }
}
```

These examples describe the insertion behavior with various `setRangeText()`parameter values.

```javascript
// Insert text at cursor position. Replace any selected text.
textarea.setRangeText('Some new text');

// Insert text to replace characters beginning at index 10 (the 11th
// character) and ending at index 15 (the 16th character). The character
// at index 14 is the last character replaced.
// No selectMode is specified, so the original selection is preserved.
textarea.setRangeText('Some new text', 10, 15);

// Set focus on the text area.
// Insert text as described in the previous example, and then select
// the new text.
textarea.focus();
textarea.setRangeText('Some new text', 10, 15, 'select');

// Insert text as described, and place cursor ahead of the new text.
textarea.setRangeText('Some new text', 10, 15, 'start');

// Insert text as described, and place cursor after the new text.
textarea.setRangeText('Some new text', 10, 15, 'end');

// Insert text as described, and return to the previous selection state.
textarea.setRangeText('Some new text', 10, 15, 'preserve');
```

If text is selected when selectMode is `preserve` and start and end values are specified,
the text insertion has no effect on the selected text. The text remains selected and is not replaced.

#### Using Autocomplete

Textarea fields can be autofilled, based on your browser's support of the feature.
The `autocomplete` attribute passes through its value to the browser.

See [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) for more information.

#### Component Styling

`lightning-textarea` implements the [textarea](https://www.lightningdesignsystem.com/components/textarea/) blueprint in the Salesforce Lightning Design System (SLDS).

To apply additional styling, use the SLDS [utility classes](https://www.lightningdesignsystem.com/utilities/alignment) with the `class` attribute.

This example adds padding on top of the textarea using an SLDS class.

```html
<lightning-textarea class="slds-p-top_small" label="Enter comments">
</lightning-textarea>
```

To apply custom styling, use the `:host` selector. Use SLDS styling hooks to customize the component's styles. For example, specify the minimum height using the `--slds-c-textarea-sizing-min-height` custom property.

```css
:host {
    --slds-c-textarea-sizing-min-height: 200px;
}
```

See [Styling Hooks Overview](https://www.lightningdesignsystem.com/components/rich-text-editor/#Styling-Hooks-Overview) for a list of CSS custom properties.

#### Accessibility

Use the `label` attribute to identify the text area for users of assistive technology.
The `label` attribute creates an HTML label element on the input element. To hide a
label from view and make it available to assistive technology, use the `label-hidden` variant.
