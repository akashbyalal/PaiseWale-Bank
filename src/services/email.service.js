require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"PaiseWale Bank" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to PaiseWala Bank 🎉";

  const text = `
Dear ${name},

Welcome to PaiseWala Bank!

Your account has been successfully created.

Thank you for choosing us as your trusted banking partner. We're excited to have you with us and look forward to making your banking experience simple, secure, and convenient.

You can now sign in and start exploring your account.

If you have any questions, our support team is always here to help.

Warm regards,

PaiseWala Bank Team
Secure. Simple. Trusted.
`;

  const html = `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">

  <div style="background:#0d6efd;padding:24px;text-align:center;color:white;">
    <h2 style="margin:0;">Welcome to PaiseWala Bank</h2>
  </div>

  <div style="padding:32px;color:#333;line-height:1.7;">

    <p>Dear <strong>${name}</strong>,</p>

    <p>
      Your account has been successfully created.
    </p>

    <p>
      Thank you for choosing <strong>PaiseWala Bank</strong>. We're delighted to have you with us and look forward to providing you with a smooth, secure, and reliable banking experience.
    </p>

    <p>
      You can now log in to your account and start managing your finances with ease.
    </p>

    <p>
      If you need any assistance, we're always here to help.
    </p>

    <p>
      Best regards,<br>
      <strong>PaiseWala Bank Team</strong>
    </p>

  </div>

  <div style="background:#f8f9fa;padding:16px;text-align:center;font-size:12px;color:#777;">
    © 2026 PaiseWala Bank. All rights reserved.
  </div>

</div>
`;
  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = "Transaction Successful";

  const text = `
    Hello ${name},

    Your transaction was completed successfully.

    Amount: $${amount}
    Sent To: ${toAccount}

    Thank you for choosing PaiseWale Bank.

    Best regards,
    PaiseWale Bank Team
`;

  const html = `
  <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="color: #16a34a;">Transaction Successful</h2>

    <p>Hello <strong>${name}</strong>,</p>

    <p>Your transaction has been completed successfully.</p>

    <p><strong>Amount:</strong> $${amount}</p>
    <p><strong>Sent To:</strong> ${toAccount}</p>

    <p>Thank you for choosing <strong>PaiseWale Bank</strong>.</p>

    <p>Best regards,<br>PaiseWale Bank Team</p>
  </div>
  `;

  await sendEmail(userEmail, subject, text, html)
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
  const subject = "Transaction Failed";

  const text = `
Hello ${name},

We're sorry, but your transaction could not be completed.

Amount: $${amount}
Recipient Account: ${toAccount}
Status: Failed

Please try again later.

Best regards,
PaiseWale Bank Team
`;

  const html = `
  <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="color: #dc2626;">Transaction Failed</h2>

    <p>Hello <strong>${name}</strong>,</p>

    <p>We're sorry, but your transaction could not be completed.</p>

    <p><strong>Amount:</strong> $${amount}</p>
    <p><strong>Recipient Account:</strong> ${toAccount}</p>
    <p><strong>Status:</strong> Failed</p>

    <p>Please try again later.</p>

    <p>Best regards,<br>PaiseWale Bank Team</p>
  </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = { transporter, sendRegistrationEmail, sendTransactionEmail, sendTransactionFailureEmail };
