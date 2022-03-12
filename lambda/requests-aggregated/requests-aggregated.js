module.exports.handler = async (event) => {
  const AWS = require('aws-sdk')
  const s3 = new AWS.S3({apiVersion: '2006-03-01'});
  const bucket = process.env.bucket;

  var params = {
    Bucket: bucket,
    Prefix: 'requests-aggregated/part-'
  };

  const s3Objects = await s3.listObjectsV2(params).promise();
  const s3ObjectKey = s3Objects.Contents[0].Key;

  params = {
    Bucket: bucket,
    Key: s3ObjectKey
  };

  const s3Object = await s3.getObject(params).promise();
  const data = s3Object.Body.toString('utf-8').split(/\r?\n/).filter(e => e != '').map(e => JSON.parse(e));

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ data: data }),
  }
}
