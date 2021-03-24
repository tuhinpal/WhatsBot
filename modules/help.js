const config = require('../config');

async function mainF(text) {

    if (text == "!help") {
        return `🔱 *Commands*\n\n⭐ *block* - _!block to execute_\n⭐ *mute* - _!mute to execute_\n⭐ *unmute* - _!unmute to execute_\n⭐ *delete* - _Reply your message with !delete to execute_\n\n🛠 *All Modules*\n\n⭐ *pmpermit* - _Permission for direct message_\n⭐ *term* - _Terminal in Whatsapp_\n⭐ *yt* - _Download Youtube video from link_\n⭐ *weather* - _Lookup today's weather_\n⭐ *carbon* - _Generate beautiful image from text_\n⭐ *jiosaavn* - _Download a song from Jiosaavn Link_\n⭐ *zee5* - _Download a Zee5 content_\n⭐ *qr* - _Generate QR from text_\n⭐ *directlink* - _Get direct link of photos_\n⭐ *tr* - _Translate Text_\n⭐ *ud* - _Urban Dictionary_\n⭐ *sticker* - _Create sticker from Image_\n\n*!help [Plugin Name]* - To get more info `

    } else if (text.startsWith("!help ")) {
        var param = text.split(" ")[1]
        if (param == "pmpermit") {
            return `*Pmpermit*\n\nIf an user messaged you, an automated message sent to him. If still he messages you for 3 times he will be muted for ${config.pmpermit_mutetime/60} Minutes.\n\n_You can allow him for pm by these commands_ 👇\n*!allow* - Allow an user for PM\n*!disallow* - Disallow an allowed user for PM`
        } else if (parm == "spam") {
            return `*Spam*\n\nSpam Messages. \n\n*!spam [count | text]*\nOR\nreply *!spam [count]* to any message`
        } else if (param == "term") {
            return `*Terminal*\n\nYou can execute any command with this. By default it will run from _public_ directory. If you are leeching something it will be available publicly at\n_http://[Your-App-Url]/public_\n\n*!term [command]*\nTo execute a command`
        } else if (param == "weather") {
            return `*Weather*\n\nLookup a city's weather with this command.\n\n*!weather [Place-Name]*\nTo check a weather`
        } else if (param == "yt") {
            return `*Youtube*\n\nDownload a Youtube video with this command.\n\n*!yt [Youtube-Link]*\nor,\nReply a message with *!yt* to Download`
        } else if (param == "carbon") {
            return `*Carbon*\n\nGenerate beautiful image with carbon.now.sh. Just send the text it will generate an image for you.\n\n*!carbon [Text]*\nor,\nReply a message with *!carbon* to Create`
        } else if (param == "jiosaavn") {
            return `*Jiosaavn*\n\nDownload a Jiosaavn song with this module. \n\n*!jiosaavn [Jiosaavn-Link]*\nor,\nReply a message with *!jiosaavn* to Download`
        } else if (param == "zee5") {
            return `*Zee5*\n\nStream all content of zee5 for free with this module. \n\n*!zee5 [Particular-Episode/Movie-Link]*\n to Stream`
        } else if (param == "qr") {
            return `*QR*\n\nGenerate QR code with this module. Just send the text it will generate QR Code image for you.\n\n*!qr [Text]*\nor,\nReply a message with *!qr* to Create`
        } else if (param == "directlink") {
            return `*Directlink*\n\nIt will generate photo's directlink for you.\n\nReply a photo with *!directlink* to Create`
        } else if (param == "tr") {
            return `*Translator*\n\nIt will translate text in different languages.\n\n*!tr [Text]*\nor,\nReply a message with *!tr*\n\nor,\n\n*!tr[Output-Language] [Text]*\nor,\nReply a message with \n*!tr[Output-Language]*\nto translate it`
        } else if (param == "ud") {
            return `*Urban Dictionary*\n\nUrban Dictionary is a crowdsourced online dictionary for slang words and phrases.\n\n*!ud [Word]*\nto search a word using Urban Dictionary`
        } else if (param == "sticker") {
            return `*Sticker*\n\nCreate sticker from Image.\n\nReply an image with *!sticker* to get a sticker of that image.`
        } else {
            return `🔱 *Commands*\n\n⭐ *block* - _!block to execute_\n⭐ *mute* - _!mute to execute_\n⭐ *unmute* - _!unmute to execute_\n⭐ *spam* - _spam messages, for more info do_ ```!help spam```\n⭐ *delete* - _Reply your message with !delete to execute_\n\n🛠 *All Modules*\n\n⭐ *pmpermit* - _Permission for direct message_\n⭐ *term* - _Terminal in Whatsapp_\n⭐ *yt* - _Download Youtube video from link_\n⭐ *weather* - _Lookup today's weather_\n⭐ *carbon* - _Generate beautiful image from text_\n⭐ *jiosaavn* - _Download a song from Jiosaavn Link_\n⭐ *zee5* - _Download a Zee5 content_\n⭐ *qr* - _Generate QR from text_\n⭐ *directlink* - _Get direct link of photos_\n⭐ *tr* - _Translate Text_\n⭐ *ud* - _Urban Dictionary_\n\n*!help [Plugin Name]* - To get more info `
        }
    }
}


module.exports = {
    mainF
}
