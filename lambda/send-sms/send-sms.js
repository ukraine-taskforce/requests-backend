const {PublishCommand} = require("@aws-sdk/client-sns");
const getSnsClient = require("./sns-client").getSnsClient;

exports.handler = async (event, context) => {
    let body = JSON.parse(event.body)
    const sms = {
        Message: body.Message,
        PhoneNumber: body.PhoneNumber,
        MessageAttributes: {
            'AWS.SNS.SMS.SenderID': {DataType: 'String', StringValue: 'UGT'},
            'AWS.SNS.SMS.SMSType': {DataType: 'String', StringValue: 'Transactional'},
        }
    };

    try {
        const smsClient = await getSnsClient();
        const command = new PublishCommand(sms);
        await smsClient.send(command);
        return {statusCode: 200};
    } catch (error) {
        console.error(error, error.stack);
        return {statusCode: 500};
    }
};
