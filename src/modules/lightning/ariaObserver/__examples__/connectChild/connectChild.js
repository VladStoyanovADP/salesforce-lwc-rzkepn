import { LightningElement, api } from 'lwc';

import AriaObserver from 'lightning/ariaObserver';

export default class AriaObserverConnectChild extends LightningElement {
    constructor() {
        super();
        this.ariaObserver = new AriaObserver(this);
    }

    connectedCallback() {
        if (!this.ariaObserver) {
            this.ariaObserver = new AriaObserver(this);
        }
    }

    disconnectedCallback() {
        if (this.ariaObserver) {
            this.ariaObserver.disconnect();
            this.ariaObserver = undefined;
        }
    }

    renderedCallback() {
        if (this.isConnected) {
            this.ariaObserver.sync();
        }
    }

    _ariaLabelledBy = '';

    @api
    get ariaLabelledBy() {
        return this._ariaLabelledBy;
    }
    set ariaLabelledBy(refs) {
        this._ariaLabelledBy = refs;

        this.ariaObserver.connect({
            targetSelector: 'input',
            attribute: 'aria-labelledby',
            id: refs,
        });
    }
}
