To generate a URL or navigate to a page reference, use the `lightning-navigation` service wire adapters and functions.

Note: The playground doesn't support the `lightning-navigation` service.

#### CurrentPageReference

Get a reference to the current page in Salesforce. Page URL formats can change in future releases. To future proof your apps, use page references instead of URLs. Use the page reference to create a deep link to the page.

```javascript
import { CurrentPageReference } from 'lightning/navigation';
@wire(CurrentPageReference)
pageRef;
```

The key-value pairs of the PageReference `state` property are serialized to URL query parameters. To create a deep link that describes the page and that a user can bookmark, update the `state` property. See [Add Query Parameters](https://developer.salesforce.com/docs/platform/lwc/guide/use-navigate-add-params-url).

#### NavigationMixin

Apply the `NavigationMixin` to the component's base class to gain access to its APIs.

```javascript
import { NavigationMixin } from 'lightning/navigation';
export default class MyCustomElement extends NavigationMixin(
    LightningElement
) {}
```

The `NavigationMixin` adds two APIs to your component's class. Invoking these functions before the element is connected to the DOM can have unexpected results.

-   `[NavigationMixin.Navigate](pageReference, [replace])` - A component calls this API to navigate to another page in the application.
-   `[NavigationMixin.GenerateUrl](pageReference)` - A component calls this API to get a `promise` that resolves to the resulting URL. The component can use the URL in the `href` attribute of an anchor. It can also use the URL to open a new window using the `window.open(url)` browser API.

This example shows how to invoke these API methods from `this`:

```javascript
import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class Example extends NavigationMixin(LightningElement) {
    navigateToObjectHome() {
        // Navigate to the Account home page
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Account',
                actionName: 'home',
            },
        });
    }

    recordPageUrl;

    connectedCallback() {
        // Generate a URL to a User record page
        this[NavigationMixin.GenerateUrl]({
            type: 'standard__recordPage',
            attributes: {
                recordId: '005B0000001ptf1IAE',
                actionName: 'view',
            },
        }).then((url) => {
            this.recordPageUrl = url;
        });
    }
}
```

#### LWC Recipes

The [LWC Recipes GitHub repository](https://github.com/trailheadapps/lwc-recipes) contains code examples for Lightning Web Components that you can test in an org.

For a recipe that uses `lightning/navigation`, see the `c-nav-to-*` components in the LWC Recipes repo.

#### See Also

[Navigate to Pages](https://developer.salesforce.com/docs/platform/lwc/guide/use-navigate)

[PageReference Types](https://developer.salesforce.com/docs/platform/lwc/guide/reference-page-reference-type)
