import { LightningResizeObserver } from 'lightning/resizeObserver';
import { isTableRenderedVisible } from './columnResizer';

const WIDTH_OBSERVER_SELECTOR = '.dt-width-observer';

export class LightningDatatableResizeObserver {
    _connected = false;

    /**
     * Create either a standard ResizeObserver via LightningResizeObserver.
     */
    constructor(dt, resizeCallback) {
        const resizeTarget =
            dt.refs?.widthObserver ||
            dt.template.querySelector(WIDTH_OBSERVER_SELECTOR);
        // Create ResizeObserver and begin observing for changes.
        // Calculate and modify the column widths when there are changes to the dimensions
        // and when the table is rendered and visible on screen.
        this._resizeObserver = new LightningResizeObserver(() => {
            const { refs, template } = dt;
            if (this._connected && isTableRenderedVisible(template, refs)) {
                resizeCallback();
            }
        });
        this._resizeObserver.observe(resizeTarget);
        this._connected = true;
    }

    // Begins observing the specified element for changes in dimension
    observe(template, refs) {
        const targetElement =
            refs?.widthObserver ||
            template.querySelector(WIDTH_OBSERVER_SELECTOR);

        if (this._resizeObserver) {
            this._resizeObserver.observe(targetElement);
        } else if (this._resizeSensor) {
            this._resizeSensor.reattach(targetElement);
        }

        this._connected = true;
    }

    // Stops observing any/all observed elements for changes in dimension
    disconnect() {
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
        } else if (this._resizeSensor) {
            this._resizeSensor.detach();
            this._resizeSensor = undefined;
        }

        this._connected = false;
    }

    isConnected() {
        return this._connected;
    }
}
