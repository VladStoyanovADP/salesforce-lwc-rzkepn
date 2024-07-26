---
examples:
    - name: formatDatesRelativeToNow
      label: Format Dates Relative To Now
      description: Relative time displays how much time has passed or how much time is left until a given time.
---

The `lightning-relative-date-time` component displays relative time that shows
how much time has passed or how much time is left until a given date/time.
It formats the relative time for the current locale following the rules
from [Unicode CLDR](http://cldr.unicode.org/translation/date-time-1/date-time-names).

Use the `value` attribute to pass the date to format.
When you provide a timestamp or JavaScript Date object,
`lightning-relative-date-time` displays a string that describes the relative
time between the current time and the provided time.

The unit of time that's displayed corresponds to how much time has passed since the
provided time, for example, "a few seconds ago" or "5 minutes ago". A given
time in the future returns the relative time, for example, "in 7 months" or
"in 5 years".

This example returns the relative time between the current time and a given
time in the past and future.

```html
<template>
    <div>
        <lightning-relative-date-time value={past}>
        </lightning-relative-date-time>
    </div>
    <div>
        <lightning-relative-date-time value={future}>
        </lightning-relative-date-time>
    </div>
</template>
```

The `past` and `future` attributes return:

-   2 hours ago
-   in 2 days

```javascript
import { LightningElement } from 'lwc';
export default class MyComponentName extends LightningElement {
    get past() {
        return Date.now() - 2 * 60 * 60 * 1000;
    }
    get future() {
        return Date.now() + 2 * 60 * 60 * 1000;
    }
}
```

Other sample output includes:

-   Relative past: a few seconds ago, a minute ago, 2 minutes ago, an hour ago, 2 hours ago, 2 days ago, 2 months ago, 2 years ago
-   Relative future: in a few seconds, in a minute, in 2 minutes, in an hour, in 2 hours, in 2 days, in 2 months, in 2 years in 2 days, in 2 months

The user's language setting in an org determines the language displayed for the units of time. If the locale uses a different language, the output uses the language setting and ignores the locale. For example, if you set the locale to Arabic and the language to English, the output uses digits 0-9 for numbers and English instead of Arabic numerals to be consistent with the language on the user interface. For more information, see [Supported Languages](https://help.salesforce.com/articleView?id=faq_getstart_what_languages_does.htm).

Supported units of time include:

-   seconds
-   minutes
-   hours
-   days
-   months
-   years

To obtain the language and locale information in your org, use the `@salesforce/i18n` scoped module. For more information, see [Access Internationalization Properties](https://developer.salesforce.com/docs/platform/lwc/guide/create-i18n).

#### Usage Considerations

The `lightning-relative-date-time` component is limited to the en-US locale when running in
the Playground and Mini-Playground in the Examples tab of this Component Reference.
