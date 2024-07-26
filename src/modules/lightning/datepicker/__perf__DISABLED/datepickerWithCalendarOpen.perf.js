import { createElement } from 'lwc';
import Element from 'lightning/datepicker';

describe('datepicker-with-calendar-open', () => {
    let element;
    const createDatepicker = () => {
        const datePicker = createElement(
            'lightning-datepicker-with-calendar-open',
            { is: Element }
        );
        element.label = 'Datepicker';
        element.min = '2019-01-10';
        element.max = '2022-02-10';
        element.value = '2019-01-20';
        return datePicker;
    };

    benchmark('create and append', () => {
        run(() => {
            element = createDatepicker();
            document.body.appendChild(element);
        });
    });

    // disabled due to shadowRoot
    // benchmark('open calendar', () => {
    //     run(() => {
    //         element.shadowRoot.querySelector('input').click();
    //     });
    // });

    // benchmark('go to previous month', () => {
    //     run(() => {
    //         element.shadowRoot
    //             .querySelector('lightning-calendar')
    //             .shadowRoot.querySelector('lightning-button-icon')
    //             .click();
    //     });
    // });

    // benchmark('select today', () => {
    //     run(() => {
    //         element.shadowRoot
    //             .querySelector('lightning-calendar')
    //             .shadowRoot.querySelector('button[name=today]')
    //             .click();
    //     });
    // });

    benchmark('remove', () => {
        run(() => {
            document.body.removeChild(element);
        });
    });
});
