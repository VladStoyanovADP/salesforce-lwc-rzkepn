/**
 * Optional static parent definition on extended LightningOverlay
 * Ex: static [parent] = CustomOverlayBase;
 */
export const parent = Symbol('parent');

/**
 * Optional static instanceName for CustomOverlayBase;
 * Ex: static [instanceName] = 'custom-overlay';
 * This makes it easier to debug in the dom.
 */
export const instanceName = Symbol('instanceName');

/**
 * Secure access to events
 */
export const secure = Symbol('secure event');

/**
 * optional static properties
 * Ex: static [properties] = <array of public attribute names>
 * This will be used to assign value to restricted set of attributes
 */
export const properties = Symbol('properties');

/**
 * optional static requiredProperties
 * Ex: static [properties] = <array of public required attribute names>
 * This will be used verifying if required attributes have value assigned.
 */
export const requiredProperties = Symbol('requiredProperties');

/**
 * Only allow CSS Variables
 * @param {string|Object} style Style string or object
 * @returns {string} sanitized style string
 */
export function normalizeStyle(style) {
    const props = {};
    if (typeof style === 'string') {
        const regex = /([\w-]*)\s*:\s*([^;]*)/g;
        let match;
        while ((match = regex.exec(style))) {
            if (match[1].startsWith('--')) {
                props[match[1]] = match[2].trim();
            } else {
                // eslint-disable-next-line no-console
                console.warn(
                    `Overlay 'style' only supports CSS Variables (invalid '${match[1]}' set)`
                );
            }
        }
    } else if (style && typeof style === 'object') {
        Object.keys(style).forEach((property) => {
            if (
                property.startsWith('--') &&
                typeof style[property] === 'string'
            ) {
                props[property] = style[property];
            } else {
                // eslint-disable-next-line no-console
                console.warn(
                    `Overlay 'style' only supports CSS Variables (invalid '${property}' set)`
                );
            }
        });
    }
    return Object.keys(props)
        .map((property) => {
            return `${property}:${props[property]}`;
        })
        .join(';');
}

/**
 * Normalize the overlay apis.
 * @param {Object} apis Apis passed to overlay
 * @returns {Object} Normalized object of apis
 */
export function normalizeApis(apis) {
    if (apis && typeof apis === 'object') {
        const normalizedApis = { ...apis };
        // Normalize Style
        if (apis.style) {
            normalizedApis.style = normalizeStyle(apis.style);
        }
        return normalizedApis;
    }
    return {};
}
