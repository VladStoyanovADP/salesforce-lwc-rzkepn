import { addressFormat } from 'lightning/internationalizationLibrary';

const FORMAT_CODE_MAP = {
    A: 'street',
    C: 'city',
    S: 'province',
    Z: 'postalCode',
    K: 'country',
};

export const parseLocaleFormat = function (format) {
    if (isValidFieldFormat(format)) {
        return format
            .toUpperCase()
            .split(/(?=[A-Z])/)
            .map((formatCode) => FORMAT_CODE_MAP[formatCode]);
    }
    return [];
};

export function getInputOrder(config) {
    const {
        countryCode,
        hasCountryPicklist,
        langCode,
        showAddressLookup,
        showCompactAddress,
    } = config;

    let inputOrder = addressFormat.getAddressInputOrderAllField(
        langCode,
        countryCode
    );
    // always show country picklist as the first field
    // to match aloha behavior
    if (hasCountryPicklist) {
        inputOrder = 'K' + inputOrder.replace('K', '');
    }

    const parsed = parseLocaleFormat(inputOrder);

    // TD-0120510 Render single textarea as two separate inputs
    if (showCompactAddress) {
        const index = parsed.indexOf('street');
        if (index !== -1) {
            if (showAddressLookup) {
                parsed.splice(index, 1, 'addressLine1Lookup', 'addressLine2');
            } else {
                parsed.splice(index, 1, 'addressLine1', 'addressLine2');
            }
        }
    }

    return parsed;
}

export function getRequiredFields(config) {
    const { countryCode, langCode, showAddressLookup, showCompactAddress } =
        config;

    const requireFields = addressFormat.getAddressRequireFields(
        langCode,
        countryCode
    );

    const parsed = parseLocaleFormat(requireFields);

    // TD-0120510 Subpremise is never required
    if (showCompactAddress) {
        const index = parsed.indexOf('street');
        if (index !== -1) {
            if (showAddressLookup) {
                parsed.splice(index, 1, 'addressLine1Lookup');
            } else {
                parsed.splice(index, 1, 'addressLine1');
            }
        }
    }

    return parsed;
}

function isValidFieldFormat(value) {
    return typeof value === 'string' && /^[ACSZK]+$/i.test(value);
}
