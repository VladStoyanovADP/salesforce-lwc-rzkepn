---
examples:
    - name: decimal
      label: Decimal Formatting
      description: Decimal numbers default to 3 decimal places. You can change the integer and fraction portions of the decimal number display with several attributes.
    - name: currency
      label: Currency Formatting
      description: Currency numbers default to 2 decimal places. You can change the integer and fraction portions of the currency number display with several attributes. You can change the currency code using the currency-code attribute.
    - name: percent
      label: Percent Formatting
      description: Percentages default to 0 decimal places. You can change the integer and fraction portions of the currency number display with several attributes.
---

A `lightning-formatted-number` component displays formatted numbers for
decimals, currency, and percentages. Use `format-style` to specify the
number style. This component uses the Intl.NumberFormat
JavaScript object to format numerical values.

The locale set in your Salesforce user
settings determines where to display spaces, commas, and periods in numbers, and the currency
used by default. See the **Usage Considerations** section for limitations in some locales.

The component has several attributes to specify how to format numbers.
Among these attributes are `minimum-significant-digits` and
`maximum-significant-digits`. Significant digits refer to the accuracy of a number.
For example, 1000 has one significant digit, but 1000.0 has five significant
digits. By default, `lightning-formatted-number` displays the value 1000.0 as 1000. To display
the decimal and trailing zero, set `minimum-significant-digits` to 5.

```html
<template>
    <lightning-formatted-number value="1000.0" minimum-significant-digits="5">
    </lightning-formatted-number>
</template>
```

Customize the number of decimal places displayed using
`minimum-fraction-digits` and `maximum-fraction-digits`.

Decimal numbers default to 3 decimal places. This example returns `1234.568`.

```html
<template>
    <lightning-formatted-number value="1234.5678"> </lightning-formatted-number>
</template>
```

To display all four decimal places, add the attribute `minimum-fraction-digits="4"`.

```html
<template>
    <lightning-formatted-number value="1234.5678" minimum-fraction-digits="4">
    </lightning-formatted-number>
</template>
```

#### Working with Currencies

Currency numbers default to 2 decimal places. In this example, the formatted number
displays as $5,000.00.

```html
<template>
    <lightning-formatted-number
        value="5000"
        format-style="currency"
        currency-code="USD"
    >
    </lightning-formatted-number>
</template>
```

The `currency-display-as` attribute changes the currency display to use the `symbol`, `code`, or `name` of the currency.

To change the number of decimal places, use one or both of the `minimum-fraction-digits` and `maximum-fraction-digits` attributes.

This example renders `¥4,000`, using `minimum-fraction-digits="0"` to prevent
display of decimals.

```html
<template>
    <lightning-formatted-number
        value="4000"
        format-style="currency"
        currency-code="JPY"
        minimum-fraction-digits="0"
    >
    </lightning-formatted-number>
</template>
```

This example renders `KWD 500.000`, using `minimum-fraction-digits` to ensure
three decimal places are displayed.

```html
<template>
    <lightning-formatted-number
        value="500"
        format-style="currency"
        currency-code="KWD"
        minimum-fraction-digits="3"
    >
    </lightning-formatted-number>
</template>
```

#### Working with Percentages

Specify `format-style="percent"` to display the value multiplied by 100 as a percent value.
Percentages default to 0 decimal places, with rounding. In this example, the formatted number
displays as 50%.

```html
<template>
    <lightning-formatted-number value="0.503" format-style="percent">
    </lightning-formatted-number>
</template>
```

To preserve the decimal points, use the `maximum-fraction-digits` attribute. In this example, the formatted number displays as 50.3%.

```html
<template>
    <lightning-formatted-number
        value="0.503"
        format-style="percent"
        maximum-fraction-digits="1"
    >
    </lightning-formatted-number>
</template>
```

To display the value as-is without multiplying it by 100, specify `format-style="percent-fixed"`.
In this example, the formatted number displays as 1% because decimal places are not displayed by default
and the value is rounded.

```html
<template>
    <lightning-formatted-number value="0.503" format-style="percent-fixed">
    </lightning-formatted-number>
</template>
```

Add the attribute `maximum-fraction-digits="3"` to display the percentage as 0.503%.

```html
<template>
    <lightning-formatted-number
        value="0.503"
        format-style="percent-fixed"
        maximum-fraction-digits="3"
    >
    </lightning-formatted-number>
</template>
```

#### Working with Large Numbers

Large numbers with more than approximately 15 or 16 total digits can't be formatted correctly.
In these cases the unformatted value is shown.

#### Usage Considerations

The locale set in your Salesforce user preferences determines how numbers are formatted. Some locales such as the Arabic (Lebanon) and Bangla (Bangladesh) locales also specify a numeral system other than the Hindu-Arabic numerals 0-9. The org permission “Show Hindu-Arabic Numbers” is intended to override a locale's default numerals. However, `lightning-formatted-number` displays the locale's default numerals even when this permission is enabled in your org. See [Supported Number, Name, and Address Formats (ICU)](https://help.salesforce.com/articleView?id=admin_supported_locales.htm").

The `format-style` attribute is called the `style` attribute in the Aura version of this component.
See [Base Components: Aura Vs Lightning Web Components](https://developer.salesforce.com/docs/platform/lwc/guide/migrate-map-aura-lwc-components).

#### LWC Recipes

The [LWC Recipes GitHub repository](https://github.com/trailheadapps/lwc-recipes) contains code examples for Lightning Web Components that you can test in an org.

For a recipe that uses `lightning-formatted-date-time`, see the `c-misc-shared-javascript` component.
