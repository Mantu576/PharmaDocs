const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or "Outlook", "Yahoo", etc.
      auth: {
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASS, // your app password (not your email password!)
      },
    });

    // Define email options
    const mailOptions = {
      from: `"PharmaDocs Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent:", info.response);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;
