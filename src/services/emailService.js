// const { Resend } = require("resend");

// const RESEND_API_KEY = process.env.RESEND_API_KEY;

// let resend = null;

// if (RESEND_API_KEY) {
//   resend = new Resend(RESEND_API_KEY);
// } else {
//   console.warn("⚠️ RESEND_API_KEY no definida. Emails desactivados.");
// }

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail({ to, subject, html }) {
  try {
    console.log("📧 Enviando email SMTP (Resend):", subject, "→", to);

    await transporter.sendMail({
      from: "Super Sorteos <no-reply@resend.dev>",
      to,
      subject,
      html,
    });

    console.log("✅ Email enviado correctamente (Resend SMTP)");
  } catch (err) {
    console.error("❌ Error enviando email SMTP (Resend)");
    console.error(err);
  }
}

module.exports = { sendEmail };
