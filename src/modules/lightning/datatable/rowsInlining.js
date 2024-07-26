import labelEdit from '@salesforce/label/LightningDatatable.edit';
import labelEditHasError from '@salesforce/label/LightningDatatable.editHasError';
import labelEmailLabel from '@salesforce/label/LightningFormattedEmail.emailIconLabel';
import labelFalse from '@salesforce/label/LightningDatatable.false';
import labelSelectItem from '@salesforce/label/LightningDatatable.selectItem';
import labelTrue from '@salesforce/label/LightningDatatable.true';
import {
    dateTimeFormat,
    numberFormat,
    toDate,
} from 'lightning/internationalizationLibrary';
import {
    isTextIgnoreRTL,
    isValidPhone,
    makeAbsoluteUrl,
    parseToFormattedLinkifiedParts,
    toFormattedLocation,
    toFormattedNumber,
    toFormattedDate,
    toNorthAmericanPhoneNumber,
} from 'lightning/utilsPrivate';
import { TOOLTIP_ALLOWANCE } from './rowNumber';
import { getDefaultState } from './state';

const CELL_MARGIN_LEFT_CLASS = 'slds-m-left_x-small';
const CELL_WRAP = 'slds-cell-wrap';
const GRID_CLASS = 'slds-grid';
const GRID_ALIGN_END_CLASS = 'slds-grid_align-end';
const GRID_ALIGN_SPREAD_CLASS = 'slds-grid_align-spread';
const HYPHENATE_CLASS = 'slds-hyphenate';
const LINE_CLAMP_CLASS = 'slds-line-clamp';
const LTR_CONTENT_IN_RTL_CLASS = 'ltr-content-in-rtl';
const NO_SPACE_CLASS = 'slds-no-space';
const TRUNCATE_CLASS = 'slds-truncate';

const { keyboardMode: DEFAULT_KEYBOARD_MODE } = getDefaultState();

const i18n = {
    edit: labelEdit,
    editHasError: labelEditHasError,
    emailLabel: labelEmailLabel,
    false: labelFalse,
    selectItem: labelSelectItem,
    true: labelTrue,
};

const noopHandler = () => {};

const BASE_INLINING_PROPS = {
    isInlined: true,
    actionableElementsCount: 0,
    computedCellDivClass: '',
    computedCellDivStyle: '',
    computedMarginClassWhenLeftIconExists: '',
    computedWrapperClass: '',
    currentInputIndex: 0,
    editIconAssistiveText: '',
    hasFocus: false,
    hasLeftIcon: false,
    hasRightIcon: false,
    internalTabIndex: -1,
    isRTL: false, // url, email, phone
    mode: DEFAULT_KEYBOARD_MODE,
    shouldDisplayReadOnlyIcon: false,
};

/**
 * Adds all properties to cell required to inline the given type
 *
 * @param {Object} state - The datatable state
 * @param {Object} cell - The datatable cell
 * @param {Boolean} isInputTypeCheckbox - Whether input is using checkbox type
 * @param {String} datatableId - Unique id for the datatable
 */
