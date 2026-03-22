const axios = require("axios");

module.exports.config = {
  name: "بوت",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "كاڪو",
  description: "محادثة ذكاء اصطناعي مثل ChatGPT",
  commandCategory: "الملاك",
  usages: "بوت [سؤالك]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const question = args.join(" ").trim();

  if (!question) {
    return api.sendMessage("💬 اكتب سؤالك بعد كلمة بوت\nمثال: بوت ما هي عاصمة فرنسا؟", threadID, messageID);
  }

  try {
    const prompt = encodeURIComponent(
      `أنت مساعد ذكي باللغة العربية اسمك "الملاك". أجب على السؤال التالي بشكل مختصر وواضح: ${question}`
    );

    const response = await axios.get(
      `https://text.pollinations.ai/${prompt}`,
      { timeout: 30000, responseType: "text" }
    );

    const answer = (typeof response.data === "string" ? response.data : JSON.stringify(response.data)).trim();

    return api.sendMessage(`🤖 الملاك:\n\n${answer}`, threadID, messageID);
  } catch (err) {
    return api.sendMessage("❌ تعذّر الاتصال بالذكاء الاصطناعي، حاول مرة أخرى لاحقاً", threadID, messageID);
  }
};
