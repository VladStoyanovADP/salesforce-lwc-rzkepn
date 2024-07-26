---
examples:
    - name: basic
      label: Basic Accordion
      description: Accordion with a pre-selected open section, and a button that programmatically opens another section. By default, only one section can be open at a time. You can close a section by opening another section.
    - name: conditional
      label: Accordion with Conditional Section
      description: Accordion sections can be toggled to be visible or not.
    - name: multiple
      label: Accordion with Multiple Open Sections
      description: Accordion sections can be open or closed without restrictions, programmatically or by clicking the section headers.
---

A `lightning-accordion` displays vertically stacked sections of content that you can expand and collapse. Click a section's header to expand its content. Users can control how much content is visible at once, and don't need to scroll as much to see the content of a page.

To create an accordion section, nest a `lightning-accordion-section` component within `lightning-accordion`. Each `lightning-accordion-section` can contain HTML markup or Lightning components.

By default, only one section can be open at a time. You can close a section by opening another section. You can configure the accordion to allow multiple sections to be open, and then the sections can be opened and closed by clicking section headers.

You can specify one or multiple active sections. Active sections are expanded when the component loads. The terms "active", "expanded", and "open" are used interchangeably in this documentation.

Lazy loading is not currenty supported. The content you load in inactive sections also impact your page load time.

#### Initializing the Accordion with An Active Section

The first accordion section is expanded by default. To change the default, provide a section name using the `active-section-name` attribute. The section name is case-sensitive.

This example creates a basic accordion with three sections, where section B is expanded by default. Only one accordion section is expanded at a time.

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

If two or more sections use the same name and that name is also specified as the `active-section-name`, the first section with that name is expanded by default.

#### Initializing the Accordion with Multiple Active Sections

To specify multiple expanded sections, include `allow-multiple-sections-open` in your markup and pass in an array of accordion section names to `active-section-name`.
If you don't pass in a section name, all sections are closed by default.

```html
<template>
    <lightning-accordion
        allow-multiple-sections-open
        active-section-name={activeSections}
    >
        <lightning-accordion-section name="A" label="Accordion Title A">
            <p>This is the content area for section A.</p>
        </lightning-accordion-section>

        <lightning-accordion-section name="B" label="Accordion Title B">
            <p>This is the content area for section B.</p>
        </lightning-accordion-section>

        <lightning-accordion-section name="C" label="Accordion Title C">
            <p>This is the content area for section C.</p>
        </lightning-accordion-section>
    </lightning-accordion>
</template>
```

In your JavaScript code, define the sections you want to expand.

```javascript
import { LightningElement } from 'lwc';

export default class LightningExampleAccordionMultiple extends LightningElement {
    activeSections = ['A', 'C'];
}
```

#### Handling the Section Toggle Event

When the open sections change, use the `onsectiontoggle` handler to find out which sections are active.

This example displays the name of the active section.

```html
<template>
    <p>{activeSectionsMessage}</p>

    <lightning-accordion
        allow-multiple-sections-open
        onsectiontoggle={handleSectionToggle}
        active-section-name="A"
    >
        <lightning-accordion-section name="A" label="Accordion Title A">
            <p>This is the content area for section A.</p>
        </lightning-accordion-section>

        <lightning-accordion-section name="B" label="Accordion Title B">
            <p>This is the content area for section B.</p>
        </lightning-accordion-section>

        <lightning-accordion-section name="C" label="Accordion Title C">
            <p>This is the content area for section C.</p>
        </lightning-accordion-section>
    </lightning-accordion>
</template>
```

Use the `detail.openSections` property to return the active section names.

```javascript
import { LightningElement } from 'lwc';

export default class DemoAccordionMultiple extends LightningElement {
    activeSectionsMessage = '';

    handleSectionToggle(event) {
        const openSections = event.detail.openSections;

        if (openSections.length === 0) {
            this.activeSectionsMessage = 'All sections are closed';
        } else {
            this.activeSectionsMessage =
                'Open sections: ' + openSections.join(', ');
        }
    }
}
```

#### Expanding Sections Programmatically

To expand a section using JavaScript, pass in the section name using `active-section-name`.

This example expands section B when the **Expand Section B** button is pressed.

