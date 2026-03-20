module.exports.config = {
  name: "كريستالي",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "سونغ",
  description: "إخراج البوت من الكروب",
  commandCategory: "الملاك",
  usages: "كريستالي",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID } = event;
  const botID = api.getCurrentUserID();

  await api.sendMessage("وداعاً 👑🪽", threadID);
  try {
    await api.removeUserFromGroup(botID, threadID);
  } catch (e) {
    await api.sendMessage("❌ تعذّر الخروج: " + e.message, threadID);
  }
};
