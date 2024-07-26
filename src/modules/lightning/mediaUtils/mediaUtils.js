/**
 * Given an input image (as a file handle or a blob) this method will resize
 * and compress the image according to the specified options, and return a Blob
 * object containing the resulting image data.
 *
 * @param {(File|Blob)} input the input image
 * @param {Object} [options] the options to be used when processing the image.
 *        It is an optional parameter containing a number of flags. If this
 *        parameter or any of its flags are omitted, default values will be
 *        used as described below.
 *
 *        resizeMode: A string that determines how the image will be resized.
 *           fill: This is default. The image will be resized to fill the target dimension.
 *                 If necessary, the image will be stretched or squished to fit.
 *           contain: The image keeps its aspect ratio but will be resized to fit within the target dimension.
 *           none: The image will not be resized and will retain its original dimension.
 *
 *        resizeStrategy: A string that determines how to resize the image. If resizeMode is set to 'none' this flag will be ignored.
 *           reduce: Only resize if the image is larger than the target size (smaller images won't be resized)
 *           enlarge: Only resize if the image is smaller than the target size (larger images won't be resized)
 *           always: This is default. Always resize the image to the target size regardless of the original image dimensions.
 *
 *        targetWidth: The target width when resizing an image. If omitted, defaults to the original image width.
 *                  If resizeMode is set to 'none' this flag will be ignored.
 *
 *        targetHeight: The target height when resizing an image. If omitted, defaults to the original image height.
 *                  If resizeMode is set to 'none' this flag will be ignored.
 *
 *        compressionQuality: A number between 0-1 that determines the compression quality. If omitted then the browser/webview  picks
 *                            a default value as it sees fit. Note that this parameter will be considered as a suggested/desired
 *                            compression quality however the browser/webview may choose to override this value if it deems it necessary.
 *                            For example if the value is larger than 1 or if it is considered to be too small by the browser/webview,
 *                            then it will override the value to something that it deems more appropriate.
 *
 *        imageSmoothingEnabled: A boolean that determines whether scaled images are smoothed or not. Defaults to true.
 *
 *        preserveTransparency: A boolean that determines whether the transparency info of the input image (if any) should
 *                              be preserved or not. Defaults to true. If the input image is a GIF/PNG and this flag is set to true
 *                              the output image will be a PNG. For all other cases the output will be a JPEG.
 *
 *        backgroundColor: A string that defines a CSS color as described here: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
 *                         Defaults to white. When preserveTransparency is set to false, the output image will have its background set to
 *                         this color before the input image is resized and drawn on top.
 *
 * @returns {Promise} a promise that resolves to a Blob object containing the output image data.
 */
export function processImage(input, options = null) {
    return readInputData(input)
        .then((dataURL) => loadInputDataIntoImage(dataURL))
        .then((image) => resizeAndCompressImage(image, input.type, options));
}

function readInputData(input) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = (event) => {
            resolve(event.target.result);
        };

        reader.onerror = () => {
            reject(new Error('Unable to read the input data.'));
        };

        try {
            reader.readAsDataURL(input);
        } catch (err) {
            reject(new Error('Unable to read the input data.'));
        }
    });
}

function loadInputDataIntoImage(dataUrl) {
    return new Promise((resolve, reject) => {
        let image = new Image();

        image.onload = function () {
            resolve(image);
        };

        image.onerror = function () {
            reject(new Error('Unable to load the input as an image.'));
        };

        image.src = dataUrl;
    });
}

function getResizeMode(defaultValue, options) {
    let resizeMode = defaultValue;
    if (options && options.resizeMode) {
        resizeMode = `${options.resizeMode}`.toLowerCase().trim();
    }

    if (
        resizeMode === 'fill' ||
        resizeMode === 'contain' ||
        resizeMode === 'none'
    ) {
        return resizeMode;
    }

    throw new Error('Invalid parameter value for resizeMode.');
}

function getResizeStrategy(defaultValue, options) {
    let resizeStrategy = defaultValue;
    if (options && options.resizeStrategy) {
        resizeStrategy = `${options.resizeStrategy}`.toLowerCase().trim();
    }

    if (
        resizeStrategy === 'reduce' ||
        resizeStrategy === 'enlarge' ||
        resizeStrategy === 'always'
    ) {
        return resizeStrategy;
    }

    throw new Error('Invalid parameter value for resizeStrategy.');
}

function getTargetWidth(defaultValue, options) {
    let targetWidth = defaultValue;

    if (options && options.targetWidth) {
        targetWidth = parseFloat(options.targetWidth);
        if (isNaN(targetWidth)) {
            throw new Error('Invalid parameter value for targetWidth.');
        }
    }

    return Math.round(targetWidth);
}

function getTargetHeight(defaultValue, options) {
    let targetHeight = defaultValue;

    if (options && options.targetHeight) {
        targetHeight = parseFloat(options.targetHeight);
        if (isNaN(targetHeight)) {
            throw new Error('Invalid parameter value for targetHeight.');
        }
    }

    return Math.round(targetHeight);
}

