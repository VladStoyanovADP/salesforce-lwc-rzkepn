// eslint-disable-next-line @lwc/lwc/no-async-await
export default async function generateData({ amountOfRecords }) {
    // Adding fake delay
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    await new Promise((resolve) => setTimeout(resolve, 2000));

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
