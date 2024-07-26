import { api } from 'lwc';
import LightningInteractiveDialogBase from 'lightning/interactiveDialogBase';
import { parent, instanceName, secure } from 'lightning/overlayUtils';
import LightningOverlay from 'lightning/overlay';
import { isCSR } from 'lightning/utilsPrivate';
import labelDefault from '@salesforce/label/LightningConfirm.defaultLabel';

/**
 * Create a confirm modal within your component that asks the user
 * to respond before they continue.
 */

export default class LightningConfirm extends LightningOverlay {
    static [instanceName] = 'lightning-confirm';
    static [parent] = LightningInteractiveDialogBase;

    /**
     * Value to use for header text in "header" variant
     * or aria-label in "headerless" variant.
     * @type {string}
     * @default "Confirm" (translated accordingly)
     */
    @api label = labelDefault;

    /**
     * Text to display in the confirm modal.
     */
    @api message = '';

    /**
     * Variant to use for the confirm modal. Valid
     * values are "header" and "headerless".
     */
    @api variant = 'header';

    /**
     * Theme to use when variant is "header".
     * Valid values are "default", "shade",
     * "inverse", "alt-inverse", "success",
     * "success", "info", "warning", "error",
     * and "offline".
     */
    @api theme = 'default';

    /**
     * Dispatches privateclose event
     * and closes dialog
     */
    close(result) {
        const promise = new Promise((resolve) => {
            if (isCSR) {
                this.dispatchEvent(
                    new CustomEvent('privateclose', {
                        detail: {
                            resolve,
                            [secure]: true,
                        },
                        bubbles: true,
                    })
                );
            }
        });
        super.close(result, promise);
    }

    /**
     * Dispatches privatechildrender event
     * with data parent needs to correctly render
     */
    renderedCallback() {
        const evt = new CustomEvent('privatechildrender', {
            bubbles: true,
            detail: {
                message: this.message,
                label: this.label,
                hideCancel: false,
                showDescription: true,
                getOkValue: () => true,
                getCancelValue: () => false,
                role: 'alertdialog',
            },
        });
        this.dispatchEvent(evt);
    }
}
