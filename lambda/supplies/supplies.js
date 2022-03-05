module.exports.handler = async (event) => {
  console.log('Request: ', event);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      supplies: [
        {
          id: 1,
          uk: "Одяг"
        },
        {
          id: 2,
          uk: "Їжа"
        }
      ]
    }),
  }
}