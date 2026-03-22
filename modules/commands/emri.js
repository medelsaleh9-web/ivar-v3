module.exports.config = {
  name: "عمري",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "كاڪو",
  description: "احسب عمرك من سنة ميلادك",
  commandCategory: "الملاك",
  usages: "عمري [سنة الميلاد]",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  if (!args[0]) {
    return api.sendMessage(
      `🎂 حاسبة العمر\n━━━━━━━━━━━━━━━\nالاستخدام: "عمري [سنة الميلاد]\nمثال: "عمري 2000`,
      threadID, messageID
    );
  }

  const year = parseInt(args[0]);
  const now = new Date();
  const currentYear = now.getFullYear();

  if (isNaN(year) || year < 1900 || year > currentYear) {
    return api.sendMessage(`❌ سنة غير صحيحة! أدخل سنة بين 1900 و${currentYear}`, threadID, messageID);
  }

  let name = senderID;
  try {
    const info = await api.getUserInfo(senderID);
    name = info[senderID]?.name || senderID;
  } catch {}

  const age = currentYear - year;
  const months = age * 12;
  const days = Math.floor(age * 365.25);
  const hours = days * 24;

  let zodiac = "";
  if (age >= 18 && age <= 25) zodiac = "أنت في أجمل مرحلة من حياتك 🌟";
  else if (age < 18) zodiac = "أنت شاب ولديك أمامك الكثير 🚀";
  else if (age >= 26 && age <= 35) zodiac = "أنت في مرحلة البناء والطموح 💪";
  else if (age >= 36 && age <= 50) zodiac = "أنت في مرحلة النضج والحكمة 👑";
  else zodiac = "الخبرة والحكمة زينة العمر 🌹";

  return api.sendMessage(
    `🎂 عمر ${name}\n` +
    `━━━━━━━━━━━━━━━\n` +
    `📅 سنة الميلاد: ${year}\n` +
    `🎉 عمرك: ${age} سنة\n` +
    `📆 بالأشهر: ${months.toLocaleString()} شهر\n` +
    `📅 بالأيام: ${days.toLocaleString()} يوم\n` +
    `⏰ بالساعات: ${hours.toLocaleString()} ساعة\n` +
    `━━━━━━━━━━━━━━━\n` +
    `✨ ${zodiac}`,
    threadID, messageID
  );
};
