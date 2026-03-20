const sentences = [
  "عيناك بحر وأنا غريق فيه 🌊💙",
  "ابتسامتك تضيء يومي أكثر من الشمس ☀️✨",
  "أنت الفكرة التي لا تغادر عقلي أبداً 💭💕",
  "قلبي يعرف اسمك قبل أن تعرفني ❤️",
  "لو كنت نجمة لاخترت أن تراني فقط أنت 🌟",
  "صوتك موسيقى لا أمل في نسيانها 🎵💞",
  "أنت ليس فقط جميلاً، أنت فتنة 💎🔥",
  "حين تبتسم ينسى العالم همومه 🌸",
  "روحي تجدك حتى في أحلامها 💫",
  "من رآك مرة واحدة لا ينساك طول العمر ❤️‍🔥",
  "عيونك فيها حكايا لم تُكتب بعد 📖💙",
  "أنت الفصل الذي أحببت فيه الحياة 🌺",
  "لو كل النجوم أُطفئت لأضاءك قلبي 🌙❤️",
  "في هدوئك سحر لا يُقاوم 🌿✨",
  "أنت أجمل ما تصورته خيالي 🎨💕"
];

module.exports.config = {
  name: "غزل",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "سونغ",
  description: "إرسال جملة غزل عشوائية",
  commandCategory: "الملاك",
  usages: "غزل",
  cooldowns: 3
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;
  const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
  return api.sendMessage(`💝 ${randomSentence}`, threadID, messageID);
};
