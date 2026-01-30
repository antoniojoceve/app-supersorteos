const { Resend } = require("resend");

const RESEND_API_KEY = process.env.RESEND_API_KEY;

let resend = null;

if (RESEND_API_KEY) {
  resend = new Resend(RESEND_API_KEY);
} else {
  console.warn("⚠️ RESEND_API_KEY no definida. Emails desactivados.");
}

async function sendEmail({ to, subject, html }) {
  try {
    if (!resend) return;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html,
    });
  } catch (err) {
    // ⚠️ IMPORTANTE: el email NO rompe el flujo
    console.error("Error enviando email:", err);
  }
}

module.exports = { sendEmail };
