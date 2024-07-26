export default function generateData({ amountOfRecords }) {
    return [...Array(amountOfRecords)].map((_, index) => {
        return {
            name: `Name (${index})`,
            boolean: Math.random() < 0.5,
            website: 'www.salesforce.com',
            phone: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            currency: Math.floor(Math.random() * 100),
            date: new Date(
                Date.now() + 86400000 * Math.ceil(Math.random() * 20)
            ),
            dateLocal: new Date(Date.now()),
            email: 'test@salesforce.com',
            location: {
                latitude: (Math.random() * 90).toFixed(2),
                longitude: (Math.random() * 180).toFixed(2),
            },
            number: Math.floor(Math.random() * 100),
            percent: Math.random(),
            iconName: 'action:approval',
        };
    });
}
