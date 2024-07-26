---
examples:
    - name: divider
      label: Button Menus With Dividers
      description: Button menus can include lines between menu items.
    - name: withSubhead
      label: Button Menus With Dividers and Subheaders
      description: Button menus with subheaders, dividers, and compact variant.
---

The `lightning-menu-divider` component creates a dividing line after a menu item in a
[`lightning-button-menu`](bundle/lightning-button-menu/documentation) component.
Use a menu divider to introduce a break between item categories or separate items into groups,
for example.

To draw a line after a menu item, nest the component inside `lightning-button-menu` after the `lightning-menu-item` where you want the line. Use `lightning-menu-divider` as a sibling of `lightning-menu-item`, not as a child component.

This example shows a dropdown menu with two dividers.

```html
<template>
    <lightning-button-menu label="Veggies">
        <lightning-menu-item label="Spinach"> </lightning-menu-item>
        <lightning-menu-item label="Kale"> </lightning-menu-item>
        <lightning-menu-divider> </lightning-menu-divider>
        <lightning-menu-item label="Zucchini"> </lightning-menu-item>
        <lightning-menu-item label="Yellow Squash"> </lightning-menu-item>
        <lightning-menu-divider> </lightning-menu-divider>
        <lightning-menu-item label="Carrot"> </lightning-menu-item>
        <lightning-menu-item label="Parsnip"> </lightning-menu-item>
    </lightning-button-menu>
</template>
```

By default, space is added above and below the divider. Use `variant="compact"` with `lightning-menu-divider` to reduce the space.

```html
<template>
    <lightning-button-menu label="Veggies">
        <lightning-menu-item label="Spinach"> </lightning-menu-item>
        <lightning-menu-item label="Kale"> </lightning-menu-item>
        <lightning-menu-divider variant="compact"> </lightning-menu-divider>
        <lightning-menu-item label="Zucchini"> </lightning-menu-item>
        <lightning-menu-item label="Yellow Squash"> </lightning-menu-item>
        <lightning-menu-divider variant="compact"> </lightning-menu-divider>
        <lightning-menu-item label="Carrot"> </lightning-menu-item>
        <lightning-menu-item label="Parsnip"> </lightning-menu-item>
    </lightning-button-menu>
</template>
```

For further customization of button menus, use [`lightning-menu-subheader`](bundle/lightning-menu-subheader/documentation) to create subheaders in the list of items. You can place dividers under subheaders or menu items.

```html
<template>
    <lightning-button-menu label="Veggies">
        <lightning-menu-subheader label="Leafy Greens">
        </lightning-menu-subheader>
        <lightning-menu-item label="Spinach"> </lightning-menu-item>
        <lightning-menu-item label="Kale"> </lightning-menu-item>
        <lightning-menu-divider variant="compact"> </lightning-menu-divider>
        <lightning-menu-subheader label="Summer Squash">
        </lightning-menu-subheader>
        <lightning-menu-item label="Zucchini"> </lightning-menu-item>
        <lightning-menu-item label="Yellow Squash"> </lightning-menu-item>
        <lightning-menu-divider variant="compact"> </lightning-menu-divider>
        <lightning-menu-subheader label="Root Vegetables">
        </lightning-menu-subheader>
        <lightning-menu-item label="Carrot"> </lightning-menu-item>
        <lightning-menu-item label="Parsnip"> </lightning-menu-item>
    </lightning-button-menu>
</template>
```
