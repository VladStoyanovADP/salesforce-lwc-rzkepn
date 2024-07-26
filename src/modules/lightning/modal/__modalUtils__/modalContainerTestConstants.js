/* Contains constants for modal testing
 * NOTE: there is sample Modal DOM structure for reference
 * at the bottom of this file
 */

// Selectors

// buttons that open modals
const BUTTON_MODAL_ALL = '[data-modal-button-all]';
const BUTTON_MODAL_ALL_TWO = '[data-modal-button-all-two]';
const BUTTON_MODAL_HEADLESS = '[data-modal-button-headless]';
const BUTTON_MODAL_HEADLESS_NO_LABEL = '[data-modal-button-headless-no-label]';
const BUTTON_MODAL_HEADLESS_TWO = '[data-modal-button-headless-two]';
const BUTTON_MODAL_FOOTLESS = '[data-modal-button-footless]';
const BUTTON_MODAL_FOOTLESS_TWO = '[data-modal-button-footless-two]';
const BUTTON_MODAL_FORM = '[data-modal-button-form]';
const BUTTON_MODAL_MULTI = '[data-modal-button-multi]';
const BUTTON_MODAL_HEADLESS_AND_FOOTLESS =
    '[data-modal-button-headless-footless-internal]';
const BUTTON_MODAL_ALL_FULL = '[data-modal-button-all-full]';
const BUTTON_MODAL_HEADLESS_TWO_FULL = '[data-modal-button-headless-two-full]';
const BUTTON_MODAL_HEADLESS_FULL = '[data-modal-button-headless-full]';
const BUTTON_MODAL_FOOTLESS_FULL = '[data-modal-button-footless-full]';

// top level component selectors
const OVERLAY_CONTAINER = 'lightning-overlay-container';
const MODAL_BASE = 'lightning-modal-base';
const MODAL = 'lightning-modal';
const BUBBLE_ELEM = 'lightning-primitive-bubble';

// LightningModal specific selectors
const MODAL_SLDS_CSS = 'slds-modal';
const MODAL_SLDS_FULL_SIZE_CSS = 'slds-modal_full';
const MODAL_SLDS_SMALL_SIZE_CSS = 'slds-modal_small';
const MODAL_SLDS_MEDIUM_SIZE_CSS = 'slds-modal_medium';
const MODAL_SLDS_LARGE_SIZE_CSS = 'slds-modal_large';
const MODAL_DIV_SLOT = '[data-slot]';
const MODAL_CONTAINER_DIV = '[data-container]';
const FOCUS_TRAP = 'lightning-focus-trap';
const MODAL_CLOSE_BTN = '.slds-modal__close';
const MODAL_DATA_SELECTOR = '[data-modal]'; // the 'section' element
const MODAL_DESCRIPTION_SELECTOR = '[data-aria-description]'; // the 'section' > span element
const MODAL_ARIALIVE_SELECTOR = '[data-aria-live-message]'; // the 'section' > span element
// modal header
const MODAL_HEADER = 'lightning-modal-header';
// modal body
const MODAL_BODY = 'lightning-modal-body';
const MODAL_BODY_DIV = '[data-content-container]';
const MODAL_BODY_BACKDROP = '.slds-backdrop';
const MODAL_BODY_SLOT = '[data-default-slot]';
// modal footer
const MODAL_FOOTER = 'lightning-modal-footer';

// inner modal specific details ===========================

// close button variants
const MODAL_CLOSE_BUTTON_FULL_VARIANT = 'bare';
const MODAL_CLOSE_BUTTON_NORMAL_VARIANT = 'bare-inverse';
const MODAL_CLOSE_BTN_CLASS = 'slds-modal__close';
const MODAL_CLOSE_BTN_SELECTOR = `.${MODAL_CLOSE_BTN_CLASS}`;
const MODAL_CLOSE_BTN_FULL_CLASS = 'slds-modal_full-close-button';
// modal screen size testing
// utilized by full screen modal tests
const SCREEN_SIZE_SMALL = 'SMALL';
const SCREEN_SIZE_SMALL_MID = 'SMALL_MID';
const SCREEN_SIZE_MEDIUM = 'MEDIUM';
const SCREEN_SIZE_LARGE = 'LARGE';
const SCREEN_SIZE_XLARGE = 'XLARGE';
const SCREEN_SIZE_SMALL_LANDSCAPE = 'SMALL_LANDSCAPE';
const SCREEN_SIZE_MEDIUM_LANDSCAPE = 'MEDIUM_LANDSCAPE';
const SCREEN_SIZE_LARGE_LANDSCAPE = 'LARGE_LANDSCAPE';

