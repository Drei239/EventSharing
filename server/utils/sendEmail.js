const nodemailer = require("nodemailer");
const path = require("path");
const { OAuth2Client } = require("google-auth-library");

const myOAuth2Client = new OAuth2Client(
  process.env.GOOGLE_MAILER_CLIENT_ID,
  process.env.GOOGLE_MAILER_CLIENT_SECRET
);
// Set Refresh Token vào OAuth2Client Credentials
myOAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
});

const sendEmail = async ({ to, subject, content }) => {
  try {
    // const myAccessTokenObject = await myOAuth2Client.getAccessToken();
    // const myAcessToken = myAccessTokenObject?.token;

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.ADMIN_EMAIL_ADDRESS,
        clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
        clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
      },
    });
    let mainOptions = {
      to: to,
      subject: subject,
      html: content,
    };
    await transport.sendMail(mainOptions, function (err, info) {
      if (err) {
        throw Error(err);
      } else {
        console.log("Email sent:" + info.response);
      }
    });
  } catch (err) {
    throw Error(err);
  }
};
module.exports = sendEmail;
