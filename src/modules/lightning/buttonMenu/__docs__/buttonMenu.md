---
examples:
    - name: basic
      label: Simple Button Menus
      description: Button menu items can be disabled.
    - name: withIcon
      label: Button Menus Using Icons and Menu Alignment
      description: Button menus can display a utility icon next to the dropdown and change the menu alignment.
    - name: variants
      label: Button Menu Variants
      description: Button menus variants change the border style and size, or display with a dark background.
    - name: onselect
      label: Button Menu with Custom onselect Behavior
      description: Button menu with custom onselect handler.
---

A `lightning-button-menu` component represents a button that displays a
dropdown menu of actions or functions when you click it.

The menu closes when you click away from it, and it also closes and puts the
focus back on the button when you select a menu item.

Use [`lightning-menu-item`](bundle/lightning-menu-item/documentation) components nested in `lightning-button-menu` to specify the menu items for the button menu.

This example shows how to create a dropdown button menu with three items.

```html
<template>
    <lightning-button-menu alternative-text="Settings">
        <lightning-menu-item label="Font" value="font"> </lightning-menu-item>
        <lightning-menu-item label="Size" value="size"> </lightning-menu-item>
        <lightning-menu-item label="Format" value="format">
        </lightning-menu-item>
    </lightning-button-menu>
</template>
```

To add a text label to the button before the icon, use the `label` attribute.

The `lightning-button-menu` component supports several variants that change the look of the button. You can use a combination of the `variant`, `icon-name`, and `icon-size` attributes to customize the button and icon styles.

For more information, see the **Component Styling** section.

#### Checked Menu Items

You can create menu items that can be checked or unchecked using the `checked`
attribute in the `lightning-menu-item` component, toggling it as needed. To
enable toggling of a menu item, you must set an initial value on the `checked`
attribute, specifying either `true` or `false`.

#### Create Dividers and Subheadings

Use the [`lightning-menu-divider`](bundle/lightning-menu-divider/documentation) component to create a dividing line after a menu item.

Use the [`lightning-menu-subheader`](bundle/lightning-menu-subheader/documentation) component to create subheadings in the list of menu items.

#### Generate Menu Items

This example creates a button menu with several items during initialization. The `items` array definition uses the `@track` decorator to track mutations in the array. If the value of `items` changes, the component's template rerenders.

```html
<template>
    <lightning-button-menu
        alternative-text="Action"
        onselect={handleMenuSelect}
    >
        <template for:each={items} for:item="action">
            <lightning-menu-item
                id="action-id"
                label={action.label}
                value={action.value}
                key={action.label}
            >
            </lightning-menu-item>
        </template>
    </lightning-button-menu>
</template>
```

Define `items` and handle the `select` event in your JavaScript code.

```javascript
import { LightningElement, track } from 'lwc';

export default class DemoButtonMenu extends LightningElement {
    @track
    items = [
        {
            id: 'menu-item-1',
            label: 'Alpha',
            value: 'alpha',
        },
        {
            id: 'menu-item-2',
            label: 'Beta',
            value: 'beta',
        },
        {
            id: 'menu-item-3',
            label: 'Gamma',
            value: 'gamma',
        },
    ];

    handleMenuSelect(event) {
        // retrieve the selected item's value
        const selectedItemValue = event.detail.value;

        // INSERT YOUR CODE HERE
    }
}
```

#### Show the Loading State of a Menu

The `is-loading` attribute enables you to show an activity indicator while the menu is loading. You can
use this attribute, for example, to inform users that the menu is working while generating a large list of menu items.
When `is-loading` is `true`, the menu shows a spinner.

Use `loading-state-alternative-text` along with `is-loading` to specify explanatory text such as "Loading menu..." or
"Please wait while items load".

#### Draft Indicators

Use the `is-draft` and `draft-alternative-text` attributes together to indicate that the button menu is in an unsaved state.
The draft indicator, an asterisk, is shown for the button menu when `is-draft` is `true`. The `draft-alternative-text` attribute
is required to provide text describing the reason the menu is considered in a draft state. The button menu draft state can
be used to show there is unsaved state or data that could be lost, for example if there's a user change in a customizable menu.

#### Component Styling

