module.exports.config = {
  name: "ivarDetect",
  eventType: ["message"],
  version: "1.0.0",
  credits: "كاڪو",
  description: "يرد على من يذكر ايفار"
};

module.exports.run = async function ({ api, event }) {
  if (!event.body) return;
  const body = event.body.toLowerCase();
  if (body.includes("ايفار") || body.includes("ivar")) {
    api.sendMessage("do u think that u caaaan kill mee IM IVAAAAR THE BONELLESSSSSS", event.threadID);
  }
};
