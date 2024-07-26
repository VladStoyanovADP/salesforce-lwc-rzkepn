import { getScrollOffsetFromTableEnd, normalizeNumberAttribute } from './utils';
import { LightningResizeObserver } from 'lightning/resizeObserver';
import { normalizeBoolean, normalizeString } from 'lightning/utilsPrivate';
import { resetRowHeights } from './virtualization';

export const DEFAULT_ROW_HEIGHT = 30.5;
const DEFAULT_BUFFER_SIZE = 5;
const ROW_THRESHOLD = 10;
const DEFAULT_SCROLL_THRESHOLD = ROW_THRESHOLD * DEFAULT_ROW_HEIGHT;
const VERTICAL_VIRTUALIZATION = 'vertical';

export function setViewportRendering(state, value) {
    state.enableViewportRendering = normalizeBoolean(value);
}

export function setVirtualize(state, value) {
    if (state.renderModeRoleBased) {
        state.virtualize = normalizeString(value, {
            fallbackValue: '', //no virtualization enabled
            validValues: [VERTICAL_VIRTUALIZATION],
        });
    } else {
        state.virtualize = '';
    }
}

function getDefaultPreviousInfo() {
    return {
        renderedRowCount: 0,
        totalRowCount: 0,
        firstRowKey: '',
    };
}

/**
 * @typedef RenderManagerConfig
 * @type {object}
 * @property {boolean} viewportRendering - specifies whether to use viewport rendering
 * @property {number} rowHeight - specifies the height of a row, in px
 * @property {number|string} bufferSize - specifies the number of additional rows to render above/below what's visible on screen
 * @property {string} virtualize - string representing what kind of virtualization to enable; currently only 'vertical' is available
 */

/**
 * Handles any custom rendering in datatable.
 *
 * Currently only supports viewport rendering, which renders only the number of rows
 * that can be shown in the table viewport. Provides a stepping stone towards
 * full virtual rendering
 */
export class RenderManager {
    constructor() {
        this.threshold = DEFAULT_SCROLL_THRESHOLD;
        this.wrapperHeight = 0;
        this.previousCache = getDefaultPreviousInfo();
    }

    /**
     * Updates and normalizes configuration for RenderManager
     * Used when setting renderConfig for datatable
     *
     * @param {Object} state - The datatable state
     * @param {Function} getWrapperHeight - A function to get height of datatable wrapper
     * @param {RenderManagerConfig} config - The render management config
     */
    configure(state, getWrapperHeight, config) {
        const { rowHeight, bufferSize } = config;
        // Untracked state changes.
        setVirtualize(state, config.virtualize);
        setViewportRendering(state, config.viewportRendering);
        if (state.virtualize || state.enableViewportRendering) {
            this.initializeResizeObserver(state, getWrapperHeight);
        }
        let computedBufferSize =
            typeof bufferSize != 'undefined' ? bufferSize : DEFAULT_BUFFER_SIZE;
        state.bufferSize = normalizeNumberAttribute(
            'bufferSize',
            computedBufferSize,
            'non-negative',
            DEFAULT_BUFFER_SIZE
        );
        if (typeof rowHeight === 'number') {
            state.rowHeight = rowHeight;
            this.threshold = ROW_THRESHOLD * rowHeight;
        }
    }

    /**
     * Render only rows that fit within the viewport
     *
     * If data has changed (verifying only row 1), reset everything
     * Otherwise, if total row count has increased and we are within the scroll threshold,
     * append a viewport's worth of rows to the currently rendered rows. This happens when
     * the user has added more data to the datatable (e.g when a loadMore is triggered)
     *
     * @param {Object} state - datatable state
     * @param {Node} gridContainer - node containing datatable header and rows
     * @param {Boolean} forceUpdate - always recalculates row count if true
     */
    updateViewportRendering(state, gridContainer, forceUpdate) {
        if (this.hasDataChanged(state.rows) || forceUpdate) {
            this.updateRenderedRows(state, this.getRowCountWithBuffer(state));
        } else if (
            this.previousCache.totalRowCount < state.rows.length &&
            this.isWithinThreshold(gridContainer)
        ) {
            this.updateRenderedRows(
                state,
                this.previousCache.renderedRowCount +
                    this.getRowCountWithBuffer(state)
            );
        } else {
            this.updateRenderedRows(state, this.previousCache.renderedRowCount);
        }
    }

    /**
     * Handles scroll event on datatable if viewport rendering enabled
     * If the scroll is within a specified threshold of the bottom,
     * calculate and render the next batch of rows
     *
     * @param {Object} state - datatable state
     * @param {Event} event - scroll event
     */
    handleScroll(state, event) {
        const { rows, renderedRowCount } = state;
        if (
            this.isWithinThreshold(event.target.firstChild) &&
            renderedRowCount < rows.length
        ) {
            this.updateRenderedRows(
                state,
                renderedRowCount + this.getRowCountWithBuffer(state)
            );
        }
    }

