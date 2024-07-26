/* LightningOverlayManager
 * - provides shared state and methods in order for
 *   the LWC overlay system to prevent collisions with
 *   the Aura overlay system (ui:panelManager2, ui:modal, etc)
 * - works in conjunction with LightningOverlayContainer and the Aura
 *   based overlay system
 * - Originally, Aura overlays had z-index values
 *   incrementing by 1, starting at 9001
 *   ex: 9001, 9002, 9003, 9004
 * - After Overlay and Modal updates, Aura overlays are
 *   only odd z-index values, *starting at 9001*
 *   ex: 9001, 9003, 9005, 9007
 * - By default, LWC overlays stay the same value, *starting at 9000*
 *   relying upon the DOM order to determine which overlay is visible
 *   ex: 9000, 9000, 9000, 9000
 * - When Aura AND LWC overlay systems both have active overlays present
 *   LWC z-index values are even only z-index values
 *   - incrementing by 1, when the previous highest overlay was an Aura overlay
 *   - and not incrementing for each additional LWC overlay
 *   ex 1: 9000 (LWC), 9001 (Aura), 9002 (LWC)
 *   ex 2: 9001 (Aura), 9003 (Aura), 9004 (LWC), 9004 (LWC), 9005 (Aura)
 */
const TYPE_MODAL = 'lightning-modal';
const TYPE_ALERT = 'lightning-alert';
const TYPE_CONFIRM = 'lightning-confirm';
const TYPE_PROMPT = 'lightning-prompt';
const TYPE_OVERLAY = 'lightning-overlay';
export const TYPE_TOAST_CONTAINER = 'lightning-toast-container';

// LWC overlay stack constants
export const LWC_OVERLAY_ENGINE = 'lwc';
export const LWC_OVERLAY_STARTING_ZINDEX = 9000;
export const LWC_TOAST_CONTAINER_STARTING_ZINDEX = 10000;
export const LWC_ZINDEX_INCREMENT = 2;
export const LWC_ZINDEX_OFFSET = 1;
// Known overlay types with their assigned position type
// 'fixed' is default if not indicated
export const LWC_OVERLAY_TYPES = Object.freeze({
    [TYPE_OVERLAY]: { pos: 'absolute' },
    [TYPE_MODAL]: { pos: 'absolute' },
    [TYPE_ALERT]: { pos: 'absolute' },
    [TYPE_CONFIRM]: { pos: 'absolute' },
    [TYPE_PROMPT]: { pos: 'absolute' },
    [TYPE_TOAST_CONTAINER]: {
        pos: 'fixed',
        maxNum: 1,
        statName: 'lwcToastContainerCount',
    },
});

// Aura overlay stack constants
export const AURA_OVERLAY_ENGINE = 'aura';
export const AURA_STARTING_ZINDEX = 9001;
export const AURA_ZINDEX_INCREMENT = 2;
export const AURA_OVERLAY_TYPES = {
    'ui:modal': { pos: 'absolute' },
};

const state = {
    // track order of overlays opening
    // [{ overlayEngine: 'lwc', overlayType: 'lightning-modal' },
    //  { overlayEngine: 'aura', overlayType: 'ui:modal', overlayDetails: { zIndex: 9001, id: '143:0' } }]
    stack: [],
    // callback comes from LightningOverlayContainer
    callback: null,
    // state.stack has mixed case
    mixedOverlayPresent: false,
    // aura stack details
    auraHighestZindex: 9001,
    // aura overlay is visible on top of stack
    auraOverlayActive: false,
    auraModalCount: 0,
    auraAllOverlayCount: 0,
    // lwc stack details
    lwcModalCount: 0,
    lwcToastContainerCount: 0,
    lwcOverlayCount: 0,
    lwcAllOverlayCount: 0,
};

/**
 * triggerLwcContainerCallback is used to callback to the
 * LightningOverlayContainer when an update to the shared state occurs
 * This method isn't triggered when:
 * (A) Only Aura overlays exists so far
 *  ex: LightningOverlayContainer has not yet been created,
 *  this is when state.callback gets set initially
 * (B) No LWC based overlays present
 *  ex: LightningOverlayContainer has been created, but the existing
 *  Lightning-based overlays have been removed and only Aura overlays
 *  remain.  If another LWC overlay is added later, we start using
 *  the callback again
 */
