---
examples:
    - name: basic
      label: Basic Helptext
      description: Basic default helptext example and an alternative icon example.
---

A `lightning-helptext` component displays an icon with a popover containing a
small amount of text describing an element on screen. The popover is displayed
when you hover or focus on the icon that's attached to it. On iOS devices, the
helptext popover opens when you tap on the icon and closes with a second tap
on the popover or the icon.

This component is similar to a tooltip and is useful to display field-level help text, for example. HTML markup is not supported in the tooltip content.

This example creates an icon with a tooltip.

```html
<template>
    <lightning-helptext content="Your email address will be your login name">
    </lightning-helptext>
</template>
```

The popover is anchored on the lower left of the icon and shown above the icon
if space is available. It automatically adjusts its position according to the
viewport.

#### Component Styling

`lightning-helptext` implements the
[tooltip](https://www.lightningdesignsystem.com/components/tooltips/) blueprint in the Salesforce Lightning Design System (SLDS).

##### Icons

By default, the tooltip uses the `utility:info` icon but you can specify a
different icon with the `icon-name` attribute. The SLDS utility icon category offers nearly 200 utility icons that can be used
in `lightning-helptext`. Although SLDS provides several
categories of icons, only the utility category can be used in
`lightning-helptext`.

Visit [utility icons](https://lightningdesignsystem.com/icons/#utility) to view the utility icons.

When applying SLDS classes or icons, check that they are
available in the SLDS release tied to your org.
The SLDS site shows the latest SLDS
resources, and these become available only when the new release
is available in your org.

##### Variants

Use the `icon-variant` attribute to change the style of the icon with the following values.

-   `bare` is the default variant and doesn't need to be specified
-   `error` adds a red fill for the icon to call out a user- or system-related error
-   `inverse` adds a white fill for the icon, useful for dark backgrounds
-   `warning` adds a yellow fill for the icon to advise caution

#### Customize Component Styling

To apply additional styling, use the SLDS [utility classes](https://www.lightningdesignsystem.com/utilities/alignment) with the `class` attribute.

This example adds a margin to the left of the tooltip icon using the `slds-m-left_xx-small` class.

```html
some text that appears before the tooltip icon here
<lightning-helptext
    icon-name="utility:salesforce1"
    content="tooltip content here"
    class="slds-m-left_xx-small"
></lightning-helptext>
```

To apply custom styling, use the `:host` selector or define a custom class using the `class` attribute.

`lightning-helptext` contains the same customizable elements as `lightning-button-icon` for the button icon, which supports `--slds-c-button-*` custom properties. See the [`lightning-button-icon` documentation](bundle/lightning-button-icon/documentation).

Customizing the tooltip content using the `--slds-c-tooltip-*` custom properties isn't supported. `lightning-helptext` renders the tooltip as the child of the body element outside of the scoped container.

#### Accessibility

`lightning-helptext` contains a focusable button element. To ensure that users who aren't using a mouse can access the tooltip, `lightning-helptext` shows the tooltip on hover or on keyboard focus. The button renders with an `aria-describedby` attribute set to an ID that matches the element containing the tooltip text. The `aria-describedby` attribute enables assistive technology to announce the tooltip content.

The button renders assistive text that contains "Help" by default. To provide your own description, use the `alternative-text` attribute.
The text should describe the function of the icon, for example, "Show help text", instead of repeating the `content` description.
Providing the purpose of the icon in the description improves usability and removes repetition of content for users of assistive technology.
