export default function generateData({ amountOfRecords }) {
    return [...Array(amountOfRecords)].map((_, index) => {
        return {
            name: `Name (${index})`,
            website: 'www.salesforce.com',
            amount: Math.floor(Math.random() * 100),
            phone: `${
                Math.floor(Math.random() * 900 + 100) * 10000000 + 5551212
            }`,
            closeAt: new Date(
                Date.now() + 86400000 * Math.ceil(Math.random() * 20)
            ),
        };
    });
}
