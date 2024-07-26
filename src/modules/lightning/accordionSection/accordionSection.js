import { api, track } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { generateUniqueId } from 'lightning/inputUtils';
import { keyCodes, isHeadingLevelValid, isCSR } from 'lightning/utilsPrivate';
import { classSet } from 'lightning/utils';
import DIR from '@salesforce/i18n/dir';

/**
 * A single section that is nested in an accordion component.
 * @slot actions Placeholder for actionable components, such as lightning-button or lightning-button-menu.
 * Actions are displayed at the top right corner of the accordion section.
 * @slot default Placeholder for your content in the accordion section.
 */
export default class LightningAccordionSection extends LightningShadowBaseClass {
    static validationOptOut = ['class'];
    /**
     * The unique section name to use with the active-section-name attribute in the accordion component.
     * @type {string}
     */
    @api name;

    /**
     * The text that displays as the title of the section.
     * @type {string}
     */
    @api label;

    /**
     * Reserved for internal use.
     * @type {string}
     */
    @api title;

    @track privateIsOpen = false;

    _privateHeadingAriaLevel;

    /**
     * Changes the 'aria-level' attribute value for the
     * <h2> markup tag in the card's title element. Supported values
     * are (1, 2, 3, 4, 5, 6).
     * @type {string | number}
     */
    @api
    get headingLevel() {
        return this._privateHeadingAriaLevel;
    }

    set headingLevel(value) {
        if (isHeadingLevelValid(value)) {
            this._privateHeadingAriaLevel = value;
        }
    }

    /**
     * Section should have received focus, but hasn't yet.
     */
    pendingFocus = false;

    privateUniqueId = generateUniqueId('lgt-accordion-section');

    connectedCallback() {
        super.connectedCallback();
        this.setAttribute('role', 'listitem');
        this.classList.add('slds-accordion__list-item');
        this.registerSectionWithParent();
    }

    disconnectedCallback() {
        if (this.privateAccordionSectionObserver) {
            this.privateAccordionSectionObserver.notifySectionDeregister();
        }
    }

    renderedCallback() {
        // After the classes are applied the section button might be outside viewport, we apply focus again to bring it back.
        if (this.privateIsOpen && this.pendingFocus) {
            this.pendingFocus = false;
            this.focusSection();
        }
    }

    get computedAriaExpanded() {
        return this.privateIsOpen.toString();
    }

    get computedAriaHidden() {
        return (!this.privateIsOpen).toString();
    }

    get computedSectionClasses() {
        return classSet('slds-accordion__section')
            .add({
                'slds-is-open': this.privateIsOpen,
            })
            .toString();
    }

    get computedHidden() {
        return this.privateIsOpen ? '' : (!this.privateIsOpen).toString();
    }

    handleKeyDown(event) {
        switch (event.keyCode) {
            case keyCodes.up:
            case keyCodes.right:
            case keyCodes.down:
            case keyCodes.left:
                event.preventDefault();
                event.stopPropagation();
                this.privateAccordionSectionObserver.notifySectionKeyNav(
                    event.keyCode
                );
                break;
            default:
                break; // do nothing
        }
    }

    handleSelectSection() {
        this.pendingFocus = true;
        this.privateAccordionSectionObserver.notifySectionSelect();
    }

    get hostDirection() {
        if (!isCSR) {
            return DIR || 'ltr';
        }
        // need to use .parentElement as accordionSection needs parentElement accordion to render
        const host = this.template.host;
        if (host.parentElement) {
            return (
                window
                    .getComputedStyle(host.parentElement)
                    .direction.toLowerCase() || 'ltr'
            );
        }

        // if no parentElement, return direction from @salesforce/i18n; else fallback to 'ltr'
        return DIR || 'ltr';
    }

    get accordionTitleIcon() {
        if (this.privateIsOpen) {
            return 'utility:switch';
        }
        return this.hostDirection === 'ltr'
            ? 'utility:chevronright'
            : 'utility:chevronleft';
    }

    registerSectionWithParent() {
        const detail = {
            targetId: this.privateUniqueId,
            targetName: this.name,
            openSection: this.openSection.bind(this),
            isOpen: this.isOpen.bind(this),
            closeSection: this.closeSection.bind(this),
            focusSection: this.focusSection.bind(this),
            ackParentAccordion: this.ackParentAccordion.bind(this),
        };

        // Accordion sections can be inside other shadows, therefore composed is needed here
        if (isCSR) {
            this.dispatchEvent(
                new CustomEvent('privateaccordionsectionregister', {
                    bubbles: true,
                    composed: true,
                    cancelable: true,
                    detail,
                })
            );
        }
    }

    openSection() {
        this.privateIsOpen = true;
    }

    closeSection() {
        this.privateIsOpen = false;
    }

    focusSection() {
        // Browser gives the section button focus on click. This focus needs to be removed and reapplied to scroll the section into view.
        const sectionButton = isCSR
            ? this.template.querySelector('button.section-control')
            : null;
        if (sectionButton) {
            sectionButton.blur();
            sectionButton.focus();
        }
    }

    isOpen() {
        return this.privateIsOpen;
    }

    /**
     * Once the section is registered in the accordion, this function will be called with an observer
     *
     * @param {Object} accordionSectionObserver - a private communication channel between the section and the parent accordion
     */
    ackParentAccordion(accordionSectionObserver) {
        this.privateAccordionSectionObserver = accordionSectionObserver;
    }
}
