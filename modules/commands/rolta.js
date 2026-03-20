module.exports.config = {
  name: "رولت",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "سونغ",
  description: "لعبة الروليت الروسية — حظك يقرر!",
  commandCategory: "الملاك",
  usages: "رولت",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, senderID } = event;

  let name = senderID;
  try {
    const info = await api.getUserInfo(senderID);
    name = info[senderID]?.name || senderID;
  } catch {}

  const chance = Math.floor(Math.random() * 6) + 1;

  if (chance === 1) {
    return api.sendMessage(
      `🔫 رولت روسية\n` +
      `━━━━━━━━━━━━━━━\n` +
      `${name} أطلق الرصاصة على نفسه! 💀\n` +
      `💥 انفجرت! الحظ خانك هذه المرة 😱\n` +
      `━━━━━━━━━━━━━━━\n` +
      `🎯 احتمال الخسارة: 1/6`,
      threadID,
      messageID
    );
  } else {
    return api.sendMessage(
      `🔫 رولت روسية\n` +
      `━━━━━━━━━━━━━━━\n` +
      `${name} أطلق الرصاصة على نفسه!\n` +
      `😌 *كليك* — المسدس كان فارغاً! نجوت 🍀\n` +
      `━━━━━━━━━━━━━━━\n` +
      `🎯 نجوت بفضل الحظ (${chance}/6)`,
      threadID,
      messageID
    );
  }
};
