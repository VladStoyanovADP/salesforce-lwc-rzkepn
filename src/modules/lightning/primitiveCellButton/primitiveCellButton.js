import { LightningElement, api } from 'lwc';
import { normalizeBoolean } from 'lightning/utilsPrivate';

export default class PrivateCellButton extends LightningElement {
    static delegatesFocus = true;
    @api rowKeyValue;
    @api colKeyValue;
    @api variant;
    @api label;
    @api iconName;
    @api iconPosition;
    @api buttonName;
    @api buttonClass;
    @api buttonTitle;
    @api internalTabIndex;
    @api type;
    @api alternativeText; // from type=button-icon
    @api iconClass; // from type=button-icon

    initialRender = true;
    buttonHasFocus = false;
    _connected = false;
    _disabled = false;

    get computedTitle() {
        return this.buttonTitle || this.label;
    }

    @api
    get disabled() {
        return this._disabled;
    }

    set disabled(value) {
        const newValue = normalizeBoolean(value);
        const oldValue = this._disabled;
        if (oldValue === false && newValue === true && this.buttonHasFocus) {
            this.fireCellFalseBlurred();
        }
        this._disabled = newValue;
    }

    get isButtonIconType() {
        return this.type === 'button-icon';
    }

    renderedCallback() {
        if (this.initialRender) {
            this.addListeners();
        }
        this.initialRender = false;
    }

    connectedCallback() {
        this._connected = true;
    }

    disconnectedCallback() {
        this._connected = false;
    }

    get buttonCustomElement() {
        if (this._connected) {
            return this.isButtonIconType
                ? this.refs.buttonIcon
                : this.refs.button;
        }
        return undefined;
    }

    addListeners() {
        const buttonCustomElement = this.buttonCustomElement;

        buttonCustomElement.addEventListener(
            'focus',
            this.handleButtonFocused.bind(this)
        );
        buttonCustomElement.addEventListener(
            'blur',
            this.handleButtonBlurred.bind(this)
        );
    }

    @api
    focus() {
        if (this.buttonCustomElement) {
            this.buttonCustomElement.focus();
        }
    }

    @api
    click() {
        if (this.buttonCustomElement) {
            this.buttonCustomElement.click();
        }
    }

    handleButtonFocused(event) {
        if (event.target.localName.indexOf('button') > -1) {
            this.buttonHasFocus = true;
        }
    }

    handleButtonBlurred(event) {
        if (event.target.localName.indexOf('button') > -1) {
            this.buttonHasFocus = false;
        }
    }

    fireCellFalseBlurred() {
        const { rowKeyValue, colKeyValue } = this;
        this.dispatchEvent(
            new CustomEvent('privatecellfalseblurred', {
                composed: true,
                bubbles: true,
                cancelable: true,
                detail: {
                    rowKeyValue,
                    colKeyValue,
                },
            })
        );
    }

    handleButtonClick() {
        const { rowKeyValue, colKeyValue } = this;
        // fire this event in the next tick so that dt can do things it has to do for correct focus
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            this.dispatchEvent(
                new CustomEvent('privatecellbuttonclicked', {
                    composed: true,
                    bubbles: true,
                    cancelable: true,
                    detail: {
                        rowKeyValue,
                        colKeyValue,
                    },
                })
            );
        }, 0);
    }
}
