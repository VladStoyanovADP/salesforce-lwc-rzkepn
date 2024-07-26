import appVersion from '@salesforce/internal/core.appVersion';
import securePort from '@salesforce/internal/core.securePort';
import untrustedContentDomain from '@salesforce/internal/core.untrustedContentDomain';

// This fallback is only needed for off core aura applications and aura tests.
// Please also update the default value in the scoped-module-resolver If the value here needs to be updated
const FALLBACK_DOMAIN = '.a.forceusercontent.com';
const FALLBACK_VERSION = '224'; // version is matching latest change from server implementation. Since last change is made in 224, fallback to 224.
// TODO we can probably remove securePort from the url
const port = securePort ? `:${securePort}` : '';

export const MAP_DOMAIN = `https://maps${
    untrustedContentDomain || FALLBACK_DOMAIN
}${port}`;

export function buildMapSourceUrl(parameters) {
    const version = appVersion || FALLBACK_VERSION;
    let sourceUrl = `${MAP_DOMAIN}/lightningmaps/mapsloader?version=${version}`;

    Object.keys(parameters).forEach((key) => {
        sourceUrl += `&${key}=${encodeURIComponent(parameters[key])}`;
    });
    return sourceUrl;
}
