export default function generateData({ amountOfRecords }) {
    return [...Array(amountOfRecords)].map((_, index) => {
        return {
            name: `Name (${index})`,
            website: 'www.salesforce.com',
            amount: Math.floor(Math.random() * 100),
            phone: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            closeAt: new Date(
                Date.now() + 86400000 * Math.ceil(Math.random() * 20)
            ),
        };
    });
}
