module.exports.config = {
  name: "تبليغ",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "سونغ",
  description: "يبلغ على عضو أو رسالة عند الرد عليها",
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
  const targetMsgID = messageReply.messageID;

  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const admins = threadInfo.adminIDs.map(a => a.uid);

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

    await api.unsendMessage(targetMsgID).catch(() => {});

    const alertMsg = `🚨 تبليغ جديد 🚨\n\n👤 المُبلَّغ عنه: ${targetName}\n📢 المُبلِّغ: ${reporterName}\n\n✅ تم حذف الرسالة المبلَّغ عنها`;

    for (const adminID of admins) {
      api.sendMessage(alertMsg, adminID).catch(() => {});
    }

    return api.sendMessage(
      `✅ تم التبليغ على ${targetName} وإبلاغ إداريي الكروب`,
      threadID,
      messageID
    );
  } catch (err) {
    return api.sendMessage("❌ فشل التبليغ، تأكد أن البوت أدمن في الكروب", threadID, messageID);
  }
};
