import { createElement, api } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { isCSR } from 'lightning/utilsPrivate';
import { instanceName } from 'lightning/overlayUtils';
import OverlayContainer from 'lightning/overlayContainer';

const ROOT = 'body';
const OVERLAY_CONTAINER = 'lightning-overlay-container';

function container() {
    // eslint-disable-next-line @lwc/lwc/no-document-query
    let element = document.querySelector(`${ROOT} > ${OVERLAY_CONTAINER}`);
    if (!element) {
        element = createElement(OVERLAY_CONTAINER, { is: OverlayContainer });
        document.body.appendChild(element);
    }
    return element;
}

/**
 * Extend this component for open/close apis.
 */
export default class LightningOverlay extends LightningShadowBaseClass {
    /**
     * Easier to debug when dynamically created.
     */
    static [instanceName] = 'lightning-overlay';

    /**
     * Open a modal instance
     *
     * @param {Object} apis Set apis directly on the modal instance
     */
    static open(apis) {
        if (isCSR) {
            return container().push(this, apis);
        }
        return new Promise(() => {});
    }

    /**
     * The close api is public for testing only.
     *
     * @param {any} result Returned in the promise.
     */
    @api
    close(result, promise) {
        if (isCSR) {
            container().pop(this.template.host, result, promise);
        }
    }
}
