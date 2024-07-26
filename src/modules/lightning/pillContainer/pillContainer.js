import labelContainerLabel from '@salesforce/label/LightningPillContainer.label';
import pillContainerMoreLabel from '@salesforce/label/LightningPillContainer.more';
import { api } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import LightningPillItem from './pillItem';
import {
    keyCodes,
    normalizeBoolean,
    normalizeString,
    reflectAttribute,
} from 'lightning/utilsPrivate';
import { LightningResizeObserver } from 'lightning/resizeObserver';
import barePillContainer from './barePillContainer.html';
import standardPillContainer from './standardPillContainer.html';
import { relatedTarget as pillRelatedTarget } from 'lightning/pill';

const PILL_SELECTOR = 'lightning-pill';
const BARE = 'bare';
const STANDARD = 'standard';

const i18n = {
    containerLabel: labelContainerLabel,
};

/**
 * A list of pills grouped in a container. This component requires API version 42.0 and later.
 */
export default class LightningPillContainer extends LightningShadowBaseClass {
    /**
     * Aria label for the pill container to describe the list of options.
     * @type {string}
     */
    @api label = i18n.containerLabel;

    _variant;
    _singleLine = false;
    _isExpanded = false;
    _isCollapsible = false;
    _focusedIndex = 0;
    _focusedTabIndex = 0;
    _pillsNotFittingCount;
    _pillContainerElementId;

    connectedCallback() {
        super.connectedCallback();
        this._connected = true;
    }

