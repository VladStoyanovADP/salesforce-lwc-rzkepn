/* Contains methods for modal testing
 * All helper methods included expect that Webdriver
 *  is in scope: $, $$, browser, element
 */

const {
    OVERLAY_CONTAINER,
    MODAL_BASE,
    MODAL,
    MODAL_DIV_SLOT,
    MODAL_CONTAINER_DIV,
    MODAL_HEADER,
    MODAL_BODY,
    MODAL_BODY_DIV,
    MODAL_BODY_BACKDROP,
    MODAL_BODY_SLOT,
    MODAL_FOOTER,
    FOCUS_TRAP,
    MODAL_CLOSE_BTN,
    MODAL_CLOSE_BTN_CLASS,
    MODAL_CLOSE_BTN_FULL_CLASS,
    MODAL_CLOSE_BUTTON_FULL_VARIANT,
    MODAL_CLOSE_BUTTON_NORMAL_VARIANT,
    SCREEN_SIZE_LARGE,
    MODAL_SIZE_FULL,
    MODAL_FULL_SCREEN_SMALL_BREAKPOINT,
    MODAL_DEFAULT_PX_OFFSET_X,
    MODAL_ELEM_FULL_PX_OFFSET_X,
    MODAL_DEFAULT_SCREEN_USE_PERCENT,
    MODAL_FULL_SCREEN_USE_PERCENT,
    MAX_HEIGHT,
    MIN_HEIGHT,
    MODAL_BODY_MIN_HEIGHT_PX,
    SPEC_TO_TABS_TO_CLOSE_BTN,
    BROWSER_RESIZE_PAUSE,
    MODAL_RENDER_PAUSE,
    PAUSE_MICRO,
    SELECTORS,
    NAME_TO_SIZE,
    SCREEN_SIZE,
    KEY,
    MODAL_DESCRIPTION_SELECTOR,
    MODAL_ARIALIVE_SELECTOR,
} = require('./modalContainerTestConstants.js');

let wrapper = null;

// eslint-disable-next-line
async function clickButton(btnSelector) {
    // find the correct button, and click
    // to launch modal
    // eslint-disable-next-line
    wrapper = await kontajner.getWrapper();
    await wrapper.waitForDisplayed();
    const button = await wrapper.shadow$(btnSelector);
    await button.click();
}

// eslint-disable-next-line
async function getOverlayContainer() {
    // overlay container isn't present in the DOM
    // until first overlay or modal is created
    // eslint-disable-next-line no-undef
    const htmlElem = await $('html');
    // eslint-disable-next-line no-undef
    const bodyElem = await $('body');
    // eslint-disable-next-line no-undef
    const headElem = await $('head');
    // eslint-disable-next-line no-undef
    const overlayContainerElem = await $(OVERLAY_CONTAINER);
    return { htmlElem, bodyElem, headElem, overlayContainerElem };
}

// eslint-disable-next-line
async function setupStrategy() {
    // couldn't find a good strategy for access to the slot's content
    // using this technique requires that you return a single element
    // eslint-disable-next-line
    await browser.addLocatorStrategy(
        'getFirstSlotElement',
        (slotElem) => slotElem.assignedNodes()[0]
    );
    // eslint-disable-next-line
    await browser.addLocatorStrategy('getSlotElements', (slotElem) =>
        slotElem.assignedNodes()
    );
}

function isModalOfVariantType(modalVariantType, type) {
    if (!modalVariantType || !type) {
        return null;
    }
    const lowerCaseVariantType = modalVariantType.toLowerCase();
    return lowerCaseVariantType.includes(type);
}

/*
 * get all of the modal internals, top level elements only
 * to get contents of header, body, footer
 * use getModalHeaderInternals, getModalBodyInternals,
 * and getModalFooterInternals
 */
// eslint-disable-next-line
async function getModalInternals(config, modalIndex = 0) {
    const { modalVariantType } = config;
    expect(modalVariantType).not.toBeFalsy();
    // initialize returned values
    let modalBaseElem = null;
    let modalBaseElems = null;
    let modalBaseBackdropElem = null;
    let modalSectionElem = null;
    let modalAriaDescribedBySpanElem = null;
    let modalAriaLiveMessageSpanElem = null;
    let modalCloseButton = null;
    let modalDataSlot = null;
    let modalContainerElem = null;
    let modalElem = null;
    let modalHeaderElem = null;
    let modalBodyElem = null;
    let modalFooterElem = null;
    let focusTrapElem = null;
    let focusTrapSlotElem = null;

    // get overlay container
    const { overlayContainerElem } = await getOverlayContainer();
    // get modal base element
    if (modalIndex === 0) {
        modalBaseElem = await overlayContainerElem.shadow$(MODAL_BASE);
    } else {
        modalBaseElems = await overlayContainerElem.shadow$$(MODAL_BASE);
        const modalBaseElemRequested = await modalBaseElems[modalIndex];
        modalBaseElem = modalBaseElemRequested ? modalBaseElemRequested : null;
    }

    const modalBaseExists = await modalBaseElem.isExisting();
    // if modal base exists, continue getting modal internals
    if (modalBaseExists) {
        // get modal base element backdrop
        modalBaseBackdropElem = await modalBaseElem.shadow$(
            MODAL_BODY_BACKDROP
        );

        // get focus trap element
        focusTrapElem = await modalBaseElem.shadow$(FOCUS_TRAP);
        focusTrapSlotElem = await focusTrapElem.shadow$('slot');
        // get modal's <section> element just inside focus trap
        // eslint-disable-next-line
        modalSectionElem = await browser.custom$(
            'getFirstSlotElement',
            focusTrapSlotElem
        );
        // get modal data-aria-description
        modalAriaDescribedBySpanElem = await modalSectionElem.$(
            MODAL_DESCRIPTION_SELECTOR
        );

        //get modal data-aria-live-message
        modalAriaLiveMessageSpanElem = await modalSectionElem.$(
            MODAL_ARIALIVE_SELECTOR
        );

        // get modal close button
        modalCloseButton = await modalSectionElem.$(MODAL_CLOSE_BTN);

        // get modal div slot (not an actual slot)
        modalDataSlot = await modalSectionElem.$(MODAL_DIV_SLOT);
        // get div[data-container].slds-modal__container
        modalContainerElem = await modalSectionElem.$(MODAL_CONTAINER_DIV);
        // get lightning-modal element
        modalElem = await modalSectionElem.$(MODAL);

        // get lightning-modal-body, it doesn't always exist
        // but in our examples it's always present
        modalBodyElem = await modalElem.shadow$(MODAL_BODY);

        // skip looking for modalHeader when type of modal is 'headless'
        if (!isModalOfVariantType(modalVariantType, 'headless')) {
            // get lightning-modal-header, it doesn't always exist
            modalHeaderElem = await modalElem.shadow$(MODAL_HEADER);
        }

        // skip looking for modalHeader when type of modal is 'footless'
        if (!isModalOfVariantType(modalVariantType, 'footless')) {
            // get lightning-modal-footer, it doesn't always exist
            modalFooterElem = await modalElem.shadow$(MODAL_FOOTER);
        }
    }
    return {
        modalBaseExists,
        modalBaseElem,
        modalBaseBackdropElem,
        modalSectionElem,
        modalAriaDescribedBySpanElem,
        modalAriaLiveMessageSpanElem,
        modalCloseButton,
        modalDataSlot,
        modalContainerElem,
        modalElem,
        modalHeaderElem,
        modalBodyElem,
        modalFooterElem,
        focusTrapElem,
        focusTrapSlotElem,
    };
}

