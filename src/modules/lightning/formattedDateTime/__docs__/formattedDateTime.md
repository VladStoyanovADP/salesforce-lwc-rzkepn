---
examples:
    - name: date
      label: Date Formatting
      description: Several ways to display formatted dates.
    - name: time
      label: Time Formatting
      description: Various ways to format time.
    - name: datetime
      label: Date and Time Formatting
      description: Use a combination of the year, month, day, hour, and minute attributes, among others, to customize date and time.
---

A `lightning-formatted-date-time` component displays formatted date and time.
This component uses the Intl.DateTimeFormat JavaScript object to format date
values. The locale set in the Salesforce user preferences determines the
default formatting. The following input values are supported.

-   Date object
-   ISO8601 formatted string
-   Timestamp

An ISO8601 formatted string matches one of the following patterns.

-   YYYY
-   YYYY-MM
-   YYYY-MM-DD
-   YYYY-MM-DDThh:mmTZD
-   YYYY-MM-DDThh:mm:ssTZD
-   YYYY-MM-DDThh:mm:ss.sTZD

`YYYY` is the year in the Gregorian calendar, `MM` is the month between 01 and
12, and `DD` is the day between 01 and 31. `hh` is the number of hours that
have passed since midnight, `mm` is the number of minutes that have passed
since the start of the hour, and `ss` is the number of seconds since the start
of the minute.

`TZD` is the time zone designator, like `Z`, `+hh:mm` or `-hh:mm`. To indicate
that a time is measured in Universal Time (UTC), append a `Z` to a time.

#### Default Formatting

When no attributes other than `value`
are specified, the component uses the default date format based on the user's locale in Salesforce.

The locale determines the order and format of the month, day, and year. For example, the English (United States) locale's date format is Oct 14, 2020 and the French (France) locale's date format is 14 Oct 2020. The locale doesn't determine the time zone. Time zone is a separate setting.

The locale also determines whether to display time as 24-hour time or 12-hour time with AM and PM. You can override the locale default with the `hour12` attribute. See _Date and Time Display Examples_ for more information.

Specify optional attributes listed in the Specification tab to modify the date and time display, overriding the locale's default formatting.

In the Mini-Playground in the Examples tab, the component is limited to the en-US locale.

#### Time Zone Considerations

Two different attributes affect the time zone display.

The `time-zone-name` attribute specifies how to display the time zone. Set it to `short` to display
a code such as EST, or `long` to display a description such as Eastern Standard Time.

The `time-zone` attribute sets a particular time zone to use to display the date and time,
instead of the user device's time zone setting. Specify a
time zone from the [IANA Time Zone Database](https://www.iana.org/time-zones), such as
`America/New_York`, `Europe/London`, or `Asia/Tokyo`. You cannot use a time zone short code such as
EST to set the `time-zone` attribute. You can use the code UTC however, as it's the only short code that browsers
must recognize.

When using the component to display a date only, without time, include `time-zone="UTC"` to ensure the correct date displays
in all time zones. This is especially important if you specify a timestamp for the `value`. Because timestamps contain time and date information, the component converts the date to the time zone in effect on the user's device and then displays the date.

#### Date and Time Display Examples

Here are some examples based on a locale of en-US.

Displays: Jan 11, 2019

```html
<template>
    <lightning-formatted-date-time value="1547250828000" time-zone="UTC">
    </lightning-formatted-date-time>
</template>
```

Displays: Friday, Jan 11, 19

```html
<template>
    <lightning-formatted-date-time
        value="1547250828000"
        year="2-digit"
        month="short"
        day="2-digit"
        weekday="long"
        time-zone="UTC"
    >
    </lightning-formatted-date-time>
</template>
```

Displays: 1/11/2019, 3:53 PM PST (if user is in PST time zone)

```html
<template>
    <lightning-formatted-date-time
        value="1547250828000"
        year="numeric"
        month="numeric"
        day="numeric"
        hour="2-digit"
        minute="2-digit"
        time-zone-name="short"
    >
    </lightning-formatted-date-time>
</template>
```

Displays: 1/11/2019, 6:53 PM EST

```html
<template>
    <lightning-formatted-date-time
        value="1547250828000"
        year="numeric"
        month="numeric"
        day="numeric"
        hour="2-digit"
        minute="2-digit"
        time-zone-name="short"
        time-zone="America/New_York"
    >
    </lightning-formatted-date-time>
</template>
```

Displays: 1/11/2019, 18:53 EST

```html
<template>
    <lightning-formatted-date-time
        value="1547250828000"
        year="numeric"
        month="numeric"
        day="numeric"
        hour="2-digit"
        hour12={ampm}
        minute="2-digit"
        time-zone-name="short"
        time-zone="America/New_York"
    >
    </lightning-formatted-date-time>
</template>
```

Set the `hour12` attribute using a variable. If set to `false` or any other string directly, the component interprets its value as true.

```js
import { LightningElement } from 'lwc';

export default class FormattedDateTimeHour12 extends LightningElement {
    ampm = false;
}
```

#### Date and Time Stored in Salesforce

Salesforce uses the ISO8601 format `YYYY-MM-DD` to store date fields, which store a date without time, and includes no time zone information.
When formatting dates without time, include `time-zone="UTC"` to ensure the correct date displays.

Salesforce uses the ISO8601 format `YYYY-MM-DDThh:mm:ss.SZ` for date/time fields, which stores date/time in UTC.

Assuming a user is in the en-US locale and Pacific time zone, here are two examples for a date field with
the value `1965-04-09`.

Displays: Apr 9, 1965

```html
<template>
    <lightning-formatted-date-time value={contact.Birthdate} time-zone="UTC">
    </lightning-formatted-date-time>
</template>
```

Displays: April 09, 1965

```html
<template>
    <lightning-formatted-date-time
        value={contact.Birthdate}
        year="numeric"
        day="2-digit"
        month="long"
        time-zone="UTC"
    >
    </lightning-formatted-date-time>
</template>
```

Assuming an en-US locale and a Pacific time zone,
here's an example for a date/time field with the value
`2017-12-03T20:00:00.000+00:00`.

Displays: December 03, 2017, 12:00 PM

```html
<template>
    <lightning-formatted-date-time
        value={contact.Next_Meeting__c}
        year="numeric"
        day="2-digit"
        month="long"
        hour="2-digit"
        minute="2-digit"
    >
    </lightning-formatted-date-time>
</template>
```

#### Usage Considerations

This component has usage differences from its Aura counterpart. See [Base Components: Aura Vs Lightning Web Components](https://developer.salesforce.com/docs/platform/lwc/guide/migrate-map-aura-lwc-components) in the Lightning Web Components Developer Guide.

#### LWC Recipes

The [LWC Recipes GitHub repository](https://github.com/trailheadapps/lwc-recipes) contains code examples for Lightning Web Components that you can test in an org.

For a recipe that uses `lightning-formatted-date-time`, see the `c-clock` component.
