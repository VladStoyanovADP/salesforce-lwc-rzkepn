import { api } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet } from 'lightning/utils';
import {
    ARIA,
    hasAnimation,
    isAriaDescriptionSupported,
    isCSR,
    makeEverythingExceptElementInert,
    normalizeString,
    restoreInertness,
    synchronizeAttrs,
} from 'lightning/utilsPrivate';
import { instanceName, secure } from 'lightning/overlayUtils';
import {
    getElementWithFocus,
    returnFocusToElement,
} from 'lightning/focusUtils';
import closeButtonAltText from '@salesforce/label/LightningModalBase.cancelandclose';
import disableCloseBtnMessage from '@salesforce/label/LightningModalBase.waitstate';
import AriaObserver from 'lightning/ariaObserver';
import { modalFocusinEventHandler } from 'lightning/modalUtils';

const DEBOUNCE_RESIZE = 300;
const SMALL_SCREEN_SIZE = 480;
const SIZE_SMALL = 'small';
const SIZE_MEDIUM = 'medium';
const SIZE_LARGE = 'large';
const SIZE_FULL = 'full';

export default class LightningModalBase extends LightningShadowBaseClass {
    // this is visible in DOM, changed from 'lightning-modal-base'
    static [instanceName] = 'lightning-modal-base';

    // private tracked state
    initialRender = true;
    autoFocusCompletedOnce = false;
    timeoutId = 0;
    disableCloseButton = false;
    sectionAriaBusy = null;
    closeButtonAltText = closeButtonAltText;
    disableCloseBtnMessage = disableCloseBtnMessage;
    isModalClosing = false;
    // screen size private tracked state
    isSmallScreenSize = null;

    // modalHeader, child
    headerRegistered = false;
    headerHeight = 0;
    headerDefaultSlotIsPopulated = false;
    headerSlotWrapperId = null;
    headerSlotHasRendered = false;
    headerLabelId = null;
    headerLabelIsPopulated = null;
    headerTitleRef = null;

    // modalBody, child
    bodyRegistered = false;
    bodyDefaultSlotIsPopulated = false;
    bodySlotHasRendered = false;
    bodyId = null;
    baseUpdateBodyCallback = null;
    bodyResizeScheduled = false;
    bodyTabElemRef = null;
    // eventing state utilized when modalBody present
    windowResizeEventBound = false;
    windowOrientationEventBound = false;
    portraitMatchMedia = null;
    screenOrientationChangeHandler = null;

    // state utilized when performing keyboard focus trap
    focusinEventBound = false;
    lastFocusedElement = null;

    // modalFooter, child
    footerRegistered = false;
    footerHeight = 0;
    footerSlotHasRendered = false;
    footerDefaultSlotIsPopulated = false;

    // aria attributes
    modalLabel = null;
    modalLabelledBy = null;
    modalDescribedBy = null;
    // currently used for disableClose
    showAriaLiveMessage = false;
    ariaLiveMessage = '';

    // modal features
    isModalOpen = false;
    isModalTransitioningIn = false;
    // modal background elements
    savedInertElements = [];
    // before modal opened, element previously focused
    savedActiveElement;

    // accessibility
    ariaObserver = null;

    constructor() {
        super();
        this.ariaObserver = new AriaObserver(this);
    }

    /**
     * <lightning-modal> label value
     * Text to display as the heading at the top of the modal
     */
    get label() {
        const modal = this.modal;
        if (!modal) {
            return '';
        }
        return modal.label;
    }

    /**
     * <lightning-modal> description value
     * Text used for the accessible description of the modal. see updateAriaDescription()
     * Note: this value is not visible in the UI, and only to screen readers
     */
    get description() {
        const modal = this.modal;
        if (!modal) {
            return '';
        }
        return modal.description;
    }

    /**
     * Get the current modal size, calculated as a percentage of the viewport.
     * Valid values are small, medium, large, and full. The default is medium.
     * @type {string}
     * @default medium
     */
    get size() {
        const sizeDefault = SIZE_MEDIUM;
        const modal = this.modal;
        if (!modal) {
            return sizeDefault;
        }
        // get the size value from <lightning-modal>
        return normalizeString(modal.size, {
            fallbackValue: sizeDefault,
            validValues: [SIZE_FULL, SIZE_SMALL, SIZE_MEDIUM, SIZE_LARGE],
        });
    }

    /**
     * <lightning-modal> disableClose value
     * Get attribute to trigger disabling ability to dismiss modal temporarily
     */
    get disableClose() {
        const modal = this.modal;
        if (!modal) {
            return false;
        }
        return modal.disableClose;
    }

    /**
     * Public method to get the modal slot element
     * @type {(HTMLElement|null)} The modal slot, currently a div elem
     */
    @api
    get defaultSlot() {
        return this.template.querySelector('[data-slot]');
    }

