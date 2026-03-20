const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "leaveNoti",
  eventType: ["log:unsubscribe"],
  version: "2.0.0",
  credits: "سونغ",
  description: "رسالة وداع مع صورة عند خروج أحد"
};

const LOCAL_IMG = path.join(__dirname, "../commands/cache/crowley.jpg");

async function sendWithImage(api, threadID, body) {
    return new Promise((resolve) => {
        api.sendMessage(
            { body, attachment: fs.createReadStream(LOCAL_IMG) },
            threadID,
            () => resolve()
        );
    });
}

module.exports.run = async function ({ api, event }) {
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
