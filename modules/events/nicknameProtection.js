const fs = require("fs-extra");
const path = require("path");
const STATE_PATH = path.join(__dirname, "../commands/data/malakState.json");

module.exports.config = {
  name: "nicknameProtection",
  eventType: ["log:user-nickname"],
  version: "1.0.0",
  credits: "سونغ",
  description: "حماية الكنيات من التغيير"
};

module.exports.run = async function ({ api, event }) {
  const { threadID, author, logMessageData } = event;
  const botID = api.getCurrentUserID();

  let state = {};
  try { state = JSON.parse(fs.readFileSync(STATE_PATH, "utf-8")); }
  catch {}

  if (!state.nicknameProtection || !state.nicknameProtection[threadID]) return;

  const { ADMINBOT } = global.config || {};
  const admins = Array.isArray(ADMINBOT) ? ADMINBOT : [];

  const botAdmins = (state.botAdmins && state.botAdmins[threadID]) || [];

  if (admins.includes(author) || botAdmins.includes(author) || author === botID) return;

  let isGroupAdmin = false;
  try {
    const info = await api.getThreadInfo(threadID);
    isGroupAdmin = info.adminIDs.some(a => a.uid === author);
  } catch {}

  if (isGroupAdmin) return;

  const targetID = logMessageData.participant_id;
  const oldNickname = logMessageData.nickname || "";

  await api.changeNickname("", threadID, targetID).catch(() => {});
  api.sendMessage(`🛡️ الحماية مفعّلة — لا يمكن تغيير الكنيات`, threadID);
};
