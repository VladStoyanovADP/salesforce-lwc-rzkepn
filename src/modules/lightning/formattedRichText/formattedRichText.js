import { api } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import sanitizeHTML from 'lightning/purifyLib';
import { richTextConfig } from './richTextConfig';
import { updateRawLinkInfo } from 'lightning/routingService';
import {
    normalizeBoolean,
    hasOnlyAllowedVideoIframes,
} from 'lightning/utilsPrivate';
import { linkTextNodes } from './linkTextNodes';

/**
 * Displays rich text that's formatted with allowed tags and attributes.
 * Other tags and attributes are removed and only their text content is displayed.
 */
export default class LightningFormattedRichText extends LightningShadowBaseClass {
    static validationOptOut = ['class'];
    /**
     * If present, the component does not create links in the rich text.
     * @type {boolean}
     * @default false
     */
    @api
    get disableLinkify() {
        return this._disableLinkify;
    }

    set disableLinkify(val) {
        this._disableLinkify = normalizeBoolean(val);
        this.renderRichText();
    }

    /**
     * Sets the rich text to display.
     * @type {string}
     *
     */
    @api
    get value() {
        return this._value;
    }

    set value(val) {
        this._value = val === undefined || val === null ? '' : String(val);
        this.renderRichText();
    }

    initialRender = true;
    _value = '';
    _disableLinkify = false;
    connected = false;
    clean = false;

    renderedCallback() {
        if (this.initialRender) {
            this.renderRichText();
            this.initialRender = false;
        }
    }

    connectedCallback() {
        super.connectedCallback();
        this.classList.add('slds-rich-text-editor__output');
        this.connected = true;
    }

    disconnectedCallback() {
        this.removeLinkClickListeners();
        this.connected = false;
    }

    handleClick(event) {
        const anchor = event.currentTarget;
        if (anchor == null) {
            return;
        }
        const target = anchor.target;
        const url = anchor.href;
        // Grab the link info onclick and dispatch
        updateRawLinkInfo(this, { url, target }).then((linkInfo) => {
            anchor.href = linkInfo.url;
            linkInfo.dispatcher(event);
        });
    }

    sanitize(value) {
        if (!value) {
            this.clean = true;
            return value;
        }
        this.clean = false;
        let displayValue;
        let computedRichTextConfig = richTextConfig;

        if (hasOnlyAllowedVideoIframes(value)) {
            // richTextConfig is shared across all formatted-rich-text components;
            // so create and modify copy of richTextConfig to allow iframes for each component
            computedRichTextConfig = {
                ...richTextConfig,
                ALLOWED_TAGS: richTextConfig.ALLOWED_TAGS.concat(['iframe']),
                ALLOWED_ATTR: richTextConfig.ALLOWED_ATTR.concat([
                    'allowfullscreen',
                ]),
            };
        }

        try {
            displayValue = sanitizeHTML(value, computedRichTextConfig);
            this.clean = true;
        } catch (e) {
            // eslint-disable-next-line no-console
            console.warn(
                `<lightning-formatted-rich-text> Exception caught when attempting to sanitize: `,
                e
            );
            displayValue = value;
            this.clean = false;
        }

        return displayValue;
    }

    renderRichText() {
        if (this.connected) {
            const richText = this.sanitize(this.value);
            const container = this.container;

            if (this.clean) {
                // eslint-disable-next-line @lwc/lwc/no-inner-html
                container.innerHTML = richText;
            } else {
                const textNode = document.createTextNode(richText);
                while (container.hasChildNodes()) {
                    container.removeChild(container.lastChild);
                }
                container.appendChild(textNode);
            }
            if (!this.disableLinkify) {
                linkTextNodes(container);
            }
            this.addLinkClickListeners();
        }
    }

    addLinkClickListeners() {
        this.links.forEach((link) => {
            link.addEventListener('click', this.handleClick.bind(this));
        });
    }

    removeLinkClickListeners() {
        this.links.forEach((link) => {
            link.removeEventListener('click', this.handleClick.bind(this));
        });
    }

    get links() {
        return this.container ? [...this.container.querySelectorAll('a')] : [];
    }

    get container() {
        return this.template.querySelector('span');
    }
}