/*
 * gets the internal elements of lightning-modal-header component
 */
// eslint-disable-next-line @lwc/lwc/no-async-await
async function getModalHeaderInternals(headerElem) {
    if (!headerElem) {
        return null;
    }
    let headerOuterDiv = null;
    let headerHeading = null;
    let headerSlot = null;

    if (headerElem) {
        headerOuterDiv = await headerElem.shadow$('.slds-modal__header');
        headerHeading = await headerElem.shadow$('[data-label]');
        headerSlot = await headerElem.shadow$('[data-default-slot]');
    }
    return {
        headerOuterDiv,
        headerHeading,
        headerSlot,
    };
}

/*
 * gets the internal elements of lightning-modal-body component
 */
// eslint-disable-next-line @lwc/lwc/no-async-await
async function getModalBodyInternals(bodyElem) {
    if (!bodyElem) {
        return null;
    }
    let bodyOuterDiv = null;
    let bodySlotContents = null;
    if (bodyElem) {
        bodyOuterDiv = await bodyElem.shadow$(MODAL_BODY_DIV);
        const bodySlot = await bodyElem.shadow$(MODAL_BODY_SLOT);
        // eslint-disable-next-line no-undef
        bodySlotContents = await browser.custom$('getSlotElements', bodySlot);
    }
    return {
        bodyOuterDiv,
        bodySlotContents,
    };
}

/*
 * gets the internal elements of lightning-modal-footer component
 */
// eslint-disable-next-line @lwc/lwc/no-async-await
async function getModalFooterInternals(footerElem) {
    if (!footerElem) {
        return null;
    }
    let footerOuterDiv = null;
    let footerSlotContents = null;
    if (footerElem) {
        footerOuterDiv = await footerElem.shadow$('.slds-modal__footer');
        const footerSlot = await footerElem.shadow$('[data-footer-slot]');
        // eslint-disable-next-line no-undef
        footerSlotContents = await browser.custom$(
            'getSlotElements',
            footerSlot
        );
    }
    return {
        footerOuterDiv,
        footerSlotContents,
    };
}

// get a specific element from the modal footer
// eslint-disable-next-line @lwc/lwc/no-async-await
async function getElementInModalFooter(
    footerSlotContents,
    selector,
    elemIndex = 0
) {
    let element = null;
    const elements = await footerSlotContents.$$(selector);
    if (elements) {
        element = await elements[elemIndex];
    }
    return element;
}

// eslint-disable-next-line @lwc/lwc/no-async-await
async function getNumModals() {
    // initialize returned values
    let numModals = 0;
    // get overlay container
    const { overlayContainerElem } = await getOverlayContainer();
    // get modal base elements
    const modalBaseElems = await overlayContainerElem.shadow$$(MODAL_BASE);
    if (modalBaseElems) {
        numModals = modalBaseElems.length;
    }
    return numModals;
}

/*
 * Function includes expect tests to validate the expected
 * modal close button variant set based on screen size,
 * size attribute, and modalVariant, and actual screen size that was set.
 */
// eslint-disable-next-line @lwc/lwc/no-async-await
async function validateModalCloseButtonAttributes(config) {
    const { modalSize } = config;

    // first, get window size
    // eslint-disable-next-line no-undef
    const { width: windowWidth } = await browser.getWindowSize();
    let modalCloseButtonVariant = null;
    let modalCloseButtonCssClass = null;
    const { modalCloseButton } = await getModalInternals(config);
    if (modalCloseButton) {
        modalCloseButtonVariant = await modalCloseButton.getAttribute(
            'variant'
        );
        modalCloseButtonCssClass = await modalCloseButton.getAttribute('class');
    }

    // variant and css class should always be set
    // to a value. specific checks based on full
    // screen behavior occur below
    expect(modalCloseButtonVariant).not.toBeNull();
    expect(modalCloseButtonCssClass).toContain(MODAL_CLOSE_BTN_CLASS);

    // the only time size='full' actual renders full page width and height
    // is when windowWidth is set <= 480px (30em)
    if (
        modalSize === MODAL_SIZE_FULL &&
        windowWidth <= MODAL_FULL_SCREEN_SMALL_BREAKPOINT
    ) {
        expect(modalCloseButtonVariant).toEqual(
            MODAL_CLOSE_BUTTON_FULL_VARIANT
        );

        expect(modalCloseButtonCssClass).toContain(MODAL_CLOSE_BTN_FULL_CLASS);
    } else {
        // 'small', 'medium', 'large', and ('full' when windowWidth is set > 480px (30em)) are normal modal behavior
        expect(modalCloseButtonVariant).toEqual(
            MODAL_CLOSE_BUTTON_NORMAL_VARIANT
        );
        expect(modalCloseButtonCssClass).not.toContain(
            MODAL_CLOSE_BTN_FULL_CLASS
        );
    }
}

