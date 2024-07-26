import { api, track } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet } from 'lightning/utils';
import { normalizeString, reflectAttribute } from 'lightning/utilsPrivate';
import { computeSldsClass, getIconColor } from 'lightning/iconUtils';

const DEFAULT_SIZE = 'medium';
const DEFAULT_VARIANT = 'square';

/**
 * A visual representation of an object.
 */
export default class LightningAvatar extends LightningShadowBaseClass {
    /**
     * The alternative text used to describe the avatar, which is displayed as
     * hover text on the image.
     *
     * @type {string}
     * @required
     */
    @api alternativeText = '';

    /**
     * The Lightning Design System name of the icon used as a fallback when the
     * image fails to load. The initials fallback relies on this for its
     * background color. Names are written in the format 'standard:account'
     * where 'standard' is the category, and 'account' is the specific icon to
     * be displayed. Only icons from the standard and custom categories are
     * allowed.
     *
     * @type {string}
     */
    @api
    set fallbackIconName(value) {
        this._fallbackIconName = value;
        reflectAttribute(this, 'icon-name', this._fallbackIconName);
    }
    get fallbackIconName() {
        return this._fallbackIconName;
    }

    /**
     * If the record name contains two words, like first and last name, use the
     * first capitalized letter of each. For records that only have a single
     * word name, use the first two letters of that word using one capital and
     * one lower case letter.
     *
     * @type {string}
     */
    @api initials;

    @track _size = DEFAULT_SIZE;
    @track _src = '';
    @track _fallbackIconName = '';
    @track _variant = DEFAULT_VARIANT;

    /**
     * The size of the avatar. Valid values are x-small, small, medium, and large. This value defaults to medium.
     *
     * @type {string}
     * @default medium
     */
    @api
    get size() {
        return this._size;
    }
    set size(value) {
        this._size = normalizeString(value, {
            fallbackValue: DEFAULT_SIZE,
            validValues: ['x-small', 'small', 'medium', 'large'],
        });
        reflectAttribute(this, 'size', this._size);
    }

    /**
     * The URL for the image.
     *
     * @type {string}
     * @required
     */
    @api
    get src() {
        return this._src;
    }
    set src(value) {
        this._src = (typeof value === 'string' && value.trim()) || '';
    }

    /**
     * The variant changes the shape of the avatar. Valid values are empty,
     * circle, and square. This value defaults to square.
     *
     * @type {string}
     * @default square
     */
    @api
    get variant() {
        return this._variant;
    }
    set variant(value) {
        this._variant = normalizeString(value, {
            fallbackValue: DEFAULT_VARIANT,
            validValues: ['circle', 'square'],
        });
        reflectAttribute(this, 'variant', this._variant);
    }

    get computedClass() {
        const variant = this._variant;
        const size = this._size;
        return classSet('slds-avatar')
            .add({
                'slds-avatar_x-small': size === 'x-small',
                'slds-avatar_small': size === 'small',
                'slds-avatar_medium': size === 'medium',
                'slds-avatar_large': size === 'large',
            })
            .add({
                'slds-avatar_circle': variant === 'circle',
            });
    }

    get computedInitialsClass() {
        return classSet('slds-avatar__initials')
            .add(computeSldsClass(this.fallbackIconName))
            .toString();
    }

    get computedInitialsStyle() {
        if (this.fallbackIconName) {
            const color = getIconColor(this.fallbackIconName);
            if (color) {
                return `background-color: var(--slds-c-icon-color-background, ${color})`;
            }
        }
        const fallbackBGColor = '#0176d3';
        return `background-color: var(
            --slds-c-avatar-color-background,
            var(--slds-g-color-accent-container-2, ${fallbackBGColor})
        )`;
    }

    get showInitials() {
        return !this._src && this.initials;
    }

    get showIcon() {
        return !this._src && !this.initials;
    }

    handleImageError(event) {
        // eslint-disable-next-line no-console
        console.warn(
            `<lightning-avatar> Image with src="${event.target.src}" failed to load.`
        );
        this._src = '';
    }
}
