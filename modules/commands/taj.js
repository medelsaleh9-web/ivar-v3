const fs = require("fs-extra");
const path = require("path");
const statePath = path.join(__dirname, "data/malakState.json");

function getState() {
  try { return JSON.parse(fs.readFileSync(statePath, "utf-8")); }
  catch { return { locks: {}, botAdmins: {}, awrwa: {} }; }
}
function saveState(s) {
  fs.writeFileSync(statePath, JSON.stringify(s, null, 2));
}

module.exports.config = {
  name: "تاج",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "كاڪو",
  description: "إضافة شخص كادمن بوت بالـ ID",
  commandCategory: "الملاك",
  usages: "تاج [ID]",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const uid = args[0];

  if (!uid) {
    return api.sendMessage(
      `👑 الاستخدام:\n"تاج [ID] — إضافة شخص كادمن بوت\n\nمثال: "تاج 100012345678`,
      threadID,
      messageID
    );
  }

  const state = getState();
  if (!state.botAdmins) state.botAdmins = {};
  if (!state.botAdmins[threadID]) state.botAdmins[threadID] = [];

  if (state.botAdmins[threadID].includes(uid)) {
    return api.sendMessage(`⚠️ المستخدم ${uid} لديه تاج البوت بالفعل!`, threadID, messageID);
  }

  let userName = uid;
  try {
    const info = await api.getUserInfo(uid);
    userName = info[uid]?.name || uid;
  } catch {}

  state.botAdmins[threadID].push(uid);
  saveState(state);

  return api.sendMessage(
    `👑 تم تتويج ${userName}\n` +
    `━━━━━━━━━━━━━━━\n` +
    `✅ أصبح ادمن بوت في هذا الكروب`,
    threadID,
    messageID
  );
};
