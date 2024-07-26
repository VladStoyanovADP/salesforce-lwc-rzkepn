---
examples:
    - name: basic
      label: Pill Container
      description: A pill container showing pills that represent users.
---

A `lightning-pill-container` component represents a list of pills in a container
that resembles an input field. Use `lightning-pill-container` to display a user's
selections when filtering a list, such as from a multi-select picklist.

`lightning-pill-container` displays a pill using the `lightning-pill` component, which can display an icon or avatar next to the text label.

To specify the pills, set the `items` attribute to an array of values in your component's JavaScript.

By default, all pills in the container are displayed and wrap to additional lines if they can't fit on one line.
For information about changing the behavior, see **Managing Pill Layout in the Container**.

This example creates three pills: a text-only pill, a pill with a link and an avatar, and
a pill with an icon.

```html
<template>
    <lightning-pill-container items={items}> </lightning-pill-container>
</template>
```

```javascript
import { LightningElement } from 'lwc';

export default class PillContainerExample extends LightningElement {
    items = [
        {
            label: 'My Pill',
            name: 'mypill',
        },
        {
            type: 'avatar',
            label: 'Avatar Pill',
            href: 'https://www.example.com',
            name: 'avatarpill',
            src: '/my/path/avatar.jpg',
            fallbackIconName: 'standard:user',
            variant: 'circle',
            alternativeText: 'User avatar',
        },
        {
            type: 'icon',
            label: 'Icon Pill',
            name: 'iconpill',
            iconName: 'standard:account',
            alternativeText: 'Account',
        },
    ];
}
```

A text-only pill supports the following attributes. These attributes can also
be used to create a pill with an avatar or icon.

-   `label`: Required. The text label that displays in the pill.
-   `name`: The name for the pill. This value is optional and can be used to identify the pill in a callback.

To create a pill with a link, use the following attribute.

-  `href`: Required. The URL for the link.

To create a pill with an avatar, use the following attributes.

-   `type`: The media type. Use `avatar`.
-   `src`: Required. The URL of the avatar.
-   `fallbackIconName`: The Lightning Design System name of the icon to use as a fallback when the image fails to load. Names are written in the format 'standard:account' where 'standard' is the category, and 'account' is the specific icon to be displayed. Only icons from the standard and custom categories are allowed.
-   `variant`: Changes the shape of the avatar. Valid values are empty, circle, and square. This value defaults to square.
-   `alternativeText`: The alternative text used to describe the avatar, which is displayed as hover text on the image.

To create a pill with an icon, use the following attributes.

-   `type`: The media type. Use `icon`.
-   `iconName`: Required. The Lightning Design System name of the icon. Names are written in the format 'utility:down' where 'utility' is the category, and 'down' is the specific icon to be displayed. Only utility icons can be used for the `iconName`.
-   `alternativeText`: The alternative text used to describe the icon. Describe what happens when you click the button, for example 'Upload File', not what the icon looks like, 'Paperclip'.

`lightning-pill-container` provides two variants: `bare` and `standard` (default). They’re visually the same. However, the `standard` variant renders pills in an unordered list element. For more information, see the **Accessibility** section.

#### Removing Pills

Clicking the remove button triggers the `onitemremove` handler.

```html
<template>
    <lightning-pill-container items={items} onitemremove={handleItemRemove}>
    </lightning-pill-container>
</template>
```

You can retrieve the name of the pill that's clicked in the event handler and
remove the pill from view.

```javascript
import { LightningElement, track } from 'lwc';

export default class PillContainerRemoveExample extends LightningElement {
    @track items = [
        {
            label: 'My Pill',
            name: 'mypill',
        },
        {
            type: 'avatar',
            label: 'Avatar Pill',
            name: 'avatarpill',
            src: '/my/path/avatar.jpg',
            fallbackIconName: 'standard:user',
            variant: 'circle',
            alternativeText: 'User avatar',
        },
        {
            type: 'icon',
            label: 'Icon Pill',
            name: 'iconpill',
            iconName: 'standard:account',
            alternativeText: 'Account',
        },
    ];

    handleItemRemove(event) {
        const name = event.detail.item.name;
        alert(name + ' pill was removed!');
        const index = event.detail.index;
        this.items.splice(index, 1);
    }
}
```

#### Managing Pill Layout in the Container

Several boolean attributes let you control the layout of pills in the container. These attributes are
set to false by default, which makes all pills display and wrap to multiple lines.

- `is-collapsible`: Determines whether the list of pills can be expanded and collapsed. If `is-collapsible` is true, `is-expanded` can determine whether a pill list displays all the pills or one line of pills. If `is-collapsible` is false or not specified, the `is-expanded` attribute has no effect regardless of its value.
- `is-expanded`: Determines whether the full list of pills is shown. Set `is-collapsible` to true if you want to set `is-expanded` to expand and collapse the list. If you set `is-expanded` to false and don't set `is-collapsible` to true, the list is expanded.
- `single-line`: Specifies that the pill container can display one line of pills. By default, if pills can't fit on one line, they’re wrapped to additional lines to fit the container. Set `single-line` to true to limit pill display to one line. This attribute overrides `is-collapsible` and `is-expanded`.

If all pills aren't displayed, the component shows a text button indicating how many more pills there are.
For example, if there are five more pills that aren’t displayed, the text button shows `+5 more`. The text button fires the `focus` event when you click it.

