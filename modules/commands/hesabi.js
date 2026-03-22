const { getPoints } = require('./data/points_helper');

module.exports.config = {
  name: "حسابي",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "كاڪو",
  description: "عرض نقاطك الحالية",
  commandCategory: "الملاك",
  usages: "حسابي",
  cooldowns: 3
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, senderID } = event;

  let name = senderID;
  try {
    const info = await api.getUserInfo(senderID);
    name = info[senderID]?.name || senderID;
  } catch {}

  const points = getPoints(senderID);
  const needed = Math.max(0, 100 - points);

  return api.sendMessage(
    `💳 حسابك يا ${name}\n` +
    `━━━━━━━━━━━━━━━\n` +
    `🏅 نقاطك: ${points} نقطة\n` +
    `🎯 تحتاج ${needed} نقطة للحصول على صلاحية ادمن البوت\n\n` +
    `💡 اكسب النقاط بالفوز في:\n` +
    `   🎮 "تجميع | "تفكيك → +1 نقطة\n` +
    `   ❓ "سؤال → +2 نقطة\n` +
    `   🎯 "تخمين → +3 نقاط\n` +
    `   🎲 "نرد → مخاطرة!\n\n` +
    `🛒 اكتب "شراء صلاحية عند جمع 100 نقطة`,
    threadID,
    messageID
  );
};
