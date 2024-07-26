const FORM_FACTOR_PHONE = 'Small';

export function shouldDispatchToApp(target, formFactor) {
    const isMobile = formFactor === FORM_FACTOR_PHONE;

    // No target is treated like it were '_self'
    return (
        !target ||
        target === '_self' ||
        // On mobile (hybrid), most resources should be kept inside the app, so we treat _blank as _self in a mobile hybrid app
        (isMobile && target === '_blank') ||
        // When _top should be identical to _self.
        // This fixes a number of issues such as unnecessary page reloading in an SPA
        //      and communities URLs not getting handled in the community because
        //      the input URL doesn't have the communities prefix added on
        //      until _self is handled at runtime
        (target === '_top' && window.top === window) ||
        (target === '_parent' && window.parent === window)
    );
}
