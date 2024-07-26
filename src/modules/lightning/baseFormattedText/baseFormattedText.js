import { LightningElement, api, track } from 'lwc';
import {
    isTextIgnoreRTL,
    normalizeBoolean,
    parseToFormattedLinkifiedParts,
} from 'lightning/utilsPrivate';

/**
 * Displays text and linkifies if requested.
 * It doesnt convert new lines to line breaks.
 * This component is meant for internal use by lightning components
 * where preserving new lines is needed so that truncation works as
 * expected for multiline text. To show new lines, parent component
 * should set style white-space:pre-line
 */
export default class BaseFormattedText extends LightningElement {
    /**
     * Sets the text to display.
     * @type {string}
     *
     */
    @api value = '';

    @track _linkify = false;

    /**
     * If present, URLs and email addresses are displayed in anchor tags.
     * They are displayed in plain text by default.
     * @type {boolean}
     * @default false
     */
    @api
    get linkify() {
        return this._linkify;
    }
    set linkify(value) {
        this._linkify = normalizeBoolean(value);
    }

    get shouldFormat() {
        return this.linkify && this.isString;
    }

    get isString() {
        return this.value && typeof this.value === 'string';
    }

    get isObject() {
        return typeof this.value === 'object';
    }

    get normalizedValue() {
        // W-7860598 some team rely on text column support for primitive type.
        // W-7752316 customer use compound field for text column, to avoid [object Object]
        // Check if value is object, return '';
        if (this.isObject) {
            return '';
        }
        return this.value;
    }

    get formattedParts() {
        if (!this.isString) {
            return [];
        }
        return parseToFormattedLinkifiedParts(this.value, true);
    }

    get ignoreRTL() {
        return isTextIgnoreRTL(this.value);
    }
}