function triggerLwcContainerCallback() {
    if (state.callback && state.lwcAllOverlayCount > 0) {
        state.callback(state);
    }
}

/**
 * normalizeOverlayDetails is used create consistent overlay
 * objects before adding them to state.stack
 * This public function is used in both LWC and Aura overlay systems
 * Examples of LWC (even z-index) and Aura (odd z-index) overlay objects
 * { overlayEngine: 'lwc', overlayType: 'lightning-modal' },
 * { overlayEngine: 'lwc', overlayType: 'lightning-modal', overlayDetails: { zIndex: 9004 } }
 * { overlayEngine: 'aura', overlayType: 'ui:modal', overlayDetails: { zIndex: 9001 } }]
 * @param {string} overlayEngine string representing the engine type: lwc, aura
 * @param {string} overlayType string representing the type of overlay: lightning-modal, ui:modal
 * @param {Object} overlayDetails object representing details about overlay, currently zIndex
 * @return {Object} combined overlay details object
 */
export function normalizeOverlayDetails(
    overlayEngine,
    overlayType,
    overlayDetails
) {
    let overlayObject = {};
    const missingRequiredValues = !overlayEngine || !overlayType;
    const reqdValuesNotCorrectType =
        (overlayEngine !== LWC_OVERLAY_ENGINE ||
            overlayEngine !== AURA_OVERLAY_ENGINE) &&
        typeof overlayType !== 'string';
    if (missingRequiredValues || reqdValuesNotCorrectType) {
        return null;
    }
    // set required values
    overlayObject.overlayEngine = overlayEngine;
    overlayObject.overlayType = overlayType;
    // set optional values
    if (overlayDetails) {
        // acceptable values
        const { zIndex, id, index } = overlayDetails;
        let cleanedDetails = {};
        if (zIndex !== undefined || zIndex !== null) {
            // ensure that zIndex value is a number before assignment
            const zIndexNumber = parseInt(zIndex, 10);
            const isZIndexANumber = !Number.isNaN(zIndexNumber);
            if (isZIndexANumber) {
                cleanedDetails.zIndex = zIndexNumber;
            }
        }
        if (id && typeof id === 'string') {
            cleanedDetails.id = id;
        }
        // index is zero based index (can be 0, which is falsy)
        if (
            index !== undefined ||
            (index !== null && typeof index === 'number')
        ) {
            cleanedDetails.index = index;
        }
        overlayObject.overlayDetails = cleanedDetails;
    }
    return overlayObject;
}

/**
 * getOverlayStackStats is used to update and reinitialize the Aura and LWC shared
 * overlay state immediately after overlay additions and removals occur
 */
