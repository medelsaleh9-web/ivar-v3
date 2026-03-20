if (!global.adminCache) global.adminCache = {};

module.exports.config = {
  name: "adminReact",
  eventType: ["message"],
  version: "1.0.0",
  credits: "سونغ",
  description: "يتفاعل مع رسائل الادمن بـ 👑"
};

module.exports.run = async function ({ api, event }) {
  const { threadID, senderID, messageID } = event;
  if (!event.body) return;

  try {
    if (!global.adminCache[threadID] || (Date.now() - (global.adminCache[threadID].time || 0)) > 120000) {
      const info = await api.getThreadInfo(threadID);
      const adminIDs = (info.adminIDs || []).map(a => String(a.uid || a));
      global.adminCache[threadID] = { admins: adminIDs, time: Date.now() };
    }

    const isAdmin = global.adminCache[threadID].admins.includes(String(senderID));
    if (isAdmin) {
      await api.setMessageReaction("👑", messageID, () => {}, true);
    }
  } catch {}
};
