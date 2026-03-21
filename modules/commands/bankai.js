const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "بانكاي",
    version: "2.3.0",
    hasPermssion: 1,
    credits: "Anos",
    description: "طرد وإضافة عضو بشكل متكرر لمدة 40 ثانية مع رسائل إهانة عشوائية وصور كل 7 ثوانٍ",
    commandCategory: "admin",
    usages: "بانكاي (رد على رسالة شخص أو اكتب الأيدي)",
    cooldowns: 45
};

const RANDOM_MSGS = [
    "☠️ الـمـوت يـنـتـظـرك.. و Anos يـقـودك إلـيـه بـأصـفـاد الـذل",
    "🩸 تـحـت أقـدام الـزعيـم تـنـتـهـي أحـلامـك.. يـا حـ𝑺ـالـة الـبـشـريـة 🩸",
    "🌑 سـأجـعـل مـن صـراخـك سـيـمـفـونـيـة يـتراقـص عـلـيـهـا الـشـيـاطـيـن 🌑",
    "𓆩 ☠️ 𓆪 صـُنـعـت مـن ضـعـف.. و صـُنـعـتُ لأبـيـد أمـثـالـك 𓆩 ☠️ 𓆪",
    "🌀 أنـت مـجـرد رقـم فـي قـائـمـة ضـحـايـا Anos.. والـتـالـي سـيـكـون أسـوأ 🌀"
];

const INTERVAL_IMG = path.join(__dirname, 'cache', 'pankai_1.jpg');
const END_IMG = path.join(__dirname, 'cache', 'bankai_end.jpg');
const END_MSG = `الـزعـــيـــ🖤ــــم Anos انـتـهـى مـن إبـادتـك 🔥☠️`;

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, mentions } = event;
    const botID = String(api.getCurrentUserID());
    const ADMINBOT = global.config.ADMINBOT || [];

    let targetID = null;

    if (event.messageReply) {
        targetID = String(event.messageReply.senderID);
    } else if (Object.keys(mentions).length > 0) {
        targetID = String(Object.keys(mentions)[0]);
    } else if (args[0]) {
        targetID = String(args[0]);
    }

    if (!targetID) return api.sendMessage("❌ يجب الرد على رسالة شخص أو منشنته.", threadID, messageID);
    if (targetID === botID) return api.sendMessage("❌ لا يمكنني طرد نفسي!", threadID, messageID);
    if (ADMINBOT.includes(targetID)) return api.sendMessage("❌ لا يمكن جلد المطور!", threadID, messageID);

    await api.sendMessage("🔴 بدأ طقس التعذيب العنيف.. استعد للموت!", threadID);

    const endTime = Date.now() + 40000;
    let lastMessageTime = 0;

    while (Date.now() < endTime) {
        try {
            await api.removeUserFromGroup(targetID, threadID);
            await new Promise(res => setTimeout(res, 1200));
            await api.addUserToGroup(targetID, threadID);

            if (Date.now() - lastMessageTime >= 7000) {
                const randomMsg = RANDOM_MSGS[Math.floor(Math.random() * RANDOM_MSGS.length)];

                if (fs.existsSync(INTERVAL_IMG)) {
                    await api.sendMessage({ attachment: fs.createReadStream(INTERVAL_IMG) }, threadID);
                    await new Promise(res => setTimeout(res, 300));
                    await api.sendMessage(randomMsg, threadID);
                } else {
                    await api.sendMessage(randomMsg, threadID);
                }

                lastMessageTime = Date.now();
            }

            await new Promise(res => setTimeout(res, 1200));
        } catch (e) {
            console.error("Error during BANKAI:", e);
        }
    }

    try { await api.addUserToGroup(targetID, threadID); } catch(e) {}

    if (fs.existsSync(END_IMG)) {
        await api.sendMessage({ body: END_MSG, attachment: fs.createReadStream(END_IMG) }, threadID);
    } else {
        api.sendMessage(END_MSG, threadID);
    }
};
