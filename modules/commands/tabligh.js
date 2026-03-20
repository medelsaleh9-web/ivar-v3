module.exports.config = {
  name: "تبليغ",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "سونغ",
  description: "يبلغ على صاحب الرسالة عند الرد عليها",
  commandCategory: "الملاك",
  usages: "تبليغ (رد على رسالة الشخص)",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, messageReply, senderID } = event;

  if (!messageReply) {
    return api.sendMessage(
      `⚠️ الاستخدام الصحيح:\nارد على رسالة الشخص واكتب: "تبليغ`,
      threadID,
      messageID
    );
  }

  const targetID = messageReply.senderID;
  const botID = api.getCurrentUserID();

  if (targetID === botID) {
    return api.sendMessage("😅 لا يمكنك التبليغ على البوت!", threadID, messageID);
  }

  if (targetID === senderID) {
    return api.sendMessage("🤔 لا يمكنك التبليغ على نفسك!", threadID, messageID);
  }

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
      `🆔 ID: ${targetID}\n` +
      `📢 المُبلِّغ: ${reporterName}\n` +
      `━━━━━━━━━━━━━━━\n` +
      `⚠️ يرجى مراجعة رسالته أعلاه`;

    return api.sendMessage(alertMsg, threadID, messageID);
  } catch (err) {
    return api.sendMessage("❌ فشل التبليغ، حاول مرة أخرى", threadID, messageID);
  }
};
