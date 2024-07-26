import { api, track } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet, formatLabel } from 'lightning/utils';
import { isCSR } from 'lightning/utilsPrivate';
import pathCurrentStage from '@salesforce/label/LightningProgressIndicator.pathCurrentStage';
import {
    getStepIndex,
    getCurrentStepIndex,
    computeProgressValue,
} from './utils';
import base from './base.html';
import path from './path.html';
import progressIndicatorStylesheets from './progressIndicator.css';

const i18n = {
    currentStageLabel: pathCurrentStage,
};

const STATE_COMPLETED = 'completed';
const STATE_CURRENT = 'current';
const STATE_INCOMPLETE = 'incomplete';
const STATE_ERROR = 'error';

const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;

/**
 * Provides a visual indication on the progress of a particular process.
 * @slot default Placeholder for lightning-progress-step.
 */
export default class LightningProgressIndicator extends LightningShadowBaseClass {
    static stylesheets = [progressIndicatorStylesheets]; // stylesheets that apply to every rendered template

    /**
     * Changes the visual pattern of the indicator. Valid values are base and path.
     * The default is base.
     * @type {string}
     * @default base
     */
    @api type = 'base';

    /**
     * Changes the appearance of the progress indicator for the base type only.
     * Valid values are base or shade. The shade variant adds a light gray border to the step indicators.
     * The default is base.
     * @type {string}
     * @default base
     */
    @api variant = 'base';

    /**
     * Set current-step to match the value attribute of one of progress-step components.
     * If current-step is not provided, the value of the first progress-step component is used.
     * @type {string}
     */
    @api
    get currentStep() {
        return this.privateCurrentStep;
    }

    set currentStep(value) {
        this.privateCurrentStep = value;
        if (this.privateRendered) {
            this.updateSteps(value);
        }
    }

    /**
     * getter for the i18 constant containing the localized strings
     */
    get i18n() {
        return i18n;
    }

    get currentStepLabel() {
        return formatLabel(this.i18n.currentStageLabel, this._currentStepLabel);
    }

    /**
     * If present, the current step is in error state and an error icon is displayed on the step indicator.
     * Only the base type can display errors.
     * @type {boolean}
     * @default false
     */
    @api hasError = false;

    privateStepHandlers = {};

    @track privateProgressValue = 0;
    @track privateTooltipHidden = true;
    @track privateTooltipLabel;

    privateActiveStepIndex;
    privateTooltipElement;

    privateRendered = false;
    privateCurrentStep;
    _currentStepLabel = '';

    connectedCallback() {
        super.connectedCallback();
        if (isCSR) {
            this.addEventListener(
                'privateregisterstep',
                this.handlePrivateRegisterStep.bind(this)
            );
        }
    }

    renderedCallback() {
        this.privateRendered = true;
        // Avoid a timing issue due to LWC v6's native custom element lifecycle:
        // https://github.com/salesforce/lwc/releases/v6.0.0#new-timing
        // updateSteps needs to occur after progressSteps's 'privateregisterstep' event is fired
        // from its connectedCallback
        Promise.resolve().then(() => {
            this.updateSteps();
        });
    }

    handleSlotChange() {
        this.updateSteps();
    }

    // Added `shouldFocus` as fix for W-9862373
    updateSteps(activeStep, shouldFocus) {
        const steps = this.getSteps();
        const { privateStepHandlers, type, hasError, currentStep } = this;
        const currentStepIndex = getCurrentStepIndex(steps, currentStep);
        this._currentStepLabel = steps[currentStepIndex]?.label;

        let activeStepIndex = -1;
        // Set activeStepIndex to activeStep if provided.
        // This happens when focus is updated by user using arrow keys or clicking a progress step.
        // When component re-renders, active step is not passed from renderedCallback or handleSlotChange
        // In this scenario, use the privateActiveStepIndex to maintain the activeStep.
        // privateActiveStepInde will have the active step before the re-render
        // In case of initial render, privateActiveStepIndex is undefined. Use privateCurrentStep as activeStepIndex for fallback.
        // activeStep is needed to set active class and proper tabIndex for the progress step
        if (activeStep) {
            activeStepIndex = getStepIndex(steps, activeStep);
        } else if (this.privateActiveStepIndex !== undefined) {
            activeStepIndex = this.privateActiveStepIndex;
        } else {
            activeStepIndex = getStepIndex(steps, this.privateCurrentStep);
        }

        this.privateActiveStepIndex = activeStepIndex;

        // cast 'steps' NodeList to an Array for crossbrowser compatibility
        const stepsArray = Array.prototype.slice.call(steps);

        stepsArray.forEach((step, index) => {
            const stepName = step.value;
            const isActive = index === this.privateActiveStepIndex;

            if (index < currentStepIndex) {
                privateStepHandlers[stepName](
                    STATE_COMPLETED,
                    type,
                    index,
                    isActive,
                    shouldFocus
                );
            } else if (index === currentStepIndex) {
                const state = hasError ? STATE_ERROR : STATE_CURRENT;
                privateStepHandlers[stepName](
                    state,
                    type,
                    index,
                    isActive,
                    shouldFocus
                );
            } else {
                privateStepHandlers[stepName](
                    STATE_INCOMPLETE,
                    type,
                    index,
                    isActive,
                    shouldFocus
                );
            }
        });

        if (this.isBase) {
            this.privateProgressValue = computeProgressValue(
                steps,
                currentStepIndex
            );
        }
    }

    isActive(stepName) {
        return this.currentStep === stepName;
    }

    getSteps() {
        return Array.from(this.querySelectorAll('lightning-progress-step'));
    }

    handlePrivateRegisterStep(event) {
        const { stepName, callback } = event.detail;
        this.privateStepHandlers[stepName] = callback;
    }

    handleStepFocus(event) {
        if (!this.isBase) {
            this.updateActiveStepStatus(event.target);
        }
    }

    handleStepKeyDown(event) {
        if (this.privateActiveStepIndex >= 0) {
            const steps = this.getSteps();

            switch (event.keyCode) {
                case UP:
                case LEFT:
                    if (this.privateActiveStepIndex - 1 >= 0) {
                        this.updateSteps(
                            steps[this.privateActiveStepIndex - 1].value,
                            true // Set shouldFocus to true to focus on nthe updated progress step
                        );
                    }
                    break;
                case DOWN:
                case RIGHT:
                    if (this.privateActiveStepIndex + 1 < steps.length) {
                        this.updateSteps(
                            steps[this.privateActiveStepIndex + 1].value,
                            true // Set shouldFocus to true to focus on nthe updated progress step
                        );
                    }
                    break;
                default:
                    break;
            }
        }
    }

    get computedWrapperClass() {
        return classSet('slds-progress').add({
            'slds-progress_shade': this.variant === 'shade',
        });
    }

    get computedTooltipClass() {
        return classSet(
            'slds-popover slds-popover_tooltip slds-nubbin_bottom slds-is-absolute'
        ).add({
            'slds-hidden': this.privateTooltipHidden,
        });
    }

    updateActiveStepStatus(activeStep) {
        if (this.currentStep !== activeStep) {
            this.updateSteps(activeStep.value);
        }
    }

    get isBase() {
        return this.type === 'base';
    }

    render() {
        if (this.isBase) {
            return base;
        }
        return path;
    }
}
