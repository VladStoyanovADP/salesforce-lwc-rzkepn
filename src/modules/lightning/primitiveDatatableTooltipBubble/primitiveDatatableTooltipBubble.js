import { LightningElement, api, track } from 'lwc';
import { classListMutation, keyCodes } from 'lightning/utilsPrivate';
import { classSet } from 'lightning/utils';
import labelCloseButtonAssistiveText from '@salesforce/label/LightningDatatable.closeButtonAssistiveText';

const i18n = {
    closeButtonAssistiveText: labelCloseButtonAssistiveText,
};

const DEFAULT_ALIGN = {
    horizontal: 'left',
    vertical: 'bottom',
};

export default class LightningPrimitiveDatatableTooltipBubble extends LightningElement {
    _inDom = false;
    _visible = false;
    @track _align = DEFAULT_ALIGN;

    @api anchor;
    @api header = '';
    @api content = '';
    @api variant = 'bare'; // bare, error, warning
    @api hideCloseButton = false;

    connectedCallback() {
        this._inDOM = true;

        this.updateClassList();
    }

    disconnectedCallback() {
        this._inDOM = false;
    }

    @api
    get align() {
        return this._align;
    }
    set align(value) {
        this._align = value;
        if (this._inDOM) {
            this.updateClassList();
        }
    }

    @api
    get visible() {
        return this._visible;
    }

    set visible(value) {
        this._visible = value;
        if (this._inDOM) {
            this.updateClassList();
        }
    }

    @api
    focus() {
        this.closeButton.focus();
    }

    get i18n() {
        return i18n;
    }

    get isContentList() {
        return Array.isArray(this.content);
    }

    get computedHeaderIconName() {
        switch (this.variant) {
            case 'error':
                return 'utility:ban';
            case 'warning':
                return 'utility:warning';
            case 'bare':
            default:
                return 'utility:info';
        }
    }

    get closeButton() {
        return this.refs.closeBtn;
    }

    handleBlur = (evt) => {
        // A valid blur is when the focus goes to an element outside the bubble.
        // If the element with the focus is inside the bubble, then the component as a whole was not blurred.
        const isValidBlur =
            evt.relatedTarget === null ||
            !this.template.contains(evt.relatedTarget);

        if (isValidBlur) {
            this.handleBubbleFocusLost();
        }
    };

    handleBubbleFocusLost = () => {
        this.dispatchCloseButtonEvent('bubbleLoseFocus');
    };

    handleBubbleKey = (event) => {
        if (keyCodes.escape === event.keyCode) {
            this.dispatchCloseButtonEvent();
        }
        if (keyCodes.tab === event.keyCode) {
            event.preventDefault();
            event.stopPropagation();
            this.focus();
        }
    };

    handleCloseButtonClick = () => {
        this.dispatchCloseButtonEvent();
    };

    handleCloseButtonKey = (event) => {
        // block tab and all other keys to keep focus
        event.preventDefault();
        event.stopPropagation();

        const keysToClose = [keyCodes.enter, keyCodes.space, keyCodes.escape];
        if (keysToClose.includes(event.keyCode)) {
            this.dispatchCloseButtonEvent();
        }
    };

    updateClassList() {
        const classes = classSet('slds-popover');

        classes.add({
            'slds-popover_error': this.variant === 'error',
            'slds-popover_warning': this.variant === 'warning',
        });

        // apply fading effect
        classes.add({
            'slds-rise-from-ground': this._visible === true,
            'slds-fall-into-ground': this._visible === false,
        });

        // apply the proper nubbin CSS class
        const { horizontal, vertical } = this.align;
        classes.add({
            'slds-nubbin_top-left': horizontal === 'left' && vertical === 'top',
            'slds-nubbin_top-right':
                horizontal === 'right' && vertical === 'top',
            'slds-nubbin_bottom-left':
                horizontal === 'left' && vertical === 'bottom',
            'slds-nubbin_bottom-right':
                horizontal === 'right' && vertical === 'bottom',
        });

        classListMutation(this.classList, classes);
    }

    dispatchCloseButtonEvent(reason) {
        this.dispatchEvent(
            new CustomEvent('close', {
                detail: {
                    reason: reason || 'userCloseBubble',
                    anchor: this.anchor,
                },
            })
        );
    }
}
