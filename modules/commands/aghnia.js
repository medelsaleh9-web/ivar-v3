const ytSearch = require("youtube-search-api");
const ytdl = require("ytdl-core");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

module.exports.config = {
  name: "اغنية",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "سونغ",
  description: "البحث عن أغنية وإرسالها كمقطع صوتي",
  commandCategory: "الملاك",
  usages: "اغنية [اسم الأغنية]",
  cooldowns: 15
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  if (!args[0]) {
    return api.sendMessage(
      `🎵 أمر البحث عن الأغاني\n` +
      `━━━━━━━━━━━━━━━\n` +
      `الاستخدام: "اغنية [اسم الأغنية]\n` +
      `مثال: "اغنية ماشي الحال\n` +
      `مثال: "اغنية shape of you`,
      threadID,
      messageID
    );
  }

  const query = args.join(" ").trim();

  const waitMsg = await new Promise(r => api.sendMessage(
    `🔍 جارٍ البحث عن: ${query}\n⏳ يرجى الانتظار...`,
    threadID,
    (err, info) => r(info)
  ));

  try {
    const results = await ytSearch.GetListByKeyword(query, false, 5);
    const items = results?.items || [];

    if (!items.length) {
      api.unsendMessage(waitMsg?.messageID).catch(() => {});
      return api.sendMessage(`❌ لم أجد أغنية باسم: ${query}`, threadID, messageID);
    }

    const video = items.find(i => i.type === "video") || items[0];
    const videoID = video.id;
    const title = video.title || query;
    const duration = video.length?.simpleText || "?";

    const videoUrl = `https://www.youtube.com/watch?v=${videoID}`;
    const tmpPath = path.join(os.tmpdir(), `song_${videoID}_${Date.now()}.mp3`);

    const audioStream = ytdl(videoUrl, {
      filter: "audioonly",
      quality: "highestaudio",
      requestOptions: {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      }
    });

    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(tmpPath);
      audioStream.pipe(writeStream);
      audioStream.on("error", reject);
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
      setTimeout(() => reject(new Error("timeout")), 60000);
    });

    api.unsendMessage(waitMsg?.messageID).catch(() => {});

    await api.sendMessage(
      {
        body:
          `🎵 ${title}\n` +
          `━━━━━━━━━━━━━━━\n` +
          `⏱️ المدة: ${duration}\n` +
          `🎶 استمتع بالأغنية!`,
        attachment: fs.createReadStream(tmpPath)
      },
      threadID,
      messageID
    );

    fs.unlink(tmpPath, () => {});
  } catch (err) {
    api.unsendMessage(waitMsg?.messageID).catch(() => {});
    return api.sendMessage(
      `❌ حصل خطأ أثناء تحميل الأغنية!\n` +
      `💡 جرب اسماً مختلفاً أو أغنية أخرى`,
      threadID,
      messageID
    );
  }
};
