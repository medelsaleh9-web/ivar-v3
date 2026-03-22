const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "leaveNoti",
    eventType: ["log:unsubscribe"],
    version: "3.0.0",
    credits: "كاڪو",
    description: "رسالة وداع مع صورة عند خروج أو طرد أحد"
};

const EVENT_IMG = path.join(__dirname, "../commands/cache/malak_event.jpg");

async function sendWithImage(api, threadID, body) {
    return new Promise((resolve) => {
        if (fs.existsSync(EVENT_IMG)) {
            api.sendMessage(
                { body, attachment: fs.createReadStream(EVENT_IMG) },
                threadID,
                () => resolve()
            );
        } else {
            api.sendMessage(body, threadID, () => resolve());
        }
    });
}

module.exports.run = async function ({ api, event }) {
    if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

    const threadID = event.threadID;
    const iduser = event.logMessageData.leftParticipantFbId;
    const name = (global.data && global.data.userName && global.data.userName.get(iduser)) || iduser;
    const type = (event.author == iduser) ? "غادر الكروب بإرادته" : "تم طرده من الكروب";

    const body =
        `╔══════════════════╗\n` +
        `   👋 وداعاً ${name}\n` +
        `╚══════════════════╝\n\n` +
        `${name} ${type} 💔\n` +
        `👑🪽 الملاك`;

    return sendWithImage(api, threadID, body);
};
