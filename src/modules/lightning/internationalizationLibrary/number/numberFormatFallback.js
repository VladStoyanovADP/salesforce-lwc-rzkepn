// TODO: remove file when migrating off aura
import { getSkeleton } from './numberOptions';
import { getNumberFormat } from '../localizationService';

export function numberFormatFallback(options) {
    const skeleton = getSkeleton(options);
    return {
        format: (value) => {
            return getNumberFormat(skeleton).format(value);
        },
    };
}
