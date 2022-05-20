const AWS = require("aws-sdk");
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
    const sqs = new AWS.SQS({apiVersion: "2012-11-05"});
    let sqsUrl = process.env.sqs_url;

    let body = JSON.parse(event.body);

    let version;
    if (event.pathParameters) version = event.pathParameters.version;

    let id;
    if (event.pathParameters) id = event.pathParameters.id;

    let request
    if (version === "v2") {
        if (id) {
          try {
            await verifier.verify(event.headers["authorization"]);
          } catch (error) {
            return {
              statusCode: 401,
              body: "Not Authorized",
            };
          }
        }

        request = {
            version: "v2",
            location: body.location,
            supplies: body.supplies,
            comments: body.comments,
            name: body.name,
            phoneNumber: body.phoneNumber,
            status: body.status,
            requestId: id,
        };
    } else if (version === "v1") {
        request = {
            location: body.location,
            supplies: body.supplies,
            people: body.people,
        };
    } else {
        return response(404);
    }

    console.log("Send: ", request);

    let payload = {
        MessageBody: JSON.stringify(request),
        QueueUrl: sqsUrl,
    };

    await sqs.sendMessage(payload).promise();

    return response(201);
};
