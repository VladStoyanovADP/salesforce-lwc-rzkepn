import { debounce } from 'lightning/inputUtils';
import { findAllTabbableElements } from 'lightning/focusUtils';
const DEBOUNCE_KEY_DOWN = 300;

/**
 * The configuration for the F6 controller
 * - navKey: the key used as a trigger for navigating between regions
 * - f6RegionAttribute: attribute that defines f6 regions
 */
export const DEFAULT_CONFIG = {
    navKey: 'F6',
    f6RegionAttribute: 'data-f6-region',
    f6RegionHighlightClass: 'f6-highlight',
};

/**
 * finds and returns the active element from an element
 * @param {Element} element
 * @returns {Element} - active element, otherwise, undefined
 */
export const getActiveElement = (element) => {
    if (!element) {
        return element;
    }
    if (!element.shadowRoot) {
        if (element.activeElement) {
            return getActiveElement(element.activeElement);
        }
        return element;
    }
    if (!element.shadowRoot.activeElement) {
        return element;
    }
    return getActiveElement(element.shadowRoot.activeElement);
};

/**
 * F6Controller is a global focus management system which allows end users to use keyboard shortcuts to
 * quickly move to designated regions in a page.
 * It handles logic for:
 * - Globally detecting F6 regions (i.e. registered components must have the data attribute stored in config - f6RegionAttribute
 *  in their tag, 'data-f6-region')
 * - Handling F6 keypresses by focusing and highlighting F6 regions
 * Supported keyboard shortcuts:
 * - Ctrl/Cmd + F6 to move focus to the next available registered region.
 * - Shift + Ctrl/Cmd + F6 to move focus to the previous available registered region.
 */

export class F6Controller {
    // an array of registered components
    regions = [];

    // Default configuration
    config = DEFAULT_CONFIG;

    // reference to the debounced key down handler
    _debounceKeyDownHandler;

    // reference to the style element
    _styleElement;

    /**
     * Creates a F6Controller
     */
    constructor() {
        // debounce function for handling keydown event
        this._debounceKeyDownHandler = debounce(
            this.handleKeyDown.bind(this),
            DEBOUNCE_KEY_DOWN
        );
        this.initialize();
    }

    appendStyleElement() {
        // all F6 regions must be position relative.
        this._styleElement = document.createElement('style');
        const selector = `[${this.config.f6RegionAttribute}].${this.config.f6RegionHighlightClass}`;
        this._styleElement.innerText = `${selector} { position: relative; } ${selector}::after { width: 100%; height: 100%; content: ''; outline: rgb(94, 158, 214) 3px solid; outline-offset: -3px; position: absolute; top: 0; left: 0; z-index: 9999; }`;
        this._styleElement.setAttribute('type', 'text/css');
        document.head.appendChild(this._styleElement);
    }

    /**
     * Clears all regions of outlines.
     */
    clearRegionHighlights() {
        if (!this.regions || !this.regions.length) {
            return;
        }
        this.regions.forEach((region) => {
            region.classList.remove(this.config.f6RegionHighlightClass);
        });
    }

    /**
     * Outlines the given element with a dashed line.
     * @param {Element} element, element to highlight
     */
    addRegionHighlight(element) {
        element.classList.add(this.config.f6RegionHighlightClass);
    }

    /**
     * Find the first focusable element inside of the input element.
     * If no focusable element, set the input element to be focusable.
     * @param {Element} element element to be examined
     * @returns {Element} - the focusable element
     */
    findFocusableElement(element) {
        if (!element || !element.isConnected) {
            return undefined;
        }

        const tabbableElements = findAllTabbableElements(element);
        if (tabbableElements && tabbableElements.length) {
            return tabbableElements[0];
        }
        element.tabIndex = '-1';
        return element;
    }

    /**
     * Focus inside the given region:
     * - element that last had focus in that region, else
     * - first focusable element in that region, else
     * - focus on region itself (no focusable elements in region)
     * @param {Element} region - representing a region of the page
     */
    focusIn(region) {
        const element = this.findFocusableElement(region);
        if (element) {
            element.focus();
        }
    }

