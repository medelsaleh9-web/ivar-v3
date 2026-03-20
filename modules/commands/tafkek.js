if (!global.malakGames) global.malakGames = {};
const { addPoints } = require('./data/points_helper');

const arabicWords = [
  "قمر", "نور", "بحر", "جبل", "زهرة", "سماء", "نجمة", "شمس", "ماء",
  "حياة", "قلب", "روح", "حلم", "فجر", "برق", "رعد", "ريح", "صحراء",
  "ورد", "عقل", "أسد", "نمر", "فيل", "قطة", "حصان", "طير", "سمكة",
  "ذهب", "فضة", "لؤلؤ", "حجر", "ثلج", "صيف", "شتاء", "ربيع", "خريف"
];

module.exports.config = {
  name: "تفكيك",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "سونغ",
  description: "لعبة تفكيك الكلمة — فكك الكلمة لحروف منفصلة، الفائز يحصل على نقطة",
  commandCategory: "الملاك",
  usages: "تفكيك",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  if (global.malakGames[threadID] && global.malakGames[threadID].active) {
    return api.sendMessage("⚠️ يوجد لعبة جارية بالفعل! انتهِ منها أولاً", threadID, messageID);
  }

  const word = arabicWords[Math.floor(Math.random() * arabicWords.length)];
  const answer = word.split("").join(" ");

  global.malakGames[threadID] = {
    type: "tafkek",
    word,
    answer,
    active: true,
    startTime: Date.now()
  };

  setTimeout(() => {
    if (global.malakGames[threadID] && global.malakGames[threadID].active) {
      global.malakGames[threadID].active = false;
      api.sendMessage(`⏰ انتهى الوقت! الإجابة كانت: ${answer}`, threadID);
    }
  }, 60000);

  return api.sendMessage(
    `🎮 لعبة التفكيك\n` +
    `━━━━━━━━━━━━━━━\n` +
    `🔤 فكك هذه الكلمة لحروف منفصلة:\n\n` +
    `  ${word}\n\n` +
    `💡 مثال: إذا كانت الكلمة قمر اكتب: ق م ر\n` +
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
  if (!game || !game.active || game.type !== "tafkek") return;

  const normalizedBody = body.trim().replace(/\s+/g, " ");
  if (normalizedBody === game.answer) {
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
      `✅ الإجابة الصحيحة: ${game.answer}\n` +
      `🏅 +1 نقطة! مجموعك: ${newPoints} نقطة`,
      threadID,
      messageID
    );
  }
};
