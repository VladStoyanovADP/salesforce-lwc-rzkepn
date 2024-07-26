The `lightning-modal-header` component displays header text in a panel at the top of a modal dialog.
Use of a header is optional, but when you provide a header you must specify the header text with the `label` attribute.

If you don't use the `lightning-modal-header` component, you must set a label
in the modal you create by extending `LightningModal`. A label is required for accessibility.

The modal components render in the order they appear in the template. Place the `lightning-modal-header`
component before the `lightning-modal-body` component in the template.

`lightning-modal-header` supports optional tagline text, which displays in smaller text below the heading. Enclose the
tagline text directly in the `lightning-modal-header` component, no HTML tag or attribute is needed. You can include links with `<a>`
tags, which are the only HTML elements permitted. If the header text is too long to fit on one line, it wraps in the modal header.

This sample code shows the expected order of the modal components. The modal content is
created in a separate component extended from `LightningModal`. See
[Lightning Web Components Developer Guide](https://developer.salesforce.com/docs/platform/lwc/guide/)

```html
<!-- my/modalDialog.html -->
<template>
    <lightning-modal-header label="My Modal">
        Tagline can be descriptive content with <a href="https://www.example.com">links</a> and can wrap to multiple lines.
    </lightning-modal-header>
    <lightning-modal-body>
        <!-- modal content specified in LightningModal component -->
    </lightning-modal-body>
</template>
```
#### Component Styling

`lightning-modal-header` implements the [modals](https://www.lightningdesignsystem.com/components/modals/) blueprint in the Salesforce Lightning Design System (SLDS).

To apply custom styling, use the `:host` selector or define a custom class using the `class` attribute.

```html
<lightning-modal-header label="My Modal" class="my-modal-header">

</lightning-modal-header>
```

Use SLDS styling hooks to customize the component's styles. Several `--slds-c-modal-header-*` and `--slds-c-modal-heading-*` hooks
enable you to customize the header.

For example, specify the background color on the button using the `sds-c-modal-header-color-background` custom property.

```css
.my-modal-header {
    --slds-c-modal-header-color-background: LightGray;
}
```

See the modal blueprint's [Styling Hooks Overview](https://www.lightningdesignsystem.com/components/modals/#Styling-Hooks-Overview) for a list of CSS custom properties.

For more information, see [Style Components Using Lightning Design System Styling Hooks](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-css-custom-properties) in the Lightning Web Components Developer Guide.

#### Accessibility

When you use `lightning-modal-header` in your modal, the rendered modal provides an `aria-labelledby` attribute set to the ID of the header element.
If you don't use `lightning-modal-header`, the accessible label is provided using `aria-label` set to the label you provide in the modal.

When the modal opens, focus goes to the first interactive element in the modal. If the header includes a link in tagline text, the link
gets initial focus.

See [Lightning Web Components Developer Guide](https://developer.salesforce.com/docs/platform/lwc/guide/) for more information about accessibility in modals.
