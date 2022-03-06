var AWS = require('aws-sdk'),
    uuid = AWS.util.uuid,
    dynamoDbDocumentClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    console.log('Request: ', event);
    var params = {
        Item: {
            'id': uuid.v4(),
            'event': event.body
        },
        TableName: process.env.table_name
    };

    try {
        await dynamoDbDocumentClient.put(params).promise();
        return { message: 'Successfully created item!' }
    } catch (err) {
        console.log('Error: ', err);
        return { message: err }
    }
}