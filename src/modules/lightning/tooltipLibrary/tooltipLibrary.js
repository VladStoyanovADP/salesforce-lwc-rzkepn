import { createElement } from 'lwc';
import { AutoPosition, Direction } from 'lightning/positionLibrary';
import { assert, guid, normalizeString, isCSR } from 'lightning/utilsPrivate';
import LightningPrimitiveBubble from 'lightning/primitiveBubble';
import AriaObserver from 'lightning/ariaObserver';
export { Direction } from 'lightning/positionLibrary';

export const BUBBLE_PREFIX = `salesforce-lightning-tooltip-bubble`;
const BUBBLE_ID = `${BUBBLE_PREFIX}_${guid()}`;

function isResizeObserverSupported() {
    return window.ResizeObserver != null;
}

/**
 * Shared instance of a primitive bubble used as a tooltip by most components. This was originally
 * defined in the helptext component which is where the minWidth style came from.
 * TODO: We may want to revisit the minWidth style with the PO and/or UX.
 */
let CACHED_BUBBLE_ELEMENT;

let activeTooltip;

function getCachedBubbleElement() {
    if (!CACHED_BUBBLE_ELEMENT) {
        CACHED_BUBBLE_ELEMENT = createElement('lightning-primitive-bubble', {
            is: LightningPrimitiveBubble,
        });
        CACHED_BUBBLE_ELEMENT.contentId = BUBBLE_ID;
        CACHED_BUBBLE_ELEMENT.style.position = 'absolute';
        CACHED_BUBBLE_ELEMENT.style.minWidth = '75px';
        CACHED_BUBBLE_ELEMENT.disableVisibilityChangeOnLeave = true;
    }

    return CACHED_BUBBLE_ELEMENT;
}

const ARIA_DESCRIBEDBY = 'aria-describedby';

/**
 * Used as a position offset to compensate for the nubbin. The dimensions of the nubbin are not
 * included in the position library bounding box calculations. This is the size in pixels of the
 * nubbin.
 * TODO: We may want to measure this instead in cases it changes.
 */
const NUBBIN_SIZE = 16;

/**
 * Used in the calculation that moves the tooltip to a location that places the nubbin at the
 * center of the target element. This is the nubbin offset from the edge of the bubble in pixels
 * when using slds-nubbin_bottom-left or slds-nubbin_bottom-right.
 * TODO: We may want to measure this instead in case it changes.
 */
const NUBBIN_OFFSET = 24;

/**
 * Known tooltip types:
 * - info: used in cases where target already has click handlers such as button-icon
 * - toggle: used in cases where target only shows a tooltip such as helptext
 */
export const TooltipType = {
    Info: 'info',
    Toggle: 'toggle',
};

/**
 * Allows us to attach a tooltip to components. Typical usage is as follows:
 * - Create an instance of Tooltip
 * - Call Tooltip.initialize() to add the appropriate listeners to the element that needs a tooltip
 * See buttonIcon and buttonMenu for example usage.
 */
export class Tooltip {
    _autoPosition = null;
    _disabled = true;
    _initialized = false;
    _visible = false;
    _isFocusEvent = false;
    _initialResize = true;
    _ariaObserver = null;

    _config = {};

    /**
     * A shared instance of primitiveBubble is used when an element is not specified in the config
     * object.
     * @param {string} value the content of the tooltip
     * @param {object} config specifies the root component, target element of the tooltip
     */
    constructor(value, config) {
        assert(config.target, 'target for tooltip is undefined or missing');

        this.value = value;

        this._root = config.root;
        this._target = config.target;

        this._config = { ...config };
        this._config.align = config.align || {};
        this._config.targetAlign = config.targetAlign || {};
        this._config.disableAriaDescribedBy =
            config.disableAriaDescribedBy || false;

        this._type = normalizeString(config.type, {
            fallbackValue: TooltipType.Info,
            validValues: Object.values(TooltipType),
        });

        // If a tooltip element is not given, fall back on the globally shared instance.
        this._element = config.element;
        if (isCSR && !this._element) {
            this._element = getCachedBubbleElement;
            const bubbleElement = getCachedBubbleElement();
            if (bubbleElement.parentNode === null) {
                document.body.appendChild(bubbleElement);
            }
        }
        this.handleDocumentTouch = this.handleDocumentTouch.bind(this);
        this.handleEscape = this.handleEscape.bind(this);
        this.hide = this.hide.bind(this);
    }

