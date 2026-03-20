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
  { q: "ما الدولة التي يقع فيها برج إيفل؟", a: "فرنسا" },
  { q: "كم عدد لاعبي فريق كرة القدم في الملعب؟", a: "11" },
  { q: "ما عاصمة اليابان؟", a: "طوكيو" },
  { q: "من هو أول رائد فضاء في التاريخ؟", a: "يوري غاغارين" },
  { q: "ما أصغر دولة في العالم؟", a: "الفاتيكان" },
  { q: "ما عاصمة البرازيل؟", a: "برازيليا" },
  { q: "كم عدد أضلاع المثلث؟", a: "3" },
  { q: "ما اسم أكبر صحراء في العالم؟", a: "الصحراء الكبرى" },
  { q: "ما عاصمة تركيا؟", a: "أنقرة" },
  { q: "من اخترع الهاتف؟", a: "غراهام بيل" },
  { q: "ما اسم أعلى قمة جبلية في العالم؟", a: "إيفرست" },
  { q: "ما عاصمة إسبانيا؟", a: "مدريد" },
  { q: "ما عاصمة ألمانيا؟", a: "برلين" },
  { q: "كم عدد قارات العالم؟", a: "7" },
  { q: "ما لون السماء الصافية؟", a: "أزرق" },
  { q: "ما أكبر قارة في العالم؟", a: "آسيا" }
];

module.exports.config = {
  name: "سؤال",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "سونغ",
  description: "لعبة الأسئلة — أجب بشكل صحيح واحصل على 5 نقاط",
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
    `🏅 الإجابة الصحيحة = +5 نقاط`,
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

    const newPoints = addPoints(senderID, 5);

    return api.sendMessage(
      `✅ إجابة صحيحة!\n` +
      `━━━━━━━━━━━━━━━\n` +
      `👑 ${winnerName}\n` +
      `🏅 +5 نقاط! مجموعك: ${newPoints} نقطة`,
      threadID,
      messageID
    );
  }
};
