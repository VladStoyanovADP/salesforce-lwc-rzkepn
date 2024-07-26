/**
 * increases table height to accommodate new data
 * used with infinite loading
 *
 * @param {Array} prevData - previous datatable data
 * @param {Array} newData - current datatable data
 */
export function addTableHeight(state, prevData, newData) {
    const extraRowCount = newData.length - prevData.length;
    state.tableHeight += extraRowCount * state.rowHeight;
}

/**
 * resets state properties relevant to virtualization
 * rowHeights
 *
 * @param {Object} state - datatable state
 */
export function resetRowHeights(state) {
    const { firstVisibleIndex } = state;
    const firstRenderedIndex = Math.max(
        firstVisibleIndex - state.bufferSize,
        0
    );
    const newOffsets = [0];
    const firstRenderedOffset = state.offsets[firstRenderedIndex];
    newOffsets[firstRenderedIndex] = firstRenderedOffset;
    state.heightCache = {};
    state.offsets = newOffsets;
    state.offsetRanges = [{ start: 0, end: 0 }];
    if (firstRenderedIndex > 0) {
        state.offsetRanges.push({
            start: firstRenderedIndex,
            end: firstRenderedIndex,
        });
    }
    if (state.virtualize && state.rows.length) {
        const remainingRows = state.rows.length - firstRenderedIndex;
        const remainingRowsHeight = state.rowHeight * remainingRows;
        state.tableHeight = firstRenderedOffset + remainingRowsHeight;
    }
}

/**
 * updates state properties relevant to virtualization
 * rowHeights
 *
 * @param {Node} template - the custom element root `this.template` from datatable.js
 * @param {Object} state - datatable state
 * @param {Array} renderedRows  - array of rows currently being rendered
 * @param {Object} refs - datatable refs
 */
export function handleVariableRowHeights(template, state, renderedRows, refs) {
    const currentRange = {
        start: renderedRows[0].rowIndex,
        end: renderedRows[renderedRows.length - 1].rowIndex + 1,
    };
    let adjustFromIndex;
    let adjustmentValue = 0;
    let offsetRangeIndex = findOffsetRangeIndex(
        state.offsetRanges,
        currentRange.start
    );

    const rowElements = template.querySelectorAll(
        '[data-rowgroup-body] [role="row"]'
    );
    for (let i = 0; i < renderedRows.length; i++) {
        const row = renderedRows[i];
        if (!state.heightCache[row.key] && state.heightCache[row.key] !== 0) {
            const rowElement = rowElements[i];
            if (rowElement) {
                // first rendered row needs height increased by 1 to account for missing border
                let height = rowElement.getBoundingClientRect().height;
                if (row.rowIndex && row.rowIndex === currentRange.start) {
                    height++;
                }
                state.heightCache[row.key] = height;

                // calculate estimate of row offset
                setOffset(state, row, offsetRangeIndex, height);

                // update variables used to adjust later row offsets
                adjustmentValue += height - state.rowHeight;
                adjustFromIndex = row.rowIndex + 2;
            }
        }
    }
    state.tableHeight += adjustmentValue;
    updateOffsetRanges(
        state,
        offsetRangeIndex,
        currentRange,
        adjustFromIndex,
        adjustmentValue
    );
    updateVirtualizeStyles(template, state, renderedRows, refs);
}

/**
 * uses binary search with offsets and offsetRange
 * to determine what the first visible index should be
 * for a given scrollTop value
 */
