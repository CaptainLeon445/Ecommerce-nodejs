const nodemailer = require("nodemailer");

const sendEmail = async (Options) => {
  // create Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //  Define the Mail Options
  const mailOptions = {
    from: `Momento Customer Service <${process.env.DEFAULT_EMAIL}>`,
    to: Options.email,
    subject: Options.subject,
    text: Options.message,
  };

  //   Send the mail
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
