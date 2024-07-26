import { LightningElement, api } from 'lwc';
import { classSet } from 'lightning/utils';
import { getBarcodeScanner } from 'lightning/mobileCapabilities';
import { normalizeString as normalize } from 'lightning/utilsPrivate';

const DEFAULT_SIZE = 'medium';
const SCANNER_ENABLED = 'Scanner enabled';
const SCANNER_DISABLED = 'Scanner disabled';

export default class BarcodeScanner extends LightningElement {
    /**
     * An object representing configuration details for a barcode scanning session.
     * @type {list}
     */
    @api scannerOptions = {
        // include all supported barcode types
        barcodeTypes: [
            'code128',
            'code39',
            'code93',
            'datamatrix',
            'ean13',
            'ean8',
            'itf',
            'upca',
            'upce',
            'pdf417',
            'qr',
        ],
    };
    /**
     * Enables continuous scanning when set to `true`.
     * @default false
     * @type {boolean}
     */
    @api enableContinuousScan = false;
    /**
     * The URL of a custom image for the enabled icon.
     * @default action:scan_enabled
     * @type {string}
     */
    @api enabledIconSrc = '';
    /**
     * The URL of a custom image for the disabled icon.
     * @default action:scan_disabled
     * @type {string}
     */
    @api disabledIconSrc = '';
    /**
     * The size of the barcode scanner icon. Supported  values are `small`, `medium`, and `large`.
     * @default medium
     * @type {string}
     */
    @api iconSize = DEFAULT_SIZE;
    /**
     * Assistive technology text to describe the enabled barcode scanner icon.
     * @default Scanner enabled
     * @type {string}
     */
    @api enabledAlternativeText = SCANNER_ENABLED;
    /**
     * Assistive technology text to describe the disabled barcode scanner icon.
     * @default Scanner disabled
     * @type {string}
     */
    @api disabledAlternativeText = SCANNER_DISABLED;
    /**
     * Disables the barcode scanner button when set to `true`.
     * @default false
     * @type {boolean}
     */
    @api disabled = false;
    _scannerAvailable = false;
    _scannedBarcodes = null;
    _sessionScanner;
    _error = '';
    _hasErrors = false;
    _userDismissedErrorCode = 'USER_DISMISSED';

    //  If user passes the disabled = true, then scannerAvailable will become false and the disabled scanner icon will be rendered
    connectedCallback() {
        const sessionScanner = getBarcodeScanner();
        if (this.disabled) {
            this._scannerAvailable = false;
        } else if (sessionScanner !== null) {
            this._sessionScanner = sessionScanner;
            this._scannerAvailable = sessionScanner.isAvailable();
        }
    }
    isScannerAvailable() {
        return this._scannerAvailable;
    }
    //  Returns the valid size attribute available
    normalizedSize() {
        return normalize(this.iconSize, {
            fallbackValue: DEFAULT_SIZE,
            validValues: ['xx-small', 'x-small', 'small', 'medium', 'large'],
        });
    }
    onmousedown(e) {
        e.preventDefault();
    }
    scan() {
        this.startScanner();
    }
    //  Returns the computed slds button classes as per the passed in size by the user
    get computedButtonClass() {
        const classes = classSet('slds-button');
        classes.add('slds-button_icon');
        const size = this.normalizedSize();
        switch (size) {
            case 'small':
                classes.add('slds-button_icon-small');
                break;
            case 'x-small':
                classes.add('slds-button_icon-x-small');
                break;
            case 'xx-small':
                classes.add('slds-button_icon-xx-small');
                break;
            case 'large':
            case 'medium':
            default:
        }
        return classes.toString();
    }
    /*  This is the heart of the component. It handles the scanning process.
    If enableContinuousScan attribute is false, then it will scan the barcode single time
    If true, it will keep scanning the barcodes continuously */
    startScanner() {
        this._scannedBarcodes = new Set();
        this._hasErrors = false;
        const sessionScanner = this._sessionScanner;
        if (sessionScanner != null && sessionScanner.isAvailable()) {
            sessionScanner
                .beginCapture(this.scannerOptions)
                .then((result) => {
                    this.processScannedBarcode(result);
                    if (this.enableContinuousScan) {
                        this.continueScanning();
                    } else {
                        this.dispatchBarcodes();
                        sessionScanner.endCapture();
                    }
                })
                .catch((error) => {
                    this.handleError(error);
                });
        }
    }
    /* The barcode scanner throws an error on event of manually closing the scanner.
    If error comes because of internal error then error msg will be shown as a toast msg to the user.
    On manual closing, barcodes will be sent to the parent component.   */
    handleError(error) {
        if (error.code !== this._userDismissedErrorCode) {
            this.dispatchError(error);
        } else {
            this.dispatchBarcodes();
        }
        this._sessionScanner.endCapture();
    }
    //  This method will be called if continuous scanning is enabled to perform the continuous scans
    continueScanning() {
        // BarcodeScanner.isAvailable() returns false after endCapture() is called on it
        this._sessionScanner
            .resumeCapture()
            .then((scannedBarcode) => {
                this.processScannedBarcode(scannedBarcode);
                this.continueScanning();
            })
            .catch((error) => {
                this.handleError(error);
            });
    }
    //  This method keeps track of the barcodes scanned in a set
    processScannedBarcode(result) {
        // Do something with the barcode scan value: Either raise event or process here.
        const scannedBarcode = result.value;
        // If user mistakenly scans a product multiple times, then only the first scan will be considered, rest will be rejected here.
        if (this._scannedBarcodes.has(scannedBarcode)) {
            return;
        }
        this._scannedBarcodes.add(scannedBarcode);
    }
    //  When the scanning is finished, this method is called to throw an event 'scan' with scanned barcode values in the detail attribute
    dispatchBarcodes() {
        const scannedBarcodes = [...this._scannedBarcodes];
        const detail = {
            scannedBarcodes,
        };
        const scanEvent = new CustomEvent('scan', {
            cancelable: true,
            detail,
        });
        this.dispatchEvent(scanEvent);
    }
    /*  When there is any error while scanning the barcodes or any other error, this method will be called.
    This method will then throw an event 'errors', which contains the error details */
    dispatchError(error) {
        const detail = {
            error,
        };
        const errorEvent = new CustomEvent('errors', {
            cancelable: true,
            detail,
        });
        this.dispatchEvent(errorEvent);
    }
    get computedSize() {
        return this.normalizedSize();
    }
    get computedEnabledTitle() {
        return this.enabledAlternativeText || '';
    }
    get computedDisabledTitle() {
        return this.disabledAlternativeText || '';
    }
    get enabledIconSrcAvailable() {
        return this.enabledIconSrc !== '';
    }
    get disabledIconSrcAvailable() {
        return this.disabledIconSrc !== '';
    }
}
