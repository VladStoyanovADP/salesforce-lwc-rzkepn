/**
 * These are all values that can be set to "aria-level" attribute of h2 tag for the card's title.
 */
export const VALID_HEADING_LEVELS = ['1', '2', '3', '4', '5', '6'];

export function isHeadingLevelValid(level) {
    return (
        (typeof level === 'string' || typeof level === 'number') &&
        VALID_HEADING_LEVELS.includes(level.toString())
    );
}
