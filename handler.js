

const AWS = require("aws-sdk");
const ses = new AWS.SES();

exports.sendEmail = async ({to, from, subject, htmlBody}) => {
  const params = {
    Source: from,
    Destination: {ToAddresses: [to]},
    Message: {
      Subject: {Data: subject},
      Body: {
        Html: {Data: htmlBody},
      },
    },
  };

  try {
    await ses.sendEmail(params).promise();
    return {statusCode: 200, body: JSON.stringify({message: "Email sent!"})};
  } catch (error) {
    console.error(error); 
    return {statusCode: 500, body: JSON.stringify({error: error.message})};
  }
};
