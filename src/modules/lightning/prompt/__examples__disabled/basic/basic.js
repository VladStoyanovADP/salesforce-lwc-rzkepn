import { LightningElement } from 'lwc';
import LightningPrompt from 'lightning/prompt';

export default class PromptBasic extends LightningElement {
    handlePromptModal() {
        LightningPrompt.open({
            message: 'this is the prompt message',
            defaultValue: 'test',
            label: 'Please Respond',
            // use default theme
        }).then((result) => {
            console.log('prompt result', result);
        });
    }
}