/*
 * get some of the modal internals element details
 * including offset values and classes
 * utilizes DOM based approach via browser.execute
 */
// eslint-disable-next-line @lwc/lwc/no-async-await
async function getModalInternalsDomBased() {
    // eslint-disable-next-line no-undef
    const result = await browser.execute(() => {
        // down the modal dom tree
        // eslint-disable-next-line @lwc/lwc/no-document-query
        const loc = document.querySelector('lightning-overlay-container');
        const modalBase = loc.shadowRoot.querySelector('lightning-modal-base');
        const modalBackdrop =
            modalBase.shadowRoot.querySelector('.slds-backdrop');
        const focusTrap = modalBase.shadowRoot.querySelector(
            'lightning-focus-trap'
        );
        const focusTrapSlot = focusTrap.shadowRoot.querySelector('slot');
        const modalSectionElem = focusTrapSlot.assignedNodes()[0];
        const modalContainerElem = modalSectionElem.querySelector(
            '.slds-modal__container'
        );
        const modalCloseButton = modalSectionElem.querySelector(
            'lightning-button-icon'
        );
        const modalElem = modalSectionElem.querySelector('lightning-modal');
        return {
            window: {
                width: window.innerWidth,
                height: window.innerHeight,
            },
            modalBase: {
                offset: modalBase.getBoundingClientRect(),
            },
            modalBackdrop: {
                offset: modalBackdrop.getBoundingClientRect(),
            },
            modalSectionElem: {
                class: modalSectionElem.getAttribute('class'),
                offset: modalSectionElem.getBoundingClientRect(),
            },
            modalContainerElem: {
                class: modalContainerElem.getAttribute('class'),
                offset: modalContainerElem.getBoundingClientRect(),
            },
            modalCloseButton: {
                class: modalCloseButton.getAttribute('class'),
            },
            modalElem: {
                offset: modalElem.getBoundingClientRect(),
            },
        };
    });
    return result;
}

/* Function includes expect tests to validate the expected
 * modal HEIGHT behavior based on screen size, size attribute,
 * and modalVariant, and actual screen size that was set.
 * Validating height: use wdio getSize('height') to determine
 * height of modal child elements and calculate % of screen height
 * utilization
 */
// eslint-disable-next-line @lwc/lwc/no-async-await
async function validateModalHeightBehavior(config) {
    const { modalSize, modalVariantType } = config;
    // first, get size of browser window
    // typically openModal has already been called, so the
    // window has been resized
    const { height: windowHeight, width: windowWidth } =
        // eslint-disable-next-line no-undef
        await browser.getWindowSize();

    // get child elements element for min and max height values
    const { modalHeaderElem, modalBodyElem, modalFooterElem } =
        await getModalInternals(config);
    const { bodyOuterDiv } = await getModalBodyInternals(modalBodyElem);
    const modalBodyOuterDivStyle = await bodyOuterDiv.getAttribute('style');
    const modalBodyStyleProps = parseStyleAttributes(modalBodyOuterDivStyle);

    // based on variant, determine which types of tests will run
    const isVariantHeadless = isModalOfVariantType(
        modalVariantType,
        'headless'
    );
    const isVariantFootless = isModalOfVariantType(
        modalVariantType,
        'footless'
    );

    // modalBody is always present in the examples
    const heightBody = (await bodyOuterDiv.getSize('height')) || 0;

    // calculate the total height of the child elements present
    let totalModalElemHeight = heightBody;

    // modalHeader is not always present in the examples
    if (!isVariantHeadless) {
        const { headerOuterDiv } = await getModalHeaderInternals(
            modalHeaderElem
        );
        const heightHdr = await headerOuterDiv.getSize('height');
        if (heightHdr > 0) {
            totalModalElemHeight += heightHdr;
        }
    }

    // modalFooter is not always present in the examples
    if (!isVariantFootless) {
        const { footerOuterDiv } = await getModalFooterInternals(
            modalFooterElem
        );
        const heightFtr = await footerOuterDiv.getSize('height');
        if (heightFtr > 0) {
            totalModalElemHeight += heightFtr;
        }
    }

    // calculate the percentage of the browser
    const percentPageHeightUtilized = totalModalElemHeight / windowHeight;

    // modalFooter is not always present in the examples
    if (!isVariantFootless) {
        const { footerOuterDiv } = await getModalFooterInternals(
            modalFooterElem
        );
        const heightFtr = await footerOuterDiv.getSize('height');
        if (heightFtr > 0) {
            totalModalElemHeight += heightFtr;
        }
    }

    // the only time size='full' actual renders full page width and height
    // is when windowWidth is set <= 480px (30em)
    // note: testing total browser pixel height utilized by the three child
    // components tends to be the most reliable means of testing height
    // instead of using location, which the validateModalWidthBehavior
    // function utilizes
    if (
        modalSize === MODAL_SIZE_FULL &&
        windowWidth <= MODAL_FULL_SCREEN_SMALL_BREAKPOINT
    ) {
        // in full screen mode, the modal utilizes more than 92%
        // of the screen height
        expect(percentPageHeightUtilized).toBeGreaterThan(
            MODAL_FULL_SCREEN_USE_PERCENT
        );
        // these next two tests are proxy behavior indicating
        // that the event listeners, and rendering has updated
        // to make the modal go full height
        // these values are not set after the SLDS based
        // CSS grid implementation was implemented
        expect(modalBodyStyleProps[MAX_HEIGHT]).toBeUndefined();
        expect(modalBodyStyleProps[MIN_HEIGHT]).toBeUndefined();

        // default modal behavior scenario
    } else {
        // in default modal behavior, the modal utilizes less than 88%
        // of the screen height
        expect(percentPageHeightUtilized).toBeLessThan(
            MODAL_DEFAULT_SCREEN_USE_PERCENT
        );
        // these next two sets of tests are proxy behavior indicating
        // that the event listeners, and rendering has updated
        // to make the modal exhibit normal height behavior (not full screen)
        expect(modalBodyStyleProps[MAX_HEIGHT]).toBeDefined();
        expect(modalBodyStyleProps[MIN_HEIGHT]).toBeDefined();
        expect(modalBodyStyleProps[MAX_HEIGHT]).not.toEqual(
            modalBodyStyleProps[MIN_HEIGHT]
        );
        expect(modalBodyStyleProps[MIN_HEIGHT]).toEqual(
            MODAL_BODY_MIN_HEIGHT_PX
        );
    }
}

