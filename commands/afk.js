//jshint esversion:11
const logger = require('../logger');
const { setAfk } = require('../helpers/afkhandler');

const execute = async (client,msg,args) => {
    msg.delete(true);
    let data = await setAfk(args.join(' '));
    if(data?.afk){
        const time = new Intl.DateTimeFormat('en-IN',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Kolkata'}).format(data.time);
        await logger(client,`You've already marked yourself offline at ${time}. If you want to set yourself back online, use !online`);
    }
    else if(data?.set) {
        await logger(client,`You've marked yourself offline! To mark yourself back online use !online`);
    }
    else{
        await logger(client,`Some error occured.`);
    }
};

module.exports = {
    name: 'Away',
    description: 'Mark yourself as offline.',
    command: '!afk',
    commandType: 'admin',
    isDependent: false,
    help: 'Use !afk to mark yourself as offline. Recipients will be replied with an automated message when you\'re offline. You can also provide further information with the command like this -\n\n!afk [info]\n\nTo mark yourself back online, use !online',
    execute};