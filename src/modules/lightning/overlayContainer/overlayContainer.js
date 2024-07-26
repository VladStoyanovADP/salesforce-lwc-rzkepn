import { api, createElement } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { parent, instanceName, normalizeApis } from 'lightning/overlayUtils';
import { guid } from 'lightning/utilsPrivate';
import {
    addOverlayToSharedState,
    removeOverlayFromSharedState,
    normalizeOverlayDetails,
    subscribeOverlay,
    getStatCount,
    TYPE_TOAST_CONTAINER,
    LWC_OVERLAY_STARTING_ZINDEX,
    LWC_TOAST_CONTAINER_STARTING_ZINDEX,
    LWC_OVERLAY_TYPES,
    LWC_ZINDEX_INCREMENT,
    LWC_ZINDEX_OFFSET,
    LWC_OVERLAY_ENGINE,
} from 'lightning/overlayManager';

export default class LightningOverlayContainer extends LightningShadowBaseClass {
    // overlayContainer has this.stack, which holds the details, and actual
    // DOM elements of local (this file) LWC overlays only, while
    // overlayManager has this.state.stack, which only tracks details of
    // local LWC overlays + Aura overlays
    // Example of this.stack:
    // [{ element, parentElement, resolve, id }, { ... }, { ... }]
    stack = [];
    afterFirstRender = false;

    get root() {
        return this.template.querySelector('[data-overlay-container]');
    }

    /**
     * Generate a new modal with params and return promise.
     *
     * @param {LightningModal} scope LightningOverlay extended class
     * @param {Object} apis key value pair of apis to assign
     */
    @api
    push(scope, apis) {
        apis = apis || {};

        if (typeof apis !== 'object') {
            throw new Error('Invalid .open() or .open({}) argument.');
        }
        const { [instanceName]: overlayInstanceName, [parent]: overlayParent } =
            scope;

        if (!this.isOverlayAllowedToAdd(overlayInstanceName)) {
            return Promise.reject();
        }
        const element = createElement(overlayInstanceName, { is: scope });
        const normalizedApis = normalizeApis(apis);

        Object.entries(normalizedApis).forEach(([key, value]) => {
            const keyLower = key.toLowerCase();
            const match = keyLower.match(/^on(.+)/);
            if (match) {
                const eventName = match[1];
                element.addEventListener(eventName, value);
            } else {
                element[key] = value;
            }
        });

        let promise = null;
        const id = guid();
        if (overlayParent) {
            // Ex: extends LightningModal with wrapping LightningModalBase
            const parentElement = createElement(overlayParent[instanceName], {
                is: overlayParent,
            });
            this.root.appendChild(parentElement);
            parentElement.defaultSlot.appendChild(element);
            promise = new Promise((resolve) => {
                this.stack.push({ resolve, element, parentElement, id });
            });
        } else {
            this.root.appendChild(element);
            promise = new Promise((resolve) => {
                this.stack.push({ resolve, element, id });
            });
        }
        // Add new overlay details to shared overlay state
        // contained in LightningOverlayManager
        const overlayDetails = normalizeOverlayDetails(
            LWC_OVERLAY_ENGINE,
            overlayInstanceName,
            { id }
        );
        addOverlayToSharedState(overlayDetails);
        return promise;
    }

    /**
     * Remove the matching overlay element
     * @param {HTMLElement} element is the element that `extends LightningOverlay`
     * @param {object|array|boolean|string|number} result the result value to resolve via promise
     * @param {object} promise the promise to resolve
     * example of parentElement: LightningModalBase, InteractiveDialogBase
     */
    @api pop(element, result, promise) {
        const stackLength = this.stack.length;
        let stackElementToRemove,
            stackIndexToRemove = -1;
        if (stackLength > 0) {
            // find element to remove, by looping through array in reverse order
            // typically, the last item in the zero-based array will be removed
            for (let index = stackLength - 1; index > -1; index--) {
                if (this.stack[index]) {
                    stackElementToRemove = this.stack[index];
                    if (element === stackElementToRemove.element) {
                        stackIndexToRemove = index;
                        break;
                    }
                }
            }
            if (stackElementToRemove) {
                const {
                    element: elem,
                    parentElement,
                    resolve,
                    id,
                } = stackElementToRemove;
                // Resolve immediately
                resolve(result);
                // Wait for animation out to complete.
                // Ex: LightningModal slide up animation
                // We need to wait until the promise.then()[PASS] or we
                // remove the element too early, and animation gets clipped
                if (promise) {
                    promise.then(() => {
                        this.removeOverlay(
                            elem,
                            parentElement,
                            stackIndexToRemove,
                            id
                        );
                    });
                } else {
                    // No animation, so no need to wait
                    // before removal
                    // IE11 and prefers-reduced-motion
                    // take this path
                    this.removeOverlay(
                        elem,
                        parentElement,
                        stackIndexToRemove,
                        id
                    );
                }
            }
        }
        return null;
    }

