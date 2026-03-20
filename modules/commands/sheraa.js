const fs = require('fs');
const path = require('path');
const { getPoints, setPoints, getState, saveState } = require('./data/points_helper');
const statePath = path.join(__dirname, 'data/malakState.json');

module.exports.config = {
  name: "شراء",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "سونغ",
  description: "شراء صلاحية ادمن البوت مقابل 100 نقطة",
  commandCategory: "الملاك",
  usages: "شراء صلاحية",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  const item = args.join(" ").trim();
  if (item !== "صلاحية") {
    return api.sendMessage(
      `🛒 المتجر\n` +
      `━━━━━━━━━━━━━━━\n` +
      `📦 المتاح للشراء:\n` +
      `  🔑 صلاحية ادمن البوت — 100 نقطة\n\n` +
      `💡 الاستخدام: "شراء صلاحية`,
      threadID,
      messageID
    );
  }

  const points = getPoints(senderID);
  if (points < 100) {
    return api.sendMessage(
      `❌ نقاطك غير كافية!\n` +
      `━━━━━━━━━━━━━━━\n` +
      `🏅 نقاطك الحالية: ${points}/100\n` +
      `💡 العب الألعاب لتجمع المزيد من النقاط!`,
      threadID,
      messageID
    );
  }

  const state = getState();
  if (!state.botAdmins) state.botAdmins = {};
  if (!state.botAdmins[threadID]) state.botAdmins[threadID] = [];

  if (state.botAdmins[threadID].includes(senderID)) {
    return api.sendMessage(
      `⚠️ أنت تمتلك صلاحية ادمن البوت بالفعل في هذا الكروب!`,
      threadID,
      messageID
    );
  }

  setPoints(senderID, points - 100);
  const freshState = getState();
  if (!freshState.botAdmins) freshState.botAdmins = {};
  if (!freshState.botAdmins[threadID]) freshState.botAdmins[threadID] = [];
  freshState.botAdmins[threadID].push(senderID);
  saveState(freshState);

  let name = senderID;
  try {
    const info = await api.getUserInfo(senderID);
    name = info[senderID]?.name || senderID;
  } catch {}

  return api.sendMessage(
    `✅ تم الشراء بنجاح!\n` +
    `━━━━━━━━━━━━━━━\n` +
    `👑 ${name}\n` +
    `🔑 حصلت على صلاحية ادمن البوت في هذا الكروب\n` +
    `💰 تم خصم 100 نقطة — متبقي لديك: ${points - 100} نقطة`,
    threadID,
    messageID
  );
};
