const express = require( 'express' );
const app = express();
const path = require('path')
const bodyParser = require('body-parser')

var var_arr = ["Refresh the browser to see your events!"]

app.use( express.static( path.join( __dirname, 'public' ) ) )
app.set('views', __dirname + '/public/views')
app.set( 'view engine', 'html' )
app.engine( 'html', require( 'ejs' ).renderFile )
app.use( bodyParser.urlencoded( { extended: true } ) )
app.use( bodyParser.json())

app.get( '/', ( req, res ) => {
  res.render('index.html')
} );

app.post( '/', ( req, res ) => {
  const tkn = req.body.token
  console.log('token:', tkn)
  const fs = require("fs").promises;
  const path = require("path");
  const process = require("process");
  const {authenticate} = require("@google-cloud/local-auth");
  const {google} = require("googleapis");

  // If modifying these scopes, delete token.json.
  const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.
  const TOKEN_PATH = path.join(process.cwd(), "token.json");
  const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

  /**
   * Reads previously authorized credentials from the save file.
   *
   * @return {Promise<OAuth2Client|null>}
   */
  async function loadSavedCredentialsIfExist() {
    try {
      const content = await fs.readFile(TOKEN_PATH);
      const credentials = JSON.parse(content);
      return google.auth.fromJSON(credentials);
    } catch (err) {
      return null;
    }
  }

  /**
   * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
   *
   * @param {OAuth2Client} client
   * @return {Promise<void>}
   */
  async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: "authorized_user",
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
  }

  /**
   * Load or request or authorization to call APIs.
   *
   */
  async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await saveCredentials(client);
    }
    return client;
  }

  /**
   * Lists the next 10 events on the user's primary calendar.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  async function listEvents ( auth ) {
    async function fun () {
      const calendar = google.calendar( { version: "v3", auth } );
      const res = await calendar.events.list( {
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: "startTime",
      } );
      const events = res.data.items;
      if ( !events || events.length === 0 ) {
        console.log( "No upcoming events found." );
        return;
      }
      console.log( "Upcoming 10 events:" , events);
      events.map( ( event, i ) => {
        const start = event.start.dateTime || event.start.date;
        console.log( `${ start } - ${ event.summary }` );
        var_arr.push( event );
      } );
    }
     fun()
  }

  authorize().then(listEvents).catch(console.error);
  res.send(var_arr)
  res.render('index.html')
} );

app.post('/events', async (req, res) => {
  // Extract email details from request body
  const { to, from, subject, text, html } = req.body;

  const params = {
    Source: from, // Sender's email
    Destination: { ToAddresses: [to] }, // Recipient's email
    Message: {
      Subject: { Data: subject },
      Body: {
        Html: {
          Data: html || text, // Use HTML content if available; otherwise, use text
        },
      },
    },
  };

  try {
    // Call the sendEmail function from handler.js
    const response = await sendEmail({ event: params });
    res.send(response.body); // Send the success response to the client
  } catch (error) {
    console.error("Error sending email", error);
    res.status(500).send("Error sending email"); // Send the error response to the client
  }
});

// app.post( '/events', ( req, res ) => {
//   // using Twilio SendGrid's v3 Node.js Library
//   // https://github.com/sendgrid/sendgrid-nodejs
//   javascript;
//   const sgMail = require("@sendgrid/mail");
//   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//   const msg = {
//     to: "test@example.com", // Change to your recipient
//     from: "test@example.com", // Change to your verified sender
//     subject: "Sending with SendGrid is Fun",
//     text: "and easy to do anywhere, even with Node.js",
//     html: "<strong>and easy to do anywhere, even with Node.js</strong>",
//   };
//   sgMail
//     .send(msg)
//     .then(() => {
//       console.log("Email sent");
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// })

app.listen( 3000, () => {
  console.log("Server on port 3000")
} );
/*
{"installed":{"client_id":"189951011754-v2n2btu9gicvjd1v8pvpg4apvi2bepe1.apps.googleusercontent.com","project_id":"calendar-api-410618","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"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","redirect_uris":["http://localhost"]}}
*/