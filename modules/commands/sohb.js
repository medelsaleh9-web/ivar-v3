module.exports.config = {
  name: "سحب",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "كاڪو",
  description: "اختيار عضو عشوائي من الكروب",
  commandCategory: "الملاك",
  usages: "سحب",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  try {
    const info = await api.getThreadInfo(threadID);
    const members = info.participantIDs || [];
    const botID = api.getCurrentUserID();
    const others = members.filter(id => id !== botID);

    if (others.length === 0) {
      return api.sendMessage("❌ لا يوجد أعضاء في الكروب!", threadID, messageID);
    }

    const chosen = others[Math.floor(Math.random() * others.length)];
    const userInfo = await api.getUserInfo(chosen);
    const name = userInfo[chosen]?.name || chosen;

    return api.sendMessage(
      `🎰 السحب العشوائي\n` +
      `━━━━━━━━━━━━━━━\n` +
      `🎯 الفائز هو: ${name}\n` +
      `🆔 المعرف: ${chosen}`,
      threadID,
      messageID
    );
  } catch (e) {
    return api.sendMessage("❌ حصل خطأ أثناء السحب!", threadID, messageID);
  }
};
