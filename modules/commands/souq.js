const { getPoints } = require('./data/points_helper');

module.exports.config = {
  name: "سوق",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "سونغ",
  description: "عرض أسعار منتجات سوق الملاك",
  commandCategory: "الملاك",
  usages: "سوق",
  cooldowns: 3
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, senderID } = event;
  const points = getPoints(senderID);

  return api.sendMessage(
    `🏪 سوق الملاك الكريستالي\n` +
    `━━━━━━━━━━━━━━━\n` +
    `💳 رصيدك: ${points} نقطة\n\n` +
    `🛒 قائمة الأسعار:\n\n` +
    `┌──────────────────┐\n` +
    `│ 🔑 صلاحية ادمن   100 نقطة\n` +
    `│ 🔥 لقب اسطوري    120 نقطة\n` +
    `│ 💎 لقب VIP        80 نقطة\n` +
    `│ ⭐ لقب نجم        60 نقطة\n` +
    `│ 👑 تاج ملكي       50 نقطة\n` +
    `│ 🌹 لقب محبوب      40 نقطة\n` +
    `└──────────────────┘\n\n` +
    `💡 للشراء: "شراء [اسم المنتج]\n` +
    `مثال: "شراء تاج\n\n` +
    `━━━━━━━━━━━━━━━\n` +
    `🎮 اجمع نقاطك من الألعاب:\n` +
    `❓ سؤال +5 | 🧩 لغز +4\n` +
    `🎮 تحدي/خامن/حرف +3\n` +
    `🎡 عجلة الحظ (عشوائي!)`,
    threadID,
    messageID
  );
};
