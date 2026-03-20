if (!global.malakGames) global.malakGames = {};
const { addPoints } = require('./data/points_helper');

const challenges = [
  {
    q: "ما عاصمة كندا؟",
    options: ["A. تورنتو", "B. أوتاوا", "C. مونتريال", "D. فانكوفر"],
    a: "B",
    correct: "أوتاوا"
  },
  {
    q: "كم عدد أضلاع المسدس (الشكل السداسي)؟",
    options: ["A. 5", "B. 7", "C. 6", "D. 8"],
    a: "C",
    correct: "6"
  },
  {
    q: "من اخترع المصباح الكهربائي؟",
    options: ["A. نيوتن", "B. إديسون", "C. فاراداي", "D. تيسلا"],
    a: "B",
    correct: "إديسون"
  },
  {
    q: "ما أكبر قارة في العالم؟",
    options: ["A. أفريقيا", "B. أوروبا", "C. آسيا", "D. أمريكا"],
    a: "C",
    correct: "آسيا"
  },
  {
    q: "ما لغة البرمجة الأكثر استخداماً في الويب؟",
    options: ["A. Python", "B. Java", "C. JavaScript", "D. C++"],
    a: "C",
    correct: "JavaScript"
  },
  {
    q: "كم يساوي Pi تقريباً؟",
    options: ["A. 3.12", "B. 3.14", "C. 3.16", "D. 3.18"],
    a: "B",
    correct: "3.14"
  },
  {
    q: "من كتب روايات شيرلوك هولمز؟",
    options: ["A. أجاثا كريستي", "B. آرثر كونان دويل", "C. ستيفن كينج", "D. تولستوي"],
    a: "B",
    correct: "آرثر كونان دويل"
  },
  {
    q: "ما أسرع حيوان في البحر؟",
    options: ["A. الحوت", "B. القرش", "C. الدلفين", "D. سمكة الشراع"],
    a: "D",
    correct: "سمكة الشراع"
  },
  {
    q: "في أي سنة هبط الإنسان على القمر لأول مرة؟",
    options: ["A. 1965", "B. 1969", "C. 1971", "D. 1975"],
    a: "B",
    correct: "1969"
  },
  {
    q: "ما هو أطول جدار في العالم؟",
    options: ["A. سور الصين العظيم", "B. جدار برلين", "C. جدار الهند", "D. جدار روما"],
    a: "A",
    correct: "سور الصين العظيم"
  }
];

module.exports.config = {
  name: "تحدي",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "سونغ",
  description: "سؤال اختيار من متعدد — أجب بالحرف الصحيح واربح 3 نقاط",
  commandCategory: "الملاك",
  usages: "تحدي",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  if (global.malakGames[threadID]?.active) {
    return api.sendMessage("⚠️ يوجد لعبة جارية! انتهِ منها أولاً", threadID, messageID);
  }

  const picked = challenges[Math.floor(Math.random() * challenges.length)];
  global.malakGames[threadID] = { type: "tahadi", answer: picked.a, correct: picked.correct, active: true };

  setTimeout(() => {
    if (global.malakGames[threadID]?.active && global.malakGames[threadID].type === "tahadi") {
      global.malakGames[threadID].active = false;
      api.sendMessage(`⏰ انتهى الوقت! الإجابة الصحيحة: ${picked.a} - ${picked.correct}`, threadID);
    }
  }, 30000);

  return api.sendMessage(
    `🎮 تحدي المعلومات\n` +
    `━━━━━━━━━━━━━━━\n` +
    `❓ ${picked.q}\n\n` +
    picked.options.join("\n") +
    `\n\n⏰ 30 ثانية — أرسل حرف الإجابة (A/B/C/D)\n` +
    `🏅 الإجابة الصحيحة = +3 نقاط`,
    threadID,
    messageID
  );
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, body, senderID, messageID } = event;
  if (!body || event.type !== "message") return;
  const game = global.malakGames[threadID];
  if (!game || !game.active || game.type !== "tahadi") return;

  const answer = body.trim().toUpperCase();
  if (!["A", "B", "C", "D"].includes(answer)) return;

  if (answer === game.answer) {
    game.active = false;
    let name = senderID;
    try {
      const info = await api.getUserInfo(senderID);
      name = info[senderID]?.name || senderID;
    } catch {}
    const pts = addPoints(senderID, 3);
    return api.sendMessage(
      `✅ إجابة صحيحة!\n━━━━━━━━━━━━━━━\n👑 ${name}\n✔️ ${game.correct}\n🏅 +3 نقاط! مجموعك: ${pts} نقطة`,
      threadID, messageID
    );
  } else {
    return api.sendMessage(`❌ إجابة خاطئة! حاول مرة ثانية`, threadID, messageID);
  }
};
