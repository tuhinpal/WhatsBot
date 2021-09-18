//jshint esversion:8
const dictionary = require("urban-dictionary");

async function ud(term) {
  try {
    return await dictionary.define(term);
  } catch (error) {
    return "error";
  }
}

const execute = async (client, msg, args) => {
  msg.delete(true);
  let data = await ud(args.join(" "));
  if (data == "error") {
    await client.sendMessage(
      msg.to,
      `🙇‍♂️ *Error*\n\n` +
        "```Something Unexpected Happened while Lookup on Urban Dictionary```"
    );
  } else {
    await client.sendMessage(
      msg.to,
      "*Term:* ```" +
        args.join(" ") +
        "```\n\n" +
        "*Definition:* ```" +
        data[0].definition +
        "```\n\n" +
        "*Example:* ```" +
        data[0].example +
        "```"
    );
  }
};

module.exports = {
  name: "Urban Dictionary",
  description: "Gets dictionary meanings of words",
  command: "!ud",
  commandType: "plugin",
  isDependent: false,
  help: `*Urban Dictionary*\n\nUrban Dictionary is a crowdsourced online dictionary for slang words and phrases.\n\n*!ud [Word]*\nto search a word using Urban Dictionary`,
  execute,
};
