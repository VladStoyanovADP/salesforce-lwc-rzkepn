import { createElement } from 'lwc';
import '@lwc/synthetic-shadow';
import App from 'lightning/app';

const elm = createElement('lightning-app', { is: App });
document.body.appendChild(elm);
