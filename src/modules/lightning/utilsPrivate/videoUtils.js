const ALLOWED_DOMAINS = new Set([
    'www.youtube.com',
    'www.youtube-nocookie.com',
    'www.youtube.ca',
    'www.youtube.jp',
    'www.youtube.com.br',
    'www.youtube.co.uk',
    'www.youtube.nl',
    'www.youtube.pl',
    'www.youtube.es',
    'www.youtube.ie',
    'www.youtube.fr',
    'player.vimeo.com',
    'play.vidyard.com',
    'players.brightcove.net',
    'bcove.video',
    'player.cloudinary.com',
    'fast.wistia.net',
    'i1.adis.ws',
    's1.adis.ws',
    'scormanywhere.secure.force.com',
    'appiniummastertrial.secure.force.com',
    'embed.app.guidde.com',
]);
// In addition to:
//   vimeo.com/showcase/*/embed
//   *.my.site.com
//   *.lightning.force.com
//   *.my.salesforce-sites.com

export function hasOnlyAllowedVideoIframes(htmlString) {
    if (htmlString && htmlString.indexOf('<iframe') > -1) {
        const parsedHtml = new DOMParser().parseFromString(
            htmlString,
            'text/html'
        );
        const iframesList = Array.prototype.slice.call(
            parsedHtml.querySelectorAll('iframe')
        );

        return (
            iframesList.length > 0 &&
            !iframesList.some((iframe) => !isUrlAllowed(iframe.src))
        );
    }
    return false;
}

function isUrlAllowed(url) {
    const anchor = document.createElement('a');
    anchor.href = url;

    if (anchor.protocol !== 'https:') {
        return false;
    }

    if (anchor.hostname === 'vimeo.com') {
        const path = anchor.pathname;
        const regex = /^\/showcase\/\d+\/embed$/;
        return path.match(regex) !== null;
    }

    if (anchor.hostname === 'www.my.salesforce-sites.com') {
        return false;
    }
    if (anchor.hostname.match(/^[\w-]+\.my\.salesforce-sites\.com$/)) {
        return true;
    }
    if (anchor.hostname.match(/^[\w-]+\.sandbox\.my\.salesforce-sites\.com$/)) {
        return true;
    }

    if (anchor.hostname === 'www.lightning.force.com') {
        return false;
    }
    if (anchor.hostname.match(/^[\w-]+\.lightning\.force\.com$/)) {
        return true;
    }
    if (anchor.hostname.match(/^[\w-]+\.sandbox\.lightning\.force\.com$/)) {
        return true;
    }

    if (anchor.hostname === 'www.my.site.com') {
        return false;
    }
    if (anchor.hostname.match(/^[\w-]+\.my\.site\.com$/)) {
        return true;
    }
    if (anchor.hostname.match(/^[\w-]+\.sandbox\.my\.site\.com$/)) {
        return true;
    }

    return ALLOWED_DOMAINS.has(anchor.hostname);
}
