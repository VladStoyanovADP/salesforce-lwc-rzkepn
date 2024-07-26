---
examples:
    - name: basic
      label: Basic Pills
      description: Pills can include links and use a handler for the remove button (X).
    - name: avatarPill
      label: Pill With an Avatar
      description: A pill includes an avatar by nesting a lightning-avatar component.
    - name: iconPill
      label: Pill With an Icon
      description: A pill includes an icon by nesting a lightning-icon component.
    - name: errorPill
      label: Pill With an Error
      description: A pill indicates an error condition by specifying the has-error attribute.
---

A `lightning-pill` component represents an item, such as an account name or
case number. By default, pills are rendered with a remove button. They’re useful for displaying read-only text that can be added and removed on demand, for example, a list of email addresses or a list of keywords.

This example creates a basic pill with a link.

```html
<template>
    <lightning-pill
        label="Pill Label"
        href="https://www.example.com"
        onremove={handleRemove}
    >
    </lightning-pill>
</template>
```

URLs without a protocol use the host domain's protocol. For example, `www.example.com` is prefixed with `https://` if the host domain's protocol is `https://`.

#### Inserting an Icon or Avatar

A pill can contain an icon or avatar to represent the type of object. Nest a `lightning-icon` or `lightning-avatar` component inside the `lightning-pill` component.

Insert an icon on the pill using `lightning-icon`. For more information, see [lightning-icon](bundle/lightning-icon/documentation).

```html
<template>
    <lightning-pill
        name="account"
        label="Pill Label"
        href="https://www.example.com"
    >
        <lightning-icon icon-name="standard:account" alternative-text="Account">
        </lightning-icon>
    </lightning-pill>
</template>
```

Insert an avatar on the pill using `lightning-avatar`. For more information, see [lightning-avatar](bundle/lightning-avatar/documentation).

```html
<template>
    <lightning-pill name="user" label="User Name">
        <lightning-avatar
            src="https://www.lightningdesignsystem.com/assets/images/avatar2.jpg"
            fallback-icon-name="standard:user"
            alternative-text="User avatar"
            variant="circle"
        ></lightning-avatar>
    </lightning-pill>
</template>
```

#### Interacting with Pills

A pill has three clickable elements.

-   The optional icon or avatar
-   The text label
-   The remove button

All three elements trigger the `onclick` handler when clicked. If you provide an `href` value, clicking the text label triggers the `onclick` handler and then takes you to the provided path.

Clicking the remove button on the pill fires the `remove` event and then the `click` event. Use the optional `onremove` and `onclick` handlers to remove the pill and perform an action. You must hide or remove the pill on your own using the `onremove` handler, as shown in the example below. If you don't specify a pill removal behavior, clicking the remove button doesn't have a visible effect.

When an `href` value is present, clicking the text label navigates to a link, but clicking the icon or avatar doesn’t. To prevent your browser from navigating to a link when you click a pill's label, call `event.preventDefault()` in the `onclick` handler.

When an `href` value is present, the default variant is `link`. If no `href` is present, the default variant is `plain`.

To disable a pill's link, set `variant="plain"`, which removes the anchor element. The `plain` variant renders the pill without a link and ignores the `href` attribute.

This example hides a pill when the remove button is clicked.

```html
<template>
    <template if:true={showPill}>
        <lightning-pill
            label="Account"
            href="https://www.example.com"
            onremove={handleRemoveOnly}
            onclick={handleClick}
        >
        </lightning-pill>
    </template>
</template>
```

To prevent navigating to the link when the remove button is clicked, call `event.preventDefault()` in the `onremove` handler. The `click` event is still fired when you click the text label. However, calling `event.preventDefault()` in the `onremove` handler prevents the `click` event from firing when you click the remove button.

```javascript
import { LightningElement } from 'lwc';
export default class PillRemoveExample extends LightningElement {
    showPill = true;

    handleRemoveOnly(event) {
        event.preventDefault();
        this.showPill = !this.showPill;
    }

    handleClick(event) {
        // this won't run when you click the remove button
        alert('The pill was clicked!');
    }
}
```

#### Displaying an Error

