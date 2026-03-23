module.exports.config = {
  name: "الغربان",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "كاڪو",
  description: "تغيير كنيات جميع أعضاء الكروب إلى الغربان",
  commandCategory: "الملاك",
  usages: "الغربان",
  cooldowns: 10
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  let threadInfo;
  try {
    threadInfo = await api.getThreadInfo(threadID);
  } catch {
    return api.sendMessage("❌ فشل في جلب معلومات الكروب!", threadID, messageID);
  }

  const botID = String(api.getCurrentUserID());
  const members = threadInfo.participantIDs || [];
  const nickname = "الغربان تزني المكان🐦‍⬛🇦🇱";

  await api.sendMessage("🐦‍⬛ جاري تغيير كنيات الأعضاء...", threadID, messageID);

  let success = 0;
  let failed = 0;

  for (const uid of members) {
    if (String(uid) === botID) continue;
    try {
      await api.changeNickname(nickname, threadID, uid);
      success++;
      await new Promise(r => setTimeout(r, 500));
    } catch {
      failed++;
    }
  }

  return api.sendMessage(
    `🐦‍⬛🇦🇱 تم تغيير الكنيات\n` +
    `━━━━━━━━━━━━━━━\n` +
    `✅ تم: ${success} عضو\n` +
    `❌ فشل: ${failed} عضو`,
    threadID,
    messageID
  );
};
