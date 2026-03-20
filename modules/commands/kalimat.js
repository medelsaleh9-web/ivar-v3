const wordOfDay = [
  { word: "صمود", meaning: "الثبات والبقاء أمام الشدائد والمصاعب", example: "الصمود أمام الصعاب يكشف عن قوة الإنسان الحقيقية" },
  { word: "رفاهية", meaning: "الحياة الهنيئة الملؤها الراحة والنعمة", example: "الصحة نعمة لا تُقدّر ولا تُشترى بأي رفاهية" },
  { word: "إبداع", meaning: "ابتكار أفكار أو أعمال جديدة وأصيلة", example: "الإبداع لا يعرف عمراً ولا حدوداً" },
  { word: "وفاء", meaning: "الالتزام بالعهود والمحافظة على المودة", example: "الوفاء من أعلى صفات الإنسان الكريم" },
  { word: "شغف", meaning: "الحب الشديد والاهتمام القوي بشيء ما", example: "من يعمل بشغف لا يشعر أنه يعمل لحظة واحدة" },
  { word: "تناغم", meaning: "الانسجام والتوافق بين الأشياء", example: "التناغم بين الفريق يصنع المعجزات" },
  { word: "أفق", meaning: "الحد البعيد الذي يبدو أن الأرض والسماء تلتقيان فيه — مجازاً: المستقبل", example: "وسّع أفقك وستجد الحلول في كل مكان" }
];

module.exports.config = {
  name: "كلمة",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "سونغ",
  description: "كلمة اليوم مع معناها ومثال عليها",
  commandCategory: "الملاك",
  usages: "كلمة",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;
  const item = wordOfDay[Math.floor(Math.random() * wordOfDay.length)];

  return api.sendMessage(
    `📖 كلمة اليوم\n` +
    `━━━━━━━━━━━━━━━\n` +
    `✨ الكلمة: ${item.word}\n\n` +
    `📝 المعنى:\n${item.meaning}\n\n` +
    `💬 مثال:\n"${item.example}"`,
    threadID,
    messageID
  );
};
