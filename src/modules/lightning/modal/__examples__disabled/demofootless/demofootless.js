import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class ModalDemoFootless extends LightningModal {
    @api header = 'Modal Demo Without Footer';

    handleOptionClick(e) {
        const { target } = e;
        this.close(parseInt(target.dataset.id, 10));
    }
}
