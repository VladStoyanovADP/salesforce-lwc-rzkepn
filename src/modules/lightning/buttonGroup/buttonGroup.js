import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { BUTTON_GROUP_ORDER } from 'lightning/utilsPrivate';

export default class LightningButtonGroup extends LightningShadowBaseClass {
    static validationOptOut = ['class'];

    connectedCallback() {
        super.connectedCallback();
        this.classList.add('slds-button-group');
        this.setAttribute('role', 'group');
    }

    /**
     * Handles the updates to slotted elements when the content of the slot changes.
     */
    handleSlotChange(event) {
        const slot = event.target;
        const children = slot.assignedElements() || [];
        this.updateGroupOrder(children);
    }

    /**
     * loops through each children and set the groupOrder value based on their position in the group.
     * @param children
     * @private
     */
    updateGroupOrder(children) {
        if (children.length) {
            if (children.length === 1) {
                children[0].groupOrder = null;
            } else {
                children[0].groupOrder = BUTTON_GROUP_ORDER.FIRST;
                children[children.length - 1].groupOrder =
                    BUTTON_GROUP_ORDER.LAST;
                for (let i = 1; i < children.length - 1; i++) {
                    children[i].groupOrder = BUTTON_GROUP_ORDER.MIDDLE;
                }
            }
        }
    }
}
