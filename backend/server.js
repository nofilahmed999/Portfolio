
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dns = require("dns").promises;
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ===============================
// Gmail Transporter
// ===============================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// Check Gmail connection when server starts
transporter.verify((error) => {
  if (error) {
    console.error("❌ Gmail connection failed:", error.message);
  } else {
    console.log("✅ Gmail transporter is ready");
  }
});

// ===============================
// Contact Form
// ===============================
app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Required fields
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all required fields.",
    });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanSubject = subject?.trim() || "";
  const cleanMessage = message.trim();

  // ===============================
  // Basic Email Validation
  // ===============================
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address.",
    });
  }

  // ===============================
  // Test Email Block
  // ===============================
  if (cleanEmail === "test@gmail.com") {
    return res.status(400).json({
      success: false,
      message: "This email address is restricted from submitting the form.",
    });
  }

  // ===============================
  // Check Email Domain
  // ===============================
  const domain = cleanEmail.split("@")[1];

  try {
    const mxRecords = await dns.resolveMx(domain);

    if (!mxRecords || mxRecords.length === 0) {
      return res.status(400).json({
        success: false,
        message: "This email domain cannot receive emails.",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid email address or non-existent email domain.",
    });
  }

  // ===============================
  // 1. Email to YOU
  // ===============================
  const adminEmail = {
    from: `"Portfolio Contact" <${process.env.MY_EMAIL}>`,
    to: process.env.MY_EMAIL,
    replyTo: cleanEmail,
    subject: cleanSubject
      ? `Portfolio: ${cleanSubject}`
      : `New Message from ${cleanName}`,

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto;">
        
        <h2>New Portfolio Contact</h2>

        <p>
          <strong>Name:</strong> ${cleanName}
        </p>

        <p>
          <strong>Email:</strong> ${cleanEmail}
        </p>

        ${
          cleanSubject
            ? `<p><strong>Subject:</strong> ${cleanSubject}</p>`
            : ""
        }

        <p><strong>Message:</strong></p>

        <div
          style="
            background: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            line-height: 1.6;
          "
        >
          ${cleanMessage}
        </div>

      </div>
    `,
  };

  // ===============================
  // 2. Auto Reply to VISITOR
  // ===============================
  const visitorEmail = {
    from: `"Nofil - Web Developer" <${process.env.MY_EMAIL}>`,
    to: cleanEmail,
    replyTo: process.env.MY_EMAIL,
    subject: "Thank you for reaching out!",

    text: `Hi ${cleanName},

Thank you for getting in touch through my portfolio website.

I have received your message and will get back to you as soon as possible.

Best regards,
Nofil
Web Developer`,

    html: `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 30px auto;
          padding: 30px;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          color: #333;
          line-height: 1.6;
        "
      >

        <h2 style="color: #111;">
          Hi ${cleanName},
        </h2>

        <p>
          Thank you for getting in touch through my portfolio website!
        </p>

        <p>
          I have received your message and will get back to you
          as soon as possible.
        </p>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;" />

        <p>
          <strong>Your message:</strong>
        </p>

        <div
          style="
            background: #f8f8f8;
            padding: 15px;
            border-left: 4px solid #111;
            border-radius: 4px;
          "
        >
          ${cleanMessage}
        </div>

        <p style="margin-top: 25px;">
          Best regards,<br />
          <strong>Nofil</strong><br />
          Web Developer
        </p>

      </div>
    `,
  };

  // ===============================
  // SEND EMAILS
  // ===============================
  try {
    // First send message to YOU
    const adminResult = await transporter.sendMail(adminEmail);

    console.log("✅ Admin email sent");
    console.log("Message ID:", adminResult.messageId);

    // Then immediately send auto-reply to visitor
    try {
      const visitorResult = await transporter.sendMail(visitorEmail);

      console.log("✅ Auto-reply sent to:", cleanEmail);
      console.log("Message ID:", visitorResult.messageId);
    } catch (visitorError) {
      console.error(
        "❌ Auto-reply failed:",
        visitorError.message
      );
    }

    return res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    });

  } catch (error) {
    console.error("❌ Admin email failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to send email. Please try again later.",
    });
  }
});

// ===============================
// Start Server
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
