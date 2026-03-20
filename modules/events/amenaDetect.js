if (!global.amenaTracker) global.amenaTracker = {};

const AMENA_USERNAME = "moonmui606";

const phrases = [
  "امينة حلوة ومزة❤✨",
  "امينة رجعت! حلوة ومزة دايماً ❤️✨",
  "وأخيراً امينة موجودة 🌸 ما في أحلى منها ❤️✨",
  "امينة❤ كانت غايبة وين؟ المهم رجعت حلوة ومزة ✨",
  "تشرف الكروب بوجودك يا امينة ❤️✨ حلوة ومزة"
];

module.exports.config = {
  name: "amenaDetect",
  eventType: ["message"],
  version: "1.0.0",
  credits: "سونغ",
  description: "يرصد ظهور moonmui606 بعد 15 رسالة غياب"
};

module.exports.run = async function ({ api, event }) {
  const { threadID, senderID } = event;
  if (!event.body) return;

  if (!global.amenaTracker[threadID]) {
    global.amenaTracker[threadID] = { count: 0, amenaUID: null };
  }

  const tracker = global.amenaTracker[threadID];

  try {
    const userInfo = await api.getUserInfo(senderID);
    const profile = userInfo[senderID];
    const vanity = profile?.vanity || profile?.username || "";

    if (vanity === AMENA_USERNAME || (profile?.name || "").toLowerCase().includes("moonmui")) {
      if (!tracker.amenaUID) tracker.amenaUID = senderID;
    }
  } catch {}

  if (tracker.amenaUID && senderID === tracker.amenaUID) {
    if (tracker.count >= 15) {
      const msg = phrases[Math.floor(Math.random() * phrases.length)];
      api.sendMessage(msg, threadID);
    }
    tracker.count = 0;
  } else {
    tracker.count = (tracker.count || 0) + 1;
  }
};
