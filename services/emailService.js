import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});



export const sentOTP = async (email, otp) => {
  try {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "OTP Verification code for TIJ invoices",
        headers: { "Content-Type": "text/html" },
        html: `<!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f5f5f5;
                  margin: 0;
                  padding: 0;
              }
      
              .container {
                  max-width: 600px;
                  margin: 50px auto;
                  background: #ffffff;
                  border-radius: 8px;
                  padding: 20px;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                  text-align: center;
                  border: 1px solid #e9e9e9;
              }
      
              .header {
                  font-size: 24px;
                  font-weight: bold;
                  color: #000000;
                  margin-bottom: 20px;
              }
      
              .message {
                  font-size: 16px;
                  color: #888888;
                  margin-bottom: 20px;
              }
      
              .otp-code {
                  font-size: 28px;
                  font-weight: bold;
                  color: #000000;
                  background: #f2c94d; /* Changed from #f5f5f5 to a more visible color */
                  display: inline-block;
                  padding: 10px 20px;
                  border-radius: 5px;
                  border: 1px solid #e9e9e9;
              }
      
              .footer {
                  font-size: 14px;
                  color: #888888;
                  margin-top: 30px;
              }
      
              .btn {
                  display: inline-block;
                  margin-top: 20px;
                  padding: 12px 24px;
                  background: #f2c94d;
                  color: #000000;
                  text-decoration: none;
                  font-weight: bold;
                  border-radius: 5px;
                  transition: all 0.2s ease-out;
              }
      
              .btn:hover {
                  opacity: 0.8;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">Verify Your Email</div>
              <div class="message">Here is your OTP code for TIJ invoices</div>
              <div class="otp-code">${otp}</div>
          </div>
      </body>
      </html>`
      };
      
    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};
