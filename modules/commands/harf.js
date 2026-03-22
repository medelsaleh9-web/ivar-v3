if (!global.malakGames) global.malakGames = {};
const { addPoints } = require('./data/points_helper');

const words = [
  "تفاحة", "سيارة", "مدرسة", "شجرة", "قمر", "نجمة", "بحر", "جبل",
  "أسد", "فراشة", "كتاب", "قلم", "هاتف", "طائرة", "سفينة", "مستشفى",
  "مطبخ", "غابة", "صحراء", "نهر", "عصفور", "دلفين", "فيل", "زهرة",
  "برتقال", "موز", "فراولة", "توت", "رمان", "خوخ"
];

module.exports.config = {
  name: "حرف",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "كاڪو",
  description: "خمن الكلمة من أول حرف واربح 3 نقاط",
  commandCategory: "الملاك",
  usages: "حرف",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  if (global.malakGames[threadID]?.active) {
    return api.sendMessage("⚠️ يوجد لعبة جارية! انتهِ منها أولاً", threadID, messageID);
  }

  const word = words[Math.floor(Math.random() * words.length)];
  const hint = Array.from(word).map((ch, i) => i === 0 ? ch : "_ ").join("");

  global.malakGames[threadID] = { type: "harf", answer: word, active: true };

  setTimeout(() => {
    if (global.malakGames[threadID]?.active && global.malakGames[threadID].type === "harf") {
      global.malakGames[threadID].active = false;
      api.sendMessage(`⏰ انتهى الوقت! الكلمة كانت: ${word}`, threadID);
    }
  }, 45000);

  return api.sendMessage(
    `🔤 تخمين الكلمة\n` +
    `━━━━━━━━━━━━━━━\n` +
    `${hint}\n` +
    `📝 عدد الحروف: ${Array.from(word).length}\n` +
    `⏰ لديك 45 ثانية للإجابة!\n` +
    `🏅 الإجابة الصحيحة = +3 نقاط`,
    threadID,
    messageID
  );
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, body, senderID, messageID } = event;
  if (!body || event.type !== "message") return;
  const game = global.malakGames[threadID];
  if (!game || !game.active || game.type !== "harf") return;

  if (body.trim() === game.answer) {
    game.active = false;
    let name = senderID;
    try {
      const info = await api.getUserInfo(senderID);
      name = info[senderID]?.name || senderID;
    } catch {}
    const pts = addPoints(senderID, 3);
    return api.sendMessage(
      `✅ إجابة صحيحة!\n━━━━━━━━━━━━━━━\n👑 ${name}\n🔤 الكلمة: ${game.answer}\n🏅 +3 نقاط! مجموعك: ${pts} نقطة`,
      threadID, messageID
    );
  }
};
