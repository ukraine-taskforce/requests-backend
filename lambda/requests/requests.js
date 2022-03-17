const AWS = require("aws-sdk");

module.exports.handler = async (event) => {
  console.log("Request: ", event);
  const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });
  let sqsUrl = process.env.sqs_url;

  let body = JSON.parse(event.body);

  let request = {
    location: body.location,
    supplies: body.supplies,
    people: body.people,
  };

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
