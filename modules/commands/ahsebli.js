module.exports.config = {
  name: "احسبلي",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "كاڪو",
  description: "آلة حاسبة بسيطة",
  commandCategory: "الملاك",
  usages: "احسبلي [عملية حسابية]",
  cooldowns: 2
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  if (!args[0]) {
    return api.sendMessage(
      `🔢 آلة حاسبة\n` +
      `━━━━━━━━━━━━━━━\n` +
      `الاستخدام: "احسبلي [عملية]\n` +
      `مثال: "احسبلي 5 + 3\n` +
      `مثال: "احسبلي 100 * 7\n` +
      `العمليات: + - * /`,
      threadID,
      messageID
    );
  }

  const expression = args.join(" ").replace(/[^0-9+\-*/().، ]/g, "").replace(/،/g, ".");

  try {
    const result = Function('"use strict"; return (' + expression + ')')();
    if (!isFinite(result)) {
      return api.sendMessage("❌ لا يمكن القسمة على صفر!", threadID, messageID);
    }
    return api.sendMessage(
      `🔢 الحساب\n` +
      `━━━━━━━━━━━━━━━\n` +
      `${expression} = ${result}`,
      threadID,
      messageID
    );
  } catch (e) {
    return api.sendMessage("❌ عملية غير صحيحة!\nمثال: \"احسبلي 5 + 3", threadID, messageID);
  }
};
