export default function generateData({ amountOfRecords }) {
    return [...Array(amountOfRecords)].map((_, index) => {
        return {
            id: index + 1,
            name: `Name (${index})`,
            description:
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
            website: 'www.salesforce.com',
            amount: Math.floor(Math.random() * 100),
            phone: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            closeAt: new Date(
                Date.now() + 86400000 * Math.ceil(Math.random() * 20)
            ),
        };
    });
}
