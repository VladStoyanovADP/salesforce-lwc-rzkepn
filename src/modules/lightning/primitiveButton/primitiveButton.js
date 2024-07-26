import { api, track } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import {
    isIE11,
    isCSR,
    normalizeBoolean,
    normalizeString,
    buttonGroupOrderClass,
} from 'lightning/utilsPrivate';
import { classSet } from 'lightning/utils';
import AriaObserver from 'lightning/ariaObserver';

const BUTTON = 'button';
const ROLE = 'role';

/**
 * Primitive for button, buttonIcon and buttonIconStateful
 * We try to have those components to set their aria attributes on their template as much as possible
 * to avoid setting those manually, however there are a few instances
 * in which manual setting is still required:
 *
 *  - aria-disabled: Since it dependes on the disabled state, which is controlled by primitive button.
 *  - aria-controls: Abstracts the logic of setting the id-reference on the host element
 *  - aria-cetails: Role that depeneds on AriaObserver for native shadow.
 *  - aria-describedBy: Role that depeneds on AriaObserver for native shadow.
 *  - aria-flowTo: Abstracts the logic of setting the id-reference on the host element.
 *  - aria-labelledby: Role that depeneds on AriaObserver for native shadow.
 *  - aria-owns: Abstracts the logic of setting the id-reference on the host element.
 */
export default class LightningPrimitiveButton extends LightningShadowBaseClass {
    /**** COMPONENT PRIVATE PROPERTIES ****/
    _initialized = false;

    @track
    state = {
        ariaAtomic: null,
        ariaBusy: null,
        ariaControls: null,
        ariaDetails: null,
        ariaDescribedBy: null,
        ariaExpanded: null,
        ariaFlowTo: null,
        ariaHasPopup: null,
        ariaHidden: null,
        ariaLabelledBy: null,
        ariaLive: null,
        ariaOwns: null,
        ariaPressed: null,
        ariaRelevant: null,
        disabled: false,
    };

    originalAriaAtomic;
    originalAriaBusy;
    originalAriaControls;
    originalAriaDetails;
    originalAriaDescribedBy;
    originalAriaExpanded;
    originalAriaFlowTo;
    originalAriaHasPopup;
    originalAriaHidden;
    originalAriaLabelledBy;
    originalAriaLive;
    originalAriaOwns;
    originalAriaPressed;
    originalAriaRelevant;
    originalDisabledValue;

    /**** COMPONENT PUBLIC APIS ****/
    /**
     * Specifies whether this button should be displayed in a disabled state.
     * Disabled buttons can't be clicked. This value defaults to false.
     *
     * @type {boolean}
     * @default false
     */
    @api
    set disabled(value) {
        this.originalDisabledValue = value;
        this.state.disabled = normalizeBoolean(value);
    }

    get disabled() {
        return this.state.disabled;
    }

    /**
     * Specifies a shortcut key to activate or focus an element.
     *
     * @type {string}
     */
    @api accessKey;

    /**
     * Displays tooltip text when the mouse cursor moves over the element.
     *
     * @type {string}
     */
    @api title;

    /**
     * Label describing the button to assistive technologies.
     *
     * @type {string}
     */
    @api ariaLabel;

    /**
     * Specifies the ID or list of IDs of the element or elements that
     * contain visible descriptive text to describe the button.
     */
    @api
    set ariaLabelledBy(value) {
        this.originalAriaLabelledBy = value;
        this.ariaObserver.connect({
            targetSelector: 'button',
            attribute: 'aria-labelledby',
            relatedNodeIds: value,
        });
    }

    get ariaLabelledBy() {
        return this.originalAriaLabelledBy;
    }

    /**
     * A space-separated list of element IDs that provide descriptive labels for the button.
     *
     * @type {string}
     */
    @api
    set ariaDescribedBy(value) {
        this.originalAriaDescribedBy = value;
        this.ariaObserver.connect({
            targetSelector: 'button',
            attribute: 'aria-describedby',
            relatedNodeIds: value,
        });
    }

    get ariaDescribedBy() {
        return this.originalAriaDescribedBy;
    }

    /**
     * A space-separated list of element IDs whose presence or content is controlled by this button.
     *
     * @type {string}
     */
    @api
    set ariaControls(value) {
        this.originalAriaControls = value;
        this.setAttribute('aria-controls', value);
        this.setHostRoleAttribute(BUTTON);
    }