function getOverlayStackStats() {
    const stats = {
        // init lwc stats
        hasLwc: false,
        lwcOverlays: 0,
        lwcAllOverlays: 0,
        lwcModals: 0,
        lwcToastContainers: 0,
        // init aura stats
        hasAura: false,
        auraModals: 0,
        auraOverlays: 0,
        auraAllOverlays: 0,
        auraOverlayActive: false,
        auraHighestZIndex: null,
    };
    // init one time values
    const stackLength = state.stack.length;
    state.stack.forEach(
        ({ overlayEngine, overlayType, overlayDetails }, stackIndex) => {
            const isLwc = overlayEngine === LWC_OVERLAY_ENGINE;
            const isAura = overlayEngine === AURA_OVERLAY_ENGINE;
            // lwc specific details
            if (isLwc) {
                if (!stats.hasLwc) {
                    stats.hasLwc = true;
                }
                const typeExists = !!LWC_OVERLAY_TYPES[overlayType];
                if (overlayType && typeExists) {
                    const isModalType = overlayType === TYPE_MODAL;
                    const isToastContainerType =
                        overlayType === TYPE_TOAST_CONTAINER;
                    if (isModalType) {
                        stats.lwcModals++;
                    } else if (isToastContainerType) {
                        stats.lwcToastContainers++;
                    } else {
                        stats.lwcOverlays++;
                    }
                    stats.lwcAllOverlays++;
                }
            }
            // aura specific details
            if (isAura) {
                if (!stats.hasAura) {
                    stats.hasAura = true;
                }
                if (overlayType) {
                    const isModalType = !!AURA_OVERLAY_TYPES[overlayType];
                    if (isModalType) {
                        stats.auraModals++;
                    } else {
                        stats.auraOverlays++;
                    }
                    stats.auraAllOverlays++;
                }
                if (overlayDetails && overlayDetails.zIndex) {
                    const { zIndex } = overlayDetails;
                    const { auraHighestZIndex } = stats;
                    const zIndexIsNumber = !isNaN(zIndex);
                    if (
                        zIndexIsNumber &&
                        (!auraHighestZIndex || zIndex > auraHighestZIndex)
                    ) {
                        stats.auraHighestZIndex = zIndex;
                    }
                }
                // check if aura overlay is last element in stack
                // indicates aura is active
                if (stackLength === stackIndex + 1) {
                    stats.auraOverlayActive = true;
                }
            }
        }
    );
    return stats;
}

/**
 * updateStateWithStackStats is used to update and reinitialize the Aura and LWC shared
 * overlay state immediately after overlay additions and removals occur
 */
function updateStateWithStackStats(stats) {
    if (!stats) {
        return;
    }

    // update Aura state with collected stats
    if (stats.hasAura) {
        // aura settings
        state.auraModalCount = stats.auraModals;
        state.auraOverlayCount = stats.auraOverlays;
        state.auraAllOverlayCount = stats.auraAllOverlays;
        state.auraOverlayActive = stats.auraOverlayActive;
        if (stats.auraHighestZIndex) {
            state.auraHighestZindex = stats.auraHighestZIndex;
        }
        // or reset Aura state
    } else {
        initAuraOverlayState();
    }

    // update LWC state with collected stats
    if (stats.hasLwc) {
        // lwc settings
        state.lwcModalCount = stats.lwcModals;
        state.lwcToastContainerCount = stats.lwcToastContainers;
        state.lwcOverlayCount = stats.lwcOverlays;
        state.lwcAllOverlayCount = stats.lwcAllOverlays;
        // or reset LWC state
    } else {
        initLwcOverlayState();
    }
    // update shared Aura+LWC state
    state.mixedOverlayPresent = stats.hasLwc && stats.hasAura;
}

/**
 * updateSharedOverlayState is used to trigger updates to shared overlay state
 */
function updateSharedOverlayState() {
    if (state.stack.length === 0) {
        // don't reset all state, just aura and lwc state individually
        // in order to avoid removing callback
        // callback is set only once, when overlayContainer is opened
        initAuraOverlayState();
        initLwcOverlayState();
    } else {
        const stats = getOverlayStackStats();
        updateStateWithStackStats(stats);
    }
}

function cleanOverlayDetails(details) {
    let cleanedDetails = {};
    const detailsKeys = {
        id: 'string',
        zIndex: 'number',
        index: 'number',
    };
    if (!details || typeof details !== 'object') {
        return cleanedDetails;
    }
    Object.entries(details).forEach(([key, value]) => {
        if (detailsKeys[key] && typeof value === detailsKeys[key]) {
            cleanedDetails[key] = value;
        }
    });
    return cleanedDetails;
}

/**
 * addOverlayToSharedState is used to push an overlay object
 * into shared overlay state: state.stack
 * the object should first be processed by normalizeOverlayDetails
 * This public function is called from LWC and Aura overlay systems
 * @param {Object} overlayObject object representing details about the overlay to add
 */
