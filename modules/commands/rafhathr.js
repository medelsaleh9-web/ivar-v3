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
  name: "رفع حظر",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "كاڪو",
  description: "رفع حظر عضو وإعادة صلاحية استخدام البوت",
  commandCategory: "الملاك",
  usages: "رفع حظر (رد على رسالة) | رفع حظر [ID]",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, messageReply } = event;

  let targetID = args[0];
  if (!targetID && messageReply) targetID = messageReply.senderID;

  if (!targetID) {
    return api.sendMessage(
      `⚠️ الاستخدام:\n"رفع حظر [ID] أو ارد على رسالته`,
      threadID,
      messageID
    );
  }

  const state = getState();
  if (!state.bannedUsers) state.bannedUsers = {};
  if (!state.bannedUsers[threadID]) state.bannedUsers[threadID] = [];

  if (!state.bannedUsers[threadID].includes(targetID)) {
    return api.sendMessage(`⚠️ هذا العضو غير محظور!`, threadID, messageID);
  }

  let targetName = targetID;
  try {
    const info = await api.getUserInfo(targetID);
    targetName = info[targetID]?.name || targetID;
  } catch {}

  state.bannedUsers[threadID] = state.bannedUsers[threadID].filter(id => id !== targetID);
  saveState(state);

  return api.sendMessage(
    `✅ تم رفع الحظر\n` +
    `━━━━━━━━━━━━━━━\n` +
    `👤 ${targetName}\n` +
    `✅ يستطيع الآن استخدام البوت مجدداً`,
    threadID,
    messageID
  );
};
