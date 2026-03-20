const { getPoints } = require('./data/points_helper');

module.exports.config = {
  name: "متجر",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "سونغ",
  description: "عرض المتجر وما يمكن شراؤه بالنقاط",
  commandCategory: "الملاك",
  usages: "متجر",
  cooldowns: 3
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, senderID } = event;

  const points = getPoints(senderID);

  return api.sendMessage(
    `🏪 متجر الملاك\n` +
    `━━━━━━━━━━━━━━━\n` +
    `💳 نقاطك: ${points} نقطة\n\n` +
    `📦 المنتجات المتاحة:\n\n` +
    `🔑 صلاحية ادمن البوت — 100 نقطة\n` +
    `   تحكم كامل بأوامر البوت في الكروب\n` +
    `   → "شراء صلاحية\n\n` +
    `━━━━━━━━━━━━━━━\n` +
    `💡 كيف تجمع نقاط؟\n` +
    `🎮 "تجميع | "تفكيك → +1 نقطة\n` +
    `❓ "سؤال → +2 نقطة\n` +
    `🎯 "تخمين → +3 نقاط\n` +
    `🎲 "نرد [رقم] → مخاطرة!\n\n` +
    `📊 "رتبتي لعرض الترتيب`,
    threadID,
    messageID
  );
};