export function findFirstVisibleIndex(state, scrollTop) {
    const { offsetRanges, offsets, rowHeight } = state;
    let start = 0;
    let end = offsetRanges.length - 1;

    while (start <= end) {
        let mid = Math.floor((start + end) / 2);
        const prevRange = offsetRanges[mid];
        const nextRange = offsetRanges[mid + 1];
        const startOffset = offsets[prevRange.start];
        const endOffset = offsets[prevRange.end];

        const scrollTopAfterPrevStart = startOffset <= scrollTop;
        const scrollTopInPrevRange =
            scrollTopAfterPrevStart && scrollTop <= endOffset;
        const scrollTopBeforeNextRange =
            !nextRange || scrollTop < offsets[nextRange.start];
        const scrollTopBetweenRanges =
            scrollTopAfterPrevStart && scrollTopBeforeNextRange;

        // check if scrollTop is in prevAdj offset values
        // or between prevAdj and nextAdj offsetValues
        if (scrollTopInPrevRange) {
            // find offset in prevRange to use for firstVisibleIndex
            return searchForOffset(state, prevRange, scrollTop);
        } else if (scrollTopBetweenRanges) {
            // use scrollTop and rowHeight to calculate firstVisibleIndex
            const diff = scrollTop - endOffset;
            const extraRows = Math.floor(diff / rowHeight);
            state.firstRowOffset = diff % rowHeight;
            return prevRange.end + extraRows;
        }
        // update start or end for next round of binary search
        if (scrollTop < startOffset) {
            end = mid - 1;
        } else {
            start = mid + 1;
        }
    }
    return -1;
}

/**
 * determines the rowIndex for given scrollTop
 * within a provided offset range using binary search
 * also sets firstRowOffset to correct value
 *
 * @param {object} range - object with start and end index for binary search
 * @param {number} scrollTop - value to find offset rowIndex for
 * @returns {number} representing firstVisibleIndex for given scrollTop
 */
function searchForOffset(state, range, scrollTop) {
    let { start, end } = range;
    const offsets = state.offsets;

    while (start <= end) {
        const mid = Math.floor((start + end) / 2);
        const currentOffsetUnderScrollTop = offsets[mid] <= scrollTop;
        const nextOffsetUnderScrollTop =
            offsets[mid + 1] && offsets[mid + 1] <= scrollTop;

        if (currentOffsetUnderScrollTop && !nextOffsetUnderScrollTop) {
            // store how many pixels scrollTop is from top of row
            state.firstRowOffset = scrollTop - offsets[mid];
            return mid;
        } else if (currentOffsetUnderScrollTop) {
            start = mid + 1;
        } else {
            end = mid - 1;
        }
    }
    return -1;
}

/**
 * uses a binary search to find the offsetRange index that
 * encompasses the provided row index, or the one immediately
 * before if no offsetRange encompasses the provided rowIndex
 */
function findOffsetRangeIndex(offsetRanges, rowIndex) {
    let start = 0;
    let end = offsetRanges.length - 1;
    while (start <= end) {
        let mid = Math.floor((start + end) / 2);
        const currentRangeStartsBeforeRowIndex =
            offsetRanges[mid].start <= rowIndex;
        const nextRangeStartsBeforeRowIndex =
            offsetRanges[mid + 1] && offsetRanges[mid + 1].start <= rowIndex;

        // check if rowIndex is between start of range at "mid"
        // and start of range at "mid + 1" (or if there is no "mid + 1")
        if (
            currentRangeStartsBeforeRowIndex &&
            !nextRangeStartsBeforeRowIndex
        ) {
            return mid;
        } else if (currentRangeStartsBeforeRowIndex) {
            // look for earlier offsetRanges
            start = mid + 1;
        } else {
            // look for later offsetRanges
            end = mid - 1;
        }
    }
    return -1;
}

/**
 * sets the offset value for a given row and the next
 * based on the closest set offset value, the default
 * row height and the height of the current row
 *
 * @param {object} state - datatable state
 * @param {object} row - specific row object from state
 * @param {number} offsetRangeIndex - index of offset range to use for row
 * @param {number} height - height of row's node
 */
function setOffset(state, row, offsetRangeIndex, height) {
    let currentRange = state.offsetRanges[offsetRangeIndex];
    let currentOffset = state.offsets[row.rowIndex];
    // if no offset is set for current row, estimate it
    // based on most recent offset and default rowHeight
    if (!currentOffset) {
        currentOffset = 0;
        if (currentRange) {
            const baseOffset = state.offsets[currentRange.end];
            const estimatedRowOffsets =
                (row.rowIndex - currentRange.end) * state.rowHeight;
            currentOffset = baseOffset + estimatedRowOffsets;
            state.offsets[row.rowIndex] = currentOffset;
        }
    }
    // set next offset based on current offset and height
    state.offsets[row.rowIndex + 1] = currentOffset + height;
}

