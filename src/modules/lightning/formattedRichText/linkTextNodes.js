import {
    urlRegexString,
    emailRegexString,
    createHttpHref,
    createEmailHref,
} from 'lightning/utilsPrivate';

export function linkTextNodes(container) {
    const urlRegex = new RegExp(`^${urlRegexString}/?$`, 'i');
    const emailRegex = new RegExp(`^${emailRegexString}$`, 'i');
    const toReplace = [];
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
        const currentNode = walker.currentNode;
        const parent = walker.currentNode.parentNode;
        if (parent.nodeName === 'A') {
            // Do not add double a tags
            continue;
        }
        // &quot; = legacy supported edge case for docs
        // ; = urls cannot have semicolons
        // ["'] = common to quote links in docs
        const items = walker.currentNode.nodeValue.split(
            /(&quot;|;|["']?\s+["']?|["'])/g
        );
        const fragment = document.createDocumentFragment();
        let hasLink = false;
        items.forEach((text, i) => {
            if (i % 2 === 0) {
                if (text.match(urlRegex)) {
                    const a = document.createElement('a');
                    a.href = createHttpHref(text);
                    a.target = '_blank';
                    a.rel = 'noopener';
                    a.appendChild(document.createTextNode(text));
                    fragment.appendChild(a);
                    hasLink = true;
                } else if (text.match(emailRegex)) {
                    const a = document.createElement('a');
                    a.href = createEmailHref(text);
                    a.appendChild(document.createTextNode(text));
                    fragment.appendChild(a);
                    hasLink = true;
                } else if (text) {
                    fragment.appendChild(document.createTextNode(text));
                }
            } else if (text) {
                fragment.appendChild(document.createTextNode(text));
            }
        });
        if (hasLink) {
            toReplace.push({ parent, fragment, currentNode });
        }
    }
    toReplace.forEach(({ parent, fragment, currentNode }) => {
        parent.replaceChild(fragment, currentNode);
    });
}
