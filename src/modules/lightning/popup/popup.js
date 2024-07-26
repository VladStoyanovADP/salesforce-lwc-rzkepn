import { api, track } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { AutoPosition } from 'lightning/positionLibrary';
import {
    createAlignmentConfiguration,
    DEFAULT_POPUP_ALIGNMENT,
} from './alignment';
import { getElementWithFocus } from 'lightning/focusUtils';
import { isUndefinedOrNull, normalizeBoolean } from 'lightning/utilsPrivate';

export default class LightningPopup extends LightningShadowBaseClass {
    @track _visible;
    @track _queueShow;
    @track _ariaLabelledBy;
    @track _ariaDescribedBy;
    @track _ariaLabel;

    _referenceElement;
    _alignmentOptions;
    _alignment;
    _hasFocus;

    renderedCallback() {
        if (this._queueShow) {
            this._queueShow = false;

            if (this._referenceElement) {
                this._startPositioning();
            }

            // Canceling the autofocus event prevents the popup from focusing the first tabbable element
            const autoFocus = this._patchedDispatchEvent(
                new CustomEvent('autofocus', { cancelable: true })
            );

            if (autoFocus) {
                this.focus();
            }
        }
    }

    disconnectedCallback() {
        this._close();
    }

    /**
     * A space-separated list of element IDs that provide labels for the popup.
     * @type {string}
     */
    @api
    get ariaLabelledBy() {
        // LWC emits a warning if the aria is undefined
        return this._ariaLabelledBy || null;
    }

    set ariaLabelledBy(value) {
        this._ariaLabelledBy = value;
    }

    /**
     * A space-separated list of element IDs that provide descriptive labels for the popup.
     * @type {string}
     */
    @api
    get ariaDescribedBy() {
        // LWC emits a warning if the aria is undefined
        return this._ariaDescribedBy || null;
    }

    set ariaDescribedBy(value) {
        this._ariaDescribedBy = value;
    }

    /**
     * Label describing the popup to assistive technologies.
     *
     * @type {string}
     */
    @api
    get ariaLabel() {
        return this._ariaLabel;
    }

    set ariaLabel(value) {
        this._ariaLabel = value;
    }

    /**
     * Represents the alignment of the popup relative to the reference element. The property
     * values are expressed the same as for the show() method's properties for alignmentOptions.
     * This property is updated before the alignmentupdate event is dispatched.
     * The default value is { vertical: 'bottom', horizontal: 'left' }.
     */
    @api
    get alignment() {
        if (!this._referenceElement) {
            return undefined;
        }

        return this._alignment ? this._alignment : DEFAULT_POPUP_ALIGNMENT;
    }

    /**
     * Shows the popup.
     * @param {Object} referenceElement - An optional element to use as the anchor point for locating the popup.
     * @param {Map} alignmentOptions - An optional list of properties and key-value pairs used to set the preferred alignment between the referenceElement and the popup.
     */
    @api
    show(referenceElement, alignmentOptions) {
        if (this._visible) {
            // already visible
            return;
        }

        this._referenceElement = referenceElement;
        this._alignmentOptions = alignmentOptions || {};

        this._alignmentOptions.autoFlip = isUndefinedOrNull(
            this._alignmentOptions.autoFlip
        )
            ? true
            : normalizeBoolean(this._alignmentOptions.autoFlip);

        this._saveActiveElement();

        this._queueShow = true;
        this._visible = true;
    }

    /**
     * Closes the popup.
     */
    @api
    close() {
        this._close();
        if (this._hasFocus) {
            this._returnFocus();
        }
    }

    /**
     * Focuses on the first tab-focusable element inside the popup.
     */
    @api
    focus() {
        if (this._visible) {
            this.template.querySelector('[data-focus-trap]').focus();
            this._hasFocus = true;
        }
    }

    _saveActiveElement() {
        this._savedActiveElement = getElementWithFocus();
    }

    _startPositioning() {
        if (!this._autoPosition) {
            this._autoPosition = new AutoPosition(this);
        }

        const configuration = Object.assign(
            {
                target: () => this._referenceElement,
                element: () => this._getSectionElement(),
            },
            createAlignmentConfiguration(this._alignmentOptions)
        );

        this._autoPosition.start(configuration).then((autoPositionUpdater) => {
            // The calculation above may have flipped the alignment of the popup.
            if (autoPositionUpdater && this._visible) {
                const newAlignment = autoPositionUpdater.config.align;
                this._alignment = {
                    horizontal: newAlignment.horizontal,
                    vertical: newAlignment.vertical,
                };
                this.dispatchEvent(new CustomEvent('alignmentupdate'));
            }
        });
    }

    _close() {
        this._alignment = undefined;
        this._stopPositioning();
        this._visible = false;
    }

    _stopPositioning() {
        if (this._autoPosition) {
            this._autoPosition.stop();
        }
    }

    _closeAndDispatchCloseEvent() {
        this._close();
        this.dispatchEvent(new CustomEvent('close'));
    }

    _returnFocus() {
        const returnFocus = this._patchedDispatchEvent(
            new CustomEvent('returnfocus', { cancelable: true })
        );
        if (returnFocus && this._savedActiveElement) {
            this._savedActiveElement.focus();
        }
    }

    _handleFocusIn() {
        this._hasFocus = true;
    }

    _handleFocusOut() {
        this._hasFocus = false;

        // eslint-disable-next-line @lwc/lwc/no-async-operation
        requestAnimationFrame(() => {
            if (!this._hasFocus) {
                const closeOnClickOut = this._patchedDispatchEvent(
                    new CustomEvent('clickout', { cancelable: true })
                );
                if (closeOnClickOut) {
                    this._closeAndDispatchCloseEvent();
                }
            }
        });
    }

    _handlePopoverKeydown(event) {
        const hasModifier = event.ctrlKey || event.metaKey || event.shiftKey;
        // The 'Esc' check is for IE11, remove once support is dropped
        if (
            !hasModifier &&
            event.key &&
            (event.key === 'Escape' || event.key === 'Esc')
        ) {
            this._returnFocus();
            this._closeAndDispatchCloseEvent();
        }
    }

    _getSectionElement() {
        return this.template.querySelector('section');
    }

    // remove this when the following lwc issue is fixed: https://github.com/salesforce/lwc/issues/1848
    _patchedDispatchEvent(event) {
        this.dispatchEvent(event);
        return !event.defaultPrevented;
    }
}
