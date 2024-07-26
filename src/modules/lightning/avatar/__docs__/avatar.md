---
examples:
    - name: basic
      label: Basic Avatar
      description: Avatar with the default size and variant.
    - name: sizes
      label: Avatar Sizes
      description: Avatars of different sizes. The default size is medium.
    - name: variant
      label: Avatar Variants
      description: Avatars support circle and square variants. The default variant is square.
    - name: initials
      label: Avatar Initials
      description: Avatars can display initials if the image fails to load.
    - name: icons
      label: Avatar Icons
      description: Avatars can display fallback icons if the image fails to load and initials are not provided.
---

A `lightning-avatar` component is an image that represents an object, such as
an account or user. By default, the image renders in medium sizing with a
rounded rectangle, which is also known as the `square` variant.

Here is a basic avatar example.

```html
<lightning-avatar src="/images/codey.jpg" alternative-text="Codey Bear">
</lightning-avatar>
```

To use an image in your org as an avatar, upload the image as a static resource in the Static
Resources setup page. Use the `{!$Resource.logo}` syntax in your `src`
attribute, where `logo` is the name you provided in the `Name` field on the
setup page.

#### Handling Invalid Image Paths

The `src` attribute resolves the relative path to an image, but sometimes the
image path doesn't resolve correctly because the user is offline or the image
has been deleted. To handle an invalid image path, you can provide fallback
initials using the `initials` attribute or a fallback icon with the `fallback-icon-name`
attribute. These attributes work together if both are specified.

If initials and fallback icon name are provided, the initials are displayed and the
background color of the fallback icon is used as the background color for the initials.
The fallback icon is displayed only when the image path is invalid and initials are
not provided.

This example displays the initials "Sa" if the image path is invalid. The fallback icon
"standard:account" provides the background color for the initials. The icon is one of the
[standard icons](https://www.lightningdesignsystem.com/icons/#standard)
in Lightning Design System.

```html
<template>
    <lightning-avatar
        src="/bad/image/url.jpg"
        initials="Sa"
        fallback-icon-name="standard:account"
        alternative-text="Salesforce"
    >
    </lightning-avatar>
</template>
```

#### Component Styling

`lightning-avatar` implements the
[avatar](https://www.lightningdesignsystem.com/components/avatar/) blueprint in the Salesforce Lightning Design System (SLDS).

##### Icons

Although SLDS provides several categories of icons, only icons from the [standard](https://www.lightningdesignsystem.com/icons/#standard) and [custom](https://www.lightningdesignsystem.com/icons/#custom) categories can be used in `lightning-avatar`.

When applying SLDS classes or icons, check that they are
available in the SLDS release tied to your org. The latest
SLDS resources become available only when the new release
is available in your org.

##### Variants

Use the `variant` attribute with one of these values to apply styling.

-   `square` is the default variant, displaying a rectangle avatar with rounded corners
-   `circle` displays a round avatar

This example creates a round avatar.

```html
<template>
    <lightning-avatar
        variant="circle"
        src="https://www.lightningdesignsystem.com/assets/images/avatar2.jpg"
        fallback-icon-name="standard:person_account"
        alternative-text="Amy Smith"
    ></lightning-avatar>
</template>
```

##### Customize Component Styling

To apply additional styling, use the SLDS [utility classes](https://www.lightningdesignsystem.com/utilities/alignment) with the `class` attribute.

This example adds a margin around the avatar using an SLDS class.

```html
<lightning-avatar
    variant="circle"
    src="https://www.lightningdesignsystem.com/assets/images/avatar2.jpg"
    fallback-icon-name="standard:person_account"
    alternative-text="Account Name"
    class="slds-m-around_small"
>
</lightning-avatar>
```

The fallback icon is displayed if the image path is invalid. To apply custom styling, use the `:host` selector or define a custom class using the `class` attribute.

```html
<lightning-avatar
    variant="circle"
    src="https://www.lightningdesignsystem.com/invalid/path"
    fallback-icon-name="standard:person_account"
    alternative-text="Account Name"
    class="my-fallback-color"
>
</lightning-avatar>
```

Use SLDS styling hooks to customize the component's styles. For example, specify the background color on the fallback icon using the `--slds-c-icon-color-background` custom property.

```css
.my-fallback-color {
    --slds-c-icon-color-background: orange;
}
```

`lightning-avatar` contains the same customizable elements as `lightning-icon`, which supports the `--slds-c-icon-*` custom properties. Consider the following guidelines when working with SLDS styling hooks.

| CSS Custom Property             | `lightning-avatar` Guideline                                                                                                            |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `--slds-c-avatar-text-color`     | Use with the `initials` attribute and when you specify the `fallback-icon-name` with a standard, utility, doctype, or action icon only. |
| `--slds-c-avatar-radius-border`  | Adds a rounded border. Alternatively, to create an avatar on a circular background, use the `circle` variant.                           |
| `--slds-c-icon-color-background` | Use with the `fallback-icon-name` attribute.                                                                                            |
| `--slds-c-icon-color-foreground` | Use with the `fallback-icon-name` attribute for standard, custom, and action icons only.                                                |

See [Styling Hooks Overview](https://www.lightningdesignsystem.com/components/avatar/#Styling-Hooks-Overview) for a list of CSS custom properties.

For more information, see [Style Components Using Lightning Design System Styling Hooks](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-css-custom-properties) in the Lightning Web Components Developer Guide.

To understand how we implemented SLDS in `lightning-avatar`, see the **Source Code** section.

#### Accessibility

Use the `alternative-text` attribute to describe the avatar, such as a user's initials or name. This description provides the value for the `alt` attribute in the `img` HTML tag.
