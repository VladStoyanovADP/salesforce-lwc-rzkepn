import labelAutoPlay from '@salesforce/label/LightningCarousel.autoPlay';
import labelTabString from '@salesforce/label/LightningCarousel.tabString';
import { LightningElement, api, track } from 'lwc';
import { keyCodes, normalizeBoolean } from 'lightning/utilsPrivate';

const INDICATOR_ACTION = 'slds-carousel__indicator-action';
const SLDS_ACTIVE = 'slds-is-active';
const PAUSE_ICON = 'utility:pause';
const PLAY_ICON = 'utility:right';
const FALSE_STRING = 'false';
const TRUE_STRING = 'true';
const SWIPE_DISTANCE_THRESHOLD = 20;
const DIRECTION_LEFT = 'left';
const DIRECTION_RIGHT = 'right';

const i18n = {
    autoPlay: labelAutoPlay,
    tabString: labelTabString,
};

/**
 * A collection of images that are displayed one at a time.
 * @slot default Placeholder for carousel-image. Up to 5 carousel-image components are allowed.
 */
export default class LightningCarousel extends LightningElement {
    get i18n() {
        return i18n;
    }

    /**
     * If present, images do not automatically scroll and users must click the indicators to scroll.
     * @type {boolean}
     * @default false
     */
    @api
    get disableAutoScroll() {
        return this._disableAutoScroll || false;
    }
    set disableAutoScroll(value) {
        this._disableAutoScroll = normalizeBoolean(value);
    }

    /**
     * If present, the carousel doesn't loop after the last image is displayed.
     *
     * @type {boolean}
     * @default false
     */
    @api
    get disableAutoRefresh() {
        return this._disableAutoRefresh || false;
    }
    set disableAutoRefresh(value) {
        this._disableAutoRefresh = normalizeBoolean(value);
    }

    /**
     * The auto scroll duration. The default is 5 seconds, after that the next image is displayed.
     * @type {number}
     * @default 5
     */
    @api scrollDuration = 5;

    /**
     * Array that maintains the state of the Carousel's pagination.
     * @name paginationItems
     * @type {Array}
     * @private
     */
    @track paginationItems = [];

    /**
     * The path of the auto scroll button background
     * @name autoScrollIcon
     * @type {String}
     */
    @track autoScrollIcon = PAUSE_ICON;

    /**
     * Aria role for the pressed state of the auto scroll button
     * @name ariaPressed
     * @type {String}
     */
    @track ariaPressed = FALSE_STRING;

    @track carouselPanelsStyle;

    /**
     * Aria role for the pressed state of the auto scroll button
     * @name ariaPressed
     * @type {String}
     */
    togglePlayString = i18n.autoPlay;

    /**
     * Flag to determine if this is the first time the component
     * is being rendered. Used inside renderedCallback.
     * @name initialRender
     * @type {Boolean}
     * @private
     */
    initialRender = true;

    /**
     * Holds the current index of the active item on the carousel
     * @name activeIndexItem
     * @type {Number}
     * @private
     */
    activeIndexItem = 0;

    /**
     * Array that holds all the carousel Items
     * @name carouselItems
     * @type {Array}
     * @private
     */
    carouselItems = [];

    /**
     * The auto scroll timeout reference.
     * @name autoScrollTimeOut
     * @type {Object}
     * @private
     */
    autoScrollTimeOut;

    /**
     * The touch starting x position when user swipes the carousel.
     * @name swipeXStart
     * @type {number}
     * @private
     */
    swipeXStart = 0;

    /**
     * Handles the registration for all the items inside the carousel that have been
     * loaded via <slot></slot>. It also loads the data for the pagination state object
     * and sets the active item we want to display on first render.
     * @param {Object} event - The event object
     */
    handlePrivateImageRegister(event) {
        const target = event.target,
            item = event.detail,
            currentIndex = this.carouselItems.length,
            isItemActive = currentIndex === this.activeIndexItem,
            paginationItemDetail = {
                key: item.guid,
                id: `pagination-item-${currentIndex}`,
                tabTitle: target.description
                    ? target.description + ' ' + i18n.tabString
                    : null,
                className: isItemActive
                    ? INDICATOR_ACTION + ' ' + SLDS_ACTIVE
                    : INDICATOR_ACTION,
                tabIndex: isItemActive ? '0' : '-1',
                contentId: event.detail.contentId,
                ariaSelected: isItemActive ? TRUE_STRING : FALSE_STRING,
            };

        event.stopPropagation();

        if (currentIndex > 5) {
            // console.error('Only up to 5 carousel Images are allowed at a time');
            return;
        }

        // if the activeIndexItem is equal to the currentIndex on the registration process
        // then we se set it active. paginationItemDetail also needs to reflect the active state.
        if (isItemActive) {
            item.callbacks.select();
        }

        this.paginationItems.push(paginationItemDetail);
        this.carouselItems.push(item);
    }