/* Function includes expect tests to validate the expected
 * modal WIDTH behavior based on screen size, size attribute,
 * and modalVariant, and actual screen size that was set.
 * The mechanism utilized to validate modal width behavior
 * is using wdio getLocation() to get and measure X location
 * for the child elements of modal
 * Validating width: use wdio getLocation() on modal child
 * elements to measure X location (ie x,y coordinates in viewport)
 */
// eslint-disable-next-line @lwc/lwc/no-async-await
async function validateModalWidthBehavior(config) {
    const { modalSize, modalVariantType } = config;
    // first, get size of browser window
    // typically openModal has already been called, so the
    // window has been resized

    // eslint-disable-next-line no-undef
    const { width: windowWidth } = await browser.getWindowSize();

    // get child elements element for min and max height values
    const { modalHeaderElem, modalBodyElem, modalFooterElem } =
        await getModalInternals(config);

    const { bodyOuterDiv } = await getModalBodyInternals(modalBodyElem);

    // based on variant, determine which types of tests will run
    const isVariantHeadless = isModalOfVariantType(
        modalVariantType,
        'headless'
    );
    const isVariantFootless = isModalOfVariantType(
        modalVariantType,
        'footless'
    );

    // setup conditional test values for modalHeader, modalFooter
    let locHeaderX = null,
        locFooterX = null;

    // modalBody is always present in the examples
    const { x: locBodyX } = await bodyOuterDiv.getLocation();

    // modalHeader is not always present in the examples
    if (!isVariantHeadless) {
        const { headerOuterDiv } = await getModalHeaderInternals(
            modalHeaderElem
        );
        const locHeader = await headerOuterDiv.getLocation();
        if (locHeader) {
            locHeaderX = locHeader.x;
        }
    }
    // modalFooter is not always present in the examples
    if (!isVariantFootless) {
        const { footerOuterDiv } = await getModalFooterInternals(
            modalFooterElem
        );
        const locFooter = await footerOuterDiv.getLocation();
        if (locFooter) {
            locFooterX = locFooter.x;
        }
    }

    // the only time size='full' actual renders full page width and height
    // is when windowWidth is set <= 480px
    if (
        modalSize === MODAL_SIZE_FULL &&
        windowWidth <= MODAL_FULL_SCREEN_SMALL_BREAKPOINT
    ) {
        // some example values when in full screen modal behavior
        // consistently the X position represents the left edge of the element
        // within the UI.  in the case of full screen behavior,
        // the x value should be 0, and something greater than zero when in
        // default modal screen behavior (typically 38px)
        // typical values for child elements
        // locHeader:  { x: 0, y: 48 }
        // locBody:  { x: 0, y: 167.625 }
        // locFooter:  { x: 0, y: 792 }
        // only evaluate modalFooter, when present
        if (!isVariantFootless) {
            expect(locFooterX).toEqual(MODAL_ELEM_FULL_PX_OFFSET_X);
        }

        // only evaluate modalHeader, when present
        if (!isVariantHeadless) {
            expect(locHeaderX).toEqual(MODAL_ELEM_FULL_PX_OFFSET_X);
        }

        // always evaluate modalBody location (always present in examples)
        expect(locBodyX).toEqual(MODAL_ELEM_FULL_PX_OFFSET_X);
    } else {
        // 'small', 'medium', 'large', and ('full' when windowWidth is set > 480px (30em))
        // are normal modal behavior.  typically the element's
        // X location value is ~38px
        // location values vary based on screen and size value
        // some typical values when in default screen behavior
        // locHeader:  { x: 38.40625, y: 338.46875 }
        // locBody:  { x: 38.40625, y: 437.53125 }
        // locFooter:  { x: 38.40625, y: 338.46875 }

        // modalFooter is NOT always present in the examples
        if (!isVariantFootless) {
            expect(locFooterX).toBeGreaterThan(MODAL_DEFAULT_PX_OFFSET_X);
        }
        // modalHeader is NOT always present in the examples
        if (!isVariantHeadless) {
            expect(locHeaderX).toBeGreaterThan(MODAL_DEFAULT_PX_OFFSET_X);
        }
        // modalBody is always present in the examples
        expect(locBodyX).toBeGreaterThan(MODAL_DEFAULT_PX_OFFSET_X);
    }
}

