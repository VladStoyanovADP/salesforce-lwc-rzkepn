The `lightning/modal` module provides the `LightningModal` component to create a modal window on top of the current app window. A modal interrupts a user’s workflow.

`LightningModal` implements the SLDS [modals](https://www.lightningdesignsystem.com/components/modals/) blueprint.

Create a modal component in response to a user action, such as clicking a button or link. The modal blocks interaction with everything else on the page until the user acts upon or dismisses the modal.

Unlike other components, this component doesn't use a `lightning-modal` tag or extend `LightningElement`. There is no `lightning-modal` component. Instead, you create a modal by extending `LightningModal` and using these helper `lightning-modal-*` components to provide a header, footer and the body of the modal.
- `lightning-modal-body`
- `lightning-modal-header`
- `lightning-modal-footer`

To create a modal component, import `LightningModal` from `lightning/modal`. The component has access to the normal LWC resources as well as the special container, helper components, methods, and events of the `lightning/modal` module.

In this example, the `content` property passes data to the modal from the component that invokes it.

```js
/* c/myModal.js */

import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class MyModal extends LightningModal {
    @api content;

    handleOkay() {
        this.close('okay');
    }
}
```

The modal’s HTML template uses helper `lightning-modal-*` components to provide a header, footer, and the body of the modal. In this example, the content for the modal body comes from the `content` property we defined in the modal's JavaScript file.

```html
<!-- c/myModal.html -->

<template>
    <lightning-modal-header label="My Modal Heading"></lightning-modal-header>
    <lightning-modal-body> Content: {content} </lightning-modal-body>
    <lightning-modal-footer>
        <lightning-button label="OK" onclick={handleOkay}></lightning-button>
    </lightning-modal-footer>
</template>
```

The `lightning-modal-body` component is required for the modal template.

The `lightning-modal-header` and `lightning-modal-footer` components are optional, but recommended. The `lightning-modal-*` components render in the order they appear in the template. Place the `lightning-modal-body` component after `lightning-modal-header` and before the `lightning-modal-footer` component.

#### Open a Modal Instance

`LightningModal` provides an `.open()` method which opens a modal and returns a promise that asynchronously resolves with the result of the user’s interaction with the modal.

Each invocation of a modal component’s `.open()` method creates a unique instance of the modal. You can think of a modal as a self-contained application that starts from scratch when it opens. It displays the content you pass in through the `.open()` method or that you set within the modal's HTML template.

When you close a modal, the modal instance is destroyed, not hidden. On close, the modal must save the user’s input data or pass it to the invoking component as the promise result. Otherwise, the data is lost when the modal instance is closed.

The `.open()` method lets you assign values to the modal's properties. `LightningModal` provides these properties.

* `label` - Required. Sets the modal's title and assistive device label. If the modal has a header, set `label` in the `lightning-modal-header` component. If the modal doesn't have a header, set the `label` property when opening the modal.

* `size` - Determines how much of the viewport width the modal uses. Supported values are `small`, `medium`, `large`, and `full`. You can set the `size` attribute when you open the modal. Default value is `medium`. The height of the modal is determined by the amount of content in the `lightning-modal-body` component, and the `size` value. For more information on the `full` variant, see the **Styling Variants** section.

* `description` - Sets the modal's accessible description. It uses the `aria-description` attribute where supported, or falls back to `aria-describedby`. If you set a custom description value, include the label name at the beginning of your description, because some screen readers only read the description, and not the label.

* `disableClose` - Prevents closing the modal by normal means like the ESC key, the close button, or `.close()`. For example, you could briefly set `disableClose` to true while a completed form is saving, so the user doesn't dismiss the modal early. See [**Use the `disableClose` Attribute**](#use-the-disableclose-attribute).

In this example, the app opens the `myModal` component. It invokes the `.open()` method in a `handleClick()` function bound to the app button’s `onclick` attribute, and uses `async` and `await` keywords to handle the promise returned by `.open()`. This example overrides the `size` value by setting it to `large` and sets the modal’s user-defined property `content`.

```js
/* c/myApp.js */

import { LightningElement } from 'lwc';
import MyModal from 'c/myModal';

export default class MyApp extends LightningElement {
    async handleClick() {
        const result = await MyModal.open({
            // `label` is not included here in this example.
            // it is set on lightning-modal-header instead
            size: 'large',
            description: 'Accessible description of modal\'s purpose',
            content: 'Passed into content api',
        });
        // if modal closed with X button, promise returns result = 'undefined'
        // if modal closed with OK button, promise returns result = 'okay'
        console.log(result);
    }
}
```
The HTML template for this app contains a button that opens the modal and displays the result returned when the modal closes.

```html
<!-- c/myApp.html -->

<template>
    <lightning-button
        onclick={handleClick}
        aria-haspopup="dialog"
        label="Open My Modal">
    </lightning-button>
    <p>Result: {result}</p>
</template>
```

You can also use `.open()` to pass data from your invoking component into the modal with custom properties decorated with `@api`. These properties can be any type, such as a string or an object that’s an array of key/value pairs to be assigned to the new modal instance.

For example, this app component sets an `options` property to a set of key/value pairs in `MyModal.open()`. The promise is handled using an arrow function that logs the result to the console.

```js
/* c/myApp.js */

import { LightningElement } from "lwc";
import MyModal from "c/myModal";

export default class MyPage extends LightningElement {
  handleOpenClick() {
    MyModal.open({
      // maps to developer-created `@api options`
      options: [
        { id: 1, label: 'Option 1' },
        { id: 2, label: 'Option 2' },
      ]
    }).then((result) => {
        console.log(result);
    });
  }
}
```
The modal dialog can then use this property. In this case, the modal creates buttons whose labels are provided in the `options` array.

```js
/* c/myModal.js */

import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class MyModal extends LightningModal {
  // Data is passed to api properties via .open({ options: [] })
  @api options = [];
}
```

```html
<!-- c/myModal.html -->

<template>
    <lightning-modal-header label="My Modal Heading"></lightning-modal-header>
    <lightning-modal-body>
        Let's make some buttons!
        <template for:each={options} for:item="option">
            <lightning-button
              onclick={handleOptionClick}
              data-id={option.id}
              key={option.id}
            >
                {option.label}
            </lightning-button>
        </template>
    </lightning-modal-body>
</template>
```

#### Close a Modal Instance

Use `this.close(result)` to close the modal, where `result` is anything you want to return from the modal. The `.close()` operation is asynchronous to display a brief fade out animation before the modal is destroyed. The `result` data can’t be modified after the close operation begins.

You can also close the modal with the default close button, the X at the top right corner. Closing a modal like this is the same as calling `this.close()` with an `undefined` result, so any data input is lost.

This example shows the handler for some buttons inside a modal. When the user clicks the button, `this.close(id)` returns the option that they chose and the modal closes.

```js
/* c/myModal.js */

import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class MyModal extends LightningModal {
  // Data is passed to apis via .open({ options: [] })
  @api options = [];

  handleOptionClick(e) {
    const { target } = e;
    const { id } = target.dataset;
    // this.close() triggers closing the modal
    // the value of `id` is passed as the result
    this.close(id);
  }
}
```

```html
<!-- c/myModal.html -->

<template>
  <template for:each={options} for:item="option">
    <lightning-button
      onclick={handleOptionClick}
      data-id={option.id}
      key={option.id}
    >
      {option.label}
    </lightning-button>
  </template>
</template>
```

#### Use the `disableClose` Attribute

`disableClose` temporarily turns off the ability to dismiss the modal by normal means like the ESC key, the close button, or `this.close()`. For example, you could briefly set `disableClose` to `true` while a completed form is saving, so the user doesn't dismiss the modal early.

Preventing a modal's close should be a temporary state. Use `disableClose` for less than 5 seconds. Accessibility is affected if you trap keyboard focus inappropriately. See [No Keyboard Trap](https://www.w3.org/TR/UNDERSTANDING-WCAG20/keyboard-operation-trapping.html) for more information.

When the process using `disableClose` finishes successfully, dismiss the modal. If the process using `disableClose` fails, re-enable the ability to dismiss the modal with `disableClose = false`, or give feedback to help the user resolve the issue.

While `disableClose` is `true`, disable any processes or UI buttons that might call `Modal.close()`.

This example shows how to use `disableClose`. It's not a fully functional example, but could be used in a complex modal component.

```js
/* c/myModalForm.js */
/* This is intended as a mock example, not as fully functional code */
/* NOTE: observe values set:
   this.disableClose (in JS),
   and this.saveInProcess (in JS and HTML)
*/
import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class MyModalForm extends LightningModal {
  // formData is utilized for saving current form values
  formData = {};
  failureType = null;
  saveStatus = {};
  saveInProcess = false;

  handleCloseClick() {
    this.close('canceled');
  }

  closeModal() {
    // immediately exits, so no need to trigger
    // this.disableClose = false OR
    // this.saveInProcess = false;
    // modal is destroyed, and focus moves
    // back to originally clicked item that
    // generated the modal
    this.close('success');
  }

  mitigateSaveFailure() {
    // depending on how easily the failure can be resolved
    // you may need to immediately set disableClose = false
    if (this.failureType === 'recoverable') {
      // no need to call this.disableClose = false
      // or this.saveInProgress = false yet
      tryToFixFailure();
    } else {
      // can't resolve the error
      // need to allow users to exit modal
      this.disableClose = false;
      this.saveInProcess = false;
      // mock function to indicate modal state
      // while still allowing user to exit
      // preventing keyboard trap
      reportUnresolvableError();
    }
  }

  async saveData() {
    // switches disabled state on buttons
    this.saveInProcess = true;
    const saveStatus = await sendData(this.formData);
    return (saveStatus && saveStatus.success)
      ? closeModal()
      : mitigateSaveFailure();
  }

  async handleSaveClick() {
    if (isValid(this.formData)) {
      // begin saving data, temporarily disable
      // LightningModal's close button
      // Be sure to reenable the close button, by setting
      // this.disableClose = false, IF further interaction
      // is desired before the modal closes
      this.disableClose = true;
      await saveData();
    } else {
      // function that display form errors based on data
      showFormErrors(this.formData);
    }
  }
}
```

```html
<!-- c/myModalForm.html -->

<template>
    <lightning-modal-header
      label="My Modal Heading"
    ></lightning-modal-header>
    <lightning-modal-body>
      <!-- form here -->
    </lightning-modal-body>
    <lightning-modal-footer>
      <button
        disabled={saveInProcess}
        onclick={handleCloseClick}
        aria-label="Cancel and close"
      >Cancel</button>
      <button
        disabled={saveInProcess}
        onclick={handleSaveClick}
      >Save</button>
    </lightning-modal-footer>
</template>
```

#### Modal Events

A modal can only fire events captured by the component that opened it, not the modal itself. Normal techniques can't catch events that fire from the modal, because the events bubble up to a top root element outside of the component that opened the modal.

To capture modal events, attach them in the `.open()` method invoked by the component that opens the modal.

Capturing modal events requires [Lightning Web Security (LWS)](https://developer.salesforce.com/docs/platform/lwc/guide/security-lwsec-enable) to be enabled in the Salesforce org. See the **Modal Events with LWS and Lightning Locker** section for more information.

For example, here's a custom `select` event dispatched from `MyModal`.

```js
/* c/myModal.js */
dispatchSelectEvent(e) {
  // e.target might represent an input with an id and value
  const { id, value } = e.target;
  const selectEvent = new CustomEvent('select', {
    detail: { id, value }
  });
  this.dispatchEvent(selectEvent);
}
```

The `open()` method in `myApp` defines the `onselect` event handler. This example uses `onselect` to proxy events that we want to pass through.

```js
/* c/myApp.js */

// ...
// Process the select event from within the modal
handleSelectEvent(detail) {
  const { id, value } = detail;
  console.log(`select event fired elem with id ${id} and value: ${value}`);
}

// ...
// Trigger visibility of the modal
handleOpenModal() {
  MyModal.open({
    label: 'Modal Title',
    size: 'large',
    description: 'Modal Title with brief description',
    // event triggered when new CustomEvent('select', {detail: {}});
    // occurs *from within* LightningModal.
    // see dispatchSelectEvent() in c/myModal.js above
    onselect: (e) => {
      // stop further propagation of the event
      e.stopPropagation();
      // hand off to separate function to process
      // result of the event (see above in this example)
      this.handleSelectEvent(e.detail);
      // or proxy to be handled above by dispatching
      // another custom event to pass on the event
      // this.dispatchEvent(e);
    }
  });
}
```

See [Create and Dispatch Events](https://developer.salesforce.com/docs/platform/lwc/guide/events-create-dispatch) in the LWC Dev Guide for more information about events.

#### Modal Events with LWS and Lightning Locker

Modal events work as expected when Lightning Web Security (LWS) is enabled within a Salesforce org, as described in the **Modal Events** section. If LWS isn't enabled in an org, Lightning Locker is in effect.

LWS is replacing Lightning Locker over time and is already enabled in many customer orgs. New orgs have LWS enabled by default. To enable LWS, see [Enable Lightning Web Security in an Org](https://developer.salesforce.com/docs/platform/lwc/guide/security-lwsec-enable) in the Lightning Web Components Developer Guide.

Under Lightning Locker, when you fire events within `LightningModal`, the browser throws a `TypeError` related to `dispatchEvent`. If your modal component runs in an org that can’t enable LWS yet, the workaround is to wrap the code that calls `dispatchEvent` in a child component that extends `LightningElement`. Use the wrapper component as a child of one of the modal components in the modal template.

#### Modal Events with Aura

For `LightningModal`, only the top level LWC component or application can communicate to the parent Aura component or application layer with eventing. This topmost component is usually the one that opens the `LightningModal`. `LightningModal`'s child components can't event to a parent Aura component or application layer.

All required eventing that should occur during the `LightningModal`'s life cycle must be passed in when you call `Modal.open()`. See `onselect` within `.open()` in the **Modal Events** section.

If you want the Aura layer to respond to events within child components embedded in the `LightningModal`, use event bubbling to move any data that you want to make available to the Aura layer into the topmost LWC component that opened the modal. Then, send the event from the LWC component.

With this in mind, there are two suggested methods for extracting data from the `LightningModal` to the Aura layer.

1. To only communicate data out of modal after it's closed, first, close the modal, and pass the data out with `this.close({ data })`, and handle the data received in `.then((result) { ... })` where the Modal is initially opened.
2. To continuously communicate data out of the `LightningModal` while the modal remains open, use events created and passed in when opening the modal from `Modal.open({ size, title, onmyevent })`.

These extracting methods fit into the larger LWC Modal-to-Aura event workflow.

1. Pass any events that should occur within the modal through `LightningModal`'s `.open()` method
2. Have the `LightningModal` JavaScript code fire any custom events
3. In the topmost LWC component that opened the modal, create an event handler to process the events, including stopping propagation.
4. Fire a separate event containing the LWC-processed event details and send it to the Aura parent component.
5. Use an Aura-based event handler to handle and process the event.

For more information, see [Send Events to an Enclosing Aura Component](https://developer.salesforce.com/docs/platform/lwc/guide/events-sending-to-aura-components) and [Events Best Practices](https://developer.salesforce.com/docs/platform/lwc/guide/events-best-practices).

Let's see this workflow in action. In this example, we'll create a button (`lightning-button`) that launches a modal (`LightningModal`) containing a tree grid component (`lightning-tree-grid`) with a button in each record row that automatically navigates our user to that record's page (`lightning-navigation`). This use case requires data passing between our LWC components and a parent Aura component.

Because `lightning-navigation` requires you to pass in a `recordId` to construct a page reference, we need to pass the record's data out of `LightningModal`, and then use the methods provided by `lightning-navigation`. With modal's limitations for event bubbling to the Aura layer, we can't just wrap the button or treegrid with `lightning-navigation`. We need to pull that data up to the topmost LWC component, where the `LightningModal` `.open()` is called, for our Aura wrapper to handle the navigation.

However, in [Aura-based Experience Builder sites](https://developer.salesforce.com/docs/atlas.en-us.communities_dev.meta/communities_dev/communities_dev_basics_templates.htm), the `NavigationMixin` event can reach the Aura layer without being affected by the modal's limitations.

So, we `import` the `lightning-navigation` component into the topmost LWC component that sits within the Aura layer by passing the data through `LightningModal`'s close method, `this.close({ data })`. Then the parent LWC component invokes the methods provided by `lightning-navigation`, which handles the navigation away from the page after the modal exits. From a UX perspective, this also lets us close the modal first, since `lightning-navigation` takes the user away from the current page.

Note that this sample code isn't fully functional. We're only showing the relevant code that makes the `lightning-navigation` use case work with `LightningModal`.

Here's our Aura component, containing our topmost LWC component, `myLwcAppModalLauncher`.

```html
/* c/myApp.cmp */
<aura:component>
    <!-- <c:myLwcTreeGridWithNavigation/> component is a child component
        inside of <c:myLwcAppModalLauncher/>
    -->
    <c:myLwcAppModalLauncher/>
</aura:component>
```

The topmost component, `myLwcAppModalLauncher`, launches and handles events that occur within our modal (`MyModal`). `myLwcAppModalLauncher` is also where we import the `lightning-navigation` component and use the `rowId` handed up through modal's `this.close({ ..., rowId })` function.

```html
<!-- c/myLwcAppModalLauncher.html -->

<template>
    <lightning-button
        onclick={handleModalOpen}
        aria-haspopup="dialog"
        label="Launch Navigation Modal">
    </lightning-button>
</template>
```

```js
/* c/myLwcAppModalLauncher.js */

import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import MyModal from 'c/myModalWithTreeGridNavigation';

export default class MyLwcAppModalLauncher extends NavigationMixin(LightningElement) {

/// ... other modal code

handleModalOpen() {
    // open up the Modal
    MyModal.open({
        size: 'medium',
        heading: 'Navigate to Record Page',
        description: 'Navigate to a record page by clicking the row button',
        options: [{ data }, { data }],
    }).then((result) => {
        // when the LightningModal closes, result is whatever
        // data that was passed out using this.close({ data })
        if (result === null) {
            // do something else
        } else {
            // shouldNavigate is boolean, arbitrary
            // rowId is what's needed for lightning-navigation
            const { shouldNavigate, rowId } = result;
            if (shouldNavigate) {
                this.navigateToObjectHome(rowId);
            }
        }
    });
}

navigateToObjectHome(rowId) {
    // construct the page ref
    const pageRef = {
        type: 'standard__recordPage',
        attributes: {
            recordId: rowId,
            actionName: 'view'
        }
    }
    // then call the .Navigate method with the pageRef
    this[NavigationMixin.Navigate](pageRef);
}

/* ... other modal code */
```

This `template` is our modal, containing a tree grid with the navigation buttons, named `c-my-lwc-tree-grid-with-navigation`. The `handleNavSelection` function in this component processes the `rowId` data for the modal component to pass to its parent.

```html
<!-- c/myModalWithTreeGridNavigation.html -->
<template>
    <lightning-modal-header label="My Modal Heading">
        The modal tagline.
    </lightning-modal-header>
    <lightning-modal-body>
        <h2>Choose a record to navigate to:</h2>
        <!-- custom event listener when button clicked inside tree grid -->
        <div onnavselection={handleNavSelection}>
            <c-my-lwc-tree-grid-with-navigation></c-my-lwc-tree-grid-with-navigation>
        </div>
    </lightning-modal-body>
    <!-- no <lightning-modal-footer> in this example -->
</template>
```

```js
/* c/myModalWithTreeGridNavigation.js */
handleNavSelection(event) {
    event.stopPropagation();
    const { detail: { rowId } } = event;
    if (rowId) {
        // rowId value is important to lightning-navigation
        // passing this data out through the LightningModal's
        // .close() method, then handled in the .then((result) {})
        // see code above: c/myLwcAppModalLauncher.js
        this.close({ shouldNavigate: true, rowId });
    }
}
```

```js
/* c/myLwcTreeGridWithNavigation.js */

dispatchNavSelectionEvent(rowId) {
    // add rowId to event.detail
    // this custom event listener exists in
    // LightningModal body code, see code above:
    // c/myModalWithTreeGridNavigation.html
    const eventToFire = new CustomEvent('navselection', {
        detail: { rowId },
        bubbles: true,
        cancelable: false
    });
    // dispatch custom event
    // see event listener added to lightning-modal-body
    this.dispatchEvent(eventToFire);
}

handleRowButtonClick(event) {
    // simplified handler to get row.Id
    // from the tree grid row button that was clicked
    const row = event.detail.row;
    this.dispatchNavSelectionEvent(row.Id);
}
```

#### Styling Forms in Native Shadow

NOTE:
- Due to the intentional changes introduced with Native Shadow, it is important to understand that styles outside of your modal's code will not be able to style elements within your modal.
- Don't import SLDS styles your web UI doesn't actually use. Adding extra CSS files will cause the performance of your web UI to be lowered

A common use case for `LightningModal` is to include a form and form elements with common SLDS layouts.  While the individual Lightning Base Components will contain their own styles in Native Shadow, [Lightning Design System form element styling](https://www.lightningdesignsystem.com/components/form-element/#Stacked) for form layouts like the form element variants [Stacked](https://www.lightningdesignsystem.com/components/form-element/#Stacked), [Horizontal](https://www.lightningdesignsystem.com/components/form-element/#Horizontal) and [Compound](https://www.lightningdesignsystem.com/components/form-element/#Compound) aren't present in Native Shadow, but still needed.

In order to address this, you can import the form element layout library, `lightning/sldsFormElementUtils`, into your `LightningModal`'s implementation code, along with other commonly needed libaries.

Following the previous `c/myModalWithTreeGridNavigation` implementation example, you might import these styles in the following fashion.

```css
/* c/myModalWithTreeGridNavigation.css */

/* provides base SLDS styling for H1-H6, P, UL, etc elements */
/* recommended for most customers */
@import 'lightning/sldsCommon';
/* provides SLDS form element styles for Stacked, Horizontal, Compound layouts */
/* recommended for customers building forms, and need form element variant classes */
@import 'lightning/sldsFormElementUtils';
/* provides column sizing for grid layouts */
/* recommended for customers working with grid and grid sizing SLDS styles*/
@import 'lightning/sldsUtilsSizing';
/* ... */
.your-other-specific-styles-inside-the-modal {
    border: 1px solid #c00;
}
```

#### Styling Variants

The `lightning-modal-header` and `lightning-modal-footer` child components are optional, and you can choose to not include one or the other in your modal.

The headerless variant of `LightningModal` has these additional requirements.
- Must set a descriptive modal title with the `label` property using `Modal.open({ label })` or you’ll get a console error.
-  The `label` property is required for all variants of `LightningModal`. Assistive devices read the `label` value, even though the headerless modal variant doesn't display the label.
-  Because this variant doesn't use `lightning-modal-header`, you have to manually create an `<h1>` heading in `lightning-modal-body`. Provide accessible structure by starting with heading level `<h1>` and using levels up to `<h6>` appropriately. For more information, see [Semantic Structure, Headings on WebAim.org](https://webaim.org/techniques/semanticstructure/#headings).

You can also create a full-screen modal component by setting the `size` attribute to `full`. This variant resizes the modal to the full width and height of the viewport on screens up to 30em (~480 pixels or less), like mobile phone devices. On screens larger than 30em (~481 pixels or larger), like desktop monitors or tablets, a `size=full` modal has the same behavior as a modal with `size=large` set.

The `LightningModal` component also supports the SLDS [Directional variant](https://www.lightningdesignsystem.com/components/modals/#Directional) modal blueprint pattern.

To achieve the directional button layout, place the buttons in a `div` with the `slds-modal__footer_directional` class.

```html
<!-- c/modalDirectional.html -->

<template>
    <lightning-modal-body> Content: {content} </lightning-modal-body>
    <lightning-modal-footer>
        <div class=“slds-modal__footer_directional”>
            <lightning-button label="NO" onclick={handleNo}></lightning-button>
            <lightning-button label="OK" onclick={handleOkay}></lightning-button>
        </div>
    </lightning-modal-footer>
</template>
```

#### Styling Hooks

The `lightning-modal-*` helper components support [style hooks](https://www.lightningdesignsystem.com/components/modals/#Styling-Hooks-Overview). The styling hooks for the template that invokes the helper components doesn't carry over to them, so you must style each helper component individually.

Use styling hooks to add styles to modal components. Any other values for the `style` attribute are ignored.

```javascript
MyModal.open({
  style: {
    '--slds-c-modal-color-border': 'red'
  }
})`
```

Customizing the styling on the white modal frame and background, close button, or gray backdrop isn't supported.

#### Accessibility

Upon opening, the modal determines where to place focus as follows.

* When the modal header is present, the modal component places the focus on the title text in the header.
* When a modal header isn’t present, the modal component places the focus on the first interactive element in the modal body, such as a link, button, or input field.
* When the modal body doesn’t have interactive elements, or the only interactive element is a tooltip, the modal component places focus on the close button.

The focus is determined according to
the [Global Focus Guidelines](https://www.lightningdesignsystem.com/accessibility/guidelines/global-focus/#dialogs) for Lightning Design System.

The `lightning-modal-header` component renders the `label` value in an `<h1>` element. If your modal uses the header, begin any additional heading levels in the modal with `<h2>` for accessibility. Provide accessible structure by using heading levels up to `<h6>` appropriately. For more information, see [Semantic Structure, Headings on WebAim.org](https://webaim.org/techniques/semanticstructure/#headings).

To include tagline text or link content for the header section, add it between the `<lightning-modal-header>` tags.

#### Unit Testing

Writing unit tests for `LightningModal` requires two sets of tests.
1. Parent components that use `c/myModal` define a mocked result when `.open()` is called during a test run. This mock speeds up testing and prevents repetition while testing actions that trigger modals.
2. The unit tests for `c/myModal` test the end-to-end functionality of the modal as a self contained component.

This example is a mock of a component called myModal. The parent component uses the modal to mock the `c/myModal` component's `.open` method. The mock `.open` resolves a constant value without opening the MyModal component. This example uses a button to open a modal and set the result in the template.

```html
<!-- c/myApp.html -->
<button data-button onclick={handleClick}>Select Item</button>
<div data-result>{result}</div>
```

```js
/* myApp.spec.js */

import MyModal from 'c/myModal';
jest.mock('c/myModal');

test(() => {
    // Create and appendChild(element)

    const buttonEle = element.shadowRoot.querySelector('[data-button]');
    const resultEle = element.shadowRoot.querySelector('[data-result]');

    // Mock .open() to resolve result 'option1'
    MyModal.open = jest.fn().mockResolvedValue('option1');
    // Initial value
    expect(resultEle.textContent).toBe(undefined);
    // Click modal open button
    buttonEle.click();

    // Click handler render cycle
    await Promise.resolve();
    // Render cycle triggered by tracked value {result}
    await Promise.resolve();

    // Verify result is set in the prompt template
    expect(resultEle.textContent).toBe('option1');
    // Open triggered once
    expect(MyModal.open.mock.calls).toHaveLength(1);
})
```

This example contains the unit tests for the actual `c/myModal` component. The tests use shorthand selectors to make unit testing more concise. For more information, see **Shorthand Selectors for `LightningModal`**.

```js
/* myModal.spec.js */

import { createElement } from 'lwc';
import MyModal from 'c/myModal';

describe('c-my-modal', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('should select body elements', async () => {
        const element = createElement('c-mymodal', {
            is: MyModal
        });
        document.body.appendChild(element);

        // If element apis are modified after appendChild
        // await Promise.resolve();

        // using shorthand selector for modalBody
        // see list of selectors below
        expect(element.modalBody$('button').textContent).toBe('hello world');
    });
});
```

#### Shorthand Selectors for `LightningModal`

The stubs for `LightningModal` have shorthand selectors to make unit testing more concise. These are all the shorthand selectors for unit testing that you can use with `LightningModal`.

- `element.closeValue` - Value passed into `this.close(value)`
- `element.modalHeader$()` - querySelect a single node in `lightning-modal-header`
  - Usage: `element.modalHeader$('a')` Returns first link
- `element.modalHeader$$()` - querySelectAll multiple nodes in `lightning-modal-header`
  - Usage:
    - `elem.modalHeader$$()` Returns all nodes in header
    - `elem.modalHeader$$('a')` Returns all links in header
- `element.modalBody$()` - querySelect a single node in `lightning-modal-body`
  - Usage: `element.modalBody$('button')` Returns first button
- `element.modalBody$$()` - querySelectAll multiple nodes in `lightning-modal-body`
  - Usage:
    - `elem.modalBody$$()` Returns all nodes in body
    - `elem.modalBody$$('button, [data-button]')` Returns buttons in body
- `element.modalFooter$()` - querySelect a single node in `lightning-modal-footer`
  - Usage: `element.modalFooter$('button')` Returns first button
- `element.modalFooter$$()` - querySelectAll multiple nodes in `lightning-modal-footer`
  - Usage:
    - `elem.modalFooter$$()` Returns all nodes in footer
    - `elem.modalFooter$$('button, [data-button]')` Returns buttons in footer