    connectedCallback() {
        // in mobile, we don't want ui:scroller to handle touch moves
        this.setAttribute('data-handles-touch', true);
        this.addEventListener(
            'privateimageregister',
            this.handlePrivateImageRegister.bind(this)
        );
    }

    /**
     * Render callback handler to call up the autoScoller if
     * the property is enabled.
     */
    renderedCallback() {
        if (this.initialRender) {
            if (!this.disableAutoScroll) {
                this.setAutoScroll();
            }
        }
        this.synchronizeA11y();
        this.initialRender = false;
    }

    /**
     * Synchronizes aria role attributes once all the registration and rendering is done
     * and the values for ids and aria-* have been dynamically generated.
     */
    synchronizeA11y() {
        if (!this.hasSyncChronizedA11y) {
            const paginationElements = this.template.querySelectorAll(
                '.slds-carousel__indicators a'
            );

            paginationElements.forEach((element, index) => {
                element.setAttribute(
                    'aria-controls',
                    this.paginationItems[index].contentId
                );
                this.carouselItems[index].callbacks.setLabelledBy(element.id);
                this.hasSyncChronizedA11y = true;
            });
        }
    }

    /**
     * Sets up the timeout for the auto scrolling task
     */
    setAutoScroll() {
        // milliseconds
        const scrollDuration = parseInt(this.scrollDuration, 10) * 1000;
        const carouselItemsLength = this.carouselItems.length;

        if (
            this.activeIndexItem === carouselItemsLength - 1 &&
            this.disableAutoRefresh
        ) {
            this.autoScrollOff();
            return;
        }

        this.cancelAutoScrollTimeOut();
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.autoScrollTimeOut = setTimeout(
            this.startAutoScroll.bind(this),
            scrollDuration
        );
    }

    /**
     * Function that starts the autoScrolling functionallity
     */
    startAutoScroll() {
        this.selectNextSibling();
        this.setAutoScroll();
    }

    /**
     * Cancels the auto scroll timeout task.
     */
    cancelAutoScrollTimeOut() {
        clearTimeout(this.autoScrollTimeOut);
    }

    /**
     * Event handle for toggling on play/pause the autoScroll
     */
    toggleAutoScroll() {
        const ariaPressed = this.ariaPressed;

        if (ariaPressed === FALSE_STRING) {
            this.autoScrollOff();
        } else {
            this.autoScrollOn();
        }
    }

    /**
     * Sets the state for Auto Scroll on.
     */
    autoScrollOn() {
        const carouselItemsLength = this.carouselItems.length;

        if (!this.disableAutoScroll) {
            if (
                this.activeIndexItem === carouselItemsLength - 1 &&
                this.disableAutoRefresh
            ) {
                this.unselectCurrentItem();
                this.selectNewItem(0);
            }

            this.autoScrollIcon = PAUSE_ICON;
            this.ariaPressed = FALSE_STRING;
            this.setAutoScroll();
        }
    }

    /**
     * Sets the state for Auto Scroll off.
     */
    autoScrollOff() {
        if (!this.disableAutoScroll) {
            this.ariaPressed = TRUE_STRING;
            this.autoScrollIcon = PLAY_ICON;
            this.cancelAutoScrollTimeOut();
        }
    }

    /**
     * Handler for when the user selects a new carousel item via the
     * carousel's pagination. It unselects the current active item and sets
     * active the new item recieved.
     * @param {Object} event - The event object
     */
    onItemSelect(event) {
        const currentTarget = event.currentTarget,
            itemIndex = currentTarget.getAttribute('data-index');

        this.autoScrollOff();

        if (this.activeIndexItem !== itemIndex) {
            this.unselectCurrentItem();
            this.selectNewItem(itemIndex);
            this.activeIndexItem = parseInt(itemIndex, 10);
        }
    }

