import { readonly } from 'lwc';

class LightningContextWireAdapter {
    // context and data callback should be set.
    contextValue = null;
    _dataCallback;

    update(_config, context) {
        if (context) {
            // we only care about the context, no config is expected or used
            if (!hasOwnProperty.call(context, 'value')) {
                throw new Error(`Invalid context provided`);
            }
            this.contextValue = context.value;
            this._dataCallback(this.contextValue);
        }
    }

    connect() {
        // noop
    }
    disconnect() {
        // noop
    }
    static contextSchema = { value: 'required' /* could be 'optional' */ };
}

export function createV2ContextAdapter(ctor) {
    return class extends LightningContextWireAdapter {
        constructor(dataCallback) {
            super();
            this.contextValue = readonly(ctor.getDefaultContext());
            this._dataCallback = dataCallback;
            this._dataCallback(this.contextValue);
        }
    };
}
