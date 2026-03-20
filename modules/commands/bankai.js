if (!global.bankaiIntervals) global.bankaiIntervals = {};

module.exports.config = {
  name: "بانكاي",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "سونغ",
  description: "يزيل ويضيف العضو كل 4 ثواني بدون توقف",
  commandCategory: "الملاك",
  usages: "بانكاي [ID] | بانكاي توقف",
  cooldowns: 0
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const sub = args[0];

  if (sub === "توقف") {
    if (global.bankaiIntervals[threadID]) {
      clearInterval(global.bankaiIntervals[threadID]);
      delete global.bankaiIntervals[threadID];
      return api.sendMessage("✅ تم إيقاف البانكاي", threadID, messageID);
    } else {
      return api.sendMessage("لا يوجد بانكاي نشط!", threadID, messageID);
    }
  }

  const uid = sub;
  if (!uid) return api.sendMessage("يرجى كتابة ID العضو!", threadID, messageID);

  if (global.bankaiIntervals[threadID]) {
    return api.sendMessage("البانكاي نشط بالفعل! قل بانكاي توقف أولاً.", threadID, messageID);
  }

  await api.sendMessage(`💥 تم تفعيل البانكاي على ${uid}`, threadID, messageID);

  global.bankaiIntervals[threadID] = setInterval(async () => {
    try {
      await api.removeUserFromGroup(uid, threadID);
    } catch {}
    await new Promise(r => setTimeout(r, 1000));
    try {
      await api.addUserToGroup(uid, threadID);
    } catch {}
  }, 4000);
};
