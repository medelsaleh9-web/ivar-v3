if (!global.atimeIntervals) global.atimeIntervals = {};

module.exports.config = {
  name: "اتايم",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "سونغ",
  description: "إرسال رسالة تلقائي كل X ثوان (رد على الرسالة المراد إرسالها)",
  commandCategory: "الملاك",
  usages: "اتايم [ثوان] | اتايم توقف",
  cooldowns: 0
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageReply } = event;
  const sub = args[0];

  if (sub === "توقف") {
    if (global.atimeIntervals[threadID]) {
      clearInterval(global.atimeIntervals[threadID]);
      delete global.atimeIntervals[threadID];
      return api.sendMessage("✅ تم إيقاف الإرسال التلقائي", threadID);
    } else {
      return api.sendMessage("لا يوجد إرسال تلقائي نشط!", threadID);
    }
  }

  const seconds = parseInt(sub);
  if (isNaN(seconds) || seconds < 1) {
    return api.sendMessage("يرجى كتابة عدد الثواني بشكل صحيح! مثال: اتايم 10", threadID);
  }

  if (!messageReply) {
    return api.sendMessage("يرجى الرد على الرسالة التي تريد إرسالها تلقائياً!", threadID);
  }

  const msgBody = messageReply.body || "";
  if (!msgBody) return api.sendMessage("الرسالة المردود عليها فارغة!", threadID);

  if (global.atimeIntervals[threadID]) {
    clearInterval(global.atimeIntervals[threadID]);
  }

  await api.sendMessage(`✅ سيتم إرسال الرسالة كل ${seconds} ثانية\nاكتب اتايم توقف لإيقافه`, threadID);

  global.atimeIntervals[threadID] = setInterval(() => {
    api.sendMessage(msgBody, threadID);
  }, seconds * 1000);
};
