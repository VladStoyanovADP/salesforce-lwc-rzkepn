import { api, track } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import {
    normalizeString,
    isHeadingLevelValid,
    normalizeBoolean,
    isCSR,
} from 'lightning/utilsPrivate';
import { generateUniqueId } from 'lightning/inputUtils';
import AriaObserver from 'lightning/ariaObserver';
import { classSet } from 'lightning/utils';
import labelTabs from '@salesforce/label/LightningTabs.defaultTabBarAriaLabel';

const tabClassPrefixByVariant = {
    scoped: 'slds-tabs_scoped',
    vertical: 'slds-vertical-tabs',
    standard: 'slds-tabs_default',
};

/**
 * Represents a list of tabs.
 * @slot default Placeholder for lightning-tab.
 */
export default class LightningTabset extends LightningShadowBaseClass {
    @track _tabHeaders = [];
    _variant = 'standard';
    // tabset heading private values
    _headingLabel = null;
    _headingVisible = false;
    _headingLevel = 2;
    // these headingLabel private variables are used to identify if this component
    // requires a rerender based on a null headingLabel value change
    _headingLabelRerender = false;
    _headingLabelRemove = false;
    _headingLabelAdd = false;
    // additional private variables
    _firstRender = true;
    _rerender = false;
    _tabBarElem = null;
    defaultAriaLabel = labelTabs;

    /**
     * Displays tooltip text when the mouse moves over the tabset.
     * @type {string}
     */
    @api title;

    /**
     * Specifies text to use as custom assistive text for the tabset heading.
     * The text is placed in a div element with role="heading" and aria-level="2".
     * When heading-label isn't specified, the default assistive text is "Tabs" in
     * a div element with aria-level="2".
     * @type {string|null} - the value to set for the tabset heading
     */
    @api
    get headingLabel() {
        return this._headingLabel ?? null;
    }

    set headingLabel(value) {
        const labelIsPopulated = value && value.trim().length > 0;
        const currentValue = this._headingLabel;
        const nextValue = labelIsPopulated ? value : null;
        this._headingLabel = nextValue;

        // special case for when headingLabel is programatically set to null or a null
        // headingLabel is set to a non-null value. See W-14708987 for more info.
        if (!this._firstRender) {
            this._headingLabelRemove = currentValue && nextValue === null; // label to null
            this._headingLabelAdd = currentValue === null && nextValue; // null to label
            this._headingLabelRerender =
                this._headingLabelRemove || this._headingLabelAdd;
        }
    }

    /**
     * Determines whether the text that’s passed with the heading-label attribute
     * is visible above the tabset. This attribute isn't present by default so the
     * assistive text is only read by screen readers.
     * @type {boolean} - the boolean value to set for heading visibility
     * @returns {boolean} - the boolean value set for heading visibility
     */
    @api
    get headingVisible() {
        return this._headingVisible ?? false;
    }

    set headingVisible(value) {
        this._headingVisible = normalizeBoolean(value);
    }

    /**
     * Specifies the value to pass through to aria-level when you specify heading-label.
     * Accepts values from 1 to 6. The default value is 2.
     * @type {number} - the value to set for the heading's aria-level
     * @returns {number} - the value for setting the heading's aria-level
     */
    @api
    get headingLevel() {
        return this._headingLevel ?? 2;
    }

    set headingLevel(level) {
        if (isHeadingLevelValid(level)) {
            this._headingLevel = level;
        }
    }

    /**
     * The variant changes the appearance of the tabset. Accepted variants are standard, scoped, and vertical.
     * @type {string}
     */
    @api
    get variant() {
        return this._variant;
    }

    set variant(value) {
        this._variant = normalizeString(value, {
            fallbackValue: 'standard',
            validValues: ['scoped', 'vertical'],
        });
    }

    /**
     * Sets a specific tab to open by default using a string that matches a tab's value string. If not used, the first tab opens by default.
     * @type {string}
     */
    @api
    get activeTabValue() {
        return this._activeTabValue;
    }

    set activeTabValue(tabValue) {
        const newTabValue = tabValue && String(tabValue);
        if (!newTabValue || this._activeTabValue === newTabValue) {
            // already selected, do nothing
            return;
        }

        if (this._connected) {
            const tab = this._tabByValue[tabValue];
            if (tab) {
                this._selectTab(tabValue);
            }
        } else {
            this._activeTabValue = newTabValue;
        }
    }

    /**
     * Focus currently selected tab.
     */
    @api
    focus() {
        const tabBar = this.tabBarElem;
        if (tabBar) {
            tabBar.focus();
        }
    }

