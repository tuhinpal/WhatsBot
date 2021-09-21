//jshint esversion:8
const execute = async (client,msg) => {
    if (!msg.to.includes("-")) {
        let chat = await msg.getChat();
        await chat.unmute(true);
        msg.reply(`*🗣 Unmuted*\n\nYou have been unmuted\n\n _Powered by WhatsBot_`);
    }
};

module.exports = {
    name: 'Unmute', //name of the module
    description: 'Unmute a muted chat', // short description of what this command does
    command: '!unmute', //command with prefix. Ex command: '!test'
    commandType: 'admin', //
    isDependent: true, //whether this command is related/dependent to some other command
    help: 'This command is related to !mute. Type !help mute to learn about this', // a string descring how to use this command Ex = help : 'To use this command type !test arguments'
    execute};