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
  name: "تحذير",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "سونغ",
  description: "إعطاء تحذير لعضو — عند 3 تحذيرات يُطرد تلقائياً",
  commandCategory: "الملاك",
  usages: "تحذير (رد على رسالة) | تحذير [ID]",
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
      `⚠️ الاستخدام:\n"تحذير [ID] أو ارد على رسالته`,
      threadID,
      messageID
    );
  }

  if (targetID === botID || ADMINBOT.includes(targetID)) {
    return api.sendMessage("❌ لا يمكن تحذير ادمن البوت!", threadID, messageID);
  }

  const state = getState();
  if (!state.warnings) state.warnings = {};
  if (!state.warnings[threadID]) state.warnings[threadID] = {};
  if (!state.warnings[threadID][targetID]) state.warnings[threadID][targetID] = 0;

  state.warnings[threadID][targetID]++;
  const warns = state.warnings[threadID][targetID];
  saveState(state);

  let targetName = targetID;
  try {
    const info = await api.getUserInfo(targetID);
    targetName = info[targetID]?.name || targetID;
  } catch {}

  if (warns >= 3) {
    state.warnings[threadID][targetID] = 0;
    saveState(state);
    await api.sendMessage(
      `⚠️ ${targetName} وصل لـ 3 تحذيرات — جاري الطرد!`,
      threadID,
      messageID
    );
    try {
      await api.removeUserFromGroup(targetID, threadID);
    } catch {}
    return;
  }

  return api.sendMessage(
    `⚠️ تحذير!\n` +
    `━━━━━━━━━━━━━━━\n` +
    `👤 ${targetName}\n` +
    `🔢 التحذيرات: ${warns}/3\n` +
    `${warns === 2 ? "❗ تحذير أخير قبل الطرد!" : ""}`,
    threadID,
    messageID
  );
};
