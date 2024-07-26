import { LightningElement, api } from 'lwc';

export default class PrimitiveCustomCell extends LightningElement {
    @api types;
    @api columnType;
    @api value;
    @api editable;
    @api columnLabel;
    @api rowKeyValue;
    @api colKeyValue;
    @api columnSubType;
    @api typeAttribute0;
    @api typeAttribute1;
    @api typeAttribute2;
    @api typeAttribute3;
    @api typeAttribute4;
    @api typeAttribute5;
    @api typeAttribute6;
    @api typeAttribute7;
    @api typeAttribute8;
    @api typeAttribute9;
    @api typeAttribute10;
    // typeAttribute21 and typeAttribute21 used by treegrid
    @api typeAttribute21;
    @api typeAttribute22;
    @api internalTabIndex;
    @api keyboardMode;
    @api wrapText;
    @api alignment;

    get type() {
        const type = this.types.getType(this.columnType);
        return type.template;
    }

    render() {
        return this.type;
    }

    get typeAttributes() {
        const typeAttributes = this.types.getType(
            this.columnType
        ).typeAttributes;
        const attrs = {};
        if (Array.isArray(typeAttributes)) {
            for (let i = 0, { length } = typeAttributes; i < length; i += 1) {
                attrs[typeAttributes[i]] = this[`typeAttribute${i}`];
            }
        }
        return attrs;
    }

    @api
    getActionableElements() {
        let result = [];
        let navigable;
        const traverseShadowRoots = (element) => {
            // Check if the current element has a shadow root and the specified attribute
            navigable = element.matches('[data-navigation="enable"]');
            if (element.shadowRoot && navigable) {
                let shadowElements = element.shadowRoot.querySelectorAll('[data-navigation="enable"]');

                // If shadow elements with the attribute are found, recursively traverse them
                if (shadowElements.length > 0) {
                    shadowElements.forEach(traverseShadowRoots);
                } else {
                    // If no shadow elements with the attribute, add the current element to the result
                    result.push(element);
                }
            } else if(navigable) {
                result.push(element);
            }
        };

        // Start traversal from the root elements with the specified attribute
        let rootElements = this.template.querySelectorAll('[data-navigation="enable"]');
        rootElements.forEach(traverseShadowRoots);

        return result;
    }

}
