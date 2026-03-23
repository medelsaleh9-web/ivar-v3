module.exports.config = {
  name: "كراشي",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "كاڪو",
  description: "يحزر كراشك من أعضاء الكروب",
  commandCategory: "ترفيه",
  usages: "كراشي",
  cooldowns: 10
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, senderID } = event;

  let threadInfo;
  try {
    threadInfo = await api.getThreadInfo(threadID);
  } catch {
    return api.sendMessage("❌ فشل في جلب معلومات الكروب!", threadID, messageID);
  }

  const botID = String(api.getCurrentUserID());
  const members = (threadInfo.participantIDs || []).filter(
    id => String(id) !== botID && String(id) !== String(senderID)
  );

  if (members.length === 0) {
    return api.sendMessage("😅 ما في أحد في الكروب يصلح كراش!", threadID, messageID);
  }

  const randomID = members[Math.floor(Math.random() * members.length)];

  let crushName = "شخص غامض";
  try {
    const info = await api.getUserInfo(randomID);
    crushName = info[randomID]?.name || crushName;
  } catch {}

  const msgs = [
    `💘 القاضي كاكو حكم!\nكراشك هو/هي: @${crushName} 😏🔥`,
    `🐦‍⬛ الغراب شاف في عيونك...\nكراشك السري هو/هي: @${crushName} 💋`,
    `👀 ما تكذب على نفسك!\nكراشك هو/هي: @${crushName} 😂❤️`,
    `💀 انكشف السر!\nكراشك هو/هي: @${crushName} 🫵😈`,
    `🎯 الغراب ما يخطئ!\nكراشك هو/هي: @${crushName} 🖤🔥`,
  ];

  const msg = msgs[Math.floor(Math.random() * msgs.length)];

  return api.sendMessage(
    {
      body: msg,
      mentions: [{ tag: `@${crushName}`, id: randomID }]
    },
    threadID,
    messageID
  );
};
