if (!global.malakGames) global.malakGames = {};
const { getPoints, setPoints, addPoints } = require('./data/points_helper');

module.exports.config = {
  name: "نرد",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "سونغ",
  description: "لعبة النرد — راهن نقاطك وحاول الفوز بضعفها!",
  commandCategory: "الملاك",
  usages: "نرد [عدد النقاط]",
  cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  const bet = parseInt(args[0]);
  if (!bet || bet <= 0) {
    return api.sendMessage(
      `🎲 لعبة النرد\n` +
      `━━━━━━━━━━━━━━━\n` +
      `💡 الاستخدام: "نرد [عدد النقاط]\n` +
      `مثال: "نرد 10\n\n` +
      `إذا فزت تضاعف نقاطك، وإذا خسرت تخسرها!`,
      threadID,
      messageID
    );
  }

  const myPoints = getPoints(senderID);
  if (myPoints < bet) {
    return api.sendMessage(
      `❌ نقاطك غير كافية!\n` +
      `🏅 لديك: ${myPoints} نقطة فقط`,
      threadID,
      messageID
    );
  }

  const playerRoll = Math.floor(Math.random() * 6) + 1;
  const botRoll = Math.floor(Math.random() * 6) + 1;

  let name = senderID;
  try {
    const info = await api.getUserInfo(senderID);
    name = info[senderID]?.name || senderID;
  } catch {}

  const dice = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣"];

  if (playerRoll > botRoll) {
    const won = addPoints(senderID, bet);
    return api.sendMessage(
      `🎲 نتيجة النرد\n` +
      `━━━━━━━━━━━━━━━\n` +
      `👤 ${name}: ${dice[playerRoll - 1]} (${playerRoll})\n` +
      `🤖 البوت: ${dice[botRoll - 1]} (${botRoll})\n\n` +
      `🏆 فزت! +${bet} نقطة\n` +
      `🏅 مجموعك الآن: ${won} نقطة`,
      threadID,
      messageID
    );
  } else if (botRoll > playerRoll) {
    const remaining = getPoints(senderID) - bet;
    setPoints(senderID, remaining);
    return api.sendMessage(
      `🎲 نتيجة النرد\n` +
      `━━━━━━━━━━━━━━━\n` +
      `👤 ${name}: ${dice[playerRoll - 1]} (${playerRoll})\n` +
      `🤖 البوت: ${dice[botRoll - 1]} (${botRoll})\n\n` +
      `💀 خسرت! -${bet} نقطة\n` +
      `🏅 مجموعك الآن: ${Math.max(0, remaining)} نقطة`,
      threadID,
      messageID
    );
  } else {
    return api.sendMessage(
      `🎲 نتيجة النرد\n` +
      `━━━━━━━━━━━━━━━\n` +
      `👤 ${name}: ${dice[playerRoll - 1]} (${playerRoll})\n` +
      `🤖 البوت: ${dice[botRoll - 1]} (${botRoll})\n\n` +
      `🤝 تعادل! لا تغيير في نقاطك`,
      threadID,
      messageID
    );
  }
};
