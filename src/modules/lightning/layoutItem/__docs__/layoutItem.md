---
examples:
    - name: default
      label: Layout Items with Default Attributes
      description: Layout items take the size of their content by default.
    - name: flexibility
      label: Layout Items with Auto Flexibility
      description: Layout items can take the entire width of the container.
    - name: flexibilityValues
      label: Layout Items with no-grow Flexibility
      description: Layout items can remove additional space in the container beyond the content width.
    - name: size
      label: Layout Items with Size Attribute
      description: Layout items can occupy different widths relative to the viewport.
    - name: sizePerDevice
      label: Layout Items With Device-Specific Sizes
      description: Layout items can vary their widths depending on the device.
    - name: sizeOverriddenForTablets
      label: Layout Item Sizes for Tablets and Above
      description: Layout items can specify widths for tablet devices and larger.
    - name: padding
      label: Layout Items with Side Padding
      description: Layout items can enforce padding on their sides.
    - name: alignmentBump
      label: Layout Items with Horizontal Margin
      description: Layout items can enforce a margin to bump the alignment of adjacent layout items.
---

A `lightning-layout-item` defines content to display within `lightning-layout`. You
can arrange one or more `lightning-layout-item` components inside `lightning-layout`.

The `lightning-layout-item` components must be adjacent, with no other components or expressions between them.

Use the attributes
of `lightning-layout-item` to configure the size of the layout item,
and change how the layout is configured on different device sizes.

The layout system is mobile-first. Typically, the `small-device-size` attribute indicates a smart phone,
`medium-device-size` indicates a tablet, and `large-device-size` indicates a desktop or larger device.

If you specify the `small-device-size`, `medium-device-size`, or `large-device-size` attributes, you must also
specify the `size` attribute.

If you specify the `size` and `small-device-size`
attributes, the `size` attribute applies to small mobile
phones, and the `small-device-size` applies to smart phones. The device sizing
attributes are additive and apply to devices of the specified size and larger. For
example, if you set `medium-device-size=10` and don't set `large-device-size`, then
the `medium-device-size` setting applies to tablets, desktops, and larger
devices. You'd also have to set `size` to apply to devices smaller than tablets.

For general information on sizing, see [Lightning Design System](https://www.lightningdesignsystem.com/utilities/sizing/#overview).

Use the `flexibility` attribute to specify how the layout item adapts to the size of its container.
With default attribute values of size and flexibility, layout items take the size of their content and don't
occupy the entire width of the container.

Here is an example using default values.

```html
<template>
    <div>
        <lightning-layout>
            <lightning-layout-item padding="around-small">
                <div>1</div>
            </lightning-layout-item>
            <lightning-layout-item padding="around-small">
                <div>2</div>
            </lightning-layout-item>
            <lightning-layout-item padding="around-small">
                <div>3</div>
            </lightning-layout-item>
            <lightning-layout-item padding="around-small">
                <div>4</div>
            </lightning-layout-item>
        </lightning-layout>
    </div>
</template>
```

#### Usage Considerations

This component has usage differences from its Aura counterpart. See [Base Components: Aura Vs Lightning Web Components](https://developer.salesforce.com/docs/platform/lwc/guide/migrate-map-aura-lwc-components) in the Lightning Web Components Developer Guide.
