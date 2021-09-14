//jshint esversion:8
const execute = async (client,msg,args) => {
    msg.delete(true);
    let help;
    let commands =  client.commands;
    if(!args.length){
        help = '🔱 *Commands*\n\n';
        commands.forEach((command) => {
            if(!command.isDependent)
                help += `⭐ *${command.name} (${command.command})*  - ${command.description}\n`;
        });
    }
    client.sendMessage(msg.to, help);
};

module.exports = {
    name: 'help',
    description: 'get information about available commands',
    command: '!help',
    commandType: 'info',
    isDependent: false,
    help: '',
    execute};