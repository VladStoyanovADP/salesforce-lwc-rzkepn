import { api, createElement } from 'lwc';
import { classSet } from 'lightning/utils';
import {
    instanceName,
    properties,
    requiredProperties,
} from 'lightning/overlayUtils';
import { SHOW_TOAST_EVENT_NAME } from 'lightning/showToastEvent';
import {
    normalizeNumber,
    normalizeString,
    isCSR,
} from 'lightning/utilsPrivate';
import { createF6Controller } from 'lightning/f6Controller';
import {
    getElementWithFocus,
    returnFocusToElement,
} from 'lightning/focusUtils';
import LightningOverlay from 'lightning/overlay';

const CONSOLE_ERROR_MESSAGES = {
    MISSING_PROPERTY: 'Unable to show toast, missing toast property\'s "{0}"',
    MISSING_CONFIG: 'Unable to show toast, missing toast config.',
    MISSING_TOAST: 'Unable to show toast, missing toast class reference.',
};

const TOAST_POSITION = {
    TOP_CENTER: 'top-center',
    TOP_LEFT: 'top-left',
    TOP_RIGHT: 'top-right',
    BOTTOM_LEFT: 'bottom-left',
    BOTTOM_CENTER: 'bottom-center',
    BOTTOM_RIGHT: 'bottom-right',
};

const CONTAINER_POSITION = {
    ABSOLUTE: 'absolute',
    FIXED: 'fixed',
};

const DEFAULT_CONTAINER_POSITION = CONTAINER_POSITION.FIXED;
const DEFAULT_MAX_TOASTS_SHOWN = 3;
const DEFAULT_TOAST_POSITION = TOAST_POSITION.TOP_CENTER;
const MAX_NUM_GLOBAL_TOAST_CONTAINER = 1;
const globalContainer = [];

const getGlobalContainer = () => {
    return globalContainer[0];
};

const configure = (toastContainer, config) => {
    if (!toastContainer) {
        return;
    }
    const { containerPosition, maxToasts, toastPosition } = config;
    if (maxToasts) {
        toastContainer.maxToasts = maxToasts;
    }
    if (containerPosition) {
        toastContainer.containerPosition = containerPosition;
    }
    if (toastPosition) {
        toastContainer.toastPosition = toastPosition;
    }
};

const CLOSE_EVENT_NAME = 'close';

export default class ToastContainer extends LightningOverlay {
    static [instanceName] = 'lightning-toast-container';
    static [properties] = ['containerPosition', 'maxToasts', 'toastPosition'];

    // container position
    _containerPosition = CONTAINER_POSITION.FIXED;
    // max number of toasts shown at a time
    _maxToasts = DEFAULT_MAX_TOASTS_SHOWN;
    // toast position
    _toastPosition = TOAST_POSITION.TOP_CENTER;
    // store the currently displayed toasts
    _displayToasts = [];
    // store awaiting toasts and their config
    _queue = [];
    // reference to the handler function for ShowToastEvent
    _showToastHandler;

    /**
     * css class for focus trap which is used to control toast container position and the toasts' position.
     * @returns {string} - CSS classes of the toast as a string
     */
    get containerClass() {
        const toastPosition = this._toastPosition.split('-');
        return classSet(
            `slds-grid slds-grid_vertical-reverse toast-container ${toastPosition[0]} ${toastPosition[1]}`
        ).add({
            'slds-is-fixed':
                this.containerPosition === CONTAINER_POSITION.FIXED,
            'slds-is-absolute':
                this.containerPosition === CONTAINER_POSITION.ABSOLUTE,
        });
    }

    /**
     * Controls the position of the toast container <div> related to the containing element. Supported values are 'absolute' and 'fixed'.
     * @type {string}
     * @default fixed
     */
    @api get containerPosition() {
        return this._containerPosition;
    }

    set containerPosition(value) {
        this._containerPosition = normalizeString(value, {
            fallbackValue: DEFAULT_CONTAINER_POSITION,
            validValues: [
                CONTAINER_POSITION.ABSOLUTE,
                CONTAINER_POSITION.FIXED,
            ],
        });
    }

    /**
     * Sets the maximum number of toast components shown at a given time.
     * @type {number}
     * @default 3
     */
    @api get maxToasts() {
        return this._maxToasts;
    }

    set maxToasts(value) {
        this._maxToasts = normalizeNumber(value, {
            fallbackValue: DEFAULT_MAX_TOASTS_SHOWN,
            minValue: 1,
        });
    }

    /**
     * Returns the <div> element that hosts the toast components.
     * @return {HTMLElement}
     */
    get root() {
        return this.template.querySelector('[data-toast-container]');
    }

