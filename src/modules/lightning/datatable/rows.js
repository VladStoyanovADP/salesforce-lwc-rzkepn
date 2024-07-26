import { assert, isRTL } from 'lightning/utilsPrivate';
import {
    getTypeAttributesValues,
    getSubTypeAttributesValues,
    getCellAttributesValues,
} from './columns';
import { addHeaderIndex } from './indexes';
import {
    setInliningProperties,
    updateInlineCell,
    updateInlineClassAndStyle,
    updateInlineCellValue,
} from './rowsInlining';
import { getRowNumberError } from './rowNumber';
import {
    getCurrentSelectionLength,
    SELECTABLE_HEADER_TYPE,
    SORTING_MENU_HEADER_TYPE,
} from './rowSelectionShared';
import { getAttributesNames } from './types';
import { classSet, isObjectLike } from './utils';

const CELL_EDIT_CLASS = 'slds-cell-edit';
const HAS_ERROR_CLASS = 'slds-has-error';
const IS_EDITED_CLASS = 'slds-is-edited';
const ROLE_BASED_CELL_CLASS = 'cell';
const TREE__ITEM_CLASS = 'slds-tree__item';

function resolveAttributeValue(attrValue, rowData) {
    if (isObjectLike(attrValue)) {
        const { fieldName } = attrValue;
        if (fieldName) {
            return rowData[fieldName];
        }
    }
    return attrValue;
}

export function setKeyField(state, value) {
    if (typeof value === 'string') {
        state.keyField = value;
    } else {
        assert(
            false,
            `The "keyField" value expected in lightning:datatable must be type String.`
        );
        state.keyField = undefined;
    }
}

/**
 * Compute state.rows and state.indexes based on the current normalized (data, columns).
 *
 * TODO: Reduce redundant calls to this function. This is indirectly called by the
 * setters of 'data' and 'columns'. Additionally, for the role-based table, if we are
 * attaching the 'cell' class, calling this from connectedCallback of datatable would
 * eliminate the need for updateCellClassForRoleBasedMode.
 *
 * @param {Object} state - The datatable state
 * @param {Object} types - The type handling factory
 */
