import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class ModalAllMulti extends LightningModal {
    @api heading = 'Second Modal, higher z-index, small size';
    @api options = [];
    _sizes = ['small', 'medium', 'large', 'full'];

    handleOptionClick(e) {
        const { target } = e;
        // optionally when applicable, stack a third modal
        if (target.dataset?.label?.includes('Open Next Modal')) {
            this.stackMoreModalsOnSecondModal(e.target);
        } else {
            this.close(parseInt(target.dataset.id, 10));
        }
    }

    // Helper function to stack more modals with random sizes on top of each other.
    stackMoreModalsOnSecondModal(target) {
        // eslint-disable-next-line radix
        const inputId = parseInt(target.dataset.id);
        const currentModalId = inputId === 1 ? 2 + 1 : inputId + 1;
        const randomSize =
            this._sizes[Math.floor(Math.random() * this._sizes.length)];
        ModalAllMulti.open({
            size: randomSize,
            heading: currentModalId + ' Modal w/ higher z-index',
            description:
                'A description of the ' + currentModalId.toString() + ' modal',
            // ModalDemo
            options: [
                {
                    id: `${currentModalId}`,
                    variant: 'neutral',
                    label: 'Open Next Modal',
                    focusName: `focus-footer-button-0${currentModalId}`,
                },
                {
                    id: `${currentModalId + 1}`,
                    variant: 'neutral',
                    label: 'Close This Modal',
                    focusName: `focus-footer-button-0${currentModalId + 1}`,
                },
            ],
        }).then((result) => {
            if (result === null) {
                this.demoResult = { action: 'dismissed' };
            } else {
                this.demoResult = result;
            }
        });
    }
}
