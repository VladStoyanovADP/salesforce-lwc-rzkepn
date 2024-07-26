# Stacked Tab

A `lightning-stacked-tab` component keeps related content in a single container. The tab content displays when a user clicks the tab. Use `lightning-stacked-tab` as a child of the `lightning-stacked-tabset` component.

```html
<lightning-stacked-tabset>
    <lightning-stacked-tab label="Related"></lightning-stacked-tab>
    <lightning-stacked-tab label="Details"></lightning-stacked-tab>
</lightning-stacked-tabset>
```

The stacked tabs act as buttons. To support displaying tab content on mobile devices, we recommend sliding a tab content into view when a tab is clicked. The tab content should display a back button that returns you to the stacked tabs.

`lightning-stacked-tab` implements the [tabs (on mobile)](https://lightningdesignsystem.com/components/tabs/#On-Mobile) blueprint in the Salesforce Lightning Design System (SLDS).

## Attributes

Use the following attributes to customize `lightning-stacked-tab`.

| Attribute Name | Type   | Description                                                 |
| -------------- | ------ | ----------------------------------------------------------- |
| label          | string | The text to display on the tab.                             |
| icon-name      | string | The icon to display. The default is `utility:chevronright`. |

## Methods

**`focus()`**

Sets focus on the tab.
