module.exports.handler = async (event) => {
  console.log('Request: ', event);
  let cityData = require('./cities.json');

  let locale;
  let include_metadata;
  if (event.queryStringParameters)
    locale = event.queryStringParameters.locale;
    include_metadata = event.queryStringParameters.include_metadata;

  if (!locale) locale = 'uk';
  if (!include_metadata) include_metadata = false;

  let result;
  if (locale == 'uk')
    result = cityData.map(function(c) {
        var o = {};
        o["id"] = c.id;
        o["name"] = c.uk;
	if (include_metadata) {
	    o["lat"] = c.lat;
	    o["lon"] = c.lon;
	    o["region_id"] = c.region_id;
	}
        return o;
    });
  else
    result = cityData.map(function(c) {
        var o = {};
        o["id"] = c.id;
        o["name"] = c.en;
	if (include_metadata) {
	    o["lat"] = c.lat;
	    o["lon"] = c.lon;
	    o["region_id"] = c.region_id;
	}
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
