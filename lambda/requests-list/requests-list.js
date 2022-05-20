let AWS = require('aws-sdk'),
    dynamoDbDocumentClient = new AWS.DynamoDB.DocumentClient();
const { CognitoJwtVerifier } = require("aws-jwt-verify");

// Verifier that expects valid access token:
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.poolId,
  tokenUse: "access",
  clientId: process.env.clientId,
}); 

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

    try {
      await verifier.verify(event.headers["authorization"]);
    } catch (error) {
      return {
        statusCode: 401,
        body: "Not Authorized",
      };
    }

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
