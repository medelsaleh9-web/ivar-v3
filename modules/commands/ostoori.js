module.exports.config = {
  name: "الاسطوري",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "سونغ",
  description: "عرض مدة تشغيل البوت",
  commandCategory: "الملاك",
  usages: "الاسطوري",
  cooldowns: 3
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  const uptimeSeconds = process.uptime();
  const days = Math.floor(uptimeSeconds / 86400);
  const hours = Math.floor((uptimeSeconds % 86400) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);

  const startTime = new Date(Date.now() - uptimeSeconds * 1000);
  const startStr = startTime.toLocaleString("ar-SA", { timeZone: "Asia/Riyadh" });

  return api.sendMessage(
    `⚡ وقت تشغيل البوت\n` +
    `━━━━━━━━━━━━━━━\n` +
    `🤖 البوت: ${global.config.BOTNAME || "الملاك"}\n` +
    `⏱️ مدة التشغيل:\n` +
    `   ${days} يوم | ${hours} ساعة | ${minutes} دقيقة | ${seconds} ثانية\n` +
    `🕐 بدأ التشغيل:\n   ${startStr}`,
    threadID,
    messageID
  );
};
