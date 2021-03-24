const express = require('express');
const app = express();
const { Client, MessageMedia } = require('whatsapp-web.js');
const config = require('./config')
const qr = require('./modules/qr');
const zee = require('./modules/zee5');
const saavn = require('./modules/jiosaavn');
const pmpermit = require('./modules/pmpermit');
const carbon = require('./modules/carbon');
const telegraph = require('./modules/telegraph');
const serveIndex = require('serve-index');
const youtube = require('./modules/youtube');
const weather = require('./modules/weather');
const { exec } = require('child_process');
const help = require('./modules/help');
const translator = require('./modules/translator');
const start = require('./modules/start');
const ud = require('./modules/ud');

const client = new Client({ puppeteer: { headless: true, args: ['--no-sandbox'] }, session: config.session });

client.initialize();

client.on('auth_failure', msg => {
    console.error("There is a problem to authenticate, Kindly set the env var again and restart the app");
});

client.on('ready', () => {
    console.log('Bot has been started');
});

client.on('message', async msg => {
    if (msg.author == undefined && config.pmpermit_enabled == "true") { // Pm check for pmpermit module
        var pmpermitcheck = await pmpermit.handler(msg.from.split("@")[0])
        const chat = await msg.getChat();
        if (pmpermitcheck == "permitted") {
            // do nothing
        } else if (pmpermitcheck.mute == true && chat.isMuted == false) { // mute 
            msg.reply(pmpermitcheck.msg)
            const chat = await msg.getChat();

            var unmuteDate = new Date();
            unmuteDate.setSeconds(Number(unmuteDate.getSeconds()) + Number(config.pmpermit_mutetime));
            await chat.mute(unmuteDate)

        } else if (chat.isMuted == true) {
            //do nothing
        } else if (pmpermitcheck == "error") {
            //do nothing
        } else {
            msg.reply(pmpermitcheck.msg)
        }

    } else {
        if (msg.body.includes("!info")) {

            var startdata = await start.get(await client.info.getBatteryStatus(), client.info.phone)
            client.sendMessage(msg.to, new MessageMedia(startdata.mimetype, startdata.data, startdata.filename), { caption: startdata.msg })

        }
    }
});

