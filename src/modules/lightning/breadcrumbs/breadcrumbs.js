import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';

/**
 * A hierarchy path of the page you're currently visiting within the website or app.
 * @slot default Placeholder for lightning-breadcrumb
 */
export default class LightningBreadcrumbs extends LightningShadowBaseClass {
    connectedCallback() {
        super.connectedCallback();
        this.setAttribute('aria-label', 'Breadcrumbs');
        this.setAttribute('role', 'navigation');
    }

    handleSlotChange() {
        const breadcrumbs = this.template.querySelector('slot').assignedNodes();
        const len = breadcrumbs.length;

        for (let i = 0; i < len; i++) {
            const breadcrumb = breadcrumbs[i];

            if (i === len - 1) {
                breadcrumb.ariaCurrent = 'page';
            } else {
                breadcrumb.ariaCurrent = null;
            }
        }
    }
}