export function updateRowsAndCells(state, types, datatableId) {
    const {
        columns,
        data,
        keyField,
        maxRowSelection,
        renderModeInline,
        rowHeight,
        virtualize,
    } = state;
    const { privateCustomTypes } = types;
    const rtl = isRTL();
    const { length: rowCount } = data;
    const { length: colCount } = columns;
    const currentSelectionLength =
        maxRowSelection === 1 ? 1 : getCurrentSelectionLength(state);
    const inputType = maxRowSelection === 1 ? 'radio' : 'checkbox';
    const isInputTypeCheckbox = inputType === 'checkbox';

    let scopeCol;
    let treeColTypeAttrs;

    // Initializing all indexes.
    const indexes = {};
    const headerIndexes = Array(colCount);

    for (let colIndex = 0; colIndex < colCount; colIndex += 1) {
        const col = columns[colIndex];
        const { colKeyValue, type: columnType } = col;
        addHeaderIndex(headerIndexes, indexes, colKeyValue, colIndex);

        // Find scopeCol
        if (!scopeCol && col.isScopeCol && types.isValidType(columnType)) {
            scopeCol = col;
        }
        if (columnType === 'tree' && treeColTypeAttrs === undefined) {
            treeColTypeAttrs = getTypeAttributesValues(col);
        }
    }

    // create arrays to track inlined checkbox, lookup and url cells
    // so they can get necessary updates on re-renders
    const checkboxCells = [];
    const lookupCells = [];
    const shownUrlCells = [];
    const rows = Array(rowCount);

    // Store in caches early so data can be referenced by other methods
    // during initialization.

    // Untracked state changes.
    state.checkboxCells = checkboxCells;
    state.headerIndexes = headerIndexes;
    state.indexes = indexes;
    state.lookupCells = lookupCells;
    state.shownUrlCells = shownUrlCells;
    // Tracked state changes.
    state.rows = rows;

    // Add row indexes.
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
        const rowData = data[rowIndex];
        const rowDataKeyField = rowData[keyField];
        const rowKeyValue = rowDataKeyField
            ? `${rowDataKeyField}`
            : `row-${rowIndex}`;

        state.indexes[rowKeyValue] = { rowIndex };

        const isRowSelected = !!state.selectedRowsKeys[rowKeyValue];
        const ariaSelected = isRowSelected ? 'true' : false;
        const rowNumber = rowIndex + 1;
        const scopeColValue = scopeCol
            ? rowData[scopeCol.fieldName]
            : undefined;
        const cells = Array(colCount);
        const checkboxHidden = state.hideCheckboxColumn;

        const row = {
            ariaRowIndex: rowIndex + 2, // aria attrs are base-1 and also count header as a row
            ariaSelected: checkboxHidden ? null : ariaSelected,
            cells,
            classnames: `slds-hint-parent${
                isRowSelected ? ' slds-is-selected' : ''
            }`,
            inputType,
            isSelected: isRowSelected,
            isDisabled:
                !isRowSelected &&
                maxRowSelection !== 1 &&
                currentSelectionLength === maxRowSelection,
            key: rowKeyValue,
            rowIndex,
            rowNumber, // for UTAM since methods are base-1
            style: virtualize
                ? `position:absolute;top:${rowIndex * rowHeight}px;`
                : '',
            tabIndex: -1,
            level: undefined,
            posInSet: undefined,
            setSize: undefined,
            isExpanded: undefined,
            hasChildren: undefined,
        };

        // Add tree specific row properties.
        if (treeColTypeAttrs) {
            const hasChildren = !!resolveAttributeValue(
                treeColTypeAttrs.hasChildren,
                rowData
            );
            row.hasChildren = hasChildren;
            row.isExpanded = hasChildren
                ? `${!!resolveAttributeValue(
                      treeColTypeAttrs.isExpanded,
                      rowData
                  )}`
                : undefined;
            row.level =
                resolveAttributeValue(treeColTypeAttrs.level, rowData) || 1;
            row.posInSet =
                resolveAttributeValue(treeColTypeAttrs.posInSet, rowData) || 1;
            row.setSize =
                resolveAttributeValue(treeColTypeAttrs.setSize, rowData) || 1;
        }

        // Store in caches early so data can be referenced by other methods
        // during initialization.
        indexes[rowKeyValue] = row;
        rows[rowIndex] = row;

        // Add cell indexes.
        for (let colIndex = 0; colIndex < colCount; colIndex += 1) {
            const col = columns[colIndex];
            const {
                colKeyValue,
                isScopeCol,
                label: dataLabel,
                type: columnType,
                typeAttributes,
            } = col;
            const cellKeyValue = `${rowKeyValue}-${colKeyValue}`;
            const columnSubType = typeAttributes
                ? typeAttributes.subType
                : undefined;
            const hasTreeData = columnType === 'tree';
            const privateType =
                privateCustomTypes && privateCustomTypes.get(columnType);
            const standardCellLayout = privateType
                ? privateType.standardCellLayout
                : false;
            const displayReadOnlyIcon = !!col.displayReadOnlyIcon;
            const editable = !!resolveAttributeValue(col.editable, rowData);
            const isEditable = editable && types.isEditableType(columnType);
            const isValidType = types.isValidType(columnType);
            const isCheckbox = columnType === SELECTABLE_HEADER_TYPE;
            const isSortingMenu = columnType === SORTING_MENU_HEADER_TYPE;
            const isCustom = privateType !== undefined;
            const isCustomBareLayout = isCustom && !standardCellLayout;
            const isCustomStandardLayout = isCustom && standardCellLayout;
            const isDataType = isValidType && !isScopeCol;
            const isDataTypeScope = isValidType && isScopeCol;

            // cell object creation
            const cell = {
                ariaReadOnly: !editable,
                cellKeyValue,
                class: '',
                colIndex,
                colKeyValue, // unique column key value
                columnSubType,
                columnType,
                dataLabel,
                displayReadOnlyIcon,
                displayValue: rowData.displayValue || '',
                describedBy: null,
                editable,
                hasError: undefined,
                hasTreeData,
                isCheckbox,
                isCustom,
                isCustomBareLayout,
                isCustomStandardLayout,
                isDataType,
                isDataTypeScope,
                isEditable,
                isRTL: rtl,
                isSortingMenu,
                rowIndex,
                rowKeyValue, // unique row key value
                rowNumber,
                scopeColValue,
                style: '',
                tabIndex: -1,
                value: undefined,
                wrapText: undefined, // wrapText state
                wrapTextMaxLines: 0,
            };

            // Store in caches early so data can be referenced by other methods
            // during initialization.
            indexes[cellKeyValue] = cell;
            cells[colIndex] = cell;

            if (!col.internal) {
                // Assign cell type or cell subType attributes.
                let attributeNames;
                let attributeValues;
                if (columnSubType) {
                    attributeNames = getAttributesNames(columnSubType);
                    attributeValues = getSubTypeAttributesValues(col);
                } else {
                    const typeDesc = types.getType(columnType);
                    attributeNames = typeDesc && typeDesc.typeAttributes;
                    attributeValues = getTypeAttributesValues(col);
                }
                const attributeNamesLength = attributeNames
                    ? attributeNames.length
                    : 0;
                for (let i = 0; i < attributeNamesLength; i += 1) {
                    const attrName = attributeNames[i];
                    const attrValue = attributeValues[attrName];
                    cell[`typeAttribute${i}`] = resolveAttributeValue(
                        attrValue,
                        rowData
                    );
                }

                // Extract the `cellAttributes` and their values that are specified in the
                // column definition.
                // If a cell attribute points to a fieldName in a row, that value is resolved here.
                // This object that contains the resolved mapping is then set in the `cell`
                // object in each row.
                const cellAttributes = getCellAttributesValues(col);
                const keys = Object.keys(cellAttributes);
                for (let i = 0; i < keys.length; i += 1) {
                    const attrName = keys[i];
                    const attrValue = cellAttributes[attrName];
                    cell[attrName] = resolveAttributeValue(attrValue, rowData);
                }

                // If this is tree grid, this maps and sets into the cell object
                // the tree specific attributes:
                // 1) row.hasChildren to typeAttribute21 and
                // 2) row.isExpanded to and typeAttribute22
                if (hasTreeData) {
                    // Attaches if the row containing this cell hasChildren or
                    // not and isExpanded or not attributes to typeAttribute21
                    // and typeAttribute22 respectively typeAttribute0-typeAttribute20
                    // are reserved for types supported by tree
                    cell.typeAttribute21 = row.hasChildren;
                    cell.typeAttribute22 = row.isExpanded === 'true';
                }
            }

            // adding cell indexes to state.indexes
            // Keeping the hash for backward compatibility, but we need to have 2 indexes, 1 for columns and one for rows,
            // because of memory usage and also at certain point we might have the data but not the columns
            state.indexes[row.key][colKeyValue] = [rowIndex, colIndex];
            cells[colIndex] = cell;

            if (renderModeInline) {
                setInliningProperties(
                    state,
                    cell,
                    isInputTypeCheckbox,
                    datatableId
                );
            }
            // Update cell properties including class, style, and value properties.
            updateCell(state, rowIndex, colIndex);

            // Update shownUrlCells state since it's dependent on updateCell
            if (cell.showUrlLink) {
                shownUrlCells.push(cell);
            }
        }
    }

    state.hasCalledUpdateRowsAndCells = true;
}

