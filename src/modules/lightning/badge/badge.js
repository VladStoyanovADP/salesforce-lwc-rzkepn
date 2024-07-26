import { api } from 'lwc';
import { classSet } from 'lightning/utils';
import { normalizeString } from 'lightning/utilsPrivate';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';

const DEFAULT_POSITION = 'start';

/**
 * Represents a label which holds a small amount of information, such as the
 * number of unread notifications.
 */
export default class LightningBadge extends LightningShadowBaseClass {
    static validationOptOut = ['class'];
    /**
     * Normalized icon position
     */
    _iconPosition = DEFAULT_POSITION;

    /**
     * The text to be displayed inside the badge.
     * @type {string}
     * @required
     */
    @api label;

    /**
     * The Lightning Design System name of the icon to be displayed inside the badge.
     * Names are written in the format 'utility:down' where 'utility' is the category,
     * and 'down' is the specific icon to be displayed.
     * @type {string}
     */
    @api iconName;

    /**
     * The alternative text used to describe the icon,
     * which is displayed as tooltip text.
     * @type {string}
     */
    @api iconAlternativeText;

    /**
     * The position for the icon.
     * Possible values: 'start' (displayed before the text) and 'end' (displayed after the text)
     * @default start
     * @type {string}
     */
    @api
    get iconPosition() {
        return this._iconPosition;
    }

    set iconPosition(value) {
        this._iconPosition = normalizeString(value, {
            fallbackValue: DEFAULT_POSITION,
            validValues: ['start', 'end'],
        });
    }

    connectedCallback() {
        super.connectedCallback();
        this.classList.add('slds-badge');
    }

    /**
     * Computes the icon container class based on the icon positioning
     */
    get computedClass() {
        let iconClass = classSet('slds-badge__icon');

        iconClass.add(
            this.isIconBeforeLabel
                ? 'slds-badge__icon_left'
                : 'slds-badge__icon_right'
        );

        return iconClass.toString();
    }

    /**
     * Whether the icon comes before the label
     */
    get isIconBeforeLabel() {
        return this._iconPosition !== 'end';
    }
}
