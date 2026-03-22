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
  name: "مسح",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "كاڪو",
  description: "مسح تحذيرات عضو أو عرض قائمة المحظورين والمحذرين",
  commandCategory: "الملاك",
  usages: "مسح [ID/رد] — مسح تحذيرات | مسح قائمة — قائمة التحذيرات والحظر",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, messageReply } = event;
  const state = getState();

  if (args[0] === "قائمة") {
    const warns = (state.warnings && state.warnings[threadID]) || {};
    const banned = (state.bannedUsers && state.bannedUsers[threadID]) || [];

    let msg = `📋 قائمة الكروب\n━━━━━━━━━━━━━━━\n`;

    if (Object.keys(warns).length === 0 && banned.length === 0) {
      return api.sendMessage(msg + "✅ لا يوجد تحذيرات أو حظر", threadID, messageID);
    }

    if (Object.keys(warns).length > 0) {
      msg += `⚠️ المحذرون:\n`;
      for (const [id, count] of Object.entries(warns)) {
        if (count > 0) msg += `  • ${id}: ${count}/3 تحذير\n`;
      }
    }

    if (banned.length > 0) {
      msg += `\n🚫 المحظورون:\n`;
      for (const id of banned) msg += `  • ${id}\n`;
    }

    return api.sendMessage(msg, threadID, messageID);
  }

  let targetID = args[0];
  if (!targetID && messageReply) targetID = messageReply.senderID;

  if (!targetID) {
    return api.sendMessage(
      `📋 الاستخدام:\n"مسح [ID] — مسح تحذيرات عضو\n"مسح قائمة — عرض القائمة`,
      threadID,
      messageID
    );
  }

  if (!state.warnings || !state.warnings[threadID] || !state.warnings[threadID][targetID]) {
    return api.sendMessage(`⚠️ هذا العضو ليس لديه تحذيرات!`, threadID, messageID);
  }

  let targetName = targetID;
  try {
    const info = await api.getUserInfo(targetID);
    targetName = info[targetID]?.name || targetID;
  } catch {}

  state.warnings[threadID][targetID] = 0;
  saveState(state);

  return api.sendMessage(
    `✅ تم مسح تحذيرات ${targetName}`,
    threadID,
    messageID
  );
};
