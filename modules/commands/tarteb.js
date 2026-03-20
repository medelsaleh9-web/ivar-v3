const { getState } = require('./data/points_helper');

module.exports.config = {
  name: "ترتيب",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "سونغ",
  description: "عرض قائمة المتصدرين بالنقاط",
  commandCategory: "الملاك",
  usages: "ترتيب",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  const state = getState();
  const points = state.points || {};

  const sorted = Object.entries(points)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  if (sorted.length === 0) {
    return api.sendMessage("📊 لا توجد نقاط بعد! العب ألعاب البوت لتجمع نقاط 🎮", threadID, messageID);
  }

  const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

  let lines = [];
  for (let i = 0; i < sorted.length; i++) {
    const [uid, pts] = sorted[i];
    let name = uid;
    try {
      const info = await api.getUserInfo(uid);
      name = info[uid]?.name || uid;
    } catch {}
    lines.push(`${medals[i]} ${name} — ${pts} نقطة`);
  }

  return api.sendMessage(
    `🏆 قائمة المتصدرين\n` +
    `━━━━━━━━━━━━━━━\n` +
    lines.join("\n") +
    `\n━━━━━━━━━━━━━━━\n` +
    `🎮 العب "سؤال | "تجميع | "تفكيك لتجمع نقاط!`,
    threadID,
    messageID
  );
};
