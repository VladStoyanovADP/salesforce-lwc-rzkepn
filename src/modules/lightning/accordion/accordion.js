import { api } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { createAccordionManager } from 'lightning/accordionUtilsPrivate';
import { isCSR } from 'lightning/utilsPrivate';

/**
 * A collection of vertically stacked sections with multiple content areas.
 * @slot default Placeholder for accordion-section components.
 */
export default class LightningAccordion extends LightningShadowBaseClass {
    static validationOptOut = ['class'];
    privateIsSectionLessInLastRender = true;
    _allowMultipleSectionsOpen = false;
    connected = false;

    constructor() {
        super();
        this.privateAccordionManager = createAccordionManager();
    }

    connectedCallback() {
        this.privateAccordionManager.attachOpenSectionObserver(() => {
            const openSections = this.activeSectionName;
            // there is nothing but to dispatch the sectiontoggle here.
            if (this.connected && isCSR) {
                this.dispatchEvent(
                    new CustomEvent('sectiontoggle', {
                        detail: {
                            openSections,
                        },
                    })
                );
            }
        });
        super.connectedCallback();
        this.connected = true;
        this.setAttribute('role', 'list');
        this.classList.add('slds-accordion');

        this.addEventListener(
            'privateaccordionsectionregister',
            this.handleSectionRegister.bind(this)
        );
    }

    disconnectedCallback() {
        this.connected = false;
    }

    /**
     * Displays tooltip text when the mouse moves over the element.
     *
     * @type {string}
     */
    @api
    get title() {
        return this.getAttribute('title');
    }

    set title(value) {
        this.setAttribute('title', value);
    }

    /**
     * Expands the specified accordion sections. Pass in a string for a single section or a list of section names. Section names are case-sensitive.
     * To support multiple expanded sections, include allow-multiple-sections-open in your markup.
     * By default, only the first section in the accordion is expanded.
     * @type {array|string}
     */
    @api
    get activeSectionName() {
        const openSections = this.privateAccordionManager.openSectionsNames;

        if (!this.allowMultipleSectionsOpen) {
            return openSections.length ? openSections[0] : undefined;
        }

        return openSections;
    }

    set activeSectionName(value) {
        this._activeSectionName = value;

        if (!this.privateIsSectionLessInLastRender) {
            this.privateAccordionManager.openSectionByName(value);
        }
    }

    /**
     * If present, the accordion allows multiple open sections.
     * Otherwise, opening a section closes another that's currently open.
     *
     * @type {boolean}
     * @default false
     */
    @api
    get allowMultipleSectionsOpen() {
        return this._allowMultipleSectionsOpen;
    }

    set allowMultipleSectionsOpen(value) {
        this._allowMultipleSectionsOpen = value;
        this.privateAccordionManager.collapsible = value;
    }

    renderedCallback() {
        // Use Promise.resolve() to avoid a timing issue due to LWC v6's native custom element lifecycle:
        // https://github.com/salesforce/lwc/releases/v6.0.0#new-timing
        // This computation logic needs to occur after the child accordionSection has fired its
        // connectedCallback.
        Promise.resolve().then(() => {
            if (this.privateIsSectionLessInLastRender) {
                let hasOpenSection = false;
                // open sectionName or first section.
                if (this._activeSectionName) {
                    hasOpenSection =
                        this.privateAccordionManager.openSectionByName(
                            this._activeSectionName
                        );
                }

                if (!(this._allowMultipleSectionsOpen || hasOpenSection)) {
                    this.privateAccordionManager.openFirstSection();
                }
            }

            this.privateIsSectionLessInLastRender =
                this.privateAccordionManager.sections.length === 0;
        });
    }

    get openedSection() {
        return this.privateAccordionManager.openedSection;
    }

    handleSectionRegister(event) {
        event.stopPropagation();
        event.preventDefault();
        const { detail } = event;

        const accordionSection = {
            id: detail.targetId,
            name: detail.targetName,
            ref: event.target,
            open: detail.openSection,
            isOpen: detail.isOpen,
            close: detail.closeSection,
            focus: detail.focusSection,
            ackParentAccordion: detail.ackParentAccordion,
        };

        this.privateAccordionManager.registerSection(accordionSection);
    }
}