    /**
     * Private method to get the modal section element, the outer wrapper for modal elements
     * @returns {(HTMLElement|null)} The section element, currently the section[role="dialog"]
     * @private
     */
    get modalWrapper() {
        return this.template.querySelector('[data-modal]');
    }

    /**
     * Private method to get the lightning-modal element inside the div slot
     * This element has the api for .close, size, label
     * @returns {(HTMLElement|null)} The modal inside <div data-slot>: <lightning-modal>
     * @private
     */
    get modal() {
        return (
            (isCSR && this.defaultSlot && this.defaultSlot.childNodes[0]) ||
            null
        );
    }

    /**
     * Private method to get the modal span description element
     * This span is present when the accessible 'description' api text is present,
     * and aria-description isn't supported.  Instead, aria-describedby is utilized
     * @returns {(HTMLElement|null)} The modal span element for IDRef linkage
     * @private
     */
    get modalDescSpan() {
        return this.template.querySelector('[data-aria-description]');
    }

    /**
     * Get the lightning-button-icon (close button element)
     * @returns {(HTMLElement|null)}
     * @private
     */
    get modalCloseButton() {
        return this.template.querySelector('[data-close-button]');
    }

    /**
     * Get the lightning-modal element within the modal slot
     * currently modalBase's slot is a div element, not a slot element
     * @returns {(HTMLElement|null)}
     * @private
     */
    get modalElement() {
        const modalSlot = this.defaultSlot;
        if (!modalSlot) {
            return null;
        }
        return modalSlot.querySelector('lightning-modal');
    }

    /**
     * Get the lightning-modal element's backdrop
     * @returns {(HTMLElement|null)}
     * @private
     */
    get modalBackdrop() {
        return this.template.querySelector('[data-backdrop]');
    }

    /**
     * Get the background element height
     * used to calculate max height on the modalBody using
     * modal -> modalBody callback
     * @returns {number}
     * @private
     */
    get backdropDimensions() {
        const backdropElem = this.modalBackdrop;
        const backdropRect = backdropElem
            ? backdropElem.getBoundingClientRect()
            : {};
        const { height, width } = backdropRect;
        return {
            height: height || 0,
            width: width || 0,
        };
    }

    /**
     * Gets the CSS classes applicable to the outer modal wrapper element
     * Modal foreground triggers on this.isModalTransitioningIn to
     * fade in/out or animate up/down
     * @returns {string} CSS class string
     * @private
     */
    get modalCssClasses() {
        let classes = classSet('slds-modal fix-slds-modal');
        const sizeClass = this.size;
        if (hasAnimation()) {
            // .slds-fade-in-open not present to trigger opacity animation
            // when later this.isModalTransitioningIn is set to TRUE
            // animation then occurs
            classes.add({
                'slds-fade-in-open': this.isModalTransitioningIn,
            });
        } else {
            // no animation occurs if the .slds-fade-in-open class
            // is immediately present in DOM
            classes.add({
                'slds-fade-in-open': true,
            });
        }
        // don't add animation related css classes in this group
        classes.add({
            'slds-modal_full': sizeClass === SIZE_FULL,
            'slds-modal_medium': sizeClass === SIZE_MEDIUM,
            'slds-modal_large': sizeClass === SIZE_LARGE,
            'slds-modal_small': sizeClass === SIZE_SMALL,
        });
        return classes.toString();
    }

    /**
     * Gets the CSS classes applicable to the modal background element
     * Backdrop triggers on this.isModalOpen to fade/animate in first
     * @returns {string} CSS class string
     * @private
     */
    get modalBackdropCssClasses() {
        let classes = classSet('slds-backdrop fix-slds-backdrop');
        if (hasAnimation()) {
            classes.add({
                'slds-backdrop_open': this.isModalOpen,
            });
        } else {
            // no fading animation occurs when .slds-backdrop_open
            // is immediately present in the DOM
            classes = classes.add({
                'slds-backdrop_open': true,
            });
        }
        return classes.toString();
    }

    get isDescriptionSet() {
        const { description } = this;
        // check for being set, as well as not just a description with spaces
        // avoiding setting aria-describedby on section pointing to
        // an empty SPAN element
        return !!description?.trim().length;
    }

    /**
     * Compute the correct lightning-button-icon CSS class to use
     * for the size="full" behaviors, based upon the screen size
     * threshold.  Two classes are added for full screen behavior
     * to handle edge cases where customers change background of the
     * modal header so the close button maintains visibility for a11y
     * @private
     */
    // slds-button slds-button_icon slds-modal__close slds-button_icon-inverse
    get computedCloseButtonCssClass() {
        let classes = classSet('slds-modal__close');
        const fullScreenActive =
            this.isSmallScreenSize && this.size === SIZE_FULL;
        classes.add({
            'slds-modal_full-close-button': fullScreenActive,
        });
        return classes.toString();
    }