// modal size api testing value constants
const MODAL_SIZE_SMALL = 'small';
const MODAL_SIZE_MEDIUM = 'medium';
const MODAL_SIZE_LARGE = 'large';
const MODAL_SIZE_FULL = 'full';
const MODAL_SIZE_RANDO = 'modal-ex-large';

// modal body selectors ================================
// Empty CSS classes
const BODY_HEADLESS_SELECTOR = 'slds-modal__content_headless';
const BODY_FOOTLESS_SELECTOR = 'slds-modal__content_footless';

// modal size measurements and values
// during release 248, breakpoint was altered
// to narrow the device's targeted by size=full
// from 768 to 480
// this will be backported, so it will effect 246.x
const MODAL_FULL_SCREEN_SMALL_BREAKPOINT = 480;
// <lightning-modal> element location, medium+ screen
const MODAL_DEFAULT_PX_OFFSET_X = 25;
// <lightning-modal> element location, full screen
const MODAL_ELEM_FULL_PX_OFFSET_X = 0;
// used to validate modal height and screen utilization
const MODAL_DEFAULT_SCREEN_USE_PERCENT = 0.88;
const MODAL_FULL_SCREEN_USE_PERCENT = 0.92;

const MAX_HEIGHT = 'max-height';
const MIN_HEIGHT = 'min-height';
const MODAL_BODY_MIN_HEIGHT_PX = 80;

// Accessibility
const ARIA_LABELLEDBY = 'aria-labelledby';
const ARIA_LABEL = 'aria-label';
const ARIA_BUSY = 'aria-busy';

// PAUSES
const PAUSE_MICRO = 100;
const PAUSE_BRIEF = 1250;
const BROWSER_RESIZE_PAUSE = 2000;
const MODAL_RENDER_PAUSE = 1250;

// modal launcher data selectors
const SELECTORS = {
    // main testing options
    all: BUTTON_MODAL_ALL,
    'all-full': BUTTON_MODAL_ALL_FULL,
    'all-form': BUTTON_MODAL_FORM,
    headless: BUTTON_MODAL_HEADLESS,
    footless: BUTTON_MODAL_FOOTLESS,
    'headless-full': BUTTON_MODAL_HEADLESS_FULL,
    'footless-full': BUTTON_MODAL_FOOTLESS_FULL,
    // alternate testing options
    'all-two': BUTTON_MODAL_ALL_TWO,
    'headless-no-label': BUTTON_MODAL_HEADLESS_NO_LABEL,
    'headless-two': BUTTON_MODAL_HEADLESS_TWO,
    'headless-two-full': BUTTON_MODAL_HEADLESS_TWO_FULL,
    'headless-and-footless': BUTTON_MODAL_HEADLESS_AND_FOOTLESS,
    'footless-two': BUTTON_MODAL_FOOTLESS_TWO,
    'multi-modals': BUTTON_MODAL_MULTI,
};

// private attributes on modal components
const DATA_VARIANT_HEADLESS_ATTRIBUTE = 'data-variant-headless';
const DATA_VARIANT_FOOTLESS_ATTRIBUTE = 'data-variant-footless';
const DATA_SIZE_ATTRIBUTE = 'data-size';

// modal type to size api value mapping
const NAME_TO_SIZE = {
    all: MODAL_SIZE_FULL,
    'all-full': MODAL_SIZE_FULL,
    'all-form': MODAL_SIZE_MEDIUM,
    headless: MODAL_SIZE_SMALL,
    footless: MODAL_SIZE_LARGE,
    'headless-full': MODAL_SIZE_FULL,
    'footless-full': MODAL_SIZE_FULL,

    'all-two': MODAL_SIZE_MEDIUM,
    'headless-no-label': MODAL_SIZE_MEDIUM,
    'headless-two': MODAL_SIZE_MEDIUM,
    'headless-two-full': MODAL_SIZE_FULL,
    'headless-and-footless': MODAL_SIZE_MEDIUM,
    'footless-two': MODAL_SIZE_MEDIUM,
    'multi-modals': MODAL_SIZE_MEDIUM,
};

// modal type to size api value mapping
// this will get filled in as more test
// suites for modal utilize this map
const SPEC_TO_TABS_TO_CLOSE_BTN = {
    accessibility: {
        footless: -1,
        headless: -3,
    },
};

const MODAL_RANGE = { min: 9000, max: 9099 };
const OVERLAY_RANGE = { min: 9100, max: 9199 };

