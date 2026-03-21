module.exports.config = {
  name: "تفاعل",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "سونغ",
  description: "يتفاعل مع رسالة عن طريق الرد عليها",
  commandCategory: "الملاك",
  usages: "تفاعل [نوع التفاعل] (رد على رسالة)",
  cooldowns: 2
};

const reactions = {
  "باضحكني":   "😂",
  "بحبيني":    "❤️",
  "بدهشني":    "😮",
  "بحزنني":    "😢",
  "بغضبني":    "😡",
  "بتعجبني":   "👍",
  "بتسيني":    "👎",
  "بيكوني":    "🎉",
  "بالتاج":    "👑",
  "بنار":      "🔥",
  "بقلب":      "❤️",
  "بضحكة":     "😂",
  "بدموع":     "😢",
  "بزعل":      "😡"
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, messageReply } = event;

  const reactionKey = args[0];

  if (!reactionKey) {
    const list = Object.entries(reactions)
      .map(([k, v]) => `• تفاعل ${k} ← ${v}`)
      .join("\n");
    return api.sendMessage(
      `📋 أنواع التفاعلات المتاحة:\n${list}\n\n💡 الاستخدام: رد على رسالة واكتب\nتفاعل [نوع]`,
      threadID,
      messageID
    );
  }

  const emoji = reactions[reactionKey];

  if (!emoji) {
    return api.sendMessage(
      `❌ نوع التفاعل غير معروف!\nاكتب "تفاعل" لعرض الأنواع المتاحة.`,
      threadID,
      messageID
    );
  }

  if (!messageReply) {
    return api.sendMessage(
      `⚠️ ارد على رسالة ثم اكتب:\nتفاعل ${reactionKey}`,
      threadID,
      messageID
    );
  }

  try {
    await api.setMessageReaction(emoji, messageReply.messageID, () => {}, true);
  } catch (err) {
    return api.sendMessage("❌ فشل التفاعل مع الرسالة", threadID, messageID);
  }
};
