const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const os = require("os");

if (!global.atimeIntervals) global.atimeIntervals = {};

module.exports.config = {
  name: "اتايم",
  version: "2.0.0",
  hasPermssion: 1,
  credits: "كاڪو",
  description: "إرسال رسالة أو صورة تلقائياً كل X ثوان (رد على الرسالة أو الصورة المراد إرسالها)",
  commandCategory: "الملاك",
  usages: "اتايم [ثوان] | اتايم توقف",
  cooldowns: 0
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageReply } = event;
  const sub = args[0];

  if (sub === "توقف") {
    if (global.atimeIntervals[threadID]) {
      clearInterval(global.atimeIntervals[threadID].timer);
      const tmpFiles = global.atimeIntervals[threadID].tmpFiles || [];
      tmpFiles.forEach(f => fs.unlink(f, () => {}));
      delete global.atimeIntervals[threadID];
      return api.sendMessage("✅ تم إيقاف الإرسال التلقائي", threadID);
    } else {
      return api.sendMessage("⚠️ لا يوجد إرسال تلقائي نشط!", threadID);
    }
  }

  const seconds = parseInt(sub);
  if (isNaN(seconds) || seconds < 1) {
    return api.sendMessage(
      `⏱️ اتايم\n━━━━━━━━━━━━━━━\n` +
      `الاستخدام:\n` +
      `"اتايم [ثوان] — مع رد على رسالة أو صورة\n` +
      `"اتايم توقف — لإيقاف الإرسال\n\n` +
      `مثال: "اتايم 30\n` +
      `⚠️ الحد الأدنى: 5 ثوان`,
      threadID
    );
  }

  if (seconds < 5) {
    return api.sendMessage("⚠️ أقل مدة مسموحة هي 5 ثوان!", threadID);
  }

  if (!messageReply) {
    return api.sendMessage(
      "⚠️ يرجى الرد على الرسالة أو الصورة التي تريد إرسالها تلقائياً!",
      threadID
    );
  }

  const msgBody = messageReply.body || "";
  const attachments = messageReply.attachments || [];
  const imageAttachments = attachments.filter(a =>
    a.type === "photo" || a.type === "sticker" || a.type === "animated_image" ||
    (a.mimeType && a.mimeType.startsWith("image/"))
  );

  if (!msgBody && imageAttachments.length === 0) {
    return api.sendMessage("⚠️ الرسالة المردود عليها لا تحتوي نصاً أو صورة!", threadID);
  }

  if (global.atimeIntervals[threadID]) {
    clearInterval(global.atimeIntervals[threadID].timer);
    const tmpFiles = global.atimeIntervals[threadID].tmpFiles || [];
    tmpFiles.forEach(f => fs.unlink(f, () => {}));
  }

  let localImagePaths = [];

  if (imageAttachments.length > 0) {
    await api.sendMessage("⏳ جارٍ تحضير الصور...", threadID);
    for (const att of imageAttachments) {
      const imgUrl = att.largePreviewUrl || att.previewUrl || att.url || att.playableUrl;
      if (!imgUrl) continue;
      try {
        const tmpPath = path.join(os.tmpdir(), `atime_img_${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`);
        const res = await axios.get(imgUrl, { responseType: "arraybuffer", timeout: 15000 });
        fs.writeFileSync(tmpPath, Buffer.from(res.data));
        localImagePaths.push(tmpPath);
      } catch {}
    }
  }

  const hasImages = localImagePaths.length > 0;
  const typeLabel = hasImages && msgBody ? "رسالة + صورة" : hasImages ? "صورة" : "رسالة";

  await api.sendMessage(
    `✅ سيتم إرسال ${typeLabel} كل ${seconds} ثانية\n` +
    `⏹️ اكتب "اتايم توقف لإيقافه`,
    threadID
  );

  const timer = setInterval(async () => {
    try {
      if (hasImages) {
        const streams = localImagePaths
          .filter(p => fs.existsSync(p))
          .map(p => fs.createReadStream(p));
        if (streams.length > 0) {
          await api.sendMessage({ body: msgBody || "", attachment: streams }, threadID);
        } else if (msgBody) {
          await api.sendMessage(msgBody, threadID);
        }
      } else if (msgBody) {
        await api.sendMessage(msgBody, threadID);
      }
    } catch {}
  }, seconds * 1000);

  global.atimeIntervals[threadID] = { timer, tmpFiles: localImagePaths };
};
