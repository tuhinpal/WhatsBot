//jshint esversion:8
const execute = async (client, msg) => {
  client.sendPresenceAvailable();
  msg.reply("```" + "I will be online from now." + "```");
};

module.exports = {
  name: "Awake",
  description: "Stay online always !",
  command: "!awake",
  commandType: "plugin",
  isDependent: false,
  help: undefined,
  execute,
};