    /**
     * Compute the correct lightning-button-icon variant to use
     * for the size="full" behaviors, based upon the screen size
     * threshold.  Important to maintain existing close button behavior
     * when size 'small', 'medium' and 'large' close button variant
     * when 'isSmallScreenSize = true' for a11y purposes
     * @private
     */
    get computedCloseButtonVariant() {
        return this.shouldModalBeFullScreen() ? 'bare' : 'bare-inverse';
    }

    /**
     * Determines if aria-describedby should be set, and the span tag shown
     * occurs only when aria-description is not supported.
     * ex: when description api is set to '' or '     ',
     * we don't want to show the span or set aria-describedby
     * @private
     */
    get showAriaDescribedBy() {
        return !isAriaDescriptionSupported() && this.isDescriptionSet;
    }

    /**
     * When window is resizing, need to debounce callback
     * Track internal variable _resizing
     * @returns {Boolean}
     * @private
     */
    get modalResizing() {
        if (!this._resizing) {
            this._resizing = this.scheduleWindowResizeEvent.bind(this);
        }
        return this._resizing;
    }

    /**
     * Toggle on and off disable close button feature
     * typically used very briefly when devs want to save form data to backend
     * and do not want the form to be closed before the save has
     * completed successfully
     * toggleDisableCloseButton sets local state to
     * (a) toggle display an aria-live message
     * (b) toggle set disabled on the <lightning-button-icon>
     * (c) toggle set aria-busy value on
     * elsewhere in modalBase and modal, ESC key is also disabled, and
     * calls to this.close() are prevented
     */
    toggleDisableCloseButton() {
        // this.disableCloseButton is local modalBase state
        // this.disableClose is modal.js @api state
        // we track both in order to handle transition correctly
        const isSwitchingToDisabled =
            !this.disableCloseButton && this.disableClose;
        /* Future enhancement possibility - trigger setInterval to remove and
           again add back 'Processing' text, as this will indicate to the screen
           reader user that the interface continues to be busy
        */
        const disableCloseButtonMessage = isSwitchingToDisabled
            ? this.disableCloseBtnMessage
            : '';
        if (isSwitchingToDisabled) {
            // Should disable close button
            this.ariaLiveMessage = disableCloseButtonMessage;
            this.showAriaLiveMessage = true;
            synchronizeAttrs(this.modalWrapper, { [`${ARIA.BUSY}`]: true });
            synchronizeAttrs(this.modalCloseButton, { disabled: 'disabled' });
            this.disableCloseButton = true;
        } else {
            // Should enable close button
            this.ariaLiveMessage = disableCloseBtnMessage;
            this.showAriaLiveMessage = false;
            synchronizeAttrs(this.modalWrapper, { [`${ARIA.BUSY}`]: null });
            synchronizeAttrs(this.modalCloseButton, { disabled: null });
            this.disableCloseButton = false;
        }
    }

    /**
     * Saves the current active focused element on modal creation
     * in order to be able to set focus back to that previous element
     * @private
     */
    saveActiveElement() {
        this.savedActiveElement = getElementWithFocus();
    }

    /**
     * Renders most background elements inert, while modal active
     * and saves them for later setting background elements active
     * @private
     */
    renderBackgroundInert() {
        this.savedInertElements = makeEverythingExceptElementInert(
            this.template.host
        );
    }

    /**
     * Renders most background elements active, as modal closes
     * @private
     */
    renderBackgroundActive() {
        restoreInertness(this.savedInertElements);
        this.savedInertElements = [];
    }

    /**
     * Returns focus to background element previously focused,
     * before modal existed
     * @private
     */
    returnFocusToBackground() {
        const { savedActiveElement } = this;
        const elementWasFocused = returnFocusToElement(savedActiveElement);
        if (!elementWasFocused) {
            // eslint-disable-next-line no-console
            console.warn('Modal :: Nothing to return focus to');
        }
    }

    /**
     * Queue the showing of the modal
     * utilized for triggering fade in modal CSS class additions
     * @private
     */
    queueShowModal() {
        if (this.isModalOpen && !this.isModalTransitioningIn) {
            this.isModalTransitioningIn = true;
        }
    }

    /**
     * Opening the modal involves first performing necessary steps to
     * prepare for when the modal closes
     * isModalOpen triggers fade in CSS class on modal background
     * @private
     */
    openModal() {
        this.saveActiveElement();
        this.renderBackgroundInert();
        if (!this.isModalOpen) {
            this.isModalOpen = true;
        }
    }

    /**
     * Closing the modal wraps up the modal lifecycle
     * before it is fully removed
     * @private
     */
    closeModal() {
        this.returnFocusToBackground();
        this.renderBackgroundActive(this.savedInertElements);
        if (this.ariaObserver) {
            this.ariaObserver.disconnect();
            this.ariaObserver = undefined;
        }
    }