export function setInliningProperties(
    state,
    cell,
    isInputTypeCheckbox,
    datatableId
) {
    const { columnSubType, columnType, isCheckbox, isCustom } = cell;

    // boolean
    if ('boolean' === columnType || 'boolean' === columnSubType) {
        Object.assign(cell, BASE_INLINING_PROPS, {
            isBoolean: true,
            isChecked: false,
            booleanCellAssistiveText: '',
        });
    }
    // checkbox
    else if (isCheckbox && isInputTypeCheckbox) {
        const { rowNumber } = cell;
        Object.assign(cell, BASE_INLINING_PROPS, {
            checkboxId: `${datatableId}-check-id-${rowNumber}`,
            checkboxLabelId: `check-button-label-${rowNumber}`,
            checkboxName: `${datatableId}-options-${rowNumber}`,
            checkboxSelectItemAssistiveText: `${i18n.selectItem} ${rowNumber}`,
        });
        state.checkboxCells.push(cell);
    }
    // radio
    else if (isCheckbox) {
        // radio inputs are not inlined
        Object.assign(cell, { isInlined: false });
    }
    // custom
    else if (isCustom) {
        Object.assign(cell, BASE_INLINING_PROPS, {
            keyboardMode: '', // should be defined
        });
    }
    // currency
    else if ('currency' === columnType || 'currency' === columnSubType) {
        Object.assign(cell, BASE_INLINING_PROPS, {
            isCurrency: true,
            currencyValue: '',
        });
    }
    // date-local
    else if ('date-local' === columnType || 'date-local' === columnSubType) {
        Object.assign(cell, BASE_INLINING_PROPS, {
            isDateLocal: true,
            dateLocalValue: '',
        });
    }
    // date
    else if ('date' === columnType || 'date' === columnSubType) {
        Object.assign(cell, BASE_INLINING_PROPS, {
            isDateTime: true,
            dateTimeValue: '',
        });
    }
    // email
    else if ('email' === columnType || 'email' === columnSubType) {
        Object.assign(cell, BASE_INLINING_PROPS, {
            isEmail: true,
            emailIconAssistiveText: '',
            emailIconHidden: false,
            emailLabel: '',
            showEmailLink: false,
        });
    }
    // location
    else if ('location' === columnType || 'location' === columnSubType) {
        Object.assign(cell, BASE_INLINING_PROPS, {
            isLocation: true,
            locationValue: '',
        });
    }
    // lookup
    else if ('reference' === columnType || 'reference' === columnSubType) {
        Object.assign(cell, BASE_INLINING_PROPS, {
            isLookup: true,
            _handleLookupAnchorClick: noopHandler,
            handleLookupAnchorClick: (event) => {
                cell._handleLookupAnchorClick(event);
            },
            lookupIsNavigable: false,
            lookupLink: '',
            lookupValue: cell.typeAttribute0,
        });
        state.lookupCells.push(cell);
    }
    // number
    else if ('number' === columnType || 'number' === columnSubType) {
        Object.assign(cell, BASE_INLINING_PROPS, {
            isNumber: true,
            numberValue: '',
        });
    }
    // percent
    else if ('percent' === columnType || 'percent' === columnSubType) {
        Object.assign(cell, BASE_INLINING_PROPS, {
            isPercent: true,
            percentValue: '',
        });
    }
    // phone
    else if ('phone' === columnType || 'phone' === columnSubType) {
        Object.assign(cell, BASE_INLINING_PROPS, {
            isPhone: true,
            phoneLabel: '',
            phoneLink: '',
            showPhoneLink: false,
        });
    }
    // row number
    else if ('rowNumber' === columnType || 'rowNumber' === columnSubType) {
        Object.assign(cell, BASE_INLINING_PROPS, {
            isRowNumber: true,
            computedRowNumberStyle: '',
            rowHasError: false,
        });
    }
    // text
    else if ('text' === columnType || 'text' === columnSubType) {
        Object.assign(cell, BASE_INLINING_PROPS, {
            isText: true,
            ignoreRTL: false,
            shouldFormatText: false,
            textParts: undefined,
            textValue: undefined,
        });
    }
    // url
    else if ('url' === columnType || 'url' === columnSubType) {
        Object.assign(cell, BASE_INLINING_PROPS, {
            isURL: true,
            _handleUrlAnchorClick: undefined,
            handlUrlAnchorClick: undefined,
            showUrlLink: false,
            urlLabel: '',
            urlLink: '',
            urlTarget: '',
            urlTooltip: '',
        });
    }
}

/**
 * Use to calculate a small subset of cell properties
 *
 * @param {Object} state - The datatable state
 * @param {Boolean} hasError - Whether an error is present on the cell
 */
export function updateInlineCell(cell) {
    if (cell.isEditable) {
        cell.editIconAssistiveText = `${i18n.edit} ${cell.dataLabel}${
            cell.hasError ? ` ${i18n.editHasError}` : ''
        }`;
        cell.editLabelId = `edit-${cell.cellKeyValue}`;
    } else {
        cell.shouldDisplayReadOnlyIcon = cell.displayReadOnlyIcon;
    }
    if (cell.iconName) {
        const { iconPosition } = cell;
        if (iconPosition === 'right') {
            cell.hasRightIcon = true;
        } else if (!iconPosition || iconPosition === 'left') {
            cell.hasLeftIcon = true;
        }
    }
    if (cell.isRowNumber) {
        const { typeAttribute0: error } = cell;
        const rowHasError = !!(error && error.title && error.messages);
        cell.computedRowNumberStyle = rowHasError
            ? ''
            : `padding-left: ${TOOLTIP_ALLOWANCE}px;`;
        cell.rowHasError = rowHasError;
    }
}

