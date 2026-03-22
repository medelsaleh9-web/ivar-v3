module.exports.config = {
  name: "بينق",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "كاڪو",
  description: "قياس سرعة استجابة البوت",
  commandCategory: "الملاك",
  usages: "بينق",
  cooldowns: 3
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;
  const start = Date.now();
  await api.sendMessage(
    `🏓 Pong!\n⚡ سرعة الاستجابة: ${Date.now() - start} ms\n🤖 البوت: ${global.config.BOTNAME || "الملاك"}\n✅ يعمل بشكل طبيعي`,
    threadID,
    messageID
  );
};
