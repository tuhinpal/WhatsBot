//jshint esversion:8
const express = require('express');
const app = express();
const { Client } = require('whatsapp-web.js');
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