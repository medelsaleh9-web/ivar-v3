if (!global.malakGames) global.malakGames = {};
const { addPoints } = require('./data/points_helper');

const targets = [
  "نار", "ماء", "هواء", "أرض", "شمس", "قمر", "نجمة", "سحاب",
  "بحر", "جبل", "صحراء", "غابة", "مدينة", "قرية", "زهرة", "شجرة",
  "أسد", "نمر", "فيل", "دلفين", "طائرة", "سيارة", "قطار", "سفينة",
  "كتاب", "قلم", "مدرسة", "مسجد", "بيت", "باب", "نافذة", "سلم"
];

module.exports.config = {
  name: "سباق",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "كاڪو",
  description: "سباق الكتابة — أول من يكتب الكلمة يفوز (+3 نقاط)",
  commandCategory: "الملاك",
  usages: "سباق",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  if (global.malakGames[threadID]?.active) {
    return api.sendMessage("⚠️ يوجد لعبة جارية! انتهِ منها أولاً", threadID, messageID);
  }

  const word = targets[Math.floor(Math.random() * targets.length)];
  global.malakGames[threadID] = { type: "sprint", answer: word, active: true };

  setTimeout(() => {
    if (global.malakGames[threadID]?.active && global.malakGames[threadID].type === "sprint") {
      global.malakGames[threadID].active = false;
      api.sendMessage(`⏰ انتهى الوقت! لم يفز أحد. الكلمة كانت: ${word}`, threadID);
    }
  }, 20000);

  return api.sendMessage(
    `⚡ سباق الكتابة\n` +
    `━━━━━━━━━━━━━━━\n` +
    `🏁 أول من يكتب الكلمة يفوز!\n\n` +
    `📝 اكتب: ${word}\n\n` +
    `⏰ 20 ثانية فقط!\n` +
    `🏅 الفائز = +3 نقاط`,
    threadID,
    messageID
  );
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, body, senderID, messageID } = event;
  if (!body || event.type !== "message") return;
  const game = global.malakGames[threadID];
  if (!game || !game.active || game.type !== "sprint") return;

  if (body.trim() === game.answer) {
    game.active = false;
    let name = senderID;
    try {
      const info = await api.getUserInfo(senderID);
      name = info[senderID]?.name || senderID;
    } catch {}
    const pts = addPoints(senderID, 3);
    return api.sendMessage(
      `🏆 فاز ${name}!\n` +
      `━━━━━━━━━━━━━━━\n` +
      `⚡ كان الأسرع!\n` +
      `🏅 +3 نقاط! مجموعك: ${pts} نقطة`,
      threadID, messageID
    );
  }
};
