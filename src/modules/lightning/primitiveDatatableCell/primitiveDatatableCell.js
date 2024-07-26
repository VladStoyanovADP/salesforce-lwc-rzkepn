import { LightningElement, api } from 'lwc';
import { keyCodes, isRTL } from 'lightning/utilsPrivate';

export default class PrimitiveDatatableCell extends LightningElement {
    @api rowKeyValue;
    @api colKeyValue;

    _hasFocus = 0;

    _mode = 'NAVIGATION';
    _currentInputIndex = 0;
    _internalTabIndex = -1;
    _actionableElementsCount;

    @api
    get hasFocus() {
        return this._hasFocus;
    }

    get keyboardMode() {
        return this._mode;
    }

    set hasFocus(value) {
        this._hasFocus = value;

        if (value) {
            this.classList.add('slds-has-focus');
        } else {
            this.classList.remove('slds-has-focus');
        }
    }

    @api
    setMode(keyboardMode, info) {
        const normalizedInfo = info || { action: 'none' };
        this._mode = keyboardMode;
        if (keyboardMode === 'ACTION') {
            this._internalTabIndex = 0;
            // focus without changing tabindex doesnt work W-6185168
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            setTimeout(() => {
                this.setFocusToActionableElement(this._currentInputIndex);
            }, 0);

            const actionableElements = this.getActionableElements();

            // check if we have an edit button first (tab should open the inline edit)
            if (normalizedInfo.action === 'tab') {
                let editActionElement = false;
                actionableElements.some((elem) => {
                    if (elem.getAttribute('data-action-edit')) {
                        editActionElement = elem;
                        return true;
                    }

                    return false;
                });

                if (editActionElement) {
                    editActionElement.click();
                }
            } else if (actionableElements.length === 1) {
                const elem = actionableElements[0];
                let defaultActions = elem.getAttribute('data-action-triggers');
                defaultActions = defaultActions || '';

                if (defaultActions.indexOf(normalizedInfo.action) !== -1) {
                    actionableElements[this._currentInputIndex].click();
                }
            }
        } else {
            this._internalTabIndex = -1;
        }
    }

    @api
    addFocusStyles() {
        this.classList.add('slds-has-focus');
    }

    @api
    removeFocusStyles(setTabIndex) {
        this.classList.remove('slds-has-focus');
        if (setTabIndex) {
            this._internalTabIndex = -1;
        }
    }

    /**
     * method to resetCurrentInputIndex when navigating from cell-to-cell
     * called in navigation or action mode
     * @param {number} direction -1, 1, 2
     * @param {string} incomingMode is the new mode, needed because a cell can be in action mode but new mode being
     * set can be navigation mode
     */
    @api
    resetCurrentInputIndex(direction, incomingMode) {
        switch (direction) {
            case -1: {
                const inputs = this.getActionableElements();
                this._currentInputIndex = inputs.length ? inputs.length - 1 : 0;
                break;
            }
            case 1:
            case 2:
                this._currentInputIndex = 0;
                break;
            default:
        }

        // when esc is pressed on a cell to enter navigation mode, other cells are still
        // in action mode till we call setMode above. So need to check new incoming mode too if action mode
        // otherwise we try to focus on an inner element with delegatesFocus and tabindex -1 and
        // it moves focus out of table
        if (this._mode === 'ACTION' && incomingMode === 'ACTION') {
            this.setFocusToActionableElement(this._currentInputIndex);
        }
    }

