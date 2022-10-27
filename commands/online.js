//jshint esversion:8
const { setOnline }= require('../helpers/afkhandler');
const logger = require('../logger');
const execute = async (client,msg) => {
    let data = await setOnline();
    if(data) {
        let msg = `You're now back online. `;
        if(data.chats.length)
            msg += `While you were offline you recieved messages from \`\`\`${data.chats}\`\`\``;
        await logger(client, msg);
    }
    else {
        await logger(client, `Your aren't afk.`);
    }
};

module.exports = {
    name: 'Online',
    description: 'Disable afk', 
    command: '!online', 
    commandType: 'admin', 
    isDependent: true,
    help: 'Type in !online.',
    execute};