/**
 * Use to calculate the class and style for an inlined cell
 *
 * @param {Object} cell - The datatable cell
 * @param {String} cellClass - Class string calculated for cell so far
 */
export function updateInlineClassAndStyle(cell, cellClass) {
    let computedCellDivClass = '';
    let computedCellDivStyle = '';
    const { alignment, columnType, hasTreeData, wrapText } = cell;
    if (wrapText) {
        cellClass += (cellClass.length ? ' ' : '') + CELL_WRAP;
        computedCellDivClass += HYPHENATE_CLASS;
        const { wrapTextMaxLines } = cell;
        computedCellDivClass += ` ${LINE_CLAMP_CLASS}`;
        computedCellDivStyle = `--lwc-lineClamp: ${
            wrapTextMaxLines || 'none'
        };`;
    } else {
        computedCellDivClass += TRUNCATE_CLASS;
    }
    if (
        cell.isRTL &&
        // is LTR type
        (columnType === 'url' ||
            columnType === 'email' ||
            columnType === 'phone')
    ) {
        computedCellDivClass += ` ${LTR_CONTENT_IN_RTL_CLASS}`;
    }

    let computedMarginClassWhenLeftIconExists = '';
    if (cell.iconName) {
        const { iconPosition } = cell;
        if (!iconPosition || iconPosition === 'left') {
            computedMarginClassWhenLeftIconExists = CELL_MARGIN_LEFT_CLASS;
        }
    }

    let computedWrapperClass = GRID_CLASS;
    if (
        alignment === 'right' ||
        // Numbers are aligned right.
        columnType === 'currency' ||
        columnType === 'number' ||
        columnType === 'percent'
    ) {
        computedWrapperClass += ` ${GRID_ALIGN_END_CLASS}`;
    } else if (
        !alignment ||
        alignment === 'left' ||
        (alignment !== 'center' && alignment !== 'right')
    ) {
        computedWrapperClass += ` ${GRID_ALIGN_SPREAD_CLASS}`;
    }
    if (hasTreeData) {
        computedWrapperClass += ` ${NO_SPACE_CLASS}`;
    }

    cell.class = cellClass;
    cell.computedCellDivClass = computedCellDivClass;
    cell.computedCellDivStyle = computedCellDivStyle;
    cell.computedMarginClassWhenLeftIconExists =
        computedMarginClassWhenLeftIconExists;
    cell.computedWrapperClass = computedWrapperClass;
}

/**
 * Updates the value-related attributes for an inlined datatable cell
 *
 * @param {Object} cell - The datatable cell
 * @param {String} value - Current cell value
 */
