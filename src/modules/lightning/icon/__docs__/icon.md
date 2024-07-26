---
examples:
    - name: basic
      label: Basic Icons
      description: Action icons, doctype icons, standard icons, utility icons, and custom icons.
    - name: variants
      label: Icons with Sizes and Variants
      description: Effects of the size attribute and inverse, success, warning and error variants.
---

A `lightning-icon` is a visual element that provides context and enhances
usability. Icons can be used inside the body of another component or on their
own. You can specify an icon from the Lightning Design System using the `icon-name` attribute.

Here is an example.

```html
<template>
    <lightning-icon
        icon-name="action:approval"
        size="large"
        alternative-text="Indicates approval"
    >
    </lightning-icon>
</template>
```

Alternatively, you can provide a custom icon using the `src` attribute. See the **Using Your Own Icons** section.

#### Component Styling

`lightning-icon` provides you with icons in the Salesforce Lightning Design System (SLDS). Visit [icons](https://lightningdesignsystem.com/icons) to view the available icons.

You can use a combination of the `variant`, `size`, and `class` attributes to customize the icon styling.

When applying SLDS classes or icons, check that they are
available in the SLDS release tied to your org. The latest
SLDS resources become available only when the new release
is available in your org.

##### Sizes

Adjust icon sizes using the `size` attribute with one of these values.

-   `medium` is the default size, which creates a 32px by 32px icon
-   `small` creates a 24px by 24px icon
-   `x-small` creates a 16px by 16px icon
-   `xx-small` creates a 14px by 14px icon
-   `large` creates a 48px by 48px icon

##### Variants

Variants are supported only for the utility icons. To change the appearance of a [utility icon](https://lightningdesignsystem.com/icons/#utility), use the `variant` attribute with one of these values.

-   `inverse` adds a white fill to a utility icon, useful for dark backgrounds
-   `error` adds a red fill to a utility icon to call out a user- or system-related error
-   `success` adds a green fill to a utility icon to represent a successful operation
-   `warning` adds a yellow fill to a utility icon to advise caution

This example uses the `error` variant to add a red fill to the error utility icon.

```html
<template>
    <lightning-icon icon-name="utility:error" variant="error"> </lightning-icon>
</template>
```

##### Customize Component Styling

To apply additional styling, use the SLDS [utility classes](https://www.lightningdesignsystem.com/utilities/alignment) with the `class` attribute.
For example, you can set `class="slds-m-vertical_large"` or other [margin](https://lightningdesignsystem.com/utilities/margin/) classes to add
spacing around the icon.

To change the fill and background color of a utility icon, define a custom class using the `class` attribute. This example applies custom fill and background colors on the utility icon.

```html
<lightning-icon
    icon-name="utility:connected_apps"
    alternative-text="Connected"
    title="Connected"
    class="my-icon"
>
</lightning-icon>
```

Specify the fill and background colors on the utility icon using the `--slds-c-icon-color-*` custom properties.

```css
.my-icon {
    --slds-c-icon-color-foreground-default: orange;
    --slds-c-icon-color-background: gray;
}
```

To change the fill and background colors of a non-utility icon, such as an [action](https://lightningdesignsystem.com/icons/#action), [standard](https://lightningdesignsystem.com/icons/#standard), or [custom](https://lightningdesignsystem.com/icons/#custom) icon, specify the fill color like this.

```css
.my-icon {
    --slds-c-icon-color-foreground: orange;
    --slds-c-icon-color-background: gray;
}
```

See [Styling Hooks Overview](https://www.lightningdesignsystem.com/components/icons/#Styling-Hooks-Overview) for a list of CSS custom properties.

For more information, see [Style Components Using Lightning Design System Styling Hooks](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-css-custom-properties) in the Lightning Web Components Developer Guide.

To understand how we implemented SLDS in `lightning-icon`, see the **Source Code** section.

#### Using Your Own Icons

Use the `src` attribute to specify the path of the resource for your
icon. When this attribute is present, `lightning-icon` attempts to load an
icon from the provided resource.

Define a static resource in your org and upload your icon's SVG resource
to it. The SVG code must include a `<g>` element with an id that you can reference.

For example, suppose your static resource is named `mySVG_icon` and it contains
this `google.svg` content.

```html
<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    &lt;title>Google icon&lt;/title>
    <g id="google">
        <path
            d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
        ></path>
    </g>
</svg>
```

Import the SVG resource into your component, and set a variable to the static resource URL plus the `<g>` ID.

```javascript
// myComponent.js
import { LightningElement } from 'lwc';
import mySVG_icon from '@salesforce/resourceUrl/mySVG_icon';

export default class myComponent extends LightningElement {
    googleIcon = mySVG_icon + '#google';
}
```

Pass the static resource variable in the `src` attribute.

```html
<template>
    <lightning-icon src={googleIcon}></lightning-icon>
</template>
```

For more information about static resources and using SVG, see [Access Static Resources](https://developer.salesforce.com/docs/platform/lwc/guide/create-resources) and [Use SVG Resources](https://developer.salesforce.com/docs/platform/lwc/guide/use-svg-in-component) in the _Lightning Web Components Developer Guide_.

##### Overriding the Icon Fill Color of Your Imported Icons

Note that icons you import have a default fill attribute value `#fff`, which
you can override in your svg sprite directly. For example, change the color to
a shade of green by inserting `fill=#648079` in the `<svg>` element.

Alternatively, use CSS custom properties to change the fill color on your imported icon. See the non-utility icon example in the **Customize Component Styling** section.

#### Accessibility

Use the `alternative-text` attribute to describe the icon for assistive devices. The description
should indicate what happens when you click the button, for example 'Upload
File', not what the icon looks like, 'Paperclip'.

Sometimes an icon is decorative and does not need a description. But icons can
switch between being decorative or informational based on the screen size. If
you choose not to include an `alternative-text` description, check smaller
screens and windows to ensure that the icon is decorative on all formats.

#### Usage Considerations

Icons are not available in Lightning Out, but they are available in Lightning Components for Visualforce and other experiences.
