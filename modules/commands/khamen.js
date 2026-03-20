if (!global.malakGames) global.malakGames = {};
const { addPoints } = require('./data/points_helper');

module.exports.config = {
  name: "خامن",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "سونغ",
  description: "خمن الرقم السري بين 1-20 واربح 3 نقاط",
  commandCategory: "الملاك",
  usages: "خامن",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  if (global.malakGames[threadID]?.active) {
    return api.sendMessage("⚠️ يوجد لعبة جارية! انتهِ منها أولاً", threadID, messageID);
  }

  const secret = Math.floor(Math.random() * 20) + 1;
  global.malakGames[threadID] = { type: "khamen", answer: String(secret), active: true, tries: 0 };

  setTimeout(() => {
    if (global.malakGames[threadID]?.active && global.malakGames[threadID].type === "khamen") {
      global.malakGames[threadID].active = false;
      api.sendMessage(`⏰ انتهى الوقت! الرقم السري كان: ${secret}`, threadID);
    }
  }, 60000);

  return api.sendMessage(
    `🎯 تخمين الرقم السري\n` +
    `━━━━━━━━━━━━━━━\n` +
    `🔢 خمن رقماً بين 1 و 20\n` +
    `📝 أرسل رقمك الآن!\n` +
    `⏰ لديك 60 ثانية\n` +
    `🏅 الإجابة الصحيحة = +3 نقاط\n` +
    `💡 لديك محاولات غير محدودة!`,
    threadID,
    messageID
  );
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, body, senderID, messageID } = event;
  if (!body || event.type !== "message") return;
  const game = global.malakGames[threadID];
  if (!game || !game.active || game.type !== "khamen") return;

  const guess = parseInt(body.trim());
  if (isNaN(guess) || guess < 1 || guess > 20) return;

  game.tries = (game.tries || 0) + 1;
  const secret = parseInt(game.answer);

  if (guess === secret) {
    game.active = false;
    let name = senderID;
    try {
      const info = await api.getUserInfo(senderID);
      name = info[senderID]?.name || senderID;
    } catch {}
    const pts = addPoints(senderID, 3);
    return api.sendMessage(
      `✅ صح! الرقم السري هو ${secret}\n━━━━━━━━━━━━━━━\n👑 ${name}\n🔢 في ${game.tries} محاولة!\n🏅 +3 نقاط! مجموعك: ${pts} نقطة`,
      threadID, messageID
    );
  } else {
    const hint = guess < secret ? "📈 الرقم أكبر" : "📉 الرقم أصغر";
    return api.sendMessage(`${hint} — حاول مرة ثانية!`, threadID, messageID);
  }
};