```html
<template>
    <lightning-button label="Expand Section B" onclick={handleClick}>
    </lightning-button>
    <lightning-accordion
        active-section-name={section}
        onsectiontoggle={handleSectionToggle}
    >
        <lightning-accordion-section name="A" label="A"
            >Content A</lightning-accordion-section
        >
        <lightning-accordion-section name="B" label="B"
            >Content B</lightning-accordion-section
        >
        <lightning-accordion-section name="C" label="C"
            >Content C</lightning-accordion-section
        >
    </lightning-accordion>
</template>
```

The `onclick` handler on the button sets the active section name, which opens the section programmatically.

Set the value for the open section using the `openSections` property in the `onsectiontoggle` handler.

```javascript
import { LightningElement } from 'lwc';

export default class App extends LightningElement {
    section = '';

    handleClick(event) {
        this.section = 'B';
    }

    handleSectionToggle(event) {
        this.section = event.detail.openSections;
    }
}
```

To expand multiple sections programmatically, include `allow-multiple-sections-open` in your markup and pass in an array of section names instead.

```javascript
import { LightningElement } from 'lwc';

export default class App extends LightningElement {
    section = [];

    handleClick(event) {
        this.section = ['B', 'C'];
    }

    handleSectionToggle(event) {
        this.section = event.detail.openSections;
    }
}
```

#### Nested Accordions

You can nest `lightning-accordion` components inside `lightning-accordion-section` components to create multiple levels in the accordion. The chevron icon is used for all sections and levels.

#### Component Styling

`lightning-accordion` implements the [accordion](https://www.lightningdesignsystem.com/components/accordion) blueprint in the Salesforce Lightning Design System (SLDS).

To apply additional styling, use the SLDS [utility classes](https://www.lightningdesignsystem.com/utilities/alignment) with the `class` attribute.

This example adds a border and gray background to the accordion content area using SLDS classes.

```html
<lightning-accordion active-section-name="A">
    <lightning-accordion-section name="A" label="Accordion Title A">
        <div class="slds-box slds-theme_shade">
            <p>This is the content area for section A.</p>
        </div>
    </lightning-accordion-section>
    <!-- More accordion sections here -->
</lightning-accordion>
```

To apply custom styling, use the `:host` selector or define a custom class using the `class` attribute.

```html
<lightning-accordion class="example-accordion" active-section-name="A">
    <lightning-accordion-section name="A" label="Accordion Title A">
        <p>This is the content area for section A.</p>
    </lightning-accordion-section>
    <!-- More accordion sections here -->
</lightning-accordion>
```

Use SLDS styling hooks to customize the component's styles. For example, specify the border color using the `--slds-c-accordion-color-border` custom property.

```css
.example-accordion {
    --slds-c-accordion-color-border: orange;
}
```

See [Styling Hooks Overview](https://www.lightningdesignsystem.com/components/accordion/#Styling-Hooks-Overview) for a list of CSS custom properties.

For more information, see [Style Components Using Lightning Design System Styling Hooks](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-css-custom-properties) in the Lightning Web Components Developer Guide.

To understand how we implemented SLDS in `lightning-accordion`, see the **Source Code** section.

#### Usage Considerations

You can't initialize an accordion with multiple sections using only markup. Pass the array of section names using JavaScript, as described in **Initializing the Accordion with Multiple Active Sections**.

Accordion sections are not lazy loaded. Content in sections that are collapsed initially are available on load in the DOM.

This component has usage differences from its Aura counterpart. See [Base Components: Aura Vs Lightning Web Components](https://developer.salesforce.com/docs/platform/lwc/guide/migrate-map-aura-lwc-components) in the Lightning Web Components Developer Guide.

#### Custom Events

**`sectiontoggle`**

The event fired when an accordion loads with at least one active section or when a section is toggled.

The `sectiontoggle` event returns the following parameter.

| Parameter    | Type   | Description                                                                               |
| ------------ | ------ | ----------------------------------------------------------------------------------------- |
| openSections | object | The name of the active section. Returns an array of strings for the active section names. |

The event properties are as follows.

| Property   | Value | Description                                                                                               |
| ---------- | ----- | --------------------------------------------------------------------------------------------------------- |
| bubbles    | false | This event does not bubble.                                                                               |
| cancelable | false | This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event. |
| composed   | false | This event does not propagate outside the template in which it was dispatched.                            |