    /**
     * Controls the position of toast components inside the toast container. Supported values are 'top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', and 'bottom-right'.
     * @type {string}
     * @default top-center
     */
    @api get toastPosition() {
        return this._toastPosition;
    }

    set toastPosition(value) {
        this._toastPosition = normalizeString(value, {
            fallbackValue: DEFAULT_TOAST_POSITION,
            validValues: [
                TOAST_POSITION.TOP_LEFT,
                TOAST_POSITION.TOP_CENTER,
                TOAST_POSITION.TOP_RIGHT,
                TOAST_POSITION.BOTTOM_LEFT,
                TOAST_POSITION.BOTTOM_CENTER,
                TOAST_POSITION.BOTTOM_RIGHT,
            ],
        });
    }

    /**
     * Overrides the "close" function of the toast container.
     */
    @api close() {
        // reset before closing the container
        this.reset();
        super.close();
    }

    // private functions
    connectedCallback() {
        // Set `data-render-mode` attribute in native shadow mode
        if (!this.template.synthetic) {
            this.setAttribute('data-render-mode', 'shadow');
        }
        if (globalContainer.length < MAX_NUM_GLOBAL_TOAST_CONTAINER) {
            this._showToastHandler = this.handleShowToast.bind(this);
            document.body.addEventListener(
                SHOW_TOAST_EVENT_NAME,
                this._showToastHandler
            );
            globalContainer.push(this);
            this.setAriaHidden();
            createF6Controller();
        }
    }

    disconnectedCallback() {
        this.close();
    }

    /**
     * assign allowed property values to an HTMLElement
     * @param {array} allowedProperties array of property names which can have value assigned
     * @param {HTMLElement} element element to assign attribute values
     * @param {object} config a map of attribute -> value
     */
    assignValuesToElement(allowedProperties, element, config) {
        const elementProperties = allowedProperties || [];
        Object.entries(config).forEach(([key, value]) => {
            const keyLower = key.toLowerCase();
            const match = keyLower.match(/^on(.+)/);
            if (match) {
                const eventName = match[1];
                element.addEventListener(eventName, value);
            } else {
                // assign value only to the allowed properties
                if (elementProperties.indexOf(key) > -1) {
                    element[key] = value;
                }
            }
        });
    }

    /**
     * handler function of show toast event
     * @param {Event} event ShowToastEvent
     */
    handleShowToast(event) {
        event.stopPropagation();
        const params = this.validateToastParameters(event);
        if (!params) {
            return;
        }
        // enqueue the toast and config
        this._queue.push(params);
        // show toast if any
        this.showNextToast();
    }

    /**
     * handler function of [toast] close event
     * @param {HTMLElement} element the closed toast component
     */
    handleToastClose(closedToast, event) {
        let toastIndex = -1;
        let source;

        // remove the closed toast from the DOM
        this._displayToasts = this._displayToasts.filter(
            ({ toastElement, sourceElement }, index) => {
                if (toastElement === closedToast) {
                    toastIndex = index;
                    source = sourceElement;
                    return false;
                }
                return true;
            }
        );

        this.root.removeChild(closedToast);
        // show next toast if any
        this.showNextToast();

        // if the closed toast does not have focus, do nothing
        if (!event.detail.isFocused) {
            return;
        }
        // closed toast also is the focused toast, thus move focus to the next toast if any
        const nextToast =
            toastIndex > -1 &&
            toastIndex < this._displayToasts.length &&
            this._displayToasts[toastIndex].toastElement;
        if (nextToast && nextToast.isConnected) {
            nextToast.focus();
            return;
        }
        // no toast to focus, return focus to the source component which triggered the toast which was closed.
        returnFocusToElement(source);
    }

    /**
     * handler function for registering a toast to the container
     * @param {CustomEvent} event
     */
    handleToastRegister(event) {
        const { target: toastElement, detail } = event;
        const { unregisterCallback } = detail;
        const toastCloseHandler = this.handleToastClose.bind(
            this,
            toastElement
        );

        // add the close event listener to the toast element
        toastElement.addEventListener(CLOSE_EVENT_NAME, toastCloseHandler);
        unregisterCallback(() => {
            // remove the close event listener when unregistering the toast from the container
            toastElement.removeEventListener(
                CLOSE_EVENT_NAME,
                toastCloseHandler
            );
        });
    }

    /**
     * set aria-hidden attribute to true if there is no toasts
     */
    setAriaHidden() {
        const ariaHiddenValueToSet = !this._displayToasts.length;
        if (this.template.host.ariaHidden !== ariaHiddenValueToSet) {
            this.template.host.ariaHidden = ariaHiddenValueToSet;
        }
    }

