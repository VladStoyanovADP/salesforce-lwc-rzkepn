---
examples:
    - name: basic
      label: Basic Carousel
      description: A basic carousel with three images.
    - name: autoScroll
      label: Carousel Without Auto Scroll
      description: A carousel with three images, with auto scrolling disabled.
---

A `lightning-carousel` component displays a series of images in a single
container, with image indicators and a control button
below the image panel. Only images passed in `lightning-carousel-image`
components are supported.

Use [`lightning-carousel-image`](bundle/lightning-carousel-image/documentation)
components nested in `lightning-carousel` to specify
up to five images. For each image, optionally provide header and descriptive text
that the carousel displays below the image. You can also hyperlink the images.

The images are displayed in the order you list them in the `lightning-carousel` component.

The carousel displays one image at a time, and you can select particular
images by clicking the indicators. On mobile devices, you can
also swipe an image to scroll to the next image.

By default, the carousel auto scrolls and loops through the images repeatedly.
Each image displays for 5 seconds before the carousel scrolls to the next image.
The control button enables you to pause and restart the automatic scrolling.

#### Changing Carousel Behavior

Disable auto scrolling and remove the control button by including the
`disable-auto-scroll` attribute in the `lightning-carousel` tag. The user
must then use the indicator buttons to display each image.

Disable continuous looping by including the `disable-auto-refresh` attribute. The
images scroll one time through and stop at the last image if you include `disable-auto-refresh`
but not `disable-auto-scroll`.

Change the number of seconds each image displays using the `scroll-duration` attribute.

#### Styling

This component inherits styling from
[carousel](https://www.lightningdesignsystem.com/components/carousel) in the
Lightning Design System.

To implement additional styling for the `lightning-carousel` component, use the Lightning Design
System [utility classes](https://www.lightningdesignsystem.com/utilities/alignment/).

#### Example

This example creates a basic carousel with three images and disables automatic scrolling.

```html
<template>
    <lightning-carousel disable-auto-scroll>
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

#### Accessibility

Use the Tab key to move focus to the carousel, then tab again to focus on the indicator buttons.
Use right and left arrow keys to scroll to the next or previous image.