    /**
     * Unsets the aria-labelledby or aria-label values
     * when no label value is provided
     * modal requires 'label' value either at modalHeader or at modal
     * @private
     */
    unsetAriaLabelAndError = () => {
        // unset any previously set aria values
        synchronizeAttrs(this.modalWrapper, {
            [ARIA.LABELLEDBY]: null,
            [ARIA.LABEL]: null,
        });
        // console.error when label empty
        this.errorLabelRequired();
        if (this.ariaObserver) {
            this.ariaObserver.disconnect();
        }
    };

    /**
     * Set either 'aria-describedby' or 'aria-description' value for accessibility
     * based on the presence of 'description' api value
     * and support of the newer ARIA 'aria-description'.
     * At launch, modern browsers Firefox and Safari DO NOT support it. IE11 won't.
     * @private
     */
    updateAriaDescription() {
        const { description } = this;
        // if aria-description is supported && description set, set aria-description
        if (isAriaDescriptionSupported()) {
            const descriptionToSet = this.isDescriptionSet ? description : null;
            // set aria-description if set, otherwise unset with null
            return synchronizeAttrs(this.modalWrapper, {
                [ARIA.DESCRIPTION]: descriptionToSet,
            });
        }
        // if aria-description not supported, and description is set,
        // and span id exists, or unset aria-describedby with null
        const spanId = (this.isDescriptionSet && this.modalDescSpan.id) || null;
        return synchronizeAttrs(this.modalWrapper, {
            [ARIA.DESCRIBEDBY]: spanId,
        });
    }

    /**
     * Sets the aria-labelledby or aria-label values for accessibility
     * based on presence of modalHeader child
     * modal requires 'label' value either at modalHeader or at modal
     * @private
     */
    updateAriaLabel() {
        const {
            label,
            headerRegistered,
            headerLabelId,
            headerLabelIsPopulated,
        } = this;
        const labelIsEmpty = label === '' || label.trim().length === 0;
        // when header is present,
        // headerLabelIsPopulated is equivalent labelIsEmpty, but from modalHeader level
        if (headerRegistered) {
            if (headerLabelId && headerLabelIsPopulated) {
                if (this.ariaObserver) {
                    this.ariaObserver.connect({
                        targetNode: this.modalWrapper,
                        attribute: 'aria-labelledby',
                        relatedNodes: [this.headerTitleRef],
                    });
                }
                synchronizeAttrs(this.modalWrapper, { [ARIA.LABEL]: null });
                // if labelId not set OR header label value not set,
                // must console.error
            } else {
                this.unsetAriaLabelAndError();
            }
            // unset if no header (gets removed dynamically, or never present)
        } else {
            // fallback to headless variant
            // check label is actually set,
            // and use aria-label instead of aria-labelledby
            if (!labelIsEmpty) {
                synchronizeAttrs(this.modalWrapper, {
                    [ARIA.LABELLEDBY]: null,
                    [ARIA.LABEL]: label,
                });
            } else {
                // in headless variant, must have label value set, unless the modal
                // is actively closing
                if (!this.isModalClosing) {
                    this.unsetAriaLabelAndError();
                }
            }
        }
    }

    /**
     * Construct and show console.error for missing label value
     * Modal component requires the label attribute, either via
     * modalHeader or modal to have accessibility set correctly
     * @private
     */
    errorLabelRequired() {
        let errorMsg =
            'LightningModal - Templates with <lightning-modal-header> should define the label attribute as an attribute on <lightning-modal-header label="Modal Heading"> .';
        errorMsg +=
            ' Templates without <lightning-modal-header> should define the label attribute in the Modal.open({ label: "Modal Heading" })';
        console.error(errorMsg);
    }

    /**
     * Handle the close button click, or via ESC key
     * @private
     */
    handleCloseClick() {
        // calls handlePrivateClose
        if (!this.disableCloseButton) {
            this.modal.close();
        }
    }

    /**
     * Handle privateclose event firing is prevented from occurring
     * when this.disableClose set true in modal.js
     * @param e
     */
    handlePrivateClose(e) {
        if (!(e.detail && e.detail[secure])) {
            console.error('Invalid access to privateclose event');
            return;
        }

        // set isModalClosing boolean, to prevent intentional error
        // when checking for presence of api 'label' value
        this.isModalClosing = true;
        if (hasAnimation()) {
            /// triggers the disappearance of the foreground modal elements
            this.modalWrapper.classList.remove('slds-fade-in-open');
            this.modalBackdrop.classList.remove('slds-backdrop_open');
            // wait until modalWrappers animation completes, then proceed
            this.modalBackdrop.addEventListener('transitionend', () => {
                e.detail.resolve();
            });
        } else {
            // skip animation, resolve immediately
            e.detail.resolve();
        }
        // disconnectedCallback doesn't get called on .close()
        // unregistering child components
        if (this.headerRegistered && this.unregisterHeader) {
            this.unregisterHeader();
        }
        if (this.bodyRegistered && this.unregisterBody) {
            this.unregisterBody();
        }
        if (this.footerRegistered && this.unregisterFooter) {
            this.unregisterFooter();
        }
        this.closeModal();
    }

