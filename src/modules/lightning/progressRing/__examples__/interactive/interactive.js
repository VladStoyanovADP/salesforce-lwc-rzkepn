import { LightningElement, track } from 'lwc';

export default class Interactive extends LightningElement {
    @track sliderValue = 50;
    @track direction = 'fill';

    sliderChange(event) {
        this.sliderValue = event.target.value;
    }

    directionChange(event) {
        if (event.detail.checked) {
            this.direction = 'fill';
        } else {
            this.direction = 'drain';
        }
    }
}
