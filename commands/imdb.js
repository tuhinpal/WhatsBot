const axios = require("axios");
const { MessageMedia } = require("whatsapp-web.js");
const formatNum = require("../helpers/formatNum");
const processImage = require("../helpers/processImage");
const imdb_host = `https://imdb-api.tprojects.workers.dev`; // no slash at the end

const execute = async (client, msg, args) => {
  try {
    msg.delete(true);
    let query = args.join(" ");
    let data = await axios.get(`${imdb_host}/search?query=${query}`);
    data = data.data;
    if (data.results.length == 0) throw new Error("No results found.");
    let result = data.results[0];

    result = await axios.get(`${imdb_host}${result.api_path}`);
    result = result.data;
    let image = await processImage(result.image);
    let text = `*${result.title}*\n_${
      result.contentType === "Movie"
        ? `Movie · ${result.contentRating} · ${result.runtime} · ${result.year}`
        : result.contentType
    }_\n_*${result.rating.star}* ⭐ - *${formatNum(
      result.rating.count
    )}* Ratings_\n\n*Genre:* ${result.genre.join(", ")}\n*Plot:* ${
      result.plot
    }\n${result.top_credits
      .map((x) => `*${x.name}:* ${x.value.join(", ")}`)
      .join("\n")}\n\n*IMDB Link:* ${result.imdb}`;

    await client.sendMessage(
      msg.to,
      new MessageMedia(image.mimetype, image.data, `${result.title}.jpg`),
      { caption: text }
    );
  } catch (error) {
    let messagetosend = `Something went wrong to get this content\n\n${error?.message}`;
    await client.sendMessage(msg.to, messagetosend);
  }
};

module.exports = {
  name: "IMDB", //name of the module
  description: "Find content details from IMDB", // short description of what this command does
  command: "!imdb", //command with prefix. Ex command: '!test'
  commandType: "plugin", // admin|info|plugin
  isDependent: false, //whether this command is related/dependent to some other command
  help: "Type *!imdb {query}* to get detail of a content.\n\n*Ex.* !imdb rrr", // a string descring how to use this command Ex = help : 'To use this command type !test arguments'
  execute,
};
