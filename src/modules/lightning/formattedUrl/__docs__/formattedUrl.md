---
examples:
    - name: basic
      label: Formatted URL
      description: Displays a URL with a protocol such as http:// and https://. A value "/my/path" creates a relative URL.
---

A `lightning-formatted-url` component displays a URL using an anchor `<a>` tag with an `href` attribute. The `value` you provide can be a relative or absolute URL. An absolute URL uses a protocol like `http://`, `https://`, or
`ftp://`, followed by the domain name and path. The component renders the link using the `http://` protocol by default.

URLs without a protocol use the host domain's protocol. For example, `www.example.com` is prefixed with `https://` if the host domain's protocol is `https://`.

To customize the displayed text, provide a `label`. Otherwise,
the URL you pass into `value` is used as the displayed text.

```html
<template>
    <lightning-formatted-url
        value="https://salesforce.com"
        label="Visit salesforce.com"
        target="_blank"
    ></lightning-formatted-url>
</template>
```

The rendered HTML looks like this.

```html
<a href="https://salesforce.com" target="_blank">Visit salesforce.com</a>
```

By default, clicking the link takes you to the URL in the same frame where it was clicked.

#### Creating Absolute URLs

To create an absolute URL, set the `value` attribute using one of these patterns.

-   www.salesforce.com
-   http://www.salesforce.com
-   https://developer.salesforce.com/docs/component-library

`http://` is inserted before a value like `www.salesforce.com` or `my/path`, which does not begin with a slash. This creates an absolute URL like `http://www.salesforce.com` or `http://my/path`. This behavior is contrary to that of the anchor `<a>` tag where omitting the leading slash results in a relative path from the current directory.

This example displays an absolute URL and uses the provided `value` as the `href` value for the `<a>` tag.

```html
<template>
    <lightning-formatted-url value="https://www.salesforce.com">
    </lightning-formatted-url>
</template>
```

If you don't provide a protocol, `http://` is prefixed to the URL by default. The rendered HTML of the previous example
uses `https` because the protocol is specified.

```html
<a href="https://www.salesforce.com">https://www.salesforce.com</a>
```

URLs without a protocol use the host domain's protocol. For example, `www.example.com` is prefixed with `https://` if the host domain's protocol is `https://`.

#### Creating Relative URLs

To create a relative URL, set the `value` attribute using one of these patterns.

-   index.html
-   /my/path
-   ./my/path
-   ../my/path

If the `value` includes a leading slash in the path like `/my/path`, the resulting URL is root-relative and uses the domain of the page as the prefix. For example, if the current page is located on `example.com/directory/`, the resulting URL is `http://example.com/my/path`. To create a URL from the current directory, start the URL with a dot-slash like `./my/path`. To create a URL to the parent directory of the current page, start the URL with dot-dot-slash like `../my/path`.

A relative URL navigates to a path within the current site you're on.

```html
<template>
    <!-- Resolves to http://current-domain/my/path -->
    <lightning-formatted-url value="/my/path"> </lightning-formatted-url>
</template>
```

The rendered HTML looks like this. Clicking the URL takes you to `http://current-domain/my/path`.

```html
<a href="/my/path">/my/path</a>
```

#### Specifying a Target

Use the `target` attribute to change where the link should open. If you don't
provide a target, `lightning-formatted-url` uses the `_self` target value.

Supported `target` values are:

-   `_blank`: Opens the link in a new window or tab. In a mobile hybrid app like the Salesforce mobile app, the link is handled similar to `_self` and opens inside the app if possible.
-   `_self`: Opens the link in the same frame as it was clicked. This is the default behavior. In Lightning Experience and Experience Builder sites, the link is opened in a new tab if it cannot be opened inside the app. We recommend that you use [`lightning-navigation`](bundle/lightning-navigation/documentation) to create links within Lightning Experience and Experience Builder sites.
-   `_parent`: Opens the link in the parent frame. If there's no parent, this is similar to `_self`.
-   `_top`: Opens the link into the top-level browsing context. If there's no parent, this is similar to `_self`.

For more information about link targets, see the [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a).

#### Usage Considerations

We recommend using absolute URLs where possible as they can prevent duplicate content to improve search engine optimization.
Having your internal links as relative URLs can also expose the structure of your website.

`lightning-formatted-url` does not support email addresses or phone numbers. To create an email address with the `mailto:` protocol, use `lightning-formatted-email`.
To create a phone number with the `tel:` protocol, use `lightning-formatted-phone`.

The framework handles navigation for you, so there's no need to provide `onclick`
behavior with `lightning-formatted-url`.

To create a link with a
custom `onclick` event handler, use the HTML anchor tag `<a>` instead. To create a URL that navigates to another page in Salesforce, use
[`lightning-navigation`](bundle/lightning-navigation/documentation).
