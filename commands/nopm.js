//jshint esversion:8
const config = require('../config');
const pmpermit = require('../modules/pmpermit');

const execute = async (client,msg) => {
    if (config.pmpermit_enabled == "true" && !msg.to.includes("-")) {
        pmpermit.nopermitacton(msg.to.split("@")[0]);
        msg.reply("Not Allowed for PM");
    }
    
};

module.exports = {
    name: 'Disallow PM', //name of the module
    description: 'Disallow an allowed user for Personal messaging', // short description of what this command does
    command: '!nopm', //command with prefix. Ex command: '!test'
    commandType: 'admin', //
    isDependent: false, //whether this command is related/dependent to some other command
    help: 'Type !nopm in the chat to execute.', // a string descring how to use this command Ex = help : 'To use this command type !test arguments'
    execute};