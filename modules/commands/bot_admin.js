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
  name: "ادمن",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "سونغ",
  description: "منح أو إزالة صلاحيات البوت",
  commandCategory: "الملاك",
  usages: "ادمن [ID] | ادمن ازالة [ID]",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID } = event;
  const state = getState();

  if (!state.botAdmins[threadID]) state.botAdmins[threadID] = [];

  if (args[0] === "ازالة") {
    const uid = args[1];
    if (!uid) return api.sendMessage("يرجى كتابة ID المستخدم لإزالة صلاحيته!", threadID);
    state.botAdmins[threadID] = state.botAdmins[threadID].filter(id => id !== uid);
    saveState(state);
    return api.sendMessage(`✅ تم إزالة صلاحيات ${uid}`, threadID);
  }

  const uid = args[0];
  if (!uid) return api.sendMessage("يرجى كتابة ID المستخدم!", threadID);

  if (state.botAdmins[threadID].includes(uid)) {
    return api.sendMessage(`المستخدم ${uid} لديه صلاحيات بالفعل!`, threadID);
  }

  state.botAdmins[threadID].push(uid);
  saveState(state);
  return api.sendMessage(`✅ تم منح صلاحيات البوت للمستخدم: ${uid}`, threadID);
};
