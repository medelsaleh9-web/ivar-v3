function analyzePersonality(name) {
  const n = Array.from(name).reduce((sum, ch) => sum + (ch.charCodeAt(0) || 0), 0);
  const seed = n % 10;

  const traits = [
    { title: "القائد الجريء 👑", desc: "شخص قوي وحاسم، يقود الآخرين بثقة ولا يخشى التحديات. قلبك كبير وطموحاتك أكبر!" },
    { title: "المبدع الحالم 🎨", desc: "شخص خيالي ومبدع، يرى العالم بطريقة مختلفة. أفكارك فريدة ونظرتك للحياة ملهمة!" },
    { title: "الصادق الوفي 💎", desc: "شخص أمين ووفي، أصدقاؤك يثقون بك لأنك لا تخذل أحداً. قيمتك الحقيقية في وفائك!" },
    { title: "العطوف المحب 🌹", desc: "شخص طيب القلب يحب مساعدة الآخرين. الناس يشعرون بالدفء بقربك دائماً!" },
    { title: "الحكيم المتأمل 🦉", desc: "شخص عميق التفكير، يتحدث بحكمة ويفكر قبل أن يتصرف. كلماتك تأثيرها كبير!" },
    { title: "المرح الاجتماعي 🎉", desc: "شخص خفيف الظل ومحبوب، حضورك يضيف فرحة لأي مكان. لا أحد يملّ معك!" },
    { title: "المثابر الصبور ⛰️", desc: "شخص لا يستسلم أبداً، يواجه الصعاب بصدر رحب. النجاح حليفك دائماً!" },
    { title: "الذكي الحساب 🧠", desc: "شخص ذكي وعملي، يحل المشاكل بسرعة وبطريقة منطقية. عقلك كنز نادر!" },
    { title: "الشجاع المقدام ⚔️", desc: "شخص لا يخاف ويواجه كل شيء بجرأة. الآخرون يستمدون شجاعتهم منك!" },
    { title: "الرومانسي الحالم 🌙", desc: "شخص يؤمن بالجمال في كل شيء، قلبك حساس ومشاعرك عميقة وصادقة!" }
  ];

  return traits[seed];
}

module.exports.config = {
  name: "شخصيتك",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "كاڪو",
  description: "تحليل شخصيتك بناءً على اسمك",
  commandCategory: "الملاك",
  usages: "شخصيتك [اسمك]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  let inputName = args.join(" ").trim();

  if (!inputName) {
    try {
      const info = await api.getUserInfo(senderID);
      inputName = info[senderID]?.name || "مجهول";
    } catch {
      inputName = "مجهول";
    }
  }

  const result = analyzePersonality(inputName);
  const bars = "█".repeat(7) + "░".repeat(3);

  return api.sendMessage(
    `🔮 تحليل شخصية ${inputName}\n` +
    `━━━━━━━━━━━━━━━\n` +
    `🏷️ نوع شخصيتك:\n` +
    `${result.title}\n\n` +
    `📊 قوة الشخصية:\n` +
    `${bars} 70%\n\n` +
    `📝 تفاصيل:\n` +
    `${result.desc}\n` +
    `━━━━━━━━━━━━━━━\n` +
    `✨ هذا التحليل للترفيه فقط 😄`,
    threadID,
    messageID
  );
};
