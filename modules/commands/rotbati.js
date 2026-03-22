const { getState } = require('./data/points_helper');

module.exports.config = {
  name: "رتبتي",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "كاڪو",
  description: "عرض ترتيب النقاط في الكروب",
  commandCategory: "الملاك",
  usages: "رتبتي",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, senderID } = event;

  const state = getState();
  const allPoints = state.points || {};

  let threadMembers = [];
  try {
    const info = await api.getThreadInfo(threadID);
    threadMembers = info.participantIDs.map(String);
  } catch {}

  const filtered = Object.entries(allPoints)
    .filter(([uid]) => threadMembers.includes(uid))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  if (filtered.length === 0) {
    return api.sendMessage(
      `📊 لا يوجد أي لاعب بنقاط في هذا الكروب بعد!\n` +
      `💡 العب الألعاب لتكون الأول!`,
      threadID,
      messageID
    );
  }

  const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
  const names = {};
  try {
    const usersInfo = await api.getUserInfo(filtered.map(([uid]) => uid));
    for (const [uid, info] of Object.entries(usersInfo)) {
      names[uid] = info.name || uid;
    }
  } catch {}

  let myRank = filtered.findIndex(([uid]) => uid === senderID) + 1;
  const myPoints = allPoints[senderID] || 0;

  let board = `🏆 ترتيب النقاط\n━━━━━━━━━━━━━━━\n`;
  filtered.forEach(([uid, pts], i) => {
    const mark = uid === senderID ? " ◄ أنت" : "";
    board += `${medals[i]} ${names[uid] || uid}: ${pts} نقطة${mark}\n`;
  });

  board += `━━━━━━━━━━━━━━━\n`;
  if (myRank > 0) {
    board += `📍 ترتيبك: #${myRank} | نقاطك: ${myPoints}`;
  } else {
    board += `📍 نقاطك: ${myPoints} — لست في القائمة بعد!`;
  }

  return api.sendMessage(board, threadID, messageID);
};
