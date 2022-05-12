var AWS = require('aws-sdk'),
    uuid = AWS.util.uuid,
    dynamoDbDocumentClient = new AWS.DynamoDB.DocumentClient();

async function storeToDynamoDB(params) {
    try {
        await dynamoDbDocumentClient.put(params).promise();
        return {message: 'Successfully created item!'};
    } catch (err) {
        console.log('Error: ', err);
        return {message: err};
    }
}

async function processV1Request(body) {
    let peopleCount = getPersonaCount(body, "adults") + getPersonaCount(body, "infants") + getPersonaCount(body, "children");

    const params = {
        Item: {
            'id': uuid.v4(),
            'peopleCount': peopleCount,
            'timestamp': Date.now(),
            'body': body
        },
        TableName: process.env.table_name
    };
    return await storeToDynamoDB(params);

    function getPersonaCount(body, persona) {
        try {
            return body.people[persona];
        } catch (err) {
            return 0;
        }
    }
}

async function processV2Request(body) {
    if (body.requestId) {
        let requestId = body.requestId;
        delete body.requestId;

        await dynamoDbDocumentClient
            .update({
                TableName: process.env.v2_table_name,
                Key: {
                    id: requestId,
                },
                UpdateExpression: `set body = :body`,
                ExpressionAttributeValues: {
                    ":body": body,
                },
            })
            .promise();
    } else {
        const params = {
            Item: {
                'id': uuid.v4(),
                'timestamp': Date.now(),
                'body': body
            },
            TableName: process.env.v2_table_name
        };
        return await storeToDynamoDB(params);
    }
}

module.exports.handler = async (event) => {
    console.log('Request: ', event);

    let body = JSON.parse(event.Records[0].body);

    if (body.version === "v2") {
        return await processV2Request(body);
    } else {
        return await processV1Request(body);
    }
}