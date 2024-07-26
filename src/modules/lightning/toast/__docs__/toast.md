The `lightning/toast` module displays a toast notification with an icon, label, message, and links. Use a toast notification to convey small pieces of information to the user, such as providing feedback and confirmation after the user takes an action. You can set toast notifications to disappear after a certain duration or until the user clicks the close button.

### Show a Toast

To show a toast notification, call the function `show(config, comp)` from `lightning/toast` and provide a toast config and a reference to the local component as parameters. The function creates a single page-level toast container if one does not exist. See the `config` attributes section below for a list of properties to include in the config.

```javascript
import { LightningElement } from 'lwc';
import Toast from 'lightning/toast';

export default class MyComponent extends LightningElement {
    ...
    onClick() {
        ...
        Toast.show({
            label: 'This is a toast label which shows {0}, you can learn more about its accessibility from {1}',
            labelLinks : [{
                url: 'https://www.lightningdesignsystem.com/components/toast/',
                label: 'LDS link'
            }, {
                url: 'https://www.lightningdesignsystem.com/accessibility/guidelines/global-focus/#toasts',
                label: 'toast guideline'
            }],
            message: 'I want to show a {salesforceLink} and a {slackLink}',
            messageLinks: {
                salesforceLink: {
                    url: 'http://www.salesforce.com',
                    label: 'Salesforce link'
                },
                slackLink: {
                    url: 'https://slack.com',
                    label: 'Slack link'
                }
            },
            mode: 'sticky',
            variant: 'info'
        }, this);
    }
}
```

In this example, the toast configuration uses two ways to specify links (see note below). The toast displays a sticky mode informational toast message with a `label` string as the toast title and a `message` string as the toast message.  The `{0}`, `{1}`, `{salesforceLink}`, and `{slackLink}` placeholders are replaced with their `url` specified links.

A page-level [`ToastContainer` component](/docs/component-library/bundle/lightning-toast-container/documentation) manages and displays the toast component.

**_NOTE:_** `label` can have index-based or name-based link placeholders. In the case of index-based link placeholders, `labelLinks` must be defined as an array. Otherwise, `labelLinks` must be defined as individual objects. The same rules apply to `message`.

### Component Styling

`Toast` implements the [toast](https://www.lightningdesignsystem.com/components/toast/) blueprint in the Salesforce Lightning Design System (SLDS). [SLDS styling hooks](https://www.lightningdesignsystem.com/components/toast/#Styling-Hooks-Overview) aren't supported with programmatic creation of toasts via `Toast.show()`.

#### Small screen / Mobile environment

`Toast` is responsive to your screen resolution. For smaller screens or mobile environments, the toast's **icon** and **description** (text stored in `message`, and `messageLinks`, for example) is **not shown** due to the screen's width limitation (see [Toast blueprint screen variants](https://www.lightningdesignsystem.com/guidelines/messaging/components/toasts/#flavor-variants-screen).

On small screens and mobile environments, we recommend that you provide links in the toast's title using `label` and `labelLinks` in order to have links visible and interactive.

### `config` attributes

 Attribute | Description  |
|----------| ------------ |
| `label` (required) | Title of the toast. `label` can contain link placeholders in the form of `{0} ... {N}` (index-based) or `{name} ... {someOtherName}` (name-based). The placeholders are replaced with the links in `labelLinks`. |
| `labelLinks` | `[{url, label}]`, which replaces the `{0} ... {N}` index-based placeholders in `label` or `{ name: {url, label} }`, which replaces the `{name} ... {someOtherName}` named placeholders in `label`. |
| `message` | Description of the toast. `message` can contain link placeholders in the form of `{0} ... {N}` (index-based) or `{name} ... {someOtherName}` (name-based). The placeholders are replaced with the links on `messageLinks`. |
| `messageLinks` | `[{url, label}]`, which replaces the `{0} ... {N}` index-based placeholders in `message` or `{ name: {url, label} }`, which replaces the `{name} ... {someOtherName}` named placeholders in `message`. |
| `variant` | Appearance of the toast. |
| `mode` | Persistence of the toast. |

**_NOTE:_**  When `labelLinks` (or `messageLinks`) is passed to the `config` parameter, the content of `label` (or `message`) is rendered using [`lightning-formatted-rich-text`](https://developer.salesforce.com/docs/component-library/bundle/lightning-formatted-rich-text/documentation). Consult the documentation for expected styling when rendering a link.

#### `variant` attribute

The `variant` attribute sets the component's color and icon.

| Value | Color | Icon |
| --- | --- | --- |
| `info` (default) | grey | `utility:info`|
| `success` | green | `utility:success`|
| `warning` | orange | `utility:warning`|
| `error` | red | `utility:error`|

#### `mode` attribute

The `mode` attribute sets the component's dismissal.
-   `dismissible` - The component automatically disappears after a certain duration. The user can dismiss it early by clicking the close button. The time duration for `dismissible` is 4.8 seconds when the toast doesn't contain a link or 9.6 seconds if the toast contains a link.
-   `sticky` - The component stays on screen until the user clicks the close button.

If a `mode` value isn't provided, the default `mode` is determined by the value of `variant` and whether the `toast` has a link or links present in `label` or `message`.

| Variant | Has link? | Default Mode |
| --- | --- | --- |
| `info` | Yes| `sticky`|
| `info` | No | `sticky`|
| `success` | Yes | `sticky`|
| `success` | No | `dismissible`|
| `warning` | Yes | `sticky`|
| `warning` | No | `sticky`|
| `error` | Yes | `sticky`|
| `error` | No | `sticky`|
