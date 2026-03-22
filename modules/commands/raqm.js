module.exports.config = {
  name: "رقم",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "كاڪو",
  description: "توليد رقم عشوائي بين رقمين",
  commandCategory: "الملاك",
  usages: "رقم [من] [إلى]",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  let min = 1;
  let max = 100;

  if (args[0] && args[1]) {
    min = parseInt(args[0]);
    max = parseInt(args[1]);
    if (isNaN(min) || isNaN(max)) {
      return api.sendMessage("❌ أدخل أرقاماً صحيحة!\nمثال: \"رقم 1 100", threadID, messageID);
    }
    if (min > max) [min, max] = [max, min];
  } else if (args[0]) {
    max = parseInt(args[0]);
    if (isNaN(max)) {
      return api.sendMessage("❌ أدخل رقماً صحيحاً!\nمثال: \"رقم 50", threadID, messageID);
    }
  }

  const result = Math.floor(Math.random() * (max - min + 1)) + min;

  return api.sendMessage(
    `🎲 رقم عشوائي\n` +
    `━━━━━━━━━━━━━━━\n` +
    `من ${min} إلى ${max}\n` +
    `🔢 النتيجة: ${result}`,
    threadID,
    messageID
  );
};
