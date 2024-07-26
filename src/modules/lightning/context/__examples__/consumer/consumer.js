import { LightningElement, wire } from 'lwc';
import ContextProvider from 'context/provider';

export default class Consumer extends LightningElement {
    // eslint-disable-next-line @lwc/lwc/valid-wire
    @wire(ContextProvider.Provider) context;

    get theme() {
        return this.context.theme;
    }

    get themeClass() {
        return `${this.theme}-theme`;
    }
}