    /**
     * Disables the tooltip.
     */
    detach() {
        this._disabled = true;
    }

    /**
     * Enables the tooltip.
     */
    attach() {
        this._disabled = false;
    }

    /**
     * Adds the appropriate event listeners to the target element to make the tooltip appear. Also
     * links the tooltip and target element via the aria-describedby attribute for screen readers.
     */
    initialize() {
        const target = this._target();
        if (!this._initialized && target) {
            switch (this._type) {
                case TooltipType.Toggle:
                    this.addToggleListeners();
                    break;
                case TooltipType.Info:
                default:
                    this.addInfoListeners();
                    break;
            }

            if (!this._config.disableAriaDescribedBy) {
                this._ariaObserver = new AriaObserver(this._root);

                this._ariaObserver.connect({
                    attribute: ARIA_DESCRIBEDBY,
                    targetNode: this._target(),
                    relatedNodes: this._element(),
                });
            }
            this._initialized = true;
        }
    }

    disconnect() {
        if (this._ariaObserver) this._ariaObserver.disconnect();
    }

    addInfoListeners() {
        const target = this._target();

        if (!this._initialized && target) {
            ['mouseenter', 'focus'].forEach((name) =>
                target.addEventListener(name, () => this.show())
            );
            // Unlike the tooltip in Aura, we want clicks and keys to dismiss the tooltip.
            ['mouseleave', 'blur', 'click', 'keydown'].forEach((name) =>
                target.addEventListener(name, (event) => {
                    if (!this._visible) {
                        return;
                    }
                    this.hideIfNotSelfCover(event);

                    if (event.key === 'Escape') {
                        event.stopPropagation();
                    }
                })
            );
        }
    }

    hideIfNotSelfCover(event) {
        /*
            If the tooltip is already hidden, do not try to hide it. The primitive bubble is shared and we don't want to
            hide a tooltip that does not belong to this instance.
        */
        if (!this._visible) {
            return;
        }
        if (event.type === 'mouseleave' && event.clientX && event.clientY) {
            // In any chance, if mouseleave is caused by tooltip itself, it would means
            // tooltip cover the target which mostly caused by dynamic resize of tooltip by CSS or JS.
            try {
                const elementMouseIsOver = document.elementFromPoint
                    ? document.elementFromPoint(event.clientX, event.clientY)
                    : null;
                if (elementMouseIsOver === this._element()) {
                    if (!isResizeObserverSupported()) {
                        this.startPositioning();
                    }
                    return;
                }
            } catch (ex) {
                // Jest Throw Exception
            }
        }
        this.hide();
    }

    handleDocumentTouch() {
        if (this._visible) {
            this.hide();
        }
    }

