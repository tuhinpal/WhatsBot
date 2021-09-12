//jshint esversion:8
const execute = async (client,msg) => {
    client.sendPresenceAvailable();
    msg.reply("```" + "I will be online from now." + "```");
};

module.exports = {
    name: 'Awake',
    description: 'marks user as online',
    command: '!awake',
    help: '',
    execute};