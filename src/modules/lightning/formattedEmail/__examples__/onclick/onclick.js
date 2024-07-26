import { LightningElement } from 'lwc';

export default class FormattedEmailBasic extends LightningElement {
    count = 0;

    handleClick(e) {
        e.preventDefault();
        this.count += 1;
    }
}
