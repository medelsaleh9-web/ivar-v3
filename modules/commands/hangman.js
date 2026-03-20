if (!global.malakGames) global.malakGames = {};
const { addPoints } = require('./data/points_helper');

const words = [
  "تفاحة", "سيارة", "مدرسة", "شجرة", "قمر", "نجمة", "بحر", "جبل",
  "فراشة", "كتاب", "هاتف", "طائرة", "سفينة", "مستشفى", "مطبخ",
  "غابة", "صحراء", "نهر", "عصفور", "دلفين", "فيل", "زهرة", "برتقال",
  "موز", "فراولة", "رمان", "قرآن", "كمبيوتر", "مروحة", "ثلاجة",
  "مدينة", "قرية", "شارع", "مسجد", "مدير", "طبيب", "معلم", "شرطي",
  "أسد", "نمر", "زرافة", "قرد", "ببغاء", "سمكة", "عقرب", "ذئب"
];

const STAGES = [
  "```\n  ___\n |   |\n |\n |\n |\n_|_```",
  "```\n  ___\n |   |\n |   O\n |\n |\n_|_```",
  "```\n  ___\n |   |\n |   O\n |   |\n |\n_|_```",
  "```\n  ___\n |   |\n |   O\n |  /|\n |\n_|_```",
  "```\n  ___\n |   |\n |   O\n |  /|\\\n |\n_|_```",
  "```\n  ___\n |   |\n |   O\n |  /|\\\n |  /\n_|_```",
  "```\n  ___\n |   |\n |   O\n |  /|\\\n |  / \\\n_|_\n💀 انتهى!```"
];

module.exports.config = {
  name: "شنقة",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "سونغ",
  description: "لعبة الشنقة — خمن الكلمة قبل أن تنتهي المحاولات (+5 نقاط)",
  commandCategory: "الملاك",
  usages: "شنقة",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  if (global.malakGames[threadID]?.active) {
    return api.sendMessage("⚠️ يوجد لعبة جارية! انتهِ منها أولاً", threadID, messageID);
  }

  const word = words[Math.floor(Math.random() * words.length)];
  const letters = Array.from(word);
  const hidden = letters.map(() => "_");

  global.malakGames[threadID] = {
    type: "hangman",
    word,
    letters,
    hidden,
    guessed: [],
    wrong: 0,
    active: true
  };

  const display = hidden.join(" ");

  return api.sendMessage(
    `🎯 لعبة الشنقة\n` +
    `━━━━━━━━━━━━━━━\n` +
    STAGES[0] + "\n\n" +
    `🔤 الكلمة: ${display}\n` +
    `📝 عدد الحروف: ${letters.length}\n\n` +
    `💡 أرسل حرفاً واحداً للتخمين!\n` +
    `❤️ المحاولات المتبقية: 6\n` +
    `🏅 الفوز = +5 نقاط`,
    threadID,
    messageID
  );
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, body, senderID, messageID } = event;
  if (!body || event.type !== "message") return;
  const game = global.malakGames[threadID];
  if (!game || !game.active || game.type !== "hangman") return;

  const input = body.trim();

  if (input === game.word) {
    game.active = false;
    let name = senderID;
    try {
      const info = await api.getUserInfo(senderID);
      name = info[senderID]?.name || senderID;
    } catch {}
    const pts = addPoints(senderID, 5);
    return api.sendMessage(
      `🎉 عبقري! خمّن الكلمة كاملة!\n` +
      `━━━━━━━━━━━━━━━\n` +
      `👑 ${name}\n🔤 الكلمة: ${game.word}\n🏅 +5 نقاط! مجموعك: ${pts} نقطة`,
      threadID, messageID
    );
  }

  if (Array.from(input).length !== 1) return;
  const letter = input[0];

  if (game.guessed.includes(letter)) {
    return api.sendMessage(`⚠️ حرف "${letter}" جرّبته من قبل!`, threadID, messageID);
  }

  game.guessed.push(letter);
  let found = false;

  game.letters.forEach((ch, i) => {
    if (ch === letter) { game.hidden[i] = ch; found = true; }
  });

  if (!found) game.wrong++;

  const display = game.hidden.join(" ");
  const stage = STAGES[Math.min(game.wrong, 6)];
  const remaining = 6 - game.wrong;

  if (!game.hidden.includes("_")) {
    game.active = false;
    let name = senderID;
    try {
      const info = await api.getUserInfo(senderID);
      name = info[senderID]?.name || senderID;
    } catch {}
    const pts = addPoints(senderID, 5);
    return api.sendMessage(
      `🎉 فزت! الكلمة: ${game.word}\n` +
      `━━━━━━━━━━━━━━━\n` +
      `👑 ${name}\n🏅 +5 نقاط! مجموعك: ${pts} نقطة`,
      threadID, messageID
    );
  }

  if (game.wrong >= 6) {
    game.active = false;
    return api.sendMessage(
      `${stage}\n\n💀 خسرت! الكلمة كانت: ${game.word}`,
      threadID, messageID
    );
  }

  return api.sendMessage(
    `${found ? "✅" : "❌"} حرف "${letter}" ${found ? "موجود!" : "غير موجود!"}\n` +
    `━━━━━━━━━━━━━━━\n` +
    stage + "\n\n" +
    `🔤 ${display}\n` +
    `❤️ متبقي: ${remaining} محاولة\n` +
    `🔡 جُرِّب: ${game.guessed.join(" ")}`,
    threadID, messageID
  );
};
