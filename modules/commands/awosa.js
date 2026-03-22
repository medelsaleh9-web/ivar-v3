module.exports.config = {
  name: "انوسة",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "كاڪو",
  description: "رد على من يقول انوسة",
  commandCategory: "الملاك",
  usages: "انوسة",
  cooldowns: 3
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;
  await api.sendMessage("ڪﮱﮱﮱ۾ﻜ احترم عمك", threadID, messageID);
};