function getCompressionQuality(defaultValue, options) {
    let compressionQuality = defaultValue;

    if (options && options.compressionQuality) {
        compressionQuality = parseFloat(options.compressionQuality);
        if (isNaN(compressionQuality)) {
            throw new Error('Invalid parameter value for compressionQuality.');
        }
    }

    return compressionQuality;
}

function getPreserveTransparency(defaultValue, options) {
    if (
        options &&
        options.preserveTransparency !== undefined &&
        options.preserveTransparency !== null
    ) {
        let strVal = `${options.preserveTransparency}`.toLowerCase().trim();

        if (strVal === `true`) {
            return true;
        } else if (strVal === `false`) {
            return false;
        }

        throw new Error('Invalid parameter value for preserveTransparency.');
    }

    return defaultValue;
}

function getImageSmoothingEnabled(defaultValue, options) {
    if (
        options &&
        options.imageSmoothingEnabled !== undefined &&
        options.imageSmoothingEnabled !== null
    ) {
        let strVal = `${options.imageSmoothingEnabled}`.toLowerCase().trim();

        if (strVal === `true`) {
            return true;
        } else if (strVal === `false`) {
            return false;
        }

        throw new Error('Invalid parameter value for imageSmoothingEnabled.');
    }

    return defaultValue;
}

function getBackgroundColor(defaultValue, options) {
    if (options && options.backgroundColor) {
        let strVal = `${options.backgroundColor}`;
        if (CSS.supports('color', strVal)) {
            return strVal;
        }

        throw new Error('Invalid parameter value for backgroundColor.');
    }

    return defaultValue;
}

function computeFinalDimensions(
    originalWidth,
    originalHeight,
    targetWidth,
    targetHeight,
    resizeMode,
    resizeStrategy
) {
    let finalWidth = originalWidth;
    let finalHeight = originalHeight;

    // first check to see if we even need to resize at all
    if (
        resizeMode !== 'none' &&
        (resizeStrategy === 'always' ||
            (resizeStrategy === 'reduce' &&
                (originalWidth > targetWidth ||
                    originalHeight > targetHeight)) ||
            (resizeStrategy === 'enlarge' &&
                (originalWidth < targetWidth || originalHeight < targetHeight)))
    ) {
        // if resizing is needed then compute the final size
        if (resizeMode === 'fill') {
            finalWidth = targetWidth;
            finalHeight = targetHeight;
        } else if (resizeMode === 'contain') {
            let ratio = Math.min(
                targetWidth / originalWidth,
                targetHeight / originalHeight
            );
            finalWidth = Math.round(originalWidth * ratio);
            finalHeight = Math.round(originalHeight * ratio);
        }
    }

    return { finalWidth, finalHeight };
}

function resizeAndCompressImage(image, mimeType, options) {
    return new Promise((resolve, reject) => {
        let resizeMode;
        let resizeStrategy;
        let targetWidth;
        let targetHeight;
        let compressionQuality;
        let imageSmoothingEnabled;
        let preserveTransparency;
        let backgroundColor;

        // parse the options
        try {
            resizeMode = getResizeMode('fill', options);
            resizeStrategy = getResizeStrategy('always', options);
            targetWidth = getTargetWidth(image.width, options);
            targetHeight = getTargetHeight(image.height, options);
            compressionQuality = getCompressionQuality(null, options);
            imageSmoothingEnabled = getImageSmoothingEnabled(true, options);
            preserveTransparency = getPreserveTransparency(true, options);
            backgroundColor = getBackgroundColor('white', options);
        } catch (error) {
            reject(error);
            return;
        }

        let { finalWidth, finalHeight } = computeFinalDimensions(
            image.width,
            image.height,
            targetWidth,
            targetHeight,
            resizeMode,
            resizeStrategy
        );

        // Render the image into a canvas at the calculated final size
        let canvas = document.createElement('canvas');
        canvas.width = finalWidth;
        canvas.height = finalHeight;
        canvas.imageSmoothingEnabled = imageSmoothingEnabled;

        let ctx = canvas.getContext('2d');

        if (!preserveTransparency) {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, finalWidth, finalHeight);
        }

        ctx.drawImage(image, 0, 0, finalWidth, finalHeight);

        let targetType = 'image/jpeg';
        if (
            preserveTransparency &&
            (mimeType === 'image/gif' || mimeType === 'image/png')
        ) {
            targetType = 'image/png';
        }

        let resultFunc = function (blob) {
            resolve(blob);
        };

        // Compress at the specified compression quality and return the final result
        if (compressionQuality) {
            canvas.toBlob(resultFunc, targetType, compressionQuality);
        } else {
            canvas.toBlob(resultFunc, targetType);
        }
    });
}
