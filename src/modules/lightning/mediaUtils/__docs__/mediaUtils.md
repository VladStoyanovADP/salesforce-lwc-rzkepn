The `mediaUtils` library contains utility functions that can be used by an LWC developer to process media files. The following functions are contained in the `mediaUtils` library:

## processImage

You can use `processImage` function to resize and compress image files. To use this function, simply import it in your LWC first:
```
import { processImage } from 'lightning/mediaUtils';
```

You can then call this function by passing in an input image and a set of options to be used to process the input image, as further described below. It will return a promise that will resolve to a `Blob` object containing the output image data.

#### Parameters

* `input`: Defines the input image, which can either be a `File` or `Blob` object
* `options`: An object that defines the options to be used when processing the input image. It is an optional parameter containing a number of flags. If this parameter or any of its flags are omitted, default values will be used as further described below.
    * `resizeMode`: A string that determines how the image will be resized. It can contain one of the below values
        * `fill`: This is default. The image will be resized to fill the target dimension. If necessary, the image will be stretched or squished to fit.
        * `contain`: The image keeps its aspect ratio but will be resized to fit within the target dimension.
        * `none`: The image will not be resized and will retain its original dimension.
    * `resizeStrategy`: A string that determines how to resize the image. If `resizeMode` is set to `none` this flag will be ignored.
        * `reduce`: Only resize if the image is larger than the target size (smaller images won't be resized).
        * `enlarge`: Only resize if the image is smaller than the target size (larger images won't be resized).
        * `always`: This is default. Always resize the image to the target size regardless of the original image dimensions.
    * `targetWidth`: The target width when resizing an image. If omitted, defaults to the original image width. If `resizeMode` is set to `none` this flag will be ignored.
    * `targetHeight`: The target height when resizing an image. If omitted, defaults to the original image height. If `resizeMode` is set to `none` this flag will be ignored.
    * `compressionQuality`: A number between 0-1 that determines the compression quality. If omitted then the browser/webview picks a default value as it sees fit. Note that this parameter will be considered as a suggested compression quality, however the browser/webview may choose to override this value if it deems it necessary. For example if the value is larger than 1 or if it is considered to be too small by the browser/webview, then it will override the value to something that it deems more appropriate.
    * `imageSmoothingEnabled`: A boolean that determines whether scaled images are smoothed or not. Defaults to `true`.
    * `preserveTransparency`: A boolean that determines whether the transparency info of the input image (if any) should be preserved or not. Defaults to `true`. If the input image is a GIF/PNG and this flag is set to `true` the output image will be a PNG. For all other cases the output will be a JPEG.
    * `backgroundColor`: A string that defines a CSS color as described [here](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value). Defaults to `white`. When `preserveTransparency` is set to `false`, the output image will have its background set to this color before the input image is resized and drawn on top.

#### Example

As an example, consider the scenario where you would like to upload files to a Salesforce org using a [`lightning-input`](bundle/lightning-input/documentation) component. In your HTML code, you may have:
```
.
.
.
<lightning-input
    type="file"
    label="Select Files to Upload"
    accept="image/*"
    multiple
    onchange={handleFilesSelected}>
</lightning-input>
.
.
.
```

In your Javascript file, you can now use `processImage` from `mediaUtils`, for example to reduce image sizes and hence reduce the bandwidth used to upload the images, as illustrated below:
```
import { processImage } from 'lightning/mediaUtils';
.
.
.
async handleFilesSelected(event) {
    try {
        // Using the below options we resize images to a maximum of 2048x2048 pixels
        // while containing their aspect ratio. By setting 'resizeStrategy' to 'reduce'
        // we ensure that only images that have either width or height larger than
        // 2048 pixels will be resized. Moreover, we've chosen not to preserve transparency
        // in the input images and instead convert transparent pixels to white. Lastly,
        // the images will be compressed with a 75% compression quality to reduce their byte size.
        let options = {
            resizeMode: 'contain',
            resizeStrategy: 'reduce',
            targetWidth: 2048,
            targetHeight: 2048,
            compressionQuality: 0.75,
            imageSmoothingEnabled: true,
            preserveTransparency: false,
            backgroundColor: 'white'
        };

        for (const file of event.target.files) {
            let blob = await processImage(file, options);
            // here we can upload the data contained in the blob that is returned by processImage
        }
    } 
    catch (error) {
        console.error("ERROR: ", error)
    }
}
.
.
.
```
