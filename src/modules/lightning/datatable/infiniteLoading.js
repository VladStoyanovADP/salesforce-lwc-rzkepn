import { normalizeBoolean } from 'lightning/utilsPrivate';
import {
    getScrollOffsetFromTableEnd,
    getScrollerY,
    isNonNegativeInteger,
} from './utils';

const SCROLL_ALLOWANCE = 2;
export const DEFAULT_LOAD_MORE_OFFSET = 20;

/*********************** STATE MANAGEMENT ************************/

/**
 * Sets the loading state of the datatable.
 *
 * @param {Object} state The datatable state object
 * @param {Boolean} value The loading state to set
 */
export function setLoading(state, value) {
    state.isLoading = normalizeBoolean(value);
}

/**
 * Sets the infinite loading option on the datatable.
 *
 * @param {Object} state The datatable state object
 * @param {Boolean} value The infinite loading state to set
 */
export function setEnableInfiniteLoading(state, value) {
    state.enableInfiniteLoading = normalizeBoolean(value);
}

/**
 * Returns the load more offset
 *
 * @param {Object} state The datatable state object
 * @returns {Number} The currently configured load more offset value
 */
export function getLoadMoreOffset(state) {
    return state.loadMoreOffset;
}

/**
 * Sets the load more offset value. Must be a number >= 0.
 *
 * @param {Object} state The datatable state object
 * @param {Boolean} value The load more offset value to set
 */
export function setLoadMoreOffset(state, value) {
    if (!isNonNegativeInteger(value)) {
        // eslint-disable-next-line no-console
        console.warn(
            `The "loadMoreOffset" value passed into lightning:datatable is incorrect. "loadMoreOffset" value should be an integer >= 0.`
        );
    }

    state.loadMoreOffset = isNonNegativeInteger(value)
        ? parseInt(value, 10)
        : DEFAULT_LOAD_MORE_OFFSET;
}

/************************** PUBLIC METHODS ***************************/

/**
 * Checks whether the datatable should begin loading more content
 * and then dispatches the 'loadmore' event indicating that directive.
 *
 * @param {Event} event
 */
export function handleLoadMoreCheck(event) {
    const { state } = this;
    if (state.isLoading) {
        return;
    }

    const contentContainer = event.target.firstChild;
    if (!contentContainer) {
        return;
    }

    const offset = getScrollOffsetFromTableEnd(contentContainer);
    const threshold = getLoadMoreOffset(state);
    if (offset < threshold) {
        this.dispatchEvent(new CustomEvent('loadmore'));
    }
}

/**
 * Determines whether or not to prefetch data. If so,
 * dispatches the `loadmore` event.
 */
export function handlePrefetch() {
    const { state, template, refs } = this;
    if (
        state.isLoading ||
        !state.enableInfiniteLoading ||
        (state.enableViewportRendering &&
            this._renderManager &&
            !this._renderManager.hasWrapperHeight()) ||
        !state.rows.length
    ) {
        // Don't prefetch if already loading or data is not set yet.
        return;
    }

    const scrollerY = getScrollerY(template, refs);
    if (scrollerY && isScrollerVisible(scrollerY) && !isScrollable(scrollerY)) {
        this.dispatchEvent(new CustomEvent('loadmore'));
    }
}

/************************** PRIVATE METHODS ***************************/

/**
 * Determines if a scroller element is scrollable.
 *
 * @param {Element} scroller The scroller element to check
 * @returns {Boolean} Whether the element is scrollable
 */
function isScrollable(scroller) {
    // scrollHeight should be greater than clientHeight by some allowance
    return scroller.scrollHeight > scroller.clientHeight + SCROLL_ALLOWANCE;
}

/**
 * Determines if a scroller element's scroll bars are visible.
 * Check for values over 1 since div tables have a height of 1 on
 * initial render but should not trigger loadmore.
 *
 * @param {Element} scroller The scroller element to check
 * @returns {Boolean} Whether the scroller element's scroll bars are visible
 */
function isScrollerVisible(scroller) {
    return !!(
        scroller.offsetParent &&
        scroller.offsetHeight > 1 &&
        scroller.offsetWidth > 1
    );
}