    /**
     * prevent browser default when clicking on anchor tag with href '#'
     */
    onItemLinkSelect(event) {
        event.preventDefault();
    }

    /**
     * Unselects the current active item on the carousel.
     */
    unselectCurrentItem() {
        const activePaginationItem = this.paginationItems[this.activeIndexItem];

        activePaginationItem.tabIndex = '-1';
        activePaginationItem.ariaSelected = FALSE_STRING;
        activePaginationItem.className = INDICATOR_ACTION;

        this.carouselItems[this.activeIndexItem].callbacks.unselect();
    }

    /**
     * Selects a new item on the carousel based on the index provided.
     * @param {Number} itemIndex - The index of the item to be selected
     */
    selectNewItem(itemIndex) {
        const activePaginationItem = this.paginationItems[itemIndex];

        if (!this.carouselItems[itemIndex].callbacks.isSelected()) {
            activePaginationItem.tabIndex = '0';
            activePaginationItem.ariaSelected = TRUE_STRING;
            activePaginationItem.className =
                INDICATOR_ACTION + ' ' + SLDS_ACTIVE;

            this.carouselPanelsStyle = `transform:translateX(-${
                itemIndex * 100
            }%);`;
            this.carouselItems[itemIndex].callbacks.select();
            this.activeIndexItem = itemIndex;
        }
    }

    /**
     * Key press event handler.
     * Listens to key presses and reacts moving the carousel items to next or previous
     * when the focus is active.
     * @param {Object} event - The event object
     */
    keyDownHandler(event) {
        const key = event.keyCode;
        let indicatorActionsElements = this.indicatorActionsElements;

        if (key === keyCodes.right) {
            event.preventDefault();
            event.stopPropagation();

            this.autoScrollOff();
            this.selectNextSibling();
        }

        if (key === keyCodes.left) {
            event.preventDefault();
            event.stopPropagation();

            this.autoScrollOff();
            this.selectPreviousSibling();
        }

        // we cache them the first time
        if (!indicatorActionsElements) {
            indicatorActionsElements = this.template.querySelectorAll(
                '.slds-carousel__indicator-action'
            );
            this.indicatorActionsElements = indicatorActionsElements;
        }

        // we want to make sure that while we are using the keyboard
        // navigation we are focusing on the right indicator
        indicatorActionsElements[this.activeIndexItem].focus();
    }

    /**
     * Marks as active the next sibiling to the
     * current active index.
     */
    selectNextSibling() {
        const carouselItemsLength = this.carouselItems.length;
        let itemIndex = this.activeIndexItem + 1;

        // go to first item
        if (this.activeIndexItem === carouselItemsLength - 1) {
            if (this.disableAutoRefresh) {
                this.autoScrollOff();
                return;
            }

            itemIndex = 0;
        }

        this.unselectCurrentItem();
        this.selectNewItem(itemIndex);
    }

    /**
     * Marks as active the previous sibiling to the
     * current active index.
     */
    selectPreviousSibling() {
        const carouselItemsLength = this.carouselItems.length;
        let itemIndex = this.activeIndexItem - 1;

        // go to last item
        if (this.activeIndexItem === 0) {
            if (this.disableAutoRefresh) {
                this.autoScrollOff();
                return;
            }
            itemIndex = carouselItemsLength - 1;
        }

        this.unselectCurrentItem();
        this.selectNewItem(itemIndex);
    }

    /**
     * when the user swipes the carousel, store the starting x position.
     */
    handleTouchStart({ changedTouches }) {
        this.swipeXStart = (changedTouches && changedTouches[0].clientX) || 0;
    }

    /**
     * When the user done swiping, calculate the swipe distance and if its greater
     * than the threshold, move the carousel in swiping direction.
     * @param {Object} event - The event object
     */
    handleTouchEnd(event) {
        const { changedTouches } = event;
        const swipeXEnd = (changedTouches && changedTouches[0].clientX) || 0;
        const dx = swipeXEnd - this.swipeXStart;
        const direction =
            Math.sign(dx) === 1 ? DIRECTION_LEFT : DIRECTION_RIGHT;
        if (Math.abs(dx) > SWIPE_DISTANCE_THRESHOLD) {
            if (direction === DIRECTION_RIGHT) {
                this.selectNextSibling();
            } else {
                this.selectPreviousSibling();
            }
            event.preventDefault();
        }
        this.swipeXStart = 0;
    }
}