    addTabRegisterEventListeners() {
        if (isCSR) {
            this.addEventListener(
                'privatetabregister',
                this.handleTabRegister.bind(this)
            );
            this.addEventListener(
                'privatetabdatachange',
                this.handleTabDataChange.bind(this)
            );
        }
    }

    removeTabRegisterEventListeners() {
        if (isCSR) {
            this.removeEventListener(
                'privatetabregister',
                this.handleTabRegister.bind(this)
            );
            this.removeEventListener(
                'privatetabdatachange',
                this.handleTabDataChange.bind(this)
            );
            this._tabBarElem = null;
        }
    }

    connectedCallback() {
        super.connectedCallback();
        this._tabByValue = {};
        this._connected = true;
        this.addTabRegisterEventListeners();
        if (isCSR) {
            this.ariaObserver = new AriaObserver(this);
        }
    }

    /**
     * in native shadow, must wait for this entire `tab-set` component to be rendered in order to
     * successfully querySelect `tab-bar` from it, in methods such as _updateTabBarHeaders
     * or _selectTab.
     * using _rerender to trigger renderedCallback and execute these methods in here
     * instead of the handleTabRegister method, where `tab-bar` is not querySelectable.
     */
    renderedCallback() {
        // always update the cached this._tabBarElem at the start of the render cycle
        this._cacheTabBarElem();
        if (this.nativeShadowAndRerender || this._headingLabelRerender) {
            this._rerender = false;
            this._headingLabelRerender = false;
            this._updateTabBarHeaders(this._tabHeaders);
            this._selectTab(this._activeTabValue);
        }
        this.ariaObserver.sync();
        if (this._firstRender) {
            this._firstRender = false;
        }
    }

    disconnectedCallback() {
        this._connected = false;
        this.removeTabRegisterEventListeners();
        if (this.ariaObserver) {
            this.ariaObserver.disconnect();
            this.ariaObserver = undefined;
        }
    }

    get computedHeadingClass() {
        const classnames = classSet('slds-tabs_default__header');
        return classnames
            .add({ 'slds-assistive-text': !this._headingVisible })
            .toString();
    }

    handleTabLinkRegister(event) {
        const tabs = this.tabs;
        event.detail.tabLinks.forEach((tabLink, index) => {
            this.ariaObserver.connect({
                attribute: 'aria-labelledby',
                targetNode: tabs[index],
                relatedNodes: tabLink,
            });
        });
    }

    get tabs() {
        return this.querySelectorAll(`[role='tabpanel']`);
    }

    handleTabRegister(event) {
        event.stopPropagation();
        // setting this to true, will trigger _updateTabBarHeaders and _selectTab in renderedCallback
        this._rerender = true;
        const tab = event.target;

        tab.role = 'tabpanel';
        const generatedUniqueId = generateUniqueId('tab');
        if (!tab.id) {
            // We need a tab.id on the tab component to ensure that aria-controls from tab-bar can point to it
            tab.id = generatedUniqueId;
        }

        if (!tab.value) {
            tab.value = generatedUniqueId;
        }
        const tabValue = tab.value;

        tab.dataTabValue = tabValue;

        tab.classList.add(`${tabClassPrefixByVariant[this.variant]}__content`);

        tab.classList.add('slds-hide');
        tab.classList.remove('slds-show');

        const tabs = this.tabs;
        let tabIndex;
        for (tabIndex = 0; tabIndex < tabs.length; tabIndex++) {
            if (tabs[tabIndex].dataTabValue === tabValue) {
                break;
            }
        }

        event.detail.setDeRegistrationCallback(() => {
            if (!this._connected) {
                return;
            }
            const index = this._tabHeaders.findIndex(
                (existingTab) => existingTab.value === tabValue
            );
            if (index >= 0) {
                this._tabHeaders.splice(index, 1);
                this._updateTabBarHeaders(this._tabHeaders);

                this._tabByValue[tabValue] = undefined;
                if (
                    this._activeTabValue === tab.value &&
                    this._tabHeaders.length > 0
                ) {
                    this._showTabContentForTabValue(this._tabHeaders[0].value);
                }
            }
        });

        this._tabHeaders.splice(tabIndex, 0, {
            value: tabValue,
            label: tab.label,
            node: tab,
            domId: tab.id,
            title: tab.title,
            iconName: tab.iconName,
            // the icon was incorrectly named assistive text..
            iconAlternativeText: tab.iconAssistiveText,
            endIconName: tab.endIconName,
            endIconAlternativeText: tab.endIconAlternativeText,
            showErrorIndicator: tab.showErrorIndicator,
        });

        // need to leave this _updateTabBarHeaders here so that `tab-bar` can be updated
        // in the case of a "conditional tab". the _updateTabBarHeaders in the renderedCallback
        // has no knowledge of the new tab being added.
        // this call works here in the "conditional tab" case, as `tab-set` is already rendered.
        this._updateTabBarHeaders(this._tabHeaders);

        this._tabByValue[tabValue] = tab;

        // if no activeTabValue specified, we will default to the first registered tab
        if (!this._activeTabValue) {
            this._activeTabValue = tab.value;
        }

        if (this._activeTabValue === tab.value && this.template.synthetic) {
            this._selectTab(tabValue);
        }
    }

