const moment = require("moment-timezone");
const pidusage = require("pidusage");
const { performance } = require("perf_hooks");

module.exports.config = {
  name: "uptime",
  version: "2.0.0",
  permission: 0,
  credits: "كاڪو",
  description: "يعرض وقت تشغيل البوت وحالته",
  prefix: true,
  category: "info",
  usages: "",
  cooldowns: 5,
  dependencies: {
    "moment-timezone": "latest",
    pidusage: "latest",
  },
};

module.exports.run = async ({ api, event }) => {
  try {
    const timeStart = performance.now();

    let cpuPercent = 0;
    let ramMB = 0;
    try {
      const usage = await pidusage(process.pid);
      cpuPercent = usage.cpu.toFixed(1);
      ramMB = (usage.memory / 1024 / 1024).toFixed(1);
    } catch (e) {}

    const timeEnd = performance.now();
    const ping = Math.round(timeEnd - timeStart);

    const uptimeSec = process.uptime();
    const days    = Math.floor(uptimeSec / 86400);
    const hours   = Math.floor((uptimeSec % 86400) / 3600);
    const minutes = Math.floor((uptimeSec % 3600) / 60);
    const seconds = Math.floor(uptimeSec % 60);

    let uptimeStr = "";
    if (days > 0)    uptimeStr += `${days} يوم `;
    if (hours > 0)   uptimeStr += `${hours} ساعة `;
    if (minutes > 0) uptimeStr += `${minutes} دقيقة `;
    uptimeStr += `${seconds} ثانية`;

    const now = moment().tz("Asia/Riyadh");
    const currentTime = now.format("hh:mm:ss A");
    const currentDate = now.format("DD/MM/YYYY");

    const totalCmds = global.client?.commands?.size || 0;
    const totalUsers = global.data?.allUserID?.length || 0;
    const totalGroups = global.data?.allThreadID?.length || 0;

    const bar = (value, max, length = 10) => {
      const filled = Math.round((value / max) * length);
      return "█".repeat(Math.min(filled, length)) + "░".repeat(Math.max(length - filled, 0));
    };

    const cpuBar = bar(parseFloat(cpuPercent), 100);
    const ramBar = bar(parseFloat(ramMB), 512);

    const msg =
`🌙 حالة البوت 🌙
✦━━━━━━━━━━━━━━━━━━━━✦

⏱️ وقت التشغيل
  ${uptimeStr}

📡 الاتصال
  البينج : ${ping} ms

🖥️ الموارد
  المعالج  : [${cpuBar}] ${cpuPercent}%
  الذاكرة  : [${ramBar}] ${ramMB} MB

📊 الإحصائيات
  الأوامر  : ${totalCmds} أمر
  المجموعات: ${totalGroups} مجموعة
  المستخدمون: ${totalUsers} مستخدم

🕒 الوقت الحالي
  ${currentTime}  —  ${currentDate}

✦━━━━━━━━━━━━━━━━━━━━✦
👑 البوت يعمل بكفاءة 💚`;

    return api.sendMessage(msg, event.threadID, event.messageID);
  } catch (error) {
    return api.sendMessage("❌ حدث خطأ أثناء جلب حالة البوت.", event.threadID, event.messageID);
  }
};
