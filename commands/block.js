//jshint esversion:8
const execute = async (client, msg) => {
  if (!msg.to.includes("-")) {
    await (await msg.getContact()).block();
  }
};

module.exports = {
  name: "Block", //name of the module
  description: "Block current chat", // short description of what this command does
  command: "!block", //command with prefix. Ex command: '!test'
  commandType: "admin", //
  isDependent: false, //whether this command is related/dependent to some other command
  help: "Type !block in the chat to block the user", // a string descring how to use this command Ex = help : 'To use this command type !test arguments'
  execute,
};
