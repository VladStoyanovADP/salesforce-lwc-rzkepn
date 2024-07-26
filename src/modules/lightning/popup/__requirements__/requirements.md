-   A popup must have at least one focusable element inside

-   Popup should trap the focus (pressing Tab on the last element goes to the close button, and Shift-Tab on the close button goes to the last focusable element)

-   Pressing the Escape the key should close the popup and `close` event should be dispatched

-   Clicking out of the popup should close the popup and `clickout` (cancelable) event should be dispatched; if `clickout` event is not canceled the popup is closed and `close` event is dispatched

-   Clicking anywhere inside the popup (not on a focusable element) should not close the popup

-   User focus should be placed back on the element focused when the popover opened. If there were no focused elements prior, the popup should close without making any focus changes.

-   The content of the slot should only be present in the DOM when the popup is visible (which means it should not be in the dom before it's shown, and after it's closed).

-   It should be possible to re-open a closed popup

**Methods**

-   `show(referenceElement, alignmentOptions)` when called should show the popup.

    -   Should accept an optional `referenceElement` element which is used for alignment

    -   Should not do auto-positioning when `referenceElement` is not specified (note: this is so that one can position the popup manually)

    -   `alignmentOptions` allows the following structure:

    ```
     {
        // vertical values are 'top', 'center' and 'bottom'
        // horizontal values are 'left , 'center' and 'right'
        reference: { vertical: 'bottom', horizontal: 'right' },
        popup: { vertical: 'bottom', horizontal: 'left' },
        // padding is a float number in rem unit
        padding: 1,
        // offset is a float number in rem unit
        offset: 1,
     }
    ```

    -   When `referenceElement` is specified, should accept an optional `alignmentOptions` object (map), which is used for setting preferred alignment between the `referenceElement` and the popup. Alignment options accept four properties - `reference`, `popup`, `padding` and `offset`. `reference` is a map made of `vertical` and `horizontal` attributes and it defines the preferred anchor point that the popup will stick to. `popup` defines the preferred point of the popup that will stick to the reference point of the element, valid values are the same as for the `reference`. Depending on the space available the popup alignment may change and `alignmentupdate` will fire. `padding` determines the space in 'rem' between the contacting edges of the reference element and popup, it could be used to create some distance between popup and the reference element and also to accommodate an arrow. `offset` represents the offset in 'rem' of the popup along the contacting edges, it could be used to accommodate an arrow.

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

    Diamond represents the alignment points defined by `reference` and `popup` properties.

    ```
      {
        reference: { vertical: 'bottom', horizontal: 'center' },
        popup: { vertical: 'top', horizontal: 'center'
      },
    ```

    -   Should not throw an error when `alignmentOptions` is not set. Not passing alignment options should be equivalent to passing the following options:

        ```
        {
           reference: { vertical: 'bottom', horizontal: 'right' },
           popup: { vertical: 'bottom', horizontal: 'left' },
           padding: 0,
           offset: 0,
        }
        ```

-   `close` when called should close the popup without dispatching any events. Auto-positioning should be stopped.

**Properties**

-   `alignment` represents the alignment of the popup relative to the `referenceElement` (see `show` method), its structure is the same as for `alignmentOptions`'s `popup`. Default is:

    ```
     { vertical: 'bottom', horizontal: 'left' }
    ```

This property is updated before `alignmentupdate` event is dispatched.

**Events**

-   `close` event is dispatched when the popup is opened and the user either:

    -   presses Esc key while focus is inside the popup
    -   clicks outside of the popup after the focus has been inside the popup

-   `autofocus` cancelable event is dispatched when the popup is about to place the focus on the first tabbable element; if the event is canceled the focus will not be placed

-   `returnfocus` cancelable event should be dispatched when the focus is returned to the element that had focus prior to popup showing; if the event is canceled the focus is not returned

-   `alignmentupdate` event should be dispatched whenever the alignment of the popup has been updated (for example the component flipped on the vertical or horizontal axis). It should also be dispatched on initial positioning of the popup.

-   `clickout` cancelable event should be dispatched when the user has clicked outside of the popup after the popup had the focus, the default behaviour is to close the popup; if the event is canceled the popup should not close

**Positioning logic**

-   When a referenceElement is specified, the popup should be positioned based on the specified rules in the `alignmentOptions`.

-   When the content of the popup doesn't fit, it may be flipped on horizontal and/or vertical axes for better fit (describe positionLibrary logic here), `alignmentupdate` may be fired at that point with the new popup alignment.
