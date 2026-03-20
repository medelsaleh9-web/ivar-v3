const fs = require("fs");
const path = require("path");

const IMG1 = path.join(__dirname, "../commands/cache/gonzalo1.jpg");
const IMG2 = path.join(__dirname, "../commands/cache/gonzalo2.jpg");

const MESSAGE =
  `آلگيـﮯنج غونزآلو سـآمـآ عمـگ وعمکْ وٌغُمً لَيَيَ يَطِلَعٌ وٌرآکْ\n` +
  `𝑬𝑳𝑲𝑰𝑵𝑮 𝑮𝑶𝑵𝒁𝑨𝑳𝑶 𝑺𝑨𝑴𝑨\n` +
  `عٌمًڰ يَآطِفُلَ`;

module.exports.config = {
  name: "gonzaloWord",
  eventType: ["message"],
  version: "1.0.0",
  credits: "سونغ",
  description: "يرسل رسالة غونزالو عند ذكر اسمه"
};

module.exports.run = async function ({ api, event }) {
  const { threadID, body, messageID } = event;
  if (!body) return;

  const text = body.trim().toLowerCase();
  if (!text.includes("غونزالو") && !text.includes("gonzalo")) return;

  const attachments = [];
  if (fs.existsSync(IMG1)) attachments.push(fs.createReadStream(IMG1));
  if (fs.existsSync(IMG2)) attachments.push(fs.createReadStream(IMG2));

  if (attachments.length > 0) {
    return api.sendMessage(
      { body: MESSAGE, attachment: attachments },
      threadID,
      messageID
    );
  } else {
    return api.sendMessage(MESSAGE, threadID, messageID);
  }
};
