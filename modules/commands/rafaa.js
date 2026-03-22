module.exports.config = {
  name: "رفع",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "كاڪو",
  description: "ترقية عضو لادمن في الكروب",
  commandCategory: "الملاك",
  usages: "رفع [ID] | رفع (رد على رسالة)",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, messageReply } = event;

  let targetID = args[0];

  if (!targetID && messageReply) {
    targetID = messageReply.senderID;
  }

  if (!targetID) {
    return api.sendMessage(
      `⚠️ الاستخدام:\n"رفع [ID] — ترقية عضو\nأو ارد على رسالته واكتب "رفع`,
      threadID,
      messageID
    );
  }

  try {
    let targetName = targetID;
    try {
      const info = await api.getUserInfo(targetID);
      targetName = info[targetID]?.name || targetID;
    } catch {}

    await api.changeAdminStatus(threadID, targetID, true);

    return api.sendMessage(
      `👑 تمت الترقية\n` +
      `━━━━━━━━━━━━━━━\n` +
      `✅ ${targetName} أصبح ادمن في الكروب`,
      threadID,
      messageID
    );
  } catch (err) {
    return api.sendMessage("❌ فشل الترقية، تأكد أن البوت ادمن في الكروب", threadID, messageID);
  }
};
