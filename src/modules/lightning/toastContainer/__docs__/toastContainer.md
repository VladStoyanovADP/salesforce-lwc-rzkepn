Use the `lightning/toastContainer` module to manage a list of toast components and their order. Each site page supports a single toast container. You can create toast notifications with [lightning/toast](/docs/component-library/bundle/lightning-toast/documentation) and manage them using `lightning/toastContainer`.

This module is available only for LWR Sites for Experience Cloud. For more information, see [Create Components for LWR Sites](https://developer.salesforce.com/docs/atlas.en-us.exp_cloud_lwr.meta/exp_cloud_lwr/get_started_components.htm).

This example creates a basic toast container component that handles and displays all the page-level toast messages.

```javascript
const toastContainer = ToastContainer.instance();
```

#### Customization

By default, the toast container shows a maximum of 3 toast notifications at the same time. Set the `maxToasts` attribute to change the maximum number of toasts shown at a time.

Toast components display at the top center of the container by default. The most recent toast displays at the top of the container, and the oldest toast notification displays at the bottom. Change the toasts' position in the container with the `toastPosition` attribute.

The container position is fixed to the viewport. Adjust the position of the container relative to its parent element with the `containerPosition` attribute. This attribute has two values. 
- `fixed` - positions the container relative to the initial containing block established by the viewport.
- `absolute` - positions the container relative to a positioned parent element.

This example creates a page-level toast container in the top-right in the viewport that shows a maximum of 5 toast messages at one time.
```javascript
// c/myApp.js
import { LightningElement } from 'lwc';
import ToastContainer from 'lightning/toastContainer';

export default class MyApp extends LightningElement {
    connectedCallback() {
        const toastContainer = ToastContainer.instance();
        toastContainer.maxShown = 5;
        toastContainer.toastPosition = 'top-right';
    }
}
```

#### Accessibility

Toast container follows the SLDS [Global Focus Orchestration](https://www.lightningdesignsystem.com/accessibility/guidelines/global-focus/#global-orchestration) accessibility guidelines, which allow users to use the keyboard shortcut to navigate between toasts.
- Press `Control` + `F6` or `Command` + `F6` for Mac OS to move focus to next toast, if any.
- Press `Shift` + `Control` + `F6` or `Shift` + `Command` + `F6` for Mac OS to move focus to the previous toast, if any.
