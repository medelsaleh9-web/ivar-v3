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
  name: "فك القفل",
  version: "1.0.0",
  hasPermssion: 3,
  credits: "كاڪو",
  description: "فتح البوت للجميع في هذا الكروب أو قفله لادمن البوت فقط",
  commandCategory: "الملاك",
  usages: "فك القفل | قفل الكل",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const state = getState();
  if (!state.openThreads) state.openThreads = {};

  const sub = args[0];

  if (sub === "قفل" || sub === "قفل الكل") {
    delete state.openThreads[threadID];
    saveState(state);
    return api.sendMessage(
      `🔒 تم قفل البوت — فقط ادمن البوت يستطيع استخدامه`,
      threadID,
      messageID
    );
  }

  state.openThreads[threadID] = true;
  saveState(state);
  return api.sendMessage(
    `🔓 تم فك القفل — الجميع الآن يستطيع استخدام البوت في هذا الكروب`,
    threadID,
    messageID
  );
};
