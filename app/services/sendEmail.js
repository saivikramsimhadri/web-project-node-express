const nodemailer = require("nodemailer");
const { MAIL_SETTINGS } = require("../constants/constants");
const transporter = nodemailer.createTransport(MAIL_SETTINGS);
const sendEmail = async (email, subject, text) => {
  try {
    await transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: email,
      subject: subject,
      text: text,
    });

    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};

module.exports = sendEmail;
