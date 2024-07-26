import { guid, isNativeComponent, isCSR } from 'lightning/utilsPrivate';

import {
    setAriaActiveDescendant,
    setAriaDescribedBy,
    setAriaLabelledBy,
    setAriaControls,
    setAriaDetails,
} from './polyfill.js';

const SUPPORTED_ATTRIBUTES_ARRAY = [
    [
        'aria-controls',
        {
            ariaReflection: 'ariaControlsElements',
            polyfill: setAriaControls,
        },
    ],
    [
        'aria-labelledby',
        {
            ariaReflection: 'ariaLabelledByElements',
            polyfill: setAriaLabelledBy,
        },
    ],
    [
        'aria-describedby',
        {
            ariaReflection: 'ariaDescribedByElements',
            polyfill: setAriaDescribedBy,
        },
    ],
    [
        'aria-activedescendant',
        {
            ariaReflection: 'ariaActiveDescendantElement',
            polyfill: setAriaActiveDescendant,
        },
    ],
    [
        'aria-details',
        {
            ariaReflection: 'ariaDetailsElements',
            polyfill: setAriaDetails,
        },
    ],
];

/*
    Aria Reflection is used if supported by browser.
    If Aria Reflection is not available, fallback to polyfill
    Aria Reflection: https://wicg.github.io/aom/aria-reflection-explainer.html
    Polyfill: https://git.soma.salesforce.com/lwc/aria-element-reflection
*/
const SUPPORTED_ATTRIBUTES_MAP = new Map(SUPPORTED_ATTRIBUTES_ARRAY);

// Sniff for ARIA element reflection
let BROWSER_SUPPORTS_ARIA_ELEMENT_REFLECTION;
if (isCSR) {
    BROWSER_SUPPORTS_ARIA_ELEMENT_REFLECTION = [
        ...SUPPORTED_ATTRIBUTES_MAP.values(),
    ].every(({ ariaReflection }) => ariaReflection in Element.prototype);
}

function extractElements(root, ids) {
    if (typeof ids !== 'string' || ids === '') {
        return [];
    }
    // We must query the elements in the order of ids, so that
    // the content will be extracted in the correct order.
    return splitIds(ids)
        .map((id) => root.querySelector(`[id*="${id}"]`))
        .filter((el) => !!el);
}

function splitIds(ids) {
    return ids ? (ids + '').trim().split(/\s+/) : [];
}

export default class AriaObserver {
    constructor(component) {
        this.component = component;
        this.template = component.template;
        this.isNativeShadow = isNativeComponent(component);
        this.state = {};
        this.liveIds = {};
        this.guid = guid();
        this.placeholderContainer = null;
        this.ariaReflectionMap = new Map();
        this.nodeMap = new Map();
    }

    connectLiveIdRef(refs, callback) {
        const selector = (refs + '')
            .trim()
            .split(/\s+/)
            .map((ref) => `[id*="${ref}"]`)
            .join(',');
        let liveId;
        if (this.liveIds[refs]) {
            this.liveIds[refs].callbacks.push(callback);
        } else {
            liveId = { refs, selector, callbacks: [callback] };
            this.liveIds[refs] = liveId;
        }
    }

    /**
     * Connects the internal element and the external reference. It takes an options object with the following keys:
     * @param {String} attribute The name of the aria attribute. Two supported options: `aria-labelledby`, `aria-describedby`, `aria-activedescendant` and `aria-controls`.
     * @param {String} targetSelector The selector to the internal element where the aria attribute should be attached.
     * @param {HTMLElement} targetNode The element where the aria attribute should be attached. If not provided, the `targetSelector` is used.
     * @param {String|Array[String]} relatedNodeIds ID(s) of the external element(s) to which the `targetNode` will be related. Passed as a space separated string `id1 id2 id3`. Combined with `relatedNodes` if both are present.
     * @param {Array[HTMLElement]} relatedNodes an Array of HTMLElement element(s) to which the `targetNode` will be related. Combined with `relatedNodeIds` if both are present.
     */
    connect({
        attribute,
        targetSelector,
        targetNode,
        relatedNodeIds,
        relatedNodes,
    }) {
        this.state[attribute] = this.state[attribute] || {};
        const attrState = this.state[attribute];

        attrState.targetNode = targetNode;
        attrState.targetSelector = targetSelector;
        attrState.relatedNodes = (
            !Array.isArray(relatedNodes) ? [relatedNodes] : relatedNodes
        ).filter(Boolean);

        attrState.relatedNodeIds = Array.isArray(relatedNodeIds)
            ? relatedNodeIds.join(' ')
            : relatedNodeIds;

        if (this.component.isConnected) {
            this.privateUpdate(attribute);
        }
    }

