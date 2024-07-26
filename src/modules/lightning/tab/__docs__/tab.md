A `lightning-tab` component keeps related content in a single container. The tab content
displays when a user clicks the tab. Use `lightning-tab`
as a child of the [`lightning-tabset`](bundle/lightning-tabset/documentation) component.

This component inherits styling from
[tabs](https://www.lightningdesignsystem.com/components/tabs/) in the
Lightning Design System.

Use the `label` attribute to specify the tab's text label.

To display an icon at the beginning of the label, use the `icon-name` attribute. Provide alternative text for the icon using `icon-assistive-text`.

To display an icon at the end of the label, use the `end-icon-name` attribute. Provide alternative text for that icon using `end-icon-alternative-text`.

Specify the `show-error-indicator` attribute to display an error indicator in the tab after the label. If an end icon is present, the error indicator is displayed after the icon.

#### Usage Considerations

Tab content is lazy loaded. You can only query the content for the active and previously active tabs.

See [`lightning-tabset`](bundle/lightning-tabset/documentation) for more
information.

You can nest `lightning-tab` within other elements such as `<div>` or `<template>`, for example to render tabs conditionally using `if:true` and `if:false`. Otherwise, you must nest
`lightning-tab` directly within `lightning-tabset` tags.

For example, you want to display a tab conditionally.

```html
<lightning-tabset>
    <lightning-tab label="Item One"> Content for tab 1 </lightning-tab>
    <template if:true={showTabTwo}>
        <lightning-tab label="Item Two"> Content for tab 2 </lightning-tab>
    </template>
</lightning-tabset>
```

This component has usage differences from its Aura counterpart. See [Base Components: Aura Vs Lightning Web Components](https://developer.salesforce.com/docs/platform/lwc/guide/migrate-map-aura-lwc-components) in the Lightning Web Components Developer Guide.

#### Custom Events

**`active`**

The event fired when a tab becomes active.

The event properties are as follows.

| Property   | Value | Description                                                                |
| ---------- | ----- | -------------------------------------------------------------------------- |
| bubbles    | true  | This event bubbles up through the DOM.                                     |
| cancelable | true  | This event can be canceled. You can call `preventDefault()` on this event. |
| composed   | true  | This event propagates outside of the component in which it was dispatched. |