    connectedCallback() {
        this.addEventListener('focus', this.handleFocus.bind(this));
        this.addEventListener('click', this.handleClick.bind(this));
        this.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    get internalTabIndex() {
        return this._internalTabIndex;
    }

    get canMoveBackward() {
        return this._currentInputIndex > 0;
    }

    get canMoveForward() {
        return (
            this._actionableElementsCount > 1 &&
            this._currentInputIndex < this._actionableElementsCount - 1
        );
    }

    get canMoveLeft() {
        return isRTL() ? this.canMoveForward : this.canMoveBackward;
    }

    get canMoveRight() {
        return isRTL() ? this.canMoveBackward : this.canMoveForward;
    }

    moveToNextActionableElement() {
        this.setFocusToActionableElement(this._currentInputIndex + 1);
    }

    moveToPrevActionableElement() {
        this.setFocusToActionableElement(this._currentInputIndex - 1);
    }

    // eslint-disable-next-line no-unused-vars
    handleClick(event) {
        this.addFocusStyles();
        this.fireCellFocusByClickEvent();
    }

    handleKeydown(event) {
        const { keyCode, shiftKey } = event;
        let passThroughEvent = keyCode !== keyCodes.shift;

        // if it is in Action mode, then traverse to the next or previous
        // focusable element.
        // if there is no focusable element, or reach outside of the range, then move to
        // previous or next cell.
        if (this._mode === 'ACTION') {
            switch (keyCode) {
                case keyCodes.left:
                    if (this.canMoveLeft) {
                        // there are still actionable element before the current one
                        // move to the previous actionable element.
                        event.preventDefault();

                        if (isRTL()) {
                            this.moveToNextActionableElement();
                        } else {
                            this.moveToPrevActionableElement();
                        }
                        passThroughEvent = false;
                    }
                    break;
                case keyCodes.right:
                    if (this.canMoveRight) {
                        // there are still actionable element before the current one
                        // move to the previous actionable element.
                        event.preventDefault();

                        if (isRTL()) {
                            this.moveToPrevActionableElement();
                        } else {
                            this.moveToNextActionableElement();
                        }

                        passThroughEvent = false;
                    }
                    break;
                case keyCodes.tab:
                    // if in action mode, try to navigate through the element inside
                    // always prevent the default tab behavior
                    // so that the tab will not focus outside of the table.
                    if (shiftKey) {
                        // moving backward
                        if (this.canMoveBackward) {
                            event.preventDefault();
                            this.moveToPrevActionableElement();
                            passThroughEvent = false;
                        }
                    } else {
                        // moving forward
                        // eslint-disable-next-line no-lonely-if
                        if (this.canMoveForward) {
                            event.preventDefault();
                            this.moveToNextActionableElement();
                            passThroughEvent = false;
                        }
                    }
                    break;
                default:
            }
        } else if (this._mode === 'NAVIGATION') {
            // click the header, press enter, it does not go to action mode without this code.
            if (
                keyCode === keyCodes.left ||
                keyCode === keyCodes.right ||
                keyCode === keyCodes.up ||
                keyCode === keyCodes.down ||
                keyCode === keyCodes.enter
            ) {
                this.fireCellKeydown(event);
            }
        }

        if (passThroughEvent && this._mode === 'ACTION') {
            this.fireCellKeydown(event);
        }
    }

    getActionableElements() {
        return Array.prototype.slice.call(
            this.template.querySelectorAll('[data-navigation="enable"]')
        );
    }

    get resizeElement() {
        return this.template.querySelector('.slds-resizable');
    }

    setFocusToActionableElement(activeInputIndex) {
        const actionableElements = this.getActionableElements();
        this._actionableElementsCount = actionableElements.length;
        if (actionableElements.length > 0) {
            if (
                activeInputIndex > 0 &&
                activeInputIndex < actionableElements.length
            ) {
                // try to locate to the previous active index of previous row.
                actionableElements[activeInputIndex].focus();
                this._currentInputIndex = activeInputIndex;
            } else {
                actionableElements[0].focus();
                this._currentInputIndex = 0;
            }
        }
        // TODO: Fire event back to the datatable, so that the activeInputIndex can be
        // stored in the datatable level state.  So that when user use up and down arrow to
        // navigate throught the datatable in ACTION mode, we can rememeber the active input position
    }

    handleFocus() {
        if (this._mode === 'ACTION') {
            this.setFocusToActionableElement(this._currentInputIndex);
        }
    }

    fireCellKeydown(keyEvent) {
        const { rowKeyValue, colKeyValue } = this;
        const { keyCode, shiftKey } = keyEvent;

        const event = new CustomEvent('privatecellkeydown', {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                rowKeyValue,
                colKeyValue,
                keyCode,
                shiftKey,
                keyEvent,
            },
        });

        this.dispatchEvent(event);
    }

    fireCellFocusByClickEvent() {
        const { rowKeyValue, colKeyValue } = this;
        const event = new CustomEvent('privatecellfocusedbyclick', {
            bubbles: true,
            composed: true,
            detail: {
                rowKeyValue,
                colKeyValue,
            },
        });

        this.dispatchEvent(event);
    }
}