    handlePrivateDisableCloseButton(e) {
        if (!(e.detail && e.detail[secure])) {
            console.error('Invalid access to privatedisableclose event');
            return;
        }

        this.toggleDisableCloseButton();
    }

    /**
     * Handle Esc key down events on the modal
     * @param {Event} e The keyboard event
     * @private
     */
    handleModalKeyDown(e) {
        const { ctrlKey, metaKey, shiftKey, key } = e;
        const hasModifier = ctrlKey || metaKey || shiftKey;
        // 'Esc' is IE11 specific, remove when support is dropped
        // when disableCloseButton set true, ESC key to close modal is deactivated
        if (
            !hasModifier &&
            !this.disableCloseButton &&
            (key === 'Esc' || key === 'Escape')
        ) {
            e.stopPropagation();
            e.preventDefault();
            this.handleCloseClick();
        }
    }

    /**
     * Utilized to auto set (autofocus) the browser's focus to-
     *
     * 1. title text inside a Modal Header OR
     * 2. place it on the first interactive element within the modal children (i.e, Headless Modal variant)
     * 3. place it on Close Icon
     *
     * Fires custom cancelable event 'autofocus' as autoFocus should only be done during the modal's creation.
     * Needs to wait until all elements have rendered in the DOM.
     * Details on focus decision tree under
     * ['Opening Dialogs'](https://www.lightningdesignsystem.com/accessibility/guidelines/global-focus/#dialogs) section.
     * For modal v1, ignore multi-step modal as it is not part of scope
     * @private
     */
    focusFirstElement() {
        const { autoFocusCompletedOnce, modalElement } = this;
        // If any of these is TRUE, exit before proceeding
        // 1. if modal has already been autofocused once, exit immediately
        // 2. need to wait for modalElements to be rendered to the DOM
        if (autoFocusCompletedOnce || !modalElement) {
            return;
        }

        const {
            bodyRegistered,
            footerRegistered,
            headerRegistered,
            headerTitleRef,
            headerDefaultSlotIsPopulated,
            headerSlotHasRendered,
            bodyDefaultSlotIsPopulated,
            bodySlotHasRendered,
            bodyTabElemRef,
            footerDefaultSlotIsPopulated,
            footerSlotHasRendered,
        } = this;

        const waitForHeaderSlotRender =
            headerRegistered &&
            headerDefaultSlotIsPopulated &&
            !headerSlotHasRendered;
        const waitForBodySlotRender =
            bodyRegistered &&
            bodyDefaultSlotIsPopulated &&
            !bodySlotHasRendered;
        const waitForFooterSlotRender =
            footerRegistered &&
            footerDefaultSlotIsPopulated &&
            !footerSlotHasRendered;

        // 3. Need to make sure registered child components
        // slots have fully rendered before proceeding
        if (
            waitForHeaderSlotRender ||
            waitForBodySlotRender ||
            waitForFooterSlotRender
        ) {
            return;
        }

        const modalHeadingElem =
            headerRegistered && headerTitleRef ? headerTitleRef : null;

        // preferred focus be placed, in following order
        // (1) on title text present inside a Modal Header
        // (2) on autofocus-able elements (links:NOT(tooltip), inputs, buttons)
        //     located in lightning-modal-body in case of **Headless Modal variant**
        const preferredFocusElem = modalHeadingElem
            ? modalHeadingElem
            : bodyTabElemRef || null;

        // fallback focus, in order of preference
        // (1) close button (always present, current version)
        // (2) outer modal element (always present, here ONLY as a backup,
        //     for when hide or disable close button becomes available
        const closeButtonElem = this.modalCloseButton;
        const outerModalElem = this.modalWrapper;

        const fallbackFocusElem = this.disableCloseButton
            ? outerModalElem
            : closeButtonElem;

        const focusElem = preferredFocusElem
            ? preferredFocusElem
            : fallbackFocusElem;

        if (focusElem !== null) {
            this.lastFocusedElement = focusElem;
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            requestAnimationFrame(() => {
                focusElem.focus();
            });
            this.autoFocusCompletedOnce = true;
        } else {
            // Should never happen since outerModalElem always present
            console.error(
                'LightningModal - at least one focusable element is required, none found.'
            );
        }
    }

    /**
     * When child component modalBody is removed,
     * sets private tracked state, detaches window.onresize event listeners
     * @private
     */
    unregisterBody() {
        // FUTURE TODO mechanism to support aria-describedby
        // aria-describedby is optional, without a good reproducible pattern
        this.initBodyState();
    }

