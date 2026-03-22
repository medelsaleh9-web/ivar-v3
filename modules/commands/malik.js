const fs = require("fs-extra");
const path = require("path");
const statePath = path.join(__dirname, "data/malakState.json");

function getState() {
  try { return JSON.parse(fs.readFileSync(statePath, "utf-8")); }
  catch { return { locks: {}, botAdmins: {}, awrwa: {} }; }
}

if (!global.malakIntervals) global.malakIntervals = {};

const kingMessage = `*Auto Reply:*
💠══─────────────══💠
❏ 👑「𝗞 ⃟𝗦」卐 Ξ『𝗠𝗞』🪽
❏ 👑「𝗞 ⃟𝗦」卐 Ξ『𝗠𝗞』🪽
❏ 👑「𝗞 ⃟𝗦」卐 Ξ『𝗠𝗞』🪽
❏ 👑「𝗞 ⃟𝗦」卐 Ξ『𝗠𝗞』🪽
❏ 👑「𝗞 ⃟𝗦」卐 Ξ『𝗠𝗞』🪽
❏ 👑「𝗞 ⃟𝗦」卐 Ξ『𝗠𝗞』🪽
❏ 👑「𝗞 ⃟𝗦」卐 Ξ『𝗠𝗞』🪽
❏ 👑「𝗞 ⃟𝗦」卐 Ξ『𝗠𝗞』🪽
❏ 👑「𝗞 ⃟𝗦」卐 Ξ『𝗠𝗞』🪽
❏ 👑「𝗞 ⃟𝗦」卐 Ξ『𝗠𝗞』🪽
❏ 👑「𝗞 ⃟𝗦」卐 Ξ『𝗠𝗞』🪽
❏ 👑「𝗞 ⃟𝗦」卐 Ξ『𝗠𝗞』🪽
❏ 👑「𝗞 ⃟𝗦」卐 Ξ『𝗠𝗞』🪽
❏ 👑「𝗞 ⃟𝗦」卐 Ξ『𝗠𝗞』🪽
❏ 👑「𝗞 ⃟𝗦」卐 Ξ『𝗠𝗞』🪽
❏ 👑「𝗞 ⃟𝗦」卐 Ξ『𝗠𝗞』🪽
❏ 👑「𝗞 ⃟𝗦」卐 Ξ『𝗠𝗞』🪽
❏ 👑「𝗞 ⃟𝗦」卐 Ξ『𝗠𝗞』🪽
❏ 👑「𝗞 ⃟𝗦」卐 Ξ『𝗠𝗞』🪽
❏ 👑「𝗞 ⃟𝗦」卐 Ξ『𝗠𝗞』🪽
❏ 👑「𝗞 ⃟𝗦」卐 Ξ『𝗠𝗞』🪽
❏ 👑「𝗞 ⃟𝗦」卐 Ξ『𝗠𝗞』🪽
❏ 👑「𝗞 ⃟𝗦」卐 Ξ『𝗠𝗞』🪽
❏ 👑「𝗞 ⃟𝗦」卐 Ξ『𝗠𝗞』🪽
💠══─────────────══💠

𝐓͢𝐇͢𝐄͢┃𝐊͢𝐈͢𝐍͢𝐆͢


𝗚𝗢𝗡𝗭𝗔𝗟𝗢.𝗥.𝗦

👑🪽

𓆩𝛸.𝑆𓆪`;

module.exports.config = {
  name: "غراب",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "سونغ",
  description: "أمر الغراب - يرسل رسالة الملك كل 15 ثانية",
  commandCategory: "الملاك",
  usages: "غراب | غراب وقف",
  cooldowns: 0
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, senderID } = event;
  const sub = args[0];

  if (sub === "وقف") {
    if (global.malakIntervals[threadID]) {
      clearInterval(global.malakIntervals[threadID]);
      delete global.malakIntervals[threadID];
      return api.sendMessage("تم ايقاف الغراب 👑🪽", threadID);
    } else {
      return api.sendMessage("الغراب غير مفعّل أصلاً!", threadID);
    }
  }

  if (global.malakIntervals[threadID]) {
    return api.sendMessage("الغراب مفعّل بالفعل! قل غراب وقف لإيقافه.", threadID);
  }

  await api.sendMessage("تم تفعيل الغراب كل 15 ثانية 👑🪽", threadID);

  global.malakIntervals[threadID] = setInterval(() => {
    api.sendMessage(kingMessage, threadID);
  }, 15000);
};
