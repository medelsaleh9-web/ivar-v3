module.exports.config = {
  name: "ملاك",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "كاڪو",
  description: "يرسل معرّف الكروب",
  commandCategory: "الملاك",
  usages: "ملاك",
  cooldowns: 3
};

module.exports.run = async function ({ api, event }) {
  const { threadID } = event;
  return api.sendMessage(
    `🪽 معرّف الكروب:\n👑 ${threadID}`,
    threadID
  );
};
