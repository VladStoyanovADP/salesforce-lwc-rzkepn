The `lightning/ariaObserver` module provides an easy way for users to write accessible component that works in both synthetic and native shadow.

## Aria ID referencing in native shadow
Use the `AriaObserver` library to write accessible component that works where `ariaLabelledBy` would break native shadow.

Here's an example that won't work with native shadow. In the following code, we support attribute `ariaLabelledBy` in our component `c-foo`, so the `input` element is labelled by external elements.

``` html
<template>
    <input aria-labelledby={ariaLabelledBy}>
</template>
```

```
class Foo extends LightningElement {
    @api ariaLabelledBy;
}
```

This example uses the `aria-labelledby` attribute to use the internal input as an external label in `c-foo`.

``` html
<span id="my-label">Input field</span>
<c-foo aria-labelledby="my-label"></c-foo>
```

The above example works fine in synthetic shadow, but in native shadow mode, the `aria-labelledby` ID reference is broken. The `input` element is isolated in its own shadow DOM, so the label with id `my-label` isn't in the same shadow boundary.

## Creating AriaObserver

To use `AriaObserver` in your component, first import it from `lightning/ariaObserver`. Then, instantiate the `AriaObserver` within your component.

The `AriaObserver` constructor takes one parameter:
- `cmpReference` The reference of the current component (`this`).

``` js
import AriaObserver from 'lightning/ariaObserver';

class Foo extends LightningElement {
    constructor() {
        super();
        this.ariaObserver = new AriaObserver(this);
    }
}
```

Next, use the `connect(options)` method to connect between the internal element and the external reference. It takes an options object with the following keys:
- `attribute` The name of the aria attribute. Two supported options: `aria-labelledby`, `aria-describedby`, `aria-activedescendant` and `aria-controls`.
- `targetSelector` The selector to the internal element where the aria attribute should be attached.
- `targetNode` The element where the aria attribute should be attached. If not provided, the `targetSelector` is used.
- `relatedNodeIds` ID(s) of the external element(s) to which the `targetNode` will be related. Passed as a space separated string `id1 id2 id3` or an Array of strings `['id1', 'id2', 'id3']`. Combined with `relatedNodes` if both are present.
- `relatedNodes` An Array of HTMLElement element(s) to which the `targetNode` will be related. Combined with `relatedNodeIds` if both are present.

This example uses `connect(options)` to display an aria label for the internal `input` element.
``` js
@api
get ariaLabelledBy() {
    return this._ariaLabelledBy;
}
set ariaLabelledBy(refs) {
    this._ariaLabelledBy = refs;

    this.ariaObserver.connect({
        targetSelector: 'input',
        attribute: 'aria-labelledby',
        relatedNodeIds: refs
    });
}
```

Then use the `sync(isNativeShadow)` method to synchronize the ID references when the template is re-rendered.
- `isNativeShadow` An optional parameter that indicates whether the relationships involve components rendered in native shadow.
Used when the `targetSelector` or `targetNode` is within a shadow boundary, but the parent component where AriaObserver has been
instantiated is not. Example: `lightning-primitive-input-simple` may be rendered in native shadow, but `lightning-input` may not be.

It is important to protect the call to `sync` by checking if the component `isConnected`. This is because there are some cases where a component may be rendered but not connected and calling `sync` when a component is not connected will fail. 

``` js
renderedCallback() {
    if (this.isConnected) {
        this.ariaObserver.sync();
    }
}
```

When the containing component is native shadow enabled, AriaObserver observes the component's root node to find and link
the related elements. This can be overridden in cases where the component's root node does not contain the related elements,
but one of its ancestor nodes does. For example, `lightning-base-combobox` is contained within `lightning-combobox` so the root of `lightning-combobox` should be used in place of the root of `lightning-base-combobox`. It is important to protect this assignment by checking if `ariaObserver` is defined. This is because the root node setters can be called after `ariaObserver` is set to `undefined` in the `disconnectedCallback`.

```js
    if (this.ariaObserver) {
        this.ariaObserver.root = parentRootNode;
    }
```

Finally, disconnect the aria observer and free the resources at the end of the component lifecycle.

``` js
disconnectedCallback() {
    if (this.ariaObserver) {
        this.ariaObserver.disconnect();
        this.ariaObserver = undefined;
    }
}
```

Here is all these steps combined into a complete example of a component using `AriaObserver`.

``` html
<template>
    <!-- element where the aria attribute is attached -->
    <input>
</template>
```

``` js
import {api, LightningElement} from 'lwc';
import AriaObserver from 'lightning/ariaObserver';

export default class Foo extends LightningElement {
    constructor() {
        super();
        this.ariaObserver = new AriaObserver(this);
    }

    _ariaLabelledBy = '';

    @api
    get ariaLabelledBy() {
        return this._ariaLabelledBy;
    }
    set ariaLabelledBy(refs) {
        this._ariaLabelledBy = refs;

        /* Establish the connection between input and the external label */
        this.ariaObserver.connect({
            targetSelector: 'input',
            attribute: 'aria-labelledby',
            relatedNodeIds: refs
        });
    }

    renderedCallback() {
        if (this.isConnected) {
            this.ariaObserver.sync();
        }
    }

    disconnectedCallback() {
        if (this.ariaObserver) {
            this.ariaObserver.disconnect();
            this.ariaObserver = undefined;
        }
    }
}
```

Supported attributes:
- `aria-labelledby`
- `aria-describedby`
- `aria-activedescendant`
- `aria-controls`
