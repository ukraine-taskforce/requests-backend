const {SNSClient} = require("@aws-sdk/client-sns");

let snsClient = null;

exports.getSnsClient = async () => {
    if (snsClient) return snsClient;
    snsClient = new SNSClient({})
    return snsClient;
};
