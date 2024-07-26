import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet } from 'lightning/utils';
import { getRealDOMId } from 'lightning/utilsPrivate';
import { findAllTabbableElements, filterTooltips } from 'lightning/focusUtils';
import { modalFocusinEventHandler } from 'lightning/modalUtils';

/**
 * The modal body component to display main content area in lightning modal.
 * */
export default class LightningModalBody extends LightningShadowBaseClass {
    // private tracked state
    initialRender = true;
    initialSlotRender = true;
    unregisterCallback = null;
    headerPresent = false;
    footerPresent = false;

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
     * Handle the 'privatescrollablecontainer from positionLibrary.js
     * This repositions elements with overlays that use positionLibrary
     * like helptext, combobox, etc
     * @private
     */
    handleScrollableContainerRepositionEvent(event) {
        const { callback: repositionCallback } = event.detail;
        repositionCallback(event.composedPath());
        event.stopPropagation();
    }

    /**
     * Gets the CSS classes applicable to the modal body element.
     * Hidden classes included for sibling components
     * @return {string} CSS class applied to modal body
     * @private
     */
    get modalBodyCssClasses() {
        const classes = classSet('slds-modal__content slds-p-around_medium');
        classes.add({
            'slds-modal__content_headless': !this.headerPresent,
            'slds-modal__content_footless': !this.footerPresent,
        });
        return classes.toString();
    }

    /**
     * Get a reference to the modal body content area wrapper div element
     * @returns {(HTMLElement|null)} Outer wrapper for modal body
     * @private
     */
    get contentElem() {
        return this.template.querySelector('[data-content-container]');
    }

    /**
     * Get the main content div element assigned ID value
     * @type {(string|null)}
     * @private
     */
    get modalContentId() {
        return getRealDOMId(this.contentElem);
    }

    /**
     * Get the default slot element for modal body component
     * @returns {(HTMLElement|null)}
     * @private
     */
    get defaultSlotElement() {
        return this.template.querySelector('[data-default-slot]');
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
        return false;
    }

    /**
     * Get first tabbable element within modalBody, if exists
     * This is passed to parent in order to autoFocus
     * @return {(HTMLElement|null)}
     * @private
     */
    get firstTabbableElement() {
        let firstElem = null;
        if (this.isDefaultSlotPopulated) {
            const tabbableElements = findAllTabbableElements(
                this.defaultSlotElement
            );
            const filteredElements = filterTooltips(tabbableElements);
            if (filteredElements.length > 0) {
                firstElem = filteredElements[0];
            }
        }
        return firstElem;
    }

    /**
     * Determine how much usuable screen height the modal has available
     * @param {object} values passed from modalBase to modalBody
     * representing height and width values of header, footer, and body
     * @return {object} values, after adding of modalUsableHeight
     * @private
     */
    calculateModalUsableHeight(values) {
        const { backdropHeight, paddingTop, paddingBottom } = values;
        const modalUsableHeight = backdropHeight - paddingTop - paddingBottom;
        values.modalUsableHeight = modalUsableHeight;
        return values;
    }

    /**
     * Determine how much usuable height modalBody has available
     * @param {object} values passed from modalBase to modalBody
     * representing height and width values of header, footer, and body
     * @return {number} calculation of modal body usable height
     * @private
     */
    calculateModalBodyUsableHeight({
        modalUsableHeight,
        headerHeight,
        footerHeight,
    }) {
        return modalUsableHeight - headerHeight - footerHeight;
    }

    /**
     * Based on initial values, calculate min/max height style values
     * to set on modalBody for correct display of content, and scrollability
     * @param {object} values passed from modalBase to modalBody,
     * height of screen should be used
     * representing height and width values of header, footer, and body
     * @return {object} values, after adding of modalUsableHeight
     * @private
     */
    updateModalBodyHeightValues(values) {
        // first, have to calculate the correct values
        const updatedValues = this.calculateModalUsableHeight(values);
        const modalBodyUsableHeight =
            this.calculateModalBodyUsableHeight(updatedValues);
        // update values with calculated values
        values.modalBodyUsableHeight = modalBodyUsableHeight;
        values.maxModalBodyHeightStyle = `${modalBodyUsableHeight}px`;
        return values;
    }

    /**
     * Set modal body height style values after calculating the correcting values to assign
     * @param {object} values Provided height, width values from handleUpdateHeight
     * @private
     */
    setModalBodyHeight(values, shouldUseFullHeight) {
        // set base style to remove any preset max/min-height values
        // if you move from > 767 to <= 767 or vise versa, previously set
        // values must be unset. removing by setting initial 'null' values
        let styles = { maxHeight: null, minHeight: null };
        // when not utilizing size=full screen modal
        // we need to calculate the max-height value
        // so the modalBody content scrolls correctly
        // (min-height value is always static for non size=full modals)
        // size=full screen modal required a CSS Grid based solution
        // due to iOS dynamic view port heights
        if (!shouldUseFullHeight) {
            // update the max-height and min height values
            // on modal body wrapper div
            const { maxModalBodyHeightStyle, minModalBodyHeightStyle } =
                this.updateModalBodyHeightValues(values);
            styles.maxHeight = maxModalBodyHeightStyle;
            styles.minHeight = minModalBodyHeightStyle;
        }
        const divElem = this.contentElem;
        Object.assign(divElem.style, styles);
    }

