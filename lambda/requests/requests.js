module.exports.handler = async (event) => {
  console.log('Request: ', event);
  const AWS = require("aws-sdk");
  const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });
  let sqsUrl = process.env.sqs_url;

  let payload =
  {
      MessageBody: JSON.stringify(event.body),
      QueueUrl: sqsUrl
  };

  await sqs.sendMessage(payload).promise();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(event),
  }
}
