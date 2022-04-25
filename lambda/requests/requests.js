const AWS = require("aws-sdk");

module.exports.handler = async (event) => {
    console.log("Request: ", event);
    const sqs = new AWS.SQS({apiVersion: "2012-11-05"});
    let sqsUrl = process.env.sqs_url;

    let body = JSON.parse(event.body);

    let version;
    if (event.pathParameters) version = event.pathParameters.version;

    let request
    if (version === "v2") {
        request = {
            version: "v2",
            location: body.location,
            supplies: body.supplies,
            comments: body.comments,
            name: body.name,
            phoneNumber: body.phoneNumber,
        };
    } else if (version === "v1") {
        request = {
            location: body.location,
            supplies: body.supplies,
            people: body.people,
        };
    } else {
        return {
            statusCode: 404,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({}),
        };
    }

    console.log("Send: ", request);

    let payload = {
        MessageBody: JSON.stringify(request),
        QueueUrl: sqsUrl,
    };

    await sqs.sendMessage(payload).promise();

    return {
        statusCode: 201,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({}),
    };
};
