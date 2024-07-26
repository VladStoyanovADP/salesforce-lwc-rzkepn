---
examples:
    - name: menuItems
      label: Button Menu with Styled Items
      description: Button menu items can display icons to the left or right of the item label, or both.
    - name: iteration
      label: Button Menus Using for:each Iteration for Menu Items
      description: Button menu items can be created from a data source using iteration.
---

A `lightning-menu-item` is a menu item within the `lightning-button-menu`
dropdown component. It can hold state such as checked or unchecked, and can
contain icons.

Use the `class` attribute to customize the styling.

This component inherits styling from
[menus](https://www.lightningdesignsystem.com/components/menus/) in the
Lightning Design System.

When applying Lightning Design System classes or icons, check that they are
available in the Lightning Design System release tied to your org. The
Lightning Design System site shows the latest Lightning Design System
resources, and these become available only when the new release is available
in your org.

Here is an example.

```html
<template>
    <lightning-button-menu alternative-text="Toggle menu">
        <lightning-menu-item
            label="Menu Item 1"
            value="menuitem1"
            icon-name="utility:table"
        >
        </lightning-menu-item>
    </lightning-button-menu>
</template>
```

#### Multi-select Menus

To implement a multi-select menu, use the `checked` attribute. The following
JavaScript example handles selection via the `onselect` event on
the `lightning-button-menu` component. Selecting a menu item applies the
selected state to that item.

```javascript
handleSelect (event) {
        const selectedItemValue = event.detail.value;
        const menuItem = this.privateMenuItems.find(function(item) {
            return item.value === selectedItemValue;
        });

        menuItem.checked = !menuItem.checked;
    }
```

#### Adding Icons to Menu Items

Use the `icon-name` attribute to add an icon after the text of the menu item.
Use the `prefix-icon-name` attribute to add an icon before the text of the menu
item. For each attribute, specify a utility icon from
[utility icons](https://www.lightningdesignsystem.com/icons/#utility) in Lightning
Design System.

This example specifies an icon to display before the menu item text.

```html
<template>
    <lightning-button-menu>
        <lightning-menu-item prefix-icon-name="utility:user" label="Menu item">
        </lightning-menu-item>
        <lightning-menu-item label="Another menu item"> </lightning-menu-item>
    </lightning-button-menu>
</template>
```

#### Using URLs in Menu Items

The `href` attribute allows you to use the button menu for navigation. This
example specifies a URL in the menu item's `href` attribute to create a link.
The link is applied to the content of the menu item, including text and icons.

```html
<template>
    <lightning-button-menu>
        <lightning-menu-item
            href="https://www.google.com"
            label="A linked menu item"
        >
        </lightning-menu-item>
    </lightning-button-menu>
</template>
```

If you don't provide a target, the link opens in the same frame or browser tab where it was clicked, which is the browser's default behavior.
To open the link in a new browser tab, set `target="_blank"`.

```html
<template>
    <lightning-button-menu>
        <lightning-menu-item
            href="https://www.google.com"
            target="_blank"
            label="A linked menu item"
        >
        </lightning-menu-item>
    </lightning-button-menu>
</template>
```

#### Draft Indicators

Use the `is-draft` and `draft-alternative-text` attributes together to indicate
that the menu item is in an unsaved state. The draft indicator, an asterisk,
is shown for the menu item when `is-draft` is `true`. The
`draft-alternative-text` attribute is required to provide text describing the
reason the item is considered in a draft state. The draft state might be used
to show there is unsaved state or data that could be lost, for example if
there's a user change in a customizable menu.
