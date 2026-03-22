const phrases = [
  "امينة حلوة ومزة وما في زيها ❤️✨",
  "امينة والله روحها حلوة وقلبها أحلى 🌸💕",
  "امينة مزة من الآخر ما عليها كلام 🔥❤️",
  "امينة ابتسامتها تضيء الكروب كله ☀️✨",
  "امينة ما في أحلى منها صراحة 💎❤️",
  "امينة حلوة وروحها أحلى من أي شيء 🌺💕",
  "امينة واللهي مزة وما في كلام ثاني 🔥🌟"
];

module.exports.config = {
  name: "امينة",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "كاڪو",
  description: "مدح امينة الحلوة",
  commandCategory: "الملاك",
  usages: "امينة",
  cooldowns: 3
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;
  const msg = phrases[Math.floor(Math.random() * phrases.length)];
  return api.sendMessage(msg, threadID, messageID);
};
