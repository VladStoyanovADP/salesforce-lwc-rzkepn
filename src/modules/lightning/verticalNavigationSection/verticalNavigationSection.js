import { api, track } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { guid, isHeadingLevelValid } from 'lightning/utilsPrivate';

export default class LightningVerticalNavigationSection extends LightningShadowBaseClass {
    headingId = guid();

    @track _label;

    /**
     * The heading text for this section.
     * @param {String} label - The heading text for this section.
     */
    set label(label) {
        this._label = label;
    }

    /**
     * The heading text for this section.
     * @returns {String} The heading text for this section.
     */
    @api
    get label() {
        return this._label || '';
    }

    handleOverflowRegister(event) {
        event.stopPropagation(); // suppressing event since it's a private event and not part of public API
        const item = event.detail;
        item.callbacks.updateAssistiveText(this.label);
    }

    _privateHeadingAriaLevel;

    /**
     * Changes the 'aria-level' attribute value for the
     * <h2> markup tag in the card's title element. Supported values
     * are (1, 2, 3, 4, 5, 6).
     *
     * @type {string | number}
     * @default 2
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
}
