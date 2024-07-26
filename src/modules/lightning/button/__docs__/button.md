---
examples:
    - name: basic
      label: Basic Buttons
      description: Button variants display the buttons with different colors to convey different meanings. The default variant is neutral.
    - name: disabled
      label: Disabled Buttons
      description: Disabled buttons are grayed out and can't be clicked.
    - name: withIcon
      label: Buttons with Icons
      description: Buttons can include a utility icon next to the label for decorative purposes. The default icon position is left.
    - name: inverse
      label: Inverse Buttons
      description: Buttons with the inverse variant are transparent and have light-colored labels, which works well with a dark background.
    - name: onclick
      label: Buttons with Custom onclick Actions
      description: Buttons can use custom onclick handlers to perform actions.
    - name: accesskey
      label: Buttons with Accesskey and Tabindex Attributes
      description: Buttons define access key shortcuts with the accesskey attribute, and use the tabindex attribute to determine the order in which those buttons are visited when using the tab key.
---

A `lightning-button` component represents a button element that executes an
action. Use `lightning-button` where users need to:

-   Submit or reset a form
-   Begin a new task
-   Trigger a new UI element to appear on the page
-   Specify a new or next step in a process

Use the `type` attribute to specify `button`, `submit`, or `reset`. The default type is `button` and doesn't need to be specified.

The `submit` and `reset` types create buttons for submitting and resetting form data.
Use these button types in `lightning-record-edit-form` and the HTML `form` element. The `reset` type button only deletes the values in the form fields without interacting with the database. For information about resetting the form fields to their initial values, see
[`lightning-record-edit-form`](bundle/lightning-record-edit-form/documentation) .

For the default button, clicking the button triggers the `click` event. Use an `onclick` handler to perform the button's action.

You can create a button with a label only, or add the `icon-name` attribute
for a button with a label and icon. To create an icon-only
button, use the `lightning-button-icon` component instead.

Here's an example that creates a button with the `brand` variant, and displays
`label` text on the button. The `title` attribute provides tooltip text for the button.

```html
<template>
    <lightning-button
        variant="brand"
        label="Start"
        title="Begins the task"
        onclick={handleClick}
    >
    </lightning-button>
</template>
```

Here's another example that creates a button with the `brand` variant, with a label
and icon. The icon is positioned to the left
of the label by default, so the example uses `icon-position` to display it on the right.

```html
<template>
    <lightning-button
        variant="brand"
        label="Download"
        icon-name="utility:download"
        icon-position="right"
        onclick={handleClick}
    >
    </lightning-button>
</template>
```

You can retrieve the button that's clicked by using `event.target`. For
example, to retrieve the label on the button, use
`event.target.label`.

#### Component Styling

