---
examples:
    - name: basic
      label: Basic Slider
      description: A slider enables you to specify a value between two numbers.
    - name: sizes
      label: Slider Sizes
      description: A slider supports multiple sizes.
    - name: type
      label: Slider Positioning
      description: A slider can be positioned horizontally or vertically.
    - name: variant
      label: Slider Variants
      description: A slider can be displayed without labels. If disabled, a slider is grayed out and you can't interact with it.
---

A `lightning-slider` component is a horizontal or vertical slider for
specifying a value between two specified numbers. For example, this slider can
be used to capture user input about order quantity or when you want to use an
input field of `type="range"`. To orient the slider vertically, set
`type="vertical"`. Older browsers that don't support the slider fall back and
treat it as `type="text"`.

This component inherits styling from
[slider](https://lightningdesignsystem.com/components/slider) in the Lightning
Design System.

Here's an example of a slider with a step increment of 10.

```html
<template>
    <lightning-slider
        label="Volume"
        step="10"
        value={myValue}
        onchange={handleChange}
    >
    </lightning-slider>
    <div class="slds-m-vertical_medium">
        <p>
            The value of the slider is:
            <span class="slds-text-heading_small">{myValue}</span>
        </p>
    </div>
</template>
```

Handle the `change` event and get the slider value using the `event.detail` property.

```javascript
import { LightningElement } from 'lwc';

export default class SliderExample extends LightningElement {
    myValue = 20; //initial value

    handleChange(event) {
        this.myValue = event.detail.value;
    }
}
```

#### Input Validation

Client-side input validation is available for this component. Note that a disabled slider is always valid.

To programmatically display error messages on invalid fields, use the `reportValidity()` method.
For custom validity error messages, display the message using `setCustomValidity()` and `reportValidity()`.

For more information, see the [lightning-input](bundle/lightning-input/documentation) documentation.

#### Component Styling

`lightning-slider` implements the [slider](https://www.lightningdesignsystem.com/components/slider) blueprint in the Salesforce Lightning Design System (SLDS).

To apply additional styling, use the SLDS [utility classes](https://www.lightningdesignsystem.com/utilities/alignment) with the `class` attribute.

This example adds a box theme around the slider using an SLDS class.

```html
<div class="slds-p-top_large">
    <lightning-slider label="Volume" step="10" value="20"> </lightning-slider>
</div>
```

To apply custom styling, use the `:host` selector. Use SLDS styling hooks to customize the component's styles. For example, change the slider track and control color.

```css
:host {
    --slds-c-slider-track-color-background: orange;
    --slds-c-slider-thumb-color-foreground: black;
}
```

See [Styling Hooks Overview](https://www.lightningdesignsystem.com/components/slider/#Styling-Hooks-Overview) for a list of CSS custom properties.

#### Usage Considerations

Use the `change` event to detect changes to the slider value instead of the `blur`
event. Browsers such as Safari don't give focus to the slider so the `blur` event doesn't fire.

By default, the `min` and `max` values are 0 and 100, but you can specify your
own values. If you specify your own step increment value, you can drag the
slider based on the step increment only. If you set the value lower than the
`min` value, then the value is set to the `min` value. Similarly, setting the
value higher than the `max` value results in the value being set to the `max`
value.

For precise numerical values, we recommend using the `lightning-input`
component of `type="number"` instead.
