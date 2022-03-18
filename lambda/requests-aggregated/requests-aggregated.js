const AWS = require("aws-sdk");
const { CognitoJwtVerifier } = require("aws-jwt-verify");

// Verifier that expects valid access tokens:
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.poolId,
  tokenUse: "access",
  clientId: process.env.clientId,
});

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

  const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
  const bucket = process.env.bucket;

  var params = {
    Bucket: bucket,
    Prefix: "requests-aggregated/part-",
  };

  const s3Objects = await s3.listObjectsV2(params).promise();
  const s3ObjectKey = s3Objects.Contents[0].Key;

  params = {
    Bucket: bucket,
    Key: s3ObjectKey,
  };

  const s3Object = await s3.getObject(params).promise();
  const data = s3Object.Body.toString("utf-8")
    .split(/\r?\n/)
    .filter((e) => e != "")
    .map((e) => JSON.parse(e));

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ data: data }),
  };
};