    /**
     * Connects the MutationObserver when in native shadow mode and connects the
     * appropriate aria attributes to the correct elements
     * @param {Boolean} isNativeShadow - This flag is used when a subcomponent
     * (like lightning-primitive-input-simple) is in native shadow mode and the parent
     * (lightning-input) that was passed on AriaObserver instantiation is not.
     */
    sync(isNativeShadow) {
        if (isNativeShadow != null) {
            this.isNativeShadow = isNativeShadow;
        }

        if (!this.component.isConnected) {
            throw new Error(
                `Invalid sync invocation. It can only be invoked during renderedCallback().`
            );
        }

        if (!this.root) {
            this.root =
                this.template && this.template.host
                    ? this.template.host.getRootNode()
                    : null;
        }

        this.privateUpdateLiveIds();

        for (const attrName in this.state) {
            if (Object.prototype.hasOwnProperty.call(this.state, attrName)) {
                this.privateUpdate(attrName);
            }
        }
    }

    get privateIsMoRequired() {
        return this.isNativeShadow || Object.keys(this.liveIds).length !== 0;
    }

    get root() {
        return this._root;
    }

    /**
     * Sets the specified root element and observes it. The root element should contain
     * Observes the root element. The root element should contain
     * the related node elements. By default, this is the template host's root node, but can be
     * overridden where required.
     */
    set root(root) {
        this._root = root;
        if (this._root && this.privateIsMoRequired) {
            this.privateCreateMutationObserver();
        }
    }

    privateUpdate(attrName) {
        const {
            targetSelector,
            targetNode = this.template.querySelector(targetSelector),
            relatedNodeIds,
            relatedNodes,
        } = this.state[attrName];
        if (!targetNode) {
            return; // nothing to update
        }

        const attribute = SUPPORTED_ATTRIBUTES_MAP.get(attrName);
        if (!attribute) {
            throw new Error(
                `${attrName} is not supported by AriaObserver. Supported attributes: ${Array.from(
                    SUPPORTED_ATTRIBUTES_MAP.keys()
                )}`
            );
        }

        if (this.isNativeShadow) {
            const allRelatedNodes = [
                ...relatedNodes,
                ...extractElements(this.root, relatedNodeIds),
            ];
            if (BROWSER_SUPPORTS_ARIA_ELEMENT_REFLECTION) {
                // This browser supports native ARIA element reflection
                // Use Aria Reflection to manage relationships
                targetNode[attribute.ariaReflection] = relatedNodes;
            } else {
                attribute.polyfill(targetNode, allRelatedNodes, attrName);
            }
            // check related nodes for nested references and ensure
            // the div with reflected nodes is updated accordingly
            const rootNode = targetNode.getRootNode();
            for (let i = 0; i < allRelatedNodes.length; i++) {
                this.privateAddNestedReferences(rootNode, allRelatedNodes[i]);
            }
        } else {
            const attributeValue = [
                ...splitIds(relatedNodeIds),
                ...relatedNodes.map((n) => n.id),
            ].join(' ');

            if (attributeValue) {
                targetNode.setAttribute(attrName, attributeValue);
            } else {
                targetNode.removeAttribute(attrName);
            }
        }
    }

    privateExtractCorrectElements(selector = '', elements) {
        // Example: 'foo' + '-1'
        const selectors = selector.split(/\s/g);
        const matchSelectors = `(${selectors.join('|')})`;
        const regex = new RegExp(`^${matchSelectors}(-[0-9]+)$`);
        return [...elements].filter((element) => {
            return regex.test(element.id);
        });
    }

