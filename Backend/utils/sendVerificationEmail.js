const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const sendAccountVerificationEmail = async (to, verificationToken) => {
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
    //? Creating the message to be sent for user authentication
    const message = {
      to,
      subject: "Your Verification Code",
      html: `
       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
           <h1 style="color: #333; text-align: center;">User Verification</h1>
           <p style="font-size: 16px; color: #555;">
               Please use the following verification code to complete your authentication process:
           </p>
           <p style="font-size: 24px; font-weight: bold; color: #28a745; text-align: center; margin: 20px 0;">
               ${verificationToken}
           </p>
           <p style="font-size: 14px; color: #999;">
               This code will expire in 10 minutes.
           </p>
           <p style="font-size: 14px; color: #999;">
               If you did not initiate this request, you can safely ignore this email.
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

module.exports = sendAccountVerificationEmail;
