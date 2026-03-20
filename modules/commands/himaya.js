const fs = require("fs-extra");
const path = require("path");
const STATE_PATH = path.join(__dirname, "data/malakState.json");

function loadState() {
  try { return JSON.parse(fs.readFileSync(STATE_PATH, "utf-8")); }
  catch { return {}; }
}

function saveState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), "utf-8");
}

module.exports.config = {
  name: "حماية",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "سونغ",
  description: "تفعيل/إيقاف حماية الكنيات — لا يستطيع أحد تغييرها إلا ادمن البوت",
  commandCategory: "الملاك",
  usages: "حماية تشغيل | حماية ايقاف",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const sub = args[0];
  const state = loadState();
  if (!state.nicknameProtection) state.nicknameProtection = {};

  if (sub === "تشغيل") {
    state.nicknameProtection[threadID] = true;
    saveState(state);
    return api.sendMessage(
      `🛡️ تم تفعيل حماية الكنيات\n` +
      `━━━━━━━━━━━━━━━\n` +
      `❌ لا يستطيع أي شخص تغيير الكنيات\n` +
      `✅ فقط ادمن البوت يملك هذه الصلاحية\n` +
      `🔄 أي تغيير سيُلغى تلقائياً`,
      threadID,
      messageID
    );
  }

  if (sub === "ايقاف") {
    delete state.nicknameProtection[threadID];
    saveState(state);
    return api.sendMessage("🔓 تم إيقاف حماية الكنيات", threadID, messageID);
  }

  const isActive = !!state.nicknameProtection[threadID];
  return api.sendMessage(
    `🛡️ حماية الكنيات: ${isActive ? "✅ مفعّلة" : "❌ موقفة"}\n\n` +
    `اكتب:\n` +
    `"حماية تشغيل — تفعيل الحماية\n` +
    `"حماية ايقاف — إيقاف الحماية`,
    threadID,
    messageID
  );
};
