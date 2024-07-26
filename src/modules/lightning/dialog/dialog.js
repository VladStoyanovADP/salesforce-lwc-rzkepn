import { api, LightningElement, track } from 'lwc';
import labelClose from '@salesforce/label/LightningDialog.close';
import { classSet } from 'lightning/utils';
import { normalizeString } from 'lightning/utilsPrivate';
import {
    findAllTabbableElements,
    getElementWithFocus,
} from 'lightning/focusUtils';
import {
    makeEverythingExceptElementInert,
    restoreInertness,
} from 'lightning/utilsPrivate';

/**
 * A panel used to display content in a layer over the app.
 * */
export default class LightningDialog extends LightningElement {
    /**
     * Text to display in a heading at the top of the dialog.
     */
    @api header;

    @track _open = false;
    @track _size = 'medium';
    @track _hideFooter = false;

    _queueShow = false;
    _savedInertElements = [];
    _connected = false;
    _savedActiveElement;

    connectedCallback() {
        this._connected = true;
    }

    disconnectedCallback() {
        this._connected = false;
        // The assumption is that the element is not removed from the DOM when opened,
        // if that assumption doesn't stand we'd need to restore inertness.
    }

    renderedCallback() {
        // check if it's the next render after the dialog was queued to show
        if (this._queueShow) {
            this._savedInertElements = makeEverythingExceptElementInert(
                this.template.host
            );
            this._hideFooter = this._isFooterEmpty();

            this._focusFirstElement();
            this._queueShow = false;
        }
    }

    /**
     * The width of the dialog calculated as a percentage of the viewport. Valid values are small, medium, and large. The default is medium.
     * @type {string}
     * @default medium
     */
    @api
    get size() {
        return this._size;
    }

    set size(value) {
        this._size = normalizeString(value, {
            fallbackValue: 'medium',
            validValues: ['small', 'medium', 'large'],
        });
    }

    /**
     * Opens the modal dialog.
     */
    @api
    showModal() {
        this._throwErrorIfNotConnected();

        this._saveActiveElement();

        if (!this._open) {
            this._open = true;
        }

        // Set the flag so that DOM operations can be executed in the renderedCallback method
        this._queueShow = true;
    }

    /**
     * Closes the modal dialog.
     */
    @api
    close() {
        if (!this._open) {
            return;
        }

        this._open = false;

        restoreInertness(this._savedInertElements);

        this._returnFocus();

        const closeEvent = new CustomEvent('close');
        this.dispatchEvent(closeEvent);
    }

    get _labels() {
        return { close: labelClose };
    }

    /**
     * Gets the CSS classes applicable to the modal content element.
     *
     * @type {string}
     * @private
     */
    get _contentCssClasses() {
        // We add a small CSS class to tag the content element as having no adjacent footer when
        // there's no footer content.
        const classes = classSet('slds-modal__content');
        classes.add('slds-p-around_medium').add({
            'slds-modal__content_has-hidden-footer': this._hideFooter,
        });

        return classes.toString();
    }

    /**
     * Gets the CSS classes applicable to the modal footer element.
     *
     * @type {string}
     * @private
     */
    get _footerCssClasses() {
        const classes = classSet('slds-modal__footer');
        classes.add({
            'slds-hide': this._hideFooter,
        });

        return classes.toString();
    }

    /**
     * Gets the CSS classes applicable to the modal header element.
     *
     * @type {string}
     * @private
     */
    get _headerCssClasses() {
        const classes = classSet('slds-modal__header');
        classes.add({
            'slds-modal__header_empty': (this.header || '').length === 0,
        });

        return classes.toString();
    }

    get _modalCssClasses() {
        const classes = classSet('slds-modal slds-fade-in-open');
        classes.add({
            'slds-modal_large': this.size === 'large',
            'slds-modal_small': this.size === 'small',
        });

        return classes.toString();
    }

    _focusFirstElement() {
        const dialogContentElement = this.template.querySelector(
            '[data-content-container]'
        );

        const allTabbableElements =
            findAllTabbableElements(dialogContentElement);

        const closeButton = this.template.querySelector('[data-close-button]');

        // Canceling the autofocus event prevents the dialog from focusing the first tabbable element
        const autoFocus = this.dispatchEvent(
            new CustomEvent('autofocus', { cancelable: true })
        );

        if (allTabbableElements.length > 0) {
            if (autoFocus) {
                const firstElementToFocus = allTabbableElements[0];
                firstElementToFocus.focus();
            }
        } else {
            closeButton.focus();
        }
    }

    _saveActiveElement() {
        this._savedActiveElement = getElementWithFocus();
    }

    _returnFocus() {
        const returnFocus = this.dispatchEvent(
            new CustomEvent('returnfocus', { cancelable: true })
        );

        // Canceling the focus return event prevents the dialog from returning the focus
        if (!returnFocus) {
            return;
        }

        if (
            this._savedActiveElement &&
            document.body.contains(this._savedActiveElement)
        ) {
            this._savedActiveElement.focus();
        } else {
            // eslint-disable-next-line no-console
            console.warn('Nothing to return focus to');
        }
    }

    _handleCloseClick() {
        this._dispatchCancelEventAndClose();
    }

    _dispatchCancelEventAndClose() {
        const close = this.dispatchEvent(
            new CustomEvent('cancel', { cancelable: true })
        );
        if (close) {
            this.close();
        }
    }

    _handleFooterSlotChange() {
        this._hideFooter = this._isFooterEmpty();
    }

    _handleModalKeyDown(event) {
        const hasModifier = event.ctrlKey || event.metaKey || event.shiftKey;
        // 'Esc' is IE11 specific, remove when support is dropped
        if (!hasModifier && (event.key === 'Esc' || event.key === 'Escape')) {
            event.stopPropagation();
            event.preventDefault();

            this._dispatchCancelEventAndClose();
        }
    }

    _throwErrorIfNotConnected() {
        if (!this._connected) {
            throw new Error('dialog is not connected');
        }
    }

    _isFooterEmpty() {
        const slotElement = this.template.querySelector('[data-footer-slot]');
        if (slotElement && slotElement.assignedNodes) {
            return slotElement.assignedNodes().length === 0;
        }
        return true;
    }
}
