const fs = require("fs-extra");
const path = require("path");
const statePath = path.join(__dirname, "data/malakState.json");

function getState() {
  try { return JSON.parse(fs.readFileSync(statePath, "utf-8")); }
  catch { return {}; }
}
function saveState(s) {
  fs.writeFileSync(statePath, JSON.stringify(s, null, 2));
}

module.exports.config = {
  name: "حظر",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "كاڪو",
  description: "حظر عضو من استخدام البوت في الكروب",
  commandCategory: "الملاك",
  usages: "حظر (رد على رسالة) | حظر [ID]",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, messageReply, senderID } = event;
  const botID = api.getCurrentUserID();
  const ADMINBOT = global.config.ADMINBOT || [];

  let targetID = args[0];
  if (!targetID && messageReply) targetID = messageReply.senderID;

  if (!targetID) {
    return api.sendMessage(
      `⚠️ الاستخدام:\n"حظر [ID] أو ارد على رسالته واكتب "حظر`,
      threadID,
      messageID
    );
  }

  if (targetID === botID || ADMINBOT.includes(targetID)) {
    return api.sendMessage("❌ لا يمكن حظر ادمن البوت!", threadID, messageID);
  }

  if (targetID === senderID) {
    return api.sendMessage("😅 لا يمكنك حظر نفسك!", threadID, messageID);
  }

  const state = getState();
  if (!state.bannedUsers) state.bannedUsers = {};
  if (!state.bannedUsers[threadID]) state.bannedUsers[threadID] = [];

  if (state.bannedUsers[threadID].includes(targetID)) {
    return api.sendMessage(`⚠️ هذا العضو محظور بالفعل!`, threadID, messageID);
  }

  let targetName = targetID;
  try {
    const info = await api.getUserInfo(targetID);
    targetName = info[targetID]?.name || targetID;
  } catch {}

  state.bannedUsers[threadID].push(targetID);
  saveState(state);

  return api.sendMessage(
    `🚫 تم الحظر\n` +
    `━━━━━━━━━━━━━━━\n` +
    `👤 ${targetName}\n` +
    `❌ محظور من استخدام البوت في هذا الكروب`,
    threadID,
    messageID
  );
};
