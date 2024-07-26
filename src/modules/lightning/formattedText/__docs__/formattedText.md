---
examples:
    - name: basic
      label: Formatted Text
      description: URLs and email addresses are displayed as links when you specify the linkify attribute. Newline characters are converted to line breaks.
---

A `lightning-formatted-text` component displays a read-only representation of
text, and can convert URLs and email addresses to links, or "linkify" them.
It also converts the `\r` and `\n` characters into `<br />` tags.

By default, URLs and email addresses display as plain text.
To display URLs and email addresses in a block of text as links, include
`linkify` on the `lightning-formatted-text` tag.

`linkify` wraps URLs and email addresses in anchor tags with
`target="_blank"`. If the URL protocol isn't specified in the text,
the link's `href` uses `https://` or `http://` to match the host domain's
protocol. For example, `www.example.com` is prefixed with `https://`
if the host domain's protocol is `https://`. The `href` uses `mailto://`
for email addresses.

This example uses domain names without protocols in the text.

```html
<template>
    <lightning-formatted-text
        value="I like salesforce.com and trailhead.salesforce.com."
        linkify
    >
    </lightning-formatted-text>
</template>
```

The example renders like this.

```html
I like <a target="_blank" href="https://salesforce.com">salesforce.com</a> and
<a target="_blank" href="https://trailhead.salesforce.com"
    >trailhead.salesforce.com</a
>.
```

#### Usage Considerations

`lightning-formatted-text` supports the following protocols: `http`, `https`,
`ftp`, and `mailto`.

If you're working with hyperlinks and want to specify the `target` value, use
`lightning-formatted-url` instead. If you're working with email addresses only,
use `lightning-formatted-email`.

For rich text that uses tags beyond anchor tags, use
`lightning-formatted-rich-text` instead.
