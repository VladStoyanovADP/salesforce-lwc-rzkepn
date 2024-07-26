import { normalizeString } from 'lightning/utilsPrivate';
import { WindowManager } from './util';

// TODO: Remove, not currently in use.
const ALIGN_REGEX = /^(left|right|center)\s(top|bottom|center)$/;

export const Direction = {
    Center: 'center',
    Middle: 'middle',
    Right: 'right',
    Left: 'left',
    Bottom: 'bottom',
    Top: 'top',
    Default: 'default',
};

const VerticalMap = {
    top: Direction.Top,
    bottom: Direction.Bottom,
    center: Direction.Middle,
};

const HorizontalMap = {
    left: Direction.Left,
    right: Direction.Right,
    center: Direction.Center,
};

const FlipMap = {
    left: Direction.Right,
    right: Direction.Left,
    top: Direction.Bottom,
    bottom: Direction.Top,
    center: Direction.Center,
    default: Direction.Right,
};

function getContainerSize(parent) {
    if (parent) {
        return parent.getBoundingClientRect();
    }

    const rect = {
        width:
            WindowManager.window.innerWidth || document.body.clientWidth || 0,
        height:
            WindowManager.window.innerHeight || document.body.clientHeight || 0,
        top: 0,
        left: 0,
    };

    rect.bottom = rect.height;
    rect.right = rect.width;
    return rect;
}

export function normalizeDirection(direction, defaultValue) {
    return normalizeString(direction, {
        fallbackValue: defaultValue || Direction.Default,
        validValues: [
            Direction.Center,
            Direction.Right,
            Direction.Left,
            Direction.Bottom,
            Direction.Top,
            Direction.Middle,
            Direction.Default,
        ],
    });
}

export function mapToHorizontal(value) {
    value = normalizeDirection(value, Direction.Left);
    return HorizontalMap[value];
}

export function mapToVertical(value) {
    value = normalizeDirection(value, Direction.Left);
    return VerticalMap[value];
}

export function flipDirection(value) {
    value = normalizeDirection(value, Direction.Left);
    return FlipMap[value];
}

// TODO: Remove, not currently in use.
export function isValidDirection(value) {
    return value && value.match(ALIGN_REGEX);
}

