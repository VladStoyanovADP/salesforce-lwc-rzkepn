// Matches lower cased tag names of standard inputable elements as well as
// custom elements whose tag names contain inputable names.
const inputableNode = /input|select|textarea|button|object/;

function visible(element) {
    // Check computed style visibility first because it doesn't cause a layout
    // reflow/recalculation.
    if (window.getComputedStyle(element).visibility === 'hidden') {
        return false;
    }
    // Perform the performance heavier `getBoundingClientRect()` last because
    // it causes a page layout reflow/recalculation.
    const { width, height } = element.getBoundingClientRect();
    return width > 0 || height > 0;
}

function focusable(element) {
    const tagName = element.tagName.toLowerCase();
    if (
        (tagName === 'a' && element.href) ||
        (!element.disabled && inputableNode.test(tagName))
    ) {
        return visible(element);
    }
    return false;
}

function tabbable(element) {
    // Perform the "isDataActionable" first as `focusable()` is potentially
    // performance heavy.
    return (
        element.dataset.navigation === 'enable' ||
        (element.tabIndex >= 0 && focusable(element))
    );
}

export function queryFocusable(element) {
    const childElements = element.querySelectorAll('*');
    const focusables = [];
    for (let i = 0, { length } = childElements; i < length; i += 1) {
        const child = childElements[i];
        if (tabbable(child)) {
            focusables.push(child);
        }
    }
    return focusables;
}
