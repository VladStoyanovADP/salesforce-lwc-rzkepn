import { classSet } from 'lightning/utils';
import {
    hasAnimation,
    normalizeString,
    synchronizeAttrs,
    getRealDOMId,
} from 'lightning/utilsPrivate';
import { instanceName } from 'lightning/overlayUtils';
import { findAllTabbableElements } from 'lightning/focusUtils';
import LightningModalBase from 'lightning/modalBase';
import labelOK from '@salesforce/label/LightningInteractiveDialogBase.ok';
import labelCancel from '@salesforce/label/LightningInteractiveDialogBase.cancel';

// options for header theme based on SLDS themes
const themeOptions = [
    'default',
    'shade',
    'inverse',
    'alt-inverse',
    'success',
    'info',
    'warning',
    'error',
    'offline',
];

/**
 * Base component used for lightning-alert,
 * lightning-confirm and lightning-prompt
 */
export default class LightningModal extends LightningModalBase {
    static [instanceName] = 'lightning-interactive-dialog-base';

    label;
    description;
    okText = labelOK;
    cancelText = labelCancel;

    getChildProperty(property) {
        if (this.defaultSlot) {
            return this.defaultSlot.firstChild[property];
        }
        return null;
    }

    /**
     * Sets variant to determine
     * if header or headerless
     */
    setVariant() {
        const variant = this.getChildProperty('variant');
        const normalizedVariant = normalizeString(variant, {
            fallbackValue: 'header',
            validValues: ['header', 'headerless'],
        });
        this.showHeader = normalizedVariant === 'header';
    }

    /**
     * Calls functions to set all properties
     * that depend on slot being rendered
     */
    setChildProperties(detail) {
        this.role = detail.role;
        this.label = detail.label;
        this.hideCancel = detail.hideCancel;
        this.getOkValue = detail.getOkValue;
        this.getCancelValue = detail.getCancelValue;
        this.description = detail.showDescription ? detail.message : '';
        this.setVariant();
    }

    updateAriaLabelledBy() {
        if (this.showHeader) {
            const heading = this.template.querySelector('[data-modal-heading]');
            const headingId = getRealDOMId(heading);
            synchronizeAttrs(this.modalWrapper, {
                'aria-labelledby': headingId,
            });
        }
    }

    /**
     * gets aria-label value to set through template
     * ensures that renderedCallback gets extra call needed
     */
    get ariaLabel() {
        return this.showHeader ? null : this.label;
    }

    get computedModalHeaderCssClasses() {
        const theme = this.getChildProperty('theme');
        const normalizedTheme = normalizeString(theme, {
            fallbackValue: 'default',
            validValues: themeOptions,
        });
        const classes = classSet('slds-modal__header slds-theme_alert-texture');
        classes.add(`slds-theme_${normalizedTheme}`);
        return classes.toString();
    }

    get computedModalContentCssClasses() {
        const classes = classSet('slds-modal__content slds-p-around_medium');
        classes.add({
            'slds-modal__content_headless': !this.showHeader,
        });
        return classes.toString();
    }

    get computedModalCssClasses() {
        //waiting for x-small modal size
        const classes = classSet('slds-modal fix-slds-modal slds-modal_prompt');

        if (hasAnimation()) {
            classes.add({
                'slds-fade-in-open': this.isModalTransitioningIn,
            });
        } else {
            classes.add({
                'slds-fade-in-open': true,
            });
        }
        return classes.toString();
    }

    /**
     * Handles clicking the "OK" button
     * Closes modal with "okValue" set in child
     */
    handleOkClick() {
        let okValue;
        if (this.getOkValue) {
            okValue = this.getOkValue();
        }
        this.modal.close(okValue);
    }

    /**
     * Handles clicking the "Cancel" button and
     * Overrides handleCloseClick in modalBase
     * to address closing by "Escape" use case
     * Closes modal with "cancelValue" set in child
     */
    handleCloseClick() {
        let cancelValue;
        if (this.getCancelValue) {
            cancelValue = this.getCancelValue();
        }
        this.modal.close(cancelValue);
    }

    /**
     * Focus/select first focusable element in slot
     * if present, otherwise focuses wrapper
     */
    focusElement() {
        const tabbableElems = findAllTabbableElements(this.defaultSlot);
        if (tabbableElems && tabbableElems.length) {
            const focusElem = tabbableElems[0];
            focusElem.focus();
            if (focusElem.select) {
                focusElem.select();
            }
        } else {
            this.modalWrapper.focus();
        }
    }

    /**
     * Event handler for childrender event
     * from alert/confirm/prompt
     * Sets properties, aria attributes
     * and focuses element
     */
    handlePrivateChildRender(event) {
        event.stopPropagation();
        this.setChildProperties(event.detail || {});
        if (!this.isModalTransitioningIn) {
            this.queueShowModal();
        }
    }

    connectedCallback() {
        super.connectedCallback();
        // used to set theme styles in synthetic shadow
        this.setAttribute('data-interactive-dialog', true);
    }

    /**
     * Opens modal on initial render, sets aria attributes
     * and focuses element on second render
     */
    renderedCallback() {
        if (this.initialRender) {
            this.openModal();
            this.initialRender = false;
        } else if (this.modalWrapper) {
            this.template.host.style = 'z-index: 9099; position: absolute;';
            this.updateAriaDescription();
            this.updateAriaLabelledBy();
            if (!this.autoFocusCompletedOnce) {
                this.focusElement();
                this.autoFocusCompletedOnce = true;
            }
        }
    }
}
