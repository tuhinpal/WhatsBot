//jshint esversion:8
const { MessageMedia } = require("whatsapp-web.js");
const axios = require("axios");
const formatNum = require("../helpers/formatNum");
const processImage = require("../helpers/processImage");
const { getShortURL } = require("../commands/shorten");
const savefrom_base = "https://sfrom.net/";

async function youtube(url) {
  try {
    let data = (
      await axios.get(`https://yoothoob.vercel.app/fromLink?link=${url}`)
    ).data;
    let shortUrl = await getShortURL(savefrom_base + url);
    return {
      title: data.title,
      likes: formatNum(data.stats.likes),
      views: formatNum(data.stats.views),
      comments: formatNum(data.stats.comments),
      image: await processImage(
        data.images[3] ||
          data.images[2] ||
          data.images[1] ||
          data.images[0] ||
          null
      ),
      download_link:
        shortUrl === "error" ? savefrom_base + url : shortUrl.short,
    };
  } catch (error) {
    return "error";
  }
}

const execute = async (client, msg, args) => {
  let data;

  msg.delete(true);

  if (msg.hasQuotedMsg) {
    let quotedMsg = await msg.getQuotedMessage();
    data = await youtube(quotedMsg.body);
  } else {
    data = await youtube(args[0]);
  }

  if (data == "error") {
    await client.sendMessage(
      msg.to,
      `🙇‍♂️ *Error*\n\n` +
        "```Something Unexpected Happened to fetch the YouTube video```"
    );
  } else {
    await client.sendMessage(
      msg.to,
      new MessageMedia(
        data.image.mimetype,
        data.image.data,
        data.image.filename
      ),
      {
        caption:
          `*${data.title}*\n\nViews: ` +
          "```" +
          data.views +
          "```\nLikes: " +
          "```" +
          data.likes +
          "```\nComments: " +
          "```" +
          data.comments +
          "```\n\n*Download Link* 👇\n" +
          "```" +
          data.download_link +
          "```",
      }
    );
  }
};

module.exports = {
  name: "YouTube Download",
  description: "Gets download link for youtube video",
  command: "!yt",
  commandType: "plugin",
  isDependent: false,
  help: `*Youtube*\n\nDownload a Youtube video with this command.\n\n*!yt [Youtube-Link]*\nor,\nReply a message with *!yt* to Download`,
  execute,
};