/**
 * merges or adds new offset range and
 * updates offsets and range values as needed
 *
 * @param {number} offsetRangeIndex
 * @param {*} state - datatable state
 * @param {object} currentRange - range for current rendered rows
 * @param {number} adjustFromIndex  - first index to increase by rangeValue
 * @param {number} rangeValue - amount to increase offsets after adjustFromIndex
 */
function updateOffsetRanges(
    state,
    offsetRangeIndex,
    currentRange,
    adjustFromIndex,
    adjustmentValue
) {
    const { offsets, offsetRanges } = state;
    let prevRange = offsetRanges[offsetRangeIndex];
    let nextRange = offsetRanges[offsetRangeIndex + 1];
    const overlapsWithPrevRange =
        prevRange && checkOverlap(prevRange, currentRange);
    const overlapsWithNextRange =
        nextRange && checkOverlap(currentRange, nextRange);

    // update remaining values in next range by
    // adjustment value if we're overlapping it
    if (overlapsWithNextRange && adjustmentValue) {
        for (let i = adjustFromIndex; i <= nextRange.end; i++) {
            offsets[i] = offsets[i] + adjustmentValue;
        }
    }

    // update state.offsetRanges
    if (overlapsWithPrevRange && overlapsWithNextRange) {
        nextRange.start = prevRange.start;
        nextRange.end = Math.max(currentRange.end, nextRange.end);
        state.offsetRanges.splice(offsetRangeIndex, 1); // removes prevRange
    } else if (overlapsWithPrevRange) {
        prevRange.end = Math.max(prevRange.end, currentRange.end);
    } else if (overlapsWithNextRange) {
        nextRange.start = currentRange.start;
        nextRange.end = Math.max(currentRange.end, nextRange.end);
        // increase offsetRangeIndex; since it's values have already been updated
        // we want to skip it when adjusting offsets in later ranges
        offsetRangeIndex = offsetRangeIndex + 1;
    } else {
        state.offsetRanges.splice(offsetRangeIndex + 1, 0, currentRange);
        // need to increase offsetRangeIndex so we don't
        // unnecessarily add adjustmentValue to currentRange
        offsetRangeIndex = offsetRangeIndex + 1;
    }

    // loop through every offset range after the current one
    // and increase the offset for each index by adjustmentValue
    if (offsetRangeIndex >= 0) {
        for (let i = offsetRangeIndex + 1; i < offsetRanges.length; i++) {
            const { start: rangeStart, end: rangeEnd } = offsetRanges[i];
            for (let j = rangeStart; j <= rangeEnd; j++) {
                offsets[j] = offsets[j] + adjustmentValue;
            }
        }
    }
}

/**
 * compares start/end of two ranges to see if the values overlap
 * used to determine if renderedRows are part of an existent offsetRange
 * or if a new offsetRange will need to be added
 */
function checkOverlap(range1, range2) {
    return (
        (range1.start <= range2.start && range2.start <= range1.end) ||
        (range1.start <= range2.end && range2.end <= range1.end)
    );
}

/**
 * updates scrollTop and top values for rows when
 * using virtualization
 */
function updateVirtualizeStyles(template, state, renderedRows, refs) {
    // update scrollTop so firstVisibleIndex is correctly placed in viewport
    const scrollerY =
        refs?.scrollerY || template.querySelector('.slds-scrollable_y');
    scrollerY.scrollTop =
        state.offsets[state.firstVisibleIndex] + state.firstRowOffset;

    // update top of rendered rows based on offsets
    // if first rendered row isn't first row we need to
    // add 1 to its offset to account for missing top border
    const addOffset = !!renderedRows[0].rowIndex;
    renderedRows.forEach((row, index) => {
        let top = state.offsets[row.rowIndex];
        if (addOffset && !index) {
            top = top + 1; // reset first rendered row to offset in state
        }
        row.style = `position:absolute;top:${top}px;`;
    });
}
