# Context

`lightning/context` provides a way to pass data through the component tree without having to pass props down manually at every level.

Extend this module to provide arbitrary context that can be consumed via wire by any child Lightning web component.

`lightning/context` follows https://github.com/salesforce/lwc-rfcs/blob/master/text/0000-context-service.md.

### Usage

Create a new class that extends from `LightningContext` to provide a contextual `theme` value to all its children:

```js
// x/themeContext/themeContext.js

// Provider Definition
import LightningContext from 'lightning/context';

// LightningContext is abstract, is intended to be extended
export default class ThemeContext extends LightningContext {
    @api get theme() {
        return this.getContextValue();
    }

    set theme(v) {
        this.setContextValue(v);
    }
}
```

Any component with access to `<x-theme-context>` element can consume the `theme` value.

```js
// x/bar/bar.js

import ThemeContext from 'x/themeContext';

// Consumer
export default class XBar extends LightningElement {
    @wire(ThemeContext.Provider) x;
}
```

This means, any structure that involves `<x-theme-context>` and `<x-bar>` can share the `theme` value, e.g.:

```html
<template>
    <x-theme-context theme="dark">
        <x-bar></x-bar>
    </x-theme-context>
</template>
```

It means that `x-bar` or any of the descendants of `x-theme-context` can wire to `ThemeContext.Provider` to obtain the `theme value.

### Specification

-   By default, the provider accepts content in the form of the default slot.
-   A provider can redefine the default template.
-   When a provider that provides the context on connect, the consumer will have the context available during the first render.
-   When a provider does not provide the context on connect, the consumer will get null as context during first rendering
-   When a provider changes the context value, all consumers wired to it will receive an updated context.
-   The provider should be able to produce a context as `{ error }` to indicate that there was an error resolving the context data under certain circumstances.

-   The consumer can wire to a method in order to access the context data.
-   The consumer wired to a context provider that is not descendant of it in the DOM, will get the default context from provider (getDefaultContext()).
-   The consumer will receive the same context object reference regardless of how may times is connected/disconnected.
-   Two consumers wired to the same provider and descendant of it in the DOM, should receive the same context reference. Example:

```html
<x-provider>
    <x-consumer></x-consumer>
    <x-another-consumer></x-another-consumer>
</x-provider>
```

-   When there is two instances of the same provider in the same DOM hierarchy, a descendant consumer wired to the same provider class will use the context value of the closest provider instance up in the hierarchy. Example:

```html
<x-provider>
    <x-provider>
        <x-consumer></x-consumer>
    </x-provider>
</x-provider>
```

-   A consumer cannot modify the provided context.
