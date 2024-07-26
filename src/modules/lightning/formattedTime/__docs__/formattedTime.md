---
examples:
    - name: basic
      label: Formatted Time
      description: Time value displayed in the user's locale format. Include a Z suffix in the time value to indicate Universal Time.
---

A `lightning-formatted-time` component displays a read-only representation of
time in the user's locale format. A valid ISO8601 formatted time string must
be used.

An ISO8601 formatted time string matches one of the following patterns.

-   HH:mm
-   HH:mm:ss
-   HH:mm:ss.SSS

`HH` is the number of hours that have passed since midnight, `mm` is the
number of minutes that have passed since the start of the hour, `ss` is
the number of seconds since the start of the minute, and `SSS` is the number
of milliseconds since the start of the second. Time is always displayed in Universal Time (UTC).

Offsets aren't supported, and the component ignores them. For example, `14:30+05:00` is treated as `14:30`.

The following example returns `10:12:30 PM`.

```html
<template>
    <lightning-formatted-time value="22:12:30.999"> </lightning-formatted-time>
</template>
```

Salesforce uses the format HH:mm:ss.SSSZ for time fields. The time field is a
timestamp without the date included. Time values in Salesforce are not
localized or associated with a time zone.
