const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

async function sendWhatsAppNotification(user, message) {
  try {
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${user.phone}`, // must include whatsapp:
      body: message,
    });

    console.log("📱 WhatsApp Sent Successfully");
  } catch (err) {
    console.error("WhatsApp Error:", err.message);
  }
}

module.exports = sendWhatsAppNotification;