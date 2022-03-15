module.exports.handler = async (event) => {
  console.log('Request: ', event);
  let supplyData = require('./supplies.json');

  let locale;
  if (event.queryStringParameters)
    locale = event.queryStringParameters.locale;

  if (!locale) locale = 'uk';


  let result;
  if (locale == 'uk')
    result = supplyData.map(function(s) {
        var o = {};
        o["id"] = s.id;
        o["name"] = s.uk;

        return o;
    });
  else
    result = supplyData.map(function(s) {
        var o = {};
        o["id"] = s.id;
        o["name"] = s.en;

        return o;
    });

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      supplies: result
    }),
  }
}