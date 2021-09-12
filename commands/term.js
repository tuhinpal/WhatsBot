//jshint esversion:8

const { exec } = require('child_process');

const execute = async (client,msg,args) => {
    msg.delete(true);
    exec("cd public && " + args.join(' '), async (error, stdout, stderr) => {
        if (error) {
            await client.sendMessage(msg.to, "*whatsbot~:* ```" + error + "```");
        } else if (stderr) {
            await client.sendMessage(msg.to, "*whatsbot~:* ```" + stderr + "```");
        } else {
            await client.sendMessage(msg.to, "*whatsbot~:* ```" + stdout + "```");
        }
    });
};

module.exports = {
    name: '',
    description: '',
    help,
    execute};