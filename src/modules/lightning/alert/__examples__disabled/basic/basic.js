import { LightningElement } from 'lwc';
import LightningAlert from 'lightning/alert';

export default class AlertBasic extends LightningElement {
    handleAlertModal() {
        LightningAlert.open({
            message: 'this is the alert message',
            //label defaults to "Alert"
            variant: 'headerless',
        }).then((result) => {
            console.log('alert result', result);
        });
    }
}
