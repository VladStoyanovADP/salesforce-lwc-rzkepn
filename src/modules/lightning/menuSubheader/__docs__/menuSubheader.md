---
examples:
    - name: subheader
      label: Button Menus With Subheaders
      description: Button menu items can include headers among menu items.
    - name: withDividers
      label: Button Menus With Dividers and Subheaders
      description: Button menus with subheaders, dividers, and compact variant.
---

The `lightning-menu-subheader` component creates a heading in the list of menu items in a
[`lightning-button-menu`](bundle/lightning-button-menu/documentation) component.
The heading appears in bold text and is slightly larger than menu item text.
Subheaders can help categorize items and improve usability for long lists.

Specify the text of the heading using the `label` attribute.

Nest the component inside `lightning-button-menu` before the `lightning-menu-item` where you want the header. Use `lightning-menu-subheader` as a sibling of `lightning-menu-item`, not as a child component.

This example shows a dropdown menu with subheaders.

```html
<template>
    <lightning-button-menu label="Veggies">
        <lightning-menu-subheader label="Leafy Greens">
        </lightning-menu-subheader>
        <lightning-menu-item label="Spinach"> </lightning-menu-item>
        <lightning-menu-item label="Kale"> </lightning-menu-item>
        <lightning-menu-subheader label="Summer Squash">
        </lightning-menu-subheader>
        <lightning-menu-item label="Zucchini"> </lightning-menu-item>
        <lightning-menu-item label="Yellow Squash"> </lightning-menu-item>
        <lightning-menu-subheader label="Root Vegetables">
        </lightning-menu-subheader>
        <lightning-menu-item label="Carrot"> </lightning-menu-item>
        <lightning-menu-item label="Parsnip"> </lightning-menu-item>
    </lightning-button-menu>
</template>
```

For further customization of button menus, use [`lightning-menu-divider`](bundle/lightning-menu-divider/documentation) to create divider lines in the list of items. You can place dividers under subheaders or menu items.
