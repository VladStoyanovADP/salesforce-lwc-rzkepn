import { api } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { registerDomain, unregisterDomain } from 'lightning/messageDispatcher';
import { isCSR } from 'lightning/utilsPrivate';


/**
 * Class representing primitive iframe.
 * @extends Element
 */
export default class LightningPrimitiveIframe extends LightningShadowBaseClass {
    @api src;
    @api domain;
    @api width = '100%';
    @api height = '100%';
    @api frameStyle = '';
    @api title;

    language = isCSR ? document.documentElement.lang || null : null;

    connectedCallback() {
        super.connectedCallback();
        registerDomain(this.src);
    }

    disconnectedCallback() {
        unregisterDomain(this.src);
    }

    handleContentLoad() {
        const iframeload = new CustomEvent('iframeload', {
            detail: {
                callbacks: {
                    postToWindow: this.postToWindow.bind(this),
                },
            },
        });

        this.contentWindow =
            this.template.querySelector('iframe').contentWindow;
        this.dispatchEvent(iframeload);
    }

    @api
    postToWindow(message) {
        if (this.contentWindow) {
            this.contentWindow.postMessage(message, this.domain);
        }
    }
}
