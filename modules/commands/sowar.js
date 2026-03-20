const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

module.exports.config = {
  name: "صور",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "سونغ",
  description: "البحث عن صور وإرسالها في الكروب",
  commandCategory: "الملاك",
  usages: "صور [اسم]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  const query = args.join(" ").trim();
  if (!query) {
    return api.sendMessage(
      `🖼️ اكتب اسم ما تريد البحث عنه\nمثال: "صور شادو`,
      threadID,
      messageID
    );
  }

  await api.sendMessage(`🔍 جاري البحث عن صور: ${query}...`, threadID, messageID);

  try {
    const searchUrl = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&count=1&client_id=mhx1MVfB3yKJFGbWP3WMsTD2qhHjlGbzqxjijkLqdmE`;

    let imageUrl = null;

    try {
      const res = await axios.get(searchUrl, { timeout: 8000 });
      if (res.data && res.data.length > 0) {
        imageUrl = res.data[0].urls?.regular || res.data[0].urls?.full;
      }
    } catch {}

    if (!imageUrl) {
      const bingUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2&first=1`;
      const bingRes = await axios.get(bingUrl, {
        timeout: 8000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });

      const matches = bingRes.data.match(/murl&quot;:&quot;(https?:\/\/[^&"]+\.(jpg|jpeg|png|gif|webp))/gi);
      if (matches && matches.length > 0) {
        imageUrl = matches[0].replace('murl&quot;:&quot;', '');
      }
    }

    if (!imageUrl) {
      return api.sendMessage(`❌ لم أجد صور لـ "${query}"`, threadID, messageID);
    }

    const imgRes = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 15000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });

    const ext = imageUrl.split("?")[0].split(".").pop().split("/").pop() || "jpg";
    const tmpFile = path.join(os.tmpdir(), `sowar_${Date.now()}.${ext}`);
    fs.writeFileSync(tmpFile, Buffer.from(imgRes.data));

    await api.sendMessage(
      {
        body: `🖼️ صور: ${query}`,
        attachment: fs.createReadStream(tmpFile)
      },
      threadID,
      messageID
    );

    fs.unlink(tmpFile).catch(() => {});
  } catch (err) {
    return api.sendMessage(`❌ فشل جلب الصور، حاول لاحقاً`, threadID, messageID);
  }
};