    /**
     * Update values for any size modal behavior when not exhibiting full height behavior
     * size=small|medium|large && size=full (when screen size greater than 767px)
     * @param {object} values Provided height, width values from handleUpdateHeight
     * @returns {object} updatedValues for default modal behavior. not utilized for full screen
     * @private
     */
    updateValues(values) {
        const { headerHeight, footerHeight, backdropHeight } = values;
        const MODAL_BODY_MIN_HEIGHT = 80;
        // default screen behavior (original modal behavior)
        const PAD_TOP_DEFAULT = 48;
        const PAD_BOTTOM_DEFAULT = 80;
        // use of Math.floor for some values returning half pixel values
        // for example headerHeight = 505.5px
        const updatedValues = {
            headerHeight: Math.floor(headerHeight),
            footerHeight: Math.floor(footerHeight),
            backdropHeight: Math.floor(backdropHeight),
            paddingTop: PAD_TOP_DEFAULT,
            paddingBottom: PAD_BOTTOM_DEFAULT,
            modalBodyMinHeight: MODAL_BODY_MIN_HEIGHT,
            // since size=full screen no longer relies on
            // JS calculated values, minHeight value is only
            // utilized for !size=full modals, and the value is
            // always static at 'min-height: 80px'
            minModalBodyHeightStyle: `${MODAL_BODY_MIN_HEIGHT}px`,
            // these last three values must first be calculated
            // the first two values get set on modal body
            maxModalBodyHeightStyle: null,
            modalBodyUsableHeight: null,
            modalUsableHeight: null,
        };
        return updatedValues;
    }
    /**
     * Set the max-height style inline on modalBody to prevent vertical height
     * of overall modal to overflow
     * This function is passed to the parent modal as a callback
     * and will be called on first modal load, and then on window resize events
     * as long as modalBody is present
     * To support size="full" behavior (full screen modal), this flow has been updated
     * to first determine which strategy to use, update values, then set values on modalBody
     * @param {Object} values Representing headerHeight, footerHeight, backdropHeight,
     * sizeSetFull, and isSmallScreenSize
     * @private
     */
    handleUpdateModalBodyHeight(values) {
        if (!this.initialRender) {
            const {
                sizeSetFull,
                isSmallScreenSize,
                size,
                headerHeight,
                footerHeight,
            } = values;
            // update modalBody state, tracks header and footer presence
            this.headerPresent = headerHeight !== 0;
            this.footerPresent = footerHeight !== 0;
            // now determine behavior: full screen or default
            const shouldUseFullHeight = sizeSetFull && isSmallScreenSize;
            const updatedValues = this.updateValues(values);
            // set updated values based on behavior
            this.setModalBodyHeight(updatedValues, shouldUseFullHeight);

            // update host variant and size based on header and footer height
            if (!this.headerPresent) {
                this.setAttribute('data-variant-headless', '');
            }
            if (!this.footerPresent) {
                this.setAttribute('data-variant-footless', '');
            }

            // set the host size based on the modal base size
            this.setAttribute('data-size', size);
        }
    }

    /**
     * Register modalBody with modal parent, including callbacks to
     * unregister the modal body, and update the modal body height
     * this will get called multiple times over component lifecycle
     * @type {CustomEvent}
     * @private
     */
    registerWithParent() {
        const evtRegister = new CustomEvent('privatemodalbodyregister', {
            bubbles: true,
            composed: true,
            detail: {
                bodyId: this.modalContentId,
                bodyIsPopulated: this.isDefaultSlotPopulated,
                defaultSlotHasRendered: !this.initialSlotRender,
                updateBodyCallback: this.handleUpdateModalBodyHeight.bind(this),
                unRegisterCallback: (unregisterCallback) => {
                    this.unregisterCallback = unregisterCallback;
                },
                firstTabbableElemRef: this.firstTabbableElement,
            },
        });
        this.dispatchEvent(evtRegister);
    }

    handleModalBodyFocusin = modalFocusinEventHandler.bind(this);

    /**
     * When modal body is being created, initialize
     * private tracked modal body state
     * @private
     */
    initState() {
        this.initialRender = true;
        this.initialSlotRender = true;
        this.unregisterCallback = null;
        this.headerPresent = false;
        this.footerPresent = false;
    }

    connectedCallback() {
        super.connectedCallback();
        // handle case where modalBody is added/removed/re-added to DOM
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
    }
}
