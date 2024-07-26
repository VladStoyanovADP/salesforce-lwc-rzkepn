import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet } from 'lightning/utils';
import { modalFocusinEventHandler } from 'lightning/modalUtils';

// SLDS Modal Footer classes
const footerClass = 'slds-modal__footer';
const hideClass = 'slds-hide';
// selectors
const footerSelector = `.${footerClass}`;
const footerSlotSelector = '[data-footer-slot]';

/**
 * The modal footer component to display footer content in lightning modal.
 * */
export default class LightningModalFooter extends LightningShadowBaseClass {
    // tracked private state
    initialRender = true;
    initialSlotRender = true;
    hideFooter = false;
    unregisterCallback = null;

    /**
     * Handle the default slot change event
     * Always register with parent every slot change
     * @private
     */
    handleDefaultSlotChange() {
        // Set this once so that parent can know slot
        // has rendered
        if (this.initialSlotRender) {
            this.initialSlotRender = false;
        }
        this.registerWithParent();
        this.hideFooter = !this.isDefaultSlotPopulated;
    }

    /**
     * Gets the CSS classes applicable to the modal footer element.
     * Hidden classes are set when the footer is hidden
     * @returns {string} CSS class applied to modal footer
     * @private
     */
    get footerCssClasses() {
        const classes = classSet(footerClass);
        classes.add({
            [hideClass]: this.hideFooter,
        });
        return classes.toString();
    }

    /**
     * Get the height of outer wrapper of modal footer
     * @returns {number} represents a height value in pixels
     * @private
     */
    get footerHeight() {
        const divElem = this.template.querySelector(footerSelector);
        const footerRect = divElem ? divElem.getBoundingClientRect() : {};
        const { height } = footerRect;
        return height || 0;
    }

    /**
     * Get an element reference to the modal footer's slot element
     * @returns {(HTMLElement|null)}
     * @private
     */
    get defaultSlotElement() {
        return this.template.querySelector(footerSlotSelector);
    }

    /**
     * Determine whether the default slot is populated
     * @returns {boolean}
     * @private
     */
    get isDefaultSlotPopulated() {
        const slotElement = this.defaultSlotElement;
        if (slotElement && slotElement.assignedNodes) {
            return slotElement.assignedNodes().length > 0;
        }
        return true;
    }

    /**
     * Register modalFooter with modal parent, including callbacks to
     * unregister the modal footer
     * this will get called multiple times over component lifecycle
     * @type {CustomEvent}
     * @private
     */
    registerWithParent() {
        const evtRegister = new CustomEvent('privatemodalfooterregister', {
            bubbles: true,
            composed: true,
            detail: {
                footerHeight: this.footerHeight,
                defaultSlotIsPopulated: this.isDefaultSlotPopulated,
                defaultSlotHasRendered: !this.initialSlotRender,
                unRegisterCallback: (unregisterCallback) => {
                    this.unregisterCallback = unregisterCallback;
                },
            },
        });
        this.dispatchEvent(evtRegister);
    }

    handleModalFooterFocusin = modalFocusinEventHandler.bind(this);

    /**
     * When modal footer is being created, initialize
     * private tracked modal footer state
     * This is need because modal footer can be added back to
     * the DOM, after being removed, and need to re-initialize state values
     * @private
     */
    initState() {
        this.initialRender = true;
        this.initialSlotRender = true;
        this.hideFooter = false;
        this.unregisterCallback = null;
    }

    connectedCallback() {
        super.connectedCallback();
        // handle case where modalFooter is added/removed/added to DOM
        // so registerWithParent gets called
        this.initState();
    }

    disconnectedCallback() {
        if (this.unregisterCallback) {
            this.unregisterCallback();
        }
    }

    renderedCallback() {
        if (this.initialRender) {
            this.registerWithParent();
            this.initialRender = false;
        }
        this.hideFooter = !this.isDefaultSlotPopulated;
    }
}