// convert from screen size label to actual pixel values
const getScreenSizeValues = (size = SCREEN_SIZE_LARGE) => {
    if (!size) {
        return null;
    }
    return SCREEN_SIZE[size];
};

// convert from modal name label (all, footless) to
// the size value that is set (small, large, full)
// for that modal example
const getModalSizeFromName = (name = 'all') => {
    if (!name) {
        return null;
    }
    return NAME_TO_SIZE[name];
};

/*
 * Function to set window size to requested values
 */
// eslint-disable-next-line @lwc/lwc/no-async-await
async function setWindowSize(screenSizeToSet) {
    // set screen size for testing modal behavior
    const { width, height } = getScreenSizeValues(screenSizeToSet);

    // eslint-disable-next-line no-undef
    await browser.setWindowSize(width, height);
    // eslint-disable-next-line no-undef
    await browser.pause(BROWSER_RESIZE_PAUSE);
}

/*
 * Function to open a modal based on the config passed in
 */
// eslint-disable-next-line @lwc/lwc/no-async-await
async function openModal({
    modalVariantType = '',
    screenSizeToSet = SCREEN_SIZE_LARGE,
    runMockMatchMedia = false,
}) {
    if (!modalVariantType) {
        expect(modalVariantType).not.toEqual('');
        return false;
    }
    // run matchMedia, if needed
    if (runMockMatchMedia) {
        await mockMatchMedia();
    }

    // set a specific window size based on sizing descriptor (SMALL, MEDIUM)
    await setWindowSize(screenSizeToSet);

    // find the button that launches the modal, and click
    const modalBtnSelector = SELECTORS[modalVariantType];

    await clickButton(modalBtnSelector);
    // eslint-disable-next-line no-undef
    await browser.pause(MODAL_RENDER_PAUSE);
    return true;
}

/*
 * Provides a means of verifying that the html and type
 * for the element details passed in match the attributes
 * of the modal's close button
 */
function isModalCloseButton(info) {
    if (!info) {
        expect(info).not.toBeFalsy();
    }
    const { html, type } = info;
    const isTypeButton = type === 'button';
    const hasCorrectSldsClasses =
        html.indexOf('slds-button') >= 0 &&
        html.indexOf('slds-button_icon') >= 0;
    const hasCorrectText = html.indexOf('Cancel and close') >= 0;
    return (isTypeButton && hasCorrectSldsClasses && hasCorrectText) || false;
}

/*
 * Function to close a modal based on the config passed in
 */
// eslint-disable-next-line @lwc/lwc/no-async-await
async function closeModal(config, modalIndex = 0, closeMethod = 'click') {
    if (typeof modalIndex !== 'number' && modalIndex >= 0) {
        console.error(
            'closeModal :: requires modalIndex value to correctly function'
        );
    }
    if (closeMethod === 'click') {
        const { modalCloseButton } = await getModalInternals(
            config,
            modalIndex
        );
        if (modalCloseButton) {
            await modalCloseButton.click();
            // eslint-disable-next-line no-undef
            await browser.pause(MODAL_RENDER_PAUSE);
        }
    } else if (closeMethod === KEY.ENTER || closeMethod === KEY.SPACE) {
        // this method assumes you have already placed focus on the close button
        // since there is no webdriver means of setting focus
        // for example, this isn't possible: await modalCloseButton.focus()
        const activeElement = await getActiveShadowElement();
        const closeButtonIsFocused = isModalCloseButton(activeElement);
        expect(closeButtonIsFocused).toBeTrue();
        if (closeButtonIsFocused) {
            // eslint-disable-next-line no-undef
            await browser.keys(closeMethod);
            // eslint-disable-next-line no-undef
            await browser.pause(MODAL_RENDER_PAUSE);
        }
    } else if (closeMethod === KEY.ESC) {
        // eslint-disable-next-line no-undef
        await browser.keys(closeMethod);
        // eslint-disable-next-line no-undef
        await browser.pause(MODAL_RENDER_PAUSE);
    }
}

/*
 * Function to mock up matchMedia for reduced motion
 */
// eslint-disable-next-line @lwc/lwc/no-async-await
async function mockMatchMedia() {
    // eslint-disable-next-line no-undef
    await browser.execute(() => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: () => ({
                matches: true,
                media: '(prefers-reduced-motion: reduce)',
            }),
        });
    });
}

// eslint-disable-next-line @lwc/lwc/no-async-await
async function checkBackgroundElemForInertness(elems, expectedValue = true) {
    return Promise.all(
        // eslint-disable-next-line @lwc/lwc/no-async-await
        elems.map(async (elem) => {
            const elemType = await elem.getTagName();
            const initAriaHiddenValue = await elem.getAttribute('aria-hidden');
            const ariaHiddenValue =
                initAriaHiddenValue === 'true' ? true : null;
            // these shouldn't have aria-hidden applied
            if (
                elemType === 'lightning-overlay-container' ||
                elemType === 'lightning-primitive-bubble'
            ) {
                return;
            }
            // if the element isn't in the approved group, make sure it aria-hidden value is set correctly
            const messageIfFails = `${elemType} should have aria-hidden set ${expectedValue}, but was ${ariaHiddenValue}`;
            expect(ariaHiddenValue).toEqual(expectedValue, messageIfFails);
        })
    );
}

