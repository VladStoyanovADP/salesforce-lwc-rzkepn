---
examples:
    - name: basic
      label: Basic Tabset
      description: A tabset includes content within tabs.
    - name: scoped
      label: Tabset with Scoped Variant
      description: The scoped variant displays the tabset with a different visual styling than the default.
    - name: activeTab
      label: Tabset with Default Selected Tab
      description: A tabset can display an active tab by default using the active-tab-value attribute.
    - name: conditionalTab
      label: Tabset with Conditional Tabs
      description: A tab can be displayed or hidden conditionally.
    - name: onactive
      label: Tabset with Content Added When Tab is Selected
      description: Programmatically add content to a tab when the tab is selected. Tab's content is a message with the selected tab's value.
    - name: overflow
      label: Tabset with Overflow Tabs
      description: Overflow tabs are hidden from view when the view port is not wide enough. Overflow tabs are grouped in a dropdown menu labelled "More".
    - name: vertical
      label: Tabset with Vertical Variant
      description: A tabset can be displayed vertically using the vertical variant.
---

A `lightning-tabset` displays a tabbed container with multiple content areas,
only one of which is visible at a time. Tabs are displayed horizontally inline
with content shown below it, by default. Use tabs to separate information into logical sections based on functionality or use case.

A tabset can hold multiple [`lightning-tab`](bundle/lightning-tab/documentation) components as part of its body. The first tab is activated by default.

Set the `variant` attribute to change the look of the tabset. The `variant` attribute can be set to `default`, `scoped`, or `vertical`. See **Design Guidelines** for more information.

Next is an example of a standard horizontal tabset.

```html
<template>
    <lightning-tabset>
        <lightning-tab label="Tab One"> Content of Tab One </lightning-tab>
        <lightning-tab label="Tab Two"> Content of Tab Two </lightning-tab>
    </lightning-tabset>
</template>
```

#### Add Content To Tab Programmatically

To add content programmatically to the tab body, use the `onactive` event handler on `lightning-tab`.
Here's an example with two tabs, which loads content when the tabs are selected.

```html
<template>
    <lightning-tabset>
        <lightning-tab label="Item One" value="1" onactive={handleActive}>
            Here's the content for Item One: {tabContent}
        </lightning-tab>
        <lightning-tab label="Item Two" value="2" onactive={handleActive}>
            Here's the content for Item Two: {tabContent}
        </lightning-tab>
    </lightning-tabset>
</template>
```

Identify the active tab using `event.target.value`.

```javascript
import { LightningElement } from 'lwc';

export default class ActiveTabExample extends LightningElement {
    tabContent = '';

    handleActive(event) {
        const tab = event.target;
        this.tabContent = `Tab ${event.target.value} is now active`;
    }
}
```

#### Design Guidelines

Use `lightning-tabset` to enable users to easily switch between tabs to perform tasks without leaving the page. Assign a default tab based on the most important use case for the page.

We don't recommend using tabs to define a linear, ordered process since each tab functions independently of the others.

Tab labels must be consistent. For example, use a verb to let users identify a tab's purpose quickly.

`lightning-tabset` doesn’t currently support mobile-oriented tabs. This component doesn’t adjust the tab styling when there are two or more immediately adjacent tab sets on mobile.

#### Component Styling