    disconnectedCallback() {
        this._connected = false;
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
        }
    }

    render() {
        if (this.variant === BARE) {
            return barePillContainer;
        }
        return standardPillContainer;
    }

    renderedCallback() {
        if (this._resizeObserver) {
            // If we have a resize observer and the pill container is not collapsible it means it was changed
            // to not collapsible, we should disconnect the resize observer.
            if (!this.computedValueOfIsCollapsible) {
                this._resizeObserver.disconnect();
                this._resizeObserver = undefined;
            }
        } else if (this.computedValueOfIsCollapsible) {
            // No resize observer and is collapsible, we should setup the resize observer
            this._resizeObserver = this._setupResizeObserver();
        }

        const groupElm = this.template.querySelector(
            '.slds-listbox_selection-group'
        );
        if (groupElm) {
            groupElm.classList.toggle(
                'slds-is-expanded',
                this.computedValueOfIsExpanded
            );
        }
        const ul = this.template.querySelector('ul');
        if (ul) {
            if (this.pills.length === 0) {
                // If no option is present, set ul has the focus (SLDS require UL has focus).
                ul.tabIndex = 0;
            } else {
                ul.tabIndex = -1;
                this.setFocusedItemTabIndex(0);
                // Consider adding pills programmatically to empty pill container.
                // UL has focus, so should shift focus to pill.
                if (this.template.querySelector('ul:focus')) {
                    this.focus();
                }
            }
        }
    }

    get computedValueOfIsExpanded() {
        let expanded = this._isExpanded;
        if (!this._isCollapsible && !this._isExpanded) {
            expanded = true;
        }
        return expanded;
    }

    get computedValueOfIsCollapsible() {
        let collapsible = this._isCollapsible;
        if (this._isCollapsible && this._isExpanded) {
            collapsible = false;
        }
        return collapsible;
    }

    /**
     * The variant changes the tab navigation behavior of the pill container. Accepted variants
     * include standard and bare. This value defaults to standard which supports accessibility.
     * @type {string}
     * @default standard
     */
    @api
    get variant() {
        return this._variant || STANDARD;
    }

    set variant(value) {
        this._variant = normalizeString(value, {
            fallbackValue: STANDARD,
            validValues: [STANDARD, BARE],
        });
        reflectAttribute(this, 'variant', this._variant);
    }

    /**
     * Specifies whether to limit pill display to one line. This attribute overrides
     * the is-collapsible and is-expanded attributes.
     * @type {boolean}
     *
     */
    @api
    get singleLine() {
        return this._singleLine;
    }

    set singleLine(value) {
        this._singleLine = normalizeBoolean(value);
        reflectAttribute(this, 'single-line', this._singleLine);
    }

    /**
     * Specifies whether the pill list can be collapsed. Use is-collapsible with the is-expanded attribute
     * to expand and collapse the list of pills.
     * @type {boolean}
     * @default false
     */
    @api
    get isCollapsible() {
        return this._isCollapsible;
    }

    set isCollapsible(value) {
        this._isCollapsible = normalizeBoolean(value);
    }

    /**
     * Specifies whether the list of pills is expanded or collapsed, when is-collapsible is true.
     * This attribute is ignored when is-collapsible is false, and the list of pills is expanded even if
     * is-expanded is false or not set.
     * @type {boolean}
     * @default false
     */
    @api
    get isExpanded() {
        return this._isExpanded;
    }

    set isExpanded(value) {
        this._isExpanded = normalizeBoolean(value);
    }

    /**
     * An array of pill attribute values that define pills to display in the container.
     * @type {list}
     */
    @api items;

    get pills() {
        return Array.isArray(this.items) ? this.items : [];
    }

    get pillViewModels() {
        return this.pills.map((item, index) => {
            const pill = new LightningPillItem(item);
            return {
                pill,
                tabIndex:
                    this._focusedIndex === index ? this._focusedTabIndex : -1,
            };
        });
    }

    get computedWrapperClass() {
        return this.singleLine
            ? 'slds-pill_container'
            : 'slds-listbox_selection-group';
    }

    // W-14952967: Temporarily adding slds-truncate so pills truncate on small form factors.
    get computedListboxClass() {
        const singleLineClass = this.singleLine ? ' slds-listbox_inline' : '';
        return `slds-listbox slds-is-relative slds-listbox_horizontal slds-truncate${singleLineClass}`;
    }

    get focusedIndex() {
        // NOTE: this._pills is manged by getter, setter. So it won't be null or undefined.
        // So call this._pill.length is safe.
        if (this._focusedIndex >= this.pills.length) {
            // Change is due to itemremove event, should move focus to the last one.
            this._focusedIndex = this._deleteLast ? this.pills.length - 1 : 0;
            this._deleteLast = false;
        } else if (this._focusedIndex < 0) {
            this._focusedIndex = this.pills.length - 1;
        }
        return this._focusedIndex;
    }

    set focusedIndex(value) {
        // Host may asynchronous update items. For example, move focus to latest item with right/left key, then host change items.
        // Then at renderedCallback call, need to update which item should has focus, but index > items.length.
        // When set it, the index is valid, but when rendered, index is not valid, so the validation check is happened at getter.
        this._focusedIndex = value;
    }

    get pillNodes() {
        return this.template.querySelectorAll(PILL_SELECTOR) || [];
    }

    get focusedNode() {
        const pills = this.pillNodes;
        return pills.length <= 0 ? null : pills[this.focusedIndex];
    }

    /**
     * Sets focus on the pill list.
     */
    @api
    focus() {
        const focusedNode = this.focusedNode;
        if (focusedNode) {
            if (focusedNode.isPlainLink) {
                focusedNode.focusLink();
            } else {
                focusedNode.focusRemove();
            }
        } else {
            const ul = this.template.querySelector('ul');
            if (ul) {
                ul.focus();
            }
        }
    }

    handleRemove(removeEvent) {
        const index = parseInt(removeEvent.detail.name, 10);
        if (typeof index !== 'number' || index < 0) {
            return;
        }

        this.fireEvent(index);
    }

    fireEvent(index) {
        // Mouse click on non-focused pill, switch focus to it.
        this.switchFocus(index);
        // Request to remove the last one, if removed, should move focus to last.
        this._deleteLast = index >= this.pills.length - 1;

        this.dispatchEvent(
            new CustomEvent('itemremove', {
                detail: {
                    item: this.pills[index],
                    index,
                },
            })
        );
    }

    setFocusedItemTabIndex(value) {
        const focusedNode = this.focusedNode;
        if (focusedNode) {
            this._focusedTabIndex = value;
        }
    }

    switchFocusedIndex(newValue) {
        // remove focus from current pill
        this.setFocusedItemTabIndex(-1);
        // move to next
        this.focusedIndex = newValue;
        // set focus
        this.setFocusedItemTabIndex(0);
    }

    switchFocus(newValue) {
        this.switchFocusedIndex(newValue);
        this.focus();
    }

    handleKeyDown(event) {
        if (this.pills.length <= 0) {
            return;
        }
        const index = this.focusedIndex;
        switch (event.keyCode) {
            case keyCodes.left:
            case keyCodes.up:
                this.switchFocus(index - 1);
                event.preventDefault(); // page keeps moving if there is a scrollbar
                break;
            case keyCodes.right:
            case keyCodes.down:
                this.switchFocus(index + 1);
                event.preventDefault();
                break;
            default:
        }
    }

    handlePillFocus(event) {
        if (!this._hasFocus) {
            this._hasFocus = true;
            this.dispatchEvent(new CustomEvent('focus'));
        }
        const currentTargetIndex = parseInt(event.currentTarget?.name, 10);
        this.focusedIndex = Number.isNaN(currentTargetIndex)
            ? -1
            : currentTargetIndex;
    }

    handlePillBlur(event) {
        // Replace the below with !this.template.contains(event.relatedTarget) once 0.24 is out
        // the "blur" event can also come from the anchor element inside the <lightning-pill> as a CustomEvent,
        // so hence we need use "event.detail.relatedTarget".
        // "relatedTarget" is the element that will receive focus next.
        const relatedTarget =
            event.relatedTarget || event.detail[pillRelatedTarget];
        if (!relatedTarget || !this.template.contains(relatedTarget)) {
            this._hasFocus = false;
            this.dispatchEvent(new CustomEvent('blur'));
        }
    }

    handleClick() {
        this.focus();
    }

    handlePillClick(clickEvent) {
        const index = parseInt(clickEvent.currentTarget.name, 10);

        if (index >= 0 && this.focusedIndex !== index) {
            this.switchFocus(index);
        } else {
            this.focus();
        }

        clickEvent.stopPropagation();
    }

    handleMoreClick() {
        this.focus();
    }

    get _showMore() {
        return (
            this.computedValueOfIsCollapsible && !this.computedValueOfIsExpanded
        );
    }

    get computedPillCountMoreLabel() {
        if (
            this.computedValueOfIsExpanded ||
            isNaN(this._pillsNotFittingCount) ||
            this._pillsNotFittingCount <= 0
        ) {
            return undefined;
        }
        // TODO: We should have a standard utility for that
        return pillContainerMoreLabel.replace(
            '{0}',
            this._pillsNotFittingCount
        );
    }

    _setupResizeObserver() {
        const pillContainer = this.template.querySelector('ul');
        if (!pillContainer) return null;
        const resizeObserver = new LightningResizeObserver(() => {
            let notFittingCount = 0;
            let pillNodes = this.template.querySelectorAll('li');
            let length = pillNodes.length;
            for (let i = 0; i < length; i++) {
                const node = pillNodes[i];
                if (node.offsetTop > 0) {
                    notFittingCount += 1;
                }
            }
            this._pillsNotFittingCount = notFittingCount;
        });
        resizeObserver.observe(pillContainer);
        return resizeObserver;
    }
}
