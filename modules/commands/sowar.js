const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

module.exports.config = {
  name: "صور",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "سونغ",
  description: "البحث عن صور من Pinterest وإرسالها",
  commandCategory: "الملاك",
  usages: "صور [اسم]",
  cooldowns: 5
};

async function searchPinterest(query) {
  const url = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}&rs=typed`;
  const res = await axios.get(url, {
    timeout: 12000,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5"
    }
  });

  const imgMatches = res.data.match(/"orig":\{"url":"(https:\/\/i\.pinimg\.com\/originals\/[^"]+)"/g);
  if (imgMatches && imgMatches.length > 0) {
    const idx = Math.floor(Math.random() * Math.min(imgMatches.length, 10));
    const url = imgMatches[idx].match(/"orig":\{"url":"([^"]+)"/)[1];
    return url;
  }

  const img736 = res.data.match(/"736x":\{"url":"(https:\/\/i\.pinimg\.com[^"]+)"/g);
  if (img736 && img736.length > 0) {
    const idx = Math.floor(Math.random() * Math.min(img736.length, 10));
    return img736[idx].match(/"736x":\{"url":"([^"]+)"/)[1];
  }

  const anyPinImg = res.data.match(/https:\/\/i\.pinimg\.com\/[^\s"']+\.(jpg|jpeg|png|webp)/gi);
  if (anyPinImg && anyPinImg.length > 0) {
    return anyPinImg[Math.floor(Math.random() * Math.min(anyPinImg.length, 10))];
  }

  return null;
}

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

  await api.sendMessage(`🔍 جاري البحث في Pinterest عن: ${query}...`, threadID, messageID);

  try {
    let imageUrl = await searchPinterest(query);

    if (!imageUrl) {
      const altRes = await axios.get(`https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`, {
        timeout: 10000,
        headers: {
          "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
        }
      });
      const imgs = altRes.data.match(/https:\/\/i\.pinimg\.com\/[^\s"'<>]+\.(jpg|jpeg|png)/gi);
      if (imgs && imgs.length > 0) {
        imageUrl = imgs[Math.floor(Math.random() * Math.min(imgs.length, 10))];
      }
    }

    if (!imageUrl) {
      return api.sendMessage(`❌ لم أجد صور لـ "${query}" في Pinterest، جرب كلمة أخرى`, threadID, messageID);
    }

    const imgRes = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 15000,
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://www.pinterest.com/"
      }
    });

    const tmpFile = path.join(os.tmpdir(), `sowar_${Date.now()}.jpg`);
    fs.writeFileSync(tmpFile, Buffer.from(imgRes.data));

    await api.sendMessage(
      {
        body: `🖼️ ${query}\n📌 Pinterest`,
        attachment: fs.createReadStream(tmpFile)
      },
      threadID,
      messageID
    );

    fs.unlink(tmpFile).catch(() => {});
  } catch (err) {
    return api.sendMessage(`❌ فشل جلب الصور من Pinterest، حاول لاحقاً`, threadID, messageID);
  }
};
