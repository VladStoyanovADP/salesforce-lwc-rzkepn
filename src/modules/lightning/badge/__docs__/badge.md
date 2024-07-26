---
examples:
    - name: basic
      label: Basic Badge
      description: Basic badges with custom labels.
    - name: icon
      label: Badges with Icons
      description: Basic badges with icons.
---

A `lightning-badge` is a label that holds small amounts of information. A
badge can be used to display unread notifications, or to label a block of
text. Badges don't work for navigation because they can't include a hyperlink.

You can create two types of badges.

-   A text-only badge
-   A badge with an icon that's displayed before or after the text

Here is an example of a text-only badge.

```html
<template>
    <lightning-badge label="Account Name"> </lightning-badge>
</template>
```

To create a badge with an icon, set the `icon-name` to a Lightning Design System icon. The icon is displayed before the text by default.

```html
<template>
    <lightning-badge label="Account Name" icon-name="standard:account">
    </lightning-badge>
</template>
```

To display the icon after the text, set `icon-position="end"`.

```html
<template>
    <lightning-badge
        label="Starred Accounts"
        icon-name="custom:custom11"
        icon-position="end"
    >
    </lightning-badge>
</template>
```

#### Component Styling

`lightning-badge` implements the
[badge](https://www.lightningdesignsystem.com/components/badges/) blueprint in the Salesforce Lightning Design System (SLDS).

##### Icons

Visit [icons](https://lightningdesignsystem.com/icons) to view the available icons.

When applying SLDS classes or icons, check that they are
available in the SLDS release tied to your org. The latest
SLDS resources become available only when the new release
is available in your org.

##### Customize Component Styling

To apply additional styling, use the SLDS [utility classes](https://www.lightningdesignsystem.com/utilities/alignment) with the `class` attribute.

Change the badge color using an SLDS class.
See [colors](https://www.lightningdesignsystem.com/components/badges/#Colors) for more information.

This example creates a green badge using the `slds-theme_success` SLDS class.

```html
<lightning-badge label="Approved" class="slds-theme_success"> </lightning-badge>
```

Alternatively, to apply custom styling, use the `:host` selector or define a custom class using the `class` attribute.

```html
<lightning-badge label="Pending" class="pending-badge"> </lightning-badge>
```

Use SLDS styling hooks to customize the component's styles. For example, specify the badge color using the `--slds-c-badge-color-background` custom property.

```css
.pending-badge {
    --slds-c-badge-color-background: orange;
}
```

See [Styling Hooks Overview](https://www.lightningdesignsystem.com/components/badges/#Styling-Hooks-Overview) for a list of CSS custom properties.

For more information, see [Style Components Using Lightning Design System Styling Hooks](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-css-custom-properties) in the Lightning Web Components Developer Guide.

To understand how we implemented SLDS in `lightning-badge`, see the **Source Code** section.

#### Usage Considerations

Badges with nested elements are not supported. To create a label that can contain links, use `lightning-pill` instead.
