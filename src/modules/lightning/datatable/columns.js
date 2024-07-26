import labelRowNumber from '@salesforce/label/LightningDatatable.rowNumber';
import rowActionsDefaultAriaLabel from '@salesforce/label/LightningDatatable.rowActionsDefaultAriaLabel';
import { normalizeBoolean } from 'lightning/utilsPrivate';
import { isObjectLike } from './utils';
import { addHeaderIndex, getCellByKeys, HEADER_ROW_KEY } from './indexes';
import { ROW_NUMBER_INITIAL_WIDTH } from './rowNumber';
import {
    SELECTABLE_HEADER_TYPE,
    SORTING_MENU_HEADER_TYPE,
} from './rowSelectionShared';

const i18n = {
    rowActionsDefaultAriaLabel,
    rowNumber: labelRowNumber,
};

const ROW_NUMBER_COLUMN = {
    type: 'rowNumber',
    ariaLabel: i18n.rowNumber,
    initialWidth: ROW_NUMBER_INITIAL_WIDTH,
    internal: true,
    minWidth: 52,
    maxWidth: 1000,
    resizable: false,
    sortable: false,
    tabIndex: -1,
};

const SELECTABLE_COLUMN = {
    type: SELECTABLE_HEADER_TYPE,
    fixedWidth: 32,
    internal: true,
    tabIndex: -1,
};

const SORTING_MENU_COLUMN = {
    type: SORTING_MENU_HEADER_TYPE,
    fixedWidth: 32,
    internal: true,
    tabIndex: -1,
    resizable: false,
};

/**
 * Steps through and corrects column definitions inconsistencies.
 *
 * For customer-specified columns, we verify all parameters are valid and set
 * how we would expect them to prevent errors from bubbling up.
 * See `normalizeColumnDataType`, `normalizeEditable`.
 *
 * For tree-types, we verify all sub-type attributes are within our allowed
 * parameters. See `getNormalizedSubTypeAttribute`.
 *
 * @param {Object} state - The datatable state
 * @param {Array} rawColumns - The user provided column definitions to normalize
 * @param {Object} types - The type handling factory
 */
