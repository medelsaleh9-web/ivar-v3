const fs = require('fs');
const path = require('path');
const statePath = path.join(__dirname, 'data/malakState.json');

function getState() {
  try { return JSON.parse(fs.readFileSync(statePath, 'utf-8')); }
  catch { return {}; }
}
function saveState(s) {
  fs.writeFileSync(statePath, JSON.stringify(s, null, 2));
}

module.exports.config = {
  name: "حضر",
  version: "1.0.0",
  hasPermssion: 3,
  credits: "كاڪو",
  description: "حظر عضو من حساب البوت — طرد + حظر شامل من كل الكروبات",
  commandCategory: "الملاك",
  usages: "حضر (رد) | حضر [ID]",
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
      `⚠️ الاستخدام:\n"حضر [ID] أو ارد على رسالته`,
      threadID,
      messageID
    );
  }

  targetID = String(targetID);

  if (targetID === botID || ADMINBOT.includes(targetID)) {
    return api.sendMessage("❌ لا يمكن حظر ادمن البوت!", threadID, messageID);
  }

  let targetName = targetID;
  try {
    const info = await api.getUserInfo(targetID);
    targetName = info[targetID]?.name || targetID;
  } catch {}

  const state = getState();

  if (!state.globalBanned) state.globalBanned = [];
  if (!state.globalBanned.includes(targetID)) {
    state.globalBanned.push(targetID);
  }

  if (!state.bannedUsers) state.bannedUsers = {};
  for (const tid of Object.keys(state.bannedUsers || {})) {
    if (!state.bannedUsers[tid].includes(targetID)) {
      state.bannedUsers[tid].push(targetID);
    }
  }
  if (!state.bannedUsers[threadID]) state.bannedUsers[threadID] = [];
  if (!state.bannedUsers[threadID].includes(targetID)) {
    state.bannedUsers[threadID].push(targetID);
  }

  saveState(state);

  try {
    await api.removeUserFromGroup(targetID, threadID);
  } catch {}

  return api.sendMessage(
    `🚫 تم الحضر الشامل\n` +
    `━━━━━━━━━━━━━━━\n` +
    `👤 ${targetName}\n` +
    `❌ محظور من حساب البوت في كل الكروبات\n` +
    `💀 تم طرده من هذا الكروب`,
    threadID,
    messageID
  );
};
