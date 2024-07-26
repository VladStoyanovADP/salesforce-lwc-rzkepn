import { api } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import {
    classListMutation,
    normalizeString,
    isIE11,
    reflectAttribute,
} from 'lightning/utilsPrivate';
import {
    computeSldsClass,
    getCategory,
    isValidName,
    getIconColor,
} from 'lightning/iconUtils';
import { normalizeVariant } from './util';

/**
 * Represents a visual element that provides context and enhances usability.
 */
export default class LightningIcon extends LightningShadowBaseClass {
    static validationOptOut = ['class'];

    _src;
    _privateIconName;
    _iconName;
    _size;
    _variant;

    /**
     * The alternative text used to describe the icon.
     * This text should describe what happens when you click the button,
     * for example 'Upload File', not what the icon looks like, 'Paperclip'.
     * @type {string}
     */
    @api alternativeText;

    /**
     * A uri path to a custom svg sprite, including the name of the resouce,
     * for example: /assets/icons/standard-sprite/svg/test.svg#icon-heart
     * @type {string}
     */
    @api
    get src() {
        return this.privateSrc;
    }
    set src(value) {
        this.privateSrc = value;

        // if value is not present, then we set the state back
        // to the original iconName that was passed
        // this might happen if the user sets a custom icon, then
        // decides to revert back to SLDS by removing the src attribute
        if (!value) {
            this.updateIconName(this.iconName);
        }

        // if isIE11 and the src is set
        // we'd like to show the 'standard:default' icon instead
        // for performance reasons.
        if (value && isIE11) {
            this.setDefault();
            return;
        }

        this._src = value;
    }

    /**
     * The Lightning Design System name of the icon.
     * Names are written in the format 'utility:down' where 'utility' is the category,
     * and 'down' is the specific icon to be displayed.
     * @type {string}
     * @required
     */
    @api
    get iconName() {
        return this._privateIconName;
    }
    set iconName(value) {
        this._privateIconName = value;

        // if src is set, we don't need to validate iconName
        if (this.src) {
            return;
        }

        this.updateIconName(value);
    }

    /**
     * Update the attributes and css classes on the host element, based on the given icon name
     */
    updateIconName(iconName) {
        if (iconName === this._iconName) {
            return;
        }

        const classes = {};

        if (typeof this._iconName !== 'undefined') {
            const oldIconClass = computeSldsClass(this._iconName);
            Object.assign(classes, {
                [oldIconClass]: false,
            });
        }

        if (isValidName(iconName)) {
            const isAction = getCategory(iconName) === 'action';
            const iconClass = computeSldsClass(iconName);
            Object.assign(classes, {
                // action icons have circle background
                'slds-icon_container_circle': isAction,
                [iconClass]: true,
            });
            this._iconName = iconName;
            this.setAttribute('icon-name', iconName);
        } else {
            console.warn(`<lightning-icon> Invalid icon name ${iconName}`); // eslint-disable-line no-console

            // Invalid icon names should render a blank icon. Remove any
            // classes that might have been previously added.
            Object.assign(classes, {
                'slds-icon_container_circle': false,
            });
            this._iconName = undefined;
            this.removeAttribute('icon-name');
        }

        classListMutation(this.classList, classes);
    }

    /**
     * The size of the icon. Options include xx-small, x-small, small, medium, or large.
     * The default is medium.
     * @type {string}
     * @default medium
     */
    @api
    get size() {
        return normalizeString(this._size, {
            fallbackValue: 'medium',
            validValues: ['xx-small', 'x-small', 'small', 'medium', 'large'],
        });
    }
    set size(value) {
        this._size = value;
    }

    /**
     * The variant changes the appearance of a utility icon.
     * Accepted variants include inverse, success, warning, and error.
     * Use the inverse variant to implement a white fill in utility icons on dark backgrounds.
     * @type {string}
     */
    @api
    get variant() {
        return normalizeVariant(this._variant, this._iconName);
    }

    set variant(value) {
        this._variant = value;
    }

    connectedCallback() {
        super.connectedCallback();
        this.classList.add('slds-icon_container');
    }

    renderedCallback() {
        const hostElement = this.template.host;
        const attributeValue = hostElement.hasAttribute(
            'data-input-pill-search-icon'
        );
        if (attributeValue) {
            reflectAttribute(
                this.template.querySelector('lightning-primitive-icon'),
                'data-input-pill-search-primicon',
                true
            );
        }
    }

    setDefault() {
        this._src = undefined;
        this.updateIconName('standard:default');
    }

    get iconBgColorStyle() {
        // we set the bg color from the SLDS provided fall back colors
        // for performance reasons.
        const iconName = this.iconName;
        if (isValidName(iconName)) {
            const sdsStylingHook = '--sds-c-icon-color-background';
            const sldsStylingHook = '--slds-c-icon-color-background';
            const fallBackColor = 'transparent';
            const color = getIconColor(iconName);
            const colorToUse = color ? color : fallBackColor;
            // setting SDS based hook instead of background-color on the boundary element
            // so this will work in NS and synthetic.
            return `${sdsStylingHook}: var(${sldsStylingHook}, ${colorToUse})`;
        }
        return null;
    }
}