export function setColumns(state, rawColumns, types) {
    // Untracked state changes.
    state.hadTreeDataTypePreviously = state.treeColumn !== undefined;
    state.treeColumn = undefined;

    // Remove old header indexes.
    let { headerIndexes } = state;
    const { indexes } = state;
    // Don't clear all indexes just remove old header indexes from the shared indexes object.
    for (let i = 0, { length } = headerIndexes; i < length; i += 1) {
        // Setting to `undefined` instead of using `delete` for better performance.
        indexes[headerIndexes[i].cellKeyValue] = undefined;
    }

    const { length: colCount } = rawColumns;
    if (colCount === 0) {
        // Tracked state change.
        state.columns = [];
        // Untracked state changes.
        state.headerIndexes = [];
        return;
    }

    // var to track the column where the last action column is present
    let lastActionColumnIndex = -1;
    let normColCount = colCount;
    let { showRowNumberColumn, showActionsMenu } = state;
    const notHideCheckboxColumn = !state.hideCheckboxColumn;

    if (!showRowNumberColumn) {
        for (let colIndex = 0; colIndex < colCount; colIndex += 1) {
            if (rawColumns[colIndex].editable) {
                showRowNumberColumn = true;
                // Untracked state change.
                state.showRowNumberColumn = true;
                break;
            }
        }
    }
    if (showRowNumberColumn) {
        normColCount += 1;
    }
    if (notHideCheckboxColumn) {
        normColCount += 1;
    }

    // set variable to see if there is an 'action' column present
    rawColumns.forEach((column, index) => {
        if (column.type === 'action') {
            lastActionColumnIndex = index;
        }
    });

    const isActionColumnInEnd = lastActionColumnIndex === rawColumns.length - 1;

    /**
     * only want to add an extra column for the sorting menu if type='action' column is
     * not in the last column of datatable, if it is, then we can use its column header
     * for the sorting menu
     **/
    if (showActionsMenu && !isActionColumnInEnd) {
        normColCount += 1;
    }
    let normalizedColumns = Array(normColCount);

    // Store in caches early so data can be referenced by other methods
    // during initialization.
    headerIndexes = Array(normColCount);
    // Tracked state change.
    state.columns = normalizedColumns;
    // Untracked state change.
    state.headerIndexes = headerIndexes;

    let firstColumnForReaders = 0;
    if (showRowNumberColumn) {
        normalizedColumns[firstColumnForReaders] = Object.assign(
            {},
            ROW_NUMBER_COLUMN
        );
        firstColumnForReaders += 1;
    }
    if (notHideCheckboxColumn) {
        normalizedColumns[firstColumnForReaders] = Object.assign(
            {},
            SELECTABLE_COLUMN
        );
        firstColumnForReaders += 1;
    }

    // if there is no action column existing, assign SORTING_MENU_COLUMN to last column
    if (showActionsMenu && !isActionColumnInEnd) {
        normalizedColumns[normColCount - 1] = Object.assign(
            // Assign to the last column
            {},
            SORTING_MENU_COLUMN
        );
    }
    for (let colIndex = 0; colIndex < colCount; colIndex += 1) {
        normalizedColumns[colIndex + firstColumnForReaders] =
            rawColumns[colIndex];
    }

    const { defaultSortDirection, sortedBy, sortedDirection } = state;
    const seenColumnKeys = new Set();

    for (let colIndex = 0; colIndex < normColCount; colIndex += 1) {
        const refCol = normalizedColumns[colIndex];
        const { columnKey } = refCol;

        // Verify `columnKey` is unique
        if (columnKey && seenColumnKeys.has(columnKey)) {
            console.error(
                `The "columnKey" column property must be unique. Found a duplicate of columnKey "${columnKey}".`
            );
        }
        seenColumnKeys.add(columnKey);

        const { type: refColumnType } = refCol;
        const colName = columnKey || refCol.fieldName;

        // Normalize columns.
        const normCol = {
            ariaLabel: '',
            cellAttributes: {},
            resizable: true,
            type: 'text',
            typeAttributes: {},
            subType: '',
        };
        if (refColumnType === 'action') {
            normCol.ariaLabel = i18n.rowActionsDefaultAriaLabel;
            normCol.fixedWidth = 50;
            normCol.resizable = false;
        } else if (refColumnType === 'tree') {
            normCol.subType = 'text';
        }
        Object.assign(normCol, refCol);

        // Store in caches early so data can be referenced by other methods
        // during initialization.
        normalizedColumns[colIndex] = normCol;

        let { type: columnType } = normCol;

        normCol.ariaLabel = normCol.label || normCol.ariaLabel || null;
        // `customType` attribute is needed to render default inline edit component
        normCol.editableCustomType =
            types.isStandardCellLayoutForCustomType(columnType);

        // normalize customer column
        if (!normCol.internal) {
            // normalize column dataType
            if (!types.isValidType(columnType)) {
                columnType = 'text';
                normCol.type = columnType;
            }
            // normalize editable
            if (types.isEditableType(columnType)) {
                const { editable } = normCol;
                if (!(editable && editable.fieldName)) {
                    normCol.editable = normalizeBoolean(editable);
                }
                normCol.editTemplate =
                    types.getCustomTypeEditTemplate(columnType);
            } else {
                normCol.editable = false;
                normCol.editTemplate = undefined;
            }
            // update column sorting state
            const { sortable } = normCol;
            if (sortable && colName === sortedBy) {
                normCol.sorted = true;
                normCol.sortAriaLabel =
                    sortedDirection === 'desc' ? 'descending' : 'ascending';
                normCol.sortedDirection = sortedDirection;
            } else {
                normCol.sorted = false;
                normCol.sortAriaLabel = sortable ? 'other' : null;
                normCol.sortedDirection = defaultSortDirection;
            }
        }

        // Generate colKeyValue after normalizing customer column.
        const colKeyValue =
            normCol.colKeyValue ||
            `${colName || colIndex}-${columnType}-${colIndex}`;

        normCol.colKeyValue = colKeyValue;
        normCol.isLastCol = colIndex === normColCount - 1;
        normCol.isScopeCol = colIndex === firstColumnForReaders;
        normCol.name = colName;
        normCol.tabIndex = -1;

        addHeaderIndex(headerIndexes, indexes, colKeyValue, colIndex);

        // normalize tree column
        if (normCol.type === 'tree') {
            if (state.treeColumn === undefined) {
                // Untracked state changes
                state.treeColumn = normCol;
            }
            // normalized subType attributes
            const { typeAttributes } = normCol;
            const typeAttributesOverrides = {};
            if (!types.isValidTypeForTree(typeAttributes.subType)) {
                typeAttributesOverrides.subType = 'text';
            }
            if (!typeAttributes.subTypeAttributes) {
                typeAttributesOverrides.subTypeAttributes = {};
            }
            normCol.typeAttributes = Object.assign(
                {},
                typeAttributes,
                typeAttributesOverrides
            );
        }

        // partially inline updateHeaderInternalActions from datatable/headerActions
        // change alignment for last col and second-to-last col when last col is
        // has a fixedWith under 100 (this includes action columns)
        const { actions } = normCol;
        normCol.actions = {
            menuAlignment:
                normCol.isLastCol ||
                normalizedColumns[colIndex + 1].type === 'action' ||
                normalizedColumns[colIndex + 1].fixedWidth < 100
                    ? 'auto-right'
                    : 'auto-left',
            customerActions: Array.isArray(actions) ? actions : [],
            internalActions: [],
        };
    }
}

