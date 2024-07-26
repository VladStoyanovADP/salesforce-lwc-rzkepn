The `lightning-barcode-scanner` component embeds a barcode scanning function displayed as an icon, which launches the barcode scanner when the user clicks it. For more information on the the API this component uses, see [Use the BarcodeScanner API](https://developer.salesforce.com/docs/platform/lwc/guide/use-barcodescanner-in-a-lightning-component) in the Lightning Web Components Developer Guide.

```html
<template>
  <lightning-barcode-scanner> </lightning-barcode-scanner>
</template>
```

To disable the barcode scanner, set the `disabled` attribute. The barcode scanner is enabled by default.

```html
<template>
  <lightning-barcode-scanner disabled> </lightning-barcode-scanner>
</template>
```

#### Scanning Modes

Barcode scanning supports both single scan and continuous scan. A single scan component automatically closes after one successful scan, while a continuous scan component remains open. The `lightning-barcode-scanner` component is single scan by default.

To enable continuous scanning, set the `enable-continuous-scan` attribute.

```html
<template>
  <lightning-barcode-scanner enable-continuous-scan>
  </lightning-barcode-scanner>
</template>
```

#### Scanner Options

The BarcodeScanner API for `lightning-barcode-scanner` supports various scanner options. For the list of barcode scanner option properties, see [BarcodeScannerOptions](https://developer.salesforce.com/docs/platform/lwc/guide/reference-lightning-barcodescanner-data-types) in the Lightning Web Components Developer Guide.

You can configure various scanner options for a scanning session. For example, if you want your component to support only a specific set of barcode types, specify the types as a list in the `barcodeTypes` property. If you want to modify the size of the scanner camera view, specify the size in the `scannerSize` property. In this example, the barcode scanner supports only the specified types `CODE_128`,`EAN_13`, and `QR`, and will ignore the other types, and the barcode scanner camera view is changed to `LARGE`.

```html
<template>
  <lightning-barcode-scanner scanner-options={myScannerOptions}>
  </lightning-barcode-scanner>
</template>
```

```javascript
const myScannerOptions = {
  barcodeTypes: ["CODE_128", "QR", "EAN_13"],
  scannerSize: "LARGE",
};
```

#### Icons

To specify an icon size for the barcode scanner component, set the `icon-size` attribute. By default, the `icon-size` is medium.

```html
<template>
  <lightning-barcode-scanner icon-size="large"> </lightning-barcode-scanner>
</template>
```

To set custom assistive technology text for the component icon in its enabled and disabled state, set the `enabled-alternative-text` and `disabled-alternative-text` attributes.

```html
<template>
  <lightning-barcode-scanner
    enabled-alternative-text="Alt text for the enabled icon"
    disabled-alternative-text="Alt text for the disabled icon"
  >
  </lightning-barcode-scanner>
</template>
```

You can also create a custom icon for the component by specifying images and alternative texts to use in the component's enabled and disabled states.

To use a custom image for the barcode scanner icon, set the `enabled-icon-src` and `disabled-icon-src` attributes to image paths in the `staticResource` folder. This example uses custom image for the component's icon enabled and disabled states.

```html
<template>
  <lightning-barcode-scanner
    enabled-icon-src="path/to/staticResource/enabled_image"
    enabled-alternative-text="Alt text for the custom enabled icon"
    disabled-icon-src="path/to/staticResource/disabled_image"
    disabled-alternative-text="Alt text for the custom disabled icon"
  >
  </lightning-barcode-scanner>
</template>
```

#### Custom Events

The `lightning-barcode-scanner` component supports two events, `scan` and `error`.

The `scan` event is triggered by a successful scan on a single scan component or by successfully closing the scanner window on a  multiple scan component. It returns this parameter.

| Parameter       | Type | Description                           |
| --------------- | ---- | ------------------------------------- |
| scannedBarcodes | list | Returns an array of scanned barcodes. |

The `scan` event has these properties.

| Property   | Value | Description                                                                                                          |
| ---------- | ----- | -------------------------------------------------------------------------------------------------------------------- |
| bubbles    | false | This event does not bubble.                                                                                          |
| cancelable | true  | This event can be canceled. You can call `preventDefault()` on this event to prevent firing the click event. |
| composed   | false | This event does not propagate outside the template in which it was dispatched.                                               |

The `errors` event is triggered if there is an error during the scan. The event contains the error details. It returns this parameter.

| Parameter | Type   | Description                |
| --------- | ------ | -------------------------- |
| error     | object | Returns the error details. |

The `errors` event has these properties.

| Property   | Value | Description                                                                                                          |
| ---------- | ----- | -------------------------------------------------------------------------------------------------------------------- |
| bubbles    | false | This event does not bubble.                                                                                          |
| cancelable | true  | This event can be canceled. You can call `preventDefault()` on this event to prevent firing the click event. |
| composed   | false | This event does not propagate outside the template in which it was dispatched.                                               |
