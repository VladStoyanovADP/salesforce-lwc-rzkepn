import { LightningElement } from 'lwc';

export default class AriaObserverConnect extends LightningElement {
    connectIds = 'foo bar';

    handleUpdateIds() {
        this.connectIds = 'foo bar hello world';
    }
}
