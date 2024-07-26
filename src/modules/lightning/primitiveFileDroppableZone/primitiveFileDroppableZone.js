import { api, track } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { normalizeBoolean, isCSR } from 'lightning/utilsPrivate';

export default class LightningPrimitiveFileDroppableZone extends LightningShadowBaseClass {
    static validationOptOut = ['class'];

    @track _disabled;
    @track _multiple;

    @api
    get disabled() {
        return this._disabled || false;
    }
    set disabled(value) {
        this._disabled = normalizeBoolean(value);
    }

    @api
    get multiple() {
        return this._multiple || false;
    }
    set multiple(value) {
        this._multiple = normalizeBoolean(value);
    }

    constructor() {
        super();

        if (isCSR) {
            this.template.addEventListener(
                'dragover',
                this.allowDrop.bind(this)
            );
            this.template.addEventListener(
                'dragleave',
                this.handleDragLeave.bind(this)
            );
            this.template.addEventListener(
                'drop',
                this.handleOnDrop.bind(this)
            );
        }
    }

    connectedCallback() {
        this.classList.add('slds-file-selector__dropzone');
    }

    setDragOver(dragOver) {
        this.classList.toggle('slds-has-drag-over', dragOver);
    }

    handleDragLeave() {
        this.setDragOver(false);
    }

    handleOnDrop(event) {
        event.preventDefault();

        this.setDragOver(false);

        if (this.disabled) {
            event.stopPropagation();
            return;
        }

        if (!this.meetsMultipleCriteria(event)) {
            event.stopPropagation();
        }
    }

    allowDrop(event) {
        event.preventDefault();
        if (!this.disabled) {
            this.setDragOver(true);
        }
    }

    meetsMultipleCriteria(dragEvent) {
        const files = dragEvent.dataTransfer.files;
        return !(files.length > 1 && !this.multiple);
    }
}
