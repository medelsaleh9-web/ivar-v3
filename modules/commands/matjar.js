const { getPoints } = require('./data/points_helper');

module.exports.config = {
  name: "متجر",
  version: "2.0.0",
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
    `🏪 سوق الملاك الكريستالي\n` +
    `━━━━━━━━━━━━━━━\n` +
    `💳 نقاطك: ${points} نقطة\n\n` +
    `📦 المنتجات المتاحة:\n\n` +
    `🔑 صلاحية ادمن البوت — 100 نقطة\n` +
    `   تحكم كامل بأوامر البوت في الكروب\n` +
    `   → "شراء صلاحية\n\n` +
    `👑 تاج ملكي — 50 نقطة\n` +
    `   كنية مميزة: 👑 ملك الكروب\n` +
    `   → "شراء تاج\n\n` +
    `💎 لقب VIP — 80 نقطة\n` +
    `   كنية مميزة: 💎 VIP\n` +
    `   → "شراء vip\n\n` +
    `⭐ لقب نجم — 60 نقطة\n` +
    `   كنية مميزة: ⭐ نجم الكروب\n` +
    `   → "شراء نجم\n\n` +
    `🌹 لقب محبوب — 40 نقطة\n` +
    `   كنية مميزة: 🌹 محبوب الكروب\n` +
    `   → "شراء محبوب\n\n` +
    `🔥 لقب اسطوري — 120 نقطة\n` +
    `   كنية مميزة: 🔥 الاسطوري\n` +
    `   → "شراء اسطوري\n\n` +
    `━━━━━━━━━━━━━━━\n` +
    `💡 كيف تجمع نقاط؟\n` +
    `❓ "سؤال → +5 نقاط\n` +
    `🧩 "لغز → +4 نقاط\n` +
    `🎮 "تحدي | "خامن | "حرف → +3 نقاط\n` +
    `🎡 "عجلة → نقاط عشوائية!\n` +
    `🔤 "تجميع | "تفكيك → +1 نقطة`,
    threadID,
    messageID
  );
};
