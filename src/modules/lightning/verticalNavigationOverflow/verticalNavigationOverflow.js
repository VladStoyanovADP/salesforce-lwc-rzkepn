import { track } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import showMoreLabel from '@salesforce/label/LightningVerticalNavigation.showMore';
import showLessLabel from '@salesforce/label/LightningVerticalNavigation.showLess';
import { isCSR } from 'lightning/utilsPrivate';

const SLDS_SHOW = 'slds-show';
const SLDS_HIDE = 'slds-hide';
const COLLAPSED_ICON = 'utility:chevronright';
const EXPANDED_ICON = 'utility:chevrondown';

export default class LightningVerticalNavigationSection extends LightningShadowBaseClass {
    @track _isExpanded = false;

    get computedActionText() {
        return this._isExpanded ? showLessLabel : showMoreLabel;
    }

    get computedItemListClass() {
        return this._isExpanded ? SLDS_SHOW : SLDS_HIDE;
    }

    get computedIconName() {
        return this._isExpanded ? EXPANDED_ICON : COLLAPSED_ICON;
    }

    get computedAssistiveText() {
        return this._assistiveText || '';
    }

    toggleOverflow() {
        this._isExpanded = !this._isExpanded;
    }

    updateAssistiveText(assistiveText) {
        this._assistiveText = assistiveText;
    }

    connectedCallback() {
        super.connectedCallback();
        if (isCSR) {
            this.dispatchEvent(
                new CustomEvent('privateoverflowregister', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        callbacks: {
                            updateAssistiveText:
                                this.updateAssistiveText.bind(this),
                        },
                    },
                })
            );
        }
    }
}
