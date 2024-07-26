import { api } from 'lwc';
import LightningInteractiveDialogBase from 'lightning/interactiveDialogBase';
import { parent, instanceName, secure } from 'lightning/overlayUtils';
import LightningOverlay from 'lightning/overlay';
import { isCSR } from 'lightning/utilsPrivate';
import labelDefault from '@salesforce/label/LightningPrompt.defaultLabel';

/**
 * Create a prompt modal within your component that asks the
 * user to provide information before they continue.
 */

export default class LightningPrompt extends LightningOverlay {
    static [instanceName] = 'lightning-prompt';
    static [parent] = LightningInteractiveDialogBase;

    /**
     * Value to use for header text in "header" variant
     * or aria-label in "headerless" variant.
     * @type {string}
     * @default "Prompt" (translated accordingly)
     */
    @api label = labelDefault;

    /**
     * Text to display in the prompt.
     */
    @api message = '';

    /**
     * Default value for input.
     */
    @api defaultValue = '';

    /**
     * Variant to use for the prompt. Valid
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
                showDescription: false,
                getOkValue: this.getOkValue.bind(this),
                getCancelValue: () => null,
                role: 'dialog',
            },
        });
        this.dispatchEvent(evt);
    }

    getOkValue() {
        if (this.template.querySelector('input')) {
            return this.template.querySelector('input').value;
        }
        return this.defaultValue;
    }
}
