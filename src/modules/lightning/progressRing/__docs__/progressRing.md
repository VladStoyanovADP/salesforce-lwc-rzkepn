---
examples:
    - name: base
      label: Basic Progress Ring
      description: Progress rings using the default green fill with various numeric values.

    - name: drain
      label: Progress Ring Direction
      description: A progress ring's color fill completes in a clockwise direction by default. Set direction="drain" to make the ring's color fill complete counterclockwise.

    - name: large
      label: Progress Ring Sizes
      description: Progress rings can be medium size (default) or large.

    - name: variantActiveStep
      label: Active Step Variant
      description: The active-step variant changes the color fill to blue.

    - name: variantWarning
      label: Warning Variant
      description: The warning variant changes the color fill to yellow and adds the warning icon.

    - name: variantExpired
      label: Expired Variant
      description: The expired variant changes the color fill to red and adds the error icon.

    - name: variantBaseAutocomplete
      label: Base Autocomplete Variant
      description: The base-autocomplete variant uses the default green fill color and adds a success icon to denote completion when the value is 100.

    - name: interactive
      label: Progress Ring (Interactive Example)
      description: Progress rings can be animated to convey progress or countdown.
---

A `lightning-progress-ring` component is a circular progress indicator. It shows a value from 0 to 100 by filling the ring with a green color by default, and supports variants to change its styling. The color fill is displayed in a clockwise or counterclockwise direction. It informs users the status of a process or action, such as loading data or saving updates.

This component inherits styling from
[progress ring](https://www.lightningdesignsystem.com/components/progress-ring/) in the Lightning Design System.

This example creates a progress ring in a clockwise direction with a value of 75, which fills three quarters of the ring, or 75%.

```html
<lightning-progress-ring value="75"> </lightning-progress-ring>
```

#### Using Variants

Use variants to change the ring's styling to provide contextual feedback to users, such as whether an action is successful, active, at risk of failing, or unsuccessful.

By default, the progress ring fills in with green as the value increases, to indicate success.

```html
<lightning-progress-ring value="80"> </lightning-progress-ring>
```

To display an active step in blue, use the `active-step` variant. This variant indicates that the progress status is ongoing and not yet determined to be successful, at risk of failing, or unsuccessful.

```html
<lightning-progress-ring value="75" variant="active-step">
</lightning-progress-ring>
```

To indicate a problem with an action or process, use the `warning` variant.
This variant displays the warning icon inside the ring and uses a yellow fill color.

```html
<lightning-progress-ring value="80" variant="warning">
</lightning-progress-ring>
```

To indicate an unsuccessful action or process, use the `expired` variant.
This variant displays the error icon inside the ring and uses a red fill color.

```html
<lightning-progress-ring value="0" variant="expired"> </lightning-progress-ring>
```

To indicate a successful action or process, use the `base-autocomplete` variant. This variant is styled the same as the default `base` variant when the value is 0 to 99. When the value is 100, the success icon displays as a checkmark on a green background matching the fill color of the ring.

```html
<lightning-progress-ring value="100" variant="base-autocomplete">
</lightning-progress-ring>
```

#### Accessibility

The `warning`, `expired`, and `base-autocomplete` variants provide icons and descriptive text for accessibility. The `active-step` variant currently does not have either, so it is not accessible. The `active-step` and `base` default variant appear the same except for color. Consider this accessibility limitation when using the `active-step` variant.