    /**
     * Navigates to next/previous region
     * @param {KeyboardEvent} event - a KeyDown event
     */
    handleNavigation(event) {
        event.preventDefault();
        if (!this.regions.length) {
            return;
        }
        const isPrevious = event.shiftKey;
        const currentRegionIndex = this.getElementRegionIndex(
            getActiveElement(event.target)
        );

        const adjacentRegionIndex = this.getAdjacentRegionIndex(
            currentRegionIndex,
            isPrevious
        );

        if (adjacentRegionIndex === -1) {
            return;
        }
        const regionToFocus = this.regions[adjacentRegionIndex];
        this.focusIn(regionToFocus);
        this.addRegionHighlight(regionToFocus);
    }

    /**
     * Determines whether or not container contains element through the shadow DOM.
     * @param {Element} container - container element
     * @param {Element} element - target element
     * @returns {boolean}
     */
    shadowContains(container, element) {
        if (container === element || container.contains(element)) {
            return true;
        }

        if (container.shadowRoot) {
            if (
                this.isElementInContainerElements(
                    container.shadowRoot.children,
                    element
                )
            ) {
                return true;
            }
        }
        if (container.tagName === 'SLOT') {
            if (
                this.isElementInContainerElements(
                    container.assignedElements(),
                    element
                )
            ) {
                return true;
            }
        }

        return this.isElementInContainerElements(container.children, element);
    }

