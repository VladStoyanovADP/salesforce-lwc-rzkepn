# Message Dispatcher

`lightning/messageDispatcher` enables your component to communicate with an iframe. It's supported on the Salesforce platform and outside the platform.

Import functions from the `lightning/messageDispatcher` module.

```js
import {
    registerMessageHandler,
    unregisterMessageHandler,
    createMessage,
    postMessage,
} from 'lightning/messageDispatcher';
```

For examples, see the `lightning-map` and `lightning-lookup-address` components.

Additionally, `one:iframeMessageManager` handles all event post from the iframe. It uses `lightning/messageDispatcher` to dispatch to a component.
