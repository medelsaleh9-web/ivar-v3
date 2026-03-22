if (!global.malakGames) global.malakGames = {};
const { addPoints } = require('./data/points_helper');

const arabicWords = [
  "قمر", "نور", "بحر", "جبل", "زهرة", "سماء", "نجمة", "شمس", "ماء",
  "حياة", "قلب", "روح", "حلم", "فجر", "برق", "رعد", "ريح", "صحراء",
  "ورد", "عقل", "أسد", "نمر", "فيل", "قطة", "حصان", "طير", "سمكة",
  "ذهب", "فضة", "لؤلؤ", "حجر", "ثلج", "صيف", "شتاء", "ربيع", "خريف"
];

module.exports.config = {
  name: "تجميع",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "كاڪو",
  description: "لعبة تجميع الحروف — اجمع الحروف لتكوين الكلمة، الفائز يحصل على نقطة",
  commandCategory: "الملاك",
  usages: "تجميع",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  if (global.malakGames[threadID] && global.malakGames[threadID].active) {
    return api.sendMessage("⚠️ يوجد لعبة جارية بالفعل! انتهِ منها أولاً", threadID, messageID);
  }

  const word = arabicWords[Math.floor(Math.random() * arabicWords.length)];
  const separated = word.split("").join(" ");

  global.malakGames[threadID] = {
    type: "tajmee",
    answer: word,
    active: true,
    startTime: Date.now()
  };

  setTimeout(() => {
    if (global.malakGames[threadID] && global.malakGames[threadID].active) {
      global.malakGames[threadID].active = false;
      api.sendMessage(`⏰ انتهى الوقت! الإجابة كانت: ${word}`, threadID);
    }
  }, 60000);

  return api.sendMessage(
    `🎮 لعبة التجميع\n` +
    `━━━━━━━━━━━━━━━\n` +
    `🔤 جمّع هذه الحروف في كلمة واحدة:\n\n` +
    `  ${separated}\n\n` +
    `⏰ لديك 60 ثانية للإجابة!\n` +
    `🏅 الفائز يحصل على نقطة!`,
    threadID,
    messageID
  );
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, body, senderID, messageID } = event;
  if (!body || event.type !== "message") return;
  const game = global.malakGames[threadID];
  if (!game || !game.active || game.type !== "tajmee") return;

  if (body.trim() === game.answer) {
    game.active = false;

    let winnerName = senderID;
    try {
      const info = await api.getUserInfo(senderID);
      winnerName = info[senderID]?.name || senderID;
    } catch {}

    const newPoints = addPoints(senderID, 1);

    return api.sendMessage(
      `🏆 انت الفائز!\n` +
      `━━━━━━━━━━━━━━━\n` +
      `👑 ${winnerName}\n` +
      `✅ الكلمة الصحيحة: ${game.answer}\n` +
      `🏅 +1 نقطة! مجموعك: ${newPoints} نقطة`,
      threadID,
      messageID
    );
  }
};