    /**
     * Registers modalBody with its parent modal, when present
     * Sets private tracked state about modalBody
     * Called when 'onprivatemodalbodyregister' event gets fired
     * @param {Object} detail Passed details object from modalBody
     * @private
     */
    registerBody({
        bodyId,
        bodyIsPopulated,
        updateBodyCallback,
        defaultSlotHasRendered,
        unRegisterCallback,
        firstTabbableElemRef,
    }) {
        this.bodyRegistered = true;
        this.bodyDefaultSlotIsPopulated = bodyIsPopulated;
        this.bodySlotHasRendered = defaultSlotHasRendered;
        this.bodyId = bodyId;
        this.baseUpdateBodyCallback = updateBodyCallback;
        this.bodyTabElemRef = firstTabbableElemRef || null;
        unRegisterCallback(() => {
            this.unregisterBody();
        });
        // cover case if modalBody is removed, then added back
        // required to correctly set the CSS classes on modalBody
        this.updateModalBodyHeight();

        // ModalBody can register 2+ times when initially rendering
        if (!this.windowResizeEventBound) {
            this.addWindowResizeEventListener();
        }
        if (!this.windowOrientationEventBound) {
            this.addOrientationChangeListener();
        }
        if (!this.focusinEventBound) {
            this.addFocusinEventListener();
        }
    }

    /**
     * When modalBody present, update private tracked state
     * @param {Event} e The private custom registration event of modalBody
     * @private
     */
    handleBodyRegister(e) {
        const { detail } = e;
        this.registerBody(detail);
        e.stopPropagation();
    }

    /**
     * When modalBody removed or at startup, initialize private tracked modalBody state
     * @private
     */
    initBodyState() {
        this.bodyRegistered = false;
        this.bodyDefaultSlotIsPopulated = false;
        this.bodySlotHasRendered = false;
        this.bodyId = null;
        this.baseUpdateBodyCallback = null;
        this.bodyResizeScheduled = false;
        this.bodyTabElemRef = null;
        this.removeModalEventListeners();
    }

    /**
     * Sets private tracked state related to modalHeader, when removed
     * @private
     */
    unregisterHeader() {
        this.initHeaderState();
        this.updateAriaLabel();
    }

    /**
     * update the modalBase tracked header height value
     * @private
     */
    updateHeaderHeight(value) {
        this.headerHeight = !Number.isNaN(value) && value >= 0 ? value : 0;
    }

    /**
     * Registers modalHeader with its parent modal, when present
     * Sets private tracked state about modalHeader
     * Called when 'onprivatemodalheaderregister' event gets fired
     * @param {Object} detail Passed details object from modalHeader
     * @private
     */
    registerHeader({
        defaultSlotIsPopulated,
        defaultSlotWrapperId,
        defaultSlotHasRendered,
        unRegisterCallback,
        labelIsPopulated,
        headerHeight,
        headerRef,
        labelId,
    }) {
        this.headerRegistered = true;
        this.updateHeaderHeight(headerHeight);
        this.headerDefaultSlotIsPopulated = defaultSlotIsPopulated;
        this.headerSlotHasRendered = defaultSlotHasRendered;
        this.headerSlotWrapperId = defaultSlotWrapperId;
        this.headerLabelId = labelId;
        this.headerLabelIsPopulated = labelIsPopulated;
        this.headerTitleRef = headerRef;
        unRegisterCallback(() => {
            this.unregisterHeader();
        });
        // update modalBody max-height values
        if (this.bodyRegistered) {
            this.updateModalBodyHeight();
        }
    }

    /**
     * Event handler for private modalHeader registration
     * When modalHeader present, update private tracked state
     * @param {Event} e Private custom registration event fired
     * @private
     */
    handleHeaderRegister(e) {
        const { detail } = e;
        this.registerHeader(detail);
        this.updateAriaLabel();
        e.stopPropagation();
    }

    /**
     * When modalHeader removed or at startup, initialize
     * private tracked modalHeader state
     * @private
     */
    initHeaderState() {
        this.headerRegistered = false;
        this.headerHeight = 0;
        this.headerDefaultSlotIsPopulated = false;
        this.headerSlotWrapperId = null;
        this.headerSlotHasRendered = false;
        this.headerLabelId = null;
        this.headerLabelIsPopulated = null;
        this.headerTitleRef = null;
    }

    /**
     * Sets private tracked state related to modalFooter, when removed
     * @private
     */
    unregisterFooter() {
        this.initFooterState();
    }

    /**
     * update the modalBase tracked footer height value
     * @private
     */
    updateFooterHeight(value) {
        this.footerHeight = !Number.isNaN(value) && value >= 0 ? value : 0;
    }

