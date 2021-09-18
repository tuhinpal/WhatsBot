//jshint esversion:8
const config = require("../config");
const axios = require("axios");
const { MessageMedia } = require("whatsapp-web.js");
const packageJson = require("../package.json");

async function get(battery, phn_info) {
  let batttxt;

  if (battery.plugged) {
    batttxt = `${battery.battery}% (Charging)`;
  } else {
    batttxt = `${battery.battery}%`;
  }

  return {
    msg:
      `*Whatsbot*\n\nThis chat is Powered By *Whatsbot*\n\n*Battery:* ${batttxt}\n*Device:* ${phn_info.device_manufacturer} ${phn_info.device_model}\n*WA Version:* ${phn_info.wa_version}\n*Whatsbot Version:* ${packageJson.version}\n*Pmpermit:* ${config.pmpermit_enabled}\n\n*Official Repository Url 👇*\n` +
      "```https://github.com/TheWhatsBot/WhatsBot```",
    mimetype: "image/jpeg",
    data: Buffer.from(
      (
        await axios.get("https://telegra.ph/file/ecbc27f276890bf2f65a2.jpg", {
          responseType: "arraybuffer",
        })
      ).data
    ).toString("base64"),
    filename: "start.jpg",
  };
}

const execute = async (client, msg) => {
  msg.delete(true);
  let startdata = await get(
    await client.info.getBatteryStatus(),
    client.info.phone
  );
  await client.sendMessage(
    msg.to,
    new MessageMedia(startdata.mimetype, startdata.data, startdata.filename),
    { caption: startdata.msg }
  );
};

module.exports = {
  name: "Start",
  description: "Get device, client and bot info",
  command: "!start",
  commandType: "info",
  isDependent: false,
  help: "Get information about your WhatsBot",
  execute,
};
