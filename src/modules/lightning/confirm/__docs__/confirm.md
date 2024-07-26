The `lightning/confirm` module lets you create a confirm modal within your component. Use `LightningConfirm` on your component to ask the user to respond before they continue.

Use `LightningConfirm.open()` instead of the native `window.confirm()` for a more consistent user experience. They have similar functions, but `LightningConfirm.open()` works in cross-origin iframes, where the `.confirm()` method is no longer supported in Chrome and Safari. Unlike `window.confirm()`, `LightningConfirm.open()` doesn't halt execution on the page, it returns a Promise. Use `async`/`await` or `.then()` for any code you want to execute after the confirm has closed.

Import `LightningConfirm` from the `lightning/confirm` module in the component that will launch the confirm modal, and call `LightningConfirm.open()` with your desired attributes.

This example creates a headerless confirm modal with two buttons, **OK** and **Cancel**. The `.open()` function returns a promise that resolves to true when you click **OK** and false when you  click **Cancel**.

```html
<!-- c/myApp.html -->
<template>
    <lightning-button onclick={handleConfirmClick} label="Open Confirm Modal">
    </lightning-button>
</template>
```

```javascript
import { LightningElement } from 'lwc';
import LightningConfirm from 'lightning/confirm';

export default class MyApp extends LightningElement {
    async handleConfirmClick() {
        const result = await LightningConfirm.open({
            message: 'this is the prompt message',
            variant: 'headerless',
            label: 'this is the aria-label value',
            // setting theme would have no effect
        });
        //Confirm has been closed
        //result is true if OK was clicked
        //and false if cancel was clicked
    }
}
```

#### Component Styling

This component uses the Salesforce Lightning Design System (SLDS) [`prompt` blueprint](https://www.lightningdesignsystem.com/components/prompt/#site-main-content).

`LightningConfirm` supports the following attributes:

-   `message`: Message text that displays in the confirm.
-   `label`: Header text, also used as the `aria-label`. Default string is `Confirm`.
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

If an invalid value is provided, `LightningConfirm` uses the `default` theme. `LightningConfirm` ignores the `style` attribute.

#### Testing Your Component's Confirm

Code using `LightningConfirm` can be tested by mocking the `LightningConfirm.open()` method.

The example below uses a button to open a confirm dialog and sets the result in a template.

```html
<button data-button onclick={handleClick}>Open Confirm</button>
<div data-result>{result}</div>
```

```js
import LightningConfirm from 'lightning/confirm';
jest.mock('lightning/confirm');
​
test(() => {
    // Create and appendChild(element)
​
    const buttonEle = element.shadowRoot.querySelector('[data-button]');
    const resultEle = element.shadowRoot.querySelector('[data-result]');
​
    // Mock .open()
    // Pass true if testing when user clicks "OK"
    // Pass false if testing when user clicks "Cancel"
    LightningConfirm.open = jest.fn().mockResolvedValue(true);
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
    expect(resultEle.textContent).toBe('true');
    // Open triggered once
    expect(LightningConfirm.open.mock.calls).toHaveLength(1);
})
```
