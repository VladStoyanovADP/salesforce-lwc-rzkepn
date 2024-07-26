# Overlay

> Note: This component is not exposed for use by internal or external developers.

This is as low level in the overlay library as one can get. For this reason the documentation below is aimed at primarily `Lightning*` developers or those creating new overlay types. The overview examples would need much more to be fully accessible.

-   Simple: Contains no wrapping HTML only a host element.
    -   `<c-custom-overlay>`
-   Advanced: Contains a wrapping Component. Example: `LightningModal`.

## Creating a Simple Overlay

```js
import LightningOverlay from 'lightning/overlay';
import { instanceName } from 'lightning/overlayUtils';

class MyOverlay extends LightningOverlay {
    static [instanceName] = 'my-overlay';

    @api customProperty = 'Default';
}
```

Usage for the `MyOverlay` in a custom app would like like below.

```js
import { LightningElement } from 'lwc';
import MyOverlay from 'my/overlay';

class MyApp extends LightningElement {
    async handleClick() {
        const result = await MyOverlay.open({
            customProperty: 'Hello World!';
        });
        console.log(result);
    }
}
```

## Creating an Wrapping Component

Other scenarios require wrapping HTML around the overlay component. Most commonly this is used to position an element. A common example is `LightningModal`, but alternatively this can be used for writing a shared `LightningMenu`.

The `LightningMenuBase` component works as a wrapper.

```html
<template>
    <ul data-slot lwc:dom="manual"></ul>
</template>
```

```js

```

The `LightningMenu` now looks like...

```html

```

```js

```

Usage for the `MyMenu` in a custom app would like like below.

```html
<template>
    <button click={handleClick}>{label}</button>
</template>
```

```js
import { LightningElement, api } from 'lwc';
import MyMenu from 'my/overlay';

class MyButtonMenu extends LightningElement {
    @api label = 'Dropdown';

    async handleClick(e) {
        const result = await MyMenu.open({
            source: e.target,
            options: ['Item 1'];
        });
        // The selected item
        console.log(result);
    }
}
```
