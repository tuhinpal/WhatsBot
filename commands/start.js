//jshint esversion:8
const config = require("../config");
const axios = require("axios");
const { MessageMedia } = require("whatsapp-web.js");
const packageJson = require("../package.json");

async function get() {
  return {
    msg:
      `*Whatsbot*\n\nThis chat is Powered By *Whatsbot*\n\n*Whatsbot Version:* ${packageJson.version}\n*Pmpermit:* ${config.pmpermit_enabled}\n\n*Official Repository Url 👇*\n` +
      "```https://github.com/tuhinpal/WhatsBot```",
    mimetype: "image/jpeg",
    data: Buffer.from(
      (
        await axios.get("https://graph.org/file/ecbc27f276890bf2f65a2.jpg", {
          responseType: "arraybuffer",
        })
      ).data
    ).toString("base64"),
    filename: "start.jpg",
  };
}

const execute = async (client, msg) => {
  msg.delete(true);
  let startdata = await get();
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
