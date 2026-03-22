const fs = require("fs-extra");
const path = require("path");
const statePath = path.join(__dirname, "data/malakState.json");

function getState() {
  try { return JSON.parse(fs.readFileSync(statePath, "utf-8")); }
  catch { return { locks: {}, botAdmins: {} }; }
}
function saveState(s) {
  fs.writeFileSync(statePath, JSON.stringify(s, null, 2));
}

module.exports.config = {
  name: "ادمن",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "كاڪو",
  description: "إضافة أو إزالة صلاحية استخدام البوت لشخص حتى مع القفل",
  commandCategory: "الملاك",
  usages: "ادمن [ID] | ادمن ازالة [ID] | ادمن قائمة",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, messageReply } = event;
  const ADMINBOT = global.config.ADMINBOT || [];

  const sub = args[0];
  const state = getState();
  if (!state.botAdmins) state.botAdmins = {};
  if (!state.botAdmins[threadID]) state.botAdmins[threadID] = [];

  if (sub === "قائمة") {
    const list = state.botAdmins[threadID];
    if (!list || list.length === 0)
      return api.sendMessage("📋 لا يوجد أحد في قائمة الصلاحيات لهذا الكروب", threadID, messageID);
    return api.sendMessage(`📋 قائمة صلاحيات البوت:\n${list.map((id, i) => `${i + 1}. ${id}`).join("\n")}`, threadID, messageID);
  }

  if (sub === "ازالة") {
    let targetID = args[1];
    if (!targetID && messageReply) targetID = String(messageReply.senderID);
    if (!targetID) return api.sendMessage("❌ اكتب الـ ID بعد 'ادمن ازالة' أو رد على رسالة الشخص", threadID, messageID);

    targetID = String(targetID);
    if (ADMINBOT.includes(targetID)) return api.sendMessage("❌ لا يمكن إزالة مطور البوت!", threadID, messageID);

    const idx = state.botAdmins[threadID].indexOf(targetID);
    if (idx === -1) return api.sendMessage(`⚠️ هذا الشخص (${targetID}) ليس في قائمة الصلاحيات`, threadID, messageID);

    state.botAdmins[threadID].splice(idx, 1);
    saveState(state);
    return api.sendMessage(`✅ تم إزالة صلاحية البوت من: ${targetID}`, threadID, messageID);
  }

  let targetID = sub;
  if (!targetID && messageReply) targetID = String(messageReply.senderID);
  if (!targetID) return api.sendMessage("❌ اكتب الـ ID بعد 'ادمن' أو رد على رسالة الشخص", threadID, messageID);

  targetID = String(targetID);
  if (ADMINBOT.includes(targetID)) return api.sendMessage("✅ هذا الشخص هو مطور البوت أصلاً!", threadID, messageID);

  if (state.botAdmins[threadID].includes(targetID))
    return api.sendMessage(`⚠️ هذا الشخص (${targetID}) لديه صلاحية مسبقاً`, threadID, messageID);

  state.botAdmins[threadID].push(targetID);
  saveState(state);
  return api.sendMessage(`✅ تم منح صلاحية البوت لـ: ${targetID}\nسيستجيب له حتى مع القفل 🔓`, threadID, messageID);
};
