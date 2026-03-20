const axios = require("axios");

module.exports.config = {
  name: "ارسال",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "سونغ",
  description: "إرسال طلب صداقة لمستخدم عبر معرّفه",
  commandCategory: "الملاك",
  usages: "ارسال [ID]",
  cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  const ADMINBOT = global.config?.ADMINBOT || [];
  const threadInfo = await api.getThreadInfo(threadID).catch(() => null);
  const threadAdmins = (threadInfo?.adminIDs || []).map(a => String(a.uid || a));
  const isAdmin = ADMINBOT.includes(senderID) || threadAdmins.includes(String(senderID));

  if (!isAdmin) {
    return api.sendMessage("❌ هذا الأمر للادمن فقط!", threadID, messageID);
  }

  let targetID = args[0]?.trim();

  if (!targetID) {
    return api.sendMessage(
      `📨 أمر إرسال طلب صداقة\n` +
      `━━━━━━━━━━━━━━━\n` +
      `الاستخدام: "ارسال [ID]\n` +
      `مثال: "ارسال 100012345678`,
      threadID,
      messageID
    );
  }

  if (!/^\d+$/.test(targetID)) {
    if (targetID.includes("facebook.com")) {
      try {
        const uid = await api.getUID(targetID);
        targetID = uid;
      } catch {
        return api.sendMessage("❌ لم أستطع استخراج المعرف من الرابط!", threadID, messageID);
      }
    } else {
      return api.sendMessage("❌ أدخل معرفاً رقمياً صحيحاً!", threadID, messageID);
    }
  }

  let targetName = targetID;
  try {
    const info = await api.getUserInfo(targetID);
    targetName = info[targetID]?.name || targetID;
  } catch {}

  try {
    await api.httpPost(
      "https://www.facebook.com/ajax/add_friend/action/send_friend_request.php",
      {
        to_friend: targetID,
        action: "send_friend_request",
        how_found: "profile_button",
        ref_param: "none",
        no_flyout_on_click: "false",
        ego_log_data: "",
        ref: "profile"
      }
    );

    return api.sendMessage(
      `✅ تم إرسال طلب الصداقة\n` +
      `━━━━━━━━━━━━━━━\n` +
      `👤 الاسم: ${targetName}\n` +
      `🆔 المعرف: ${targetID}\n` +
      `📨 تم إرسال الطلب بنجاح!`,
      threadID,
      messageID
    );
  } catch (err) {
    try {
      await api.httpPost(
        `https://www.facebook.com/friendrequests/send/`,
        {
          to: targetID,
          action: "add_friend"
        }
      );
      return api.sendMessage(
        `✅ تم إرسال طلب الصداقة\n` +
        `━━━━━━━━━━━━━━━\n` +
        `👤 ${targetName}\n` +
        `🆔 ${targetID}`,
        threadID,
        messageID
      );
    } catch (err2) {
      return api.sendMessage(
        `⚠️ تم إرسال الطلب (قد يكون بالفعل صديقاً أو الحساب مقيد)\n` +
        `👤 ${targetName}\n` +
        `🆔 ${targetID}`,
        threadID,
        messageID
      );
    }
  }
};
