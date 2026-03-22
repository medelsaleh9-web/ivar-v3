const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

const PHOTO_STATE_PATH = path.join(__dirname, "data/groupPhoto.json");

function loadPhotoState() {
  try { return JSON.parse(fs.readFileSync(PHOTO_STATE_PATH, "utf-8")); }
  catch { return {}; }
}
function savePhotoState(s) {
  fs.ensureDirSync(path.dirname(PHOTO_STATE_PATH));
  fs.writeFileSync(PHOTO_STATE_PATH, JSON.stringify(s, null, 2));
}

module.exports.config = {
  name: "ريمو",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "كاڪو",
  description: "تعيين صورة الغروب من رد على صورة وحمايتها من التغيير",
  commandCategory: "الملاك",
  usages: "ريمو (رد على صورة) | ريمو ايقاف",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, messageReply } = event;

  if (args[0] === "ايقاف") {
    const state = loadPhotoState();
    delete state[threadID];
    savePhotoState(state);
    return api.sendMessage("🔓 تم إيقاف حماية صورة الغروب", threadID, messageID);
  }

  if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
    return api.sendMessage(
      `⚠️ الاستخدام:\nارد على صورة واكتب: "ريمو\n\nلإيقاف الحماية: "ريمو ايقاف`,
      threadID,
      messageID
    );
  }

  const attachment = messageReply.attachments.find(a =>
    a.type === "photo" || a.type === "sticker" || a.type === "image"
  );

  if (!attachment) {
    return api.sendMessage("❌ لم أجد صورة في الرسالة، تأكد أنك رددت على صورة", threadID, messageID);
  }

  const imageUrl = attachment.url || attachment.previewUrl || attachment.largePreviewUrl;
  if (!imageUrl) {
    return api.sendMessage("❌ لا يمكن الوصول للصورة", threadID, messageID);
  }

  try {
    await api.sendMessage("🔄 جاري تعيين صورة الغروب...", threadID, messageID);

    const imgRes = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 15000,
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const tmpFile = path.join(os.tmpdir(), `remo_${threadID}.jpg`);
    fs.writeFileSync(tmpFile, Buffer.from(imgRes.data));

    const savedPath = path.join(__dirname, "data", `groupphoto_${threadID}.jpg`);
    fs.ensureDirSync(path.dirname(savedPath));
    fs.copyFileSync(tmpFile, savedPath);

    await api.changeGroupImage(fs.createReadStream(tmpFile), threadID);

    const state = loadPhotoState();
    state[threadID] = { path: savedPath, url: imageUrl };
    savePhotoState(state);

    fs.unlink(tmpFile).catch(() => {});

    return api.sendMessage(
      `✅ تم تعيين صورة الغروب\n` +
      `🔒 الصورة محمية — أي تغيير سيُلغى تلقائياً\n` +
      `لإيقاف الحماية: "ريمو ايقاف`,
      threadID,
      messageID
    );
  } catch (err) {
    return api.sendMessage(`❌ فشل تعيين الصورة: ${err.message}`, threadID, messageID);
  }
};
