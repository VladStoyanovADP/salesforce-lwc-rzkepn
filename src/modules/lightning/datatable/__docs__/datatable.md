---
examples:
    - name: basic
      label: Basic Data Table
      description: A basic data table that fetches data during initialization. Set the server data on the data attribute. Display data based on the data type by defining the columns object.
    - name: withRowNumbers
      label: Data Table with Row Numbers
      description: Specify show-row-number-column to show row numbers in the data table.
    - name: withRowActions
      label: Data Table with Row Actions
      description: A data table with actions that can be performed on table rows. Use onrowaction to call a handler that defines the actions.
    - name: withInlineEdit
      label: Data Table with Inline Edit
      description: A data table with inline edit enabled, simulating server requests.
    - name: sorting
      label: Data Table with Sortable Column
      description: A data table with a column that can be sorted in ascending or descending order.
---

`lightning-datatable` displays tabular data where each column renders the content based on the data type.
For example, an email address is displayed as a hyperlink with the `mailto:` URL scheme by specifying the
`email` type. The default data type on a column is `text`.

This component implements styling from the [data
tables](https://www.lightningdesignsystem.com/components/data-tables/) blueprint in the
Salesforce Lightning Design System.

`lightning-datatable` is not supported on mobile devices. Supported features
include:

-   Displaying and formatting of columns with appropriate data types
-   Infinite scrolling of rows
-   Inline editing for some data types
-   Header actions
-   Header wrapping
-   Row-level actions
-   Resizing of columns
-   Selecting of rows
-   Sorting of columns by ascending and descending order
-   Text wrapping and clipping
-   Row numbering column
-   Cell content alignment

Tables can be populated during initialization using the `data`, `columns`, and
`key-field` attributes. The `key-field` attribute is required for correct table behavior.
It associates each row with a unique identifier. The value you use for `key-field` is
case-sensitive and must match what's in your `data` array.
If you use `key-field="Id"`, make sure the Id you provide in the `data` array
uses `Id` and not `id`.

This example creates a table whose first column displays a checkbox for row selection.
The checkbox column is displayed by default, and you can hide it by adding `hide-checkbox-column` in your markup.
Selecting the checkbox selects the entire row of data and triggers the `onrowselection` event handler.

```html
<template>
    <lightning-datatable
        data={data}
        columns={columns}
        key-field="Id"
        onrowselection={getSelectedName}
    >
    </lightning-datatable>
</template>
```

Here's the JavaScript that creates selectable rows and the
`columns` object to their corresponding column data. The Confidence column
displays percentages with an icon that denotes the increasing or decreasing
confidence trend.

This example defines five columns by setting properties and attributes for the `columns` object. The
Confidence column displays percentages and an icon that denotes the increasing
or decreasing confidence trend. The icon is specified with the `cellAttributes`
property. See **Working with Column Properties** for more information about the
properties for columns.

The JavaScript also loads two rows of data in the table. The Id for each
table row is used as the `key-field`.

```javascript
import { LightningElement } from 'lwc';

const columns = [
    { label: 'Opportunity name', fieldName: 'OpportunityName', type: 'text' },
    {
        label: 'Confidence',
        fieldName: 'Confidence',
        type: 'percent',
        cellAttributes: {
            iconName: { fieldName: 'TrendIcon' },
            iconPosition: 'right',
        },
    },
    {
        label: 'Amount',
        fieldName: 'Amount',
        type: 'currency',
        typeAttributes: { currencyCode: 'EUR', step: '0.001' },
    },
    { label: 'Contact Email', fieldName: 'Contact', type: 'email' },
    { label: 'Contact Phone', fieldName: 'Phone', type: 'phone' },
];

const data = [
    {
        Id: 'a',
        OpportunityName: 'Cloudhub',
        Confidence: 0.2,
        Amount: 25000,
        Contact: 'jrogers@cloudhub.com',
        Phone: '2352235235',
        TrendIcon: 'utility:down',
    },
    {
        Id: 'b',
        OpportunityName: 'Quip',
        Confidence: 0.78,
        Amount: 740000,
        Contact: 'quipy@quip.com',
        Phone: '2352235235',
        TrendIcon: 'utility:up',
    },
];

export default class DatatableExample extends LightningElement {
    data = data;
    columns = columns;

    getSelectedName(event) {
        const selectedRows = event.detail.selectedRows;
        // Display that fieldName of the selected rows
        for (let i = 0; i < selectedRows.length; i++) {
            alert('You selected: ' + selectedRows[i].OpportunityName);
        }
    }
}
```

When the data table is rendered, each row displays a checkbox in the first
column. The first row shows columns with the following data: Cloudhub, 20%,
$25,000.00, jrogers@cloudhub.com, and (235) 223-5235. The last two columns are
displayed as hyperlinks to represent an email address and telephone number.

#### Managing Selected Rows

Selecting a row or all rows via the checkbox column emits the `onrowselection` event. The `event.detail.selectedRows` property contains a list of all selected rows after any checkbox toggle. Alternatively, the `event.detail.config.value` contains a single `id` value of the row that was toggled.

This JavaScript function displays the email addresses of all rows as they're selected.

```js
getSelectedEmail(event) {
    // Display the Contact of the selected rows
    event.detail.selectedRows.forEach((selectedRow) => {
        alert('Selected email addresses: ' + selectedRow.Contact);
    });
}
```

Use the `event.detail.config.action` property to keep a running list of rows that have been selected or deselected. `event.detail.config.action` has four possible values:

- `selectAllRows`: all rows are selected via the checkbox in the column header
- `deselectAllRows`: all rows are deselected via the checkbox in the column header
- `rowSelect`: single row is selected via the row checkbox
- `rowDeselect`: single row is deselected via the row checkbox

This JavaScript example keeps two running lists of row objects: a list of rows that have ever been selected and a list of row objects that are currently selected.

```js
selectedData = [];
currentlySelectedData = [];

handleRowSelection(event) {
    switch (event.detail.config.action) {
        case 'selectAllRows':
            for (let i = 0; i < event.detail.selectedRows.length; i++) {
                selectedData.push(event.detail.selectedRows[i]);
                currentlySelectedData.push(event.detail.selectedRows[i]);
            }
            break;
        case 'deselectAllRows':
            currentlySelectedData = [];
            break;
        case 'rowSelect':
            selectedData.push(event.detail.config.value);
            break;
        case 'rowDeselect':
            index = currentlySelectedData.indexOf(event.detail.config.value);
            if (index !== -1) {
                array.splice(index, 1);
            }
            break;
        default:
            break;
    }
}
```

#### Retrieving Data Using an Apex Controller

To return a simple list of records, use the `getListUi` wire adapter. To select certain accounts using SOQL, use an Apex method. See [Call Apex Methods](https://developer.salesforce.com/docs/platform/lwc/guide/apex).

This example loads the first 10 contacts in the datatable using a SOQL query.

```java
public with sharing class ContactController {

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactList() {
        return [SELECT Id, FirstName, LastName, Title, Phone, Email FROM Contact LIMIT 10];
    }
}
```

The template wires up the datatable to the contact records using the `id` field.

```html
<template>
<lightning-datatable
    key-field="Id"
    data={contacts.data}
    columns={columns}>
</template>
```

Load the columns using JavaScript. This example wires the `getContactList` Apex method to the `contacts` property.

```javascript
import { LightningElement, wire } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getContactList';

const columns = [
    { label: 'First Name', fieldName: 'FirstName' },
    { label: 'Last Name', fieldName: 'LastName' },
    { label: 'Title', fieldName: 'Title' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Email', fieldName: 'Email', type: 'email' },
];
export default class ApexDatatableExample extends LightningElement {
    error;
    columns = columns;

    @wire(getContactList)
    contacts;
}
```

#### Working with Column Properties

Use the following column properties to customize the behavior and visual
aspects of your columns.

| Property           | Type    | Description                                                                                                                                                                                                                                                                           |
| ------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| actions            | object  | Appends a dropdown menu of actions to a column. You must pass in a list of label-name pairs.                                                                                                                                                                                          |
| cellAttributes     | object  | Provides additional customization, such as appending an icon to the output. For more information, see **Appending an Icon to Column Data**.                                                                                                                                           |
| editable           | boolean | Specifies whether a column supports inline editing. The default is false.                                                                                                                                                                                                             |
| fieldName          | string  | Required. The name that binds the columns attributes to the associated data. Each columns attribute must correspond to an item in the data array.                                                                                                                                     |
| fixedWidth         | integer | Specifies the width of a column in pixels and makes the column non-resizable.If both `fixedWidth` and `initialWidth` values are provided, `initialWidth` is ignored.                                                                                                                  |
| hideDefaultActions | boolean | Specifies whether to hide the default header actions on a column. The default is false. For more information, see **Creating Header Actions**.                                                                                                                                        |
| hideLabel          | boolean | Specifies whether to hide the label on a column. The default is false. For more information, see **Displaying an Icon Instead of a Column Label**.                                                                                                                                    |
| iconName           | string  | The Lightning Design System name of the icon. Names are written in the format standard:opportunity. The icon is appended to the left of the header label. If `hideLabel` is provided, only the icon displays in the column header.                                                    |
| initialWidth       | integer | The width of the column when it's initialized, which must be within the `min-column-width` and` max-column-width` values, or within 50px and 1000px if they are not provided.                                                                                                         |
| label              | string  | Required. The text label displayed in the column header. If `hideLabel` and `iconName` are set, the label is used as hover text for the icon and as the value of `aria-label`.                                                                                                        |
| sortable           | boolean | Specifies whether the column can be sorted. The default is false.                                                                                                                                                                                                                     |
| type               | string  | Required. The data type to be used for data formatting. For more information, see **Formatting with Data Types**.                                                                                                                                                                     |
| typeAttributes     | object  | Provides custom formatting with component attributes for the data type. For example, currency-code for the currency type. For more information, see **Formatting with Data Types**.                                                                                                   |
| wrapText           | boolean | Specifies whether text in a column is wrapped when the table renders. Wrapped text vertically expands a row to reveal its full content. Use with `wrap-text-max-lines` to display a number of lines before hiding the rest. For more information, see **Text Wrapping and Clipping**. |

#### Formatting with Data Types

The data table formats the data cells of a column based on the type you specify for the column. To get correct formatting, specify a type that matches the field type you pass in to a column.

The default data type for a column is `text`. Object values passed into a text type column are displayed as an empty string.

For number and string values like percent, currency, date, email, and phone numbers, the text type column displays the unformatted value of the string. For example, specify `type: 'date'` in the column definition if you're passing in a date to the column. The date is then formatted according to the user's Salesforce locale. If you don't specify the date type, the retrieved date string is formatted as text.

Additionally, specify `type: 'boolean'` if you're passing in a boolean value to a column to display a checkmark for a `true` value. Passing in a boolean value to a column of `text` type displays the value as `true` or `false`.

Each data type is associated with a base Lightning component. For example, the `text` type renders the associated data using a `lightning-formatted-text` component. The `phone` type renders the associated data using a `lightning-formatted-phone` component, and the phone number is formatted for the user's locale.

To customize your output, pass in the attributes of the base component via the `typeAttributes` property. Not all attributes on a base component are supported. For more information, see the table on supported type attributes below.

The properties you pass with `typeAttributes` must be specified using the format shown here, not the format that's used for Lightning web component attributes in your HTML template. For example, although `lightning-formatted-number` recognizes a `currency-code` attribute, you must specify it as `currencyCode` with the `typeAttributes` property. For supported attribute values, refer to the component's documentation.

Valid data types and their supported attributes include:

| Type        | Description                                                                                                                                                                                                                                                                                                                                                            | Supported Type Attributes                                                                                                                                     |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| action      | Displays a dropdown menu using [lightning-button-menu](bundle/lightning-button-menu/) with actions as menu items. The default dropdown menu alignment, denoted by `menuAlignment`, is `right`. Valid options for `menuAlignment` are `right`, `left`, `auto`, `center`, `bottom-left`, `bottom-center`, and `bottom-right`. See **Creating Static Row-Level Actions**. | rowActions (required), menuAlignment (defaults to right)                                                                                                      |
| boolean     | Displays the icon utility:check if the value is true, and a blank value otherwise.                                                                                                                                                                                                                                                                                     | N/A                                                                                                                                                           |
| button      | Displays a button using [lightning-button](bundle/lightning-button/)                                                                                                                                                                                                                                                                                                   | disabled, iconName, iconPosition, label, name, title, variant                                                                                                 |
| button-icon | Displays a button icon using [lightning-button-icon](bundle/lightning-button-icon/)                                                                                                                                                                                                                                                                                    | alternativeText, class, disabled, iconClass, iconName, name, title, variant                                                                                   |
| currency    | Displays a currency using [lightning-formatted-number](bundle/lightning-formatted-number/). See **Displaying Currency and Percentages**.                                                                                                                                                                                                                               | currencyCode, currencyDisplayAs, minimumIntegerDigits, minimumFractionDigits, maximumFractionDigits, minimumSignificantDigits, maximumSignificantDigits, step |
| date        | Displays a date and time based on the locale using [lightning-formatted-date-time](bundle/lightning-formatted-date-time/). See **Displaying Date and Time Using Type Attributes**.                                                                                                                                                                                     | day, era, hour, hour12, minute, month, second, timeZone, timeZoneName, weekday, year                                                                          |
| date-local  | Displays a date that is formatted based on the locale using [lightning-formatted-date-time](bundle/lightning-formatted-date-time/). To include a time value, use the `date` type instead. The value passed is assumed to be in the browser local time zone and there is no time zone transformation. See **Displaying Date and Time Using Type Attributes**.           | day, month, year                                                                                                                                              |
| email       | Displays an email address using [lightning-formatted-email](bundle/lightning-formatted-email/)                                                                                                                                                                                                                                                                         | N/A                                                                                                                                                           |
| location    | Displays a latitude and longitude of a location using [lightning-formatted-location](bundle/lightning-formatted-location/)                                                                                                                                                                                                                                             | latitude, longitude                                                                                                                                           |
| number      | Displays a number using [lightning-formatted-number](bundle/lightning-formatted-number/)                                                                                                                                                                                                                                                                               | minimumIntegerDigits, minimumFractionDigits, maximumFractionDigits, minimumSignificantDigits, maximumSignificantDigits                                        |
| percent     | Displays a percentage using [lightning-formatted-number](bundle/lightning-formatted-number/). See **Displaying Currency and Percentages**.                                                                                                                                                                                                                             | minimumIntegerDigits, minimumFractionDigits, maximumFractionDigits, minimumSignificantDigits, maximumSignificantDigits, step                                  |
| phone       | Displays a phone number using [lightning-formatted-phone](bundle/lightning-formatted-phone/)                                                                                                                                                                                                                                                                           | N/A                                                                                                                                                           |
| text        | Displays text using [lightning-formatted-text](bundle/lightning-formatted-text/). This is the default data type.                                                                                                                                                                                                                                                       | linkify                                                                                                                                                       |
| url         | Displays a URL using [lightning-formatted-url](bundle/lightning-formatted-url/)                                                                                                                                                                                                                                                                                        | label, target, tooltip                                                                                                                                        |

In some situations, multiple columns reference the same `fieldName` but have different `fieldApiNames` and different ways of working with the field information. To give a column a unique ID when using the same field name for two columns, use the attribute `columnKey` instead of `fieldName` on one of the column definitions.

```javascript
get columns() {
    return [
        // Column using 'fieldName' as identifier
        {
            label: 'Lead',
            fieldName: 'leadId',
            ...
        },
        // Column using 'columnKey' as identifier
        {
            label: 'Company',
            columnKey: 'leadCompany',
            fieldName: 'leadId',
            ...
        }
    ]
}
```

#### Custom Formatting Examples

To customize the formatting based on the data type, pass in the attributes for
the corresponding base Lightning component. For example, to display the URL value as a tooltip on a URL, pass in the `tooltip` value.

```javascript
const columns = [
    {
        label: 'Company Website',
        fieldName: 'website',
        type: 'url',
        typeAttributes: { tooltip: { fieldName: 'website' } },
    },
    // other column data
];
```

For more information on attributes and their supported values, see the
corresponding base component documentation.

For more information on creating your own data types, see [Create a Custom Data Type](https://developer.salesforce.com/docs/platform/lwc/guide/data-table-custom-types).

#### Displaying Currency and Percentages

Currency type displays a value based on the org currency and your Salesforce locale by default.

To override the default currency code, pass in a custom `currencyCode` value.

```javascript
const columns = [
    {
        label: 'Amount',
        fieldName: 'amount',
        type: 'currency',
        typeAttributes: { currencyCode: 'EUR' },
    },
    // other column data
];
```

To specify the granularity on a currency or percentage for inline editing, pass in the `step` attribute. For example, specify `step: 0.01` to allow numbers with two decimal places, or `step: 0.001` permits three decimal places. Specify `step: 1` to require whole numbers. The default is `0.01`. You can preserve the number of fraction digits for display using `minimumFractionDigits` and `maximumFractionDigits`.

```javascript
const columns = [
    {
        label: 'Confidence',
        fieldName: 'confidence',
        type: 'percent',
        typeAttributes: {
            step: '0.00001',
            minimumFractionDigits: '2',
            maximumFractionDigits: '3',
        },
        editable: true,
    },
    //other column data
];
```

For example, if you pass in `confidence: 0.21234` in your column data, the display value is `21.234%`. When you inline edit, the `step` value is used to determine if your input is valid. If you pass in `confidence: 0.78`, the display value is `78.00%` because `minimumFractionDigits` is set to `2`.

#### Displaying Date and Time Using Type Attributes

The locale set in the Salesforce user preferences determines the default formatting for date and time types.

The data table supports the date object and dates provided as ISO8601 formatted strings. Timestamps are not supported.
These date formats can be displayed differently in a column. The default format is `September 26, 2020`,
which corresponds to `type: "date"` or `type: "date-local"` and an empty `typeAttributes` property.

While the `date` type can be used to display date and time, the `date-local` type displays only the date. Here's how you can display Salesforce date and time data types in `lightning-datatable`.
Salesforce Data Type|Datatable Data Type|Description
-----|-----|-----
DateTime|date|Expects date and time as input, and formats it according to the user's locale.
Date|date-local|Expects date as input, and formats it according to the user's locale. Does not include time conversion.

Here are several ways to display date and time in a column.

09/26/2018

```javascript
    {
        label: "Date",
        fieldName: "DueDate",
        type: "date-local",
        typeAttributes:{
            month: "2-digit",
            day: "2-digit"
        }
    }
```

Wednesday, September 26, 2018

```javascript
    {
        label: "Closed Date",
        fieldName: "ClosedDate",
        type: "date",
        typeAttributes:{
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "2-digit"
        }
    }
```

September 26, 2018, 12:00 PM

```javascript
    {
        label: "Arrival Time",
        fieldName: "ArrivalTime",
        type: "date",
        typeAttributes:{
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        }
    }
```

Wednesday, September 26, 2018, 12:00 PM

```javascript
    {
        label: "Event Time",
        fieldName: "EventTime",
        type: "date",
        typeAttributes:{
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        }
    }
```

The locale set in your Salesforce preferences determines the formatting.
For more information, see the [lightning-formatted-date-time](bundle/lightning-formatted-date-time/) documentation.

#### Aligning Content in A Column

To horizontally align content in a column, use the `cellAttributes` property to pass in the `alignment` attribute and its setting, which can be `left`, `right`, or `center`.

```javascript
const columns = [
    {
        label: 'Amount',
        fieldName: 'amount',
        type: 'currency',
        cellAttributes: { alignment: 'left' },
    },
    // other column data
];
```

By default, number types align to the right. Number types include the `currency`, `number`, `percent` types.

The `action` type aligns to the center and cannot be overridden by the `alignment` attribute. All other types align to the left.

To override the alignment of the `action` type, consider using custom types and provide your own markup. See [Create a Custom Data Type](https://developer.salesforce.com/docs/platform/lwc/guide/data-table-custom-types).

#### Displaying an Icon Instead of a Column Label

To display an icon instead of a label in the column header, specify the properties `iconName` and `hideLabel` in the column definition. Specify `iconName` as a [utility icon](https://www.lightningdesignsystem.com/icons/#utility).

```javascript
const columns = [
    {
        label: 'Ordering',
        fieldName: 'id',
        type: 'orderingButtons',
        fixedWidth: 90,
        iconName: 'utility:trending',
        hideLabel: true,
    },
    // other column data
];
```

To support assistive technologies, set the `label` property for the column even though the label is hidden. Use standard header text that you'd use without an icon. The label text is used to set values for the icon's `title` and `alternativeText` attributes. The text is displayed as hover text. If the column has header controls the label text is used in `aria-label` for the header.

#### Appending an Icon to Column Data

To append an icon to your data output, use `cellAttributes` and pass in these
attributes.

| Attribute           | Description                                                                                                             |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| iconName            | Required. The Lightning Design System name of the icon, for example, utility:down.                                      |
| iconLabel           | The label for the icon to be displayed on the right of the icon.                                                        |
| iconPosition        | The position of the icon relative to the data. Valid options include `left` and `right`. This value defaults to `left`. |
| iconAlternativeText | Descriptive text for the icon.                                                                                          |

You can add an icon with or without a label. This example defines two columns with icons.
The first column specifies the `utility:event` icon for all rows using the `iconName` cell attribute, and the icon displays to the left of the data without a label.
The second column uses computed values for the `iconName` and `iconLabel` and displays the icon to the right of the data.

```javascript
const columns = [
    // simple icon
    {
        label: 'Close date',
        fieldName: 'closeDate',
        type: 'date',
        sortable: true,
        cellAttributes: {
            iconName: 'utility:event',
            iconAlternativeText: 'Close Date',
        },
    },
    // icon appended with a label
    {
        label: 'Confidence',
        fieldName: 'confidence',
        type: 'percent',
        cellAttributes: {
            iconName: { fieldName: 'confidenceDeltaIcon' },
            iconLabel: { fieldName: 'confidenceDelta' },
            iconPosition: 'right',
            iconAlternativeText: 'Percentage Confidence',
        },
    },
    // other column data
];
```

#### Adding Styles To Columns

Pass Lightning Design System classes to `cellAttributes` when using standard data types.

```javascript
const columns = [
    {
        label: 'Account Name',
        fieldName: 'Name',
        cellAttributes: {
            class: 'slds-text-color_success slds-text-title_caps',
        },
    }, // other column data
];
```

Custom classes are currently not supported. To apply custom styling on your datatable cells, create a custom data type and then apply your custom CSS classes. See [Custom Data Type Layout and Styles](https://developer.salesforce.com/docs/platform/lwc/guide/data-table-custom-types-styling).

#### Displaying Indicators for Read-Only Fields

You can display a lock icon on read-only fields to specify they're not editable. To specify that a column's field as read-only, set the column attribute `editable` to `false` and the column attribute `displayReadOnlyIcon` to `true` in the associated column definition. This example displays a lock icon on each field in a column called "Website."

```javascript
const columns = [
    {
        label: 'Website',
        fieldName: 'website',
        type: 'url',
        editable: false,
        displayReadOnlyIcon: true,
    }
```

#### Using Infinite Scrolling to Load More Rows

Infinite scrolling enables you to load a subset of data and then display more
when users scroll to the end of the table. To enable infinite scrolling, specify
`enable-infinite-loading` and provide an event handler using
`onloadmore`. By default, data loading is triggered when you scroll down to
20px from the bottom of the table, but the offset can be changed using the
`load-more-offset` attribute. Place the table in a container with a defined height
to establish the bottom of the table. This limit enables the datatable to calculate
when to load more and prevents infinite looping.

This example places the datatable in a container with a height of 500px. The table
loads 50 more rows from the database when you reach the end of the table until
there are no more data to load.

```html
<template>
    <div style="height: 500px">
        <lightning-datatable
            columns={columns}
            data={data}
            key-field="Id"
            enable-infinite-loading
            onloadmore={loadMoreData}
        >
        </lightning-datatable>
    </div>
    {loadMoreStatus}
</template>
```

The `onloadmore` event handler retrieves more data when you scroll to the
bottom of the table until there are no more data to load. To display a spinner
while data is being loaded, set the `isLoading` property to `true`.

```javascript
import { LightningElement, api } from 'lwc';

export default class DatatableExample extends LightningElement {
    data = [];
    columns = columnsDefs;
    loadMoreStatus;
    @api totalNumberOfRows;

    loadMoreData(event) {
        //Display a spinner to signal that data is being loaded
        event.target.isLoading = true;
        //Display "Loading" when more data is being loaded
        this.loadMoreStatus = 'Loading';
        fetchData(50).then((data) => {
            if (data.length >= this.totalNumberOfRows) {
                event.target.enableInfiniteLoading = false;
                this.loadMoreStatus = 'No more data to load';
            } else {
                const currentData = this.data;
                //Appends new data to the end of the table
                const newData = currentData.concat(data);
                this.data = newData;
                this.loadMoreStatus = '';
            }
            event.target.isLoading = false;
        });
    }
}
```

While this example uses a fixed number to denote the total number of rows, you
can also use the SOQL SELECT syntax with the `COUNT()` function to return the
number of rows in the object in your Apex controller. Then, set the result on
the `totalNumberOfRows` attribute during initialization.

```
    SELECT COUNT(Id) FROM Contact
```

#### Creating Header Actions

Header actions refer to tasks you can perform on a column of data, such
as displaying only rows that meet a criteria provided by the column. You can
perform actions on a column and handle them using the `onheaderaction` event
handler.

Header actions are available in the dropdown menu in the column header. The default header actions available on each column are as follows. For more information, see **Text Wrapping and Clipping**.

| Action Name | Description                                                                                                                                                                              |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Wrap text   | Expands the row vertically to reveal more content if content is wider than the column width. Use `wrap-text-max-lines` to determine the number of lines to show when content is wrapped. |
| Clip text   | Truncates content to a single line with an ellipsis if content is wider than the column width. Content is clipped by default.                                                            |

To hide the dropdown menu with the default header actions on a column, pass in the `hideDefaultActions` property.

```javascript
const columns = [
    { label: 'Opportunity name', fieldName: 'opportunityName', type: 'text' },
    {
        label: 'Amount',
        fieldName: 'amount',
        type: 'currency',
        typeAttributes: { currencyCode: 'EUR' },
        hideDefaultActions: true,
    },
    //other column data
];
```

If `hideDefaultActions` is set to `true` on a column that has custom header actions, the "Clip text" and "Wrap text" actions are removed from the actions dropdown menu,
and the content is clipped by default. To wrap text when the default actions are hidden, set `wrapText: true` in the column definition.

To create a custom header action, use the attributes as follows.

| Attribute | Description                                                                                                                                                                                                      |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| label     | Required. The label that's displayed for the action.                                                                                                                                                             |
| name      | Required. The name of the action, which identifies the selected action.                                                                                                                                          |
| checked   | Specifies whether a check mark is shown to the left of the action label. If true, a check mark is shown to the left of the menu item. If false, a check mark is not shown but there is space to accommodate one. |
| disabled  | Specifies whether the action can be selected. If true, the action item is shown as disabled. This value defaults to false.                                                                                       |
| iconName  | The name of the icon to be displayed to the right of the action item.                                                                                                                                            |

For example, suppose you want to create a filter that displays only rows where the
Publishing State column matches either the Published or Unpublished state.

```html
<template>
    <lightning-datatable
        columns={mycolumns}
        data={mydata}
        key-field="Id"
        onheaderaction={handleHeaderAction}
    >
    </lightning-datatable>
</template>
```

Bind the header actions to the `actions` column attribute, which can be done
during initialization.

```javascript
const columns = [
    // other column data
    {
        label: 'Publishing State',
        fieldName: 'published',
        type: 'text',
        actions: [
            { label: 'All', checked: true, name: 'all' },
            { label: 'Published', checked: false, name: 'show_published' },
            { label: 'Unpublished', checked: false, name: 'show_unpublished' },
        ],
    },
];
```

```javascript
handleHeaderAction: (event) {
    // Retrieves the name of the selected filter
    const actionName = event.detail.action.name;
    // Retrieves the current column definition
    // based on the selected filter
    const colDef = event.detail.columnDefinition;
    const columns = this.columns;
    const activeFilter = this.activeFilter;

    if (actionName !== activeFilter) {
        var idx = columns.indexOf(colDef);
        // Update the column definition with the updated actions data
        var actions = columns[idx].actions;
        actions.forEach((action) => {
            action.checked = action.name === actionName;
        });
        this.activeFilter = actionName;
        this.updateBooks();
        this.columns = columns;
    }
}
```

Finally, display the rows to match the selected filter, which is performed by
`this.updateBooks()`.

```javascript
updateBooks(cmp) {
    const rows = this.rawData;
    const activeFilter = this.activeFilter;
    const filteredRows = rows;
    if (activeFilter !== 'all') {
        filteredRows = rows.filter(function (row) {
            return (activeFilter === 'show_published' ||
              (activeFilter === 'show_unpublished');
        });
    }
    this.data = filteredRows;
}
```

#### Creating Static Row-Level Actions

Row-level actions refer to tasks you can perform on a row of data, such as
updating or deleting the row. Static actions apply to all rows on the table.
You can perform actions on each row and handle them using the `onrowaction`
event handler.

Supported attributes for the row actions are as follows.

| Attribute | Description                                                                                                                |
| --------- | -------------------------------------------------------------------------------------------------------------------------- |
| label     | Required. The label that's displayed for the action.                                                                       |
| name      | Required. The name of the action, which identifies the selected action.                                                    |
| disabled  | Specifies whether the action can be selected. If true, the action item is shown as disabled. This value defaults to false. |
| iconName  | The name of the icon to be displayed to the right of the action item.                                                      |

```html
<template>
    <lightning-datatable
        columns={mycolumns}
        data={mydata}
        key-field="Id"
        onrowaction={handleRowAction}
    >
    </lightning-datatable>
</template>
```

You must provide a list of actions to the columns data, which can be done
during initialization. This JavaScript initializes the actions
column and handles the actions on each row, displaying the row details and
deleting the row when the action is clicked.

```javascript
import { LightningElement } from 'lwc';

const actions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Delete', name: 'delete' }
];

const columns = [
    // Other column data here
    { type: 'action', typeAttributes: { rowActions: actions, menuAlignment: 'left' } }
];

export default class DatatableExample extends LightningElement {
    data = [];
    columns = columns;

    handleRowAction(event) {
            const action = event.detail.action;
            const row = event.detail.row;
            switch (action.name) {
                case 'show_details':
                    alert('Showing Details: ' + JSON.stringify(row));
                    break;
                case 'delete':
                    const rows = this.data;
                    const rowIndex = rows.indexOf(row);
                    rows.splice(rowIndex, 1);
                    this.data = rows;
                    break;
     }
}
```

#### Creating Dynamic Row-Level Actions

Dynamic actions are created based on the content of each row. When you click
the dropdown menu, an asynchronous call is made to determine which actions to
display for the particular row. The logic that determines which action to
display can be created on initialization. In this example, the action and its
label is evaluated when the dropdown menu is activated. Assume that we have an
`active` column that displays the status of a contact (Active or Inactive),
which determines which action to display (Deactivate or Activate).

```javascript
import { LightningElement } from 'lwc';

const actions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Delete', name: 'delete' }
];

const columns = [
    // Your column data
];

export default class DatatableExample extends LightningElement {
    data = [];
    columns = columns;

    constructor() {
        super();
        this.columns = [
            // Other column data here
            { type: 'action', typeAttributes: { rowActions: this.getRowActions } },
        ]
    }

    getRowActions(row, doneCallback) {
        const actions = [];
            if (row['isActive']) {
                actions.push({
                    'label': 'Deactivate',
                    'iconName': 'utility:block_visitor',
                    'name': 'deactivate'
                });
            } else {
                actions.push({
                    'label': 'Activate',
                    'iconName': 'utility:adduser',
                    'name': 'activate'
                });
            }
            // simulate a trip to the server
            setTimeout(() => {
                doneCallback(actions);
            }), 200);
    }
}
```

The previous example illustrates how to create and handle dynamic actions on
the client-side only. You can make server calls and persist your record data
changes via an Apex controller.

#### Resizing Tables and Columns

The width and height of the datatable is determined by the container element.
A scroller is appended to the table body if there are more rows to display.
For example, you can restrict the height to 300px by applying CSS styling to
the container element.

```html
<div style="height: 300px;">
    <!-- lightning-datatable goes here -->
</div>
```

By default, columns are resizable. Users can click and drag the width to a
minimum of 50px and a maximum of 1000px. Users can also resize the column width using the keyboard. For more information, see the **Accessibility** section.

##### Working with Column Widths

You can customize the column widths in many ways. To specify your own width and disable resizing for a specific column, pass in `fixedWidth` to the column property. To specify an initial width and enable resizing for a specific column, pass in `initialWidth` to the column property.

```javascript
const columns = [
    {
        label: 'Amount',
        fieldName: 'amount',
        type: 'currency',
        initialWidth: 80,
    },
    // other column data
];
```

Columns have a default minimum width of 50px and maximum width of 1000px. To change the minimum and maximum width of columns, use the
`min-column-width` and `max-column-width` attributes. For example, if you want a user to be able to resize a column to a minimum of 80px, set `min-column-width="80"`.

```html
<lightning-datatable
    key-field="Id"
    data={data}
    columns={columns}
    min-column-width="80"
>
</lightning-datatable>
```

To prevent users from resizing columns, specify `resize-column-disabled` in your markup. The table can still adjust its column widths when you resize the browser window or the width of the parent container changes. The `resize-column-disabled` attribute allows the table to resize columns when `column-widths-mode` is set to `auto`. See the next section for more information.

Resizing a column fires the `resize` event. For more information, See the **Custom Events** section.

```html
<lightning-datatable
    key-field="Id"
    data={data}
    columns={columns}
    onresize={handleResize}
>
</lightning-datatable>
```

To return the column widths, use the `event.detail` property on the `onresize` event handler.

```javascript
handleResize(event) {
    const sizes = event.detail.columnWidths;
}
```

##### Managing the Resizing of Column Widths

The `column-widths-mode` attribute accepts values of `fixed` (default) or `auto`. Use this attribute with the `fixedWidth` and `initialWidth` column properties to provide granular control on your column widths. See **Implementing Fixed Width Mode** and **Implementing Auto Width Mode** for more information.

Widths for the following columns are fixed and cannot be changed.

-   Row Number column
-   Selection (checkbox) column
-   Action column

##### Implementing Fixed Width Mode

Render columns with equal widths using `column-widths-mode="fixed"`, which is the default setting. Any content that's too long to be displayed is clipped and appears with a trailing ellipsis. The column width is calculated by taking total available width and dividing equally among the columns.

You can specify your own widths using `fixedWidth` or `initialWidth`. The widths of the remaining columns without a specified `fixedWidth` or `initialWidth` value are equal.

Setting new data on the columns doesn't trigger resizing for columns, unless the new column definition specifies a change in `fixedWidth` or `initialWidth` values. In `fixed` mode, the columns automatically resizes and maintain equal widths when:

-   The browser window is resized
-   The parent container width for the datatable is changed
-   The `row-number-offset` value is changed
-   More or less data is passed in

When you manually resize a column to a larger width, the other columns maintain their widths, displaying a scrollbar to enable scrolling to the end of the table columns. When you manually resize to a smaller width, the other columns also maintain their widths.

You can resize manually using a mouse or a keyboard. On a keyboard, press enter in the header cell, tab to reach the resizer (column divider), and press the left or right arrow keys. On a touchscreen device, tap on the desired column resizer area, move to the desired width, and then release.

##### Implementing Auto Width Mode

To trigger resizing of columns according to the length or size of data in a column, set `column-widths-mode="auto"`. In `auto` width mode, the columns automatically resize when:

-   Data changes in at least one row and the number of rows stays the same
-   The column definition changes, such as a change in a column property or the number of columns

Pass a new reference of columns with changes for resize to take effect. The columns don't resize if there's only a change in the number of records in the data.

Column widths are calculated based on the width of the content displayed in the column and the total width of the table. Specify your own widths for particular columns using the `fixedWidth` or `initialWidth` properties. The widths of the columns without these properties are calculated based on the width of the content in the column and the remaining table width. If the columns definition is passed but no data is set yet, the columns are rendered based on the width of the column labels.

A column's width is limited by the `max-column-width` value, or 1000px by default. If a column width is calculated to be wider than the `max-column-width` value, the content is truncated and displayed with an ellipsis. If the column also specifies `wrapText: true`, the column results in a narrower width than if the column has clipped text.

A column's width is also limited by the `min-column-width` value, or 50px by default. If a column width is calculated to be narrower than the `min-column-width` value, the width is set to minimum column width and may have extra white space.

When you manually resize a column, the other columns maintain their widths. This behavior also occurs when a column is manually resized in `fixed` mode.

The columns keep their width ratios while adjusting the column widths when:

-   The browser window is resized
-   The parent container width for the datatable is changed
-   The `rowNumberOffset` value is changed

Auto width mode is supported for containers with block display, which corresponds to the `display: block` CSS property.
`lightning-datatable` doesn't fully support containers with `display:inline-block` or flex properties.

#### Selecting Rows Programmatically

The `selected-rows` attribute enables programmatic selection of rows, which is
useful when you want to preselect rows.

```html
<lightning-datatable
    columns={columns}
    data={data}
    key-field="Id"
    selected-rows={selectedRows}
>
</lightning-datatable>
<lightning-button label="Select" onclick={handleSelect}> </lightning-button>
```

To select a row programmatically, pass in the row `key-field` value.

```javascript
    // Load data via init handler first
    // then handle programmatic selection
    handleSelect() {
        const rows = ['a'];
        this.selectedRows = rows;
    }
```

If `max-row-selection` is set to a value less than the number of selected rows,
only the specified number of rows will be selected. For example, if you set
`max-row-selection` to 2 and pass in `['a', 'b', 'c']` to `selected-rows`, only
rows a and b will be selected.

#### Sorting Data By Column

To enable sorting of row data by a column label, set `sortable` to `true` for
the column on which you want to enable sorting. Set `sortedBy` to match the
`fieldName` attribute on the column. Clicking a column header sorts rows by
ascending order unless the `defaultSortDirection` is changed, and clicking it
subsequently reverses the order. Handle the `onsort` event handler to update
the table with the new column index and sort direction.

Here's an example of the method that's called by the `onsort`
event handler.

```javascript
        // The method onsort event handler
        updateColumnSorting(event) {
            var fieldName = event.detail.fieldName;
            var sortDirection = event.detail.sortDirection;
            // assign the latest attribute with the sorted column fieldName and sorted direction
            this.sortedBy = fieldName;
            this.sortedDirection = sortDirection;
            this.data = this.sortData(fieldName, sortDirection);
       }
```

#### Working with Inline Editing

When you make a column editable, a pencil icon appears when you hover over the
cells in that column. Clicking the icon or pressing the Enter key triggers
inline editing. Inline editing is not supported for date and location fields.

Make a column editable by setting `editable` to true when you are defining
your columns.

```javascript
    {label: 'Amount', fieldName: 'amount', type: 'currency', typeAttributes: { currencyCode: 'EUR'}, editable : 'true'},
    {label: 'Contact Email', fieldName: 'contact', type: 'email', editable : 'true'}
```

You can handle the `oncancel`, `oncellchange`, and `onsave` actions when the
cell value changes or is saved. When the `onsave` action is used, the
**Cancel** and **Save** button appears after a value cell changes and you
press the Enter or Tab key, or move away from the cell.

```html
<template>
    <lightning-datatable
        key-field="Id"
        data={data}
        columns={columns}
        onsave={handleSave}
    >
    </lightning-datatable>
</template>
```

Retrieve the new value using `event.detail.draftValues`.

```javascript
handleSave(event) {
    this.saveDraftValues = event.detail.draftValues;
}
```

You can also program an external element, such as a button, to open an inline edit panel on the currently active cell or next editable cell in the datatable. Invoke the `openInlineEdit()` method in the external element that should direct a user to the first editable cell in your datatable component.

This example opens a datatable cell for inline edit when the user clicks an "Edit" button.

```javascript
import { LightningElement } from 'lwc';
export default class DatatableWithInlineEdit extends LightningElement {
    data = [];
    columns = columns;
    rowOffset = 0;

    handleClick() {
        const dt = this.template.querySelector('lightning-datatable');
        dt.openInlineEdit();
    }
}
```

For more information, see [Display Data in a Table with Inline Editing](https://developer.salesforce.com/docs/platform/lwc/guide/data-table-inline-edit).

#### Displaying Errors

You can trigger an error on a cell or multiple cells, which then turns the
cell border red and displays a tooltip on the number column. The error
messages appear when you hover over the tooltip. You must make the column
editable. By making a column editable, the `show-row-number-column` attribute is
always true and the number column is displayed.

Based on the first example on this page, add the `errors` attribute to your
component.

Your `lightning-datatable` component should look like this.

```html
<template>
    <lightning-datatable
        key-field="Id"
        data={data}
        columns={columns}
        errors={errors}
    >
    </lightning-datatable>
    <lightning-button label="Trigger error" onclick={triggerError}>
    </lightning-button>
</template>
```

In this example, we are triggering the error with a `lightning-button`
component.

Finally, define the errors and map them to `fieldNames`. When the error is
triggered, the borders for the `amount` and `contact` cells turn red to
represent the error state.

```javascript
    triggerError(event) {
           this.errors = {
                rows: {
                    b: {
                        title: 'We found 2 errors.',
                        messages: [
                            'Enter a valid amount.',
                            'Verify the email address and try again.'
                        ],
                        fieldNames: ['amount', 'contact']
                    }
                },
                table: {
                    title: 'Your entry cannot be saved. Fix the errors and try again.',
                    messages: [
                        'Row 2 amount must be number',
                        'Row 2 email is invalid'
                    ]
                }
            };
        }
```

#### Text Wrapping and Clipping

You can wrap or clip text within columns. Text wrapping expands the rows vertically to reveal more content. Text clipping truncates the content to a single line within the column.

To toggle between the two views, select **Wrap text** or **Clip text** from
the dropdown menu on the column header.

If the number of characters is more than what the column width can hold,
content is clipped by default.

Text wrapping and clipping are not supported for row number columns and the following data types:

-   action
-   boolean
-   button
-   button-icon
-   date-local

For `text` data type, text clipping converts newline characters to spaces and condenses multiple spaces or tabs to one space. Text clipping suppresses line breaks, truncates content to fit a single line in the column, and adds a trailing ellipsis. Text wrapping breaks lines and hyphenates words as needed to fit the column.

To enable text wrapping by default, set `wrapText` to true on the `columns` property.

```javascript
const columns = [
    {
        label: 'Description',
        fieldName: 'description',
        type: 'text',
        wrapText: true,
    },
    //other column data
];
```

To display a number of lines of text in the column and hide the remaining lines, use `wrap-text-max-lines`.
This example displays three lines of text and hides the rest; the text on line 3 is truncated and displayed with an ellipsis.

```html
<lightning-datatable
    data={data}
    columns={columns}
    key-field="Id"
    wrap-text-max-lines="3"
>
</lightning-datatable>
```

Handle the selection of **Wrap text** or **Clip text** on the column header using the `onheaderaction` handler.
To return the name of the action, use the `event.target.action.name` property.

#### Accessibility

`lightning-datatable` renders with a `grid` role and a polite live region that announces whether the table is in navigation mode or action mode. The label toggles the action mode when you press the Enter key or Space Bar. It toggles back to navigation mode when you press the Esc key twice to return focus to the cell. The component also announces the column width during a resize.

Each row header renders with an `aria-label` attribute with the labels you provide for the column definition. By default, the row number column renders with `aria-label="Row Number"` and cannot be changed. When row selection is enabled, each row renders with `aria-selected` set to true or false depending on whether the row is selected. Each cell renders with a `gridcell` role.

Use the following `aria` attributes on `lightning-datatable` to provide a caption or description on your table for assistive technologies. These attributes are rendered on the `<table>` element. 

| Attribute        | Type              | Description                                                                                                                                        |
| ---------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| aria-label       | string            | Provides an assistive label to identify a table from other tables on a page.                                                                       |
| aria-describedby | ID reference list | Specifies the ID or space-separated list of IDs that describes the current element.                                                                |
| aria-labelledby  | ID reference list | Specifies the ID or space-separated list of IDs of the element or elements that contain visible descriptive text to caption or describe the table. |

When using `aria-label`, consider using `aria-describedby` to provide supplemental information. We don't recommend using `aria-label` together with `aria-labelledby`. When there's visible text that labels an element, consider using `aria-labelledby` instead of `aria-label`. 

If you use `aria-describedby`, the element that provides the description doesn't need to be visible. For more information, see [MDN web docs: aria-describedby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby).

##### Provide an Accessible Label for the Table

Use the `aria-label` attribute to provide a more descriptive label for the datatable for assistive technology. The `aria-label` attribute and its value are passed down to the rendered `table` element.
On pages with multiple tables, `aria-label` helps users identify which table
they're accessing.

Set the attribute in `lightning-datatable` in your template.

```html
<lightning-datatable aria-label="Account Details by Year for EMEA Region">
</lightning-datatable>
```

Change the ARIA label dynamically using the `ariaLabel` property.

```javascript
const myLightningDataTableElement = this.template.querySelector(
    'lightning-datatable'
);
myLightningDataTableElement.ariaLabel =
    'Account Details by Revenue for EMEA Region';
```

The `aria-label` attribute doesn't support empty strings. If you set `aria-label=""` in the HTML or `.ariaLabel = ""` in JavaScript, the table's `aria-label`
attribute is hidden, not rendered with an empty string. An empty label string can confuse screen readers.

##### Provide an Accessible Caption for the Table

If you have descriptions on an element or on multiple elements for the table, set the `aria-labelledby` value with the ID or list of IDs of the elements.

```html
<h2 id="table-desc1">Account Details by Year</h2>
<h3 id="table-desc2">EMEA Region</h3>
<lightning-datatable
    aria-labelledby="table-desc1 table-desc2"
    key-field="Id"
    data={data}
    columns={columns}
>
</lightning-datatable>
```

`lightning-datatable` generates a unique string for the element and `aria-labelledby` value to prevent any naming conflicts with other `<table>` elements on the page. Always verify that your rendered table correctly matches the IDs of the descriptive text in the DOM with a screen reader like JAWS or VoiceOver.

##### Toggle Between Navigation and Action Modes

You can use data tables in navigation mode and action mode using the keyboard.
To enter navigation mode, tab into the data table, which triggers focus on the
first data cell in the table body. Use the arrow keys to move around the
table.

To enter action mode, press the Enter key or Space Bar. You can navigate to each actionable element in the table using the Tab key.

Columns can be resized in action mode. First, navigate to the header using the arrow keys. Then, press the Tab key to activate the column divider to resize a column. You can resize a column by increasing or decreasing its width using one of the following key combinations.

-   Right and Left Arrow keys
-   Up and Down Arrow keys
-   Page Up and Page Down keys

When you resize a column, the new column width is announced by assistive technology. To finish resizing the column and return to navigation mode, press the Esc key.

When focus is on a cell that contains a link, pressing enter to navigate to
the link is currently not supported. This limitation applies to cells that
contain data of type url, phone, and email.

On custom data types, accessibility and keyboard navigation are currently not supported
because they require DOM manipulation, which Lightning Locker prevents in custom components.
For more information, see [Security with Lightning Locker](https://developer.salesforce.com/docs/platform/lwc/guide/security-locker-service).

#### Usage Considerations

This component has usage differences from its Aura counterpart. See [Base Components: Aura Vs Lightning Web Components](https://developer.salesforce.com/docs/platform/lwc/guide/migrate-map-aura-lwc-components) in the Lightning Web Components Developer Guide.

#### Custom Events

**`cancel`**

The event fired when the cancel button is pressed during inline editing.

The `cancel` event does not return any parameter.

The event properties are as follows.

| Property   | Value | Description                                                                    |
| ---------- | ----- | ------------------------------------------------------------------------------ |
| bubbles    | false | This event does not bubble.                                                    |
| cancelable | true  | This event can be canceled. You can call `preventDefault()` on this event.     |
| composed   | false | This event does not propagate outside the template in which it was dispatched. |

**`headeraction`**

The event fired when a header action is selected, such as text wrapping, text clipping, or a custom header action.

The `headeraction` event returns the following parameters.

| Parameter        | Type   | Description                                                                                                                                                                                             |
| ---------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| action           | object | The action definition described in **Creating Header Actions**.                                                                                                                                         |
| columnDefinition | object | The column definition specified in the `columns` property, for example, the key-value pairs for `label`, `fieldName`, `type`, `typeAttributes`, and `wrapText`. See **Working with Column Properties**. |

The event properties are as follows.

| Property   | Value | Description                                                                                                |
| ---------- | ----- | ---------------------------------------------------------------------------------------------------------- |
| bubbles    | false | This event does not bubble.                                                                                |
| cancelable | false | This event has no default behavior that can be canceled. You cannot call `preventDefault()` on this event. |
| composed   | false | This event does not propagate outside the template in which it was dispatched.                             |

**`loadmore`**

The event fired when you scroll to the bottom of the table to load more data, until there are no more data to load.

The `loadmore` event returns the following parameters.

| Parameter             | Type    | Description                                                                                                              |
| --------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------ |
| enableInfiniteLoading | boolean | Specifies whether infite loading is available on the table.                                                              |
| isLoading             | boolean | Specifies that data is loading and displays a spinner on the table.                                                      |
| loadMoreOffset        | integer | The number of pixels between the bottom of the table and the current scroll position, used to trigger more data loading. |

The event properties are as follows.

| Property   | Value | Description                                                                                                |
| ---------- | ----- | ---------------------------------------------------------------------------------------------------------- |
| bubbles    | false | This event does not bubble.                                                                                |
| cancelable | false | This event has no default behavior that can be canceled. You cannot call `preventDefault()` on this event. |
| composed   | false | This event does not propagate outside the template in which it was dispatched.                             |

**`resize`**

The event fired when the a table column is resized, which depends on which width mode you're using.

In the default `fixed` width mode, the `resize` event is fired when:

-   The table renders initially
-   You manually resize a column
-   The number of columns changes on a subsequent rerender

In `auto` width mode, the event is fired only when you manually resize a column. See **Implementing Fixed Width Mode** and **Implementing Auto Width Mode** for more information.

The `resize` event is _not_ fired in the following cases.

-   You resize the browser or viewport, causing adjustments in the column widths
-   You change the column definition, but not the number of columns, causing adjustments in the column widths.

The `resize` event returns the following parameters.

| Parameter       | Type    | Description                                                                                                                                         |
| --------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| columnWidths    | object  | The width of all columns, in pixels. For example, a table with 5 columns of 205px width each at initial render returns `[205, 205, 205, 205, 205]`. |
| isUserTriggered | boolean | Specifies whether the column resize is caused by a user action.                                                                                     |

The event properties are as follows.

| Property   | Value | Description                                                                                                |
| ---------- | ----- | ---------------------------------------------------------------------------------------------------------- |
| bubbles    | false | This event does not bubble.                                                                                |
| cancelable | false | This event has no default behavior that can be canceled. You cannot call `preventDefault()` on this event. |
| composed   | false | This event does not propagate outside the template in which it was dispatched.                             |

**`rowselection`**

The event fired when the row is selected.

The `rowselection` event returns the following parameter.

| Parameter    | Type   | Description                             |
| ------------ | ------ | --------------------------------------- |
| selectedRows | object | The data in the rows that are selected. |
| config.action | string | The type of selection event. Valid options include 'selectAllRows', 'deselectAllRows', 'rowSelect', and 'rowDeselect'. |

The event properties are as follows.

| Property   | Value | Description                                                                                                |
| ---------- | ----- | ---------------------------------------------------------------------------------------------------------- |
| bubbles    | false | This event does not bubble.                                                                                |
| cancelable | false | This event has no default behavior that can be canceled. You cannot call `preventDefault()` on this event. |
| composed   | false | This event does not propagate outside the template in which it was dispatched.                             |

**`save`**

The event fired when data is saved during inline editing.

The `save` event returns the following parameter.

| Parameter   | Type   | Description                                              |
| ----------- | ------ | -------------------------------------------------------- |
| draftValues | object | The current value that's provided during inline editing. |

The event properties are as follows.

| Property   | Value | Description                                                                                                |
| ---------- | ----- | ---------------------------------------------------------------------------------------------------------- |
| bubbles    | false | This event does not bubble.                                                                                |
| cancelable | false | This event has no default behavior that can be canceled. You cannot call `preventDefault()` on this event. |
| composed   | false | This event does not propagate outside the template in which it was dispatched.                             |

**`sort`**

The event fired when a column is sorted.

The `sort` event returns the following parameters.

| Parameter     | Type   | Description                                                    |
| ------------- | ------ | -------------------------------------------------------------- |
| fieldName     | string | The fieldName that controls the sorting.                       |
| sortDirection | string | The sorting direction. Valid options include 'asc' and 'desc'. |

The event properties are as follows.

| Property   | Value | Description                                                                                                |
| ---------- | ----- | ---------------------------------------------------------------------------------------------------------- |
| bubbles    | false | This event does not bubble.                                                                                |
| cancelable | false | This event has no default behavior that can be canceled. You cannot call `preventDefault()` on this event. |
| composed   | false | This event does not propagate outside the template in which it was dispatched.                             |


#### LWC Recipes

The [LWC Recipes GitHub repository](https://github.com/trailheadapps/lwc-recipes) contains code examples for Lightning Web Components that you can test in an org.

For a recipe that uses `lightning-datatable`, see the `c-datatable-*` components in the LWC Recipes repo.
