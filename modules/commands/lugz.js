if (!global.malakGames) global.malakGames = {};
const { addPoints } = require('./data/points_helper');

const riddles = [
  { q: "لي قلب ولكن لا أحب، ولي رأس ولكن لا أفكر. ما أنا؟", a: "الخس" },
  { q: "كلما أخذت منه كبر. ما هو؟", a: "الحفرة" },
  { q: "يسير بدون أرجل، ويتحدث بدون لسان. ما هو؟", a: "النهر" },
  { q: "له أسنان ولا يعض. ما هو؟", a: "المشط" },
  { q: "يطير بدون أجنحة، يبكي بدون عيون. ما هو؟", a: "السحاب" },
  { q: "أمشي بأربعة صباحاً، واثنان ظهراً، وثلاثة مساءً. ما أنا؟", a: "الإنسان" },
  { q: "كلما أضفت إليه ماء كلما قل. ما هو؟", a: "النار" },
  { q: "يدور دون عجلة، ويطير دون جناح. ما هو؟", a: "الوقت" },
  { q: "له أذن ولا يسمع. ما هو؟", a: "الإبرة" },
  { q: "حار في الشتاء وبارد في الصيف. ما هو؟", a: "الأرض" },
  { q: "كلما نظفته اتسخ وكلما أسخته تنظف. ما هو؟", a: "الماء" },
  { q: "يمشي وهو جالس. ما هو؟", a: "السفينة" },
  { q: "ما الشيء الذي كلما أضفت منه قل؟", a: "الثقب" },
  { q: "له أسنان لكنه لا يأكل وله ظهر لكنه لا يتألم. ما هو؟", a: "المشط" },
  { q: "يعيش بلا جسد ويسمع بلا أذن ويجيب دون أن يتكلم. ما هو؟", a: "الصدى" }
];

module.exports.config = {
  name: "لغز",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "كاڪو",
  description: "لعبة الألغاز — حل اللغز واحصل على 4 نقاط",
  commandCategory: "الملاك",
  usages: "لغز",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  if (global.malakGames[threadID] && global.malakGames[threadID].active) {
    return api.sendMessage("⚠️ يوجد لعبة جارية بالفعل! انتهِ منها أولاً", threadID, messageID);
  }

  const picked = riddles[Math.floor(Math.random() * riddles.length)];
  global.malakGames[threadID] = { type: "lugz", answer: picked.a, active: true };

  setTimeout(() => {
    if (global.malakGames[threadID]?.active && global.malakGames[threadID].type === "lugz") {
      global.malakGames[threadID].active = false;
      api.sendMessage(`⏰ انتهى الوقت! الإجابة كانت: ${picked.a}`, threadID);
    }
  }, 60000);

  return api.sendMessage(
    `🧩 لغز\n` +
    `━━━━━━━━━━━━━━━\n` +
    `${picked.q}\n\n` +
    `⏰ لديك 60 ثانية للإجابة!\n` +
    `🏅 الإجابة الصحيحة = +4 نقاط`,
    threadID,
    messageID
  );
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, body, senderID, messageID } = event;
  if (!body || event.type !== "message") return;
  const game = global.malakGames[threadID];
  if (!game || !game.active || game.type !== "lugz") return;

  if (body.trim() === game.answer) {
    game.active = false;
    let name = senderID;
    try {
      const info = await api.getUserInfo(senderID);
      name = info[senderID]?.name || senderID;
    } catch {}
    const pts = addPoints(senderID, 4);
    return api.sendMessage(
      `✅ حللت اللغز!\n━━━━━━━━━━━━━━━\n👑 ${name}\n🏅 +4 نقاط! مجموعك: ${pts} نقطة`,
      threadID, messageID
    );
  }
};
