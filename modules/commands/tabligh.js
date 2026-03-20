module.exports.config = {
  name: "تبليغ",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "سونغ",
  description: "يبلغ على عضو عند الرد على رسالته",
  commandCategory: "الملاك",
  usages: "تبليغ (رد على رسالة)",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, messageReply, senderID } = event;

  if (!messageReply) {
    return api.sendMessage("⚠️ يجب الرد على رسالة لتبليغ عنها", threadID, messageID);
  }

  const targetID = messageReply.senderID;

  try {
    let targetName = targetID;
    try {
      const userInfo = await api.getUserInfo(targetID);
      targetName = userInfo[targetID]?.name || targetID;
    } catch {}

    let reporterName = senderID;
    try {
      const repInfo = await api.getUserInfo(senderID);
      reporterName = repInfo[senderID]?.name || senderID;
    } catch {}

    const alertMsg =
      `🚨 تبليغ جديد 🚨\n` +
      `━━━━━━━━━━━━━━━\n` +
      `👤 المُبلَّغ عنه: ${targetName}\n` +
      `📢 المُبلِّغ: ${reporterName}\n` +
      `━━━━━━━━━━━━━━━\n` +
      `⚠️ يرجى مراجعة الرسالة المبلَّغ عنها`;

    return api.sendMessage(alertMsg, threadID, messageID);
  } catch (err) {
    return api.sendMessage("❌ فشل التبليغ، حاول مرة أخرى", threadID, messageID);
  }
};
