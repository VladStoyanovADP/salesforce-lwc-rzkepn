The `lightning/alert` module lets you create an alert modal within your component. Use `LightningAlert` on your components to communicate a state that affects the entire system, not just a feature or page.

Use `LightningAlert.open()` instead of the native `window.alert()` for a more consistent user experience. They have similar functions, but `LightningAlert.open()` works in cross-origin iframes, where the `.alert()` method is no longer supported in Chrome and Safari. Unlike `window.alert()`, `LightningAlert.open()` doesn't halt execution on the page, it returns a Promise. Use `async`/`await` or `.then()` for any code you want to execute after the alert has closed.

Import `LightningAlert` from the `lightning/alert` module in the component that will launch the alert modal, and call `LightningAlert.open()` with your desired attributes.

This example creates an alert modal with an error message and **OK** button. The `.open()` function returns a promise that resolves when you click **OK**.

```html
<!-- c/myApp.html -->
<template>
    <lightning-button onclick={handleAlertClick} label="Open Alert Modal">
    </lightning-button>
</template>
```

```javascript
import { LightningElement } from 'lwc';
import LightningAlert from 'lightning/alert';

export default class MyApp extends LightningElement {
    async handleAlertClick() {
        await LightningAlert.open({
            message: 'this is the alert message',
            theme: 'error', // a red theme intended for error states
            label: 'Error!', // this is the header text
        });
        //Alert has been closed
    }
}
```

#### Component Styling

This component uses the Salesforce Lightning Design System (SLDS) [`prompt` blueprint](https://www.lightningdesignsystem.com/components/prompt/#site-main-content).

`LightningAlert` supports the following attributes:

-   `message`: Message text that displays in the alert.
-   `label`: Header text, also used as the `aria-label`. Default string is `Alert`.
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
    -   `offline`: ​black

If an invalid value is provided, `LightningAlert` uses the `default` theme. `LightningAlert` ignores the `style` attribute.

#### Testing Your Component's Alert

Code using `LightningAlert` can be tested by mocking the `LightningAlert.open()` method.

The example below uses a button to open an alert dialog with text that changes when the alert opens.

```html
<button data-button onclick={handleClick}>Open Alert</button>
<template if:true={alertViewed}>
    <div data-text>Content Viewed</div>
</template>
<template if:false={alertViewed}>
    <div data-text>Click to View Content</div>
</template>
```

```javascript
import LightningAlert from 'lightning/alert';
jest.mock('lightning/alert');
​
test(() => {
    // Create and appendChild(element)
​
    const buttonEle = element.shadowRoot.querySelector('[data-button]');
    const textEle = element.shadowRoot.querySelector('[data-text]');
​
    // Mock .open()
    // No value passed since LightningAlert doesn't have a return value
    LightningAlert.open = jest.fn().mockResolvedValue();
    // Initial value
    expect(textEle.textContent).toBe('Click to View Content');
    // Click modal open button
    buttonEle.click();
​
    // Click handler render cycle
    await Promise.resolve();
    // Render cycle triggered by tracked value {result}
    await Promise.resolve();
​
    // Verify alertViewed has updated in template
    expect(textEle.textContent).toBe('Content Viewed');
    // Open triggered once
    expect(LightningAlert.open.mock.calls).toHaveLength(1);
})
```
