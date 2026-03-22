module.exports.config = {
  name: "اعادة",
  version: "1.0.0",
  hasPermssion: 3,
  credits: "كاڪو",
  description: "إعادة تشغيل البوت",
  commandCategory: "الملاك",
  usages: "اعادة",
  cooldowns: 10
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;
  await api.sendMessage(
    `🔄 جاري إعادة تشغيل البوت...\n⏳ انتظر بضع ثوانٍ`,
    threadID,
    messageID
  );
  setTimeout(() => process.exit(0), 2000);
};