export function addOverlayToSharedState(overlayObject) {
    let { overlayEngine, overlayType, overlayDetails } = overlayObject;
    const missingValues = !overlayObject || !overlayEngine || !overlayType;
    const standardEngines =
        overlayEngine === LWC_OVERLAY_ENGINE ||
        overlayEngine === AURA_OVERLAY_ENGINE;
    // disallow unknown additions
    if (missingValues || !standardEngines) {
        return;
    }
    overlayDetails = cleanOverlayDetails(overlayDetails);
    // after checks, add overlay object
    state.stack.push({ overlayEngine, overlayType, overlayDetails });
    // first update shared overlay state
    updateSharedOverlayState();
    // then trigger callback to overlayContainer
    triggerLwcContainerCallback();
}

/**
 * removeOverlayFromSharedState is used to remove an overlay object
 * from shared overlay state: state.stack
 * This public function is called from LWC and Aura overlay systems
 * @param {Object} overlayObject object representing details about the overlay to remove
 */
export function removeOverlayFromSharedState(overlayObject) {
    const stackLength = state.stack.length;
    const { overlayEngine, overlayDetails } = overlayObject;
    const missingValues = !overlayObject || !overlayEngine;
    const standardEngines =
        overlayEngine === LWC_OVERLAY_ENGINE ||
        overlayEngine === AURA_OVERLAY_ENGINE;
    let overlayId = null;
    let indexToRemove = null;
    // disallow unknown removals
    if (stackLength === 0 || missingValues || !standardEngines) {
        return;
    }

    if (overlayDetails && overlayDetails.id) {
        overlayId = overlayDetails.id;
    }
    // Use overlay ID to find correct overlay and remove
    // IDs may be GUID (LBC overlays) or Aura globalId (Aura overlays)
    if (overlayId) {
        // loop from end to the front of the zero-based array (stack)
        // determine which item to remove
        for (let index = stackLength - 1; index > -1; index--) {
            if (state.stack[index]) {
                const {
                    overlayDetails: { id: oId },
                } = state.stack[index];
                if (oId && oId === overlayId) {
                    indexToRemove = index;
                    break;
                }
            }
        }
    }

    if (indexToRemove !== null) {
        state.stack.splice(indexToRemove, 1);
        // then update shared overlay state
        updateSharedOverlayState();
        // then trigger callback to overlayContainer
        triggerLwcContainerCallback();
    }
}

/**
 * subscribeOverlay is utilized to set the state.callback function
 * initially for LightningOverlayContainer (LOC) usage.
 * NOTE: This function is exported and is supported for use ONLY by LOC
 * When LOC is initialized, this callback is set, so that later updates to
 * Aura and LWC overlay state occur, updates to LWC overlay z-index behavior
 * can be made
 * @param {boolean} shouldCall value to determine if call should be made
 * @param {Function} callback function to call when an update occurs
 */
export function subscribeOverlay(shouldCall, callback) {
    // store once for later usage
    state.callback = callback;
    if (shouldCall) {
        triggerLwcContainerCallback();
    }
}

/**
 * return the count of the specific stat stored in "state"
 * @param {string} statName - name of the stat
 */
export function getStatCount(statName) {
    return !state || !state[statName] ? null : state[statName];
}

/**
 * initLwcOverlayState resets only LWC overlay state values
 */
function initLwcOverlayState() {
    state.lwcModalCount = 0;
    state.lwcToastContainerCount = 0;
    state.lwcOverlayCount = 0;
    state.lwcAllOverlayCount = 0;
}

/**
 * initAuraOverlayState resets only Aura overlay state values
 */
function initAuraOverlayState() {
    state.auraModalCount = 0;
    state.auraOverlayCount = 0;
    state.auraAllOverlayCount = 0;
    state.auraHighestZindex = AURA_STARTING_ZINDEX;
    state.auraOverlayActive = false;
    state.auraOverlayPresent = false;
}

/**
 * Helper function to detect if a lightning-modal is currently open
 * Used in modalUtil.js to trap a user's focus while lightning-modal is open
 * @returns {boolean}
 */
export function isLwcModalActive() {
    let isLwcModal = false;
    if (state.stack?.length > 0) {
        const top = state.stack[state.stack.length - 1];
        isLwcModal =
            top?.overlayEngine === LWC_OVERLAY_ENGINE &&
            top?.overlayType === TYPE_MODAL;
    }
    return isLwcModal;
}