    /**
     * Registers modalFooter with its parent modal, when present
     * Sets private tracked state about modalFooter
     * Called when 'onprivatemodalfooterregister' event gets fired
     * @param {Object} detail Passed details object from modalFooter
     * @private
     */
    registerFooter({
        defaultSlotIsPopulated,
        defaultSlotHasRendered,
        footerHeight,
        unRegisterCallback,
    }) {
        this.footerRegistered = true;
        this.footerDefaultSlotIsPopulated = defaultSlotIsPopulated;
        this.footerSlotHasRendered = defaultSlotHasRendered;
        this.updateFooterHeight(footerHeight);
        unRegisterCallback(() => {
            this.unregisterFooter();
        });
        // update modalBody max-height values
        if (this.bodyRegistered) {
            this.updateModalBodyHeight();
        }
    }

    /**
     * Event handler for private modalFooter registration
     * When modalFooter present, update private tracked state
     * @param {Event} e Private custom registration event fired
     * @private
     */
    handleFooterRegister(e) {
        const { detail } = e;
        this.registerFooter(detail);
        e.stopPropagation();
    }

    /**
     * When modalFooter removed or at startup, initialize
     * private tracked modalFooter state
     * @private
     */
    initFooterState() {
        this.footerRegistered = false;
        this.footerHeight = 0;
        this.footerSlotHasRendered = false;
        this.footerDefaultSlotIsPopulated = false;
    }

    /**
     * Test to determine whether modal should display full screen behavior
     * @returns {Boolean}
     * @private
     */
    shouldModalBeFullScreen() {
        return this.size === SIZE_FULL && this.isSmallScreenSize;
    }

    /**
     * When the modalBody content height is tall, it requires max-height
     * to be set in order to prevent overflow of the modal offscreen
     * Throttling occurs to prevent calling this method every time
     * the window.onresize event fires
     * @private
     */
    updateModalBodyHeight() {
        clearTimeout(this.timeoutId);
        this.timeoutId = 0;

        if (this.updateHeaderCallback) {
            // Update the header size
            this.updateHeaderCallback({ size: this.size });
        }

        if (this.updateFooterCallback) {
            // Update the footer size
            this.updateFooterCallback({ size: this.size });
        }

        if (this.bodyRegistered && !this.bodyResizeScheduled) {
            // check, and update isSmallScreenSize before
            // callback to modalBody
            this.setIsSmallScreenSize();
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            requestAnimationFrame(() => {
                this.bodyResizeScheduled = false;
                if (this.baseUpdateBodyCallback) {
                    const values = {
                        footerHeight: this.footerHeight || 0,
                        headerHeight: this.headerHeight || 0,
                        // backdrop values can be used as proxies for screen width / height
                        backdropHeight: this.backdropDimensions.height,
                        backdropWidth: this.backdropDimensions.width,
                        sizeSetFull: this.size === SIZE_FULL,
                        isSmallScreenSize: this.isSmallScreenSize,
                        size: this.size,
                    };
                    this.baseUpdateBodyCallback(values);
                }
            });
            this.bodyResizeScheduled = true;
        }
    }

    /**
     * Provide debounce / throttling to prevent modalBody callback
     * from being fired every time window.onresize event fires
     * @private
     */
    scheduleWindowResizeEvent() {
        if (this.timeoutId === 0) {
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            this.timeoutId = setTimeout(() => {
                this.updateModalBodyHeight();
            }, DEBOUNCE_RESIZE);
        }
    }

    /**
     * Event handler for window.onresize event
     * @private
     */
    handleWindowResizeEvent = () => {
        this.scheduleWindowResizeEvent();
    };

    /**
     * Add window 'resize' event listener when modalBody is present
     * this only gets used by modalBody, so only gets wired up when
     * registerBody function called
     * @private
     */
    addWindowResizeEventListener() {
        if (isCSR && !this.windowResizeEventBound) {
            window.addEventListener('resize', this.handleWindowResizeEvent);
            this.windowResizeEventBound = true;
        }
    }

    /**
     * Detach window.onresize event listener when modalBody is removed
     * @private
     */
    removeWindowResizeEventListener() {
        if (isCSR && this.windowResizeEventBound) {
            window.removeEventListener('resize', this.handleWindowResizeEvent);
            clearTimeout(this.timeoutId);
            this.timeoutId = 0;
            this.windowResizeEventBound = false;
        }
    }

    /**
     * Remove screen orientation 'change' listener
     * @private
     */
    removeOrientationChangeListener() {
        if (this.windowOrientationEventBound && this.portraitMatchMedia) {
            this.portraitMatchMedia.removeEventListener(
                'change',
                this.screenOrientationChangeHandler
            );
            this.portraitMatchMedia = null;
            this.windowOrientationEventBound = false;
        }
        if (this.screenOrientationChangeHandler) {
            this.screenOrientationChangeHandler = null;
        }
    }

