import { LightningElement } from 'lwc';

export default class LightningShadowBaseClass extends LightningElement {
    connectedCallback() {
        if (!this.template.synthetic) {
            this.setAttribute('data-render-mode', 'shadow');
        }
    }
}
