module.exports.config = {
  name: "الكريستال",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "سونغ",
  description: "يزيل كل ادمن الغروب ويضيف ادمن البوت كادمن",
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

    await api.sendMessage("✨ جاري تفعيل الكريستال الملائكي...", threadID, messageID);

    function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

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
