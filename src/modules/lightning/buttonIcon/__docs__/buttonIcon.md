---
examples:
    - name: basic
      label: Button Icon Variants
      description: Button icons with multiple variants.
    - name: sizes
      label: Button Icon Sizes
      description: Button icons with multiple sizes.
    - name: inverse
      label: Button Icons with Inverse Variants
      description: Button icons with two types of inverse variants to display on a dark background.
---

A `lightning-button-icon` component represents an icon-only button element that
executes an action in a controller. Clicking the button triggers the JavaScript
method set for `onclick`.

Here is an example.

```html
<template>
    <lightning-button-icon
        icon-name="utility:close"
        variant="bare"
        onclick={handleClick}
        alternative-text="Close window"
    >
    </lightning-button-icon>
</template>
```

#### Component Styling

`lightning-button-icon` implements the
[button icons](https://www.lightningdesignsystem.com/components/button-icons/) blueprint in the Salesforce Lightning Design System (SLDS).

You can use a combination of the `icon-class`, `size`, and `variant`
attributes to customize the button and icon styles.

To customize styling on the icon element, use the
`icon-class` attribute. This example creates an icon-only button with bare
variant and icon styling. Only SLDS utility classes are currently supported with `icon-class`.

```html
<lightning-button-icon
    icon-name="utility:settings"
    variant="bare"
    alternative-text="Settings"
    icon-class="slds-m-around_medium"
>
</lightning-button-icon>
```

##### Icons

Use the `icon-name` attribute to add a utility icon to the button.

The SLDS utility icon category offers nearly 200 utility
icons that can be used in `lightning-button-icon`. Although SLDS provides several categories of icons, only the utility category can be used in `lightning-button-icon`.

Visit [utility icons](https://lightningdesignsystem.com/icons/#utility) to view the utility icons.

When applying SLDS classes or icons, check that they are
available in the SLDS release tied to your org. The latest
SLDS resources become available only when the new release
is available in your org.

##### Variants

Use the `variant` attribute with one of these values to apply styling.

-   `bare` displays an icon without a container or border
-   `bare-inverse` displays an icon in white color without a container or border, useful for dark backgrounds
-   `border` is the default variant, an icon in a transparent container with a border
-   `border-filled` displays an icon in a filled container with a border
-   `border-inverse` displays an icon in a transparent container with a border, useful for dark backgrounds
-   `brand` displays an icon in white color in a blue container with a blue border
-   `container` displays an icon in a transparent container without a border

For the `bare` and `bare-inverse` variants, the `size` class applies to the icon itself. For all other variants, the `size` class applies to the button.

Add the `disabled` attribute to prevent interaction with the button icon.

##### Sizes

Adjust the button and icon sizes using the `size` attribute with one of these values.

For `bare` and `bare-inverse` variants:

-   `medium` is the default size, which creates a 14px by 14px icon
-   `small` creates a 12px by 12px icon
-   `x-small` creates a 8px by 8px icon
-   `large` creates a 24px by 24px icon

For other variants:

-   `medium` is the default size, which creates a 32px by 32px button enclosing a 14px by 14px icon.
-   `small` creates a 24px by 24px button enclosing a 14px by 14px icon
-   `x-small` creates a 20px by 20px button enclosing a 12px by 12px icon
-   `xx-small` creates a 16px by 16px button enclosing a 8px by 8px icon

##### Customize Component Styling

To apply additional styling, use the SLDS [utility classes](https://www.lightningdesignsystem.com/utilities/alignment) with the `class` attribute.

This example adds a margin to the left of the second button using the `slds-m-left_xx-small` class.

```html
<lightning-button-icon
    icon-name="utility:zoomin"
    alternative-text="Zoom in"
    title="Zoom in"
></lightning-button-icon>
<lightning-button-icon
    icon-name="utility:zoomout"
    alternative-text="Zoom out"
    title="Zoom out"
    class="slds-m-left_xx-small"
></lightning-button-icon>
```

To apply custom styling, use the `:host` selector or define a custom class using the `class` attribute.

```html
<lightning-button-icon
    icon-name="utility:zoomin"
    alternative-text="Zoom in"
    title="Zoom in"
    class="my-round-button"
></lightning-button-icon>
```

Use SLDS styling hooks to customize the component's styles. For example, specify the border radius using the `--slds-c-button-radius-border` custom property.

```css
.my-round-button {
    --slds-c-button-radius-border: 20px;
}
```

`lightning-button-icon` contains the same customizable elements as `lightning-button`, which supports `--slds-c-button-*` custom properties.

Custom properties for button icons work only with particular `lightning-button` variants.

| CSS Custom Property               | `lightning-button-icon` Variants                             |
| --------------------------------- | ------------------------------------------------------------ |
| `--slds-c-button-color-background` | `border` (default), `bare`, `bare-inverse`, and `container`  |
| `--slds-c-button-color-border`     | `bare`, `bare-inverse`, and `container`                      |
| `--slds-c-button-text-color`       | N/A                                                          |
| `--slds-c-button-text-color-*`     | `border` (default), `bare`, `container`, and `border-filled` |
| `--slds-c-button-radius-border`    | all                                                          |
| `--slds-c-button-sizing-border`    | `bare`, `bare-inverse`, `border-inverse` and `container`     |

See [Styling Hooks Overview](https://www.lightningdesignsystem.com/components/buttons/#Styling-Hooks-Overview) for a list of CSS custom properties.

For more information, see [Style Components Using Lightning Design System Styling Hooks](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-css-custom-properties) in the Lightning Web Components Developer Guide.

To understand how we implemented SLDS in `lightning-button-icon`, see the **Source Code** section.

#### Usage Considerations

Icons are not available in Lightning Out, but they are available in Lightning Components for Visualforce and other experiences.

#### Accessibility

`lightning-button-icon` contains an informational icon, which conveys information that surrounding text doesn't.
For each icon, provide assistive text that describes the button's action.

Use the `alternative-text` attribute to describe the icon. The description should indicate what happens when you click the button, for example 'Upload File', not what the icon looks like, 'Paperclip'.

The description you provide to `alternative-text` is available to users in two ways.

-   As hover text when you hover over the button
-   As hidden text for assistive technologies

To override the hover text provided by `alternative-text`, use the `title` attribute, which corresponds to the native browser tooltip.
The description you provide to `title` displays when you hover over the button. To support touch-only devices, keyboard navigation, and assistive technologies, use `title` together with `label` or `alternative-text`.

To display a contextual popup on the button, use the `tooltip` attribute.
The popup becomes visible when you hover over the button, or after the button receives keyboard focus. Showing the popup on hover or on keyboard focus ensures that all users can access it, even if they aren’t using a mouse. The button is rendered with `aria-describedby`, linking it to the ID of the popup, which helps assistive technology read the popup content.

If you use both `title` and `tooltip` attributes, they are both visible when you hover over the button. Some screen readers don’t support the `title` attribute and many of them don’t read the `title` attribute by default.

```html
<lightning-button-icon
    icon-name="utility:settings"
    title="Settings"
    tooltip="Display your account settings"
    alternative-text="Hidden text for assistive technology"
>
</lightning-button-icon>
```

For sighted users, make sure your description on `title` and `tooltip` are not repetitive. We recommend providing detailed information to `tooltip` and make `title` more concise if you use both.

Buttons that display an icon instead of text do not have an accessible name. To provide an accessible name in `lightning-button-icon`, use the `aria-label` attribute. If there is visible text labeling the element, use `aria-labelled-by` instead.

To inform screen readers that a button is disabled, set the `disabled` attribute to true.

Use the following accessibility and `aria` attributes on `lightning-button-icon`.

| Attribute        | Type              | Description                                                                                                                                                                                                                                                                                                                                          |
| ---------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| accesskey        | string            | A shortcut key to activate or place focus on the button.                                                                                                                                                                                                                                                                                             |
| aria-atomic      | boolean           | Specifies whether the screen reader should always present the live region as a whole, even if only part of the region changes. The default is `false`.                                                                                                                                                                                               |
| aria-controls    | ID reference list | An element ID or a space-separated list of element IDs whose presence or content is controlled by this button.                                                                                                                                                                                                                                       |
| aria-describedby | ID reference list | An element ID or a space-separated list of element IDs that provide descriptive labels for the button.                                                                                                                                                                                                                                               |
| aria-expanded    | boolean           | Indicates whether a collapsible element that's controlled by the button is expanded or collapsed. To reference the controlled element, use `aria-controls`.                                                                                                                                                                                          |
| aria-haspopup    | token             | Indicates that the button has an interactive popup element. Valid values are 'true', 'dialog', 'menu', 'listbox', 'tree', and 'grid'. To create a button that displays a list of menu items when clicked, use `lightning-button-menu` instead.                                                                                                       |
| aria-label       | string            | Provides an assistive label where a visible label cannot be used.                                                                                                                                                                                                                                                                                    |
| aria-live        | token             | Indicates the button can dynamically update without a page reload, and specifies how the change is announced by assistive technologies. Possible values include `off`, `polite`, and `assertive`. The default is `off`. For the screen reader to announce changes when the user is idle, use `polite`. For immediate notifications, use `assertive`. |
| tabindex         | integer           | Specifies whether the button is focusable during tab navigation. Set tab index to -1 to prevent focus on the button during tab navigation. The default value is 0, which makes the button focusable during tab navigation. For more information, see [tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex).       |

For more information, see the [WAI-ARIA Specification](https://www.w3.org/TR/wai-aria/).
