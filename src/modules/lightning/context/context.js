import { LightningElement, createContextProvider, readonly } from 'lwc';
import { createV2ContextAdapter } from './createContextWireAdapter';

// Per Context Component Constructor, track the metadata of the adapter
const ContextProviderMetaMap = new Map();
// Per Context Component Instance, track the current context data
const ContextDataMap = new WeakMap();

function getWireAdapterMeta(ctor) {
    let adapterMeta = ContextProviderMetaMap.get(ctor);
    if (adapterMeta === undefined) {
        const wireAdapter = createV2ContextAdapter(ctor);
        const contextualizer = createContextProvider(wireAdapter);
        // name and adapter per constructor
        adapterMeta = {
            wireAdapter,
            contextualizer,
        };
        ContextProviderMetaMap.set(ctor, adapterMeta);
    }
    return adapterMeta;
}

function getContextData(eventTarget) {
    let contextData = ContextDataMap.get(eventTarget);
    if (contextData === undefined) {
        // collection of consumers' callbacks and default context value per provider instance
        contextData = {
            consumers: [],
            value: null, // initial value for an installed provider
        };
        ContextDataMap.set(eventTarget, contextData);
    }
    return contextData;
}

function setupNewContextProvider(target) {
    const { contextualizer } = getWireAdapterMeta(target.constructor);

    contextualizer(target, {
        consumerConnectedCallback(consumer) {
            // once the first consumer gets connected, then we create the contextData object
            const contextData = getContextData(target);
            // registering the new consumer
            contextData.consumers.push(consumer);
            // push the current value
            consumer.provide({ value: contextData.value });
        },
        consumerDisconnectedCallback(consumer) {
            const contextData = getContextData(target);
            const i = contextData.consumers.indexOf(consumer);
            if (i >= 0) {
                contextData.consumers.splice(i, 1);
            } else {
                throw new TypeError(`Invalid context operation in ${target}.`);
            }
        },
    });
}

function emitNewContextValue(target, newValue) {
    const contextData = getContextData(target);
    contextData.value = readonly(newValue);
    contextData.consumers.forEach((consumer) =>
        consumer.provide({ value: readonly(newValue) })
    );
}

export default class LightningContext extends LightningElement {
    constructor() {
        super();
        setupNewContextProvider(this);
    }

    setContext(newValue) {
        emitNewContextValue(this, newValue);
    }

    static get Provider() {
        return getWireAdapterMeta(this).wireAdapter;
    }

    static getDefaultContext() {
        return undefined;
    }
}
