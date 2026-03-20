module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "3.0.0",
    credits: "سونغ",
    description: "رسالة ترحيب عند دخول أحد، وتفعيل الملاك عند إضافته"
};

module.exports.run = async function ({ api, event, Users }) {
    const { threadID, logMessageData } = event;
    const botID = api.getCurrentUserID();
    const botAdded = logMessageData.addedParticipants.some(p => p.userFbId == botID);

    if (botAdded) {
        await api.changeNickname(`[الملاك • 👑🪽]`, threadID, botID).catch(() => {});
        return api.sendMessage(
            `💎👑 تم تفعيل الملاك الكريستالي الازرق\n` +
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

    return api.sendMessage(
        `╔══════════════════╗\n` +
        `   👑 مرحباً يا ${nameArray.join(", ")} 🪽\n` +
        `╚══════════════════╝\n\n` +
        `أهلاً وسهلاً بك في: ${threadInfo.threadName || "الكروب"}\n` +
        `أنت العضو رقم: ${threadInfo.participantIDs.length}\n\n` +
        `👑🪽 الملاك يرحب بك`,
        threadID
    );
};
