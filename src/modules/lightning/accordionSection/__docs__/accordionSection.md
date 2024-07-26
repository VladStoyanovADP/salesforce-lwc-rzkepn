---
examples:
    - name: basic
      label: Basic Accordion Section
      description: Content for an accordion is an accordion-section.
---

A `lightning-accordion-section` defines the content of an accordion section inside a `lightning-accordion` component.
Each section can contain HTML markup or Lightning components.

This example creates a basic accordion with three sections, where section B is
expanded by specifying it with the `active-section-name` attribute in `lightning-accordion`.

```html
<template>
    <lightning-accordion active-section-name="B">
        <lightning-accordion-section name="A" label="Accordion Title A"
            >This is the content area for section A</lightning-accordion-section
        >
        <lightning-accordion-section name="B" label="Accordion Title B"
            >This is the content area for section B</lightning-accordion-section
        >
        <lightning-accordion-section name="C" label="Accordion Title C"
            >This is the content area for section C</lightning-accordion-section
        >
    </lightning-accordion>
</template>
```

Use the `label` attribute to provide optional header text for an accordion section. When the header text is too long to display in the viewport, the text is truncated and displayed with an ellipsis on desktop screens. Hover with the mouse to see the full text.

On mobile devices, long header text wraps to multiple lines because hover text isn't available.

To expand or collapse a section, click the toggle button or header text.

#### Adding an Action to a Section

This example creates the same basic accordion with an added `lightning-button-menu` on
the first section. The button menu is assigned to the `actions` slot which makes it display on the section header.

```html
<template>
    <lightning-accordion active-section-name="B">
        <lightning-accordion-section name="A" label="Accordion Title A">
            <lightning-button-menu
                slot="actions"
                alternative-text="Show menu"
                menu-alignment="right"
            >
                <lightning-menu-item
                    value="New"
                    label="Menu Item One"
                ></lightning-menu-item>
                <lightning-menu-item
                    value="Edit"
                    label="Menu Item Two"
                ></lightning-menu-item>
            </lightning-button-menu>
            <p>This is the content area for section A.</p>
        </lightning-accordion-section>
        <lightning-accordion-section name="B" label="Accordion Title B"
            >This is the content area for section B</lightning-accordion-section
        >
        <lightning-accordion-section name="C" label="Accordion Title C"
            >This is the content area for section C</lightning-accordion-section
        >
    </lightning-accordion>
</template>
```

#### Component Styling

This component implements the
[accordion](https://www.lightningdesignsystem.com/components/accordion) blueprint in the Salesforce Lightning Design System (SLDS).

To apply additional styling, use the SLDS [utility classes](https://www.lightningdesignsystem.com/utilities/alignment) with the `class` attribute.

For more information, see [lightning-accordion](bundle/lightning-accordion/documentation).
#### Usage Considerations

If two or more sections use the same name and that name is also specified as
the `active-section-name`, the first section using that name is expanded by default.

This component has usage differences from its Aura counterpart. See [Base Components: Aura Vs Lightning Web Components](https://developer.salesforce.com/docs/platform/lwc/guide/migrate-map-aura-lwc-components) in the Lightning Web Components Developer Guide.

#### Accessibility

The accordion section renders the toggle button and title in a `<button>` element. When a section is expanded, the button
renders with `aria-expanded="true"`. When a section is collapsed, the button renders with `aria-expanded="false"`.

Additionally, the button uses the `aria-controls` attribute to identify the content that relates to the controlling button on the accordion section.

To expand or collapse a section using the keyboard, press the Tab key to set focus on the toggle button or header text and press Enter.