// validateInertness checks two things:
// (a) aria-hidden is set correctly based on parameter 'on'
// (b) validates HEAD element doesn't receive aria-hidden
// eslint-disable-next-line @lwc/lwc/no-async-await
async function validateInertness(bgInert = true) {
    // aria-hidden = true equivalent to ON
    // aria-hidden not set (null) equivalent to OFF
    const ariaHiddenValue = bgInert ? true : null;
    // get elements
    // eslint-disable-next-line no-undef
    const htmlElem = await $('html');
    const rootElemsToCheck = await htmlElem.$$('body > *');
    // clear undefined elements
    const rootElemsCleaned = await rootElemsToCheck.filter((elem) =>
        Boolean(elem)
    );

    // get HEAD aria-hidden value
    // eslint-disable-next-line no-undef
    const headElem = await $('head');
    const headAriaHiddenValueCheck = await headElem.getAttribute('aria-hidden');
    // HEAD element should NEVER have inert applied
    expect(headAriaHiddenValueCheck).toBeNull();
    // check body elements to verify they have been set inert
    await checkBackgroundElemForInertness(rootElemsCleaned, ariaHiddenValue);
}

// function to enable forward and reverse tab navigation
// positive number = number of tabs to navigate forward
// negative number = number of tabs to navigate backward (shift + tab)
// eslint-disable-next-line @lwc/lwc/no-async-await
async function repeatTab(tabCount = 0) {
    // check to see if reverse or forward tab direction
    if (tabCount !== 0) {
        const shouldShiftTab = tabCount < 0;
        const numTabs = Math.abs(tabCount);
        for (let count = numTabs; count > 0; count--) {
            /* eslint-disable */
            if (shouldShiftTab) {
                await browser.keys([KEY.SHIFT, KEY.TAB, 'NULL']);
            } else {
                await browser.keys(KEY.TAB);
            }
            /* eslint-enable */
        }
        // unset 'Shift' key after multiple tabs applied
        if (shouldShiftTab) {
            // eslint-disable-next-line no-undef
            await browser.keys(KEY.SHIFT);
        }
    }
}

// expects positive number of times to repeat
// and key to send
// eslint-disable-next-line @lwc/lwc/no-async-await
async function repeatKey(repeatCount = 0, keyName) {
    // check to see if reverse or forward tab direction
    if (repeatCount > 0 || !keyName) {
        for (let count = Math.abs(repeatCount); count > 0; count--) {
            /* eslint-disable */
            await browser.keys(keyName);
            // pause is needed for the browser to recognize all of the key clicks
            await browser.pause(PAUSE_MICRO);
            /* eslint-enable */
        }
    }
}

// expects positive number of times to repeat
// and key to send
// eslint-disable-next-line @lwc/lwc/no-async-await
async function typeLetters(word) {
    // check to see if reverse or forward tab direction
    if (word && word.length > 0) {
        const arrOfLetters = word.split('');
        for (let count = 0; count < arrOfLetters.length; count++) {
            const letterToType = arrOfLetters[count];
            /* eslint-disable */
            await browser.keys(letterToType);
            // pause is needed for the browser to recognize all of the key clicks
            await browser.pause(PAUSE_MICRO);
            /* eslint-enable */
        }
    }
}

// Fills out a form using provided data
// Assumes the first item in the form is already focused
// Based on type of element executes different input strategies
// eslint-disable-next-line @lwc/lwc/no-async-await
async function fillForm({ data = [], tabToFormAction = 0 }) {
    if (!data || data.length === 0) {
        console.error('fillForm :: requires data array of fields');
    }
    for (let count = 0; count < data.length; count++) {
        const { name, value, type, numTabsToNext } = data[count];
        /* eslint-disable */
        if (type === 'text') {
            await browser.keys(value);
        } else if (type === 'combobox') {
            if (typeof value === 'number') {
                await browser.keys('Enter');
                await repeatKey(value, 'ArrowDown');
                await browser.keys('Enter');
            } else {
                await browser.keys('Enter');
                await typeLetters(value);
                await browser.keys('Enter');
            }
        } else if (type === 'datepicker') {
            await browser.keys(value);
            await browser.keys('Enter');
        } else if (type === 'timepicker') {
            // timepicker is a combobox
            await browser.keys('Enter');
            await repeatKey(value, 'ArrowDown');
            await browser.keys('Enter');
        } else if (type === 'heading') {
            // focus is on heading, move on
        } else {
            console.error(
                "fillForm :: Ooops, shouldn't happen: ",
                name,
                ' field'
            );
        }
        if (numTabsToNext !== 0) {
            await repeatTab(numTabsToNext);
        }
        /* eslint-enable */
    }

    // finished filling out the form
    // navigate to button to click and submit the form
    if (tabToFormAction > 0) {
        // number of tabs from last element to submit button
        await repeatTab(tabToFormAction);
        // submit the form
        // eslint-disable-next-line
        await browser.keys('Enter');
    }
}

// loop through received data, and validate
function validateData(verifyData, origData) {
    if (!verifyData || !origData) {
        console.error('validateData :: missing data');
    }
    const dataValidated = {};
    let countInvalidData = 0;
    let cleanedStr;
    let cleanedData;
    if (typeof verifyData === 'string') {
        cleanedStr = verifyData.replace(/\\/g, '');
        const unwantedChar = '"';
        if (cleanedStr.charAt(0) === unwantedChar) {
            cleanedStr = cleanedStr.substring(1, cleanedStr.length - 1);
        }
        if (cleanedStr.charAt(cleanedStr.length - 1) === unwantedChar) {
            cleanedStr = cleanedStr.substring(0, cleanedStr.length);
        }
        cleanedData = JSON.parse(cleanedStr);
    }
    const data = cleanedData ? cleanedData : verifyData;
    origData.forEach((item) => {
        const { name, value, result } = item;
        const hasKeys = name ? name.indexOf('.') >= 0 : false;
        const keys = hasKeys ? name.split('.') : [name];
        const originalValue = String(result ? result : value);
        // this is simplified structure
        // assumes only two object levels
        const receivedValue =
            keys.length === 2
                ? String(data[keys[0]][keys[1]])
                : String(data[keys[0]]);
        const valuesMatch = receivedValue === originalValue;
        if (valuesMatch === false) {
            countInvalidData++;
        }
        dataValidated[name] = receivedValue === originalValue;
    });

    return {
        incorrectValues: countInvalidData,
        dataValidated,
    };
}

