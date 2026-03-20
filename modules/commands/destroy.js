module.exports.config = {
  name: "تدمير",
  version: "2.0.0",
  hasPermssion: 1,
  credits: "سونغ",
  description: "تدمير: طرد كل الأعضاء | تدمير النضام: إيقاف البوت",
  commandCategory: "الملاك",
  usages: "تدمير | تدمير النضام",
  cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, senderID, messageID } = event;
  const ADMINBOT = global.config.ADMINBOT || [];

  if (args[0] === "النضام") {
    if (!ADMINBOT.includes(senderID)) {
      return api.sendMessage("❌ هذا الأمر للمطور فقط!", threadID, messageID);
    }
    await api.sendMessage(
      `💀 تدمير النضام...\n` +
      `━━━━━━━━━━━━━━━\n` +
      `🔴 البوت يُغلق الآن بأمر الملك\n` +
      `وداعاً.. 🪽`,
      threadID,
      messageID
    );
    setTimeout(() => process.exit(0), 2000);
    return;
  }

  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const { participantIDs, adminIDs } = threadInfo;
    const botID = api.getCurrentUserID();
    const adminIDsList = adminIDs.map(a => a.id);

    await api.sendMessage("💥 جاري التدمير...", threadID);

    const toRemove = participantIDs.filter(id => {
      return id !== botID && !adminIDsList.includes(id) && id !== senderID;
    });

    for (const uid of toRemove) {
      try {
        await api.removeUserFromGroup(uid, threadID);
        await new Promise(r => setTimeout(r, 300));
      } catch {}
    }

    return api.sendMessage("✅ تم التدمير — تمت إزالة كل الأعضاء 💀", threadID);
  } catch (e) {
    return api.sendMessage("❌ خطأ: " + e.message, threadID);
  }
};