Display a pill in an error state when the containing text doesn't match a
pre-defined collection of items, such as when an email address is invalid or a
case number doesn't exist.

Use the `has-error` attribute to denote an error on a pill. This attribute inserts an error icon next to the label and changes the label text to red. Providing an icon or avatar in this context has no effect on the pill; the error icon is still displayed.

```html
<template>
    <lightning-pill
        label="Pill with error"
        href="https://www.example.com"
        has-error
    >
    </lightning-pill>
</template>
```

#### Component Styling

`lightning-pill` implements the
[pills](https://www.lightningdesignsystem.com/components/pills) blueprint in the
Salesforce Lightning Design System (SLDS).

##### Customize Component Styling

To apply additional styling, use the SLDS [utility classes](https://www.lightningdesignsystem.com/utilities/alignment) with the `class` attribute.

This example adds padding on the left of the second pill using an SLDS class.

```html
<lightning-pill label="Astro"></lightning-pill>
<lightning-pill label="Codey" class="slds-p-left_x-small"></lightning-pill>
```

To apply custom styling, define a custom class using the `class` attribute.

```html
<lightning-pill label="Astro" class="my-pill"></lightning-pill>
```

Use SLDS styling hooks to customize the component's styles. For example, specify the background color on the pill using the `--slds-c-pill-color-background` custom property.

```css
.my-pill {
    --slds-c-pill-color-background: orange;
}
```

Additionally, the remove button contains customizable elements similar to `lightning-button-icon`. You can customize the styles on the remove button using the `--slds-c-button-*` custom properties. See the [lightning-button-icon documentation](bundle/lightning-button-icon/documentation).

See [Styling Hooks Overview](https://www.lightningdesignsystem.com/components/pills/#Styling-Hooks-Overview) for a list of CSS custom properties.

For more information, see [Style Components Using Lightning Design System Styling Hooks](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-css-custom-properties) in the Lightning Web Components Developer Guide.

To understand how we implemented SLDS in `lightning-pill`, see the **Source Code** section.

#### Usage Considerations

Icons are not available in Lightning Out, but they are available in Lightning Components for Visualforce and other experiences.

To create more than one pill, use the `lightning-pill-container` component, which gives you access to the pill array via the `itemremove` event.

Specifying a target to change where the link should open is not supported. The link opens on the same tab or window. To create a URL that navigates to another page in Salesforce, use
[`lightning-navigation`](bundle/lightning-navigation/documentation).

This component has usage differences from its Aura counterpart. See [Base Components: Aura Vs Lightning Web Components](https://developer.salesforce.com/docs/platform/lwc/guide/migrate-map-aura-lwc-components) in the Lightning Web Components Developer Guide.

#### Accessibility

When using `lightning-avatar`, use the `alternative-text` attribute to describe the avatar, such as a user's initials or name. This description provides the value for the `alt` attribute in the `img` HTML tag.

When using `lightning-icon`, use the `alternative-text` attribute to describe the icon. For example, specify "Account" instead of "Pill icon". This description is used as assistive text on the pill.

Press the Tab key to move focus to a pill with a link, and tab again to move focus to the remove button. To remove a pill, press the Enter key or space bar when the focus is on the remove button. You can define your own behavior to remove the pill from view, such as using the `onremove` handler shown in **Interacting with Pills**. To navigate to the target of a link on a pill, press the Enter key when the focus is on the pill.

If a pill doesn't have a link, the only focusable item is the remove button.

#### Custom Events

**`remove`**

The first event fired when you click the remove button.

The `remove` event returns the following parameter.

| Parameter | Type   | Description                          |
| --------- | ------ | ------------------------------------ |
| name      | string | The name of the pill that's removed. |

The event properties are as follows.

| Property   | Value | Description                                                                                                              |
| ---------- | ----- | ------------------------------------------------------------------------------------------------------------------------ |
| bubbles    | false | This event does not bubble.                                                                                              |
| cancelable | true  | This event can be canceled. You can call `preventDefault()` on this event to prevent the `click` event from being fired. |
| composed   | false | This event does not propagate outside the template in which it was dispatched.                                           |
