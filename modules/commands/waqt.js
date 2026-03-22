module.exports.config = {
  name: "وقت",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "كاڪو",
  description: "عرض الوقت والتاريخ الحالي",
  commandCategory: "الملاك",
  usages: "وقت",
  cooldowns: 3
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  const now = new Date();

  const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  const months = [
    "يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];

  const dayName = days[now.getDay()];
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return api.sendMessage(
    `🕐 الوقت والتاريخ\n` +
    `━━━━━━━━━━━━━━━\n` +
    `📅 ${dayName}، ${day} ${month} ${year}\n` +
    `⏰ ${hours}:${minutes}:${seconds}`,
    threadID,
    messageID
  );
};