`lightning-button-menu` implements the [menus](https://www.lightningdesignsystem.com/components/menus/) blueprint in the Salesforce Lightning Design System (SLDS).

Use a combination of the `icon-name`, `icon-size`, and `variant` attributes to customize the button and icon styles.

##### Icons

By default, the button displays a utility:down icon to indicate the dropdown function.
Use the `icon-name` attribute to specify an optional [utility icon](https://www.lightningdesignsystem.com/icons/#utility)
to display in front of the utility:down icon. Use the `icon-size` attribute to change the icon size from the default size of `medium`.

When applying SLDS classes or icons, check that they are
available in the SLDS release tied to your org. The Lightning
Design System site shows the latest SLDS resources, which
become available only when the new release is available in your org.

##### Variants

Use the `variant` attribute with one of these values to apply styling.

-   `border` - Shows a gray border around the button's down arrow symbol. The area inside the border is transparent and clickable. This is the default variant and doesn't need to be specified.
-   `border-inverse` - Same as the `border` variant except the down arrow is white so it's visible on dark backgrounds.
-   `border-filled` - Same as the `border` variant, except the area inside the border is filled with white.
-   `container` - Shows only the down arrow, without a visible border. The clickable area surrounding the down arrow is the same size as the default `border` variant and is transparent.
-   `bare` - Same as the `container` variant, except the clickable area surrounding the down arrow is smaller than the default.
-   `bare-inverse` - Same as the `bare` variant except the down arrow is white so it's visible on dark backgrounds.

##### Sizes

Adjust the button and icon sizes using the `size` attribute with one of these values.

For `bare` and `bare-inverse` variants:

-   `medium` is the default size, which creates a 14px by 14px icon
-   `small` creates a 12px by 12px icon
-   `x-small` creates a 8px by 8px icon
-   `large` creates a 24px by 24px icon

For other variants:

-   `medium` is the default size, which creates a 32px by 32px button enclosing a 14px by 14px icon.
-   `small` creates a 24px by 24px button enclosing a 14px by 14px icon
-   `x-small` creates a 20px by 20px button enclosing a 12px by 12px icon
-   `xx-small` creates a 16px by 16px button enclosing a 8px by 8px icon

##### Customize Component Styling

To apply additional styling, use the SLDS [utility classes](https://www.lightningdesignsystem.com/utilities/alignment) with the `class` attribute.

This example adds padding around the button menu using an SLDS class.

```html
<lightning-button-menu
    class="slds-p-around_medium"
    alternative-text="Show menu"
>
    <lightning-menu-item value="Edit" label="Edit"></lightning-menu-item>
    <lightning-menu-item value="Save" label="Save"></lightning-menu-item>
</lightning-button-menu>
```

To apply custom styling, use the `:host` selector or define a custom class using the `class` attribute.

```html
<lightning-button-menu class="my-button-menu" alternative-text="Show menu">
    <lightning-menu-item value="Edit" label="Edit"></lightning-menu-item>
    <lightning-menu-item value="Save" label="Save"></lightning-menu-item>
</lightning-button-menu>
```

Use SLDS styling hooks to customize the component's styles. For example, specify the background color on the button using the `sds-c-button-color-background` custom property.

```css
.my-button-menu {
    --slds-c-button-color-background: orange;
}
```

`lightning-button-menu` contains the same customizable elements as `lightning-button`, which supports `--slds-c-button-*` custom properties.

Custom properties for button menus work only with particular `lightning-button-menu` variants.

| CSS Custom Property               | `lightning-button-menu` Variants                                                                            |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `--slds-c-button-color-background` | `border` (default), `bare`, `bare-inverse`, and `container`                                                 |
| `--slds-c-button-color-border`     | `bare`, `bare-inverse`, and `container`                                                                     |
| `--slds-c-button-text-color`       | `border` (default), `bare`, `bare-inverse`,`container`, and `border-filled`; use with the `label` attribute |
| `--slds-c-button-text-color-*`     | `border` (default), `bare`, `container`, and `border-filled`                                                |
| `--slds-c-button-radius-border`    | all                                                                                                         |
| `--slds-c-button-sizing-border`    | `bare`, `bare-inverse`, `border-inverse` and `container`                                                    |

See [Styling Hooks Overview](https://www.lightningdesignsystem.com/components/buttons/#Styling-Hooks-Overview) for a list of CSS custom properties.

For more information, see [Style Components Using Lightning Design System Styling Hooks](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-css-custom-properties) in the Lightning Web Components Developer Guide.

To understand how we implemented SLDS in `lightning-button-menu`, see the **Source Code** section.

#### Usage Considerations

Icons are not available in Lightning Out, but they are available in Lightning Components for Visualforce and other experiences.

This component's menu items are created only if the button is
triggered. You can't reference the menu items during initialization
or if the button isn't triggered yet.

By default, the button menu renders above all modals and the main Salesforce header.

You can customize the alignment of the dropdown menu relative to the button using `menu-alignment`.
If you are using `lightning-button-menu` in a container that specifies the `overflow:hidden` CSS property,
setting `menu-alignment="auto"` ensures that the dropdown menu is not hidden from view when the menu is toggled. For mobile devices, set `menu-alignment="auto"` to ensure proper display of the menu.

When using this component within `lightning-button-group`, set `variant="border-filled"` on `lightning-button-menu` for a white button background. Otherwise, the `lightning-button-menu` background is transparent by default.

#### Accessibility

To inform screen readers that a button menu is disabled, set the `disabled`
attribute to `true`.

Buttons must have an accessible name to enable assistive technology to describe the button's purpose. Provide this name using the `alternative-text` or `label` attribute. Make it a clear action, such as "Show menu". To make the name available to assistive technology but hidden from view, use `alternative-text`.

`lightning-button-menu` is rendered with `aria-haspopup="true"` to indicate that the button opens a menu. The component also indicates whether the menu is currently expanded or collapsed using `aria-expanded="true"` or `aria-expanded="false"`.

For more information, see the [WAI-ARIA Specification](https://www.w3.org/TR/wai-aria/).

To display a contextual popup over the button menu, use the `tooltip` attribute.
The popup becomes visible when you hover over the button, or after the button receives keyboard focus. Showing the popup on hover or on keyboard focus ensures that all users can access it, even if they aren’t using a mouse.

If you use both `title` and `tooltip` attributes, they are both visible when you hover over the button. Some screen readers don’t support the `title` attribute and many of them don’t read the `title` attribute by default.

```html
<lightning-button-menu
    icon-name="utility:settings"
    title="Settings"
    tooltip="Choose a settings category"
    alternative-text="Hidden text for assistive technology"
>
</lightning-button-menu>
```

For sighted users, make sure your descriptions for `title` and `tooltip` are not repetitive. We recommend providing detailed information to `tooltip` and making `title` more concise if you use both.

If you use the `is-loading` indicator, use `loading-state-alternative-text` to provide a description for users of assistive devices.

If you use the `is-draft` indicator, use `draft-alternative-text` to provide a description for users of assistive devices.

#### Custom Events

**`select`**

The event fired when the menu is selected.

The `select` event returns the following parameter.

| Parameter | Type   | Description                       |
| --------- | ------ | --------------------------------- |
| value     | string | The value of the selected option. |

The event properties are as follows.

| Property   | Value | Description                                                                    |
| ---------- | ----- | ------------------------------------------------------------------------------ |
| bubbles    | false | This event does not bubble.                                                    |
| cancelable | true  | This event can be canceled. You can call `preventDefault()` on this event.     |
| composed   | false | This event does not propagate outside the template in which it was dispatched. |

**`open`**

The event fired when you open the dropdown menu in one of the following ways.

-   Tab to the button and press the Enter key
-   Click the button that toggles the dropdown menu

The `open` event does not return any parameters.

The event properties are as follows.

| Property   | Value | Description                                                                                                |
| ---------- | ----- | ---------------------------------------------------------------------------------------------------------- |
| bubbles    | false | This event does not bubble.                                                                                |
| cancelable | false | This event has no default behavior that can be canceled. You cannot call `preventDefault()` on this event. |
| composed   | false | This event does not propagate outside of the component in which it was dispatched.                         |

**`close`**

The event fired when you close the dropdown menu in one of the following ways.

-   Select or unselect a dropdown menu item
-   Click the button that toggles the dropdown menu
-   Remove focus from the dropdown menu, such as by clicking outside of the dropdown menu or tabbing to another element on the page

The `close` event does not return any parameters.

The event properties are as follows.

| Property   | Value | Description                                                                                                |
| ---------- | ----- | ---------------------------------------------------------------------------------------------------------- |
| bubbles    | false | This event does not bubble.                                                                                |
| cancelable | false | This event has no default behavior that can be canceled. You cannot call `preventDefault()` on this event. |
| composed   | false | This event does not propagate outside of the component in which it was dispatched.                         |
