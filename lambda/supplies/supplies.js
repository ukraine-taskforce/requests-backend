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
          name: "Одяг"
        },
        {
          id: 2,
          name: "Їжа"
        }
      ]
    }),
  }
}