    /**
     * Remove overlay (with IE11 support)
     *
     * @param {LightningModal} element Required
     * @param {LightningElement} parentElement Optional
     * @param {number} indexToRemove index of element to remove from this.state
     */
    removeOverlay(element, parentElement, indexToRemove, id) {
        const overlayType = element && element.tagName.toLowerCase();
        // First, remove the parentElement and the element from the DOM
        if (parentElement && parentElement.remove) {
            parentElement.remove();
        } else if (parentElement) {
            parentElement.parentNode.removeChild(parentElement);
        } else if (element.remove) {
            element.remove();
        } else {
            element.parentNode.removeChild(element);
        }
        // Second, alter local LWC only overlay state (this),
        // typically removing last item
        if (indexToRemove > -1) {
            this.stack.splice(indexToRemove, 1);
        }
        // Last, update overlayManager's shared overlay state
        // specifically, this.state.stack
        const overlayDetails = normalizeOverlayDetails(
            LWC_OVERLAY_ENGINE,
            overlayType,
            { id }
        );
        removeOverlayFromSharedState(overlayDetails);
    }

    connectedCallback() {
        // Notified anytime an overlay is added/removed
        // LWC overlays start on z-index 9000; always even z-index (9000, 9002)
        // Aura overlays start on z-index 9001; always on odd z-index (9001, 9003)
        subscribeOverlay(this.afterFirstRender, (state) => {
            const {
                mixedOverlayPresent,
                auraHighestZindex,
                lwcAllOverlayCount,
                stack,
            } = state;

            // exit condition exists
            // no need to proceed with any updates
            if (lwcAllOverlayCount === 0) {
                return;
            }

            // initialize z-index value to set,
            // value changes if Aura overlays present
            let lwcZIndexToSet = LWC_OVERLAY_STARTING_ZINDEX;
            // lwc count used to correctly access
            // overlay containers elements
            let lwcOverlayCount = 0;
            let lwcToastContainerZIndexToSet =
                LWC_TOAST_CONTAINER_STARTING_ZINDEX;
            const toastOverlayStack = [];
            // loop over stack, set correct z-index and position values
            // depending on state of LWC-only or Aura+LWC overlay
            stack.forEach((overlayObject, stackIndex) => {
                const { overlayEngine, overlayType, overlayDetails } =
                    overlayObject;
                let overlayElem;
                // set position: fixed or absolute based on type
                const positionToSet =
                    (LWC_OVERLAY_TYPES[overlayType] &&
                        LWC_OVERLAY_TYPES[overlayType].pos) ||
                    'fixed';

                const isToastContainer = overlayType === TYPE_TOAST_CONTAINER;

                // Strategy: depending on order of appearance, overlayEngine, mixedOverlayPresent
                // set interleaving z-index
                // LWC stack starts at 9000 z-index, z-index increments by 2 (always even)
                // Aura stack starts at 9001 z-index, z-index increments by 2 (always odd)
                // LWC toast container overlays starts at 10000 z-index

                // LWC-only overlays present, default stack behavior
                // overlays assigned: 9000, 9000, 9000, 9000
                if (!mixedOverlayPresent) {
                    overlayElem = this.root.childNodes[lwcOverlayCount];
                    if (overlayElem) {
                        const zIndexToSet = isToastContainer
                            ? lwcToastContainerZIndexToSet
                            : lwcZIndexToSet;
                        overlayElem.style.zIndex = zIndexToSet;
                        overlayElem.style.position = positionToSet;
                        // need to update shared state with z-index
                        // in case Aura modal or overlay later occurs
                        const updateDetailsObject = {
                            zIndex: zIndexToSet,
                        };
                        const updatedOverlayObject = normalizeOverlayDetails(
                            overlayEngine,
                            overlayType,
                            Object.assign(
                                {},
                                overlayDetails,
                                updateDetailsObject
                            )
                        );
                        // set the z-index to the shared state overlay
                        if (updatedOverlayObject !== null) {
                            state.stack[stackIndex] = updatedOverlayObject;
                        }
                        lwcOverlayCount += 1;
                    }
                    // Aura+LWC overlays present, alt stack behavior
                    // LWC overlays assigned: 9000, 9002, 9004
                    // Aura overlay stack assigns: 9001, 9003, 9005
                    // The code that governs the Aura overlay behavior
                    // is in the Aura repo. See panelManager2 and stackManager
                } else {
                    if (overlayEngine === LWC_OVERLAY_ENGINE) {
                        overlayElem = this.root.childNodes[lwcOverlayCount];
                        const existingZindexValueIsSet = !!(
                            overlayDetails && overlayDetails.zIndex
                        );
                        const existingZindexValue =
                            overlayDetails && overlayDetails.zIndex;
                        let lwcZIndex;
                        // if LWC overlay z-index value not already set
                        if (
                            !existingZindexValueIsSet ||
                            Number.isNaN(existingZindexValue)
                        ) {
                            if (isToastContainer) {
                                lwcZIndex = lwcToastContainerZIndexToSet;
                            } else {
                                // need to consider whether LWC overlay is
                                // first in stack, and if not first, to offset by aura z-index
                                lwcZIndexToSet =
                                    stackIndex !== 0
                                        ? auraHighestZindex + LWC_ZINDEX_OFFSET
                                        : lwcZIndexToSet;
                                lwcZIndex = lwcZIndexToSet;
                            }
                            const updateDetailsObject = {
                                zIndex: lwcZIndex,
                            };
                            const updatedOverlayObj = normalizeOverlayDetails(
                                overlayEngine,
                                overlayType,
                                Object.assign(
                                    {},
                                    overlayDetails,
                                    updateDetailsObject
                                )
                            );
                            // set the z-index to the shared state overlay
                            if (updatedOverlayObj !== null) {
                                state.stack[stackIndex] = updatedOverlayObj;
                            }
                        } else {
                            if (isToastContainer) {
                                lwcZIndex =
                                    existingZindexValue >=
                                    LWC_TOAST_CONTAINER_STARTING_ZINDEX
                                        ? existingZindexValue
                                        : LWC_TOAST_CONTAINER_STARTING_ZINDEX;
                            } else {
                                lwcZIndexToSet =
                                    existingZindexValue >=
                                    LWC_OVERLAY_STARTING_ZINDEX
                                        ? existingZindexValue
                                        : LWC_OVERLAY_STARTING_ZINDEX;
                                lwcZIndex = lwcZIndexToSet;
                            }
                        }
                        if (overlayElem) {
                            overlayElem.style.zIndex = lwcZIndex;
                            overlayElem.style.position = positionToSet;
                            // increment for LWC local DOM ref
                            lwcOverlayCount += 1;
                        }
                        if (isToastContainer) {
                            toastOverlayStack.push({ overlayElem, stackIndex });
                        }
                    } else {
                        // Aura overlays use odd z-index values,
                        // LWC overlays use even z-index values,
                        // adding 2 prevents collisions
                        // between the Aura and LWC overlay stack
                        lwcZIndexToSet += LWC_ZINDEX_INCREMENT;
                    }
                }
            });
        });
        // connectedCallback must be complete once
        // before allowing subscribeOverlay to be called
        // for the first time
        this.afterFirstRender = true;
    }

    /**
     * Return true if the overlay is allowed to be added to the overlay container
     * @param {string} overlayType, name of the overlay type
     */
    isOverlayAllowedToAdd(overlayType) {
        // first, filter out unknown overlay types
        const isApprovedOverlayType = !!LWC_OVERLAY_TYPES[overlayType];
        if (!isApprovedOverlayType) {
            return false;
        }
        // determine if allowed to add overlay type
        const { maxNum, statName } = LWC_OVERLAY_TYPES[overlayType];
        const maxNumNotSet = typeof maxNum === 'undefined';
        const count = (statName && getStatCount(statName)) || 0;
        return maxNumNotSet || maxNum > count;
    }
}
