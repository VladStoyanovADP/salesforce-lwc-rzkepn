### Specification

-   The modal accepts a “header” as a string attribute.
-   The modal accepts content in the form of the default slot.
-   The modal accepts a footer in the form of the named “footer” slot.
-   When opening a modal, the focus goes to the first tabbable element (we define this as a visible/non-disabled element that has a tabIndex of 0 and is not within a custom element with tabindex attribute of “-1" on it));
    if none, then the focus is set on the close "x" button.
-   When opening a modal dialog, all the modal dialog's sibling nodes (including up the tree) will have aria-hidden=true to make them inert from accessibility perspective.
-   When a modal dialog is showing, a backdrop appears blocking any mouse interactions.
-   When a modal dialog is showing the focus is trapped for both sequential Tabs and Shift-Tabs, after the last tabbable element of the modal the focus needs to go to the close button, and if using Shift-Tab on the close button, the focus goes on the last tabbable element.
-   When the last tabbable element of the modal dialog is either removed or changed order the focus trapping should continue to work in the manner described above.
-   When the last tabbable is still in the DOM but no longer last, it will have its keydown listener removed and tabbing from it will lead to the next element.
-   When a dialog is closed, a 'close' event is dispatched.
-   When a dialog is closed, the focus returns to the element that was in focus before opening of the modal dialog. If no such element is found, document.body is focused.
-   When closing a modal dialog, the aria-hiddens of the modal dialog's sibling nodes are restored to their previous values (that is, if an element had aria-hidden="true" it will be preserved).
-   Clicking on the "x" (close) button closes the dialog and dispatches the 'close' and 'cancel' events (the latter is cancelable).
-   Pressing "Escape" closes the dialog, and dispatches 'close' and 'cancel' events (the latter is cancelable).
-   Opening and closing of the same dialog is possible (and will not leave any dangling references or extra DOM elements).
-   When opening a modal and there is another modal already opened, the second modal will not show and a console warning will appear.
-   Preventing the default behaviour of the 'cancel' event prevents the dialog from closing.
