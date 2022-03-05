const request = require('request');
const secret = process.env.RECAPTCHA_SECRET

module.exports.handler = async (event) => {

    return new Promise(function (resolve, reject) {
        try {
            var eventBody = event.body;
            var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secret + "&response=" + eventBody.recaptchaToken;
            request.post(verificationUrl, function (err, res, body) {
                let json = JSON.parse(body);
                var retVal = undefined;

                if (json.success) {
                    retVal = createResponse(200, eventBody)
                } else {
                    retVal = createResponse(500, json)
                }
                resolve(retVal);
            });
        } catch (err) {
            reject(err)
        }
    });
};


function createResponse(status, data) {
    return {
        statusCode: status,
        data: data,
    }
}