    /**
     * Add screen orientation 'change' listener.
     * orientation changes: 'portrait' -> 'landscape' -> 'portrait'
     */
    addOrientationChangeListener() {
        if (isCSR) {
            this.portraitMatchMedia = window.matchMedia(
                '(orientation: portrait)'
            );
            this.screenOrientationChangeHandler =
                this.handleWindowResizeEvent.bind(this);
            if (this.portraitMatchMedia) {
                this.portraitMatchMedia.addEventListener(
                    'change',
                    this.screenOrientationChangeHandler
                );
                this.windowOrientationEventBound = true;
            }
        }
    }

    /**
     * == W-12654751 P1 a11y bug ==
     *
     * Adds an event listener to listen and handle to 'focusin' events.
     * All Lightning Modals must trap user focus, while they are open.
     */
    addFocusinEventListener() {
        if (!this.focusinEventBound) {
            this.focusinEventBound = true;
            window.addEventListener(
                'focusin',
                modalFocusinEventHandler.bind(this)
            );
        }
    }

    /**
     * == W-12654751 P1 a11y bug ==
     *
     * Remove event listener for 'focusin' events, only when the base modal is closed.
     * No-op when modals stacked on top of a base modal are closed.
     */
    removeFocusinEventListener() {
        if (this.focusinEventBound) {
            this.focusinEventBound = false;
            window.removeEventListener(
                'focusin',
                modalFocusinEventHandler.bind(this)
            );
        }
    }

    handleModalBaseFocusin = modalFocusinEventHandler.bind(this);

    handleLastFocusedElem(e) {
        if (!(e.detail && e.detail[secure])) {
            console.error(
                'Invalid access to onprivatelightningmodallastfocus event'
            );
            return;
        }
        e.stopPropagation();

        this.lastFocusedElement = e.detail.privatelightningmodallastfocus;
    }

    /**
     * determine if the current screen is less than SMALL_SCREEN_SIZE
     * for Modal, screen size detection is simplified to what's required
     * for the size="full" feature addition, which is a single breakpoint
     * either (a) at or below 480 pixels (small = full screen modal behavior),
     * or (b) at or above 481 (large = default modal behavior)
     * @private
     */
    setIsSmallScreenSize() {
        if (isCSR) {
            const docElem = (document && document.documentElement) || null;
            const browserWidth = docElem
                ? docElem.clientWidth
                : window.innerWidth;
            const isSmallScreenSize = browserWidth <= SMALL_SCREEN_SIZE;
            if (isSmallScreenSize !== this.isSmallScreenSize) {
                this.isSmallScreenSize = isSmallScreenSize;
            }
        }
    }

    removeModalEventListeners() {
        this.removeWindowResizeEventListener();
        this.removeOrientationChangeListener();
        this.removeFocusinEventListener();
    }

    /**
     * When modal is being created, initialize
     * private tracked modal base/default state
     * this is a collection of state variables
     * that are not including modalHeader, modalBody,
     * modalFooter
     * @private
     */
    initBaseState() {
        // setting initialRender true handles the case where modal
        // is added / removed/added back to DOM
        this.initialRender = true;
        this.autoFocusCompletedOnce = false;
        this.windowResizeEventBound = false;
        this.timeoutId = 0;
        this.disableCloseButton = false;
        this.modalLabel = null;
        this.modalLabelledBy = null;
        this.modalDescribedBy = null;
        this.showAriaLiveMessage = false;
        this.ariaLiveMessage = '';
        this.savedInertElements = [];
        this.savedActiveElement = null;
        this.isModalOpen = false;
        this.isModalTransitioningIn = false;
        this.isModalClosing = false;
        // browser screen size
        this.isSmallScreenSize = null;
    }

    /**
     * Reset all modal state
     * @private
     */
    initModalState() {
        this.initBaseState();
        this.initHeaderState();
        this.initBodyState();
        this.initFooterState();
    }

    connectedCallback() {
        super.connectedCallback();
        this.initModalState();
        // check for screen size right away
        // not adding event listeners here,
        // as 'resize' and 'orientation' events
        // are utilized by modalBody, see registerBody()
        this.setIsSmallScreenSize();
    }

    disconnectedCallback() {
        this.removeModalEventListeners();
        this.closeModal();
    }

    renderedCallback() {
        if (this.initialRender) {
            this.openModal();
            this.initialRender = false;
        } else {
            // wait until lightning-modal is defined
            this.updateAriaLabel();
            this.updateAriaDescription();
            // queue show only once
            if (!this.isModalTransitioningIn) {
                this.queueShowModal();
            }
            // autoFocus once only
            if (!this.autoFocusCompletedOnce) {
                // check disableClose internal state and relevant DOM changes
                this.toggleDisableCloseButton();
                this.focusFirstElement();
            }
        }
        this.updateModalBodyHeight();
    }
}
