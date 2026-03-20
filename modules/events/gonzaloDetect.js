if (!global.gonzaloTracker) global.gonzaloTracker = {};

const phrases = [
  "اتى الزعيم 𝑮𝒐𝒏𝒛𝒂𝒍𝒐... 👑",
  "🔱 𝑮𝒐𝒏𝒛𝒂𝒍𝒐 عاد للميدان... احذروا 👑",
  "👑 الملك موجود... 𝑮𝒐𝒏𝒛𝒂𝒍𝒐 دخل الكروب 🔱",
  "⚡ اتى الزعيم 𝑮𝒐𝒏𝒛𝒂𝒍𝒐... الجميع في خدمته 👑",
  "🌟 𝑮𝒐𝒏𝒛𝒂𝒍𝒐 هنا... الكروب اكتمل 👑✨"
];

module.exports.config = {
  name: "gonzaloDetect",
  eventType: ["message"],
  version: "1.0.0",
  credits: "سونغ",
  description: "يرصد ظهور الزعيم غونزالو بعد 15 رسالة غياب"
};

module.exports.run = async function ({ api, event }) {
  const { threadID, senderID } = event;
  if (!event.body) return;

  const ADMINBOT = global.config?.ADMINBOT || [];
  if (ADMINBOT.length === 0) return;

  if (!global.gonzaloTracker[threadID]) {
    global.gonzaloTracker[threadID] = { count: 0 };
  }

  const tracker = global.gonzaloTracker[threadID];
  const isGonzalo = ADMINBOT.includes(senderID);

  if (isGonzalo) {
    if (tracker.count >= 15) {
      const msg = phrases[Math.floor(Math.random() * phrases.length)];
      api.sendMessage(msg, threadID);
    }
    tracker.count = 0;
  } else {
    tracker.count = (tracker.count || 0) + 1;
  }
};
