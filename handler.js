const AWS = require("aws-sdk");
const ses = new AWS.SES();

exports.sendEmail = async (event) => {
  const params = {
    Source: "esaldana@bluepeople.com",
    Destination: {ToAddresses: ["relizalde@bluepeople.com"]},
    Message: {
      Subject: {Data: "versión inicial..."},
      Body: {
        Html: {
          Data: '<p>Hola, favor de dar click <a href="https://sites.google.com/bluepeople.com/bluesite">aquí</a>.</p>',
        },
      },
    },
  };

  try {
    await ses.sendEmail(params).promise();
    return {statusCode: 200, body: JSON.stringify({message: "Email sent!"})};
  } catch (error) {
    return {statusCode: 500, body: JSON.stringify({error})};
  }
};
