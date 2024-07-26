import { getPathPrefix } from 'lightning/configProvider'; // Provides the path prefix to Core resources

export function resolveFileTypeToURL(recordId) {
    const keyPrefixLength = 3;
    const keyPrefix = recordId.substring(0, keyPrefixLength);

    /*  Returns url according to file key prefix */
    const fileAttributes = {
        // Content Document
        '069':
            '/sfc/servlet.shepherd/document/download/' +
            recordId +
            '?operationContext=S1',

        // Content Version
        '068':
            '/sfc/servlet.shepherd/version/download/' +
            recordId +
            '?operationContext=S1',

        // Attachment
        '00P':
            '/servlet/servlet.FileDownload?file=' +
            recordId +
            '&operationContext=S1',

        // Document
        '015':
            '/servlet/servlet.FileDownload?file=' +
            recordId +
            '&operationContext=S1',
    };

    return (
        keyPrefix &&
        fileAttributes[keyPrefix] &&
        getUrlWithSitePrefix(fileAttributes[keyPrefix])
    );
}

/*  In order to do any URL redirects, we need the site URL with the site path prefix.
    getUrlWithSitePrefix returns the URL path prefix of the current site. 
    For example, if your site URL is MyDomainName.my.salesforce-sites.com/partners, 
    /partners is the path prefix. Returns null if the prefix isn’t defined. 
    If the current request is not a site request, then this field returns an empty string. 
   */
export function getUrlWithSitePrefix(url) {
    let siteUrlPrefix = getPathPrefix();

    // remove /s in siteUrlPrefix
    siteUrlPrefix =
        siteUrlPrefix && siteUrlPrefix.endsWith('/s')
            ? siteUrlPrefix.slice(0, siteUrlPrefix.length - 2)
            : siteUrlPrefix;

    // return url directly if path prefix is already added to site URL
    // Edge Case: `sf` would accidentally match `sfc` without the `/`
    return url.startsWith(`${siteUrlPrefix}/`) ? url : siteUrlPrefix + url;
}