    /**
     * Returns true if the container element contains the searchElement
     * @param {Array} containerElements
     * @param {Element} searchElement
     * @returns {boolean}
     */
    isElementInContainerElements(containerElements, searchElement) {
        if (!containerElements || !containerElements.length) {
            return false;
        }
        const numElements = containerElements.length;
        for (let index = 0; index < numElements; index++) {
            if (this.shadowContains(containerElements[index], searchElement)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Find the index of the region containing a given DOM element.
     * Regions can't be nested, and are thus mutually exclusive.
     * @param {Element} element - a DOM element
     * @returns {number} index of DOM element's associated region in region array,
     * or -1 if element is not contained in any region
     */
    getElementRegionIndex(element) {
        if (!this.regions || !this.regions.length) {
            return -1;
        }
        return this.regions.findIndex((container) => {
            return this.shadowContains(container, element);
        });
    }

    /**
     * Gets the index of the next (or previous) region to highlight.
     * @param {number} currentRegionIndex, index of the current region
     * @param {boolean} isPrevious, true to get the index of the previous region
     * @returns {number} index of the region to highlight next or -1 if the current region is the last region (1st region for reverse)
     */
    getAdjacentRegionIndex(currentRegionIndex, isPrevious) {
        const lastRegionIndex = this.regions.length - 1;
        if (lastRegionIndex < 0) {
            return -1;
        }
        if (isPrevious) {
            if (currentRegionIndex <= 0) {
                return lastRegionIndex;
            }
            return currentRegionIndex - 1;
        }

        if (currentRegionIndex === lastRegionIndex) {
            return 0;
        }
        return currentRegionIndex + 1;
    }

    /**
     * Checks if a DOM element is visible. This only checks for visibility using
     * `display:none` (on element or any of its ancestors) and doesn't account for
     * elements hidden through other means - such as a opacity, visibility, aria-hidden, etc.
     * @param {Element} element, a DOM element
     * @returns {boolean} false if `display:none` or `visibility:hidden` is set anywhere in element's ancestor tree, true otherwise
     */
    isVisible(element) {
        if (element === document.body || !(element instanceof Element)) {
            return true;
        }
        try {
            const computedStyle =
                window.getComputedStyle(element) || element.style;
            if (!computedStyle) {
                return false;
            }
            const { display, visibility } = computedStyle;
            if (
                (display && display.toLowerCase() === 'none') ||
                (visibility && visibility.toLowerCase() === 'hidden')
            ) {
                return false;
            }
            return this.isVisible(element.parentNode);
        } catch (error) {
            return false;
        }
    }

    /**
     * Checks if a DOM element has no content inside. A DOM has no content inside if it
     * only contains slots as children.
     * @param {Element} element, a DOM element
     * @returns {boolean} - true if element has no children other than slots
     */
    isEmpty(element) {
        if (element.tagName === 'SLOT') {
            if (!this.isEmptyChildren(element.assignedElements())) {
                return false;
            }
        }

        let children = element.children;
        if ((!children || !children.length) && element.shadowRoot) {
            children = element.shadowRoot.children;
        }

        return this.isEmptyChildren(children);
    }

    /**
     * Check if the children are all empty
     * @param {*} children - element
     * @returns {boolean} true if all the child element are empty
     */
    isEmptyChildren(children) {
        if (!children || !children.length) {
            return true;
        }
        const numChildren = children.length;
        for (let index = 0; index < numChildren; index++) {
            const child = children[index];
            if (child.tagName !== 'SLOT' || !this.isEmpty(child)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Searches for regions in the DOM and populates this.regions
     */
    populateRegions() {
        this.regions = [];
        this.shadowTreeWalker(document.body);
    }

    /**
     * Creates a tree walker from the given root and through
     * the shadow DOM adding any F6 regions found
     * @param {Element} root - element for tree walker to start from
     */
    shadowTreeWalker(root) {
        const treeWalker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_ELEMENT,
            this.elementFilter
        );

        while (treeWalker.nextNode()) {
            if (this.isF6Region(treeWalker.currentNode)) {
                this.regions.push(treeWalker.currentNode);
            } else if (treeWalker.currentNode.shadowRoot) {
                this.shadowTreeWalker(treeWalker.currentNode.shadowRoot);
            }
        }
    }

    /**
     * Add document event listeners to handling all the F6 related interations
     */
    initialize() {
        document.addEventListener('keydown', this._debounceKeyDownHandler);
        document.addEventListener('click', this.handleClick);
        this.regions = [];
        this.appendStyleElement();
    }

    /** Removes the event listeners bound in initialize(). */
    cleanUp() {
        document.removeEventListener('keydown', this._debounceKeyDownHandler);
        document.removeEventListener('click', this.handleClick);
        this._regions = [];
        this._debounceKeyDownHandler = null;
        if (this._styleElement) {
            document.head.removeChild(this._styleElement);
            this._styleElement = null;
        }
    }

    handleClick = () => {
        this.clearRegionHighlights();
    };

    /**
     * handle document keydown event, move focus to the adjacent region if it detects CTRL/CMD + F6
     * @param {KeyDown} event
     */

    handleKeyDown = (event) => {
        this.clearRegionHighlights();
        const { key, ctrlKey, metaKey } = event;
        if (key === this.config.navKey && (ctrlKey || metaKey)) {
            this.populateRegions();
            this.handleNavigation(event);
        }
    };

    isF6Region = (element) =>
        element.matches(`*[${this.config.f6RegionAttribute}]`) &&
        this.isVisible(element) &&
        !this.isEmpty(element);

    elementFilter = (element) => {
        if (
            element.parentElement &&
            element.parentElement.matches(`*[${this.config.f6RegionAttribute}]`)
        ) {
            return NodeFilter.FILTER_REJECT;
        }

        if (this.isF6Region(element) || element.shadowRoot) {
            return NodeFilter.FILTER_ACCEPT;
        }

        return NodeFilter.FILTER_SKIP;
    };

    getConfig() {
        return Object.freeze(this.config);
    }
}

let f6Controller;
export const createF6Controller = () => {
    if (!f6Controller) {
        f6Controller = new F6Controller();
    }
    return f6Controller;
};

export const getCurrentRegionAttributeName = () => {
    if (f6Controller) {
        const config = f6Controller.getConfig();
        if (config) {
            return config.f6RegionAttribute;
        }
    }
    return undefined;
};