/**
 * Cells are normally updated via updateRowsAndCells().
 * However, a smaller update can be used when modifying datatable properties
 * such as dt.errors and dt.wrapTextMaxLines.
 *
 * @param {Object} state - The datatable state
 */
export function updateCells(state, types) {
    if (!state.hasCalledUpdateRowsAndCells) {
        updateRowsAndCells(state, types);
        return;
    }
    const { rows } = state;
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
        for (
            let colIndex = 0;
            colIndex < rows[rowIndex].cells.length;
            colIndex += 1
        ) {
            updateCell(state, rowIndex, colIndex);
        }
    }
}

/**
 * Performs a smaller update on the cell at the given rowIndex and colIndex.
 * Used by updateCells() and updateWrapTextAndMaxLinesValuesInCells().
 *
 * @param {Object} state - The tracked datatable state
 * @param {Object} rowIndex - The cell row index
 * @param {Object} colIndex - The cell column index
 */
export function updateCell(state, rowIndex, colIndex) {
    const { renderModeRoleBased } = state;
    const { rows: errorsRows } = state.errors;
    const row = state.rows[rowIndex];
    const rowData = state.data[rowIndex];
    const { key: rowKeyValue } = row;
    const dirtyRowData = state.inlineEdit.dirtyValues[rowKeyValue];
    const rowErrors = errorsRows && errorsRows[rowKeyValue];
    const cellErrors = rowErrors && rowErrors.cells;
    const errorFieldNames = rowErrors && rowErrors.fieldNames;
    const col = state.columns[colIndex];
    const cell = row.cells[colIndex];
    const { colKeyValue, columnKey, fieldName, wrapText } = col;
    const dirtyValue = dirtyRowData && dirtyRowData[colKeyValue];
    const hasError = columnKey
        ? !!(cellErrors && cellErrors[columnKey])
        : !!(errorFieldNames && errorFieldNames.includes(fieldName));
    // value based on the fieldName
    const value = dirtyValue === undefined ? rowData[fieldName] : dirtyValue;
    const wrapTextMaxLines = wrapText ? state.wrapTextMaxLines : undefined;

    cell.hasError = hasError;
    cell.wrapText = wrapText;
    cell.wrapTextMaxLines = wrapTextMaxLines;
    cell.value = value;

    if (col.internal && col.type === 'rowNumber') {
        cell.typeAttribute0 = getRowNumberError(rowErrors, cell.scopeColValue);
    }

    const cellAttributes = getCellAttributesValues(col);
    let cellClass = resolveAttributeValue(cellAttributes.class, rowData) || '';
    if (cell.hasTreeData && !cellClass) {
        cellClass += (cellClass.length ? ' ' : '') + TREE__ITEM_CLASS;
    }
    if (cell.displayReadOnlyIcon || cell.editable) {
        cellClass += (cellClass.length ? ' ' : '') + CELL_EDIT_CLASS;
    }
    if (hasError) {
        cellClass += (cellClass.length ? ' ' : '') + HAS_ERROR_CLASS;
    }
    if (dirtyValue !== undefined) {
        cellClass += (cellClass.length ? ' ' : '') + IS_EDITED_CLASS;
        cell.describedBy = 'unsaved-cell-notification';
    }
    if (renderModeRoleBased) {
        cellClass += (cellClass.length ? ' ' : '') + ROLE_BASED_CELL_CLASS;
    }

    cell.class = cellClass;
    cell.style = computeCellStyles(cell, col, renderModeRoleBased, cell.style);

    if (cell.isInlined) {
        updateInlineCell(cell);
        updateInlineClassAndStyle(cell, cellClass);
        updateInlineCellValue(cell, value);
    }
}

