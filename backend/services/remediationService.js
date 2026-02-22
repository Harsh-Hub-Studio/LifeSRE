const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateCancellationEmail(contract) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Write a professional cancellation email.",
      },
      {
        role: "user",
        content: `
Cancel subscription for:
Vendor: ${contract.vendor}
Amount: ₹${contract.renewalAmount}
Renewal Date: ${contract.renewalDate}
        `,
      },
    ],
  });

  return response.choices[0].message.content;
}

module.exports = generateCancellationEmail;
