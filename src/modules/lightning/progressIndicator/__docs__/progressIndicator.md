---
examples:
    - name: basic
      label: Base Type Progress Indicator
      description: A progress indicator shows the current step in a process and any previous or later steps.
    - name: pathType
      label: Path Type Progress Indicator
      description: The path type displays with a different visual styling than the base progress indicator.
    - name: pathTypeWithIteration
      label: Path Type with Iteration
      description: Steps can be created from a data source using iteration.
    - name: pathTypeWithIfCondition
      label: Path Type with If Condition
      description: Steps can be displayed conditionally.
---

A `lightning-progress-indicator` component displays a horizontal list of steps
in a process, indicating the number of steps in a given process, the current
step, as well as prior steps completed. For example, Sales Path uses a
progress indicator to guide sales reps through the stages of the sales
process.

You can create progress indicators with different visual styling by specifying
the `type` attribute. Set `type="base"` to create a component that implements the
[progress indicator](https://www.lightningdesignsystem.com/components/progress-indicator/)
blueprint in the Lightning Design System. The vertical progress indicator isn't currently supported.

Set `type="path"` to create a
component that implements the
[path](https://www.lightningdesignsystem.com/components/path/) blueprint in the
Lightning Design System. Stage coaching information isn't currently supported.

To create steps, use one or more `lightning-progress-step` component along with `label`
and `value` attributes. To specify the current step, the `current-step`
attribute must match one of the `value` attributes on a
`lightning-progress-step` component.

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

If the type is not specified, the default type `base` is used.
The `label` value is displayed in a tooltip when you hover
over the step. If the progress indicator type is `path`, the label is
displayed on hover if the step is completed or on the step itself if it's a
current or incomplete step.

This example creates a path showing the current step at "Step Two". "Step One"
is marked completed and "Step Three" is not yet completed.

```html
<template>
    <lightning-progress-indicator type="path" current-step="step2">
        <lightning-progress-step label="Step One" value="step1">
        </lightning-progress-step>
        <lightning-progress-step label="Step Two" value="step2">
        </lightning-progress-step>
        <lightning-progress-step label="Step Three" value="step3">
        </lightning-progress-step>
    </lightning-progress-indicator>
</template>
```

The component displays the current step in an active state. It marks all steps preceding the current step as completed.

#### Implementing the Error State

To denote an error on the current step, set `has-error` to `true`. Only the `base` type supports the error state.
This example creates a progress indicator that updates to the next step and applies an error on the current step.

```html
<lightning-progress-indicator
    current-step={current}
    type="base"
    has-error={error}
>
    <lightning-progress-step
        label="Step 1"
        value="s1"
    ></lightning-progress-step>
    <lightning-progress-step
        label="Step 2"
        value="s2"
    ></lightning-progress-step>
    <lightning-progress-step
        label="Step 3"
        value="s3"
    ></lightning-progress-step>
    <lightning-progress-step
        label="Step 4"
        value="s4"
    ></lightning-progress-step>
</lightning-progress-indicator>
<lightning-button label="Next step" onclick={nextStep}></lightning-button>
<lightning-button label="Show error" onclick={addError}></lightning-button>
```

Applying an error state on the current step updates the completed icon to an error icon,
similar to the [progress indicator](https://www.lightningdesignsystem.com/components/progress-indicator/#Error-in-a-Step) SLDS blueprint.

```js
import { LightningElement } from 'lwc';

export default class ProgressIndicatorError extends LightningElement {
    current = 's3';
    error = false;

    nextStep() {
        this.current = 's4';
    }

    addError() {
        this.error = true;
    }
}
```

#### Accessibility

Each progress step is rendered with assistive text, which is constructed from the step's label and a description of the step's state.
For example, for a step labeled Contacted, the assistive text is "Contacted - Current Stage" when the step is the current step, and "Contacted - Stage Complete" when the step is completed. The text of the step's state can't be changed.

| Step      | Assistive Text         |
| --------- | ---------------------- |
| Current   | Label - Current Stage  |
| Inactive  | Label                  |
| Completed | Label - Stage Complete |
| Error     | Label                  |

The assistive text for a step that's inactive or has an error doesn't include information about the step's state.

For the `base` type, you can use the Tab key to navigate from one step to the next. Each step connects to the next
step with a horizontal progress bar, such that two steps share one bar.
Press Shift+Tab to go to the previous step. The progress bar renders with `aria-valuenow` set to a scale of 0 to 100,
which defines the current value for the progress bar. For example, if you have 4 steps and the third step is the current,
`aria-valuenow` is set to 66, since 2 out of 3 bars are marked as completed.
Similarly, the `aria-valuemin` and `aria-valuemax` attributes are set to 0 and 100 respectively.

For the `path` type, press Tab to set focus on the active stage and use the Up and Down Arrow keys
or the Left and Right arrow keys to navigate from one stage to another. The `aria-selected` attribute on the hyperlink element associated to the stage is set to `true` when a stage receives focus and `false` when it doesn't receive focus.

When you navigate away from the current active stage, the stage remains the current stage but the shift in focus makes it inactive. The current stage changes color from dark blue to white to indicate it's not the active stage. Additionally:

-   Navigating to an incomplete stage makes it an active incomplete stage, which changes its color from gray to dark blue
-   Navigating to a completed stage makes it an active completed stage, which changes its color from green to dark blue
