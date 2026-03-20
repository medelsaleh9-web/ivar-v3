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
  name: "قفل",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "سونغ",
  description: "قفل البوت للادمن فقط أو فتحه للجميع",
  commandCategory: "الملاك",
  usages: "قفل تشغيل | قفل ايقاف",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID } = event;
  const sub = args[0];
  const state = getState();

  if (sub === "تشغيل") {
    state.locks[threadID] = true;
    saveState(state);
    return api.sendMessage("🔒 تم قفل البوت — سيستجيب للادمن فقط", threadID);
  } else if (sub === "ايقاف") {
    delete state.locks[threadID];
    saveState(state);
    return api.sendMessage("🔓 تم فتح البوت — يستجيب للجميع", threadID);
  } else {
    return api.sendMessage("استخدم: قفل تشغيل | قفل ايقاف", threadID);
  }
};
