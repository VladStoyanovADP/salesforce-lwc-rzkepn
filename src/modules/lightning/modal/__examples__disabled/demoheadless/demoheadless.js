import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class ModalDemoHeadless extends LightningModal {
    @api body = 'Select an option:';
    @api options = [];

    handleOptionClick(e) {
        const { target } = e;
        this.close(parseInt(target.dataset.id, 10));
    }
}