    _selectTab(value) {
        this._selectTabHeaderByTabValue(value);
        this._showTabContentForTabValue(value);
    }

    _showTabContentForTabValue(value) {
        const tab = this._tabByValue[value];
        if (!tab) {
            return;
        }

        if (this._activeTabValue) {
            const currentTab = this._tabByValue[this._activeTabValue];
            if (currentTab) {
                currentTab.classList.add('slds-hide');
                currentTab.classList.remove('slds-show');
            }
        }
        this._activeTabValue = tab.value;
        tab.classList.add('slds-show');
        tab.classList.remove('slds-hide');
        tab.loadContent();
    }

    handleTabSelected(event) {
        const selectedTabValue = event.detail.value;
        const tab = this._tabByValue[selectedTabValue];
        if (this._activeTabValue !== tab.value) {
            this._showTabContentForTabValue(selectedTabValue);
        }
    }

    handleTabDataChange(event) {
        const changedTab = event.target;
        const newTabValue = changedTab.value;
        const currentTabValue = changedTab.dataTabValue;
        const matchingTabHeader = this._tabHeaders.find(
            (tabHeader) => tabHeader.value === currentTabValue
        );
        if (matchingTabHeader) {
            matchingTabHeader.label = changedTab.label;
            matchingTabHeader.value = newTabValue;
            matchingTabHeader.title = changedTab.title;
            matchingTabHeader.iconName = changedTab.iconName;
            matchingTabHeader.iconAlternativeText =
                changedTab.iconAssistiveText;
            matchingTabHeader.endIconName = changedTab.endIconName;
            matchingTabHeader.endIconAlternativeText =
                changedTab.endIconAlternativeText;
            matchingTabHeader.showErrorIndicator =
                changedTab.showErrorIndicator;
        }

        this._updateTabBarHeaders(this._tabHeaders);

        if (currentTabValue !== newTabValue) {
            const tab = this._tabByValue[currentTabValue];
            if (tab) {
                tab.dataTabValue = newTabValue;
                this._tabByValue[newTabValue] =
                    this._tabByValue[currentTabValue];
                this._tabByValue[currentTabValue] = undefined;
            }
            if (this._activeTabValue === currentTabValue) {
                this._activeTabValue = newTabValue;
            }
        }
    }

    get nativeShadowAndRerender() {
        return this._rerender && !this.template.synthetic;
    }

    /* cache tabBar element when first accessed, or isCSR and not set */
    get tabBarElem() {
        if (isCSR) {
            if (
                this.nativeShadowAndRerender ||
                this._headingLabelRerender ||
                !this._tabBarElem
            ) {
                this._cacheTabBarElem();
            }
            return this._tabBarElem;
        }
        return null;
    }

    /* sets the private cached version of tabBar element
       this handles the case where isCSR && this._tabBarElement (exists)
       intentionally force an update to the element when a rerender occurs in native shadow
       since we call get tabBarElem skipping checks for isCSR, and non-existing element
    */
    _cacheTabBarElem() {
        if (isCSR) {
            // udpdate tabBar element, force to update elem if NS && Rerender
            // or always if it doesn't exist
            // order of IF checking is important
            if (
                this.nativeShadowAndRerender ||
                this._headingLabelRerender ||
                !this._tabBarElem
            ) {
                this._tabBarElem =
                    this.template.querySelector('lightning-tab-bar');
            }
        }
    }

    /**
     * Need to set tabHeaders programmatically this way. If done declaratively, LWC appears to batch
     * the request to re-render the tab-bar until after all the tabs have been registered. If all tabs
     * haven't been registered, it may not carry out future operations on the tab-bar accurately.
     * Ex. it will not be able to find the selected default tab later during that tab's registration phase.
     * This would cause the active default tab to not be selected.
     *
     * @param {Array} headers
     */
    _updateTabBarHeaders(headers) {
        const tabBar = this.tabBarElem;
        if (tabBar) {
            tabBar.tabHeaders = headers.slice();
        }
    }

    _selectTabHeaderByTabValue(value) {
        const tabBar = this.tabBarElem;
        if (!this._connected || !tabBar) {
            return;
        }
        tabBar.selectTabByValue(value);
    }

    get computedClass() {
        return tabClassPrefixByVariant[this.variant];
    }
}