    addToggleListeners() {
        const target = this._target();

        if (!this._initialized && target) {
            ['touchstart', 'click'].forEach((eventName) =>
                target.addEventListener(eventName, (event) =>
                    this.toggleIfTouchOrClick(event)
                )
            );

            ['mouseenter', 'focus'].forEach((eventName) =>
                target.addEventListener(eventName, (event) => this.show(event))
            );
            ['mouseleave', 'blur'].forEach((eventName) =>
                target.addEventListener(eventName, (event) =>
                    this.hideIfNotSelfCover(event)
                )
            );

            target.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && this._visible) {
                    this.hideIfNotSelfCover(event);
                    event.stopPropagation();
                }
            });
        }
    }

    /* mobile listens for both 'click' and 'touchstart', but we only want to listen to
       either 'touchstart' and not 'click', otherwise it will double toggle. Call preventDefault() to prevent the
       'click' event from bubbling after a 'touchstart' is detected on mobile.
    */
    toggleIfTouchOrClick(e) {
        e.preventDefault();
        e.stopPropagation();
        this.toggle();
    }

    handleEscape(e) {
        if (e.key === 'Escape' && this._isFocusEvent) {
            e.stopPropagation();
            this.hideIfNotSelfCover(e);
        }
    }

    get resizeObserver() {
        if (!this._resizeObserver) {
            this._resizeObserver = this._buildResizeObserver(() => {
                if (this._visible && this._autoPosition) {
                    const tooltip = this._element();
                    /**
                     * There are some cases where the tooltip hide event does not trigger. For example,
                     * if a tab triggers a focus event on element A and then a pointer triggers mouseenter on element B.
                     * In this case, the content of the cached tooltip does not match the value of this Tooltip object and
                     * we know that this tooltip should be hidden. See @W-12512833
                     */
                    if (activeTooltip !== this) {
                        this.hide(false);
                        return;
                    }
                    this.startPositioning().then(() => {
                        /*
                         * Once positioning is complete, add the listener to react when the mouse leaves the tooltip.
                         * Cannot be added before, or the tooltip will flicker and hide if the mouse is in the same
                         * position as the tooltip and the user tabs onto the tooltip. This cannot be managed inside
                         * the primitive-bubble, or the ResizeObserver will not be reset correctly.
                         */
                        if (this._initialResize) {
                            tooltip.addEventListener('mouseleave', this.hide);
                            this._initialResize = false;
                        }
                    });
                }
            });
        }
        return this._resizeObserver;
    }

    show(ev) {
        if (this._disabled || this._visible) {
            return;
        }

        if (activeTooltip && activeTooltip !== this && activeTooltip._visible) {
            activeTooltip.hide(false);
        }
        activeTooltip = this;

        this._isFocusEvent = ev && (ev.type === 'focus' ? true : false);

        this._visible = true;
        this._initialResize = true;
        const tooltip = this._element();
        tooltip.visible = this._visible;
        tooltip.content = this._value;

        if (this._ariaObserver && this._root && this._root.isConnected) {
            this._ariaObserver.sync();
        }

        this.startPositioning();
        document.addEventListener('keydown', this.handleEscape);
        document.addEventListener('touchstart', this.handleDocumentTouch);
        this.resizeObserver.observe(tooltip);
    }

    /**
     * Hides the tooltip
     *
     * @param {*} hideBubble the primitive bubble is a shared instance, it may not be desirable to hide it
     * if the current tooltip is no longer using it.
     */
    hide(hideBubble = true) {
        this._visible = false;
        const tooltip = this._element();

        if (hideBubble) {
            tooltip.visible = this._visible;
        }

        this.stopPositioning();

        document.removeEventListener('touchstart', this.handleDocumentTouch);
        document.removeEventListener('keydown', this.handleEscape);
        tooltip.removeEventListener('mouseleave', this.hide);

        this.resizeObserver.unobserve(tooltip);
        activeTooltip = null;
    }

    toggle() {
        if (this._visible) {
            this.hide();
        } else {
            this.show();
        }
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
        this._disabled = !value;
    }

    get initialized() {
        return this._initialized;
    }

    get visible() {
        return this._visible;
    }

    startPositioning() {
        if (!this._autoPosition) {
            this._autoPosition = new AutoPosition(this._root);
        }

        // The lightning-helptext component was originally left aligned.
        const align = {
            horizontal: this._config.align.horizontal || Direction.Left,
            vertical: this._config.align.vertical || Direction.Bottom,
        };
        const targetAlign = {
            horizontal: this._config.targetAlign.horizontal || Direction.Left,
            vertical: this._config.targetAlign.vertical || Direction.Top,
        };

        // Pads the tooltip so its nubbin is at the center of the target element.
        const targetBox = this._target().getBoundingClientRect();
        const padLeft = targetBox.width * 0.5 - NUBBIN_OFFSET;

        return this._autoPosition
            .start({
                target: this._target,
                element: this._element,
                align,
                targetAlign,
                autoFlip: true,
                padTop: NUBBIN_SIZE,
                padLeft,
            })
            .then((autoPositionUpdater) => {
                // The calculation above may have flipped the alignment of the tooltip. When the
                // tooltip changes alignment we need to update the nubbin class to have it draw in
                // the appropriate place.
                if (autoPositionUpdater) {
                    const tooltip = this._element();
                    tooltip.align = autoPositionUpdater.config.align;
                    tooltip.visible = this._visible;
                }
            });
    }

    stopPositioning() {
        if (this._autoPosition) {
            this._autoPosition.stop();
        }
    }

    _buildResizeObserver(callback) {
        if (isResizeObserverSupported()) {
            return new ResizeObserver(callback);
        }
        return {
            observe() {},

            unobserve() {},
        };
    }
}
