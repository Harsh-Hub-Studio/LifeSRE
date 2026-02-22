// services/gmailService.js

const { google } = require("googleapis");
const oauth2Client = require("../config/googleAuth");

function decodeBase64(encoded) {
  if (!encoded) return "";

  // Gmail uses base64url
  encoded = encoded.replace(/-/g, "+").replace(/_/g, "/");

  const buff = Buffer.from(encoded, "base64");
  return buff.toString("utf-8");
}

function extractTextFromPayload(payload) {
  if (!payload) return "";

  // Direct plain text
  if (payload.mimeType === "text/plain" && payload.body?.data) {
    return decodeBase64(payload.body.data);
  }

  // HTML fallback (strip tags later if needed)
  if (payload.mimeType === "text/html" && payload.body?.data) {
    return decodeBase64(payload.body.data);
  }

  // Recursively check parts
  if (payload.parts) {
    for (let part of payload.parts) {
      const result = extractTextFromPayload(part);
      if (result) return result;
    }
  }

  return "";
}

function extractSubject(payload) {
  const headers = payload.headers || [];
  const subjectHeader = headers.find(
    (h) => h.name === "Subject"
  );
  return subjectHeader ? subjectHeader.value : "Unknown Service";
}

const renewalKeywords = [
  "renew",
  "renewal",
  "auto debit",
  "expires",
  "subscription",
  "policy",
  "charged",
  "billing",
  "premium",
];

function isRenewalEmail(text) {
  if (!text) return false;

  const lowerText = text.toLowerCase();
  return renewalKeywords.some((keyword) =>
    lowerText.includes(keyword)
  );
}

async function fetchFullEmails(user) {
  oauth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  });

  const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client,
  });

  // 🔥 Proper single query (no override)
  const listResponse = await gmail.users.messages.list({
    userId: "me",
    maxResults: 10,
    includeSpamTrash: true,
    q: "newer_than:3d (renew OR renewal OR subscription OR charged OR expires)",
  });

  const messages = listResponse.data.messages || [];

  const filteredEmails = [];

  for (let msg of messages) {
    const message = await gmail.users.messages.get({
      userId: "me",
      id: msg.id,
      format: "full",
    });

    const payload = message.data.payload;

    const subject = extractSubject(payload);
    const textContent = extractTextFromPayload(payload);

    if (isRenewalEmail(textContent)) {
      filteredEmails.push({
        id: msg.id,
        subject,
        text: textContent,
      });
    }
  }

  console.log("📩 Emails fetched:", filteredEmails.length);

  return filteredEmails;
}

module.exports = fetchFullEmails;