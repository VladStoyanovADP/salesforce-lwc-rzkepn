import labelCollapseBranch from '@salesforce/label/LightningTree.collapseBranch';
import labelExpandBranch from '@salesforce/label/LightningTree.expandBranch';
import { LightningElement, api, track } from 'lwc';
import { classSet } from 'lightning/utils';
import { keyCodes } from 'lightning/utilsPrivate';

const i18n = {
    collapseBranch: labelCollapseBranch,
    expandBranch: labelExpandBranch,
};

export default class LightningTreeItem extends LightningElement {
    @track _children = [];
    @track _tabindexes = {};
    @track _selected = {};

    _focusedChild = null;

    @api isRoot = false;
    @api label;
    @api href;
    @api metatext;
    @api nodeRef;
    @api isExpanded;
    @api isDisabled = false;
    @api nodename;
    @api nodeKey;
    @api isLeaf;
    @api selected;

    @api
    get childItems() {
        return this._children;
    }

    set childItems(value) {
        this._children = value;
        const childLen = this._children.length;
        for (let i = 0; i < childLen; i++) {
            this.setSelectedAttribute(i, 'false');
        }
    }

    @api
    get focusedChild() {
        return this._focusedChild;
    }

    set focusedChild(value) {
        this._focusedChild = value;
    }

    setSelectedAttribute(childNum, value) {
        this._selected[childNum] = value;
    }

    connectedCallback() {
        this.dispatchEvent(
            new CustomEvent('privateregisteritem', {
                composed: true,
                bubbles: true,
                detail: {
                    focusCallback: this.makeChildFocusable.bind(this),
                    unfocusCallback: this.makeChildUnfocusable.bind(this),
                    key: this.nodeKey,
                },
            })
        );

        this.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    renderedCallback() {
        if (typeof this.focusedChild === 'number') {
            const child = this.getNthChildItem(this.focusedChild + 1);
            if (child) {
                child.tabIndex = '0';
            }
        }
    }

    get buttonLabel() {
        if (this.nodeRef && this.nodeRef.expanded) {
            return i18n.collapseBranch;
        }
        return i18n.expandBranch;
    }

    get showExpanded() {
        if (!this.nodeRef) {
            return false;
        }
        return !this.isDisabled && this.nodeRef.expanded;
    }

    get computedButtonClass() {
        return classSet('slds-button slds-button_icon slds-m-right_x-small ')
            .add({
                'slds-hidden': this.isLeaf || this.isDisabled,
            })
            .toString();
    }

    get computedIconName() {
        return document.dir === 'rtl'
            ? 'utility:chevronleft'
            : 'utility:chevronright';
    }

    get children() {
        return this._children.map((child, idx) => {
            return {
                node: child,
                tabindex: this._tabindexes[idx],
                selected: this._selected[idx],
            };
        });
    }

    preventDefaultAndStopPropagation(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    handleClick(event) {
        if (!this.isDisabled) {
            // eslint-disable-next-line no-script-url
            if (this.href === 'javascript:void(0)') {
                event.preventDefault();
            }
            let target = 'anchor';
            if (
                event.target.tagName === 'BUTTON' ||
                event.target.tagName === 'LIGHTNING-PRIMITIVE-ICON'
            ) {
                target = 'chevron';
            }
            const customEvent = new CustomEvent('privateitemclick', {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: {
                    name: this.nodename,
                    key: this.nodeKey,
                    target,
                },
            });
            this.dispatchEvent(customEvent);
        }
    }

    handleKeydown(event) {
        switch (event.keyCode) {
            case keyCodes.space:
            case keyCodes.enter:
                this.preventDefaultAndStopPropagation(event);
                this.template.querySelector('.slds-tree__item a').click();
                break;
            case keyCodes.up:
            case keyCodes.down:
            case keyCodes.right:
            case keyCodes.left:
            case keyCodes.home:
            case keyCodes.end:
                this.preventDefaultAndStopPropagation(event);
                this.dispatchEvent(
                    new CustomEvent('privateitemkeydown', {
                        bubbles: true,
                        composed: true,
                        cancelable: true,
                        detail: {
                            key: this.nodeKey,
                            keyCode: event.keyCode,
                        },
                    })
                );
                break;

            default:
                break;
        }
    }

    fireCustomEvent(eventName, item) {
        const eventObject = {
            bubbles: true,
            composed: true,
            cancelable: false,
        };
        if (item !== undefined) {
            eventObject.detail = { key: item };
        }
        // eslint-disable-next-line lightning-global/no-custom-event-identifier-arguments
        this.dispatchEvent(new CustomEvent(eventName, eventObject));
    }

    handleFocus() {
        this.fireCustomEvent('privatechildfocused', this.nodeKey);
    }

    handleBlur() {
        this.fireCustomEvent('privatechildunfocused', this.nodeKey);
    }

    getChildNum(childKey) {
        const idx = childKey.lastIndexOf('.');
        const childNum =
            idx > -1
                ? parseInt(childKey.substring(idx + 1), 10)
                : parseInt(childKey, 10);
        return childNum - 1;
    }

    // Event handlers to handle attribute changes in IMMEDIATE CHILD, if immediate child change attribute
    // and stop event propagation
    /**
     * Callback so that the child it contains can be made focusable
     * @param {string} childKey - key of the item to receive focus
     * @param {boolean} shouldFocus - whether to focus the item immediately
     * @param {boolean} shouldSelect - whether visually focus the item immediately
     */
    makeChildFocusable(childKey, shouldFocus, shouldSelect) {
        const child = this.getImmediateChildItem(childKey);
        if (child) {
            if (child.tabIndex !== '0') {
                child.tabIndex = '0';
            }
            if (shouldFocus) {
                child.focus();
            }
            if (shouldSelect) {
                child.ariaSelected = true;
            }
        }
    }

    /**
     * Callback to remove the tabindex attribute and make ariaSelected false
     */
    makeChildUnfocusable() {
        this.ariaSelected = 'false';
        this.removeAttribute('tabindex');
    }

    getImmediateChildItem(key) {
        return this.template.querySelector(
            "lightning-tree-item[data-key='" + key + "']"
        );
    }

    getNthChildItem(n) {
        return this.template.querySelector(
            'lightning-tree-item:nth-of-type(' + n + ')'
        );
    }
}
