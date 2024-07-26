# Dialog (Deprecated)

## Important:
* **For any new modal work, starting in release 236, please use `lightning-modal`**
* **We do not recommend or support the use of `lightning-dialog` in one.app, mobile or any other case where the stacking context can't be controlled**
* **The `lightning-dialog` is bound by the stacking context, meaning that if any sibling of a root parent of the modal has a higher z-index than the modal dialog, it will show on top of the modal created with the `lightning-dialog` component.**
* **The `lightning-dialog` is not Aura (one.app) panel manager aware and as such will not open scoped modals nor work correctly when opened from an aura (panel manager based) dialog.**

A `lightning-dialog` component creates a modal dialog, which displays in a layer above the app
and keeps focus until you close the dialog.

Use the `header` attribute to specify text for a header at the top of the dialog. If you don't
specify a value for `header`, the dialog's content is displayed beginning at the top, without a header area.

Specify content for the bottom of the dialog in a `footer` slot. Typically the footer would contain buttons with actions. If you omit the `footer` slot, the dialog doesn't display a footer area and the dialog content expands to the bottom.

The dialog height changes according to the amount of content within it. The width is calculated as a percentage of the viewport. You can use the `size` attribute to specify `small`, `medium`, or `large` to change the width calculation. The default size is `medium`, which uses less than half of the viewport width.

The body of the dialog can contain other components or HTML.

The component supports two methods:

-   `showModal()` to show a modal dialog
-   `close()` to close the dialog

Here is a simple dialog example that creates a prompt for the user. It includes a header and a slot for
footer content that consists of two buttons. A button below the dialog shows
how to invoke the dialog.

```html
<template>
    <lightning-dialog header="Confirmation">
        Are you sure you want to leave the page?
        <div slot="footer">
            <lightning-button label="Cancel" onclick={handleCancelClick}>
            </lightning-button>
            <lightning-button
                variant="brand"
                class="slds-m-left_x-small"
                label="Leave"
                onclick={handleLeaveClick}
            >
            </lightning-button>
        </div>
    </lightning-dialog>
    <lightning-button label="Open Modal Dialog" onclick={openModalDialog}>
    </lightning-button>
</template>
```

The JavaScript file defines the button actions using the `showModal()` and `close()` methods.

```js
export default class LightningDialogDemo extends LightningElement {
    openModalDialog() {
        this.dialog.showModal();
    }
    handleCancelClick() {
        this.dialog.close();
    }
    handleLeaveClick() {
        this.dialog.close();
        // perform user-requested action here after closing the dialog
    }
    get dialog() {
        return this.template.querySelector('lightning-dialog');
    }
}
```

#### Event Handling

When you close a modal, it dispatches a `close` event that you can listen to. In addition to any close button
you might implement, modal dialogs have two other ways to close the dialog: pressing the Escape key and clicking
the close (X) icon. In both cases, the component dispatches the `cancel` and `close` events. The `cancel` event
tells you that the user wants to close the dialog, and the `close` event tells you that the dialog is closing.

To prevent the dialog from closing, call `event.preventDefault()` in the `oncancel` event handler. You might use this approach to
bring attention to unsaved changes, for example, and give the user a chance to save them.

#### Component Styling

`lightning-dialog` implements the
[modals](https://www.lightningdesignsystem.com/components/modals/) blueprint in the
Salesforce Lightning Design System (SLDS).

To apply additional styling, use the SLDS [utility classes](https://www.lightningdesignsystem.com/utilities/alignment) with the `class` attribute.

To customize the component's SLDS styles, use the ` --sds-c-modal-*` CSS custom properties. For more information, see the [SLDS website](https://www.lightningdesignsystem.com/).

#### Accessibility

When a modal dialog opens, focus goes to the first visible element that participates in Tab key navigation and isn't
disabled. This element has a tabIndex of `0` and is not contained in a Lightning web component that has tabIndex of `-1`.
If no such element is found, focus goes to the close (X) icon.

When a modal dialog closes, the focus returns to the element that was in focus before the dialog opened.
If no such element is found, document.body is focused.

#### Custom Events

**`cancel`**

An event fired when the user cancels the dialog by clicking on the X icon or pressing Esc. See **Event Handling** above.

The `cancel` event does not return any parameters.

The event properties are as follows.

| Property   | Value | Description                                                                    |
| ---------- | ----- | ------------------------------------------------------------------------------ |
| bubbles    | false | This event does not bubble.                                                    |
| cancelable | true  | This event can be canceled. You can call `preventDefault()` on this event.     |
| composed   | false | This event does not propagate outside the template in which it was dispatched. |

**`close`**

An event fired when the user closes the dialog by clicking a button that's implemented in the component, clicking on the X icon, or pressing Esc. See **Event Handling** above.

The `close` event does not return any parameters.

The event properties are as follows.

| Property   | Value | Description                                                                                               |
| ---------- | ----- | --------------------------------------------------------------------------------------------------------- |
| bubbles    | false | This event does not bubble.                                                                               |
| cancelable | false | This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event. |
| composed   | false | This event does not propagate outside the template in which it was dispatched.                            |
