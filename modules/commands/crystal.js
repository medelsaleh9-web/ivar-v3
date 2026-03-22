const fs = require("fs");
const path = require("path");

const VIDEO_PATH = path.join(__dirname, "cache/crystal_video.mp4");

module.exports.config = {
  name: "الكريستال",
  version: "2.0.0",
  hasPermssion: 1,
  credits: "كاڪو",
  description: "يزيل كل ادمن الغروب ويضيف ادمن البوت كادمن مع إرسال فيديو",
  commandCategory: "الملاك",
  usages: "الكريستال الملائكي",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const sub = args[0];
  if (sub !== "الملائكي") return;
  const { threadID, messageID } = event;

  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const { adminIDs } = threadInfo;
    const botID = api.getCurrentUserID();
    const ADMINBOT = global.config.ADMINBOT || [];

    function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

    const msgPayload = {
      body: "✨ الكريستال الملائكي 🪽👑"
    };

    if (fs.existsSync(VIDEO_PATH)) {
      msgPayload.attachment = fs.createReadStream(VIDEO_PATH);
    }

    await api.sendMessage(msgPayload, threadID, messageID);

    await delay(1000);

    for (const admin of adminIDs) {
      const id = admin.id;
      if (id === botID) continue;
      try {
        await api.changeAdminStatus(threadID, id, false);
        await delay(400);
      } catch {}
    }

    for (const adminID of ADMINBOT) {
      if (!adminID || adminID === "") continue;
      try {
        await api.changeAdminStatus(threadID, adminID, true);
        await delay(400);
      } catch {}
    }

    return api.sendMessage("✅ تم تفعيل الكريستال الملائكي — تمت إزالة كل الادمن وتعيين ادمن البوت 👑🪽", threadID);
  } catch (e) {
    return api.sendMessage(`❌ خطأ: ${e.message}`, threadID);
  }
};
