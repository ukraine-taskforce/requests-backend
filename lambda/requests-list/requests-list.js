let AWS = require('aws-sdk'),
    dynamoDbDocumentClient = new AWS.DynamoDB.DocumentClient();


function response(statusCode) {
    return {
        statusCode: statusCode,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({}),
    };
}

module.exports.handler = async (event) => {
    console.log("Request: ", event);

    let version;
    if (event.pathParameters) version = event.pathParameters.version;

    if (version != "v1" && version != "v2") {
        return response(404);
    }

    let tableName = version == "v1" ? process.env.table_name : process.env.table_name_v2;

    let data = await dynamoDbDocumentClient.scan({
        TableName: tableName,
    }).promise();

    console.log("Got items: ", data.Items);

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            items: data.Items
        }),
    };
};
