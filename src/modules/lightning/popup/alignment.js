import { normalizeString, isUndefinedOrNull } from 'lightning/utilsPrivate';

export const DEFAULT_POPUP_ALIGNMENT = {
    horizontal: 'left',
    vertical: 'bottom',
};

export function createAlignmentConfiguration(alignmentOptions = {}) {
    const padding = convertRemToPixels(alignmentOptions.padding);
    const offset = convertRemToPixels(alignmentOptions.offset || 0);

    const targetAlign = getCompoundAlignment(alignmentOptions.reference, {
        horizontal: 'right',
        vertical: 'bottom',
    });

    const align = getCompoundAlignment(
        alignmentOptions.popup,
        DEFAULT_POPUP_ALIGNMENT
    );

    let padLeft;
    let padRight;
    let padTop;
    let padBottom;

    if (targetAlign.horizontal === 'right' && align.horizontal === 'left') {
        padLeft = padding;
        padTop = -offset;
    } else if (
        targetAlign.horizontal === 'left' &&
        align.horizontal === 'right'
    ) {
        padLeft = -padding;
        padTop = -offset;
    }

    if (targetAlign.vertical === 'bottom' && align.vertical === 'top') {
        padTop = -padding;
        padLeft = offset;
    } else if (targetAlign.vertical === 'top' && align.vertical === 'bottom') {
        padTop = padding;
        padLeft = offset;
    }

    return {
        align,
        targetAlign,
        autoFlip: isUndefinedOrNull(alignmentOptions.autoFlip)
            ? true
            : alignmentOptions.autoFlip,
        padLeft: undefinedIfZero(padLeft),
        padRight: undefinedIfZero(padRight),
        padBottom: undefinedIfZero(padBottom),
        padTop: undefinedIfZero(padTop),
    };
}

function undefinedIfZero(number) {
    if (number === 0) {
        return undefined;
    }
    return number;
}

function getCompoundAlignment(alignment, defaultAlignment) {
    if (!alignment) {
        return defaultAlignment;
    }
    const horizontal = normalizeString(alignment.horizontal, {
        fallbackValue: defaultAlignment.horizontal,
        validValues: ['left', 'center', 'right'],
    });
    const vertical = normalizeString(alignment.vertical, {
        fallbackValue: defaultAlignment.vertical,
        validValues: ['top', 'center', 'bottom'],
    });
    return {
        horizontal,
        vertical,
    };
}

function convertRemToPixels(rem) {
    if (isNaN(parseFloat(rem))) {
        return 0;
    }
    let rootFontSize = parseFloat(getComputedStyle(document.body).fontSize);
    if (isNaN(rootFontSize)) {
        // should really only happen for jest tests, since jsdom won't have
        // the fontSize size
        rootFontSize = 16;
    }
    return Math.round(parseFloat(rem) * rootFontSize);
}
