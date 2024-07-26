---
examples:
    - name: basic
      label: Formatted Phone Number
      description: Formatted phone numbers displayed in several ways.
---

A `lightning-formatted-phone` component displays a read-only representation of
a phone number as a hyperlink using the `tel:` URL scheme. Clicking the phone
number opens the default VOIP call application on a desktop. On mobile
devices, clicking the phone number calls the number.

If your locale is set to English (United States) or English (Canada), a phone number
with 10 or 11 digits that starts with 1 is displayed in the format (999) 999-9999.

Include a "+" sign before the number to display the number in the format +19999999999 instead.

Here are two ways to display (425) 555-0155 as a hyperlink.

```html
<template>
    <p>
        <lightning-formatted-phone value="4255550155">
        </lightning-formatted-phone>
    </p>
    <p>
        <lightning-formatted-phone value="14255550155">
        </lightning-formatted-phone>
    </p>
</template>
```

The previous example renders the following HTML.

```html
<a href="tel:4255550155">(425) 555-0155</a>
<a href="tel:14255550155">(425) 555-0155</a>
```

Here's how to prevent the US/Canada formatting and display the number with a `+` prefix,
even when your locale is set to one of these locales.

```html
<template>
    <p>
        <lightning-formatted-phone value="+14255550155">
        </lightning-formatted-phone>
    </p>
</template>
```

The previous example renders the following HTML.

```html
<a href="tel:+14255550155">+14255550155</a>
```

To display the phone number in plain text without a hyperlink, include the
`disabled` attribute. Disabling the phone number also prevents setting focus on the phone number using the Tab key.

```html
<template>
    <lightning-formatted-phone
        value="18005551212"
        disabled
    ></lightning-formatted-phone>
</template>
```

#### LWC Recipes

The [LWC Recipes GitHub repository](https://github.com/trailheadapps/lwc-recipes) contains code examples for Lightning Web Components that you can test in an org.

For a recipe that uses `lightning-formatted-phone`, see the following components in the LWC Recipes repo.

-   `c-contact-tile`
-   `c-event-bubbling`
