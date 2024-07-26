/**
 * This marks all siblings of the blocking elements and the siblings of all of its parents as inert by setting
 * 'aria-hidden' to 'true'.
 *
 * This assumes that the DOM is not being modified while the blocking element is showing, otherwise observers would
 * be needed.
 *
 * @param {Element} blockingElement The active element that will be be blocking the rest of the page.
 * @returns {Array} An array of {node, ariaHidden} objects, where node is the node that had its ariaHidden set
 * to 'true', and ariaHidden is the previous value of the 'aria-hidden' attribute. Use this to restore inertness.
 */
export function makeEverythingExceptElementInert(blockingElement) {
    const savedInertElements = [];
    let nonInertElement = blockingElement;
    let parent = nonInertElement.parentNode.host || nonInertElement.parentNode;
    while (parent != null) {
        if (parent.nodeType === Node.ELEMENT_NODE) {
            // Start with the first child, if the parent blockingElement has a shadow root then use the first child of that
            let child = parent.firstChild;
            if (child === null && parent.shadowRoot) {
                child = parent.shadowRoot.firstChild;
            }
            while (child !== null) {
                // Ignore the blocking elements and all its parents (nonInertElement).
                if (
                    child.nodeType === Node.ELEMENT_NODE &&
                    child !== nonInertElement &&
                    child.localName !== 'head'
                ) {
                    savedInertElements.push({
                        node: child,
                        ariaHidden: child.ariaHidden,
                    });
                    child.ariaHidden = true;
                }
                child = child.nextSibling;
            }
            nonInertElement = parent;
            parent = parent.parentNode;
        } else if (parent.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
            // It maybe a custom component, attempt to get the host
            parent = parent.host;
        } else {
            parent = parent.parentNode;
        }
    }
    return savedInertElements;
}

export function restoreInertness(savedInertElements) {
    for (let i = 0, { length } = savedInertElements; i < length; i += 1) {
        const element = savedInertElements[i];
        const { node } = element;
        if (node) {
            node.ariaHidden = element.ariaHidden;
        }
    }
}
