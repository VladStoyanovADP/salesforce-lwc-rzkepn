Use the `lightning-carousel-image` component to specify images to display in the
[`lightning-carousel`](bundle/lightning-carousel/documentation) component.
You can specify up to five images. The images are displayed in the order you
list them in the `lightning-carousel` component.

For each image, use the `src` attribute to specify the path to the image.
Optionally use `header` and `description` attributes to provide a header
and descriptive text that the carousel displays below the image.
You can also hyperlink the images with the `href` attribute.

Use the `alternative-text` attribute to supply assistive text for each image.

This component inherits styling from
[carousel](https://www.lightningdesignsystem.com/components/carousel) in the
Lightning Design System.

This example creates a basic carousel with three images.

```html
<template>
    <lightning-carousel>
        <lightning-carousel-image
            src="path/to/carousel-01.jpg"
            header="First card"
            description="First card description"
            alternative-text="This is a card"
            href="https://www.example.com"
        >
        </lightning-carousel-image>
        <lightning-carousel-image
            src="path/to/carousel-02.jpg"
            header="Second card"
            description="Second card description"
            alternative-text="This is a card"
            href="https://www.example.com"
        >
        </lightning-carousel-image>
        <lightning-carousel-image
            src="path/to/carousel-03.jpg"
            header="Third card"
            description="Third card description"
            alternative-text="This is a card"
            href="https://www.example.com"
        >
        </lightning-carousel-image>
    </lightning-carousel>
</template>
```

#### Using Images in Your Org

To use images in your org, upload them as static resources in the Static Resources
page in Setup. To reference a resource in `lightning-carousel-image`, use `{property}`
syntax in your `src` attribute.

If the image path is invalid or the image does not load because the user is
offline or another reason, the description and alternative text are shown in
place of the image.

This example uses static resources uploaded as a single image, and images uploaded in a zip file.

```html
<template>
    <div class="slds-size_1-of-4">
        <lightning-carousel>
            <lightning-carousel-image
                src={companyLogoUrl}
                header="Company logo"
                description="Company logo uploaded to a static resource"
                alternative-text="Company logo"
            >
            </lightning-carousel-image>
            <lightning-carousel-image
                src={product1Url}
                header="Fantastic product 1"
                description="Fantastic product image in a zip file"
                alternative-text="Fantastic product 1"
            >
            </lightning-carousel-image>
            <lightning-carousel-image
                src={product2Url}
                header="Fantastic product 2"
                description="Fantastic product image in a zip file"
                alternative-text="Fantastic product 2"
            >
            </lightning-carousel-image>
        </lightning-carousel>
    </div>
</template>
```

The company logo was uploaded as a single image to a static resource named `company_logo` and imported as `companyLogo`. The Product1 and Product2 images were uploaded in a zip file to a static resource named `company_products` and imported as `companyProducts`.

```js
import { LightningElement } from 'lwc';
import companyLogo from '@salesforce/resourceUrl/company_logo';
import companyProducts from '@salesforce/resourceUrl/company_products';

export default class CarouselStaticResources extends LightningElement {
    // Expose the static resource URL for use in the template
    companyLogoUrl = companyLogo;

    // Expose URL of assets included inside an archive file
    product1Url = companyProducts + '/product1.png';
    product2Url = companyProducts + '/product2.png';
}
```

#### Accessibility

Use the `alternative-text` attribute to specify assistive text for each image.
