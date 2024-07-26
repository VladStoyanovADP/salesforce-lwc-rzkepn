import { api, track } from 'lwc';
import { normalizeBoolean } from 'lightning/utilsPrivate';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { isCSR } from 'lightning/utilsPrivate';
/**
 * A single tab in a tabset component.
 * @slot default Placeholder for your content in lightning-tab.
 */
export default class LightningTab extends LightningShadowBaseClass {
    @track _loadContent = false;
    _registered = false;

    connectedCallback() {
        super.connectedCallback();
        this._connected = true;
        if (isCSR && this.template.synthetic) {
            this.dispatchEvent(
                new CustomEvent('privatetabregister', {
                    cancelable: true,
                    bubbles: true,
                    composed: true,
                    detail: {
                        setDeRegistrationCallback: (deRegistrationCallback) => {
                            this._deRegistrationCallback =
                                deRegistrationCallback;
                        },
                    },
                })
            );
        }
    }

    renderedCallback() {
        if (!this._registered && !this.template.synthetic) {
            this._registered = true;
            this.dispatchEvent(
                new CustomEvent('privatetabregister', {
                    cancelable: true,
                    bubbles: true,
                    composed: true,
                    detail: {
                        setDeRegistrationCallback: (deRegistrationCallback) => {
                            this._deRegistrationCallback =
                                deRegistrationCallback;
                        },
                    },
                })
            );
        }
    }

    /**
     * Reserved for internal use.
     */
    @api
    loadContent() {
        this._loadContent = true;

        if (isCSR) {
            this.dispatchEvent(new CustomEvent('active'));
        }
    }

    disconnectedCallback() {
        this._connected = false;

        if (this._deRegistrationCallback) {
            this._deRegistrationCallback();
        }
    }

    /**
     * The optional string to identify which tab was clicked during the tab's active event.
     * This string is also used by active-tab-value in tabset to open a tab.
     * @type {string}
     */
    @api
    get value() {
        return this._value;
    }

    set value(newValue) {
        this._value = String(newValue);
        this._dispatchDataChangeEventIfConnected();
    }

    /**
     * The text displayed in the tab header.
     * @type {string}
     */
    @api
    get label() {
        return this._label;
    }

    set label(value) {
        this._label = value;
        this._dispatchDataChangeEventIfConnected();
    }

    /**
     * Specifies text that displays in a tooltip over the tab content.
     * @type {string}
     */
    @api
    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
        this._dispatchDataChangeEventIfConnected();
    }

    /**
     * The Lightning Design System name of an icon to display at the beginning of the tab label.
     * Specify the name in the format 'utility:down' where 'utility' is the category, and
     * 'down' is the icon to be displayed. Only utility icons can be used.
     * @type {string}
     */
    @api
    get iconName() {
        return this._iconName;
    }

    set iconName(value) {
        this._iconName = value;
        this._dispatchDataChangeEventIfConnected();
    }

    /**
     * The alternative text for the icon specified by icon-name.
     * @type {string}
     */
    @api
    get iconAssistiveText() {
        return this._iconAlernativeText;
    }

    set iconAssistiveText(value) {
        this._iconAlernativeText = value;
        this._dispatchDataChangeEventIfConnected();
    }

    /**
     * The Lightning Design System name of an icon to display at the end of the tab label.
     * Specify the name in the format 'utility:check' where 'utility' is the category, and
     * 'check' is the icon to be displayed.
     * @type {string}
     */
    @api
    get endIconName() {
        return this._endIconName;
    }

    set endIconName(value) {
        this._endIconName = value;
        this._dispatchDataChangeEventIfConnected();
    }

    /**
     * The alternative text for the icon specified by end-icon-name.
     * @type {string}
     */
    @api
    get endIconAlternativeText() {
        return this._endIconAlternativeText;
    }

    set endIconAlternativeText(value) {
        this._endIconAlternativeText = value;
        this._dispatchDataChangeEventIfConnected();
    }

    /**
     * Specifies whether there's an error in the tab content.
     * An error icon is displayed to the right of the tab label.
     * @type {boolean}
     */
    @api
    get showErrorIndicator() {
        return this._showErrorIndicator;
    }

    set showErrorIndicator(value) {
        this._showErrorIndicator = normalizeBoolean(value);
        this._dispatchDataChangeEventIfConnected();
    }

    _dispatchDataChangeEventIfConnected() {
        if (isCSR && this._connected) {
            this.dispatchEvent(
                new CustomEvent('privatetabdatachange', {
                    cancelable: true,
                    bubbles: true,
                    composed: true,
                })
            );
        }
    }
}
