module.exports.config = {
  name: "طرد",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "سونغ",
  description: "طرد عضو من الكروب بالـ ID",
  commandCategory: "الملاك",
  usages: "طرد [ID]",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const uid = args[0];

  if (!uid) return api.sendMessage("يرجى كتابة ID العضو المراد طرده!", threadID, messageID);

  try {
    await api.removeUserFromGroup(uid, threadID);
    return api.sendMessage(`✅ تم طرد العضو ${uid}`, threadID, messageID);
  } catch (e) {
    return api.sendMessage(`❌ فشل الطرد: ${e.message}`, threadID, messageID);
  }
};
