if (!global.malakGames) global.malakGames = {};
const { addPoints } = require('./data/points_helper');

module.exports.config = {
  name: "تخمين",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "سونغ",
  description: "خمّن الرقم بين 1 و10 واحصل على 3 نقاط",
  commandCategory: "الملاك",
  usages: "تخمين",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  if (global.malakGames[threadID] && global.malakGames[threadID].active) {
    return api.sendMessage("⚠️ يوجد لعبة جارية بالفعل! انتهِ منها أولاً", threadID, messageID);
  }

  const secret = Math.floor(Math.random() * 10) + 1;

  global.malakGames[threadID] = {
    type: "takhmin",
    answer: String(secret),
    active: true,
    attempts: {}
  };

  setTimeout(() => {
    if (global.malakGames[threadID] && global.malakGames[threadID].active) {
      global.malakGames[threadID].active = false;
      api.sendMessage(`⏰ انتهى الوقت! الرقم كان: ${secret}`, threadID);
    }
  }, 60000);

  return api.sendMessage(
    `🎯 لعبة التخمين\n` +
    `━━━━━━━━━━━━━━━\n` +
    `🔢 خمّن الرقم بين 1 و 10\n\n` +
    `⏰ لديك 60 ثانية\n` +
    `🏅 الإجابة الصحيحة = +3 نقاط`,
    threadID,
    messageID
  );
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, body, senderID, messageID } = event;
  if (!body || event.type !== "message") return;
  const game = global.malakGames[threadID];
  if (!game || !game.active || game.type !== "takhmin") return;

  const guess = body.trim();
  if (!/^\d+$/.test(guess)) return;

  if (!game.attempts[senderID]) game.attempts[senderID] = 0;
  if (game.attempts[senderID] >= 3) {
    return api.sendMessage(`🚫 استنفدت محاولاتك!`, threadID, messageID);
  }
  game.attempts[senderID]++;

  if (guess === game.answer) {
    game.active = false;

    let winnerName = senderID;
    try {
      const info = await api.getUserInfo(senderID);
      winnerName = info[senderID]?.name || senderID;
    } catch {}

    const newPoints = addPoints(senderID, 3);

    return api.sendMessage(
      `🎯 خمّنت بشكل صحيح!\n` +
      `━━━━━━━━━━━━━━━\n` +
      `👑 ${winnerName}\n` +
      `🔢 الرقم: ${game.answer}\n` +
      `🏅 +3 نقاط! مجموعك: ${newPoints} نقطة`,
      threadID,
      messageID
    );
  } else {
    const remaining = 3 - game.attempts[senderID];
    return api.sendMessage(
      `❌ خطأ! الرقم ${parseInt(guess) > parseInt(game.answer) ? "أصغر" : "أكبر"}\n` +
      `💡 تبقى لك ${remaining} محاولة`,
      threadID,
      messageID
    );
  }
};