/**
 * Computes styles to be set on the cell
 * 1. Remove padding from the cell if the cell is of a custom type
 *    and has opted out of using the standard layout
 * 2. Set width of the cell. Width of each cell needs to be set and
 *    managed by ourselves unlike the <table> version.
 *
 * @param {Object} types - instance of DatatableTypes from `./types.js`
 * @param {Object} col - column definition
 * @param {Boolean} renderModeRoleBased - render mode of datatable (div || table)
 * @param {String} initValue - default value for cell styles
 * @returns {String} - styles to be set on the cell
 */
function computeCellStyles(cell, col, renderModeRoleBased, initValue = '') {
    let cellStyle = initValue;
    if (cellStyle && !cellStyle.endsWith(';')) {
        cellStyle += ';';
    }

    if (cell.isCustomBareLayout) {
        // When a custom type is not using the standard layout,
        // remove the padding that comes with the standard layout
        cellStyle += 'padding: 0;';
    }

    // Width needs to be managed when rendering as divs
    if (renderModeRoleBased) {
        const { columnWidth } = col;
        if (columnWidth > 0) {
            cellStyle += `width:${columnWidth}px;`;
        }
    }

    return cellStyle;
}

/**
 * For the role-based table, we need to manage the width of each cell separately.
 * Re-compute the cell styles so that the width of the cell is set
 * to that of its column.
 *
 * @param {Object} state - Datatable's state object
 */
export function recomputeCellStyles(state) {
    const { columns } = state;
    state.rows.forEach((row) => {
        row.cells.forEach((cell, colIndex) => {
            const colData = columns[colIndex];
            const cellAttrs = getCellAttributesValues(colData);
            const style = resolveAttributeValue(cellAttrs.style, row) || '';
            cell.style = computeCellStyles(cell, colData, true, style);
        });
    });
}

/**
 * The cells' classes are normally updated via `updateRowsAndCells()`. This ideally
 * happens after renderMode is set since `updateRowsAndCells` requires the final
 * renderMode value in order to set the 'cell' class on each cell.
 *
 * However, in some cases, it's possible that updateRowsAndCells is called
 * before the renderMode is set (to 'role-based'). This will cause the 'cell' class to NOT be set
 * in the individual cells because state.renderModeRoleBased will be `false` at that point.
 * As a result, positioning of the cell content will be off.
 *
 * In such a case where the renderMode is 'role-based' and when the updateRowsAndCells
 * has already been called (indicated by the presence of 'state.rows'), retroactively
 * add the 'cell' class to each cell.
 *
 * TODO: The 'cell' class will not be required once we move to the SLDS blueprint.
 * Remove this and usages once datatable migrates to using the SLDS blueprint for the role-based table.
 *
 * @param {Object} state - Datatable's state object
 */
export function updateCellClassForRoleBasedMode(state) {
    if (state.renderModeRoleBased && state.rows) {
        state.rows.forEach((row) => {
            row.cells.forEach((cell) => {
                const classes = classSet(cell.class);
                classes.add('cell');
                cell.class = classes.toString();
            });
        });
    }
}
