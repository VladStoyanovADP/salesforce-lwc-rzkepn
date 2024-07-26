---
examples:
    - name: basic
      label: Formatted Address
      description: Displays an address that's linked to Google Maps and an address in plain text.
    - name: latitude
      label: Formatted Address with Latitude/Longitude
      description: Displays an address that includes latitude and longitude.
    - name: customLocale
      label: Formatted Address with Custom Locale
      description: Displays an address in the format of a specific locale.
---

A `lightning-formatted-address` component displays addresses in a format and field order
that's determined by the user's Salesforce locale.

Specify a valid address using attributes for `street`, `city`, `country`, `province`, and
`postal-code`.

This example displays an address.

```html
<template>
    <lightning-formatted-address
        street="1 Market St."
        city="San Francisco"
        country="US"
        province="CA"
        postal-code="94105"
    >
    </lightning-formatted-address>
</template>
```

The output looks like this in the en-US locale.

1 Market St.\
San Francisco, CA 94105\
US

By default, the address is displayed as a link that
opens the given location in Google Maps in a new tab. The link
follows the format `https://www.google.com/maps/?q=your+address`.
In the example, the link would be
`https://www.google.com/maps/?q=121%20Spear%20St.%0ASan%20Francisco,%20CA%2094105%0AUS`.

Specify the `disabled` attribute to display the address in plain text
without a link.

#### Specifying Coordinates for Mapping

You can provide the `latitude` and `longitude` attributes in addition to
the address fields. This enables faster map rendering by avoiding the
geocode processing that's required for street addresses on Google Maps.
The formatted address displays the street address fields,
but the link URL uses the latitude and longitude for Google Maps.

This example displays an address and uses latitude and longitude for mapping.

```html
<template>
    <lightning-formatted-address
        street="1 Market St."
        city="San Francisco"
        country="US"
        province="CA"
        postal-code="94105"
        latitude="37.792179"
        longitude="-122.392735"
    >
    </lightning-formatted-address>
</template>
```

The link URL with latitude and longitude follows the format
`https://www.google.com/maps/?q=37.792179,-122.392735`.

#### Showing a Static Map

Use the `show-static-map` attribute to display a map with your address.
The address and the static map are both linked to Google Maps.

```html
<template>
    <lightning-formatted-address
        street="1 Market St."
        city="San Francisco"
        country="US"
        province="CA"
        postal-code="94105"
        show-static-map
    >
    </lightning-formatted-address>
</template>
```
