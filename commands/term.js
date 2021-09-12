//jshint esversion:8

const { exec } = require('child_process');

const execute = (client,msg,args) => {
    msg.delete(true);
    exec("cd public && " + args.join(' '), (error, stdout, stderr) => {
        if (error) {
            client.sendMessage(msg.to, "*whatsbot~:* ```" + error + "```");
        } else if (stderr) {
            client.sendMessage(msg.to, "*whatsbot~:* ```" + stderr + "```");
        } else {
            client.sendMessage(msg.to, "*whatsbot~:* ```" + stdout + "```");
        }
    });
};

module.exports = {execute};
