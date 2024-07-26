import { resolveFileTypeToURL } from './resourceResolver';

export function generateUrl(recordId) {
    const url = resolveFileTypeToURL(recordId);
    return isValidUrl(url) ? url : undefined;
}

function isValidUrl(url) {
    return (
        url &&
        (url.indexOf('http://') === 0 ||
            url.indexOf('https://') === 0 ||
            url.indexOf('/') === 0)
    );
}
