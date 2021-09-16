//jshint esversion:6

const execute = (client,msg) => msg.reply('pong');

module.exports = {
    name: 'Ping',
    description: 'responds with pong',
    command: '!ping',
    commandType: 'info',
    isDependent: false,
    help: undefined,
    execute};