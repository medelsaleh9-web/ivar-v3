const { addPoints } = require('./data/points_helper');

const prizes = [
  { label: "💀 خسرت كل شيء!", points: 0 },
  { label: "😢 لا شيء هذه المرة", points: 0 },
  { label: "🎁 +1 نقطة صغيرة", points: 1 },
  { label: "⭐ +2 نقطة", points: 2 },
  { label: "🌟 +3 نقاط", points: 3 },
  { label: "💎 +5 نقاط!", points: 5 },
  { label: "👑 +8 نقاط — جائزة ملكية!", points: 8 },
  { label: "🔥 +2 نقطة", points: 2 },
  { label: "✨ +1 نقطة", points: 1 },
  { label: "🎯 +4 نقاط", points: 4 }
];

module.exports.config = {
  name: "عجلة",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "سونغ",
  description: "عجلة الحظ — اربح نقاط عشوائية",
  commandCategory: "الملاك",
  usages: "عجلة",
  cooldowns: 10
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, senderID } = event;

  let name = senderID;
  try {
    const info = await api.getUserInfo(senderID);
    name = info[senderID]?.name || senderID;
  } catch {}

  await api.sendMessage(
    `🎡 عجلة الحظ تدور...\n━━━━━━━━━━━━━━━\n🔄 ${name} يدور العجلة...\n⏳ انتظر!`,
    threadID,
    messageID
  );

  await new Promise(r => setTimeout(r, 2000));

  const prize = prizes[Math.floor(Math.random() * prizes.length)];
  let total = 0;
  if (prize.points > 0) {
    total = addPoints(senderID, prize.points);
  }

  return api.sendMessage(
    `🎡 نتيجة العجلة\n` +
    `━━━━━━━━━━━━━━━\n` +
    `👤 ${name}\n` +
    `${prize.label}\n` +
    (prize.points > 0 ? `🏅 مجموع نقاطك: ${total} نقطة` : `💡 جرب مرة أخرى!`),
    threadID
  );
};
