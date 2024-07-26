---
examples:
    - name: simple
      label: Simple Layout
      description: A layout can include layout items as columns.
    - name: nested
      label: Nested Page Layout
      description: A layout item can contain nested layouts.
    - name: horizontalAlignSpace
      label: Layout with a Horizontal Align (Space)
      description: Position layout items horizontally across the container, with space before, between, and after the items.
    - name: horizontalAlignSpread
      label: Layout with a Horizontal Align (Spread)
      description: Position layout items horizontally across the container, with space between the items.
    - name: verticalAlignCenter
      label: Layout with a Vertical Align (Center)
      description: Position layout items vertically in the center of the container.
    - name: verticalAlignStretch
      label: Layout with a Vertical Align (Stretch)
      description: Stretch out layout items vertically to fill the container.
    - name: pullToBoundary
      label: Layout with PullToBoundary Attribute
      description: Pull layout items to the edges of the container.
---

A `lightning-layout` is a flexible grid system for arranging containers within
a page or inside another container. The default layout is mobile-first and can
be easily configured to work on different devices.

Create the content of the layout by including `lightning-layout-item` components
within `lightning-layout`. You can place HTML tags and text between the `lightning-layout-item`
components, but you can't place other components or expressions between them.

This component inherits styling from the
[grid utility classes](https://lightningdesignsystem.com/utilities/grid/) in the
Lightning Design System.

The layout can be customized by setting the following attributes.

#### `horizontal-align`

Spread layout items out horizontally based on the following values.

-   `center`: Appends the `slds-grid_align-center` class to the grid. This attribute orders the layout items into a horizontal line without any spacing, and places the group into the center of the container.
-   `space`: Appends the `slds-grid_align-space` class to the grid. The layout items are spaced horizontally across the container, starting and ending with a space.
-   `spread`: Appends the `slds-grid_align-spread` class to the grid. The layout items are spaced horizontally across the container, starting and ending with a layout item.
-   `end`: Appends the `slds-grid_align-end` class to the grid. The layout items are grouped together and aligned horizontally on the right side of the container.

#### `vertical-align`

Spread layout items out vertically based on the following values.

-   `start`: Appends the `slds-grid_vertical-align-start` class to the grid. The layout items are aligned at the top of the container.
-   `center`: Appends the `slds-grid_vertical-align-center` class to the grid. The layout items are aligned in the center of the container.
-   `end`: Appends the `slds-grid_vertical-align-end` class to the grid. The layout items are aligned at the bottom of the container.
-   `stretch`: Appends the `slds-grid_vertical-stretch` class to the grid. The layout items extend vertically to fill the container.

#### `pull-to-boundary`

Pull layout items to the layout boundaries based on the following values. If
padding is used on layout items, this attribute pulls the elements on either
side of the container to the boundary. Choose the size that corresponds to the
padding on your layout items. For instance, if
`lightning-layout-item padding="horizontalSmall"`, choose `pull-to-boundary="small"`.

-   `small`: Appends the `slds-grid_pull-padded` class to the grid.
-   `medium`: Appends the `slds-grid_pull-padded-medium` class to the grid.
-   `large`: Appends the `slds-grid_pull-padded-large` class to the grid.

Use the `class` or `multiple-rows` attributes to customize the styling in other
ways.

#### Creating Columns

`lightning-layout` enables you to create several types of columns.

-   Flexible widths that adjust based on their content
-   Fixed widths that take up a percentage of the container

Create a simple layout by enclosing single or multiple `lightning-layout-item` components within `lightning-layout`. `lightning-layout-item` creates a column within `lightning-layout`.

To create columns with widths that are based on their content, use `flexibility="auto"`. The `horizontal-align` attribute determines how to spread the layout items horizontally. Here is an example that creates columns with flexible widths.

```html
<template>
    <div class="c-container">
        <lightning-layout horizontal-align={horizontalAlign}>
            <lightning-layout-item flexibility="auto" padding="around-small">
                1
            </lightning-layout-item>
            <lightning-layout-item flexibility="auto" padding="around-small">
                2
            </lightning-layout-item>
            <lightning-layout-item flexibility="auto" padding="around-small">
                3
            </lightning-layout-item>
            <lightning-layout-item flexibility="auto" padding="around-small">
                4
            </lightning-layout-item>
        </lightning-layout>
    </div>
</template>
```

Set the horizontal alignment to `space`, which evenly distributes columns horizontally with an equal amount of space separating the columns.

```javascript
import { LightningElement, api } from 'lwc';

export default class MyLayout extends LightningElement {
    @api horizontalAlign = 'space';
}
```

To create columns with fixed widths, use the `size` attribute on `lightning-layout-item`. For example, to create two columns where the width of the first column is 33% of the grid container and the second column is 66% of the grid container, use `size="4"` and `size="8"`.

```html
<lightning-layout>
    <lightning-layout-item size="4"> Column 1 content </lightning-layout-item>
    <lightning-layout-item size="8"> Column 2 content </lightning-layout-item>
</lightning-layout>
```

For more information, see the [SLDS grid utility classes](https://lightningdesignsystem.com/utilities/grid/), and [SLDS sizing utility classes](https://www.lightningdesignsystem.com/utilities/sizing/).

#### Usage Considerations

This example creates the same layout shown in **Creating Columns**,
which creates two columns with fixed widths.

```html
<div class="slds-grid">
    <div class="slds-col slds-size_1-of-3">Column 1 content</div>
    <div class="slds-col slds-size_2-of-3">Columns 2 content</div>
</div>
```
