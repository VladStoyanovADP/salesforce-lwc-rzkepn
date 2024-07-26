import { LightningElement, track } from 'lwc';

export default class ModalDialogExample extends LightningElement {
    @track enteredName = '';

    openCreateContactDialog() {
        this.dialog.showModal();
    }

    handleCancel() {
        this.dialog.close();
    }

    handleSave() {
        const name = this.template.querySelector('lightning-input-name');
        this.enteredName = `${name.firstName} ${name.lastName}`;

        this.dialog.close();
    }

    get dialog() {
        return this.template.querySelector('lightning-dialog');
    }
}
