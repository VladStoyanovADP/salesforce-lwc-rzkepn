The `lightning-modal-body` component renders the content of a modal.

The modal components render in the order they appear in the template. Place the `lightning-modal-body`
component after `lightning-modal-header` and before `lightning-modal-footer` components, if you're providing them.

This sample code shows the expected order of the modal components. The modal content is
created in a separate component extended from `LightningModal`. See
[Lightning Web Components Developer Guide](https://developer.salesforce.com/docs/platform/lwc/guide/)

```html
<!-- my/modalDialog.html -->
<template>
    <lightning-modal-header label="My Modal Heading">
        Tagline content with <a href="https://salesforce.com">Salesforce.com link</a>
    </lightning-modal-header>
    <lightning-modal-body>
        <!-- modal content specified in LightningModal component -->
        { content }
        <!-- alternatively, add content here directly -->
    </lightning-modal-body>
    <lightning-modal-footer>
        Footer Content
    </lightning-modal-footer>
</template>
```

You can nest content in `lightning-modal-body` or
`lightning-modal-body` automatically scrolls the modal's content when necessary.
The modal's maximum height is calculated to prevent the content from exceeding the screen height,
and scroll bars are automatically added.
#### Component Styling

`lightning-modal-body` implements the [modals](https://www.lightningdesignsystem.com/components/modals/) blueprint in the Salesforce Lightning Design System (SLDS).

To apply custom styling, use the `:host` selector or define a custom class using the `class` attribute.

```html
<lightning-modal-body class="my-modal-body">

</lightning-modal-body>
```

Use SLDS styling hooks to customize the component's styles. The `--slds-c-modal-content-*` hooks
enable you to customize the background color and text color of the modal body.

For example, specify the background color on the modal using the `sds-c-modal-content-color-background` custom property.

```css
.my-modal-body {
    --slds-c-modal-content-color-background: LightBlue;
}
```

See the modal blueprint's [Styling Hooks Overview](https://www.lightningdesignsystem.com/components/modals/#Styling-Hooks-Overview) for a list of CSS custom properties.

For more information, see [Style Components Using Lightning Design System Styling Hooks](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-css-custom-properties) in the Lightning Web Components Developer Guide.

#### Accessibility

See [Lightning Web Components Developer Guide](https://developer.salesforce.com/docs/platform/lwc/guide/) for more information about accessibility in modals.

