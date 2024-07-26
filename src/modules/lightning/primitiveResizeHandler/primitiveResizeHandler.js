import labelColumnWidth from '@salesforce/label/LightningDatatable.columnWidth';
import { LightningElement, api } from 'lwc';
import { isRTL, keyCodes, isSafari } from 'lightning/utilsPrivate';

const i18n = {
    columnWidth: labelColumnWidth,
};
const LARGE_STEP = 50;

export default class PrimitiveResizeHandler extends LightningElement {
    static delegatesFocus = true;
    @api minWidth = 0;
    @api maxWidth = 1000;
    @api label = '';
    @api colIndex;
    @api internalTabIndex;
    @api isLastCol;
    @api step = 10;
    @api value;

    resized = false;

    constructor() {
        super();

        this.onMouseMoveWithContext = this.onMouseMove.bind(this);
        this.onMouseUpWithContext = this.onMouseUp.bind(this);
    }

    get resizerLabel() {
        const label = this.label || '';
        return `${label} ${i18n.columnWidth}`;
    }

    get resizeElement() {
        return this.refs.resizeHandle;
    }

    /* Need this label only in Safari because VO doesn't announce the change when resized */
    get showA11yLabel() {
        return this.resized && isSafari;
    }

    @api
    focus() {
        const inputEle = this.refs.input;

        if (inputEle) {
            inputEle.focus();
        }
    }

    onClick(event) {
        // capture the click event on button, to prevent the sorting of the column
        this.preventDefaultAndStopPropagation(event);
    }
    onStart(event, startX) {
        // prevent selecting text when mouse down
        event.returnValue = false;
        this.preventDefaultAndStopPropagation(event);

        const headerClientWidth = this.value;
        this.lowRange = this.minWidth - headerClientWidth;
        this.highRange = this.maxWidth - headerClientWidth;

        this.startX = startX;
        this.currentX = startX;
        this.touchingResizer = true;

        this.dispatchResizeStartEvent();

        // eslint-disable-next-line @lwc/lwc/no-async-operation
        requestAnimationFrame(this.resizing.bind(this));
    }

    onTouchStart(event) {
        if (!event.changedTouches.length) {
            return;
        }

        this.onStart(event, event.changedTouches[0].pageX);
    }

    onMouseDown(event) {
        const body = document.body;

        body.addEventListener('mousemove', this.onMouseMoveWithContext);
        body.addEventListener('mouseup', this.onMouseUpWithContext);
        body.addEventListener('mouseleave', this.onMouseUpWithContext);

        this.onStart(event, event.pageX);
    }

    onMouseMove(event) {
        if (!this.touchingResizer) {
            return;
        }

        this.currentX = event.pageX;
    }

    onTouchMove(event) {
        if (!this.touchingResizer || !event.changedTouches.length) {
            return;
        }

        this.currentX = event.changedTouches[0].pageX;
    }

    onMouseUp(event) {
        if (!this.touchingResizer) {
            return;
        }

        const body = document.body;

        body.removeEventListener('mousemove', this.onMouseMoveWithContext);
        body.removeEventListener('mouseup', this.onMouseUpWithContext);
        body.removeEventListener('mouseleave', this.onMouseUpWithContext);

        this.onEnd(event);
    }

    onTouchEnd(event) {
        if (!this.touchingResizer) {
            return;
        }
        this.onEnd(event);
    }

    // eslint-disable-next-line no-unused-vars
    onEnd(event) {
        this.touchingResizer = false;

        // Resize happens in the opposite direction in RTL
        const translateX =
            document.dir === 'rtl'
                ? this.startX - this.currentX
                : this.currentX - this.startX;
        this.resizeElement.style.transform = '';

        this.dispatchResizeEvent(translateX);
        this.dispatchResizeEndEvent();
    }

    resizing() {
        if (!this.touchingResizer) {
            return;
        }
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        requestAnimationFrame(this.resizing.bind(this));
        const translateX = this.currentX - this.startX;
        if (
            this.lowRange === undefined ||
            (translateX >= this.lowRange && translateX <= this.highRange)
        ) {
            this.resizeElement.style.transform = `translateX(${translateX}px)`;
        }
    }

    preventDefaultAndStopPropagation(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    handleKeydown(event) {
        switch (event.keyCode) {
            case keyCodes.left:
            case keyCodes.down:
                this.preventDefaultAndStopPropagation(event);
                this.dispatchResizeEvent(isRTL() ? this.step : 0 - this.step);
                break;
            case keyCodes.right:
            case keyCodes.up:
                this.preventDefaultAndStopPropagation(event);
                this.dispatchResizeEvent(isRTL() ? 0 - this.step : this.step);
                break;
            case keyCodes.pageup:
                this.preventDefaultAndStopPropagation(event);
                this.dispatchResizeEvent(
                    isRTL() ? -(this.step + LARGE_STEP) : this.step + LARGE_STEP
                );
                break;
            case keyCodes.pagedown:
                this.preventDefaultAndStopPropagation(event);
                this.dispatchResizeEvent(
                    isRTL() ? this.step + LARGE_STEP : -(this.step + LARGE_STEP)
                );
                break;
            case keyCodes.enter:
            case keyCodes.space:
                this.preventDefaultAndStopPropagation(event);
                break;
            case keyCodes.escape:
                break;
            default:
        }
    }

    dispatchResizeEvent(widthDelta) {
        this.resized = true;
        const actionName = 'resizecol';
        // eslint-disable-next-line lightning-global/no-custom-event-identifier-arguments
        const actionEvent = new CustomEvent(actionName, {
            bubbles: true,
            composed: true,
            detail: {
                colIndex: this.colIndex,
                widthDelta,
            },
        });
        this.dispatchEvent(actionEvent);
    }

    dispatchResizeStartEvent() {
        const actionEvent = new CustomEvent('privateresizestart', {
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(actionEvent);
    }

    dispatchResizeEndEvent() {
        const actionEvent = new CustomEvent('privateresizeend', {
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(actionEvent);
    }
}