    get ariaControls() {
        return this.originalAriaControls;
    }

    /**
     * A space-separated list of element IDs whose presence or content is controlled by this button.
     *
     * @type {string}
     */
    @api
    set ariaOwns(value) {
        this.originalAriaOwns = value;
        this.setAttribute('aria-owns', value);
        this.setHostRoleAttribute(BUTTON);
    }

    get ariaOwns() {
        return this.originalAriaOwns;
    }

    /**
     * A space-separated list of element IDs whose presence or content is controlled by this button.
     *
     * @type {string}
     */
    @api
    set ariaDetails(value) {
        this.originalAriaDetails = value;
        this.setAttribute('aria-details', value);
        this.setHostRoleAttribute(BUTTON);
    }

    get ariaDetails() {
        return this.originalAriaDetails;
    }

    /**
     * A space-separated list of element IDs whose presence or content is controlled by this button.
     *
     * @type {string}
     */
    @api
    set ariaFlowTo(value) {
        this.originalAriaFlowTo = value;
        this.setAttribute('aria-flowto', value);
        this.setHostRoleAttribute(BUTTON);
    }

    get ariaFlowTo() {
        return this.originalAriaFlowTo;
    }

    /**
     * Indicates whether an element that the button controls is expanded or collapsed.
     * Valid values are 'true' or 'false'. The default value is undefined.
     *
     * @type {string}
     * @default undefined
     */
    @api
    get ariaExpanded() {
        return this.originalAriaExpanded;
    }

    set ariaExpanded(value) {
        this.originalAriaExpanded = value;
        this.state.ariaExpanded = normalizeString(value, {
            fallbackValue: null,
            validValues: ['true', 'false'],
        });
    }

    get computedAriaExpanded() {
        return this.state.ariaExpanded;
    }

    /**
     * Indicates the current "pressed" state of toggle buttons.
     * Valid values are 'true' or 'false'. The default value is undefined.
     *
     * @type {string}
     * @default undefined
     */
    @api
    set ariaPressed(value) {
        this.originalAriaPressed = value;
        this.state.ariaPressed = normalizeString(value, {
            fallbackValue: null,
            validValues: ['true', 'false'],
        });
    }

    get ariaPressed() {
        return this.originalAriaPressed;
    }

    get computedAriaPressed() {
        return this.state.ariaPressed;
    }

    /**
     * Indicates whether an element that the button controls is expanded or collapsed.
     * Valid values are 'true' or 'false'. The default value is undefined.
     *
     * @type {string}
     * @default undefined
     */
    @api
    set ariaHidden(value) {
        this.originalAriaHidden = value;
        this.state.ariaHidden = normalizeString(value, {
            fallbackValue: null,
            validValues: ['true', 'false'],
        });
    }

    get ariaHidden() {
        return this.originalAriaHidden;
    }

    get computedAriaHidden() {
        return this.state.ariaHidden;
    }

    /**
     * Indicates the element that represents the current item within a container or set of related elements.
     * For example:
     *   - A page token used to indicate a link within a set of pagination links, where the link is visually styled to
     *   represent the currently-displayed page.
     *   - A step token used to indicate a link within a step indicator for a step-based process, where
     *   the link is visually styled to represent the current step.
     *   - A location token used to indicate the image that is visually highlighted as the current component
     *   of a flow chart.
     *   - A date token used to indicate the current date within a calendar.
     *   - A time token used to indicate the current time within a timetable.
     *
     * @type {string}
     * @default undefined
     */
    @api ariaCurrent;

    /**
     * Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element.
     *
     * @type {string}
     * @default undefined
     */
    @api ariaKeyShortcuts;

    /**
     * Indicates that the button has an interactive popup element.
     * Valid values are 'true', 'dialog', 'menu', 'listbox', 'tree', and 'grid' based on ARIA 1.1 specifications.
     * The default value is undefined.
     *
     * @type {string}
     * @default undefined
     */
    @api
    set ariaHasPopup(value) {
        this.originalAriaHasPopup = value;
        this.state.ariaHasPopup = normalizeString(value, {
            fallbackValue: null,
            validValues: ['true', 'dialog', 'menu', 'listbox', 'tree', 'grid'],
        });
    }

    get ariaHasPopup() {
        return this.originalAriaHasPopup;
    }

    get computedAriaHasPopup() {
        return this.state.ariaHasPopup;
    }

