---
examples:
    - name: basic
      label: Basic Card
      description: A basic card that provides a title attribute. The card uses a button in the actions slot, and plain text in the footer slot.
    - name: narrow
      label: Card with Narrow Variant
      description: This card uses the narrow variant and specifies an icon to include with the title. The card uses a button icon in the actions slot and plain text in the footer slot.
    - name: custom
      label: Card with Custom Title and Footer
      description: This card creates a custom title by using a title slot that contains a header tag and lightning-icon. The footer slot contains lightning-badge components, and the actions slot is empty.
---

A `lightning-card` is used to apply a stylized container around a grouping of information. The information could be a single item or a group of items such as a related list.

A `lightning-card` can contain a title, body, actions, and a footer. The title, actions, and footer are optional. You can also provide an icon in the header in front of the title.

Use the `actions` slot to pass content such as `lightning-button-icon` or `lightning-button` to perform an action when clicked. Actions are displayed on the top corner of the card opposite the title.

Here's an example that passes in the title, actions, and footer as slots, and includes an icon.

```html
<template>
    <lightning-card variant="narrow" icon-name="standard:opportunity">
        <h1 slot="title">This is a title</h1>
        <h1>This is the body</h1>
        <div slot="actions">
            <lightning-button-icon
                icon-name="utility:down"
            ></lightning-button-icon>
        </div>
        <div slot="footer">
            <h6>This is the footer</h6>
        </div>
    </lightning-card>
</template>
```

`title` is available as an attribute or a slot. Pass in the title as a slot if you want to pass in markup, such as making the title bold.

Use the `title` attribute if your title doesn't need extra formatting. Setting the `title` attribute overwrites the `title` slot. For more information, see [Use Slots as Placeholders](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-slots).

#### Add an Action to the Footer Slot

The card footer is optional and can contain an action to link to another page.
If using the card footer, we recommend using a View All link that takes a user to the object list view.

This example adds the View All link to the footer slot,
specifying the `slds-card__footer-action` class on the <a> tag. This class makes the footer's click
target span the entire width of the card so you can click anywhere in the footer. The class isn't required.

For a View All link, set the href value of the tag to a URL to take the user to the object list view.

```html
<template>
    <lightning-card title="Hello">
        <lightning-button label="New" slot="actions"></lightning-button>
        <lightning-button label="Old" slot="actions"></lightning-button>
        <p class="slds-p-horizontal_small">Card Body (custom component)</p>
        <div slot="footer">
            <a class="slds-card__footer-action" href="#"
                >View All
                <span class="slds-assistive-text">Accounts</span>
            </a>
        </div>
    </lightning-card>
</template>
```

To navigate to records, list views, and objects in Lightning Experience, Experience Builder sites, and the Salesforce mobile app, use the navigation service, [`lightning/navigation`](docs/component-library/bundle/lightning-navigation). For more information, see [Basic Navigation](https://developer.salesforce.com/docs/platform/lwc/guide/use-navigate-basic).

#### Component Styling

`lightning-card` implements the
[cards](https://www.lightningdesignsystem.com/components/cards/) blueprint in the Salesforce Lightning Design System (SLDS).

##### Icons

`lightning-card` displays an SLDS icon if you pass an icon name with the `icon-name` attribute. The icon is rendered using `lightning-icon`.

When applying SLDS classes or icons, check that they are available in the SLDS release tied to your org. The latest SLDS resources become available only when the new release is available in your org.

Visit [icons](https://lightningdesignsystem.com/icons/) to view available icons.

##### Customize Component Styling

To apply additional styling, use the SLDS [utility classes](https://www.lightningdesignsystem.com/utilities/alignment) with the `class` attribute, as shown in the **Add an Action to the Footer Slot** section.

To apply custom styling, use the `:host` selector. Use SLDS styling hooks to customize the component's style. For example, specify the header font weight and body spacing.

```css
:host {
    --slds-c-card-heading-font-weight: 500px;
    --slds-c-card-body-spacing-inlinestart: 20px;
}
```

See [Styling Hooks Overview](https://www.lightningdesignsystem.com/components/cards/#Styling-Hooks-Overview) for a list of CSS custom properties.

For more information, see [Style Components Using Lightning Design System Styling Hooks](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-css-custom-properties) in the Lightning Web Components Developer Guide.

`lightning-card` also includes [`lightning-icon`](bundle/lightning-icon/documentation) and [`lightning-button`](bundle/lightning-button/documentation) components that you can customize using SLDS styling hooks.

To understand how we implemented SLDS in `lightning-card`, see the **Source Code** section.

#### Usage Considerations

Icons are not available in Lightning Out, but they are available in Lightning Components for Visualforce and other experiences.

This component has usage differences from its Aura counterpart. See [Base Components: Aura Vs Lightning Web Components](https://developer.salesforce.com/docs/platform/lwc/guide/migrate-map-aura-lwc-components) in the Lightning Web Components Developer Guide.
