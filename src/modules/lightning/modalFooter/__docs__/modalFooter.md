The `lightning-modal-footer` component creates a footer at the bottom of a modal dialog.
Use of a footer is optional.

The modal components render in the order they appear in the template.
Place the `lightning-modal-footer` component after the `lightning-modal-body` component.

This sample code shows the expected order of the modal components. The modal content is
created in a separate component extended from `LightningModal`. See
[Lightning Web Components Developer Guide](https://developer.salesforce.com/docs/platform/lwc/guide/)

This sample's `lightning-modal-footer` includes two `lightning-button` components,
but you can also use `<button>` elements.

```html
<!-- my/modalDialog.html -->
<template>
    <lightning-modal-header label="My Modal">
    </lightning-modal-header>
    <lightning-modal-body>
        <!-- modal content specified in LightningModal component -->
    </lightning-modal-body>
    <lightning-modal-footer>
        <lightning-button
            class="slds-button"
            variant="neutral"
            label="Cancel"
            onclick={handleDismiss}
        ></lightning-button>
        <lightning-button
            class="slds-button slds-m-left_x-small"
            variant="brand"
            label="Save"
        ></lightning-button>
    </lightning-modal-footer>
</template>
```
#### Component Styling

`lightning-modal-footer` implements the [modals](https://www.lightningdesignsystem.com/components/modals/) blueprint in the Salesforce Lightning Design System (SLDS).

To apply custom styling, use the `:host` selector or define a custom class using the `class` attribute.

```html
<lightning-modal-footer class="my-modal-footer">

</lightning-modal-footer>
```

Use SLDS styling hooks to customize the component's styles. Several `--slds-c-modal-footer-*` hooks
enable you to customize the footer spacing, background color, and text color.

For example, specify the background color on the footer using the `sds-c-modal-footer-color-background` custom property.

```css
.my-modal-footer {
    --slds-c-modal-footer-color-background: LightGray;
}
```

See the modal blueprint's [Styling Hooks Overview](https://www.lightningdesignsystem.com/components/modals/#Styling-Hooks-Overview) for a list of CSS custom properties.

For more information, see [Style Components Using Lightning Design System Styling Hooks](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-css-custom-properties) in the Lightning Web Components Developer Guide.

#### Accessibility

If you add buttons to the footer, you can use the accessibility attributes described in [`lightning-button`](bundle/lightning-button/documentation).

When the modal opens, focus goes to the first interactive element in the modal. If there are no links in the header or any interactive elements
in the modal body, the first footer button gets initial focus.

See [Lightning Web Components Developer Guide](https://developer.salesforce.com/docs/platform/lwc/guide/) for more information about accessibility in modals.

