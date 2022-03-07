var AWS = require('aws-sdk'),
    uuid = AWS.util.uuid,
    dynamoDbDocumentClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    let body = JSON.parse(event.Records[0].body);

    let peopleCount = getPersonaCount(body, "adults") + getPersonaCount(body, "infants") + getPersonaCount(body, "children");

    console.log('Request: ', event);
    var params = {
        Item: {
            'id': uuid.v4(),
            'peopleCount': peopleCount,
            'timestamp': Date.now(),
            'body': body
        },
        TableName: process.env.table_name
    };

    try {
        await dynamoDbDocumentClient.put(params).promise();
        return { message: 'Successfully created item!' };
    } catch (err) {
        console.log('Error: ', err);
        return { message: err };
    }

    function getPersonaCount(body, persona) {
        try {
            return body.people[persona];
        } catch (err) {
            return 0;
        }
    }
}