export function checkFlipPossibility(parent, element, target, leftAsBoundary) {
    const viewPort = getContainerSize(parent);
    const windowViewPort = getContainerSize();
    const elemRect = element.getBoundingClientRect();
    const referenceElemRect = target.getBoundingClientRect();
    const height =
        typeof elemRect.height !== 'undefined'
            ? elemRect.height
            : elemRect.bottom - elemRect.top;
    const width =
        typeof elemRect.width !== 'undefined'
            ? elemRect.width
            : elemRect.right - elemRect.left;

    // TODO: We'll need to revisit the leftAsBoundary config property. Either we'll need a better
    // name to cover the RTL language cases and maybe open up the possibility of bounding the
    // element to the target in both the horizontal and vertical directions.

    // The boundary shrinks the available area to the edge of the target rather than the viewport.
    let rightAsBoundary = false;
    if (document.dir === 'rtl') {
        rightAsBoundary = leftAsBoundary;
        leftAsBoundary = false;
    }

    // Bug Fix for https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000008DxOhIAK/view
    // If viewport is scrollableParent, then should count the top of scrollerParent,
    // otherwise, window top is 0. no change to original logic.
    // When used in console app, console's viewport is not window, but a scrollable div, then popup can be cut off easily.
    // scrollable parent => if any parent element set overflow-y:auto, then inner element won't popup, unless use position:fix.
    let aboveSpace = referenceElemRect.top - viewPort.top - height;
    let belowSpace = viewPort.height - referenceElemRect.bottom - height;

    // If there is scrollable parent, always check aboveSpace > 0
    let hasSpaceAbove =
        aboveSpace >= 0 ||
        (parent == null && belowSpace < 0 && aboveSpace > belowSpace);
    let hasSpaceBelow =
        belowSpace >= 0 || (aboveSpace < 0 && belowSpace > aboveSpace);

    // Assuming left alignment is specified this tests if:
    // - there's room to accommodate the element with right alignment
    //      - within the viewport, if parent present
    // - there's not enough room to accommodate the element with left alignment
    let shouldAlignToRight = false;
    if (parent) {
        shouldAlignToRight =
            referenceElemRect.right - viewPort.left >= width &&
            referenceElemRect.left + width >
                (rightAsBoundary ? referenceElemRect.right : viewPort.width);
    } else {
        shouldAlignToRight =
            referenceElemRect.right >= width &&
            referenceElemRect.left + width >
                (rightAsBoundary ? referenceElemRect.right : viewPort.width);
    }

    // Assuming right alignment is specified this tests if:
    // - there's room to accommodate the element with left alignment
    //      - within the viewport if parent present
    // - there's not enough room to accommodate the element with right alignment
    let shouldAlignToLeft = false;
    if (parent) {
        shouldAlignToLeft =
            referenceElemRect.left + width <= viewPort.right &&
            referenceElemRect.right - viewPort.left - width <
                (leftAsBoundary ? referenceElemRect.left : 0);
    } else {
        shouldAlignToLeft =
            referenceElemRect.left + width <= viewPort.width &&
            referenceElemRect.right - width <
                (leftAsBoundary ? referenceElemRect.left : 0);
    }

    const spaceRemainingRight = viewPort.width - referenceElemRect.left;
    const spaceRemainingLeft = referenceElemRect.right;

    if (!shouldAlignToLeft && !shouldAlignToRight && parent) {
        shouldAlignToRight =
            (referenceElemRect.right - viewPort.left >= width ||
                referenceElemRect.right >= width) &&
            referenceElemRect.left + width >
                (rightAsBoundary ? referenceElemRect.right : viewPort.width);

        shouldAlignToLeft =
            (referenceElemRect.left + width <= viewPort.right ||
                referenceElemRect.left + width <= windowViewPort.width) &&
            referenceElemRect.right - width <
                (leftAsBoundary ? referenceElemRect.left : 0);
    }
    // W-13716578 W-14991047
    // Align to side with maximum available space only if:
    //  - it cannot align to left based on previous checks
    //  - it cannot align to right based on previous checks
    //  - the available space on either side does not fully fit element width
    // Check #3 is for when there is space on both sides, then both shouldAlignToLeft and shouldAlignToRight
    // are false, but we want it to use the default alignment instead of max available space
    else if (
        !shouldAlignToLeft &&
        !shouldAlignToRight &&
        spaceRemainingRight < width &&
        spaceRemainingLeft < width
    ) {
        shouldAlignToRight = spaceRemainingLeft > spaceRemainingRight;
        shouldAlignToLeft = spaceRemainingLeft < spaceRemainingRight;
    }

    // If there is no space above and below, recalculate space based on window
    // when there is still no space above and below based on window then select the maximum available space

    if (
        !hasSpaceAbove &&
        !hasSpaceBelow &&
        parent &&
        element.style &&
        element.style.position === 'fixed'
    ) {
        hasSpaceAbove = referenceElemRect.top - windowViewPort.top - height > 0;
        hasSpaceBelow =
            windowViewPort.height - referenceElemRect.bottom - height > 0;
    }

    // Assuming center alignment, does the viewport have space to fit half of the element around
    // the target?
    const centerOverflow = {
        left: referenceElemRect.left - width * 0.5 < 0,
        right: referenceElemRect.right + width * 0.5 > viewPort.width,
        top: referenceElemRect.top - height * 0.5 < 0,
        bottom: referenceElemRect.bottom + height * 0.5 > viewPort.height,
    };

    return {
        shouldAlignToLeft,
        shouldAlignToRight,
        hasSpaceAbove,
        hasSpaceBelow,
        centerOverflow,
    };
}
