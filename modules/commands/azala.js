module.exports.config = {
  name: "ازالة",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "سونغ",
  description: "إزالة كنيات جميع أعضاء الكروب",
  commandCategory: "الملاك",
  usages: "ازالة كنيات",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const sub = args[0];

  if (sub !== "كنيات") {
    return api.sendMessage(
      `📋 استخدام الأمر:\n"ازالة كنيات — إزالة كنيات جميع الأعضاء`,
      threadID,
      messageID
    );
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  await api.sendMessage("🔄 جاري إزالة كنيات الجميع...", threadID, messageID);

  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const members = threadInfo.participantIDs;

    for (const uid of members) {
      await delay(200);
      await api.changeNickname("", threadID, uid).catch(() => {});
    }

    return api.sendMessage("✅ تم إزالة كنيات جميع الأعضاء بنجاح", threadID);
  } catch (err) {
    return api.sendMessage("❌ حدث خطأ أثناء إزالة الكنيات", threadID, messageID);
  }
};
