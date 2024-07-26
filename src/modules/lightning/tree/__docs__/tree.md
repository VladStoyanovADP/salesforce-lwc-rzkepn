---
examples:
    - name: basic
      label: Basic Tree
      description: A simple tree with several levels that you can expand and collapse.
    - name: metatext
      label: Nested Tree With Metatext
      description: Metatext adds text below the item label.
    - name: deeplyNested
      label: Deeply Nested Tree
      description: A tree can have muliple levels of nested branches.
    - name: onselect
      label: Tree With onselect Handler
      description: Use the onselect event handler to retrieve the selected item in the tree.
    - name: links
      label: Tree With Links
      description: Trees can be used for navigation by providing href attributes with the items.
---

A `lightning-tree` component displays visualization of a structural hierarchy,
such as a sitemap for a website or a role hierarchy in an organization. Items
are displayed as hyperlinks and items in the hierarchy can be nested. Items
with nested items are also known as branches.

This component inherits styling from
[trees](https://www.lightningdesignsystem.com/components/trees/) in the
Lightning Design System.

To create a tree, pass in an array of key-value pairs to the `items`
attribute.

| Key      | Type    | Description                                                                                                                            |
| -------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| label    | string  | Required. The title and label for the hyperlink.                                                                                       |
| metatext | string  | Text to provide users with supplemental information and aid with identification or disambiguation.                                     |
| items    | object  | Nested items as an array of key-value pairs.                                                                                           |
| name     | string  | The unique name for the item for the `onselect` event handler to return the tree item that was clicked.                                |
| href     | string  | The URL for the link.                                                                                                                  |
| expanded | boolean | Specifies whether a branch is expanded. An expanded branch displays its nested items visually. The default is false.                   |
| disabled | boolean | Specifies whether an item is disabled. A disabled item is grayed out and can't be focused or perform any action. The default is false. |

Here's an example of a tree with more than one level of nesting. To retrieve the selected item Id, use the `onselect` event handler. The `select` event is also fired when you select an item with an `href` value.

```html
<template>
    <lightning-tree items={treeList} onselect={handleSelect}>
    </lightning-tree>
</template>
```

Define the tree items in your JavaScript file. Use the `detail` property to retrieve the name of the selected tree item.

```javascript
import { LightningElement } from 'lwc';

const items = [
    {
        label: 'Western Sales Director',
        name: '1',
        expanded: true,
        items: [
            {
                label: 'Western Sales Manager',
                name: '2',
                expanded: true,
                items: [
                    {
                        label: 'CA Sales Rep',
                        name: '3',
                        expanded: true,
                        items: [],
                    },
                    {
                        label: 'OR Sales Rep',
                        name: '4',
                        expanded: true,
                        items: [],
                    },
                ],
            },
        ],
    },
    {
        label: 'Eastern Sales Director',
        name: '5',
        expanded: false,
        items: [
            {
                label: 'Eastern Sales Manager',
                name: '6',
                expanded: true,
                items: [
                    {
                        label: 'NY Sales Rep',
                        name: '7',
                        expanded: true,
                        items: [],
                    },
                    {
                        label: 'MA Sales Rep',
                        name: '8',
                        expanded: true,
                        items: [],
                    },
                ],
            },
        ],
    },
];

const mapping = {
    1: 'Western Sales Director',
    2: 'Western Sales Manager',
    3: 'CA Sales Rep',
    4: 'OR Sales Rep',
    5: 'Eastern Sales Director',
    6: 'Eastern Sales Manager',
    7: 'NY Sales Rep',
    8: 'MA Sales Rep',
};

export default class TreeExample extends LightningElement {
    treeList = items;
    selected = '';

    handleSelect(event) {
        //set the name of selected tree item
        this.selected = mapping[event.detail.name];
    }
}
```

#### Adding and Removing Items in a Tree

You can add or remove items in a tree. Let's say you have a tree that looks
like this, with a button to add a nested item to the tree.

```html
<template>
    <lightning-button
        label="Add to Tree"
        id="change-button"
        onclick={handleClick}
    >
    </lightning-button>
    <lightning-tree items={treeList}> </lightning-tree>
</template>
```

Define the items in your JavaScript code.

```javascript
import { LightningElement } from 'lwc';

const items = [
    {
        label: 'Go to Record 1',
        href: '#record1',
        items: [],
        expanded: true,
    },
    {
        label: 'Go to Record 2',
        href: '#record2',
        items: [],
        expanded: true,
    },
    {
        label: 'Go to Record 3',
        href: '#record3',
        items: [],
        expanded: true,
    },
];

export default class AddRemoveExample extends LightningElement {
    treeList = items;
}
```

This example `handleClick()` function adds a nested item at the end of the tree when the button is clicked.

```javascript
export default class AddRemoveExample extends LightningElement {
    treeList = items;

    handleClick(e) {
        const newItems = Array.from(this.treeList);
        const branch = newItems.length;
        const label = 'New item added at Record' + branch;
        const newItem = {
            label: label,
            expanded: true,
            disabled: false,
            items: [],
        };
        newItems[branch - 1].items.push(newItem);
        this.treeList = newItems;
    }
}
```

When providing an `href` value to an item, the `onselect` event handler is
triggered before navigating to the hyperlink.

#### Selecting a Tree Item Programmatically

To select a tree item using JavaScript, pass in the tree item name using `selected-item`.

This example selects the **United States Sales** tree item on load. Press the **Change Selected** button to select the **Americas** tree item.

```html
<template>
    <lightning-tree
        items={treeList}
        selected-item={selected}
    ></lightning-tree>
    <lightning-button
        label="Change Selected"
        onclick={handleClick}
    ></lightning-button>
</template>
```

Define the items in your JavaScript code and pass in the selected item name.

```javascript
import { LightningElement } from 'lwc';

const items = [
    {
        label: 'Asia Pacific Sales',
        name: 'Asia Pacific Sales',
        items: [
            {
                label: 'Asia Sales',
                name: 'Asia Sales',
                items: [],
            },
        ],
    },
    {
        label: 'Europe Sales',
        name: 'Europe Sales',
        items: [
            {
                label: 'UK Sales',
                name: 'UK Sales',
                items: [],
            },
            {
                label: 'EU Sales',
                name: 'EU Sales',
                items: [],
            },
        ],
    },
    {
        label: 'Americas',
        name: 'Americas',
        items: [
            {
                label: 'Northern America Sales',
                name: 'Northern America Sales',
                items: [
                    {
                        label: 'United States Sales',
                        name: 'United States Sales',
                        items: [],
                    },
                ],
            },
        ],
    },
];

export default class SelectItemExample extends LightningElement {
    treeList = items;
    selected = 'United States Sales';

    handleClick() {
        this.selected = 'Americas';
    }
}
```

#### Expanding and Collapsing A Branch

To expand and collapse a branch programmatically, get the tree items and update its `expanded` property.

```javascript
// expand the first branch
this.template.querySelector('lightning-tree').items[0].expanded = true;

// collapse the first branch
this.template.querySelector('lightning-tree').items[0].expanded = false;
```

#### Design Guidelines

Use `lightning-tree` if your app has layered navigation that can’t be represented in a simple tab set. A tree helps users navigate to pages and quickly find a nested child page without loading each page.

You can use `lightning-tree` with `lightning-breadcrumbs` to further help users navigate the hierarchy.

Trees can have unlimited nesting, but we recommend flatter trees as they are generally easier to navigate.

Not all items in the list need a corresponding page. Instead, you can group related pages together using a label header without providing an unnecessary landing page.

#### Accessibility

You can use the keyboard to navigate the tree. Tab into the tree and use the
Up and Down Arrow key to focus on tree items. To collapse an expanded branch,
press the Left Arrow key. To expand a branch, press the Right Arrow key.
Pressing the Enter key or Space Bar is similar to an onclick event, and
performs the default action on the item.

#### Custom Events

**`select`**

The event fired when a tree item is selected and before navigating to a given hyperlink.

The `select` event returns the following parameter.

| Parameter | Type   | Description                          |
| --------- | ------ | ------------------------------------ |
| name      | string | The label of the selected tree item. |

The event properties are as follows.

| Property   | Value | Description                                                                |
| ---------- | ----- | -------------------------------------------------------------------------- |
| bubbles    | true  | This event bubbles up through the DOM.                                     |
| cancelable | true  | This event can be canceled. You can call `preventDefault()` on this event. |
| composed   | true  | This event propagates outside of the component in which it was dispatched. |

#### LWC Recipes

The [LWC Recipes GitHub repository](https://github.com/trailheadapps/lwc-recipes) contains code examples for Lightning Web Components that you can test in an org.

For a recipe that uses `lightning-tree`, see the `c-wire-get-picklist-values-by-record-type` component in the LWC Recipes repo.
