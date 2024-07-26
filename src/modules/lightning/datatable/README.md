# lightning-datatable

> This document is for internal use only. It supplements the [lightning-datatable documentation](https://developer.salesforce.com/docs/component-library/bundle/lightning-datatable) in the Component Library.

## Working with Internal Data Types

> This section supplements the [Formatting with Data Types](https://developer.salesforce.com/docs/component-library/bundle/lightning-datatable/documentation) section in the Component Library.

`lightning-datatable` supports many data types. See the getters for all data types in [`primitiveCellFactory.js`](../primitiveCellFactory/primitiveCellFactory.js).

The undocumented `reference` type is an internal-only type for lookup fields. Currently, inline editing is not supported for lookup fields in `lightning-datatable`.

To configure a column using the `reference` type, update the `columns` definition.

```js
{
    label: 'Records',
    fieldName: 'record',
    type: 'reference',
    typeAttributes: { displayValue: {fieldName: 'recordDisplay'}}
},
```

The `fieldName` corresponds to the record Id. To display a different label on each row, pass the `displayValue` to `typeAttributes`
and pass the value to the `data` definition.

```js
[
    {
        recordDisplay: 'Opportunity 1',
        record: '006R0000002yecsIAA',
    },
    {
        recordDisplay: 'Opportunity 2',
        record: '006R0000002yecsIAB',
    },
];
```

For supported type attributes, see the `lightning-formatted-lookup` implementation in [`cellWithStandardLayout.html`](../primitiveCellFactory/cellWithStandardLayout.html).

## Working with Custom Data Types

> This section supplements the [Creating Custom Data Types](https://developer.salesforce.com/docs/component-library/bundle/lightning-datatable/documentation) section in the Component Library.

We document for external customers that custom data types have known limitations due to Locker.
However, Locker permits these features in internal implementations.

-   Dispatching custom events on custom data types
-   Accessibility and keyboard navigation on custom data types


For more information, see [Extend lightning-datatable with Custom Data](https://gus.lightning.force.com/lightning/r/0D5EE00001TA1uZ0AT/view).