// function to recurse .activeElement, since each
// shadow root can have it's own active element
// returns outerHTML and localName of each active element
// eslint-disable-next-line @lwc/lwc/no-async-await
async function getActiveShadowElements() {
    // eslint-disable-next-line no-undef
    return browser.execute(function () {
        let activeElement = document.activeElement;
        const activeElements = [];
        while (
            activeElement &&
            activeElement.shadowRoot &&
            activeElement.shadowRoot.activeElement
        ) {
            const elem = {
                type: activeElement.localName,
                html: null,
            };
            // eslint-disable-next-line @lwc/lwc/no-inner-html
            if (activeElement.outerHTML) {
                // eslint-disable-next-line @lwc/lwc/no-inner-html
                elem.html = activeElement.outerHTML;
            }
            activeElements.push(elem);
            activeElement = activeElement.shadowRoot.activeElement;
        }
        if (activeElement) {
            const elem = {
                type: activeElement.localName,
                html: null,
            };
            // eslint-disable-next-line @lwc/lwc/no-inner-html
            if (activeElement.outerHTML) {
                // eslint-disable-next-line @lwc/lwc/no-inner-html
                elem.html = activeElement.outerHTML;
            }
            activeElements.push(elem);
        }
        return activeElements;
    });
}

// eslint-disable-next-line @lwc/lwc/no-async-await
async function getActiveShadowElement() {
    const allActiveShadowElements = await getActiveShadowElements();
    if (allActiveShadowElements) {
        const activeElemsLength = allActiveShadowElements.length;
        return allActiveShadowElements[activeElemsLength - 1];
    }
    return [];
}

// recurse using document.activeElement until reaching lightning-modal
// then get details
// eslint-disable-next-line @lwc/lwc/no-async-await
async function getCalendarDetail() {
    // eslint-disable-next-line
    return browser.execute(function () {
        let activeElement = document.activeElement;
        let details;
        let nodes;
        let calendarStyles = {};
        let activeElements = [];
        const CALENDAR = 'lightning-calendar';

        function getStylesObj(str = '') {
            let styleObj = {};
            const stylesStr = str.replace(/ /g, '');
            const styleArr = stylesStr.split(';');
            styleArr.forEach((string) => {
                const [key, value] = string.split(':');
                if (key && value && !styleObj[key]) {
                    let num = null;
                    if (value.indexOf('px') > 0) {
                        num = value.substring(0, value.length - 2);
                    }
                    if (key === 'z-index') {
                        num = value;
                    }
                    styleObj[key] = num ? Number(num) : value;
                }
            });
            return styleObj;
        }

        // loop through activeElement shadow until we find
        // the lightning-calendar, then retrieve details
        while (
            activeElement &&
            activeElement.shadowRoot &&
            activeElement.shadowRoot.activeElement
        ) {
            const type = activeElement.localName;
            activeElements.push(type);
            // eventually we reach lightning-calendar element
            if (type === CALENDAR) {
                const shadowRoot = activeElement.shadowRoot;
                nodes = Array.from(shadowRoot.childNodes);
                const nodeObj = nodes[0];
                const nodeObjStyleAttr = nodeObj.getAttribute('style');
                calendarStyles = getStylesObj(nodeObjStyleAttr);
                details = {
                    calendarType: true,
                    calendarStyles,
                };
            }
            activeElement = activeElement.shadowRoot.activeElement;
        }
        return details;
    });
}

/*
 * Function to parse the style attributes from an element
 * in the case of px values, it converts the
 * '101px' (string) to 101 (number)
 * returning this as a style object
 */
function parseStyleAttributes(styleString) {
    if (!styleString) {
        return {};
    }

    let styleProps = {};
    let stylesSplit = styleString.trim().split('; ');
    if (stylesSplit && stylesSplit.length > 0) {
        stylesSplit = stylesSplit.forEach((style) => {
            const updatedStyle = style.replace(';', '').replace(':', '').trim();
            const propSplit = updatedStyle.split(' ');
            if (propSplit) {
                const name = propSplit[0];
                let value = propSplit[1];
                // convert px values into numbers
                if (value.includes('px')) {
                    value = Math.floor(Number(value.split('px')[0]));
                }
                styleProps[name] = value;
            }
        });
    }
    return styleProps;
}

// Validates what shadow element is active after
// either opening or closing the modal, which can be used
// to validate first element focused on modal open
// and last element focused after modal closed
// eslint-disable-next-line @lwc/lwc/no-async-await
async function validateModalFocus({
    html = '',
    type = '',
    whichArrayElem = '',
}) {
    // prevent null values from being passed immediately
    expect(html).not.toBeFalsy();
    expect(type).not.toBeFalsy();

    // get active shadow elements for comparison
    const activeElemArr = await getActiveShadowElements();

    let penultimateElem;
    const len = activeElemArr.length;
    const lastElem = activeElemArr[len - 1];
    // set default values for the html and type to use
    let actualHtml = lastElem.html;
    let actualType = lastElem.type;

    // only concerned with <button> inside a few specific use cases
    // where the data-focus attribute won't be passed down
    if (
        len > 1 &&
        actualType &&
        actualType === 'button' &&
        whichArrayElem === 'penultimate'
    ) {
        penultimateElem = activeElemArr[len - 2];
        const { type: penultimateElemType, html: penultimateElemHtml } =
            penultimateElem;
        // cover case element is normal button, not using LWC lightning-button
        if (
            penultimateElemType &&
            [
                'lightning-button',
                'lightning-button-icon',
                'lightning-helptext',
            ].some((val) => penultimateElemType === val)
        ) {
            actualHtml = penultimateElemHtml;
            actualType = penultimateElemType;
        }
    }
    // validate the correct element is initially focused
    expect(actualHtml).toContain(html);
    expect(actualType).toEqual(type);
    return { html: actualHtml, type: actualType };
}

