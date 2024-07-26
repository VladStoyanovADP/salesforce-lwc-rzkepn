import { LightningElement } from 'lwc';
import generateDataWithDelay from './generateDataWithDelay';

const columns = [
    { label: 'Label', fieldName: 'name' },
    { label: 'Website', fieldName: 'website', type: 'url' },
    { label: 'Phone', fieldName: 'phone', type: 'phone' },
    { label: 'Balance', fieldName: 'amount', type: 'currency' },
    { label: 'CloseAt', fieldName: 'closeAt', type: 'date' },
];

export default class DatatableWithInfiniteLoading extends LightningElement {
    data = [];
    columns = columns;
    loadMoreStatus;
    totalNumberOfRows = 250;
    loadMoreOffset = 20;

    // eslint-disable-next-line @lwc/lwc/no-async-await
    async connectedCallback() {
        const data = await generateDataWithDelay({ amountOfRecords: 100 });
        this.data = data;
    }

    // eslint-disable-next-line @lwc/lwc/no-async-await
    async handleLoadMore(event) {
        const datatable = event.target;
        //Displays a spinner to signal that data is being loaded
        datatable.isLoading = true;
        //Displays "Loading" text when more data is being loaded
        this.loadMoreStatus = 'Loading';

        const newData = await generateDataWithDelay({ amountOfRecords: 50 });
        if (this.data.length >= this.totalNumberOfRows) {
            datatable.enableInfiniteLoading = false;
            this.loadMoreStatus = 'No more data to load';
        } else {
            this.data = this.data.concat(newData);
            this.loadMoreStatus = '';
        }
        datatable.isLoading = false;
    }
}
