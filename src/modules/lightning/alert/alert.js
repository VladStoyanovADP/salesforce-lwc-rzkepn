import { api } from 'lwc';
import LightningInteractiveDialogBase from 'lightning/interactiveDialogBase';
import LightningOverlay from 'lightning/overlay';
import { parent, instanceName, secure } from 'lightning/overlayUtils';
import { isCSR } from 'lightning/utilsPrivate';
import labelDefault from '@salesforce/label/LightningAlert.defaultLabel';

/**
 * Create an alert modal within your component that communicates
 * a state that affects the entire system, not just a feature or page.
 */

export default class LightningAlert extends LightningOverlay {
    static [instanceName] = 'lightning-alert';
    static [parent] = LightningInteractiveDialogBase;

    /**
     * Value to use for header text in "header" variant
     * or aria-label in "headerless" variant.
     * @type {string}
     * @default "Alert" (translated accordingly)
     */
    @api label = labelDefault;

    /**
     * Text to display in the alert.
     */
    @api message = '';

    /**
     * Variant to use for alert. Valid values are
     * "header" and "headerless".
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
                hideCancel: true,
                showDescription: true,
                role: 'alertdialog',
            },
        });
        this.dispatchEvent(evt);
    }
}
