import { api } from 'lwc';
import { classSet } from 'lightning/utils';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { isUndefinedOrNull } from 'lightning/utilsPrivate';
import labelProgressRing from '@salesforce/label/LightningProgressRing.progressRing';
import labelWarningAltText from '@salesforce/label/LightningProgressRing.warning';
import labelExpiredAltText from '@salesforce/label/LightningProgressRing.expired';
import labelCompleteAltText from '@salesforce/label/LightningProgressRing.complete';

const i18n = {
    progress: labelProgressRing,
    warning: labelWarningAltText,
    expired: labelExpiredAltText,
    complete: labelCompleteAltText,
};

/**
 * Progress head SVG element viewBox attribute is set as '-1 -1 2 2', hence viewbox height is 2 units
 */
export const PROGRESS_HEAD_VIEWBOX_HEIGHT = 2;

/**
 * Displays a circular progress indicator to provide feedback about an action or process.
 * This component requires API version 48.0 and later.
 */
export default class progressRing extends LightningShadowBaseClass {
    /**
     * The percentage value of the progress ring. The value must be a number from 0 to 100.
     * A value of 50 corresponds to a color fill of half the ring in a clockwise
     * or counterclockwise direction, depending on the direction attribute.
     * @type {number}
     * @default 0
     */
    @api value = 0;

    /**
     * Changes the appearance of the progress ring.
     * Accepted variants include base, active-step, warning, expired, base-autocomplete.
     *
     * @type {string}
     * @default 'base'
     */
    @api variant = 'base';

    /**
     * Controls which way the color flows from the top of the ring, either clockwise or counterclockwise
     * Valid values include fill and drain. The fill value corresponds to a color flow in the clockwise direction.
     * The drain value indicates a color flow in the counterclockwise direction.
     *
     * @type {string}
     * @default 'fill'
     */
    @api direction = 'fill';

    /**
     * Descriptive label provided for assistive technologies.
     * @type {string}
     */
    @api ariaLabel;

    /**
     * The size of the progress ring. Valid values include medium and large.
     *
     * @type {string}
     * @default 'medium'
     */
    @api size = 'medium';

    arcY = 0;
    arcX = 0;
    radiusOfCircularMotionForProgressHead = 0;

    isRendered = false;

    /**
     * Calculates the radius along which to rotate the SVG circle element present inside
     * ".slds-progress-ring__progress-head" container element.
     */
    calculateRadiusOfCircularMotionForProgressHead() {
        const progressHeadContainerHeight = parseFloat(
            getComputedStyle(
                this.template.querySelector(
                    '.slds-progress-ring__progress-head'
                )
            ).height
        );
        const progressArcContainerHeight = parseFloat(
            getComputedStyle(
                this.template.querySelector('.slds-progress-ring__progress')
            ).height
        );
        const progressContentContainerHeight = parseFloat(
            getComputedStyle(
                this.template.querySelector('.slds-progress-ring__content')
            ).height
        );
        // NOTE:- The progress-head SVG viewbox attribute is set as '-1 -1 2 2', which means the "2" units
        // height and width of viewbox would correspond to the actual height/width of the SVG in pixels.
        // ex:- If the SVG's actual widthxheight in pixels is 32x32, then inside the viewbox the "32px" would
        // correspond to "2" units. This means the viewbox scales down lengths to it's own units between 0 and 2.
        // So to work with actual lengths in pixels inside the viewbox, you have to first convert the pixel length
        // to "viewbox length" units.
        // ex:- Continuing from previous example, If 32px is 2 units inside viewbox, how many units is 24px?
        // it will be 24 * (2 / 32).
        // Therefore, you need a "length scaling factor" to find the "viewbox length" for a given pixel length. The
        // (2 / 32) in the previous example is the "length scaling factor"
        const lengthScalingFactorInProgressHeadViewBox =
            PROGRESS_HEAD_VIEWBOX_HEIGHT / progressHeadContainerHeight;
        const radiusOfProgressArcInPixels = progressArcContainerHeight / 2;
        const radiusOfProgressArcInProgressHeadViewBox =
            radiusOfProgressArcInPixels *
            lengthScalingFactorInProgressHeadViewBox;

        // Note:- The progress-content container element partially overlaps the progress-arc container
        // element like a concentric circle inside another circle. So the width of the progress arc that is visible to the user
        // is equal to the length of the non-overlapping part between them.
        const radiusOfProgressContentInPixels =
            progressContentContainerHeight / 2;
        const widthOfArcInPixels =
            radiusOfProgressArcInPixels - radiusOfProgressContentInPixels;
        const widthOfArcInProgressHeadViewBox =
            widthOfArcInPixels * lengthScalingFactorInProgressHeadViewBox;

        // Note:- Here the intent is to move the progress-head circle svg element
        // along the midpoint of the progress arc width.
        this.radiusOfCircularMotionForProgressHead =
            radiusOfProgressArcInProgressHeadViewBox -
            widthOfArcInProgressHeadViewBox / 2;
    }

