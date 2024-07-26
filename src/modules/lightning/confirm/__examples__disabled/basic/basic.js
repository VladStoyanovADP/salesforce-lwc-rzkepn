import { LightningElement } from 'lwc';
import LightningConfirm from 'lightning/confirm';

export default class ConfirmBasic extends LightningElement {
    handleConfirmModal() {
        LightningConfirm.open({
            message: 'this is the confirm message',
            label: 'Please Confirm',
            theme: 'warning',
        }).then((result) => {
            console.log('confirm result', result);
        });
    }
}
