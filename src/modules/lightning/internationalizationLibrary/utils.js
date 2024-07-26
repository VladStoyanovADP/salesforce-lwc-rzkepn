import { isCSR } from 'lightning/utilsPrivate';

/**
 * Used to determine if aura localization service is available
 * This should be true on-core and false off-core, and will
 * no longer be needed when we fully migrate off aura's service
 */
export const isAuraL10NAvailable =
    isCSR && window.$A && window.$A.localizationService;

/**
 * Returns string to use when throwing an error message
 * if an invalid value is provided when parsing a datetime
 */
export const getDateTimeErrorMessage = (value) =>
    `datetime component: The value attribute accepts a valid ISO8601 formatted string ` +
    `with timezone offset. but we are getting the ${typeof value} value "${value}" instead.`;
