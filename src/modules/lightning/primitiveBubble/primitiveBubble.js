/* eslint-disable @lwc/lwc/no-api-reassignments */

import { api, track } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet } from 'lightning/utils';

const DEFAULT_ALIGN = {
    horizontal: 'left',
    vertical: 'bottom',
};

// Set to px units for easier calculation
const POPOVER_MIN_HEIGHT = 32;

const DEFAULT_INVISIBLE_DIV_STYLES = {
    height: '1rem',
    position: 'absolute',
    left: '0',
    marginLeft: '0',
};

export default class LightningPrimitiveBubble extends LightningShadowBaseClass {
    @track
    state = {
        // tracks the `visibility` of the tooltip
        visible: false,
        // tracks the `display` of the tooltip
        hidden: true,
        contentId: '',
    };

    /*
        Tooltip manages the visibility state of the PrimitiveBubble element
        to ensure there are no differences beteween TooltipLibrary._visible and
        LightningPrimitiveBubble.state.visible. See @W-12512833
    */
    @api disableVisibilityChangeOnLeave;

    @api
    get contentId() {
        return this.state.contentId;
    }

    set contentId(value) {
        this.state.contentId = value;

        if (this.state.inDOM) {
            this.divEl.setAttribute('id', this.state.contentId);
        }
    }

    connectedCallback() {
        super.connectedCallback();
        this.setAttribute('role', 'tooltip');
        this.setAttribute('aria-hidden', true);
        this.state.inDOM = true;
    }

    disconnectedCallback() {
        this.state.inDOM = false;
    }

    renderedCallback() {
        // set content manually once rendered
        // - this is required to avoid the content update being in the wrong 'tick'
        this.setContentManually();
        this.setIdManually();
        this.createInvisibleDivManually();
    }

    set content(value) {
        this.state.content = value;

        if (this.state.inDOM) {
            this.setContentManually();
        }
    }

    @api
    get content() {
        return this.state.content || '';
    }

    @api
    get align() {
        return this.state.align || DEFAULT_ALIGN;
    }
    set align(value) {
        this.state.align = value;
    }

    @api
    get visible() {
        return this.state.visible;
    }

    set visible(value) {
        this.state.visible = value;

        if (this.state.visible) {
            // Show the tooltip before css animation
            this.state.hidden = false;
        }
        if (this.state.hidden) {
            this.setAttribute('aria-hidden', true);
        } else {
            this.removeAttribute('aria-hidden');
        }
    }

    handleTransitionEnd() {
        // Hide the tooltip after css animation
        if (!this.state.visible) {
            this.state.hidden = true;
            this.setAttribute('aria-hidden', true);
        }
    }

    setIdManually() {
        this.setAttribute('id', this.state.contentId);
    }

    // manually set the content value
    setContentManually() {
        /* manipulate DOM directly */
        this.template.querySelector('.slds-popover__body').textContent =
            this.state.content;
    }

    // manually create <div>, add positional styling, and append as child to bubble
    createInvisibleDivManually() {
        if (this.state.visible) {
            // for native shadow, we need to get styles from popover parent and append
            // to popover body so that it is added/removed from DOM depending on tooltip visibility
            const popoverParent = this.template.querySelector('.slds-popover');
            const popoverBody = this.template.querySelector(
                '.slds-popover__body'
            );
            const invisibleDiv = document.createElement('div');
            const { vertical } = this.align;

            let computedStyle = null;
            if (window && popoverParent && popoverBody) {
                computedStyle = window.getComputedStyle(popoverParent);
                invisibleDiv.style.width =
                    computedStyle.getPropertyValue('width');

                /*
                    Position the <div> based on vertical alignment of tooltip.
                    When vertically aligned to the bottom (nubbin below tooltip), position the <div> to
                    the max of the popover min-height or the popover offset height. This is necessary so that
                    it always positions right below the popover, so that changes to line-height or other
                    distance related properties do not affect the positioning.
                */
                if (vertical === 'bottom') {
                    invisibleDiv.style.top =
                        Math.max(
                            POPOVER_MIN_HEIGHT,
                            popoverParent.offsetHeight
                        ) + 'px';
                    invisibleDiv.style.height =
                        DEFAULT_INVISIBLE_DIV_STYLES.height;
                } else {
                    /* add a little bit of offset to move the <div> closer to the target, that way the mouse
                     doesn't move into the small white space between the target and <div>, which would flicker the tooltip
                    */
                    invisibleDiv.style.top = '-1.1rem';
                    invisibleDiv.style.height = '1.125rem';
                }
            }

            invisibleDiv.style.position = DEFAULT_INVISIBLE_DIV_STYLES.position;
            invisibleDiv.style.left = DEFAULT_INVISIBLE_DIV_STYLES.left;
            invisibleDiv.style.marginLeft =
                DEFAULT_INVISIBLE_DIV_STYLES.marginLeft;

            popoverBody.appendChild(invisibleDiv);
        }
    }

    // compute class value for this bubble
    get computedPopoverClass() {
        const classes = classSet('slds-popover')
            .add('slds-popover_tooltip')
            .add('fix-popover_tooltip_alignment'); // fix for W-11677142

        // show or hide bubble
        classes.add({
            'slds-rise-from-ground': this.visible,
            'slds-fall-into-ground': !this.visible,
            'slds-hide': this.state.hidden,
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
            'slds-nubbin_bottom':
                horizontal === 'center' && vertical === 'bottom',
            'slds-nubbin_top': horizontal === 'center' && vertical === 'top',
            'slds-nubbin_left': horizontal === 'left' && vertical === 'center',
            'slds-nubbin_right':
                horizontal === 'right' && vertical === 'center',
        });

        return classes.toString();
    }

    handleMouseLeave() {
        /**
         * This causes a number of issues when primitive-bubble is managed through tooltipLibrary, due to the fact
         * that changing the visibility inside the primitive bubble creates a mismatch with the tooltipLibrary Tooltip._visible state.
         * This contributes to a number of problems and can result in the tooltip being made visible again in unwanted situations.
         * (W-12512833). Remove this completely if no longer required by other consumers.
         */
        if (!this.disableVisibilityChangeOnLeave) {
            this.visible = false;
        }
    }
}
