const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "5.0.0",
    credits: "سونغ",
    description: "رسالة ترحيب مع صورة عند دخول أحد، وتفعيل الملاك عند إضافته"
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

module.exports.run = async function ({ api, event, Users }) {
    const { threadID, logMessageData } = event;
    const botID = api.getCurrentUserID();
    const botAdded = logMessageData.addedParticipants.some(p => p.userFbId == botID);

    if (botAdded) {
        await api.changeNickname(`[👑]  • الملاك الكريستالي`, threadID, botID).catch(() => {});
        return api.sendMessage(
            `💎👑 تم تفعيل الملاك الكريستالي\n` +
            `━━━━━━━━━━━━━━━\n` +
            `🤖 البوت: الملاك\n` +
            `👨‍💻 المطور: سونغ\n` +
            `📌 اكتب "اوامر لعرض الأوامر`,
            threadID
        );
    }

    const nameArray = [];
    for (const p of logMessageData.addedParticipants) {
        if (p.userFbId == botID) continue;
        const userName = p.fullName;
        nameArray.push(userName);
        if (Users && !global.data.allUserID.includes(p.userFbId)) {
            try {
                await Users.createData(p.userFbId, { name: userName, data: {} });
                global.data.userName.set(p.userFbId, userName);
                global.data.allUserID.push(p.userFbId);
            } catch {}
        }
    }

    if (nameArray.length === 0) return;

    let threadInfo;
    try { threadInfo = await api.getThreadInfo(threadID); } catch { return; }

    const body =
        `╔══════════════════╗\n` +
        `   👑 مرحباً يا ${nameArray.join(", ")} 🪽\n` +
        `╚══════════════════╝\n\n` +
        `أهلاً وسهلاً بك في: ${threadInfo.threadName || "الكروب"}\n` +
        `أنت العضو رقم: ${threadInfo.participantIDs.length}\n\n` +
        `👑🪽 الملاك يرحب بك`;

    return sendWithImage(api, threadID, body);
};
