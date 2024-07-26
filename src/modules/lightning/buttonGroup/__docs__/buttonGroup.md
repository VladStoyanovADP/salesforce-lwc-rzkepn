---
examples:
    - name: basic
      label: Basic Button Groups
      description: Several button groups demonstrating default simple buttons, buttons with icons and variants, and a diverse set of button types contained in a single button group.
    - name: disabled
      label: Button Groups with Disabled Buttons
      description: Button groups containing disabled buttons, which are grayed out and can't be clicked. Buttons are disabled individually.
    - name: inverse
      label: Button Groups with Inverse Buttons
      description: Group of buttons that set the inverse variant, which displays with a dark background. The variant is set on each button.
    - name: withMenu
      label: Button Group with a Dropdown Menu
      description: This button group includes a lightning-button-menu as the last button, to provide a dropdown menu.
    - name: withMenuDisabled
      label: Button Group with a Disabled Dropdown Menu
      description: This button group's dropdown menu is disabled and can't be clicked.
---

A `lightning-button-group` component represents a set of buttons that can be displayed together to create a navigational bar. The body of the component can contain one or more of the following components:

-   `lightning-button`
-   `lightning-button-icon`
-   `lightning-button-icon-stateful`
-   `lightning-button-menu`
-   `lightning-button-stateful`.

If navigational tabs are needed, use `lightning-tabset` instead of `lightning-button-group`.

Set `variant="border-filled"` on `lightning-button-menu` for a white button background. Otherwise, the `lightning-button-menu` background is transparent by default.

To create buttons, use the `lightning-button` component as shown in this example.

```html
<template>
    <lightning-button-group>
        <lightning-button label="Alpha"></lightning-button>
        <lightning-button label="Beta"></lightning-button>
        <lightning-button label="Gamma"></lightning-button>
    </lightning-button-group>
</template>
```

Handle clicks using the `onclick` handler.

```html
<lightning-button-group>
    <lightning-button label="Edit" onclick={handleClick}></lightning-button>
    <lightning-button label="View" onclick={handleClick}></lightning-button>
</lightning-button-group>
```

In your JavaScript code, use the `event.target` property to retrieve the clicked button.

```javascript
import { LightningElement } from 'lwc';

export default class DemoApp extends LightningElement {
    handleClick(event) {
        const buttonLabel = event.target.label;
        //  Handle clicks
    }
}
```

To handle navigation within Lightning Experience and the Salesforce app, use the `lightning-navigation` component.

#### Component Styling

`lightning-button-group` implements the [button groups](https://www.lightningdesignsystem.com/components/button-groups/) blueprint in the Salesforce Lightning Design System (SLDS).

To apply additional styling, use SLDS [utility classes](https://www.lightningdesignsystem.com/utilities/alignment) with the `class` attribute.

You can customize the `lightning-button-*` base components you use within `lightning-button-group` using SLDS styling hooks. For more information, see the corresponding base component documentation.

#### See Also

[lightning-navigation](bundle/lightning-navigation/documentation)

[Navigate to Pages](https://developer.salesforce.com/docs/platform/lwc/guide/use-navigate)
