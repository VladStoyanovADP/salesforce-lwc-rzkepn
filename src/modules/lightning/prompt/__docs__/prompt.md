The `lightning/prompt` module lets you create a prompt modal within your component. Use `LightningPrompt` on your components to ask the user to provide information before they continue.

Use `LightningPrompt.open()` instead of the native `window.prompt()` for a more consistent user experience. They have similar functions, but `LightningPrompt.open()` works in cross-origin iframes, where the `.prompt()` method is no longer supported in Chrome and Safari. Unlike `window.prompt()`, `LightningPrompt.open()` doesn't halt execution on the page, it returns a Promise. Use `async`/`await` or `.then()` for any code you want to execute after the prompt has closed.

Import `LightningPrompt` from the `lightning/prompt` module in the component that will launch the prompt modal, and call `LightningPrompt.open()` with your desired attributes.

This example creates a prompt modal with a header, message, and two buttons. If you enter text and click **OK** in the prompt, the `.open()` function returns a promise that resolves to the input value. If you click **Cancel**, the function returns a promise that resolves to `null`.

```html
<!-- c/myApp.html -->
<template>
    <lightning-button onclick={handlePromptClick} label="Open Prompt Modal">
    </lightning-button>
</template>
```

```javascript
import { LightningElement } from 'lwc';
import LightningPrompt from 'lightning/prompt';

export default class MyApp extends LightningElement {
    handlePromptClick() {
        LightningPrompt.open({
            message: 'this is the prompt message',
            //theme defaults to "default"
            label: 'Please Respond', // this is the header text
            defaultValue: 'initial input value', //this is optional
        }).then((result) => {
            //Prompt has been closed
            //result is input text if OK clicked
            //and null if cancel was clicked
        });
    }
}
```

#### Component Styling

This component uses the Salesforce Lightning Design System (SLDS) [`prompt` blueprint](https://www.lightningdesignsystem.com/components/prompt/#site-main-content).

`LightningPrompt` supports the following attributes:

-   `message`: Message text that displays in the prompt.
-   `defaultValue`: Optional. Initial leading text for the input text box.
-   `label`: Header text, also used as the `aria-label`. Default string is `Prompt`.
-   `variant`: Two values, `header` and `headerless`. Default value is `header`.
-   `theme`: Color theme for the header. The `theme` attribute supports the following [options](https://www.lightningdesignsystem.com/utilities/themes/#site-main-content) from SLDS:
    -   `default`: white
    -   `shade`: gray
    -   `inverse`: dark blue
    -   `alt-inverse`: darker blue
    -   `success`: green
    -   `info`: gray-ish blue
    -   `warning`: yellow
    -   `error`: red
    -   `offline`: ​black​

If an invalid value is provided, `LightningPrompt` uses the `default` theme. `LightningPrompt` ignores the `style` attribute.

#### Testing Your Component's Prompt

Code using `LightningPrompt` can be tested by mocking the `LightningPrompt.open()` method.

The example below uses a button to open a prompt dialog and sets the result in a template.

```html
<button data-button onclick={handleClick}>Open Prompt</button>
<div data-result>{result}</div>
```

```js
import LightningPrompt from 'lightning/prompt';
jest.mock('lightning/prompt');
​
test(() => {
    // Create and appendChild(element)
​
    const buttonEle = element.shadowRoot.querySelector('[data-button]');
    const resultEle = element.shadowRoot.querySelector('[data-result]');
​
    // Mock .open()
    // Pass string representing input text if testing when user clicks "OK"
    // Pass null if testing when user clicks "Cancel"
    LightningPrompt.open = jest.fn().mockResolvedValue('test value');
    // Initial value
    expect(resultEle.textContent).toBe('unknown');
    // Click modal open button
    buttonEle.click();
​
    // Click handler render cycle
    await Promise.resolve();
    // Render cycle triggered by tracked value {result}
    await Promise.resolve();
​
    // Verify result is set in the template
    expect(resultEle.textContent).toBe('test value');
    // Open triggered once
    expect(LightningPrompt.open.mock.calls).toHaveLength(1);
})
```
