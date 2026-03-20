const axios = require("axios");

module.exports.config = {
  name: "تبليغ",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "سونغ",
  description: "يبلغ على رسالة عند الرد عليها",
  commandCategory: "الملاك",
  usages: "تبليغ (رد على رسالة)",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, messageReply } = event;

  if (!messageReply) {
    return api.sendMessage("⚠️ يجب الرد على رسالة لتبليغ عنها", threadID, messageID);
  }

  try {
    const ctx = api.getCurrentUserID && api.getCurrentUserID();
    const msgID = messageReply.messageID;

    await api.unsendMessage(msgID).catch(() => {});

    await api.sendMessage(
      `✅ تم التبليغ على الرسالة وحذفها بنجاح\n📌 ID: ${msgID}`,
      threadID,
      messageID
    );
  } catch (err) {
    await api.sendMessage("❌ فشل التبليغ، تأكد أن البوت أدمن في الكروب", threadID, messageID);
  }
};
