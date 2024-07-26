# Popup

Use `lightning-popup` to create popup windows in response to user interaction.
Typically, you open a popup when a user interacts with an element by
clicking it or hovering the mouse over it.

You can align a popup with a reference element, such as the element that opens it, or another element.

A popup must have at least one tabbable element, which is an element that users can focus by using
the Tab key. When a popup opens, focus automatically goes to the first tabbable element in the popup.
The popup traps focus, so you can't press Tab to move focus out of the popup. You can
return focus to the underlying window by closing the popup.

When a popup element has focus, you can close it by pressing
the Escape key or clicking outside the popup. If you close a popup
by pressing the Escape key, the `close` event fires. If you click outside the popup,
the `clickout` event fires first, and then the `close` event fires. This enables you
to perform an action when the user clicks outside the popup and prevent closing.
For example, you could prompt the user to save changes made in the popup.

You can optionally add a close button that fires the `close` event.

Define the content of the popup window using other components or HTML elements
inside `lightning-popup`.

The component does not provide Lightning Design System styling of its own.
You can apply Lightning Design System classes such as the `slds-popover` classes
to the elements within `lightning-popup`. See [Popovers](https://www.lightningdesignsystem.com/components/popovers/)
in the Lightning Design System for examples.

To open the popup using JavaScript, use the `show()` method. See the **Methods** section for more information.

This example uses `lightning-button` to open a popup. The content of the popup
is a set of div elements that specify `slds-popover` classes and enclose a `lightning-input` component.

```html
<template>
    <lightning-button
        label="Click to show a popup"
        onclick={openPopup}
    ></lightning-button>

    <lightning-popup aria-describedby="popup-body">
        <div class="slds-popover">
            <div id="popup-body" class="slds-popover__body">
                <lightning-input label="An input"></lightning-input>
                <div class="slds-m-top_small">
                    <lightning-button
                        variant="brand"
                        label="Save"
                        onclick={handleSave}
                    ></lightning-button>
                    <lightning-button
                        variant="brand"
                        label="Cancel"
                        onclick={handleCancel}
                    ></lightning-button>
                </div>
            </div>
        </div>
    </lightning-popup>
</template>
```

The button calls the `openPopup()` function, which uses the `show()` method with `referenceElement` to align the popup relative to the button.

```js
import { LightningElement, track } from 'lwc';

export default class PopupExample extends LightningElement {
    @track enteredText = '';

    openPopup() {
        const referenceElement =
            this.template.querySelector('lightning-button');
        // Show the popup relative to the button, and left-align
        // the top of the popup with the bottom of the button
        this.popup.show(referenceElement, {
            reference: { horizontal: 'left', vertical: 'bottom' },
            popup: { horizontal: 'left', vertical: 'top' },
        });
    }

    handleCancel() {
        this.popup.close();
    }

    handleSave() {
        const name = this.template.querySelector('lightning-input');
        this.enteredText = name.value;

        this.popup.close();
    }

    get popup() {
        return this.template.querySelector('lightning-popup');
    }
}
```

#### Positioning the Popup

When a `referenceElement` is specified, the popup is positioned according to the specified rules in the `alignmentOptions`. The position rules specify
the preferred position, but the position can change depending on available space.

When the content of the popup doesn't fit, it can be flipped on horizontal or vertical axes for better fit. The `alignmentupdate` event is fired at that point with the new popup alignment.

For these properties:

```javascript
    {
      reference: { vertical: 'bottom', horizontal: 'center' },
      popup: { vertical: 'top', horizontal: 'center'
    },
```

The diamonds in this diagram represent the alignment points defined by `reference` and `popup` properties.

```
 ┌──────────────────┐
 │                  │
 │     reference    │
 │                  │
 └────────♦─────────┘
   ┌──────♦───────┐
   │              │
   │     popup    │
   │              │
   └──────────────┘
```

#### Methods

**`show(referenceElement, alignmentOptions)`**

Displays a popup. If you don't specify any parameters, the popup opens below the element that opened it. The popup is left-aligned with the element, with the top of the popup in contact with the bottom of the element.

| Parameter          | Type   | Description                                                                                                                          |
| ------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `referenceElement` | Object | An optional element to use as the anchor point for locating the popup.                                                               |
| `alignmentOptions` | Map    | An optional list of properties and key-value pairs used to set the preferred alignment between the `referenceElement` and the popup. |

`alignmentOptions` are specified with the following properties.

| Property    | Key          | Values                        | Description                                                                                                                                                                                                        |
| ----------- | ------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `reference` | `vertical`   | `top`, `center`, or `bottom`  | Preferred vertical alignment of the reference element relative to the popup. For example, specify `vertical: bottom` to make the popup align with the bottom of the reference element.                             |
|             | `horizontal` | `left` , `center`, or `right` | Preferred horizontal alignment of the reference element relative to the popup. For example, specify `horizontal: left` to make the popup align to the left edge of the reference element.                          |
| `popup`     | `vertical`   | `top`, `center`, or `bottom`  | Preferred vertical alignment of the popup relative to the reference element. For example, specify `vertical: top` to make the reference element align with the top of the popup.                                   |
|             | `horizontal` | `left` , `center`, or `right` | Preferred horizontal alignment of the popup relative to the reference element. For example, specify `horizontal: left` to make the popup align to the left edge of the reference element.                          |
| `padding`   | -            | number                        | Space in rem units to place between the contacting edges of the reference element and popup. Use `padding` to create space between the popup and the reference element and also to accommodate an arrow or nubbin. |
| `offset`    | -            | number                        | Space in rem units to offset the popup along the contacting edges. The offset in effect slides the popup so it is not aligned, and can be used to accommodate an arrow or nubbin.                                  |

`alignmentOptions` allows the following structure:

```javascript
     {
        reference: { vertical: 'bottom', horizontal: 'right' },
        popup: { vertical: 'bottom', horizontal: 'left' },
        padding: 1,
        offset: 1,
     }
```

#### Custom Events

**`autofocus`**

The event fired when the popup is about to place the focus on the first element you can tab to. If the event is canceled, the focus is not placed.

The `autofocus` event doesn't return a `detail` property.

The event properties are as follows.

| Property   | Value | Description                                                                    |
| ---------- | ----- | ------------------------------------------------------------------------------ |
| bubbles    | false | This event does not bubble.                                                    |
| cancelable | true  | This event can be canceled. You can call `preventDefault()` on this event.     |
| composed   | false | This event does not propagate outside the template in which it was dispatched. |

**`returnfocus`**

The event fired when the focus is returned to the element that had focus before the popup was displayed. If the event is canceled, the focus is not returned to the element.

The `returnfocus` event doesn't return a `detail` property.

The event properties are as follows.

| Property   | Value | Description                                                                    |
| ---------- | ----- | ------------------------------------------------------------------------------ |
| bubbles    | false | This event does not bubble.                                                    |
| cancelable | true  | This event can be canceled. You can call `preventDefault()` on this event.     |
| composed   | false | This event does not propagate outside the template in which it was dispatched. |

**`alignmentupdate`**

The event fired whenever the alignment of the popup has been updated, such as when the component flipped on the vertical or horizontal axis. This can occur if the space available for displaying the popup changes, and the alignment needs to change. The `alignmentupdate` event also fires on initial positioning of the popup.

The `alignmentupdate` event doesn't return a `detail` property.

The event properties are as follows.

| Property   | Value | Description                                                                                               |
| ---------- | ----- | --------------------------------------------------------------------------------------------------------- |
| bubbles    | false | This event does not bubble.                                                                               |
| cancelable | false | This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event. |
| composed   | false | This event does not propagate outside the template in which it was dispatched.                            |

**`clickout`**

The event fired when the user clicks outside of the popup after the popup has focus. The default behavior is to close the popup. If the event is canceled, the popup does not close.

The `clickout` event doesn't return a `detail` property.

The event properties are as follows.

| Property   | Value | Description                                                                    |
| ---------- | ----- | ------------------------------------------------------------------------------ |
| bubbles    | false | This event does not bubble.                                                    |
| cancelable | true  | This event can be canceled. You can call `preventDefault()` on this event.     |
| composed   | false | This event does not propagate outside the template in which it was dispatched. |

**`close`**

The event fired when the popup is open and the user presses the Esc key while focus is inside the popup, or
clicks outside of the popup after the focus has been inside the popup.

The `close` event doesn't return a `detail` property.

The event properties are as follows.

| Property   | Value | Description                                                                    |
| ---------- | ----- | ------------------------------------------------------------------------------ |
| bubbles    | false | This event does not bubble.                                                    |
| cancelable | true  | This event can be canceled. You can call `preventDefault()` on this event.     |
| composed   | false | This event does not propagate outside the template in which it was dispatched. |

#### Accessibility

A popup contains at least one tabbable element which automatically gets focus when the popup opens.

If a close button is present:

-   Press Tab to go from the last tabbable element to the close button.
-   Press Shift-Tab to go from the close button to the last tabbable element in the popup.
-   Press Enter when focused on the close button to close the popup.

Press Escape if the popup doesn't include a close button.

When the popup closes, focus returns to the element that had focus when the popup opened.
If there were no focused elements when the popup opened, the popup closes without making any focus changes.

If you create a popup that opens on hover over an element, provide a button nearby
to enable keyboard or screen reader users to open the popup.