    /**
     * Indicates that the button has an interactive popup element.
     * Valid values are 'true', 'dialog', 'menu', 'listbox', 'tree', and 'grid' based on ARIA 1.1 specifications.
     * The default value is undefined.
     *
     * @type {string}
     * @default undefined
     */
    @api
    set ariaRelevant(value) {
        this.originalAriaRelevant = value;
        this.state.ariaRelevant = normalizeString(value, {
            fallbackValue: null,
            validValues: ['additions', 'removals', 'text', 'all'],
        });
    }

    get ariaRelevant() {
        return this.originalAriaRelevant;
    }

    get computedAriaRelevant() {
        return this.state.ariaRelevant;
    }

    /**
     * Indicates that the button can be updated when it doesn't have focus.
     * Valid values are 'polite', 'assertive', or 'off'. The polite value causes assistive
     * technologies to notify users of updates at a low priority, generally without interrupting.
     * The assertive value causes assistive technologies to notify users immediately,
     * potentially clearing queued speech updates.
     *
     * @type {string}
     */
    @api
    set ariaLive(value) {
        this.originalAriaLive = value;
        this.state.ariaLive = normalizeString(value, {
            fallbackValue: null,
            validValues: ['polite', 'assertive', 'off'],
        });
    }

    get ariaLive() {
        return this.originalAriaLive;
    }

    get computedAriaLive() {
        return this.state.ariaLive;
    }

    /**
     * Indicates whether assistive technologies present all, or only parts of,
     * the changed region. Valid values are 'true' or 'false'.
     *
     * @type {string}
     */
    @api
    set ariaAtomic(value) {
        this.originalAriaAtomic = value;
        this.state.ariaAtomic = normalizeString(value, {
            fallbackValue: null,
            validValues: ['true', 'false'],
        });
    }

    get ariaAtomic() {
        return this.originalAriaAtomic;
    }

    get computedAriaAtomic() {
        return this.state.ariaAtomic;
    }

    /**
     * Indicates an element is being modified and that assistive technologies MAY want to wait
     * until the modifications are complete before exposing them to the user.
     * Refer to W3C aria-busy for more
     *
     * @type {string}
     */
    @api
    set ariaBusy(value) {
        this.originalAriaBusy = value;
        this.state.ariaBusy = normalizeString(value, {
            fallbackValue: null,
            validValues: ['true', 'false'],
        });
    }

    get ariaBusy() {
        return this.originalAriaBusy;
    }

    get computedAriaBusy() {
        return this.state.ariaBusy;
    }

    get computedButtonClass() {
        const classes = classSet('slds-button');
        classes.add(buttonGroupOrderClass(this.groupOrder));
        return classes.toString();
    }

    /**
     * Sets focus on the element.
     */
    @api
    focus() {}

    /**
     * Reserved for internal use only.
     * Describes the order of this element (first, middle or last) inside lightning-button-group.
     * @type {string}
     */
    @api groupOrder = '';

    /**** COMPONENT LIFECYCLE EVENTS ****/

    constructor() {
        super();
        this.ariaObserver = new AriaObserver(this);
        // Workaround for an IE11 bug where click handlers on button ancestors
        // receive the click event even if the button element has the `disabled`
        // attribute set.
        if (isIE11 && isCSR) {
            this.template.addEventListener('click', (event) => {
                if (this.disabled) {
                    event.stopImmediatePropagation();
                }
            });
        }
    }
    connectedCallback() {
        super.connectedCallback();
        if (!this.ariaObserver) {
            this.ariaObserver = new AriaObserver(this);
        }
    }

    renderedCallback() {
        if (this.isConnected) {
            this.ariaObserver.sync();
        }
    }

    disconnectedCallback() {
        if (this.ariaObserver) {
            this.ariaObserver.disconnect();
            this.ariaObserver = undefined;
        }
    }

    /**
     * Utility function to set aria roles on the host element.
     * This is used mainly for native-shadow use cases for aria attributes that
     * depenend on ID references.
     *
     * If the role attribute is present we will respect that, otherwise it will be set to
     * an specific role, in this case button.
     *
     * @type {string}
     * @default undefined
     */
    setHostRoleAttribute(value) {
        let ariaRoleValue = this.getAttribute(ROLE) || value;

        this.setAttribute(ROLE, ariaRoleValue);
    }
}
