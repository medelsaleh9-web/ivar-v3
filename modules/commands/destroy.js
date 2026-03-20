module.exports.config = {
  name: "تدمير",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "سونغ",
  description: "إزالة كل أعضاء الكروب عدا الادمن",
  commandCategory: "الملاك",
  usages: "تدمير",
  cooldowns: 10
};

module.exports.run = async function ({ api, event }) {
  const { threadID, senderID } = event;

  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const { participantIDs, adminIDs } = threadInfo;
    const botID = api.getCurrentUserID();
    const adminIDsList = adminIDs.map(a => a.id);

    await api.sendMessage("💥 جاري التدمير...", threadID);

    const toRemove = participantIDs.filter(id => {
      return id !== botID && !adminIDsList.includes(id) && id !== senderID;
    });

    function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

    for (const uid of toRemove) {
      try {
        await api.removeUserFromGroup(uid, threadID);
        await delay(300);
      } catch (e) {}
    }

    return api.sendMessage("✅ تم التدمير — تمت إزالة كل الأعضاء 💀", threadID);
  } catch (e) {
    return api.sendMessage("❌ خطأ: " + e.message, threadID);
  }
};
