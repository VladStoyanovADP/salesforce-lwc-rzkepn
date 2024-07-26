---
examples:
    - name: base
      label: Navigate Using a Link
      description: Use breadcrumbs to note the path of a record and help the user to navigate back to the parent.
    - name: withOnclick
      label: Navigate Using the onclick Handler
      description: Using the onclick handler enables you to navigate programmatically using JavaScript.
    - name: withIteration
      label: Generate Breadcrumbs with for:each
      description: Use for:each to iterate over a list of items to generate the breadcrumbs.
---

A `lightning-breadcrumbs` component is an ordered list that displays the path
of a page and helps you navigate back to the parent. Each breadcrumb item is
represented by a `lightning-breadcrumb` component. Breadcrumbs are actionable
and separated by a greater-than sign.

For more information, see the [`lightning-breadcrumb`](bundle/lightning-breadcrumb) documentation.

#### Component Styling

`lightning-breadcrumbs` implements the
[breadcrumbs](https://www.lightningdesignsystem.com/components/breadcrumbs/) blueprint in the Salesforce Lightning Design System (SLDS).

To apply additional styling, use the SLDS [utility classes](https://www.lightningdesignsystem.com/utilities/alignment) with the `class` attribute.

This example adds a margin around the breadcrumbs using an SLDS class.

```html
<lightning-breadcrumbs class="slds-m-around_small">
    <lightning-breadcrumb
        label="Parent Account"
        href="http://example.com/parent"
    >
    </lightning-breadcrumb>
    <lightning-breadcrumb label="Case" href="http://example.com/case">
    </lightning-breadcrumb>
</lightning-breadcrumbs>
```

Use SLDS styling hooks to customize the component's styles. For example, adjust the spacing before and after the greater-than sign using the `--slds-c-breadcrumbs-*` custom properties.

```css
.my-breadcrumbs {
    --slds-c-breadcrumbs-spacing-inlineend: 20px;
    --slds-c-breadcrumbs-spacing-inlinestart: 30px;
}
```

See [Styling Hooks Overview](https://www.lightningdesignsystem.com/components/breadcrumbs/#Styling-Hooks-Overview) for a list of CSS custom properties.

For more information, see [Style Components Using Lightning Design System Styling Hooks](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-css-custom-properties) in the Lightning Web Components Developer Guide.

#### Accessibility

`lightning-breadcrumbs` renders with `role="navigation"`, which is a landmark role that enables screen readers to provide keyboard navigation to the links on the breadcrumbs.
The `aria-label="Breadcrumbs"` property is rendered automatically to inform screen readers the navigation type. Screen readers read both the role and the label description.

If your page includes another navigation landmark besides the breadcrumbs, you can use a different label for the other navigation landmark. Updating the `aria-label` property on `lightning-breadcrumbs` is currently not supported.

The last breadcrumb item usually corresponds to the current page a user is viewing.
This breadcrumb item renders with `aria-current="page"`, which is announced by the screen reader as the current page within a set of navigation links.
