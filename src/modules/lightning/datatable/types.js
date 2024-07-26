import { assert } from 'lightning/utilsPrivate';

const STANDARD_TYPE_NAME_ENTRIES = [
    ['text', ['linkify']],
    ['boolean', []],
    [
        'number',
        [
            'minimumIntegerDigits',
            'minimumFractionDigits',
            'maximumFractionDigits',
            'minimumSignificantDigits',
            'maximumSignificantDigits',
        ],
    ],
    [
        'currency',
        [
            'currencyCode',
            'currencyDisplayAs',
            'minimumIntegerDigits',
            'minimumFractionDigits',
            'maximumFractionDigits',
            'minimumSignificantDigits',
            'maximumSignificantDigits',
        ],
    ],
    [
        'percent',
        [
            'minimumIntegerDigits',
            'minimumFractionDigits',
            'maximumFractionDigits',
            'minimumSignificantDigits',
            'maximumSignificantDigits',
        ],
    ],
    ['email', []],
    [
        'date',
        [
            'day',
            'era',
            'hour',
            'hour12',
            'minute',
            'month',
            'second',
            'timeZone',
            'timeZoneName',
            'weekday',
            'year',
        ],
    ],
    ['date-local', ['day', 'month', 'year']],
    ['phone', []],
    ['url', ['label', 'target', 'tooltip']],
    ['location', []],
    ['reference', ['displayValue']],
    ['rowNumber', ['error']],
    ['action', ['menuAlignment', 'rowActions']],
    [
        'button',
        [
            'variant',
            'label',
            'iconName',
            'iconPosition',
            'disabled',
            'name',
            'class',
            'title',
        ],
    ],
    [
        'button-icon',
        [
            'variant',
            'alternativeText',
            'iconName',
            'iconClass',
            'disabled',
            'name',
            'class',
            'title',
        ],
    ],
    [
        'tree',
        [
            'hasChildren',
            'isExpanded',
            'level',
            'setSize',
            'posInSet',
            'subType',
        ],
    ],
];

const STANDARD_TYPE_VALUE_ENTRIES = Array(STANDARD_TYPE_NAME_ENTRIES.length);
for (let i = 0, { length } = STANDARD_TYPE_NAME_ENTRIES; i < length; i += 1) {
    const { 0: typeName, 1: typeAttributes } = STANDARD_TYPE_NAME_ENTRIES[i];
    STANDARD_TYPE_VALUE_ENTRIES[i] = [
        typeName,
        {
            typeAttributes,
            type: 'standard',
        },
    ];
}

const STANDARD_TYPE_NAMES = new Map(STANDARD_TYPE_NAME_ENTRIES);

const STANDARD_TYPE_VALUES = new Map(STANDARD_TYPE_VALUE_ENTRIES);

const TREE_SUPPORTED_TYPES = new Set([
    'text',
    'url',
    'date',
    'number',
    'currency',
    'percent',
    'button',
    'button-icon',
    'reference',
]);

const EDITABLE_STANDARD_TYPES = new Set([
    'text',
    'percent',
    'phone',
    'email',
    'url',
    'currency',
    'number',
    'boolean',
    'date-local',
    'date',
]);

/**
 * Determines if a supplied type is a valid datatable type.
 *
 * @param {String} typeName The type to validate
 * @returns {Boolean} Whether the supplied type is valid
 */
export function isValidType(typeName) {
    return STANDARD_TYPE_NAMES.has(typeName);
}

/**
 * Retrieves the attributes for a given type. Additionally, verifies
 * the supplied type is valid.
 *
 * @param {String} typeName The type to get the attributes for
 * @returns {Array} An array of attributes for the supplied type
 */
export function getAttributesNames(typeName) {
    assert(
        isValidType(typeName),
        `You are trying to access an invalid type (${typeName})`
    );
    return STANDARD_TYPE_NAMES.get(typeName) || [];
}

/**
 * A class for handling valid datatable types.
 */
export default class DatatableTypes {
    privateCustomTypes = new Map();

    constructor(types) {
        if (typeof types === 'object' && types !== null) {
            const { privateCustomTypes } = this;
            const keys = Object.keys(types);
            for (let i = 0, { length } = keys; i < length; i += 1) {
                const key = keys[i];
                const {
                    template,
                    editTemplate,
                    typeAttributes = [],
                    standardCellLayout = false,
                } = types[key];
                privateCustomTypes.set(key, {
                    template,
                    editTemplate,
                    typeAttributes,
                    standardCellLayout: standardCellLayout === true,
                    type: 'custom',
                });
            }
        }
    }

    /**
     * Retrieves a type. If the specified type is not a custom type,
     * lookup the type in our standard types. Otherwise, return undefined.
     *
     * @param {String} typeName The type to retrieve
     * @returns {Object | Undefined} The type metadata
     */
    getType(typeName) {
        return (
            this.privateCustomTypes.get(typeName) ||
            STANDARD_TYPE_VALUES.get(typeName)
        );
    }

    /**
     * Retrieves a custom type's edit template if it exists.
     *
     * @param {String} typeName The custom type to retrieve
     * @returns {Object | Undefined} The custom type's edit template
     */
    getCustomTypeEditTemplate(typeName) {
        const privateType = this.privateCustomTypes.get(typeName);
        return privateType ? privateType.editTemplate : undefined;
    }

    /**
     * Determines if a type is a valid custom or standard type.
     *
     * @param {String} typeName The type to validate
     * @returns {Boolean} Whether the type is valid
     */
    isValidType(typeName) {
        return (
            this.privateCustomTypes.has(typeName) ||
            STANDARD_TYPE_NAMES.has(typeName)
        );
    }

    /**
     * Determines if a given type is editable.
     *
     * @param {String} typeName The type to test
     * @returns {Boolean} Whether the type is editable
     */
    isEditableType(typeName) {
        if (EDITABLE_STANDARD_TYPES.has(typeName)) {
            return true;
        }
        const privateType = this.privateCustomTypes.get(typeName);
        return privateType ? privateType.standardCellLayout : false;
    }

    /**
     * Determines if a given type is a non-standard type.
     *
     * @param {String} typeName The type to test
     * @returns {Boolean} Whether the type is a non-standard type
     */
    isCustomType(typeName) {
        return this.privateCustomTypes.has(typeName);
    }

    /**
     * Determines whether or not a given custom type is using a standard cell layout.
     *
     * @param {String} typeName The custom type to test
     * @returns {Boolean} Whether the custom type is using a standard cell layout
     */
    isStandardCellLayoutForCustomType(typeName) {
        const privateType = this.privateCustomTypes.get(typeName);
        return privateType ? privateType.standardCellLayout : false;
    }

    /**
     * Determines if a supplied type is valid for a tree type datatable.
     *
     * @param {String} typeName The type to validate
     * @returns {Boolean} Whether the supplied type is valid for a tree
     */
    isValidTypeForTree(typeName) {
        return TREE_SUPPORTED_TYPES.has(typeName);
    }
}
