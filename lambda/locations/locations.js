module.exports.handler = async (event) => {
  console.log('Request: ', event);
  let cityData = require('./cities.json');

  let locale;
  if (event.queryStringParameters)
    locale = event.queryStringParameters.locale;

  if (!locale) locale = 'uk';

  let result;
  if (locale == 'uk')
    result = cityData.map(function(c) {
        var o = {};
        o["id"] = c.en;
        o["name"] = c.uk;

        return o;
    });
  else
    result = cityData.map(function(c) {
        var o = {};
        o["id"] = c.en;
        o["name"] = c.en;

        return o;
    });

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      locations: result
    }),
  }
}