const designs = {
  "ناروتو": "https://www.youtube.com/results?search_query=ناروتو+تصميم+فيديو",
  "ساسكي": "https://www.youtube.com/results?search_query=ساسكي+تصميم+فيديو",
  "غوكو": "https://www.youtube.com/results?search_query=غوكو+Dragon+Ball+تصميم",
  "ليفاي": "https://www.youtube.com/results?search_query=ليفاي+اكيرمان+تصميم",
  "ايتادوري": "https://www.youtube.com/results?search_query=يوجي+ايتادوري+تصميم",
  "زورو": "https://www.youtube.com/results?search_query=زورو+one+piece+تصميم",
  "لوفي": "https://www.youtube.com/results?search_query=لوفي+one+piece+تصميم",
  "دميان": "https://www.youtube.com/results?search_query=داميان+spy+family+تصميم",
  "توجيرو": "https://www.youtube.com/results?search_query=توجيرو+demon+slayer+تصميم",
  "رينغوكو": "https://www.youtube.com/results?search_query=رينغوكو+demon+slayer+تصميم",
  "ايزاوا": "https://www.youtube.com/results?search_query=شوتا+ايزاوا+my+hero+تصميم",
  "باكوغو": "https://www.youtube.com/results?search_query=باكوغو+my+hero+academia+تصميم",
  "ديدارا": "https://www.youtube.com/results?search_query=ديدارا+ناروتو+تصميم",
  "اوبيتو": "https://www.youtube.com/results?search_query=اوبيتو+ناروتو+تصميم",
  "ايتاشي": "https://www.youtube.com/results?search_query=ايتاشي+ناروتو+تصميم",
  "جيرايا": "https://www.youtube.com/results?search_query=جيرايا+ناروتو+تصميم",
  "ميكاسا": "https://www.youtube.com/results?search_query=ميكاسا+attack+on+titan+تصميم",
  "ارمين": "https://www.youtube.com/results?search_query=ارمين+attack+on+titan+تصميم",
  "إيرين": "https://www.youtube.com/results?search_query=ايرين+attack+on+titan+تصميم",
  "اكواا": "https://www.youtube.com/results?search_query=اكواا+konosuba+تصميم"
};

module.exports.config = {
  name: "تصميمات",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "كاڪو",
  description: "إرسال رابط تصميم فيديو لشخصية انمي",
  commandCategory: "الملاك",
  usages: "تصميمات [اسم الشخصية]",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  if (!args[0]) {
    const list = Object.keys(designs).join(" | ");
    return api.sendMessage(
      `🎨 تصميمات الشخصيات\n` +
      `━━━━━━━━━━━━━━━\n` +
      `الاستخدام: "تصميمات [اسم الشخصية]\n\n` +
      `📋 الشخصيات المتاحة:\n${list}`,
      threadID,
      messageID
    );
  }

  const name = args.join(" ").trim();
  const link = designs[name];

  if (!link) {
    const list = Object.keys(designs).join(" | ");
    return api.sendMessage(
      `❌ لم أجد تصاميم لـ "${name}"\n\n` +
      `📋 الشخصيات المتاحة:\n${list}`,
      threadID,
      messageID
    );
  }

  return api.sendMessage(
    `🎨 تصميمات ${name}\n` +
    `━━━━━━━━━━━━━━━\n` +
    `🎬 روابط فيديوهات تصميم ${name}:\n` +
    `${link}\n\n` +
    `✨ استمتع بأجمل التصاميم!`,
    threadID,
    messageID
  );
};
