A `lightning-progress-step` component specifies a step inside the [`lightning-progress-indicator`](bundle/lightning-progress-indicator/documentation) component.
Specify the `label` attribute to define text displayed for the name or tooltip for the step.
Specify the `value` attribute to set the value used to reference the step.

To specify the current step, the `current-step` attribute on `lightning-progress-indicator`
must match one of the `value` attributes on a `lightning-progress-step` component.

```html
<template>
    <lightning-progress-indicator current-step="step2">
        <lightning-progress-step label="Step One" value="step1">
        </lightning-progress-step>
        <lightning-progress-step label="Step Two" value="step2">
        </lightning-progress-step>
        <lightning-progress-step label="Step Three" value="step3">
        </lightning-progress-step>
    </lightning-progress-indicator>
</template>
```

If the progress indicator type is not specified or is set to `base`, the
`label` text is displayed in a tooltip when you hover
over the step.

If the progress indicator type is `path`, the label is
displayed on hover if the step is completed or on the step itself if it's a
current or incomplete step.

For `base` type progress indicators, custom events implemented in `lightning-progress-step` fire during user interactions with the steps. Each event returns the index of the step. See the **Custom Events** section for more information.

For example, to get the index of the step that released focus, use the `event.detail` property on the `onstepblur` event handler.

```html
<template>
    <lightning-progress-indicator current-step="step2">
        <lightning-progress-step
            label="Step One"
            value="step1"
            onstepblur={handleStepBlur}
        >
        </lightning-progress-step>
        <lightning-progress-step
            label="Step Two"
            value="step2"
            onstepblur={handleStepBlur}
        >
        </lightning-progress-step>
        <lightning-progress-step
            label="Step Three"
            value="step3"
            onstepblur={handleStepBlur}
        >
        </lightning-progress-step>
    </lightning-progress-indicator>
</template>
```

```javascript
import { LightningElement } from 'lwc';

export default class MyDemoComponent extends LightningElement {
    handleStepBlur(event) {
        const stepIndex = event.detail.index;
    }
}
```

#### Usage Considerations

`lightning-progress-step` supports the custom events listed in the next section. It doesn't support the `click` event. To enable users to interactively update their progress to the next or previous steps, include a clickable element that updates the `current-step` value on `lightning-progress-indicator`. For more information, see the [lightning-progress-step documentation](bundle/lightning-progress-indicator/documentation).

#### Custom Events

The `lightning-progress-step` component supports these events for the `base` type of `lightning-progress-indicator`.

**`stepblur`**

The event fired when a step releases focus.

The `stepblur` event returns the following parameter.

| Parameter | Type   | Description                                |
| --------- | ------ | ------------------------------------------ |
| index     | string | The index of the step that released focus. |

The event properties are as follows.

| Property   | Value | Description                                                                                               |
| ---------- | ----- | --------------------------------------------------------------------------------------------------------- |
| bubbles    | true  | This event bubbles up through the DOM.                                                                    |
| cancelable | false | This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event. |
| composed   | false | This event does not propagate outside of the component in which it was dispatched.                        |

**`stepfocus`**

The event fired when a step receives focus.

The `stepfocus` event returns the following parameter.

| Parameter | Type   | Description                                |
| --------- | ------ | ------------------------------------------ |
| index     | string | The index of the step that received focus. |

The event properties are as follows.

| Property   | Value | Description                                                                                               |
| ---------- | ----- | --------------------------------------------------------------------------------------------------------- |
| bubbles    | true  | This event bubbles up through the DOM.                                                                    |
| cancelable | false | This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event. |
| composed   | false | This event does not propagate outside of the component in which it was dispatched.                        |

**`stepmouseenter`**

The event fired when the mouse pointer moves onto the step.

The `stepmouseenter` event returns the following parameter.

| Parameter | Type   | Description                                         |
| --------- | ------ | --------------------------------------------------- |
| index     | string | The index of the step the mouse pointer moves onto. |

The event properties are as follows.

| Property   | Value | Description                                                                                               |
| ---------- | ----- | --------------------------------------------------------------------------------------------------------- |
| bubbles    | true  | This event bubbles up through the DOM.                                                                    |
| cancelable | false | This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event. |
| composed   | false | This event does not propagate outside of the component in which it was dispatched.                        |

**`stepmouseleave`**

The event fired when the mouse pointer moves off the step.

The `stepmouseleave` event returns the following parameter.

| Parameter | Type   | Description                                           |
| --------- | ------ | ----------------------------------------------------- |
| index     | string | The index of the step the mouse pointer moves out of. |

The event properties are as follows.

| Property   | Value | Description                                                                                               |
| ---------- | ----- | --------------------------------------------------------------------------------------------------------- |
| bubbles    | true  | This event bubbles up through the DOM.                                                                    |
| cancelable | false | This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event. |
| composed   | false | This event does not propagate outside of the component in which it was dispatched.                        |

#### Accessibility

Each progress step is decorated with assistive text, which is also the label
of that step. For the `base` type, you can use the Tab key to navigate from one
step to the next. Press Shift+Tab to go to the previous step. For the `path`
type, press Tab to activate the current step and use the Up and Down Arrow key
or the Left and Right arrow key to navigate from one step to another.
