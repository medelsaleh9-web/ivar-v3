module.exports.config = {
  name: "حذف",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "كاڪو",
  description: "حذف رسالة البوت عند الرد عليها",
  commandCategory: "الملاك",
  usages: "حذف (رد على رسالة البوت)",
  cooldowns: 3
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, messageReply } = event;

  if (!messageReply) {
    return api.sendMessage("⚠️ يجب الرد على رسالة لحذفها", threadID, messageID);
  }

  const botID = api.getCurrentUserID();

  if (messageReply.senderID !== botID) {
    return api.sendMessage("⚠️ يمكن حذف رسائل البوت فقط", threadID, messageID);
  }

  try {
    await api.unsendMessage(messageReply.messageID);
    api.unsendMessage(messageID).catch(() => {});
  } catch {
    api.sendMessage("❌ تعذّر حذف الرسالة", threadID, messageID);
  }
};
