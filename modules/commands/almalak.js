const fs = require("fs");
const path = require("path");

const IMG_PATH = path.join(__dirname, "cache/malak_dhahabi.jpg");

module.exports.config = {
  name: "الملاك",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "سونغ",
  description: "الملاك الذهبي — يرسل الصورة",
  commandCategory: "الملاك",
  usages: "الملاك الذهبي",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const sub = (args[0] || "").trim();

  if (sub === "الذهبي") {
    if (!fs.existsSync(IMG_PATH)) {
      return api.sendMessage("❌ الصورة غير موجودة!", threadID, messageID);
    }
    return api.sendMessage(
      {
        body: "👑🪽 الملاك الذهبي 🪽👑",
        attachment: fs.createReadStream(IMG_PATH)
      },
      threadID,
      messageID
    );
  }
};