`lightning-tabset` implements the
[tabs](https://www.lightningdesignsystem.com/components/tabs/) blueprint in the
Salesforce Lightning Design System (SLDS).

You can use a combination of the `variant` and `class` attributes to customize the tab content styles.

##### Variants

Use the `variant` attribute to group your content and apply styling.

-   `default` creates global tabs. When you select a tab, its content replaces the content of the previously selected tab. The default variant tab encapsulates the content underneath it without enclosing it visually.

-   `scoped` creates a tab set that has a closed container with a defined border. Scoped tabs are useful for stacking several tabbed sections, where you want to change only a portion of the content displayed. When you click those tabs, the content at the bottom remains the same while the content at the top changes for the activity.

-   `vertical` resembles the scoped variant in appearance, but the tabs are arranged vertically to the side instead of on the top.

You can nest scoped tabs within a global tab set, but don't nest global tabs. If additional hierarchy is necessary, consider using a `lightning-tree` component.

##### Customize Component Styling

To apply additional styling, use the SLDS [utility classes](https://www.lightningdesignsystem.com/utilities/alignment) with the `class` attribute.

This example adds a gray background and padding to the content area on the first tab using SLDS classes.

```html
<lightning-tabset>
    <lightning-tab label="Item One" class="slds-theme_shade">
        <p class="slds-p-left--small">Hello Tab 1!</p>
    </lightning-tab>
    <lightning-tab label="Item Two"> </lightning-tab>
</lightning-tabset>
```

To change the text color on the active tab, define a custom class using the `class` attribute. This example sets the text on the active tab to red.

```html
<lightning-tabset variant="scoped" class="tab-active">
    <lightning-tab label="Item One">
        <p>Hello Tab 1!</p>
    </lightning-tab>
    <lightning-tab label="Item Two" title="2nd tab extended title">
        <p>Hello Tab 1!</p>
    </lightning-tab>
</lightning-tabset>
```

Specify the text color using the `--slds-c-tabs-scoped-color-text-active` custom property.

```css
.tab-active {
    --slds-c-tabs-scoped-color-text-active: red;
}
```

For more information, see [Style Components Using Lightning Design System Styling Hooks](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-css-custom-properties) in the Lightning Web Components Developer Guide.

To understand how we implemented SLDS in `lightning-tabset`, see the **Source Code** section.

#### Usage Considerations

When a tabset contains more tabs than can fit in the viewport, the tabs that don't fit are moved into a dropdown menu (also known as an overflow) next to the last tab that fits. Note that the active tab always shows and is never moved into the overflow. Truncating the tab label is not supported. When the tab label has more characters than can fit the viewport, the extra characters are not truncated but are hidden from view.

You can nest `lightning-tab` within other elements such as `<div>` or `<template>`, for example to render tabs conditionally using `if:true` and `if:false`. Otherwise, you must nest
`lightning-tab` directly within `lightning-tabset` tags.

Tab content is lazy loaded, and as such only the active and previously
active tabs content is queryable. In the example, the text `Content of Tab Two` is inserted in the DOM of the page only when the second tab is selected.

This component has usage differences from its Aura counterpart. See [Base Components: Aura Vs Lightning Web Components](https://developer.salesforce.com/docs/platform/lwc/guide/migrate-map-aura-lwc-components) in the Lightning Web Components Developer Guide.

#### Accessibility

Use the Tab or arrow keys to navigate to the More menu that’s created when the viewport is too narrow to show all the tabs.

Several attributes enable accessibility features for a tabset heading.

Use `heading-label` to specify custom assistive text for a tabset heading. The value of `heading-label` is rendered as the text content of a `div` element with `role="heading"` and `aria-level="2"`. If you don't specify `heading-label` the default assistive text is "Tabs" in a `div` element with `aria-level="2"`.

Use `heading-level` to pass a value between 1 and 6 to the rendered `aria-level` attribute. The default value is 2. This attribute requires you to also specify `heading-label`.

Specify `heading-visible` to display the assistive text above the tabset when you specify `heading-label`. By default, this attribute is not present so the assistive text is read by screen readers but isn't displayed. When `heading-visible` is present, the assistive text is read by screen readers and displayed.

This example sets custom assistive text for a heading, specifies `heading-level` to change the rendered `aria-level`, and makes the heading visible.

```html
<template>
  <lightning-tabset heading-label="Example tabset" heading-level="3" heading-visible>
    <lightning-tab label="Item One"> One Content! </lightning-tab>
    <lightning-tab label="Item Two"> Two Content! </lightning-tab>
  </lightning-tabset>
</template>
```
