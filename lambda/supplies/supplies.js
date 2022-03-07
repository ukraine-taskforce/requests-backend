module.exports.handler = async (event) => {
  console.log('Request: ', event);

  let locale;
  if (event.queryStringParameters)
    locale = event.queryStringParameters.locale;

  if (!locale) locale = 'uk';

  let result;
  if (locale == 'uk')
    result = getSupplies().map(function(s) {
        var o = {};
        o["id"] = s.id;
        o["name"] = s.uk;

        return o;
    });
  else
    result = getSupplies().map(function(s) {
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

  function getSupplies() {
    return [
        {
            id: "food",
            uk: "Продукти харчування",
            en: "Food"
        },
        {
            id: "water",
            uk: "Вода",
            en: "Water"
        },
        {
            id: "baby_food",
            uk: "Дитяче харчування",
            en: "Baby Food"
        },
        {
            id: "baby_products",
            uk: "Дитячі товари",
            en: "Baby Products"
        },
        {
            id: "medical_kits_supplies",
            uk: "Медичні набори / товари",
            en: "Medical Kits / Supplies"
        },
        {
            id: "personal_hygiene_kits",
            uk: "Товари особистої гігієни",
            en: "Personal hygiene kits"
        },
        {
            id: "masks",
            uk: "Маски",
            en: "Masks"
        },
        {
            id: "sanitary_pads",
            uk: "Гігієнічні прокладки",
            en: "Sanitary pads"
        },
        {
            id: "tampons",
            name: "тампони",
            en: "Tampons"
        },
        {
            id: "torches",
            uk: "Смолоскипи",
            en: "Torches"
        },
        {
            id: "batteries",
            uk: "Батарейки",
            en: "Batteries"
        },
        {
            id: "candles",
            uk: "Свічки",
            en: "Candles"
        },
        {
            id: "firestarter",
            uk: "запальнички",
            en: "Firestarter"
        },
        {
            id: "bedding",
            uk: "Постільна білизна",
            en: "Bedding"
        },
        {
            id: "sleeping_bags",
            uk: "спальні мішки",
            en: "Sleeping Bags"
        },
        {
            id: "thermal_clothing",
            uk: "Термоодяг",
            en: "Thermal clothing"
        },
        {
            id: "shoes",
            uk: "Взуття",
            en: "Shoes"
        },
        {
            id: "clothes",
            uk: "Одяг",
            en: "Clothes"
        },
        {
            id: "gloves",
            uk: "Рукавички",
            en: "Gloves"
        }
      ]
  }
}