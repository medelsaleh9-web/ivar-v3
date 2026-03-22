module.exports.config = {
  name: "عضو",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "كاڪو",
  description: "عرض معلومات عضو عند الرد على رسالته أو بالـ ID",
  commandCategory: "الملاك",
  usages: "عضو (رد على رسالة) | عضو [ID]",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, messageReply } = event;

  let targetID = args[0];
  if (!targetID && messageReply) targetID = messageReply.senderID;
  if (!targetID) targetID = event.senderID;

  try {
    const userInfo = await api.getUserInfo(targetID);
    const user = userInfo[targetID];

    if (!user) return api.sendMessage("❌ لم أجد معلومات هذا المستخدم", threadID, messageID);

    const threadInfo = await api.getThreadInfo(threadID);
    const isAdmin = threadInfo.adminIDs.some(a => a.uid === targetID);

    const msg =
      `👤 معلومات العضو\n` +
      `━━━━━━━━━━━━━━━\n` +
      `📛 الاسم: ${user.name || "غير معروف"}\n` +
      `🆔 ID: ${targetID}\n` +
      `🔗 الرابط: facebook.com/${user.vanity || targetID}\n` +
      `👑 ادمن: ${isAdmin ? "✅ نعم" : "❌ لا"}`;

    return api.sendMessage(msg, threadID, messageID);
  } catch (err) {
    return api.sendMessage("❌ فشل جلب معلومات العضو", threadID, messageID);
  }
};
