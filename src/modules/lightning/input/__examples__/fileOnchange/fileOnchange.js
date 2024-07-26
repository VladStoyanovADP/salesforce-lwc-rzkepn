import { LightningElement } from 'lwc';

export default class InputFileOnChange extends LightningElement {
    filesCount = 0;
    filesList = [];

    handleFilesChange(event) {
        const filesList = event.detail.files;
        this.filesCount = filesList.length;
        this.filesList = filesList;
    }
}
