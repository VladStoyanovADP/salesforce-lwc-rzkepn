A `lightning-breadcrumb` component displays the path of a page relative to a
parent page. Breadcrumbs are nested in a `lightning-breadcrumbs` component.
Each breadcrumb is actionable and separated by a greater-than sign. The order
the breadcrumbs appear depends on the order they are listed in markup.

Here is an example.

```html
<template>
    <lightning-breadcrumbs>
        <lightning-breadcrumb label="Parent Account" href="path/to/place/1">
        </lightning-breadcrumb>
        <lightning-breadcrumb label="Case" href="path/to/place/2">
        </lightning-breadcrumb>
    </lightning-breadcrumbs>
</template>
```

#### Component Styling

`lightning-breadcrumb` implements the
[breadcrumbs](https://www.lightningdesignsystem.com/components/breadcrumbs/) blueprint in the Salesforce Lightning Design System (SLDS). For more information, see the [`lightning-breadcrumbs`](bundle/lightning-breadcrumbs) documentation.

#### Creating Links Using Breadcrumbs

The behavior of a breadcrumb is similar to a link for the purpose of navigation. If a link is not provided via the `href` attribute, the value defaults to `#`. Since a breadcrumb is used as navigation, we don't recommend leaving out the `href` attribute since `#` links to the same page when middle-clicked or opened in a new tab. 

To provide custom navigation, use an `onclick` handler with `lightning-navigation`. If you provide a link in the `href` attribute, calling `event.preventDefault()` enables you to bypass the link and use your custom navigation instead.

```html
<template>
    <lightning-breadcrumbs>
        <lightning-breadcrumb
            label="Parent Account"
            href="path/to/place/1"
            onclick={handleNavigateToCustomPage1}
        >
        </lightning-breadcrumb>
        <lightning-breadcrumb
            label="Case"
            href="path/to/place/2"
            onclick={handleNavigateToCustomPage2}
        >
        </lightning-breadcrumb>
    </lightning-breadcrumbs>
</template>
```

Handle the `click` events in your JavaScript code.

```javascript
import { LightningElement } from 'lwc';

export default class DemoBreadcrumbs extends LightningElement {

handleNavigateToCustomPage1(event) {
    event.preventDefault();
    //your custom navigation here
}
handleNavigateToCustomPage2(event) {
    event.preventDefault();
    //your custom navigation here
}
```

#### Generating Breadcrumbs with Iteration

Iterate over a list of items using `for:each` to generate breadcrumbs. If you don't provide a link with an `onclick` handler, `href` defaults to `#`.
 
For example, you can create an array of breadcrumbs with label and name
values.

```html
<template>
    <lightning-breadcrumbs>
        <template for:each={myBreadcrumbs} for:item="crumbs">
            <lightning-breadcrumb
                key={crumbs.id}
                label={crumbs.label}
                name={crumbs.name}
                onclick={handleNavigateTo}
            >
            </lightning-breadcrumb>
        </template>
    </lightning-breadcrumbs>
</template>
```

Get the name of the breadcrumb that's clicked using the `event.target` property.

```javascript
//mybreadcrumbs.js
import { LightningElement, track } from 'lwc';

export default class MyComponentName extends LightningElement {
    @track
    myBreadcrumbs = [
        { label: 'Account', name: 'objectName', id: 'account1' },
        { label: 'Record Name', name: 'record', id: 'account2' },
    ];

    handleNavigateTo(event) {
        //get the name of the breadcrumb that's clicked
        const name = event.target.name;
        event.preventDefault();
        //your custom navigation here
    }
}
```

#### Design Guidelines

A breadcrumb shows your location in an app's hierarchy, not your browsing history. Breadcrumbs are especially useful when you need to go to a parent page from another page in the app. They also help you situate yourself in the app.

Breadcrumbs are commonly used in conjunction with a tree for navigating between nested pages. The full hierarchy path is listed on a second or third level page. When you are on a page deeper than three levels, the breadcrumb should display the last two links and truncate the rest of the hierarchy path for simplicity.

#### See Also

[lightning-navigation](bundle/lightning-navigation/documentation)
