const supplyData = require("./supplies.json");
const supplyDataV2 = require("./suppliesV2.json");

module.exports.handler = async (event) => {
  console.log("Request: ", event);

  let locale;
  if (event.queryStringParameters) locale = event.queryStringParameters.locale;

  if (!locale) locale = "uk";

  let version;
  if (event.pathParameters) version = event.pathParameters.version;

  if (version !== "v1" && version !== "v2") {
    return {
      statusCode: 404,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({}),
    };
  }

  const supplyList = version === "v1" ? supplyData : supplyDataV2.subcategories;

  let result;
  if (locale == "uk")
    result = supplyList.map(function (s) {
      var o = {};
      o["id"] = s.id;
      o["name"] = s.uk;
      if (version === "v2") {
        o["parent"] = supplyDataV2.categories[s.parent].uk;
      }
      return o;
    });
  else
    result = supplyList.map(function (s) {
      var o = {};
      o["id"] = s.id;
      o["name"] = s.en;
      if (version === "v2") {
        o["parent"] = supplyDataV2.categories[s.parent].en;
      }
      return o;
    });

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      supplies: result,
    }),
  };
};
