import { LightningElement } from 'lwc';

export default class PlaygroundShadowScroll extends LightningElement {
    handleScroll(event) {
        const { callback } = event.detail;
        callback(event.composedPath());
        event.stopPropagation();
    }
}
