export function isEmptyString(s) {
    return (
        s === undefined ||
        s === null ||
        (typeof s === 'string' && s.trim() === '')
    );
}

export function isEmptyObject(obj) {
    if (obj === undefined || obj === null || typeof obj !== 'object') {
        return false;
    }
    // eslint-disable-next-line guard-for-in
    for (const name in obj) {
        return false;
    }
    return true;
}
