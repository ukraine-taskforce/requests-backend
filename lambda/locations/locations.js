module.exports.handler = async (event) => {
  console.log('Request: ', event);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      locations: [
        {
          id: 1,
          uk: "Харків"
        },
        {
          id: 2,
          uk: "Cуми"
        }
      ]
    }),
  }
}