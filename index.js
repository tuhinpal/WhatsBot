//jshint esversion:8
const express = require('express');
const app = express();
const { Client } = require('whatsapp-web.js');
const pmpermit = require('./modules/pmpermit');
const config = require('./config');
const fs = require("fs");

const client = new Client({ puppeteer: { headless: true, args: ['--no-sandbox'] }, session: config.session });

client.commands = new Map();

fs.readdir("./commands", (err, files) => {
    if (err) 
        return console.error(e);
    files.forEach(commandFile => {
        if(commandFile.endsWith('.js')){
            let commandName = commandFile.replace(".js", "");
            const command = require(`./commands/${commandName}`);
            client.commands.set(commandName,command);
        }
    });
});

client.initialize();

client.on('auth_failure', () => {
    console.error("There is a problem in authentication, Kindly set the env var again and restart the app");
});

client.on('ready', () => {
    console.log('Bot has been started');
});

client.on('message', async msg => {
    if (msg.author == undefined && config.pmpermit_enabled == "true") { // Pm check for pmpermit module
        let pmpermitcheck = await pmpermit.handler(msg.from.split("@")[0]);
        const chat = await msg.getChat();
        if (pmpermitcheck == "permitted") {
            // do nothing
        } else if (pmpermitcheck.mute == true && chat.isMuted == false) { // mute 
            msg.reply(pmpermitcheck.msg);
            const chat = await msg.getChat();

            let unmuteDate = new Date();
            unmuteDate.setSeconds(Number(unmuteDate.getSeconds()) + Number(config.pmpermit_mutetime));
            await chat.mute(unmuteDate);

        } else if (chat.isMuted == true) {
            //do nothing
        } else if (pmpermitcheck == "error") {
            //do nothing
        } else {
            msg.reply(pmpermitcheck.msg);
        }

    } else {
        if (msg.body.includes("!info")) {

            let startdata = await start.get(await client.info.getBatteryStatus(), client.info.phone);
            client.sendMessage(msg.to, new MessageMedia(startdata.mimetype, startdata.data, startdata.filename), { caption: startdata.msg });

        }
    }
});

client.on('message_create', async msg => {
    if(msg.fromMe && msg.body.startsWith('!')) {
        let args = msg.body.slice(1).trim().split(/ +/g);
        let command = args.shift().toLowerCase();

        console.log({command,args});

        if (client.commands.has(command)) {
            try {
                await client.commands.get(command).execute(client,msg,args);
            } catch (error) {
                console.log(error);
            }
        }

        else {
            await client.sendMessage(msg.to,'No such command found');
            console.log(client.commands);
        }
    }
});

client.on('message_revoke_everyone', async (after, before) => {
    if (before) {
        if (before.fromMe !== true && before.hasMedia !== true && before.author == undefined && config.enable_delete_alert == "true") {
            client.sendMessage(before.from, "_You deleted this message_ 👇👇\n\n" + before.body);
        }
    }
});


client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});

app.get('/', (req, res) => {
    res.send('<h1>This server is powered by Whatsbot<br><a href="https://github.com/TheWhatsBot/WhatsBot">https://github.com/TheWhatsBot/WhatsBot</a></h1>');
});

app.use('/public', express.static('public'), serveIndex('public', { 'icons': true })); // public directory will be publicly available


app.listen(process.env.PORT || 8080, () => {
    console.log(`Server listening at Port: ${process.env.PORT || 8080}`);
});