// Validates mumber of modals open at two separate
// eslint-disable-next-line @lwc/lwc/no-async-await
async function validateNumModals(values, checkNow = false) {
    // prevent null values from being passed immediately
    expect(values).not.toBeFalsy();
    // in immediate use case scenario, get current num modals
    let numCurrentModals = null;
    if (checkNow) {
        numCurrentModals = await getNumModals();
    }

    // handles multiple value checks at once
    // [{actual, expected}, {actual, expected}, {actual, expected}]
    if (Array.isArray(values)) {
        values.forEach(({ actual = null, expected = null }) => {
            if (actual === null || actual === undefined) {
                expect(numCurrentModals).toEqual(expected);
            } else {
                expect(actual).toEqual(expected);
            }
        });
        // covers the single value immediate check
        // { expected }
    } else if (typeof values === 'object') {
        const { actual, expected } = values;
        if (actual === null || actual === undefined) {
            expect(numCurrentModals).toEqual(expected);
        } else {
            expect(actual).toEqual(expected);
        }
    } else {
        console.error(
            'validateNumModals expects an array of objects, or an object'
        );
    }
}

// the number of tab keys to hit is dependent
// on the specific examples for a particular suite
// of tests.  have to look up value with this method
function getNumTabsToCloseButton(spec = '', modalVariantType = '') {
    expect(spec).toBeTruthy();
    expect(modalVariantType).toBeTruthy();
    if (spec && modalVariantType) {
        return SPEC_TO_TABS_TO_CLOSE_BTN[spec][modalVariantType] || 0;
    }
    return 0;
}

// This function validates focus:
// (a) the correct element is focused after modal opens
// (b) the correct element is focused after modal closes
// by doing this we are exercising focus code features:
// 'focus first', 'focus after' in modalBase
// eslint-disable-next-line @lwc/lwc/no-async-await
async function validateModalOpenCloseFocusBehavior(
    config,
    expectedAfterOpen,
    expectedAfterClose,
    closeMethod = 'click',
    spec = 'accessibility'
) {
    expect(config).not.toBeFalsy();
    expect(expectedAfterOpen).not.toBeFalsy();
    expect(expectedAfterClose).not.toBeFalsy();

    // start by opening the modal
    await openModal(config);

    // AFTER Modal open, test focus is on the correct element
    await validateModalFocus(expectedAfterOpen);

    // get num modals before closing modal
    const numModalsAtStart = await getNumModals();

    // if the desired method to close the modal
    // is ENTER or SPACE, then we first need to
    // tab navigate to the close button
    // if method to close is 'click' or ESC key, we
    // can skip this entirely
    if (closeMethod === KEY.ENTER || closeMethod === KEY.SPACE) {
        const { modalVariantType } = config;
        let tabNavValue = getNumTabsToCloseButton(spec, modalVariantType);
        if (tabNavValue !== 0 && typeof tabNavValue === 'number') {
            await repeatTab(tabNavValue);
        }
    }

    // Initiate Modal Close
    await closeModal(config, 0, closeMethod);

    // get num modals after closing modal
    const numModalsAfterClose = await getNumModals();

    // AFTER modal is closed complete, retest what has focus
    await validateModalFocus(expectedAfterClose);

    // verify modal was added and removed
    // this handles simple cases where a single modal is
    // opened, and it is later closed
    const expectedNumModals = [
        { actual: numModalsAtStart, expected: 1 },
        { actual: numModalsAfterClose, expected: 0 },
    ];
    validateNumModals(expectedNumModals);
}

// validate that focus trap is working correctly
// in this test, shift tab or reverse tab navigation is utilized
// should end up on the 1st button in the modalFooter element
// eslint-disable-next-line @lwc/lwc/no-async-await
async function validateModalOpenTabNavFocusBehavior(
    config,
    expectedAfterOpen,
    expectedAfterTab,
    numOfTabsToNext
) {
    // make sure values are passed in
    expect(config).not.toBeFalsy();
    expect(expectedAfterOpen).not.toBeFalsy();
    expect(expectedAfterTab).not.toBeFalsy();
    expect(numOfTabsToNext).not.toBeFalsy();

    // open modal with config
    await openModal(config);

    // AFTER Modal open, test what has focus
    await validateModalFocus(expectedAfterOpen);

    // tab navigate backwards
    // should end up on 'Option 1' button
    await repeatTab(numOfTabsToNext);

    // AFTER tab navigation complete, retest what has focus
    await validateModalFocus(expectedAfterTab);
}

module.exports = {
    getModalInternalsDomBased,
    setupStrategy,
    isModalOfVariantType,
    parseStyleAttributes,
    mockMatchMedia,
    // general usage across all modal spec
    openModal,
    closeModal,
    clickButton,
    // next method only used in modalAccessibility
    getModalInternals,
    getOverlayContainer,
    getScreenSizeValues,
    getModalSizeFromName,
    getModalHeaderInternals,
    getModalBodyInternals,
    getModalFooterInternals,
    // modalFullScreen
    setWindowSize,
    validateModalCloseButtonAttributes,
    validateModalHeightBehavior,
    validateModalWidthBehavior,
    // modalFunctionality
    validateInertness,
    checkBackgroundElemForInertness,
    repeatTab,
    repeatKey,
    typeLetters,
    fillForm,
    validateData,
    getActiveShadowElements,
    getActiveShadowElement,
    getNumModals,
    getElementInModalFooter,
    getCalendarDetail,
    // modalAccessibility
    validateNumModals,
    validateModalOpenCloseFocusBehavior,
    validateModalOpenTabNavFocusBehavior,
    // modalAccessibility && modalFocus
    validateModalFocus,
};