    /**
     * calculates the range of rows that should be rendered based on the
     * first visible index, buffer size and number of rendered rows
     *
     * @param {Object} state - datatable state
     * @returns {Object} object with firstIndex and lastIndex of rendered range of rows
     */
    getRenderedRange(state) {
        const {
            firstVisibleIndex,
            bufferSize,
            renderedRowCount,
            rows,
            rowHeight,
            heightCache,
        } = state;

        const firstIndex = Math.max(firstVisibleIndex - bufferSize, 0);
        let lastIndex = firstVisibleIndex - bufferSize + renderedRowCount;
        const firstVisibleKey =
            rows[firstVisibleIndex] && rows[firstVisibleIndex].key;

        // if using variable heights, see if we can get more
        // accurate estimate based on known row heights
        if (heightCache[firstVisibleKey]) {
            let i = firstVisibleIndex;
            let currentHeight = 0;
            let knownRowHeight = rows[i] && heightCache[rows[i].key];
            // loop through rows until we find last row based on wrapper height
            while (knownRowHeight && currentHeight < this.wrapperHeight) {
                currentHeight += knownRowHeight;
                i = i + 1;
                knownRowHeight = rows[i] && heightCache[rows[i].key];
            }
            if (currentHeight >= this.wrapperHeight) {
                // all row heights were measured; i is first non-visible index
                lastIndex = i + bufferSize;
            } else {
                // at least some row heights not yet measured
                // i is first visible index with unknown height
                // guess lastIndex based on default row height
                const extraRowEstimate = Math.ceil(
                    (this.wrapperHeight - currentHeight) / rowHeight
                );
                lastIndex = i + extraRowEstimate + bufferSize;
            }
        }

        // without this, we may render too few rows when there
        // aren't enough rows for virtualization to be needed
        if (
            renderedRowCount === rows.length &&
            lastIndex <= rows.length - bufferSize
        ) {
            lastIndex = renderedRowCount;
        }
        return { firstIndex, lastIndex };
    }

    /**
     * Updates internal cache of row counts and first key
     *
     * @param {Object} state - datatable state
     * @param {Number} rowCount - max number of rows to set renderedRowCount to
     */
    updateRenderedRows(state, rowCount) {
        const rows = state.rows;
        const totalRows = rows.length;
        const normalizedRowCount = rowCount
            ? Math.min(rowCount, totalRows)
            : totalRows;
        if (state.enableViewportRendering) {
            if (state.renderedRowCount < normalizedRowCount) {
                state.renderedRowCount = normalizedRowCount;
                // Update our internal cache
                this.previousCache.renderedRowCount = normalizedRowCount;
            }
        } else {
            state.renderedRowCount = normalizedRowCount;
            // Update our internal cache
            this.previousCache.renderedRowCount = normalizedRowCount;
        }
        this.previousCache.totalRowCount = totalRows;

        if (rows.length > 0) {
            this.previousCache.firstRowKey = rows[0].key;
        }
    }

    /**
     * Caches the height of the wrapper in Datatable to avoid
     * unnecessary reflows
     *
     * @param {Function} getWrapperHeight - function to get height of datatable wrapper
     */
    updateWrapperHeight(getWrapperHeight) {
        this.wrapperHeight = getWrapperHeight();
    }

    /************************** OBSERVER MANAGEMENT **************************/

    /**
     * Initializes a resize observer to update the wrapper height
     * when the datatable component's height changes
     *
     * @param {Object} state - datatable state
     * @param {Function} getWrapperHeight - A function to get the height of datatable wrapper
     */
    initializeResizeObserver(state, getWrapperHeight) {
        if (!this._heightResizeObserver) {
            this._heightResizeObserver = new LightningResizeObserver(() => {
                if (this._resizeObserverConnected) {
                    this.updateWrapperHeight(getWrapperHeight);

                    // If the wrapper is now larger than the table or virtualization enabled,
                    // we need to update the rendered rows so users can continue scrolling
                    const rowCountWithBuffer =
                        this.getRowCountWithBuffer(state);

                    resetRowHeights(state);

                    if (
                        rowCountWithBuffer > state.renderedRowCount ||
                        state.virtualize
                    ) {
                        this.updateRenderedRows(state, rowCountWithBuffer);
                    }
                }
            });
        }
    }

    /**
     * Connect the resize observer to the correct element
     *
     * @param {Node} resizeTarget
     */
    connectResizeObserver(resizeTarget) {
        const { _heightResizeObserver } = this;
        if (_heightResizeObserver) {
            _heightResizeObserver.observe(resizeTarget);
            this._resizeObserverConnected = true;
        }
    }

    /**
     * Disconnect the resize observer
     */
    disconnectResizeObserver() {
        const { _heightResizeObserver } = this;
        if (_heightResizeObserver) {
            this._resizeObserverConnected = false;
            _heightResizeObserver.disconnect();
        }
    }

    /************************* HELPER FUNCTIONS **************************/

    /**
     * Calculates how many rows fits within the current wrapper
     */
    getRowCountInViewport(state) {
        return Math.ceil(this.wrapperHeight / state.rowHeight);
    }

    /**
     * Calculates how many rows fit in current wrapper with an added buffer
     * Used to determine how many additional rows to render
     */
    getRowCountWithBuffer(state) {
        const multiplier = state.virtualize ? 2 : 1;
        return (
            this.getRowCountInViewport(state) + state.bufferSize * multiplier
        );
    }

    /**
     * Checks if offset is within threshold of end of table
     * Used when determining if additional rows should be rendered
     * @returns {boolean} true if offset is within threshold
     */
    isWithinThreshold(target) {
        const offset = getScrollOffsetFromTableEnd(target);
        return offset <= this.threshold;
    }

    /**
     * Checks key of first row to determine if data has changed
     * Used to determine if viewport rendering should be reset
     * @param {Array} rows
     * @returns {Boolean} true if key of first row has changed
     */
    hasDataChanged(rows) {
        return (
            rows.length > 0 && this.previousCache.firstRowKey !== rows[0].key
        );
    }

    hasWrapperHeight() {
        return !!this.wrapperHeight;
    }
}
