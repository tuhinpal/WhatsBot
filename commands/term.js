//jshint esversion:8

const { exec } = require('child_process');

const run = (client,msg) => {
    msg.delete(true);
    exec("cd public && " + msg.body.replace("!term ", ""), (error, stdout, stderr) => {
        if (error) {
            client.sendMessage(msg.to, "*whatsbot~:* ```" + error + "```");
        } else if (stderr) {
            client.sendMessage(msg.to, "*whatsbot~:* ```" + stderr + "```");
        } else {
            client.sendMessage(msg.to, "*whatsbot~:* ```" + stdout + "```");
        }
    });
};

module.exports = {run};
