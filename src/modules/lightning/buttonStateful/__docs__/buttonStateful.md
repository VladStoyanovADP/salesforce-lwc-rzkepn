---
examples:
    - name: basic
      label: Stateful Button
      description: This stateful button changes its text and icon when you select it. The button changes its text and icon again when you hover over it. This uses the default variant.
    - name: inverseVariant
      label: Stateful Button with Inverse Variant
      description: This stateful button changes its text and icon when you select it. The button changes its text and icon again when you hover over it. This uses the inverse variant.
    - name: noIcon
      label: Stateful Button with No Icon
      description: This stateful button uses the brand variant and does not specify icons for any states.
    - name: textVariant
      label: Stateful Button with Text and Icon
      description: This stateful button uses the text variant and specifies icons for selected and not-selected states, but not the hover state.
---

A `lightning-button-stateful` component represents a button that toggles
between states, similar to a Like button on social media. Stateful buttons can
show a different label and icon based on their `selected` states.

To handle the state change when the button is clicked, use the `onclick` event
handler. This example enables you to toggle the button between states,
displaying the "Follow" label by default, and replacing it with "Following"
when the button is selected. Selecting the button toggles the `selected` state to true,
and deselecting it toggles `selected` state to false. When the `selected` state is true, the
button displays "Unfollow" when you mouse over it or when it receives focus.

```html
<template>
    <lightning-button-stateful
        label-when-off="Follow"
        label-when-on="Following"
        label-when-hover="Unfollow"
        icon-name-when-off="utility:add"
        icon-name-when-on="utility:check"
        icon-name-when-hover="utility:close"
        selected={isSelected}
        onclick={handleClick}
    >
    </lightning-button-stateful>
</template>
```

The `handleClick()` function toggles the state via the `isSelected` attribute.

```javascript
import { LightningElement } from 'lwc';

export default class MyComponentName extends LightningElement {
    isSelected = false;

    handleClick() {
        this.isSelected = !this.isSelected;
    }
}
```

#### Component Styling

`lightning-button-stateful` implements the
[stateful buttons](https://www.lightningdesignsystem.com/components/buttons/#flavor-stateful) blueprint in the Salesforce Lightning Design System (SLDS).

##### Icons

Use the `icon-name` attribute to add a utility icon to the button.

The SLDS utility icon category provides nearly 200 utility
icons that can be used in `lightning-button-stateful` along with a text label. Although SLDS provides several categories of icons, only the utility category can be used with this component.

Visit [utility icons](https://lightningdesignsystem.com/icons/#utility) to view the utility icons.

When applying SLDS classes or icons, check that they are
available in the SLDS release tied to your org. The latest
SLDS resources become available only when the new release
is available in your org.

##### Variants

Use the `variant` attribute with one of these values to apply styling.

-   `neutral` is the default variant, a plain uncolored button.
-   `brand` is a blue button, used to draw attention to the primary action on a page.
-   `destructive` is a red button used to warn users that its action has a negative effect.
-   `inverse` uses the background color and light text, useful for dark backgrounds.
-   `success` is a green button used to indicate a successful action.
-   `text` is a button without a border, which gives it the look of a plain text link.

##### Customize Component Styling

To apply additional styling, use the SLDS [utility classes](https://www.lightningdesignsystem.com/utilities/alignment) with the `class` attribute.

This example adds padding on the button using an SLDS class.

```html
<lightning-button-stateful
    label-when-off="Follow"
    label-when-on="Following"
    label-when-hover="Unfollow"
    icon-name-when-off="utility:add"
    icon-name-when-on="utility:check"
    icon-name-when-hover="utility:close"
    selected={isSelected}
    onclick={handleClick}
    class="slds-p-around_medium"
>
</lightning-button-stateful>
```

To apply custom styling, use the `:host` selector or define a custom class using the `class` attribute.

```html
<lightning-button-stateful
    label-when-off="Follow"
    label-when-on="Following"
    label-when-hover="Unfollow"
    icon-name-when-off="utility:add"
    icon-name-when-on="utility:check"
    icon-name-when-hover="utility:close"
    selected={isSelected}
    onclick={handleClick}
    class="my-button"
>
</lightning-button-stateful>
```

Use SLDS styling hooks to customize the component's styles. For example, specify the background and text color on the button using the `--slds-c-button-*` custom properties.

```css
.my-button {
    --slds-c-button-neutral-color-background: orange;
    --slds-c-button-text-color: white;
}
```

`lightning-button-stateful` contains the same customizable elements as `lightning-button`, which supports `--slds-c-button-*` custom properties.

Custom properties for stateful buttons work only with particular `lightning-button-stateful` variants.

| CSS Custom Property            | `lightning-button-stateful` Variants |
| ------------------------------ | ------------------------------------ |
| `--slds-c-button-*`             | all                                  |
| `--slds-c-button-color-*`       | `base`                               |
| `--slds-c-button-text-color-*`  | `neutral` (default) and `text`       |
| `--slds-c-button-neutral-*`     | `neutral` (default)                  |
| `--slds-c-button-brand-*`       | `brand`                              |
| `--slds-c-button-destructive-*` | `destructive`                        |
| `--slds-c-button-inverse-*`     | `inverse`                            |
| `--slds-c-button-success-*`     | `success`                            |

See [Styling Hooks Overview](https://www.lightningdesignsystem.com/components/buttons/#Styling-Hooks-Overview) for a list of CSS custom properties.

For more information, see [Style Components Using Lightning Design System Styling Hooks](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-css-custom-properties) in the Lightning Web Components Developer Guide.

To understand how we implemented SLDS in `lightning-button-stateful`, see the **Source Code** section.

#### Usage Considerations

This component has usage differences from its Aura counterpart. See [Base Components: Aura Vs Lightning Web Components](https://developer.salesforce.com/docs/platform/lwc/guide/migrate-map-aura-lwc-components) in the Lightning Web Components Developer Guide.

#### Accessibility

This component uses `aria-live="polite"`, which means the button label is read after the current user task or content.

To inform screen readers that a button is disabled, set the `disabled` attribute to true.