export function updateInlineCellValue(cell, value) {
    if (cell.isBoolean) {
        cell.isChecked = !!value;
        cell.booleanCellAssistiveText = value ? i18n.true : i18n.false;
    } else if (cell.isCurrency) {
        cell.currencyValue = toFormattedNumber(
            {
                value,
                formatStyle: 'currency',
                currencyCode: cell.typeAttribute0,
                currencyDisplayAs: cell.typeAttribute1,
                minimumIntegerDigits: cell.typeAttribute2,
                minimumFractionDigits: cell.typeAttribute3,
                maximumFractionDigits: cell.typeAttribute4,
                minimumSignificantDigits: cell.typeAttribute5,
                maximumSignificantDigits: cell.typeAttribute6,
            },
            numberFormat
        );
    } else if (cell.isDateLocal) {
        cell.dateLocalValue = toFormattedDate(
            {
                value,
                day: cell.typeAttribute0 || 'numeric',
                month: cell.typeAttribute1 || 'short',
                year: cell.typeAttribute2 || 'numeric',
                timeZone: 'UTC',
            },
            dateTimeFormat
        );
    } else if (cell.isDateTime) {
        cell.dateTimeValue = toFormattedDate(
            {
                // Supported values can be passed directly to lightning-formatted-date-time but
                // non-supported formats need to be passed through Date constructor to avoid
                // customer breakages for the time being. Ideally the use of toDate here will be
                // temporary and we can remove use of the Date constructor in the future
                value: toDate(value),
                day: cell.typeAttribute0,
                era: cell.typeAttribute1,
                hour: cell.typeAttribute2,
                hour12: cell.typeAttribute3,
                minute: cell.typeAttribute4,
                month: cell.typeAttribute5,
                second: cell.typeAttribute6,
                timeZone: cell.typeAttribute7,
                timeZoneName: cell.typeAttribute8,
                weekday: cell.typeAttribute9,
                year: cell.typeAttribute10,
            },
            dateTimeFormat
        );
    } else if (cell.isEmail) {
        let emailIconAssistiveText = '';
        const emailLabel = value ? value.trim() : '';
        const showEmailLink = !!emailLabel;
        if (showEmailLink) {
            emailIconAssistiveText = i18n.emailLabel;
        }
        cell.emailIconAssistiveText = emailIconAssistiveText;
        cell.emailLabel = emailLabel;
        cell.showEmailLink = showEmailLink;
    } else if (cell.isLocation) {
        cell.locationValue = toFormattedLocation(value);
    } else if (cell.isNumber) {
        cell.numberValue = toFormattedNumber(
            {
                value,
                minimumIntegerDigits: cell.typeAttribute0,
                minimumFractionDigits: cell.typeAttribute1,
                maximumFractionDigits: cell.typeAttribute2,
                minimumSignificantDigits: cell.typeAttribute3,
                maximumSignificantDigits: cell.typeAttribute4,
            },
            numberFormat
        );
    } else if (cell.isPercent) {
        cell.percentValue = toFormattedNumber(
            {
                value,
                formatStyle: 'percent',
                minimumIntegerDigits: cell.typeAttribute0,
                minimumFractionDigits: cell.typeAttribute1,
                maximumFractionDigits: cell.typeAttribute2,
                minimumSignificantDigits: cell.typeAttribute3,
                maximumSignificantDigits: cell.typeAttribute4,
            },
            numberFormat
        );
    } else if (cell.isPhone) {
        let phoneLabel = '';
        let phoneLink = '';
        const showPhoneLink = isValidPhone(value);
        if (showPhoneLink) {
            phoneLabel = toNorthAmericanPhoneNumber(value);
            phoneLink = `tel:${value}`;
        }
        cell.phoneLabel = phoneLabel;
        cell.phoneLink = phoneLink;
        cell.showPhoneLink = showPhoneLink;
    } else if (cell.isText) {
        const { typeAttribute0: linkify } = cell;
        const shouldFormatText = linkify
            ? typeof value === 'string' && value !== ''
            : false;
        cell.ignoreRTL = cell.isRTL && isTextIgnoreRTL(value);
        cell.shouldFormatText = shouldFormatText;
        cell.textParts = shouldFormatText
            ? parseToFormattedLinkifiedParts(value, true)
            : [];
        // W-7860598 some team rely on text column support for primitive type.
        // W-7752316 customer use compound field for text column, to avoid [object Object]
        // Check if value is object or null and return '';
        cell.textValue = typeof value === 'object' ? '' : value;
    } else if (cell.isURL) {
        let _handleUrlAnchorClick;
        let handleUrlAnchorClick;
        let urlLabel = '';
        let urlLink = '';
        let urlTarget = '';
        let urlTooltip = '';
        const showUrlLink =
            value !== null && value !== undefined && value !== '';
        if (showUrlLink) {
            let { typeAttribute0, typeAttribute2 } = cell;
            _handleUrlAnchorClick = noopHandler;
            handleUrlAnchorClick = (event) => {
                cell._handleUrlAnchorClick(event);
            };
            urlLink = makeAbsoluteUrl(value);
            urlLabel =
                typeAttribute0 !== null &&
                typeAttribute0 !== undefined &&
                typeAttribute0 !== ''
                    ? typeAttribute0
                    : urlLink;
            urlTarget = cell.typeAttribute1 || '_self';
            urlTooltip = typeAttribute2 === '' ? '' : typeAttribute2 || value;
        }
        cell._handleUrlAnchorClick = _handleUrlAnchorClick;
        cell.handleUrlAnchorClick = handleUrlAnchorClick;
        cell.showUrlLink = showUrlLink;
        cell.urlLabel = urlLabel;
        cell.urlLink = urlLink;
        cell.urlTarget = urlTarget;
        cell.urlTooltip = urlTooltip;
    }
}
