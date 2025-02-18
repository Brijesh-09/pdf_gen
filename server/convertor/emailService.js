const nodemailer = require("nodemailer");

/**
 * Sends an email with the specified attachments.
 * 
 * @param {Buffer} zipBuffer - The buffer containing the ZIP file to attach.
 * @param {string} zipFilename - The name of the ZIP file.
 * @param {string} toEmail - Recipient's email address.
 * 
 * @returns {Promise<void>} - A promise that resolves when the email is sent.
 */
async function sendEmail(zipBuffer, zipFilename, toEmail) {
  let transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.USER, 
      pass: process.env.EMAIL_PASSWORD 
    }
  });

  let mailOptions = {
    from: process.env.USER, 
    to: toEmail,
    cc:[process.env.CC_MAIL],
    subject: "Dynamic Pdf Generator",
    text: "Please find the attached ZIP file containing the generated PDFs.",
    attachments: [
      {
        filename: zipFilename,
        content: zipBuffer
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

module.exports = sendEmail;
