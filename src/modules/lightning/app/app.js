import { LightningElement } from 'lwc';

export default class App extends LightningElement {

    handleClick(event) {
        this.clickedButtonLabel = event.target.label;
    }
}