To display a long list of pills as collapsed, set `is-collapsible` to true and optionally set `is-expanded` to false. Otherwise, pills are displayed expanded.

##### Expand and Collapse Pills Programmatically

Use `is-collapsible` and `is-expanded` to programmatically expand and collapse the pills.

This example sets `is-collapsible` and uses a button to change the value of `is-expanded`.

```html
<template>
    <div style="width: 600px">
            <lightning-pill-container
                items={items}
                is-collapsible
                is-expanded={isExpanded}
            >
            </lightning-pill-container>
    </div>
    <lightning-button onclick={setExpanded} label="Expand and Collapse"></lightning-button>
</template>
```

The list of pills is initially collapsed. The button expands and collapses the list.

```javascript
import { LightningElement } from 'lwc';

export default class PillContainerCanCollapse extends LightningElement {
    isExpanded = false;

    setExpanded(event){
        this.isExpanded = !this.isExpanded ;
    }

    items = [
        {
        //define the pills
        }
    ];
}
```
##### Display All Pills With the `+n more` Button

If all pills aren't displayed, the component shows a text button labeled `+n more` to indicate more pills can be displayed. By default, `lightning-pill-container` doesn’t handle the `focus` event that’s fired when you click the button. You can handle the event to display more pills or write logic to do something else when the button is clicked.

This example sets the pills to be collapsible but not expanded and handles the focus event.

```html
<template>
    <div style="width: 600px">
            <lightning-pill-container
                items={items}
                is-collapsible={collapsible}
	            is-expanded={expanded}
                onfocus={handlePillExpansion}
            >
            </lightning-pill-container>
    </div>
  </template>
  ```

The list of pills is initially collapsed. When there are too many pills to be displayed, the text button labeled `+n more` displays. The handler for the `focus` event enables all the pills to display.

```javascript
import { LightningElement } from 'lwc';

export default class PillContainerMoreButtonExpands extends LightningElement {
    collapsible = true;
	expanded = false;

handlePillExpansion(){
    this.expanded = true;
}

    items = [
        {
        //define the pills
        }
    ];
}
```

#### Component Styling

`lightning-pill-container` implements the
[Pills with Container](https://lightningdesignsystem.com/components/pills/#Pill-with-Container) blueprint in the
Salesforce Lightning Design System (SLDS) for the `base` variant.

`lightning-pill-container` implements the
[Listbox of Pill Options](https://www.lightningdesignsystem.com/components/pills/#Listbox-Of-Pill-Options) blueprint in the
Salesforce Lightning Design System (SLDS) for the `standard` variant.

To apply additional styling, use the SLDS [utility classes](https://www.lightningdesignsystem.com/utilities/alignment) with the `class` attribute.

To apply custom styling, use the `:host` selector or define a custom class using the `class` attribute. Use SLDS styling hooks to customize the component's styles.

`lightning-pill-container` renders pills using `lightning-pill`. Use the `--slds-c-pill-*` custom properties on `lightning-pill`.

Custom properties for pill containers work only with particular `lightning-pill-container` variants for the remove button.

| CSS Custom Property                     | `lightning-pill-container` Variants |
| --------------------------------------- | ----------------------------------- |
| `--slds-c-icon-color-background`         | `standard` (default)                |
| `--slds-c-icon-color-foreground-default` | `standard` (default)                |
| `--slds-c-button-color-background`       | `bare`                              |
| `--slds-c-button-color-border`           | `bare`                              |
| `--slds-c-button-radius-border`          | `bare`                              |
| `--slds-c-button-sizing-border`          | `bare`                              |

See [Styling Hooks Overview](https://www.lightningdesignsystem.com/components/pills/#Styling-Hooks-Overview) for a list of CSS custom properties.

For more information, see [Style Components Using Lightning Design System Styling Hooks](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-css-custom-properties) in the Lightning Web Components Developer Guide.

To understand how we implemented SLDS in `lightning-pill-container`, see the **Source Code** section.

#### Accessibility

By default, `lightning-pill-container` renders pills using the `standard` variant, which uses an unordered list element to display pills. Press the Tab key to focus on the first pill and use the Left Arrow and Right Arrow keys to navigate through the pills. Use the Tab key to navigate to the remove button in a pill with a link. Use arrow keys to navigate between pills.
The focus goes to a link if present, otherwise focus goes to the remove button.

The `bare` variant only supports the Tab key for navigating between focusable elements in the container's pills. The arrow keys aren't supported.

On mobile devices, both container variants display pills with the close button as a focusable element for accessibility.

To remove a pill, press Enter or the space bar when the pill's remove button receives focus. On mobile devices, you can tap the remove button to remove a pill.

For pills with links, use the Tab key or arrow keys to focus on the pill's link, then press Enter to navigate to the link target. If you don't navigate away from the pill, tabbing again puts focus on the remove button.

#### Custom Events

**`itemremove`**

The event fired when a pill is removed.

The `itemremove` event returns the following parameters.

| Parameter | Type   | Description                            |
| --------- | ------ | -------------------------------------- |
| item      | string | The name of the pill that's removed.   |
| index     | number | The position of the pill in the array. |

The event properties are as follows.

| Property   | Value | Description                                                                    |
| ---------- | ----- | ------------------------------------------------------------------------------ |
| bubbles    | false | This event does not bubble.                                                    |
| cancelable | true  | This event can be canceled. You can call `preventDefault()` on this event.     |
| composed   | false | This event does not propagate outside the template in which it was dispatched. |
