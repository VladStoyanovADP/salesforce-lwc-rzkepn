import { LightningElement } from 'lwc';
import { classSet } from 'lightning/utils';

export default class PositionLibraryPlayground extends LightningElement {
    selectedComponent = 'helpText';
    containerPosition = 'topLeft';
    componentPosition = 'topLeft';

    containerWidth = 300;
    containerHeight = 200;

    isContainerScroll = false;
    isViewportScroll = false;
    isUseShadowRootContainer = false;

    componentOptions = [
        { label: 'helpText', value: 'helpText' },
        { label: 'button-menu', value: 'button-menu' },
        { label: 'combobox', value: 'combobox' },
        { label: 'datepicker', value: 'datepicker' },
    ];

    positionOptions = [
        { label: 'top left', value: 'topLeft' },
        { label: 'top right', value: 'topRight' },
        { label: 'bottom left', value: 'bottomLeft' },
        { label: 'bottom right', value: 'bottomRight' },
    ];

    handleComponentSelector(event) {
        this.selectedComponent = event.detail.value;
    }

    handleContainerPosition(event) {
        this.containerPosition = event.detail.value;
    }

    handleComponentPosition(event) {
        this.componentPosition = event.detail.value;
    }

    get computedComponentClass() {
        return classSet().add({
            'top-left': this.componentPosition === 'topLeft',
            'top-right': this.componentPosition === 'topRight',
            'bottom-left': this.componentPosition === 'bottomLeft',
            'bottom-right': this.componentPosition === 'bottomRight',
        });
    }

    // container has style overflow-y:auto(slds-scrollable_y)
    get computedContainerClass() {
        const classnames = classSet('container slds-scrollable_y');

        return classnames.add({
            'top-left': this.containerPosition === 'topLeft',
            'top-right': this.containerPosition === 'topRight',
            'bottom-left': this.containerPosition === 'bottomLeft',
            'bottom-right': this.containerPosition === 'bottomRight',
        });
    }

    get computedConfigClass() {
        const classnames = classSet('config');

        return classnames.add({
            'config-bottom':
                this.containerPosition === 'topLeft' ||
                this.containerPosition === 'topRight',
        });
    }

    handleWidthSlider(event) {
        this.containerWidth = event.detail.value;
        const css = document.body.style;
        css.setProperty('--containerWidth', `${this.containerWidth}px`);
    }

    handleHeightSlider(event) {
        this.containerHeight = event.detail.value;
        const css = document.body.style;
        css.setProperty('--containerHeight', `${this.containerHeight}px`);
    }

    handleContainerScroll() {
        this.isContainerScroll = !this.isContainerScroll;
    }

    handleViewportScroll() {
        this.isViewportScroll = !this.isViewportScroll;
    }

    handleShadowContainer() {
        this.isUseShadowRootContainer = !this.isUseShadowRootContainer;
        if (this.isUseShadowRootContainer) {
            this.isContainerScroll = false;
        }
    }

    get isContainerScrollDisabled() {
        return this.isUseShadowRootContainer === true;
    }
}