`lightning-button` implements the
[buttons](https://www.lightningdesignsystem.com/components/buttons/) blueprint in the Salesforce Lightning Design System (SLDS).

##### Icons

Use the `icon-name` attribute to add a utility icon to the button.

The SLDS utility icon category provides nearly 200 utility
icons that can be used in `lightning-button` along with label text. Although
SLDS provides several categories of icons, only the utility category can be used in `lightning-button`.

Visit [https://lightningdesignsystem.com/icons/#utility](https://lightningdesignsystem.com/icons/#utility) to view the utility icons.

##### Variants

Use the `variant` attribute with one of these values to apply styling and animation.

-   `base` is a button without a border, which gives it the look of a plain text link.
-   `neutral` is the default variant, a plain uncolored button.
-   `brand` is a blue button, used to draw attention to the primary action on a page.
-   `brand-outline` is similar to `brand` but the color is used for the label and border only, not the button color.
-   `destructive` is a red button used to warn users that its action has a negative effect.
-   `destructive-text` is similar to `destructive` but only the label and border are red.
-   `inverse` uses the background color and light text, useful for dark backgrounds.
-   `success` is a green button used to indicate a successful action.

##### Animation

Buttons are animated by default. For the `base` variant, an underline is drawn when you mouse over the button. For the other variants, a ripple of contrasting color displays when you click the button.

When a button is disabled, the animation is disabled as well.

If your browser or operating system is set to reduce animation, the button animations don't display.

To prevent animation for a button, use the `disable-animation` attribute.

```html
<template>
    <lightning-button
        variant="brand"
        label="Start"
        title="Begins the task"
        disable-animation
        onclick={handleClick}>
    </lightning-button>
</template>
```

We recommend setting this attribute only when you place `lightning-button` near other
buttons that aren't animated, for consistency.

##### Customize Component Styling

To apply additional styling, use the SLDS [utility classes](https://www.lightningdesignsystem.com/utilities/alignment) with the `class` attribute.

This example adds a margin to the left of the second button using an SLDS class.

```html
<lightning-button label="Cancel" title="Cancel"></lightning-button>
<lightning-button
    variant="brand"
    label="Brand"
    title="Primary action"
    class="slds-m-left_x-small"
></lightning-button>
```

You can also use the `stretch` attribute to expand the button to the full available width. In this example, the button stretches horizontally to fit the full `<div>` container.

```html
<div>
    <lightning-button
        variant="brand"
        label="Get Started"
        title="Get Started"
        stretch
    ></lightning-button>
</div>
```

To apply custom styling, use the `:host` selector or define a custom class using the `class` attribute.

```html
<lightning-button
    variant="brand"
    label="Submit"
    title="Submit"
    class="my-brand"
>
</lightning-button>
```

Use SLDS styling hooks to customize the component's styles. For example, specify the background color on the button with `brand` variant using the `--slds-c-button-brand-color-background` custom property.

```css
.my-brand {
    --slds-c-button-brand-color-background: purple;
}
```

Custom properties for buttons work only with particular `lightning-button` variants.

| CSS Custom Property                 | `lightning-button` Variants                      |
| ----------------------------------- | ------------------------------------------------ |
| `--slds-c-button-*`                  | all                                              |
| `--slds-c-button-color-*`            | `base`                                           |
| `--slds-c-button-text-color-*`       | `neutral` (default), `base`, and `brand-outline` |
| `--slds-c-button-neutral-*`          | `neutral` (default)                              |
| `--slds-c-button-brand-*`            | `brand`                                          |
| `--slds-c-button-outline-brand-*`    | `brand-outline`                                  |
| `--slds-c-button-destructive-*`      | `destructive`                                    |
| `--slds-c-button-text-destructive-*` | `destructive-text`                               |
| `--slds-c-button-inverse-*`          | `inverse`                                        |
| `--slds-c-button-success-*`          | `success`                                        |

See [Styling Hooks Overview](https://www.lightningdesignsystem.com/components/buttons/#Styling-Hooks-Overview) for a list of CSS custom properties.

For more information, see [Style Components Using Lightning Design System Styling Hooks](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-css-custom-properties) in the Lightning Web Components Developer Guide.

To understand how we implemented SLDS in `lightning-button`, see the **Source Code** section.

#### Usage Considerations

To create an icon-only button, use the `lightning-button-icon` component instead. Creating an icon-only button using `lightning-button` results in additional spacing next to the icon. To create a button that triggers a menu, use `lightning-button-menu`.

Icons are not available in Lightning Out, but they are available in Lightning Components for Visualforce and other experiences.

If you're creating forms to interact with Salesforce records, consider using `lightning-record-form` or `lightning-record-edit-form`.

We don't support changing the label alignment on the button. To adjust the padding, inline spacing, or line height of the text label, use [SLDS styling hooks](https://www.lightningdesignsystem.com/components/buttons/#Styling-Hooks-Overview).

To address text wrapping in long labels when the browser viewport is reduced, customize the line height and block spacing of the button label using SLDS styling hooks.

-   `--slds-c-button-line-height`
-   `--slds-c-button-spacing-blockstart`
-   `--slds-c-button-spacing-blockend`

On mobile screens, we recommend setting the button size to
44x44 px. If you have more than one target on a screen that performs the same action, only one of the targets need to meet the target size of 44x44 px. For more information, see [Follow Accessible Mobile Design Guidelines
](https://developer.salesforce.com/docs/platform/lwc/guide/mobile-a11y).

#### Accessibility

Buttons must have an accessible name to enable assistive technology to describe the button's purpose. Provide this name using the `label` attribute and make it a clear call to action, for example, "Edit record".

If you create an icon-only button using `lightning-button`, provide an accessible name using the `aria-label` or `aria-labelledby` attribute. We recommend that you use one of the attributes but not both.

To provide a text label that's not visible on the screen, use `aria-label`.

```html
<lightning-button
    aria-label="Download"
    icon-name="utility:download"
    variant="base"></lightning-button>
```

To associate the button with text from another element, use `aria-labelledby`.

```html
<h2 id="downloadLabel">Download Files</h2>
<h3 id="downloadDesc">View and make changes to your files</h3>
<lightning-button
    aria-labelledby="downloadLabel downloadDesc"
    icon-name="utility:download"
    variant="base"></lightning-button>
```

To use `aria-label` with additional descriptive text, use `aria-describedby`.

```html
<lightning-button
    aria-label="Close"
    aria-describedby="descriptionClose"
    icon-name="utility:close"
    variant="base"></lightning-button>


<div id="descriptionClose">Closing this window resets the form and
returns you back to the main page.</div>
```

`lightning-button` provides many variants that add color to a button, which convey different meaning on a button. Use the variants together with clear text on the button to match the meaning you are trying to convey via color. For example, if you use the destructive button to point out a potential warning, make sure the text communicates the same message.

To inform screen readers that a button is disabled, include the `disabled` attribute.

Use the following accessibility and `aria` attributes on `lightning-button`.

| Attribute        | Type              | Description                                                                                                                                                                                                                                                                                                                                          |
| ---------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| accesskey        | string            | A shortcut key to activate or place focus on the button.                                                                                                                                                                                                                                                                                             |
| aria-atomic      | boolean           | Specifies whether the screen reader should always present the live region as a whole, even if only part of the region changes. The default is `false`.                                                                                                                                                                                               |
| aria-controls    | ID reference list | An element ID or a space-separated list of element IDs whose presence or content is controlled by this button.                                                                                                                                                                                                                                       |
| aria-describedby | ID reference list | An element ID or a space-separated list of element IDs that provide a descriptive label or description for the button.                                                                                                                                                                                                                               |
| aria-expanded    | boolean           | Indicates whether a collapsible element that's controlled by the button is expanded or collapsed. To reference the controlled element, use `aria-controls`.                                                                                                                                                                                          |
| aria-haspopup    | token             | Indicates that the button has an interactive popup element. Valid values are 'true', 'dialog', 'menu', 'listbox', 'tree', and 'grid'.                                                                                                                                                                                                                |
| aria-label       | string            | Provides an assistive label where a visible label cannot be used.                                                                                                                                                                                                                                                                                    |
| aria-labelledby  | ID reference list | Specifies the ID or list of IDs of the element or elements that contain visible descriptive text to describe the button.                                                                                                                                                                                                                             |
| aria-live        | token             | Indicates the button can dynamically update without a page reload, and specifies how the change is announced by assistive technologies. Possible values include `off`, `polite`, and `assertive`. The default is `off`. For the screen reader to announce changes when the user is idle, use `polite`. For immediate notifications, use `assertive`. |
| tabindex         | integer           | Specifies whether the button is focusable during tab navigation. Set tab index to -1 to prevent focus on the button during tab navigation. The default value is 0, which makes the button focusable during tab navigation. For more information see [tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex).                      |

For more information, see the [WAI-ARIA Specification](https://www.w3.org/TR/wai-aria/).