/**
 * Retrieves the type attributes for a given column.
 *
 * @param {Object} column The column definition object.
 * @returns Type attributes for the given column, if they exist.
 */
export function getTypeAttributesValues(column) {
    const { typeAttributes } = column;
    return isObjectLike(typeAttributes) ? typeAttributes : {};
}

/**
 * Retrieves the sub-type attributes for a given column.
 *
 * @param {Object} column The column definition object.
 * @returns {Object} Sub-type attributes for the given column, if they exist.
 */
export function getSubTypeAttributesValues(column) {
    const { subTypeAttributes } = column.typeAttributes;
    return isObjectLike(subTypeAttributes) ? subTypeAttributes : {};
}

/**
 * Retrieves the cell attributes for a given column.
 *
 * @param {Object} column The column definition object.
 * @returns {Object} Cell attributes for the given column, if they exist.
 */
export function getCellAttributesValues(column) {
    const { cellAttributes } = column;
    return isObjectLike(cellAttributes) ? cellAttributes : {};
}

/**
 * Return the index in dt.columns (user definition) related to colKeyValue.
 *      -1 if no column with that key exist or if its internal.
 *
 * @param {Object} state The datatable state
 * @param {String} colKeyValue The generated key for the column
 * @returns {Number} The index in `dt.columns`. -1 if not found or if its internal.
 */
export function getUserColumnIndex(state, colKeyValue) {
    const { columns } = state;
    const headerCell = getCellByKeys(state, HEADER_ROW_KEY, colKeyValue);
    const colIndex = headerCell && headerCell.colIndex;
    if (
        colIndex === undefined ||
        colIndex === -1 ||
        columns[colIndex].internal
    ) {
        return -1;
    }
    let internalColumns = 0;
    for (let i = 0; i < colIndex; i += 1) {
        if (columns[i].internal) {
            internalColumns += 1;
        }
    }

    return colIndex - internalColumns;
}

/**
 * Return the index in state.columns (internal definition) related to colKeyValue.
 *
 * @param {Object} state The datatable state
 * @param {String} colKeyValue The generated key for the column
 * @returns {Number} The index in state.columns
 */
export function getStateColumnIndex(state, colKeyValue) {
    const headerCell = getCellByKeys(state, HEADER_ROW_KEY, colKeyValue);
    return headerCell === undefined ? -1 : headerCell.colIndex;
}