    /**
     * Observes the root element. The root element should contain
     * the related node elements. By default, this is the template host's root node, but can be
     * overridden where required.
     */
    privateCreateMutationObserver() {
        this.disconnect();
        this.mo = new MutationObserver(() => {
            if (!this.component.isConnected) {
                return; // do nothing when the template is not connected
            }
            this.sync();
        });
        this.mo.observe(this.root, {
            characterData: true,
            childList: true,
            subtree: true,
        });
    }

    privateExtractIds(elements) {
        return elements
            .map((el) => {
                return el.getAttribute('id');
            })
            .join(' ');
    }

    privateUpdateLiveIds() {
        const root =
            this.template && this.template.host
                ? this.template.host.getRootNode()
                : null;

        // if not connected do nothing
        if (!root) {
            return;
        }
        for (const liveId in this.liveIds) {
            if (Object.prototype.hasOwnProperty.call(this.liveIds, liveId)) {
                const thisId = this.liveIds[liveId];
                if (!thisId.elements || !thisId.elements.length) {
                    const splitRefIds = splitIds(liveId);
                    try {
                        // element refs are cached
                        const refElements = [
                            ...root.querySelectorAll(thisId.selector),
                        ];

                        thisId.elements = refElements.sort((a, b) => {
                            const idA = a
                                .getAttribute('id')
                                ?.replace(/-[0-9]+$/g, '');
                            const idB = b
                                .getAttribute('id')
                                ?.replace(/-[0-9]+$/g, '');

                            return (
                                splitRefIds.indexOf(idA) -
                                splitRefIds.indexOf(idB)
                            );
                        });
                    } catch (error) {
                        if (error instanceof DOMException) {
                            console.warn(
                                `lightning/ariaObserver could not find elements to connect live IDs due to an invalid id selector.\n\n${error}`
                            );
                        }
                        return;
                    }
                }
                const newThisId = this.privateExtractCorrectElements(
                    thisId.refs,
                    thisId.elements
                );
                const newIds = this.privateExtractIds(newThisId);

                // only fire callback if the value changed and the root node has been rendered
                if (newIds.length && newIds !== thisId.ids) {
                    // thisId.callback(newIds);
                    for (let i = 0; i < thisId.callbacks.length; i++) {
                        thisId.callbacks[i](newIds);
                    }
                    thisId.ids = newIds;
                }
            }
        }
    }

    /**
     * Check nodes being reflected to see if there are any nested references
     * then finds the mirrored node and reflects it accordingly.
     * Maintains a map of nodes to their mirrors, and root nodes to the div
     * containing all reflected elements for increased efficiency.
     * @param {Node} rootNode - the root node where the mirrored nodes are attached
     * @param {Node} relatedNode - the node to check for nested references
     */
    privateAddNestedReferences(rootNode, relatedNode) {
        for (let i = 0; i < SUPPORTED_ATTRIBUTES_ARRAY.length; i++) {
            const [attrName, { polyfill }] = SUPPORTED_ATTRIBUTES_ARRAY[i];
            const attrValue = relatedNode.getAttribute(attrName);
            // if attrValue is truthy, another attribute needs reflecting
            if (attrValue) {
                // if we don't know the corresponding mirrored node, find it
                let mirroredNode = this.nodeMap.get(relatedNode);
                if (!mirroredNode) {
                    let ariaReflection = this.ariaReflectionMap.get(rootNode);
                    if (!ariaReflection) {
                        ariaReflection = rootNode.querySelector(
                            '.aria-element-reflection-mirror'
                        );
                        this.ariaReflectionMap.set(rootNode, ariaReflection);
                    }
                    if (ariaReflection) {
                        mirroredNode = ariaReflection.querySelector(
                            `[${attrName}='${attrValue}']`
                        );
                        this.nodeMap.set(relatedNode, mirroredNode);
                    }
                }
                if (mirroredNode) {
                    const nestedReferenceNodes = extractElements(
                        this.root,
                        attrValue
                    );
                    polyfill(mirroredNode, nestedReferenceNodes, attrName);
                }
            }
        }
    }

    disconnect() {
        // MutationObservers must be disconnected manually when using @lwc/synthetic-shadow
        // https://lwc.dev/guide/composition#:~:text=memory%20leak
        if (this.mo) {
            this.mo.disconnect();
            this.mo = undefined;
        }
    }
}