const KEY = {
    SHIFT: 'Shift',
    TAB: 'Tab',
    ENTER: 'Enter',
    SPACE: 'Space',
    ESC: 'Escape',
};

// pixel values for testing screen sizes
const SCREEN_SIZE = {
    // based on iPhone 14
    // close to iPhone 12 Pro, Pixel 5
    // when Modal size='full',
    // full screen behavior (mobile screens) will be applied
    // when Modal api size=full is set
    SMALL: {
        width: 393,
        height: 852,
    },
    // rest of SCREEN_SIZE below all are greater than 480px
    // so will render as normal desktop Modal UX
    SMALL_MID: {
        width: 481,
        height: 852,
    },
    SMALL_LANDSCAPE: {
        width: 852,
        height: 393,
    },
    // iPad sizing, in portrait
    MEDIUM: {
        width: 768,
        height: 1024,
    },
    MEDIUM_LANDSCAPE: {
        width: 1024,
        height: 768,
    },
    // Typical desktop lower bound
    LARGE: {
        width: 1024,
        height: 768,
    },
    // Higher res desktop
    XLARGE: {
        width: 1920,
        height: 1080,
    },
};

module.exports = {
    BUTTON_MODAL_ALL,
    BUTTON_MODAL_ALL_TWO,
    BUTTON_MODAL_HEADLESS,
    BUTTON_MODAL_HEADLESS_NO_LABEL,
    BUTTON_MODAL_HEADLESS_TWO,
    BUTTON_MODAL_FOOTLESS,
    BUTTON_MODAL_FOOTLESS_TWO,
    BUTTON_MODAL_FORM,
    BUTTON_MODAL_MULTI,
    BUTTON_MODAL_HEADLESS_FULL,
    BUTTON_MODAL_FOOTLESS_FULL,
    OVERLAY_CONTAINER,
    MODAL_BASE,
    MODAL,
    MODAL_SLDS_CSS,
    MODAL_SLDS_FULL_SIZE_CSS,
    MODAL_SLDS_SMALL_SIZE_CSS,
    MODAL_SLDS_MEDIUM_SIZE_CSS,
    MODAL_SLDS_LARGE_SIZE_CSS,
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
    MODAL_CLOSE_BTN_SELECTOR,
    MODAL_CLOSE_BTN_FULL_CLASS,
    MODAL_DATA_SELECTOR,
    MODAL_CLOSE_BUTTON_FULL_VARIANT,
    MODAL_CLOSE_BUTTON_NORMAL_VARIANT,
    SCREEN_SIZE_SMALL,
    SCREEN_SIZE_SMALL_MID,
    SCREEN_SIZE_MEDIUM,
    SCREEN_SIZE_LARGE,
    SCREEN_SIZE_XLARGE,
    SCREEN_SIZE_SMALL_LANDSCAPE,
    SCREEN_SIZE_MEDIUM_LANDSCAPE,
    SCREEN_SIZE_LARGE_LANDSCAPE,
    MODAL_SIZE_SMALL,
    MODAL_SIZE_MEDIUM,
    MODAL_SIZE_LARGE,
    MODAL_SIZE_FULL,
    MODAL_SIZE_RANDO,
    MODAL_FULL_SCREEN_SMALL_BREAKPOINT,
    MODAL_DEFAULT_PX_OFFSET_X,
    MODAL_ELEM_FULL_PX_OFFSET_X,
    MODAL_DEFAULT_SCREEN_USE_PERCENT,
    MODAL_FULL_SCREEN_USE_PERCENT,
    MAX_HEIGHT,
    MIN_HEIGHT,
    MODAL_BODY_MIN_HEIGHT_PX,
    BROWSER_RESIZE_PAUSE,
    MODAL_RENDER_PAUSE,
    PAUSE_MICRO,
    PAUSE_BRIEF,
    SELECTORS,
    NAME_TO_SIZE,
    BODY_HEADLESS_SELECTOR,
    BODY_FOOTLESS_SELECTOR,
    MODAL_DESCRIPTION_SELECTOR,
    MODAL_ARIALIVE_SELECTOR,
    BUBBLE_ELEM,
    MODAL_RANGE,
    OVERLAY_RANGE,
    SPEC_TO_TABS_TO_CLOSE_BTN,
    DATA_VARIANT_FOOTLESS_ATTRIBUTE,
    DATA_VARIANT_HEADLESS_ATTRIBUTE,
    DATA_SIZE_ATTRIBUTE,
    SCREEN_SIZE,
    ARIA_LABELLEDBY,
    ARIA_LABEL,
    ARIA_BUSY,
    KEY,
};
