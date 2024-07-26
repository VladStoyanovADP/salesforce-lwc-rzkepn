A `lightning-formatted-rich-text` component is a read-only representation of
rich text. Rich text refers to text that's formatted by HTML tags, such as
`<strong>` for bold text or `<u>` for underlined text. You can pass in rich text to
this component using the `lightning-input-rich-text` component or
programmatically in JavaScript.

By default, the component creates links automatically for linkable text and email addresses. For example, if the input is "Go to salesforce.com", `lightning-formatted-rich-text` creates a link so the output is "Go to [salesforce.com](https://www.salesforce.com/)". Email addresses display using the `mailto:` protocol.
To display links and email addresses in plain text, specify the `disable-linkify` attribute.

This example creates a rich text editor that's wired up to a
`lightning-formatted-rich-text` component. The rich text content is set during
initialization.

```html
<template>
    <!-- Rich text editor and formatted output -->
    <lightning-input-rich-text
        value={richtext}
        onchange={handleChange}
    ></lightning-input-rich-text>
    <lightning-formatted-rich-text
        value={richtext}
    ></lightning-formatted-rich-text>
</template>
```

```javascript
import { LightningElement } from 'lwc';
export default class MyComponentName extends LightningElement {
    richtext = '<h2>Default <s>Value</s></h2>';

    handleChange(e) {
        this.richtext = e.detail.value;
    }
}
```

To use double quotes in your value definitions, escape them using the `\`
character.

```javascript
import { LightningElement } from 'lwc';
export default class MyComponentName extends LightningElement {
    richtext = "<h2 style=\"text-align: center\">Default <s>Value</s></h2>";

    ...
}
```

To pass in HTML tags in your component markup, escape the tags like this.

```html
<template>
    <lightning-formatted-rich-text value="&lt;h1>TEST&lt;/h1>">
    </lightning-formatted-rich-text>
</template>
```

#### Supported HTML Tags and attributes

The component sanitizes HTML tags passed to the `value` attribute to prevent
XSS vulnerabilities. It also ensures that the formatted output is valid HTML.
For example, if you have mismatched tags like `<div>My Title</h1>`, the
component returns `<div>My Title</div>`.

If you set unsupported tags via JavaScript, those tags are
removed and the text content is preserved. The supported HTML tags are: `a`,
`abbr`, `acronym`, `address`, `br`, `big`, `blockquote`, `caption`,
`cite`, `code`, `col`, `colgroup`, `del`, `div`, `dl`, `dd`, `dt`, `em`,
`font`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `hr`, `img`, `ins`, `kbd`,
`li`, `ol`, `mark`, `p`, `param`, `pre`, `q`, `s`, `samp`, `small`, `span`, 
`strong`, `sub`, `sup`, `table`, `tbody`, `td`, `tfoot`, `th`, `thead`, `tr`, 
`tt`, `u`, `ul`, `var`, `strike`.

Supported HTML attributes include: `accept`, `action`, `align`, `alt`,
`autocomplete`, `background`, `bgcolor`, `border`, `cellpadding`,
`cellspacing`, `checked`, `cite`, `class`, `clear`, `color`, `cols`,
`colspan`, `coords`, `data-fileid`, `datetime`, `default`, `dir`, `disabled`,
`download`, `enctype`, `face`, `for`, `headers`, `height`, `hidden`, `high`,
`href`, `hreflang`, `id`, `ismap`, `label`, `lang`, `list`, `loop`, `low`,
`max`, `maxlength`, `media`, `method`, `min`, `multiple`, `name`, `noshade`,
`novalidate`, `nowrap`, `open`, `optimum`, `pattern`, `placeholder`, `poster`,
`preload`, `pubdate`, `radiogroup`, `readonly`, `rel`, `required`, `rev`,
`reversed`, `rows`, `rowspan`, `spellcheck`, `scope`, `selected`, `shape`,
`size`, `span`, `srclang`, `start`, `src`, `step`, `style`, `summary`,
`tabindex`, `target`, `title`, `type`, `usemap`, `valign`, `value`, `width`,
`xmlns`.

The HTML tags `b` and `i` aren't supported. This component converts the `b` tags to `strong` and `i` tags to `em` for screen reader accessibility. Other unsupported tags and attributes are removed, and only their text content is displayed. 

We recommend using the `h1` to `h6` elements for headings and use `mark` to highlight text. For more information, see the [W3C recommendations](https://www.w3.org/TR/html52/textlevel-semantics.html).

#### Supported Protocols

`lightning-formatted-rich-text` supports the following protocols.

-   ftp
-   ftps
-   http
-   https
-   mailto
-   tel
-   callto
-   cid
-   xmpp
-   ciscotel
-   navision

URLs such as `www.salesforce.com` or `salesforce.com` are also displayed as links. All links, including those that don't include a protocol, are displayed using the anchor tag with a target value of `_blank`. To display links with other target values, use [lightning-formatted-url](bundle/lightning-formatted-url/) instead.

Encode parenthesis characters for URL links. Use `%28` for the opening parenthesis `(` and `%29` for the closing parenthesis `(`. Parenthesis characters that aren't URL encoded break the URL link.

#### Usage Considerations

Formatting of list items for ordered and unordered lists varies across browsers. In particular, indents and alignment styles applied to lists in rich text don't render the same in `lightning-formatted-rich-text` across all browsers. See [list-style-position on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-position).