    /**
     * show the next toast component(s) if any
     */
    showNextToast() {
        while (
            this._queue.length &&
            this._displayToasts.length < this._maxToasts
        ) {
            const { toast, config, sourceElement } = this._queue.shift();
            // create the toast component
            const {
                [instanceName]: toastInstanceName,
                [properties]: toastProperties,
            } = toast;
            const toastElement = createElement(toastInstanceName, {
                is: toast,
            });

            this.assignValuesToElement(toastProperties, toastElement, config);
            this._displayToasts.push({ toastElement, sourceElement });
            this.root.appendChild(toastElement);
        }
        this.setAriaHidden();
    }

    /**
     * reset function to be called if the container is no longer used or detached from the DOM
     */
    reset() {
        if (this._showToastHandler) {
            document.body.removeEventListener(
                SHOW_TOAST_EVENT_NAME,
                this._showToastHandler
            );
            this._showToastHandler = null;
        }
        globalContainer.splice(0, globalContainer.length);
        this._containerPosition = CONTAINER_POSITION.FIXED;
        this._maxToasts = DEFAULT_MAX_TOASTS_SHOWN;
        this._toastPosition = TOAST_POSITION.TOP_CENTER;
        // remove toasts if any
        this.root.childNodes.forEach((node) => {
            this.root.removeChild(node);
        });
        this._displayToasts = [];
        this._queue = [];
    }

    /**
     * retrieve toast config constructed in platformShowToastEvent
     * @param {object} toastAttributes toast config defined by platformShowToastEvent
     */
    retrievePlatformShowToastConfig(toastAttributes, detail) {
        const { title, message, messageData, mode, type } = toastAttributes;
        const toast = detail.toast || undefined;
        return {
            config: {
                label: title,
                message,
                messageLinks: messageData,
                mode,
                variant: type,
            },
            toast,
            source: undefined,
        };
    }

    /**
     * retrieve toast config constructed in Toast.show()
     * @param {*} detail
     * @returns
     */
    retrieveShowToastConfig(detail) {
        // this toast config is created from Toast.show() i.e. lightningShowToastEvent
        const config = { ...detail };
        const toast = detail.toast || undefined;
        const source = detail.source || undefined;
        delete config.toast;
        delete config.source;
        return { config, toast, source };
    }

    /**
     * validate function to check if config, toast, source have the necessary attributes needed
     */
    validateToastParameters(event) {
        const sourceElement = getElementWithFocus();
        const { toastAttributes, detail } = event;
        let convertedConfig;
        // convert the platformShowToastEvent's toast config to the new format consumed by Toast
        // this handles the case when platformShowToastEvent is dispatched
        if (toastAttributes && detail) {
            convertedConfig = this.retrievePlatformShowToastConfig(
                toastAttributes,
                detail
            );
        } else if (detail) {
            // this toast config is created from Toast.show() i.e. lightningShowToastEvent
            convertedConfig = this.retrieveShowToastConfig(detail);
        }

        if (!convertedConfig) {
            console.error(CONSOLE_ERROR_MESSAGES.MISSING_CONFIG);
            return undefined;
        }

        const { config, toast, source } = convertedConfig;
        if (!toast) {
            console.error(
                'Unable to show toast, missing toast class reference.'
            );
            return undefined;
        }
        const { [requiredProperties]: toastRequiredProps } = toast;
        if (toastRequiredProps) {
            const missingPropertyName = toastRequiredProps.find((property) => {
                if (
                    !Object.prototype.hasOwnProperty.call(config, property) ||
                    !config[property]
                ) {
                    return property;
                }
                return undefined;
            });
            if (missingPropertyName) {
                console.error(
                    CONSOLE_ERROR_MESSAGES.MISSING_PROPERTY.replace(
                        '{0}',
                        missingPropertyName
                    )
                );
                return undefined;
            }
        }
        return { config, toast, source, sourceElement };
    }

    /**
     * create a page level toast container, if it does not exist or return the existing one
     * @param {object} config map of attributes -> value to set the toast container's public attributes
     * @returns {ToastContainer} instance of the toast container
     */
    static instance(config = {}) {
        if (isCSR) {
            // create a instance if container does not exist
            if (globalContainer.length < MAX_NUM_GLOBAL_TOAST_CONTAINER) {
                ToastContainer.open(config);
                return getGlobalContainer();
            }
            let toastContainer = getGlobalContainer();
            if (!toastContainer.isConnected) {
                // remove the container if it does not attached to the DOM anymore
                toastContainer.close();
                toastContainer = null;
                // create a new one and returns it
                ToastContainer.open(config);
                return getGlobalContainer();
            }
            // set container attribute if already exists
            configure(toastContainer, config);
            return toastContainer;
        }
        // Return an empty object in the server context, any property assignments will be harmless
        return {};
    }
}
