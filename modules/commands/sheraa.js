const { getPoints, setPoints } = require('./data/points_helper');

const ITEMS = {
  "صلاحية": {
    label: "🔑 صلاحية ادمن البوت",
    price: 100,
    nickname: null,
    description: "تحكم كامل بأوامر البوت في الكروب"
  },
  "تاج": {
    label: "👑 تاج ملكي",
    price: 50,
    nickname: "👑 ملك الكروب",
    description: "كنية مميزة في الكروب"
  },
  "vip": {
    label: "💎 لقب VIP",
    price: 80,
    nickname: "💎 VIP",
    description: "كنية VIP في الكروب"
  },
  "نجم": {
    label: "⭐ لقب نجم",
    price: 60,
    nickname: "⭐ نجم الكروب",
    description: "كنية نجم الكروب"
  },
  "محبوب": {
    label: "🌹 لقب محبوب",
    price: 40,
    nickname: "🌹 محبوب الكروب",
    description: "كنية محبوب الكروب"
  },
  "اسطوري": {
    label: "🔥 لقب اسطوري",
    price: 120,
    nickname: "🔥 الاسطوري",
    description: "كنية اسطورية في الكروب"
  }
};

module.exports.config = {
  name: "شراء",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "سونغ",
  description: "شراء المنتجات من سوق الملاك بالنقاط",
  commandCategory: "الملاك",
  usages: "شراء [اسم المنتج]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  const itemKey = args.join(" ").trim().toLowerCase();

  if (!itemKey || !ITEMS[itemKey]) {
    const list = Object.entries(ITEMS).map(([k, v]) => `  ${v.label} — ${v.price} نقطة → "شراء ${k}`).join("\n");
    return api.sendMessage(
      `🛒 سوق الملاك\n` +
      `━━━━━━━━━━━━━━━\n` +
      `📦 المتاح للشراء:\n${list}\n\n` +
      `💡 مثال: "شراء تاج`,
      threadID,
      messageID
    );
  }

  const item = ITEMS[itemKey];
  const points = getPoints(senderID);

  if (points < item.price) {
    return api.sendMessage(
      `❌ نقاطك غير كافية!\n` +
      `━━━━━━━━━━━━━━━\n` +
      `🏅 نقاطك الحالية: ${points}/${item.price}\n` +
      `💡 العب الألعاب لتجمع المزيد!`,
      threadID,
      messageID
    );
  }

  let name = senderID;
  try {
    const info = await api.getUserInfo(senderID);
    name = info[senderID]?.name || senderID;
  } catch {}

  setPoints(senderID, points - item.price);

  if (item.nickname) {
    try {
      await api.changeNickname(item.nickname, threadID, senderID);
    } catch {}
  } else if (itemKey === "صلاحية") {
    const { getState, saveState } = require('./data/points_helper');
    const state = getState();
    if (!state.botAdmins) state.botAdmins = {};
    if (!state.botAdmins[threadID]) state.botAdmins[threadID] = [];
    if (!state.botAdmins[threadID].includes(senderID)) {
      state.botAdmins[threadID].push(senderID);
      saveState(state);
    }
  }

  return api.sendMessage(
    `✅ تم الشراء بنجاح!\n` +
    `━━━━━━━━━━━━━━━\n` +
    `👤 ${name}\n` +
    `${item.label}\n` +
    `📝 ${item.description}\n` +
    `💰 تم خصم ${item.price} نقطة — متبقي: ${points - item.price} نقطة`,
    threadID,
    messageID
  );
};