    renderedCallback() {
        if (this.isRendered) {
            return;
        }
        this.calculateRadiusOfCircularMotionForProgressHead();
        this.isRendered = true;
    }

    get progressHeadCenter() {
        // Note:- Formula is x = radius * Cosine(theta), y = radius * Sine(theta), and here
        // arcX = Cosine(theta), arcY = Sine(theta) calculated already in the method "get d()"
        const x = this.arcX * this.radiusOfCircularMotionForProgressHead;
        const y = this.arcY * this.radiusOfCircularMotionForProgressHead;
        return {
            x,
            y,
        };
    }

    get isProgressHeadVisible() {
        if (this.value > 0 && this.value < 100) {
            return true;
        }
        return false;
    }

    get d() {
        const fillPercent = this.value / 100;
        const filldrain = this.direction === 'drain' ? 1 : 0;
        const inverter = this.direction === 'drain' ? 1 : -1;
        const islong = fillPercent > 0.5 ? 1 : 0;

        const subCalc = 2 * Math.PI * fillPercent;

        // Note:- The formula is x = radius * Cosine(theta), y = radius * Sine(theta) with appropriate signs (+ / -), and
        // here the radius is 1 unit implicitly as per the svg's viewBox attribute.
        this.arcX = Math.cos(subCalc);
        this.arcY = Math.sin(subCalc) * inverter;

        return `M 1 0 A 1 1 0 ${islong} ${filldrain} ${this.arcX} ${this.arcY} L 0 0`;
    }

    get iconSvg() {
        if (this.variant === 'warning') {
            return 'M23.7 19.6L13.2 2.5c-.6-.9-1.8-.9-2.4 0L.3 19.6c-.7 1.1 0 2.6 1.1 2.6h21.2c1.1 0 1.8-1.5 1.1-2.6zM12 18.5c-.8 0-1.4-.6-1.4-1.4s.6-1.4 1.4-1.4 1.4.6 1.4 1.4-.6 1.4-1.4 1.4zm1.4-4.2c0 .3-.2.5-.5.5h-1.8c-.3 0-.5-.2-.5-.5v-6c0-.3.2-.5.5-.5h1.8c.3 0 .5.2.5.5v6z';
        }
        if (this.variant === 'expired') {
            return 'M12 .9C5.9.9.9 5.9.9 12s5 11.1 11.1 11.1 11.1-5 11.1-11.1S18.1.9 12 .9zM3.7 12c0-4.6 3.7-8.3 8.3-8.3 1.8 0 3.5.5 4.8 1.5L5.2 16.8c-1-1.3-1.5-3-1.5-4.8zm8.3 8.3c-1.8 0-3.5-.5-4.8-1.5L18.8 7.2c1 1.3 1.5 3 1.5 4.8 0 4.6-3.7 8.3-8.3 8.3z';
        }
        if (this.isComplete) {
            return 'M8.8 19.6L1.2 12c-.3-.3-.3-.8 0-1.1l1-1c.3-.3.8-.3 1 0L9 15.7c.1.2.5.2.6 0L20.9 4.4c.2-.3.7-.3 1 0l1 1c.3.3.3.7 0 1L9.8 19.6c-.2.3-.7.3-1 0z';
        }
        return undefined;
    }

    get i18n() {
        return i18n;
    }

    get computedAltText() {
        if (this.variant === 'warning') {
            return this.i18n.warning;
        }
        if (this.variant === 'expired') {
            return this.i18n.expired;
        }
        if (this.isComplete) {
            return this.i18n.complete;
        }
        return undefined;
    }

    get computedOuterClass() {
        return classSet('slds-progress-ring').add({
            'slds-progress-ring_large': this.size === 'large',
            'slds-progress-ring_warning': this.variant === 'warning',
            'slds-progress-ring_expired': this.variant === 'expired',
            'slds-progress-ring_active-step': this.variant === 'active-step',
            'slds-progress-ring_complete': this.isComplete,
        });
    }

    get computedIconTheme() {
        return classSet('slds-icon_container').add({
            'slds-icon-utility-warning': this.variant === 'warning',
            'slds-icon-utility-error': this.variant === 'expired',
            'slds-icon-utility-success': this.isComplete,
        });
    }

    get isComplete() {
        return (
            this.variant === 'base-autocomplete' && Number(this.value) === 100
        );
    }

    get computeAriaLabel() {
        return isUndefinedOrNull(this.ariaLabel)
            ? i18n.progress
            : this.ariaLabel;
    }
}
