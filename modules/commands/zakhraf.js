module.exports.config = {
  name: "زخرفة",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "سونغ",
  description: "زخرفة النصوص العربية والإنجليزية بأكثر من 50 أسلوب",
  commandCategory: "الملاك",
  usages: "زخرفة [نص]",
  cooldowns: 3
};

function arabicStyles(text) {
  const decorations = [
    `꧁༺ ${text} ༻꧂`,
    `【 ${text} 】`,
    `✦ ${text} ✦`,
    `⁦⟨ ${text} ⟩⁩`,
    `『 ${text} 』`,
    `❝ ${text} ❞`,
    `⫷ ${text} ⫸`,
    `◤◢◤◢ ${text} ◤◢◤◢`,
    `☆彡 ${text} 彡☆`,
    `⟦ ${text} ⟧`,
    `𖤍 ${text} 𖤍`,
    `꒰ ${text} ꒱`,
    `✿ ${text} ✿`,
    `⊱ ${text} ⊰`,
    `◈ ${text} ◈`,
    `♛ ${text} ♛`,
    `❧ ${text} ❧`,
    `⋆ ${text} ⋆`,
    `░▒▓ ${text} ▓▒░`,
    `⊶⊷ ${text} ⊶⊷`,
    `⌈ ${text} ⌋`,
    `§ ${text} §`,
    `↫ ${text} ↬`,
    `𝕭𝖎𝖘𝖒𝖎𝖑𝖑𝖆𝖍 ${text}`,
    `⛦ ${text} ⛦`,
    `✵ ${text} ✵`,
    `❃ ${text} ❃`,
    `💠 ${text} 💠`,
    `👑 ${text} 👑`,
    `🌟 ${text} 🌟`
  ];
  return decorations;
}

const engAlphabets = {
  bold: Array.from("𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭"),
  italic: Array.from("𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡"),
  boldItalic: Array.from("𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕"),
  script: Array.from("𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵"),
  boldScript: Array.from("𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩"),
  fraktur: Array.from("𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ"),
  doubleStruck: Array.from("𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ"),
  circled: Array.from("ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ"),
  squared: Array.from("🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉"),
  smallCaps: Array.from("ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴩǫʀꜱᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴩǫʀꜱᴛᴜᴠᴡxʏᴢ"),
  flipped: Array.from("ɐqɔpǝɟƃɥıɾʞlɯuodbɹsʇnʌʍxʎzɐqɔpǝɟƃɥıɾʞlɯuodbɹsʇnʌʍxʎz"),
  sansSerif: Array.from("𝖺𝖻𝖼𝖽𝖾𝖿𝗀𝗁𝗂𝗃𝗄𝗅𝗆𝗇𝗈𝗉𝗊𝗋𝗌𝗍𝗎𝗏𝗐𝗑𝗒𝗓𝖠𝖡𝖢𝖣𝖤𝖥𝖦𝖧𝖨𝖩𝖪𝖫𝖬𝖭𝖮𝖯𝖰𝖱𝖲𝖳𝖴𝖵𝖶𝖷𝖸𝖹"),
  monospace: Array.from("𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉")
};

const normal = Array.from("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");

function convertEng(text, styleArr) {
  return Array.from(text).map(ch => {
    const idx = normal.indexOf(ch);
    return idx >= 0 ? styleArr[idx] : ch;
  }).join("");
}

const engStyleNames = [
  ["عريض", "bold"],
  ["مائل", "italic"],
  ["عريض مائل", "boldItalic"],
  ["خط كلاسيكي", "script"],
  ["خط كلاسيكي عريض", "boldScript"],
  ["فراكتور", "fraktur"],
  ["دبل", "doubleStruck"],
  ["دوائر", "circled"],
  ["مربعات", "squared"],
  ["صغير", "smallCaps"],
  ["مقلوب", "flipped"],
  ["سانز", "sansSerif"],
  ["كمبيوتر", "monospace"]
];

function isArabic(text) {
  return /[\u0600-\u06FF]/.test(text);
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  if (!args[0]) {
    return api.sendMessage(
      `✨ زخرفة النصوص\n` +
      `━━━━━━━━━━━━━━━\n` +
      `الاستخدام:\n` +
      `"زخرفة [نص عربي أو إنجليزي]\n\n` +
      `مثال عربي: "زخرفة الملاك\n` +
      `مثال إنجليزي: "زخرفة malak`,
      threadID,
      messageID
    );
  }

  const text = args.join(" ").trim();

  if (isArabic(text)) {
    const styles = arabicStyles(text);
    const result = styles.map((s, i) => `${i + 1}. ${s}`).join("\n");
    return api.sendMessage(
      `✨ زخرفة عربية — "${text}"\n` +
      `━━━━━━━━━━━━━━━\n` +
      result,
      threadID,
      messageID
    );
  } else {
    const lines = engStyleNames.map(([label, key]) => {
      const converted = convertEng(text, engAlphabets[key]);
      return `🔸 ${label}: ${converted}`;
    });
    const extras = [
      `🔹 زخرفة 1: ꧁${convertEng(text, engAlphabets.boldScript)}꧂`,
      `🔹 زخرفة 2: 【${convertEng(text, engAlphabets.fraktur)}】`,
      `🔹 زخرفة 3: ✦${convertEng(text, engAlphabets.doubleStruck)}✦`,
      `🔹 زخرفة 4: 『${convertEng(text, engAlphabets.script)}』`,
      `🔹 زخرفة 5: ♛${convertEng(text, engAlphabets.bold)}♛`,
      `🔹 زخرفة 6: ░▒▓${convertEng(text, engAlphabets.monospace)}▓▒░`,
      `🔹 زخرفة 7: ⟦${convertEng(text, engAlphabets.sansSerif)}⟧`,
      `🔹 زخرفة 8: 𖤍${convertEng(text, engAlphabets.circled)}𖤍`,
      `🔹 زخرفة 9: ꒰${convertEng(text, engAlphabets.squared)}꒱`,
      `🔹 زخرفة 10: ❝${convertEng(text, engAlphabets.italic)}❞`,
    ];
    return api.sendMessage(
      `✨ زخرفة إنجليزية — "${text}"\n` +
      `━━━━━━━━━━━━━━━\n` +
      lines.join("\n") + "\n" + extras.join("\n"),
      threadID,
      messageID
    );
  }
};
