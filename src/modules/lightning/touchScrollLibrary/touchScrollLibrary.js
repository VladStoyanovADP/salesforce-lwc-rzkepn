import { assert } from 'lightning/utilsPrivate';
import formFactor from '@salesforce/client/formFactor';

function getPositionY(event) {
    return event.touches ? event.touches[0].screenY : event.screenY;
}

function canScroll(el) {
    var canScrollY = el.scrollHeight > el.offsetHeight;
    var canScrollX = el.scrollWidth > el.offsetWidth;
    return canScrollY || canScrollX;
}

function alwaysScrolls(el) {
    var isInputRange = el.tagName === 'INPUT' && el.type === 'range';
    return isInputRange;
}

function nativeScroll(el) {
    var isTextarea = el.tagName === 'TEXTAREA';
    return isTextarea;
}

function isAtTop(el) {
    return el.scrollTop === 0;
}

function isAtBottom(el) {
    return (
        el.scrollHeight - el.scrollTop === el.offsetHeight ||
        el.scrollHeight - el.scrollTop === el.clientHeight
    );
}

function skipUiScroller(event) {
    event.cancelScrolling = true;
    event.preventBounce = false;
}

function enableUiScroller(event) {
    event.cancelScrolling = false;
    event.preventBounce = true;
}

/**
 * Enables vertical touch scrolling on the given element and bubbles the event up to ui:scroller
 * when the top/bottom scroll boundary is reached. Also allows child textarea elements to scroll
 * the same way.
 */
export class TouchScroller {
    _initialized = false;
    _startY = null;

    static isMobile() {
        return formFactor !== 'Large';
    }

    constructor(target) {
        assert(
            target,
            'a non-empty target is required for TouchScroller to add touch listeners to'
        );
        this._target = target;
        this.initialize();
    }

    initialize() {
        if (!this._initialized && this._target) {
            if (TouchScroller.isMobile()) {
                this._target.addEventListener('touchstart', (event) =>
                    this.handleTouchStart(event)
                );
                this._target.addEventListener('touchmove', (event) =>
                    this.handleTouchMove(event)
                );
            }

            this._initialized = true;
        }
    }

    handleTouchStart(event) {
        this._startY = getPositionY(event);
    }

    /**
     * Vertical touch scrolling, borrows heavily from scrollerWrapperController.handleTouchmove.
     * @param {Event} event the touch event to handle
     */
    handleTouchMove(event) {
        var el = event.currentTarget;
        var target = event.target;

        // Elements that have their own scroll behavior such as input type range never cause
        // bouncing or container scrolling.
        if (alwaysScrolls(target)) {
            skipUiScroller(event);
            return;
        }

        // There are elements such as textarea that handle their own scrolling. Other elements will
        // defer to the container with the touch handler.
        const canScrollCurrent = canScroll(el);
        const canScrollTarget = nativeScroll(target) && canScroll(target);

        if (canScrollTarget || canScrollCurrent) {
            const curY = getPositionY(event);

            // Determine if the user is trying to scroll past the top or bottom.
            let atTop = this._startY < curY && isAtTop(el);
            let atBottom = this._startY > curY && isAtBottom(el);

            // When target is scrollable, we also need to check if the user is trying to scroll
            // past the edge of target.
            if (canScrollTarget && !event.preventBounce) {
                atTop = atTop && isAtTop(target);
                atBottom = atBottom && isAtBottom(target);
            }

            if (!atTop && !atBottom) {
                skipUiScroller(event);
            } else {
                enableUiScroller(event);
            }
        }
    }
}
