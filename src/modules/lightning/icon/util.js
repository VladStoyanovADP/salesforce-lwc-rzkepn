import { getCategory } from 'lightning/iconUtils';
import { normalizeString } from 'lightning/utilsPrivate';

export function normalizeVariant(variant, iconName) {
    // Unfortunately, the `bare` variant was implemented to do what the
    // `inverse` variant should have done. Keep this logic for as long as
    // we support the `bare` variant.
    if (variant === 'bare') {
        // TODO: Deprecation warning using strippable assertion
        variant = 'inverse';
    }

    if (getCategory(iconName) === 'utility') {
        return normalizeString(variant, {
            fallbackValue: '',
            validValues: ['error', 'inverse', 'warning', 'success'],
        });
    }
    return 'inverse';
}
