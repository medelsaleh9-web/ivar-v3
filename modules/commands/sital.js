module.exports.config = {
  name: "سيتال",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "سونغ",
  description: "تغيير كنية الجميع أو إزالتها",
  commandCategory: "الملاك",
  usages: "سيتال [اسم] | سيتال ازالة",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const sub = args[0];

  const threadInfo = await api.getThreadInfo(threadID);
  const members = threadInfo.participantIDs;

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  if (sub === "ازالة") {
    await api.sendMessage("🔄 جاري إزالة كنيات الجميع...", threadID, messageID);
    for (const uid of members) {
      await delay(150);
      api.changeNickname("", threadID, uid).catch(() => {});
    }
    return api.sendMessage("✅ تم إزالة كنيات جميع الأعضاء", threadID);
  }

  const name = args.join(" ");
  if (!name) return api.sendMessage("⚠️ اكتب الاسم المراد تعيينه للجميع\nمثال: سيتال ملاك", threadID, messageID);

  await api.sendMessage(`🔄 جاري تعيين كنية "${name}" للجميع...`, threadID, messageID);
  for (const uid of members) {
    await delay(150);
    api.changeNickname(name, threadID, uid).catch(() => {});
  }
  return api.sendMessage(`✅ تم تعيين كنية "${name}" لجميع الأعضاء`, threadID);
};