client.on('message_create', async(msg) => {
    if (msg.fromMe) {
        if (msg.body == "!allow" && config.pmpermit_enabled == "true" && !msg.to.includes("-")) { // allow and unmute the chat (PMPermit module)

            pmpermit.permitacton(msg.to.split("@")[0])
            var chat = await msg.getChat();
            await chat.unmute(true)
            msg.reply("Allowed for PM")

        } else if (msg.body == "!nopm" && config.pmpermit_enabled == "true" && !msg.to.includes("-")) { // not allowed for pm (PMPermit module)

            pmpermit.nopermitacton(msg.to.split("@")[0])
            msg.reply("Not Allowed for PM")

        } else if (msg.body == "!block" && !msg.to.includes("-")) { // Block an user in pm

            var chat = await msg.getChat()
            var contact = await chat.getContact()
            msg.reply("You have been Blocked")
            contact.block()

        } else if (msg.body == "!mute" && !msg.to.includes("-")) { // Mute an user in pm

            var chat = await msg.getChat()
            var unmuteDate = new Date()
            unmuteDate.setSeconds(Number(unmuteDate.getSeconds()) + Number(config.pmpermit_mutetime));
            await chat.mute(unmuteDate)
            msg.reply(`You have been muted for ${config.pmpermit_mutetime / 60} Minutes`)

        } else if (msg.body == "!unmute" && !msg.to.includes("-")) { // Unmute an user in pm

            var chat = await msg.getChat();
            await chat.unmute(true)
            msg.reply(`You have been unmuted`)

        } else if (msg.body.startsWith("!term ")) { // Terminal

            msg.delete(true)
            exec("cd public && " + msg.body.replace("!term ", ""), (error, stdout, stderr) => {
                if (error) {
                    client.sendMessage(msg.to, "*whatsbot~:* ```" + error + "```")
                } else if (stderr) {
                    client.sendMessage(msg.to, "*whatsbot~:* ```" + stderr + "```")
                } else {
                    client.sendMessage(msg.to, "*whatsbot~:* ```" + stdout + "```")
                }
            })

        } else if (msg.body.startsWith("!help")) { // help module

            msg.delete(true)
            var data = await help.mainF(msg.body)
            client.sendMessage(msg.to, data)

        } else if (msg.body == "!ping") { // Ping command

            msg.reply("Pong !!!");

        } else if (msg.body == "!start") { // Start command
            msg.delete(true)
            var startdata = await start.get(await client.info.getBatteryStatus(), client.info.phone)
            client.sendMessage(msg.to, new MessageMedia(startdata.mimetype, startdata.data, startdata.filename), { caption: startdata.msg })

        } else if (msg.body.startswith("!spam")) { // Spamming Op in the chat

            if (msg.hasQuotedMsg) {
                var quotedMsg = await msg.getQuotedMessage();
                var i;
                if (quotedMsg.hasMedia) {
                    var count = 10
                    var k = msg.body.replace("!spam", "")
                    if (k.length() > 0)
                        count = parseInt(k)
                    if (isNaN(count)) {
                        client.sendMessage(msg.to, `🙇‍♂️ *Error*\n\n` + "```Invalid count```")
                        return 0;
                    }
                    var media = await quotedMsg.downloadMedia();
                    for (i=0; i<count; i++)
                        client.sendMessage(msg.to, new MessageMedia(media.mimetype, media.data, media.filename));

                } else {

                    var count = 10
                    var k = msg.body.replace("!spam", "")
                    if (k.length() > 0)
                        count = parseInt(k)
                    if (isNaN(count)) {
                        client.sendMessage(msg.to, `🙇‍♂️ *Error*\n\n` + "```Invalid count```")
                        return 0;
                    }
                    for (i=0; i<count; i++)
                        client.sendMessage(msg.to, quotedMsg.body)
                }

            } else {

                var raw_text = msg.body.replace("!spam ", "")
                var count = 10
                if (raw_text.includes("|")) {
                    res = raw_text.split("|")
                    count = parseInt(res[0])
                    text = res[1]
                } else
                    text = raw_text
                if (isNaN(count)) {
                    client.sendMessage(msg.to, `🙇‍♂️ *Error*\n\n` + "```Invalid count```")
                    return 0;
                }
                if (text.length() > 0) {
                    for(i=0; i<count; i++)
                        client.sendMessage(msg.to, text);
                } else
                    client.sendMessage(msg.to, "Sorry, I didn't found any text to spam");
            }

        } else if (msg.body == '!delete' && msg.hasQuotedMsg) {

            msg.delete(true)
            var quotedMsg = await msg.getQuotedMessage();
            if (quotedMsg.fromMe) {
                quotedMsg.delete(true);
            } else {
                client.sendMessage(msg.to, "Sorry, I can't delete that message.");
            }

        } else if (msg.body.startsWith("!qr ")) { // QR Code Gen

            msg.delete(true)
            var data = await qr.qrgen(msg.body.replace("!qr ", ""));
            client.sendMessage(msg.to, new MessageMedia(data.mimetype, data.data, data.filename), { caption: `QR code for 👇\n` + "```" + msg.body.replace("!qr ", "") + "```" });

        } else if (msg.body.startsWith("!qr") && msg.hasQuotedMsg) { // QR Code Gen from reply text

            msg.delete(true)
            var quotedMsg = await msg.getQuotedMessage();
            var data = await qr.qrgen(quotedMsg.body);
            client.sendMessage(msg.to, new MessageMedia(data.mimetype, data.data, data.filename), { caption: `QR code for 👇\n` + "```" + quotedMsg.body + "```" });

        } else if (msg.body.startsWith("!zee5 ")) { // Zee5 Module

            msg.delete(true)
            var data = await zee.mainF(msg.body.replace("!zee5 ", ""));
            if (data == "error") {
                client.sendMessage(msg.to, `🙇‍♂️ *Error*\n\n` + "```Something Unexpected Happened to fetch this Zee5 Content, Maybe it's a wrong url.```")
            } else {
                client.sendMessage(msg.to, new MessageMedia(data.image.mimetype, data.image.data, data.image.filename), { caption: `🎥 *${data.title}* _(${data.genre})_\n\n📄 ` + "```" + data.description + "```" + `\n\n*Stream Url* 👇\n${data.url}` });
            }

        } else if (msg.body.startsWith("!jiosaavn ")) { // Jiosaavn Module

            msg.delete(true)
            var data = await saavn.mainF(msg.body.replace("!jiosaavn ", ""));
            if (data == "error") {
                client.sendMessage(msg.to, `🙇‍♂️ *Error*\n\n` + "```Something Unexpected Happened to fetch this Jiosaavn Link, Maybe it's a wrong url.```")
            } else {
                client.sendMessage(msg.to, new MessageMedia(data.image.mimetype, data.image.data, data.image.filename), { caption: `🎶 *${data.title}* _(${data.released_year})_\n\n📀 *Artist :*  ` + "```" + data.singers + "```\n📚 *Album :*  " + "```" + data.album + "```" + `\n\n*Download Url* 👇\n${data.url}` });
            }

        } else if (msg.body.startsWith("!jiosaavn") && msg.hasQuotedMsg) { // Jiosaavn Module message reply

            msg.delete(true)
            var quotedMsg = await msg.getQuotedMessage();
            var data = await saavn.mainF(quotedMsg.body);
            if (data == "error") {
                client.sendMessage(msg.to, `🙇‍♂️ *Error*\n\n` + "```Something Unexpected Happened to fetch this Jiosaavn Link, Maybe it's a wrong url.```")
            } else {
                client.sendMessage(msg.to, new MessageMedia(data.image.mimetype, data.image.data, data.image.filename), { caption: `🎶 *${data.title}* _(${data.released_year})_\n\n📀 *Artist :*  ` + "```" + data.singers + "```\n📚 *Album :*  " + "```" + data.album + "```" + `\n\n*Download Url* 👇\n${data.url}` });
            }

        } else if (msg.body.startsWith("!carbon ")) { // Carbon Module

            msg.delete(true)
            var data = await carbon.mainF(msg.body.replace("!carbon ", ""));
            if (data == "error") {
                client.sendMessage(msg.to, `🙇‍♂️ *Error*\n\n` + "```Something Unexpected Happened to create the Carbon.```")
            } else {
                client.sendMessage(msg.to, new MessageMedia(data.mimetype, data.data, data.filename), { caption: `Carbon for 👇\n` + "```" + msg.body.replace("!carbon ", "") + "```" });
            }

        } else if (msg.body.startsWith("!carbon") && msg.hasQuotedMsg) { // Carbon Module message reply

            msg.delete(true)
            var quotedMsg = await msg.getQuotedMessage();
            var data = await carbon.mainF(quotedMsg.body);
            if (data == "error") {
                client.sendMessage(msg.to, `🙇‍♂️ *Error*\n\n` + "```Something Unexpected Happened to create the Carbon.```")
            } else {
                client.sendMessage(msg.to, new MessageMedia(data.mimetype, data.data, data.filename), { caption: `Carbon for 👇\n` + "```" + quotedMsg.body + "```" });
            }

        } else if (msg.body.startsWith("!directlink") && msg.hasQuotedMsg) { // Telegraph Module

            msg.delete(true)
            var quotedMsg = await msg.getQuotedMessage();
            var attachmentData = await quotedMsg.downloadMedia();
            var data = await telegraph.mainF(attachmentData);
            if (data == "error") {
                quotedMsg.reply(`Error occured while create direct link.`)
            } else {
                quotedMsg.reply(`🔗 *Direct Link 👇*\n\n` + "```" + data + "```")
            }

        } else if (msg.body.startsWith("!yt ")) { // Youtube Module

            msg.delete(true)
            var data = await youtube.mainF(msg.body.replace("!yt ", ""));
            if (data == "error") {
                client.sendMessage(msg.to, `🙇‍♂️ *Error*\n\n` + "```Something Unexpected Happened to fetch the YouTube video```")
            } else {
                client.sendMessage(msg.to, new MessageMedia(data.image.mimetype, data.image.data, data.image.filename), { caption: `*${data.title}*\n\nViews: ` + "```" + data.views + "```\nLikes: " + "```" + data.likes + "```\nComments: " + "```" + data.comments + "```\n\n*Download Link* 👇\n" + "```" + data.download_link + "```" });
            }

        } else if (msg.body.startsWith("!yt") && msg.hasQuotedMsg) { // Youtube Module Reply

            msg.delete(true)
            var quotedMsg = await msg.getQuotedMessage();
            var data = await youtube.mainF(quotedMsg.body);
            if (data == "error") {
                client.sendMessage(msg.to, `🙇‍♂️ *Error*\n\n` + "```Something Unexpected Happened to fetch the YouTube video```")
            } else {
                client.sendMessage(msg.to, new MessageMedia(data.image.mimetype, data.image.data, data.image.filename), { caption: `*${data.title}*\n\nViews: ` + "```" + data.views + "```\nLikes: " + "```" + data.likes + "```\nComments: " + "```" + data.comments + "```\n\n*Download Link* 👇\n" + "```" + data.download_link + "```" });
            }

        } else if (msg.body.startsWith("!weather ")) { // Weather Module

            msg.delete(true)
            var data = await weather.mainF(msg.body.replace("!weather ", ""));
            if (data == "error") {
                client.sendMessage(msg.to, `🙇‍♂️ *Error*\n\n` + "```Something Unexpected Happened to fetch Weather```")
            } else {
                client.sendMessage(msg.to, `*Today's Weather at ${data.place}*\n` + "```" + data.current_observation.text + " (" + data.current_observation.temperature + "°C)```\n\n*Type:* " + "```" + data.today_forcast.text + "```\n*Max temperature:* " + "```" + data.today_forcast.high + "°C```\n*Min temperature:* " + "```" + data.today_forcast.low + "°C```");
            }

        } else if (msg.body.startsWith("!tr") && msg.hasQuotedMsg) { // Translator Module reply

            msg.delete(true)
            var quotedMsg = await msg.getQuotedMessage()
            var data = await translator.argu(quotedMsg.body, msg.body)
            if (data == "error") {
                client.sendMessage(msg.to, `🙇‍♂️ *Error*\n\n` + "```Something Unexpected Happened while translate```")
            } else {
                client.sendMessage(msg.to, `*Original (${data.ori_lang}) :* ` + "```" + data.original + "```\n\n" + `*Translation (${data.trans_lang}) :* ` + "```" + data.translated + "```")
            }

        } else if (msg.body.startsWith("!tr")) { // Translator Module

            msg.delete(true)
            var data = await translator.single(msg.body)
            if (data == "error") {
                client.sendMessage(msg.to, `🙇‍♂️ *Error*\n\n` + "```Something Unexpected Happened while translate```")
            } else {
                client.sendMessage(msg.to, `*Original (${data.ori_lang}) :* ` + "```" + data.original + "```\n\n" + `*Translation (${data.trans_lang}) :* ` + "```" + data.translated + "```")
            }

        } else if (msg.body.startsWith("!ud ")) { // Urban Dictionary Module

            msg.delete(true)
            var data = await ud.mainF(msg.body.replace("!ud ", ""))
            if (data == "error") {
                client.sendMessage(msg.to, `🙇‍♂️ *Error*\n\n` + "```Something Unexpected Happened while Lookup on Urban Dictionary```")
            } else {
                client.sendMessage(msg.to, "*Term:* ```" + data.term + "```\n\n" + "*Definition:* ```" + data.def + "```\n\n" + "*Example:* ```" + data.example + "```")
            }
        } else if (msg.body.startsWith("!sticker") && msg.hasQuotedMsg) { // Sticker Module

            msg.delete(true)
            var quotedMsg = await msg.getQuotedMessage();
            if (quotedMsg.hasMedia) {
                var attachmentData = await quotedMsg.downloadMedia();
                client.sendMessage(msg.to, new MessageMedia(attachmentData.mimetype, attachmentData.data, attachmentData.filename), { sendMediaAsSticker: true });
            } else {
                client.sendMessage(msg.to, `🙇‍♂️ *Error*\n\n` + "```No image found to make a Sticker```")
            }
        } else if (msg.body == "!awake") {
            client.sendPresenceAvailable()
            msg.reply("```" + "I will be online from now." + "```")
        }
    }
});

client.on('message_revoke_everyone', async(after, before) => {
    if (before) {
        if (before.fromMe !== true && before.hasMedia !== true && before.author == undefined && config.enable_delete_alert == "true") {
            client.sendMessage(before.from, "_You deleted this message_ 👇👇\n\n" + before.body)
        }
    }
});


client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});

app.get('/', (req, res) => {
    res.send('<h1>This server is powered by Whatsbot<br><a href="https://github.com/TheWhatsBot/WhatsBot">https://github.com/TheWhatsBot/WhatsBot</a></h1>')
})

app.use('/public', express.static('public'), serveIndex('public', { 'icons': true })) // public directory will be publicly available


app.listen(process.env.PORT || 8080, () => {
    console.log(`Server listening at Port: ${process.env.PORT || 8080}`)
})
