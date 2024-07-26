import formFactor from '@salesforce/client/formFactor';
import { shouldDispatchToApp } from './routingServiceUtils';
import { isCSR } from 'lightning/utilsPrivate';

const GET_LINK_INFO_EVENT = 'lightningroutingservicegetlinkinfo';
const LINK_PROVIDERS = new WeakMap();

export const urlTypes = {
    standard: 'standard_webPage',
};

export class LinkInfo {
    constructor(url, dispatcher) {
        this.url = url;
        this.dispatcher = dispatcher;
        Object.freeze(this);
    }
}

export function hasLinkProvider(element) {
    let { parentNode } = element;
    while (parentNode) {
        if (LINK_PROVIDERS.has(parentNode)) {
            return true;
        }
        parentNode = parentNode.parentNode;
    }
    return false;
}

export function isLinkProvider(element) {
    return LINK_PROVIDERS.has(element);
}

export function registerLinkProvider(element, providerFn) {
    let listeners = LINK_PROVIDERS.get(element);
    if (listeners === undefined) {
        listeners = new Set();
        LINK_PROVIDERS.set(element, listeners);
    }
    listeners.add(providerFn);
    element.addEventListener(GET_LINK_INFO_EVENT, providerFn);
}

export function unregisterLinkProvider(element, providerFn) {
    let listeners = LINK_PROVIDERS.get(element);
    if (listeners) {
        listeners.delete(providerFn);
        if (!listeners.size) {
            LINK_PROVIDERS.delete(element);
        }
    }
    element.removeEventListener(GET_LINK_INFO_EVENT, providerFn);
}

/*
 * Mock getLinkInfo
 *
 * @returns {Promise[LinkInfo]}
 */
export function getLinkInfo(element, stateRef) {
    return new Promise((resolve, reject) => {
        // eslint-disable-next-line lightning-global/no-custom-event-identifier-arguments
        const getLinkInfoEvent = new CustomEvent(GET_LINK_INFO_EVENT, {
            detail: {
                stateRef,
                callback: (err, linkInfo) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(linkInfo);
                    }
                },
            },
            bubbles: true,
            composed: true,
            cancelable: true,
        });
        element.dispatchEvent(getLinkInfoEvent);
    });
}

/**
 * Determines the route for the given url and updates the element
 * state with the correct url and dispatcher.
 *
 * @param {HTMLElement} element Element from which to dispatch the routing event
 * @param {Object} url Link to route, target Target of the link
 * @param {function} callback on the returned LinkInfo
 *
 * @returns {Promise} Promise[LinkInfo]
 */
export function updateRawLinkInfo(element, { url, target }) {
    if (url === null || url === undefined) {
        // eslint-disable-next-line no-console
        console.error('url must be specified');
    }
    if (isCSR && shouldDispatchToApp(target, formFactor)) {
        return getLinkInfo(element, {
            stateType: urlTypes.standard,
            attributes: {
                url,
                target,
            },
        });
    }

    // Return a no-op dispatcher for targets that should be handled by the browser
    return new Promise((resolve) => {
        resolve({ url, dispatcher: () => {} });
    });
}
