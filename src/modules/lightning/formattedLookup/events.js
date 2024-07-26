/**
 * @event LightningFormattedLookup#onprivatelookupitempicked
 * @type {object}
 * @property {string} recordId
 */
export class PrivateLookupItemPickedEvent extends CustomEvent {
    static NAME = 'privatelookupitempicked';

    constructor(detail) {
        super(PrivateLookupItemPickedEvent.NAME, {
            composed: true,
            cancelable: true,
            bubbles: true,
            detail: Object.assign({}, detail),
        });
    }
}
