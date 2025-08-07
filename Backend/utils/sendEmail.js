const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
//!Load dotenv into process object
dotenv.config();

const sendEmail = async (to, resetToken) => {
  try {
    //?Create a transport object
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.APP_PASS,
      },
    });
    //?Creating the message to be sent
    const message = {
      to,
      subject: "Password Reset Token",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h1 style="color: #333; text-align: center;">Password Reset Request</h1>
            <p style="font-size: 16px; color: #555;">
                You have requested to reset your password. Please use the token below to proceed:
            </p>
            <p style="font-size: 20px; font-weight: bold; color: #007bff; text-align: center; margin: 20px 0;">
                ${resetToken}
            </p>
            <p style="font-size: 14px; color: #999;">
                This token will expire in 10 minutes.
            </p>
            <p style="font-size: 14px; color: #999;">
                If you did not request this, please ignore this email.
            </p>
        </div>
    `,
    };
    //?Send the mail
    const info = await transport.sendMail(message);
    console.log("Email sent ", info.messageId);
  } catch (error) {
    console.log(error);
    throw new Error("Email sending failed!");
  }
};

module.exports = sendEmail;
