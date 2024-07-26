---
examples:
    - name: basic
      label: Stateful Button Icons
      description: Stateful button icons can be toggled between states. They support multiple sizes and can be disabled.
    - name: variants
      label: Stateful Button Icons with Border Variants
      description: Button icons using the two types of border variants.
---

A `lightning-button-icon-stateful` component represents an icon-only button
element that toggles between two states. For example, you can use this
component for capturing a customer's feedback on a blog post (like or
dislike). Clicking the button triggers the handler set for `onclick` and changes the state of the icon using the `selected` attribute.

This example creates a Like button that toggles between two states. The Like button is selected by default. The button's state is stored in the `selected` attribute.

Selecting the Dislike button also toggles the state on the Like button and deselects it.

```html
<template>
    <lightning-button-icon-stateful
        icon-name="utility:like"
        selected={liked}
        alternative-text="Like"
        onclick={handleToggle}
    >
    </lightning-button-icon-stateful>
</template>
```

Handle the `click` event in your JavaScript code.

```javascript
import { LightningElement } from 'lwc';

export default class MyComponentName extends LightningElement {
    liked = true;

    handleToggle() {
        this.liked = !this.liked;
    }
}
```

#### Component Styling

`lightning-button-icon-stateful` implements the
[button icons](https://www.lightningdesignsystem.com/components/button-icons/) blueprint in the Salesforce Lightning Design System (SLDS).

You can use a combination of the `variant` and `size` attributes to
customize the button and icon styles.

##### Icons

Use the `icon-name` attribute to add a utility icon to the button.

The SLDS utility icon category offers nearly 200 utility
icons that can be used in `lightning-button-icon-stateful`. Although the
SLDS provides several categories of icons, only the utility
category can be used with this component.

Visit [utility icons](https://lightningdesignsystem.com/icons/#utility) in
the SLDS to view the utility icons.

When applying SLDS classes or icons, check that they are
available in the SLDS release tied to your org. The latest
SLDS resources become available only when the new release is available in your org.

##### Variants

Use the `variant` attribute with one of these values to apply styling.

-   `border` is the default variant, an icon in a transparent container with a border
-   `border-filled` displays an icon in a filled container with a border
-   `border-inverse` displays an icon in a transparent container with a border, useful for dark backgrounds

##### Sizes

Adjust the button and icon sizes using the `size` attribute with one of these values.

-   `medium` is the default size, which creates a 32px by 32px button enclosing a 14px by 14px icon.
-   `small` creates a 24px by 24px button enclosing a 14px by 14px icon
-   `x-small` creates a 20px by 20px button enclosing a 12px by 12px icon
-   `xx-small` creates a 16px by 16px button enclosing a 8px by 8px icon

##### Customize Component Styling

To apply additional styling, use the SLDS [utility classes](https://www.lightningdesignsystem.com/utilities/alignment) with the `class` attribute.

This example adds a margin to the left of the second button using an SLDS class.

```html
<lightning-button-icon-stateful
    icon-name="utility:like"
    selected={likeState}
    onclick={handleLikeButtonClick}
    alternative-text="Like"
></lightning-button-icon-stateful>
<lightning-button-icon-stateful
    icon-name="utility:answer"
    selected={answerState}
    onclick={handleAnswerButtonClick}
    alternative-text="Answer"
    class="slds-m-left_xx-small"
></lightning-button-icon-stateful>
```

To apply custom styling, use the `:host` selector or define a custom class using the `class` attribute.

```html
<lightning-button-icon-stateful
    icon-name="utility:like"
    selected={likeState}
    onclick={handleLikeButtonClick}
    alternative-text="Like"
    variant="border-inverse"
    class="my-brand"
></lightning-button-icon-stateful>
```

Use SLDS styling hooks to customize the component's styles. For example, specify the background color on the button using the `--slds-c-button-color-background` custom property.

```css
.my-brand {
    --slds-c-button-color-background: purple;
}
```

`lightning-button-icon-stateful` contains the same customizable elements as `lightning-button`, which supports `--slds-c-button-*` custom properties.

Custom properties for stateful button icons work only with particular `lightning-button-icon-stateful` variants.

| CSS Custom Property               | `lightning-button-icon-stateful` Variants |
| --------------------------------- | ----------------------------------------- |
| `--slds-c-button-color-background` | `border` (default) and `border-inverse`   |
| `--slds-c-button-color-border`     | N/A                                       |
| `--slds-c-button-text-color`       | N/A                                       |
| `--slds-c-button-text-color-*`     | `border` (default) and `border-filled`    |
| `--slds-c-button-radius-border`    | all                                       |
| `--slds-c-button-sizing-border`    | N/A                                       |

See [Styling Hooks Overview](https://www.lightningdesignsystem.com/components/buttons/#Styling-Hooks-Overview) for a list of CSS custom properties.

For more information, see [Style Components Using Lightning Design System Styling Hooks](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-css-custom-properties) in the Lightning Web Components Developer Guide.

To understand how we implemented SLDS in `lightning-button-icon-stateful`, see the **Source Code** section.

#### Usage Considerations

Icons are not available in Lightning Out, but they are available in Lightning Components for Visualforce and other experiences.

#### Accessibility

`lightning-button-icon-stateful` contains an informational icon, which conveys information that surrounding text doesn't. Each icon should be accompanied by either assistive text.
When selected, the button renders with `aria-pressed="true"`. When not selected, the button renders with `aria-pressed="false"`.
The `aria-pressed` attribute enables screen readers to announce whether a button is pressed or not.

Use the `alternative-text` attribute to describe the icon.
The description should indicate what happens when you click the button, for example 'Upload File', not what the icon looks like, 'Paperclip'.

The text is available to users in two ways.

-   On the tooltip when you hover over the button
-   As text for assistive technologies

Buttons that only show an icon to represent do not have an accessible name. For `lightning-button-icon-stateful`, provide the accessible name using the `aria-label` attribute.

Use the following accessibility and `aria` attributes on `lightning-button-icon-stateful`.

| Attribute        | Type              | Description                                                                                                                                                                                                                                                                                                                     |
| ---------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| accesskey        | string            | A shortcut key to activate or place focus on the button                                                                                                                                                                                                                                                                         |
| aria-atomic      | boolean           | Specifies whether the screen reader should always present the live region as a whole, even if only part of the region changes. The default is `false`.                                                                                                                                                                          |
| aria-controls    | ID reference list | An element ID or a space-separated list of element IDs whose presence or content is controlled by this button.                                                                                                                                                                                                                  |
| aria-describedby | ID reference list | An element ID or a space-separated list of element IDs that provide a descriptive label or description for the button.                                                                                                                                                                                                          |
| aria-expanded    | boolean           | Indicates whether the state of an element, controlled by the button, is expanded or collapsed. To reference the controlled element, use `aria-controls`.                                                                                                                                                                        |
| aria-label       | string            | Provides an assistive label where a visible label cannot be used.                                                                                                                                                                                                                                                               |
| aria-live        | string            | Indicates whether the button will be updated, and describes the types of updates assistive technologies will make. Possible values include `off`, `polite`, and `assertive`. The default is `off`. For the screen reader to announce changes when the user is idle, use `polite`. For immediate notifications, use `assertive`. |

For more information, see the [WAI-ARIA Specification](https://www.w3.org/TR/wai-aria/).
