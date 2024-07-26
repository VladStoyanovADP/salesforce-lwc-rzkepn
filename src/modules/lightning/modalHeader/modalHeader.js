import { api } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { getRealDOMId } from 'lightning/utilsPrivate';
import { modalFocusinEventHandler } from 'lightning/modalUtils';

// selectors
const modalHeaderSelector = '.slds-modal__header';
const labelSelector = '[data-label]';
const slotWrapperSelector = '[data-slot-wrapper]';
const defaultSlotSelector = '[data-default-slot]';

/**
 * Creates a header to display the heading and tagline at the top of a modal.
 * */
export default class LightningModalHeader extends LightningShadowBaseClass {
    // tracked private state
    initialRender = true;
    initialSlotRender = true;
    unregisterCallback = null;

    /**
     * Text to display as the heading at the top of the modal
     */
    @api label = '';

    /**
     * Handle the default slot change event
     * Always register with parent every slot change
     * @private
     */
    handleDefaultSlotChange() {
        // Set this once so that parent can know slot has rendered
        if (this.initialSlotRender) {
            this.initialSlotRender = false;
        }
        this.registerWithParent();
    }

    /**
     * Get the height of outer wrapper of modal header
     * @returns {number} represents a height value in pixels
     * @private
     */
    get headerHeight() {
        const divElem = this.template.querySelector(modalHeaderSelector);
        const headerRect = divElem ? divElem.getBoundingClientRect() : {};
        const { height } = headerRect;
        const heightValue = height || 0;
        return heightValue;
    }

    /**
     * Get an element reference to the modal's title element, currently H1
     * This get passed to the parent as a fallback element for autofocus
     * @returns {(HTMLElement|null)}
     * @private
     */
    get modalTitleElement() {
        return this.template.querySelector(labelSelector);
    }

    /**
     * Get the ID value of the modalTitleElement, currently H1
     * This value is passed to parent in order to use for aria-labelledby
     * @returns {(string|null)}
     * @private
     */
    get modalLabelId() {
        const labelElem = this.modalTitleElement;
        return getRealDOMId(labelElem);
    }

    /**
     * Get an element reference to the modal body's default slot's wrapper element
     * Currently this is a P tag, representing the tagline within the header
     * @returns {(HTMLElement|null)}
     * @private
     */
    get defaultSlotWrapperElement() {
        return this.template.querySelector(slotWrapperSelector);
    }

    /**
     * Get the ID value for the slot wrapper (p tag)
     * Future TODO: potentially wire up to aria-describedby
     * - when there is a better identified reproducible pattern
     * @returns {(string|null)}
     * @private
     */
    get defaultSlotWrapperId() {
        return getRealDOMId(this.defaultSlotWrapperElement);
    }

    /**
     * Get an element reference to the modal body's slot element
     * @returns {(HTMLElement|null)}
     * @private
     */
    get defaultSlotElement() {
        return this.template.querySelector(defaultSlotSelector);
    }

    /**
     * Determine whether the default slot is populated
     * @returns {boolean}
     * @private
     */
    get isDefaultSlotPopulated() {
        const slotElement = this.defaultSlotElement;
        if (slotElement && slotElement.assignedNodes) {
            const slotPopulated = slotElement.assignedNodes().length > 0;
            this.defaultSlotPopulated = slotPopulated;
            return slotPopulated;
        }
        this.defaultSlotPopulated = false;
        return false;
    }

    /**
     * Determine whether the developer provided label value is valid or not
     * Label value is required value, so console.error when not valid
     * @returns {boolean}
     * @private
     */
    get isLabelPopulated() {
        return (this.label && this.label.trim().length > 0) || false;
    }

    /**
     * Register modalHeader with modal parent, including callbacks to
     * unregister the modal header
     * this will get called multiple times over component lifecycle
     * @type {CustomEvent}
     * @private
     */
    registerWithParent() {
        const evtRegister = new CustomEvent('privatemodalheaderregister', {
            bubbles: true,
            composed: true,
            detail: {
                labelId: this.modalLabelId,
                labelIsPopulated: this.isLabelPopulated,
                headerHeight: this.headerHeight,
                defaultSlotWrapperId: this.defaultSlotWrapperId,
                defaultSlotIsPopulated: this.isDefaultSlotPopulated,
                defaultSlotHasRendered: !this.initialSlotRender,
                unRegisterCallback: (unregisterCallback) => {
                    this.unregisterCallback = unregisterCallback;
                },
                headerRef: this.modalTitleElement,
            },
        });
        this.dispatchEvent(evtRegister);
    }

    handleModalHeaderFocusin = modalFocusinEventHandler.bind(this);

    /**
     * When modal header is being created, initialize
     * private tracked modal header state
     * This is need because modal header can be added back to
     * the DOM, after being removed, and need to re-initialize state values
     * @private
     */
    initState() {
        this.initialRender = true;
        this.initialSlotRender = true;
        this.unregisterCallback = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this.initState();
    }

    renderedCallback() {
        if (this.initialRender) {
            this.registerWithParent();
            this.initialRender = false;
        }
    }

    disconnectedCallback() {
        if (this.unregisterCallback) {
            this.unregisterCallback();
        }
    }
}
