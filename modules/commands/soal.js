if (!global.malakGames) global.malakGames = {};
const { addPoints } = require('./data/points_helper');

const questions = [
  { q: "ما عاصمة المملكة العربية السعودية؟", a: "الرياض" },
  { q: "كم عدد أيام الأسبوع؟", a: "7" },
  { q: "ما أكبر محيطات العالم؟", a: "الهادي" },
  { q: "ما اسم أطول نهر في العالم؟", a: "النيل" },
  { q: "كم عدد أشهر السنة؟", a: "12" },
  { q: "ما عاصمة مصر؟", a: "القاهرة" },
  { q: "ما أكبر كوكب في المجموعة الشمسية؟", a: "المشتري" },
  { q: "كم عدد ألوان قوس قزح؟", a: "7" },
  { q: "ما عاصمة الإمارات؟", a: "أبوظبي" },
  { q: "ما اسم الكتاب المقدس للمسلمين؟", a: "القرآن" },
  { q: "كم عدد ساعات اليوم؟", a: "24" },
  { q: "ما عاصمة فرنسا؟", a: "باريس" },
  { q: "ما أسرع حيوان بري في العالم؟", a: "الفهد" },
  { q: "كم عدد أقدام المتر الواحد تقريباً؟", a: "3" },
  { q: "ما الدولة التي يقع فيها برج إيفل؟", a: "فرنسا" }
];

module.exports.config = {
  name: "سؤال",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "سونغ",
  description: "لعبة الأسئلة — أجب بشكل صحيح واحصل على نقطتين",
  commandCategory: "الملاك",
  usages: "سؤال",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  if (global.malakGames[threadID] && global.malakGames[threadID].active) {
    return api.sendMessage("⚠️ يوجد لعبة جارية بالفعل! انتهِ منها أولاً", threadID, messageID);
  }

  const picked = questions[Math.floor(Math.random() * questions.length)];

  global.malakGames[threadID] = {
    type: "soal",
    answer: picked.a,
    active: true
  };

  setTimeout(() => {
    if (global.malakGames[threadID] && global.malakGames[threadID].active) {
      global.malakGames[threadID].active = false;
      api.sendMessage(`⏰ انتهى الوقت! الإجابة كانت: ${picked.a}`, threadID);
    }
  }, 45000);

  return api.sendMessage(
    `❓ سؤال عام\n` +
    `━━━━━━━━━━━━━━━\n` +
    `${picked.q}\n\n` +
    `⏰ لديك 45 ثانية للإجابة!\n` +
    `🏅 الإجابة الصحيحة = +2 نقطة`,
    threadID,
    messageID
  );
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, body, senderID, messageID } = event;
  if (!body || event.type !== "message") return;
  const game = global.malakGames[threadID];
  if (!game || !game.active || game.type !== "soal") return;

  if (body.trim() === game.answer) {
    game.active = false;

    let winnerName = senderID;
    try {
      const info = await api.getUserInfo(senderID);
      winnerName = info[senderID]?.name || senderID;
    } catch {}

    const newPoints = addPoints(senderID, 2);

    return api.sendMessage(
      `✅ إجابة صحيحة!\n` +
      `━━━━━━━━━━━━━━━\n` +
      `👑 ${winnerName}\n` +
      `🏅 +2 نقطة! مجموعك: ${newPoints} نقطة`,
      threadID,
      messageID
    );
  }
};
