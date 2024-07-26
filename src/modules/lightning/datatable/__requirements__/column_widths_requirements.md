Datatable provides two modes for computing widths to be allocated to the columns when datatable is rendered and rerendered
when various variables change. These modes are controlled by the api columnWidthsMode - which can take values `fixed` or `auto`, `fixed` being the default mode.
Refer the below specifications for each mode and what each mode does in various scenarios:

## FIXED WIDTHS MODE

### INITIAL RENDER

-   should size the columns based on the defined column widths when the column definitions are passed
    and the columns have fixed or initialWidths defined in them using `fixedWidth` or `initialWidth` attribute.

-   should size the columns by giving equal widths for all the columns when the column definitions have no defined widths (fixedWidth or initialWidth)
    and no data is set yet.
    Width is calculated by taking total available width for datatable and dividing equally amongst the columns. Columns widths
    for certain types like Row Number, Selection column, Action column are controlled by the component and are fixed.

-   should use same column widths as set currently when data is set at a later point and column definitions are already available.

### SUBSEQUENT RENDERS

-   should adjust column widths and distribute widths according to first two rules when column definitions are changed. Change in
    column definitions could be either change in number of columns or update in certain column(s). User needs to pass a new reference
    of columns with changes for them to take effect.

-   should use same column widths as set currently when the data is changed. Change in data could be either new data passed or data removed
    or change in existing data.

-   should adjust column widths as per first two rules when the row number offset defined by `rowNumberOffset` attribute is changed.

-   should adjust column widths as per first two rules when the browser window is resized.

-   should adjust column widths as per first two rules when the container containing the datatable changes in width.

-   should use new resized width for a column when a column is manually resized and the rest of the columns should maintain their widths
    (i.e) the table shouldnt fill container space if column width is reduced and table should show scrollbar if column width is increased manually.
    Manually resized columns will get same fixed width henceforth.
    Manual resizing can be done either using -

*   using mouse
*   using keyboard by pressing enter in the header cell, then tabbing to reach the resizer and pressing left or right arrow keys
*   on a touchscreen device - tap on the desired column resizer area, move to desired width and then release

-   should adjust column widths to fill the container space as per first two rules with the exception of manually-resized columns
    when the container is resized due to browser resize or container width changes.

## AUTO WIDTHS MODE

### INITIAL RENDER

-   should size the columns based on the defined column widths when the column definitions are passed
    and the columns have fixed or initialWidths defined in them using `fixedWidth` or `initialWidth` attribute.

-   should set widths of columns based on the visual width distribution of the column labels when the column definitions are passed but no data is set yet.
    If a column has too long label, the width is clamped by the `maxColumnWidth` attribute set on the datatable which is 1000px by default. If a column gets
    too small in width, the width is clamped to `minColumnWidth` attribute set on the datatable which is 50px by default.
    With visual width distribution of labels in columns, columns which would take wide space if table was rendered with no width constraints, will get more width
    as compared to columns which would take less space given their labels.

-   should size columns based on the column labels and defined widths when some columns have fixed or initialWidths defined and some dont and no data is set yet.

-   should set widths of columns based on the visual width distribution of the data in columns when the column definitions are already set and data is now set.
    With visual width distribution of data in columns, columns which would take wide space if table was rendered with no width constraints, will get more width
    as compared to columns which would take less space given the data in the columns. Same rules apply w.r.t to clamping to maxColumnWidth or minColumnWidth
    when width would exceed maxColumnWidth or when width would be less than minColumnWidth resp. If a column with long content has wrapText set to true,
    that column should take less space than it would have taken if there was no wrapText. It should be given width taking into consideration the visual distribution
    of this column taking into account text wrapped lines.

### SUBSEQUENT RENDERS

-   should trigger auto-resize of column widths with new ratios of data in columns when the data is changed (same number of rows)

-   should not trigger resize of column widths at all when new data is passed or data is removed (different number of rows).
    The columns should continue to use their set widths.

-   should trigger auto-resize of column widths with new ratios when column definitions are changed. Change in
    column definitions could be either change in number of columns or update in certain column(s). User needs to pass a new reference
    of columns with changes for them to take effect.

-   should keep the width ratios and adjust column widths to fit new screen size when the browser window is resized.

-   should keep the width ratios and adjust column widths to fit new container size when the container containing the datatable changes in width.

-   should adjust column widths with new ratios when the row number offset defined by `rowNumberOffset` attribute is changed.

-   should use new resized width for a column when a column is manually resized and the rest of the columns should maintain their widths
    (i.e) the table shouldnt fill container space if column width is reduced and table should show scrollbar if column width is increased manually.
    Manually resized columns will get same fixed width henceforth.
    Manual resizing can be done either using -

*   using mouse
*   using keyboard by pressing enter in the header cell, then tabbing to reach the resizer and pressing left or right arrow keys
*   on a touchscreen device - tap on the desired column resizer area, move to desired width and then release

-   should adjust column widths to fill the container space as per existing width ratios with the exception of manually-resized columns
    when the container is resized due to browser resize or container width changes after manual resize of a column.

## Open questions

-   TODO - Change from using width values stored in tracked variable to setting widths directly in dom

-   TODO - When to fire resize event in cases above should be agreed upon and documented - Done

### IMPLEMENTATION DETAILS

-   Datatable instantiates columnWidthManager

-   columnWidthManager listens to all the parameters that widthManager should care about and sets flag if resizingIsNeeded
    after rendering is done.

-   columnWidthManager also keep a track of if the width resizing strategy should recalculate width ratios.

-   During renderedCallback, columnWidthManager adjustColumnsSize is called which then checks the flag to see if resizing is needed
    and calls appropriate strategy to adjust columns size.

-   In case of autoWidthStrategy setting columns triggers resize computation and a rerender (since widths are changed in tracked var)
    and then setting data triggers rerender, another resize and another rerender for widths.

-   In case of fixedWidthStrategy setting columns triggers resize computation and a rerender (since widths are changed in tracked var)
    but setting data doesnt trigger rerender for widths.
