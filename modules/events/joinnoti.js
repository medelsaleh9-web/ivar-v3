const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "2.0.0",
    credits: "سونغ",
    description: "رسالة ترحيب مع صورة عند دخول أحد"
};

const CHROLLO_IMG = "https://i.imgur.com/8VEmBaT.jpeg";

async function sendWithImage(api, threadID, body) {
    const tmpPath = path.join(__dirname, `../commands/cache/chrollo_${Date.now()}.jpg`);
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
    const { threadID, logMessageData } = event;
    const botID = api.getCurrentUserID();
    const botAdded = logMessageData.addedParticipants.some(p => p.userFbId == botID);

    if (botAdded) {
        await api.changeNickname(
            `[الملاك • 👑🪽]`,
            threadID,
            botID
        );
        await sendWithImage(api, threadID, `[𝐊𝐞̂́𝐭 𝐍𝐨̂́𝐢 𝐓𝐡𝐚̀𝐧𝐡 𝐂𝐨̂𝐧𝐠]\n👑 البوت: الملاك\n🪽 المطور: سونغ\nاكتب اوامر لعرض الأوامر المتاحة`);
        return;
    }

    const nameArray = [];
    const mentions = [];

    for (const p of logMessageData.addedParticipants) {
        if (p.userFbId == botID) continue;
        const userName = p.fullName;
        nameArray.push(userName);
        mentions.push({ tag: userName, id: p.userFbId });

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

    const welcomeBody = `╔══════════════════╗
   👑 مرحباً يا ${nameArray.join(", ")} 🪽
╚══════════════════╝

أهلاً وسهلاً بك في: ${threadInfo.threadName || "الكروب"}
أنت العضو رقم: ${threadInfo.participantIDs.length}

👑🪽 الملاك يرحب بك`;

    await sendWithImage(api, threadID, welcomeBody);
};
