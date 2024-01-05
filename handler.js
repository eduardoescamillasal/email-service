const AWS = require("aws-sdk");
const ses = new AWS.SES();

exports.sendEmail = async (event) => {
  const params = {
    Source: "esaldana@bluepeople.com",
    Destination: {ToAddresses: ["esaldana@bluepeople.com"]},
    Message: {
      Subject: {Data: "Your Subject Here"},
      Body: {
        Html: {Data: '<p>Your email content with <a href="http://example.com">hyperlink</a>.</p>'},
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
