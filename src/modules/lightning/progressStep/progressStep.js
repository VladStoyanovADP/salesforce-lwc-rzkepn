import labelCurrentStage from '@salesforce/label/LightningProgressIndicator.currentStage';
import labelStageComplete from '@salesforce/label/LightningProgressIndicator.stageComplete';
import labelNotStartedStage from '@salesforce/label/LightningProgressIndicator.stageNotStarted';
import labelErrorStage from '@salesforce/label/LightningProgressIndicator.errorStage';
import { api, track } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet, formatLabel } from 'lightning/utils';
import { classListMutation, isCSR } from 'lightning/utilsPrivate';
import { Tooltip, TooltipType, Direction } from 'lightning/tooltipLibrary';
import path from './path.html';
import base from './base.html';
import progressStepStylesheets from './progressStep.css';

// Temporary workaround until we get real label support. New label entries must
// also be added to the static `labels` prop inside the class.
// https://git.soma.salesforce.com/raptor/raptor/issues/196
const i18n = {
    currentStage: labelCurrentStage,
    stageComplete: labelStageComplete,
    notStartedStage: labelNotStartedStage,
    errorStage: labelErrorStage,
};

// Maps the status of the base progress-step to the icon it should render
const baseIconNameMap = {
    completed: 'utility:success',
    error: 'utility:error',
};

/**
 * Defines a step in the lightning-progress-indicator.
 */
export default class LightningProgressStep extends LightningShadowBaseClass {
    static stylesheets = [progressStepStylesheets]; // stylesheets that apply to every rendered template
    static validationOptOut = ['class'];

    /**
     * Text string to reference the step of the progress indicator.
     * @type {string}
     */
    @api value;

    _privateLabel;

    @track state = {};

    /**
     * getter for the i18 constant containing the localized strings
     */
    get i18n() {
        return i18n;
    }

    updateInternal(newStatus, newType, newIndex, newActive, shouldFocus) {
        classListMutation(
            this.classList,
            this.computeClassSet(newType, newStatus, newActive)
        );
        // Added `shouldFocus` as fix for W-9862373
        // This ensures progressStep is focused only when this argument is true.
        if (newActive === true && shouldFocus) {
            this.focusPathLink();
        }
        this.state.status = newStatus;
        this.state.type = newType;
        this.state.index = newIndex;
        this.state.active = newActive;
        this.initializeTooltip();
        // Ensures correct role gets added to respective variants of progress-indicator
        // Path - presentation, Base - listitem
        this.setAttribute('role', this.isPath ? 'presentation' : 'listitem');
    }
    /**
     * Text to display as the name or tooltip for the step.
     * @type {string}
     */
    @api
    set label(value) {
        this._privateLabel = value;
        this.initializeTooltip();
    }

    get label() {
        return this._privateLabel;
    }

    computeClassSet(type, status, isActive) {
        const isPath = type === 'path';
        return classSet({
            'slds-progress__item': !isPath,
            'slds-is-completed': !isPath && status === 'completed',
            'slds-has-error': !isPath && status === 'error',
            'slds-is-active':
                (isPath && isActive === true) ||
                (type === 'base' && status === 'current'),
            'slds-path__item': isPath,
            'slds-is-complete': isPath && status === 'completed',
            'slds-is-current':
                isPath && (status === 'error' || status === 'current'),
            'slds-is-incomplete': isPath && status === 'incomplete',
        });
    }

    connectedCallback() {
        super.connectedCallback();
        if (isCSR) {
            this.dispatchEvent(
                new CustomEvent('privateregisterstep', {
                    bubbles: true,
                    detail: {
                        callback: this.updateInternal.bind(this),
                        stepName: this.value,
                        setDeRegistrationCallback: (deRegistrationCallback) => {
                            this._deRegistrationCallback =
                                deRegistrationCallback;
                        },
                    },
                })
            );
        }
    }

    disconnectedCallback() {
        if (this._deRegistrationCallback) {
            this._deRegistrationCallback();
        }
        if (this._tooltip) {
            this._tooltip.disconnect();
        }
    }

    renderedCallback() {
        if (this._tooltip && !this._tooltip.initialized) {
            this._tooltip.initialize();
        }
    }

    get computedBaseStepClass() {
        const classes = classSet('slds-progress__marker');
        if (this.hasIcon) {
            classes
                .add('slds-progress__marker')
                .add('slds-progress__marker_icon')
                .add('slds-icon__container');
        }
        return classes.toString();
    }

    get hasIcon() {
        return (
            this.state.status === 'completed' || this.state.status === 'error'
        );
    }

    get baseIconName() {
        return baseIconNameMap[this.state.status];
    }

    get isPath() {
        return this.state.type === 'path';
    }

    get ariaSelected() {
        return this.state.active === true ? 'true' : 'false';
    }

    get tabIndex() {
        return this.state.active === true ? 0 : -1;
    }

    get assistiveText() {
        if (this.state.status === 'completed') {
            return formatLabel(this.i18n.stageComplete, this.label);
        } else if (this.state.status === 'current') {
            return formatLabel(this.i18n.currentStage, this.label);
        } else if (this.state.status === 'incomplete') {
            return formatLabel(this.i18n.notStartedStage, this.label);
        } else if (this.state.status === 'error') {
            return formatLabel(this.i18n.errorStage, this.label);
        }
        return this.state.type === 'path' ? '' : this.label;
    }

    handleMouseEnter() {
        this.dispatchEvent(
            // eslint-disable-next-line lightning-global/no-custom-event-bubbling
            new CustomEvent('stepmouseenter', {
                bubbles: true,
                detail: { index: this.state.index },
            })
        );
    }

    handleMouseLeave() {
        this.dispatchEvent(
            // eslint-disable-next-line lightning-global/no-custom-event-bubbling
            new CustomEvent('stepmouseleave', {
                bubbles: true,
                detail: { index: this.state.index },
            })
        );
    }

    handleFocus() {
        this.dispatchEvent(
            // eslint-disable-next-line lightning-global/no-custom-event-bubbling
            new CustomEvent('stepfocus', {
                bubbles: true,
                detail: { index: this.state.index },
            })
        );
    }

    handleBlur() {
        this.dispatchEvent(
            // eslint-disable-next-line lightning-global/no-custom-event-bubbling
            new CustomEvent('stepblur', {
                bubbles: true,
                detail: { index: this.state.index },
            })
        );
    }

    focusPathLink() {
        const pathLink = this.template.querySelector('a.slds-path__link');
        if (pathLink) {
            pathLink.focus();
        }
    }

    render() {
        if (this.isPath) {
            return path;
        }
        return base;
    }

    initializeTooltip() {
        if (this._tooltip) {
            this._tooltip.value = this._privateLabel;
        } else if (this._privateLabel && this.state.type && !this.isPath) {
            // Note that because the tooltip target is a child element it may not be present in the
            // dom during initial rendering.
            if (isCSR) {
                this._tooltip = new Tooltip(this._privateLabel, {
                    root: this,
                    target: () => this.template.querySelector('div'),
                    type: TooltipType.Toggle,
                    align: {
                        horizontal: Direction.Center,
                        vertical: Direction.Bottom,
                    },
                    targetAlign: {
                        horizontal: Direction.Center,
                        vertical: Direction.Top,
                    },
                    disableAriaDescribedBy: true,
                });
                this._tooltip.initialize();
            }
        }
    }
}
