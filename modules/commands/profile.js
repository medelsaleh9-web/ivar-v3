const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

module.exports.config = {
  name: "بروفايل",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "سونغ",
  description: "عرض صورة الملف الشخصي لعضو",
  commandCategory: "الملاك",
  usages: "بروفايل [ID] أو رد على رسالة",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID, mentions } = event;

  let targetID = null;

  if (event.messageReply) {
    targetID = event.messageReply.senderID;
  } else if (args[0] && /^\d+$/.test(args[0])) {
    targetID = args[0];
  } else if (mentions && Object.keys(mentions).length > 0) {
    targetID = Object.keys(mentions)[0];
  } else {
    targetID = senderID;
  }

  try {
    const userInfo = await api.getUserInfo(targetID);
    const user = userInfo[targetID];

    if (!user) {
      return api.sendMessage("❌ لم أجد هذا المستخدم!", threadID, messageID);
    }

    const name = user.name || targetID;
    const avatarUrl = user.thumbSrc || user.profileUrl;

    if (!avatarUrl) {
      return api.sendMessage(
        `👤 ${name}\n🆔 ${targetID}\n❌ لا يوجد صورة شخصية متاحة`,
        threadID,
        messageID
      );
    }

    const tmpPath = path.join(os.tmpdir(), `profile_${targetID}_${Date.now()}.jpg`);
    const response = await axios.get(avatarUrl, { responseType: "arraybuffer", timeout: 15000 });
    fs.writeFileSync(tmpPath, Buffer.from(response.data));

    await api.sendMessage(
      {
        body: `👤 ${name}\n🆔 المعرف: ${targetID}`,
        attachment: fs.createReadStream(tmpPath)
      },
      threadID,
      messageID
    );

    fs.unlink(tmpPath, () => {});
  } catch (e) {
    return api.sendMessage("❌ حصل خطأ أثناء جلب الصورة الشخصية!", threadID, messageID);
  }
};
