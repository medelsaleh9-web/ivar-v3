module.exports.config = {
  name: "معلومات",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "كاڪو",
  description: "عرض معلومات الكروب الحالي",
  commandCategory: "الملاك",
  usages: "معلومات",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  try {
    const info = await api.getThreadInfo(threadID);
    const admins = info.adminIDs || [];
    const members = info.participantIDs || [];

    const adminList = [];
    for (const a of admins.slice(0, 5)) {
      try {
        const u = await api.getUserInfo(a.uid);
        adminList.push(u[a.uid]?.name || a.uid);
      } catch {
        adminList.push(a.uid);
      }
    }

    const msg =
      `📊 معلومات الكروب\n` +
      `━━━━━━━━━━━━━━━\n` +
      `📌 الاسم: ${info.threadName || "بدون اسم"}\n` +
      `🆔 ID: ${threadID}\n` +
      `👥 عدد الأعضاء: ${members.length}\n` +
      `👑 الادمن: ${admins.length}\n` +
      `━━━━━━━━━━━━━━━\n` +
      `🛡️ الادمن:\n${adminList.map(n => `  • ${n}`).join("\n") || "  لا يوجد"}`;

    return api.sendMessage(msg, threadID, messageID);
  } catch (err) {
    return api.sendMessage("❌ فشل جلب معلومات الكروب", threadID, messageID);
  }
};
