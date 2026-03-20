const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports.config = {
  name: "leaveNoti",
  eventType: ["log:unsubscribe"],
  version: "2.0.0",
  credits: "سونغ",
  description: "رسالة وداع مع صورة عند خروج أحد"
};

const CHROLLO_IMG = "https://i.imgur.com/8VEmBaT.jpeg";

async function sendWithImage(api, threadID, body) {
    const tmpPath = path.join(__dirname, `../commands/cache/chrollo_leave_${Date.now()}.jpg`);
    return new Promise((resolve) => {
        request(CHROLLO_IMG)
            .pipe(fs.createWriteStream(tmpPath))
            .on("close", () => {
                api.sendMessage(
                    { body, attachment: fs.createReadStream(tmpPath) },
                    threadID,
                    () => {
                        try { fs.unlinkSync(tmpPath); } catch {}
                        resolve();
                    }
                );
            })
            .on("error", () => {
                api.sendMessage({ body }, threadID, () => resolve());
            });
    });
}

module.exports.run = async function ({ api, event, Users }) {
    if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

    const threadID = event.threadID;
    const iduser = event.logMessageData.leftParticipantFbId;
    const name = (global.data && global.data.userName && global.data.userName.get(iduser)) || iduser;
    const type = (event.author == iduser) ? "غادر الكروب" : "تم طرده من الكروب";

    const body = `╔══════════════════╗
   👋 وداعاً ${name}
╚══════════════════╝

${name} ${type} 💔
👑🪽 الملاك`;

    await sendWithImage(api, threadID, body);
};
