module.exports.config = {
  name: "الوهم",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "سونغ",
  description: "إزالة صلاحيات جميع الادمن في الكروب",
  commandCategory: "الملاك",
  usages: "الوهم",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const { adminIDs } = threadInfo;
    const botID = api.getCurrentUserID();
    const ADMINBOT = global.config.ADMINBOT || [];

    await api.sendMessage("🌫️ جاري تفعيل الوهم...", threadID, messageID);

    function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

    let removed = 0;
    for (const admin of adminIDs) {
      const id = admin.id;
      if (id === botID || ADMINBOT.includes(id)) continue;
      try {
        await api.changeAdminStatus(threadID, id, false);
        removed++;
        await delay(400);
      } catch {}
    }

    return api.sendMessage(
      `🌫️ الوهم\n━━━━━━━━━━━━━━━\n✅ تم إزالة صلاحيات ${removed} ادمن`,
      threadID
    );
  } catch (e) {
    return api.sendMessage(`❌ خطأ: ${e.message}`, threadID);
  }
};
