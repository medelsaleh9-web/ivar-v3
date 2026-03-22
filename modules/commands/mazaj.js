const moods = [
  { emoji: "😎", text: "مزاجك ملكي اليوم — كل شيء تلمسه يتحول لذهب 👑" },
  { emoji: "🔥", text: "مزاجك نار — لا أحد يقف في طريقك اليوم 🚀" },
  { emoji: "🌙", text: "مزاجك هادئ ومريح — يوم للراحة والتأمل ✨" },
  { emoji: "⚡", text: "مزاجك متوتر — خذ نفس عميق وكل شيء سيتحسن 💪" },
  { emoji: "🌺", text: "مزاجك رومانسي — قلبك مفتوح للحب والجمال ❤️" },
  { emoji: "😴", text: "مزاجك نعسان — جسمك يطلب منك الراحة 😪" },
  { emoji: "🎉", text: "مزاجك احتفالي — شارك سعادتك مع الجميع 🥳" },
  { emoji: "🤔", text: "مزاجك تفكيري — قرار كبير ينتظرك اليوم 💡" },
  { emoji: "😤", text: "مزاجك في الحضيض — لكن تذكر: العاصفة تنتهي دائماً ⛅" },
  { emoji: "🌊", text: "مزاجك عميق — أفكارك كبيرة وطموحاتك أكبر 🎯" }
];

module.exports.config = {
  name: "مزاج",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "كاڪو",
  description: "يخبرك مزاجك اليوم",
  commandCategory: "الملاك",
  usages: "مزاج",
  cooldowns: 3
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, senderID } = event;

  let name = senderID;
  try {
    const info = await api.getUserInfo(senderID);
    name = info[senderID]?.name || senderID;
  } catch {}

  const mood = moods[Math.floor(Math.random() * moods.length)];

  return api.sendMessage(
    `${mood.emoji} مزاج ${name} اليوم\n` +
    `━━━━━━━━━━━━━━━\n` +
    `${mood.text}`,
    threadID,
    messageID
  );
};
