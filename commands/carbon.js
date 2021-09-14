//jshint esversion:8
const { MessageMedia } = require('whatsapp-web.js');
const axios = require('axios');

async function carbon(text) {

    let respoimage = await axios.get(`https://carbonnowsh.herokuapp.com/?code=${text.replace(/ /gi,"+")}&theme=darcula&backgroundColor=rgba(36, 75, 115)`, { responseType: 'arraybuffer' }).catch(function(error) {
        return "error";
    });

    return ({
        mimetype: "image/png",
        data: Buffer.from(respoimage.data).toString('base64'),
        filename: "carbon"
    });
}

const execute = async (client,msg,args) => {
    let data;

    msg.delete(true);
    if( msg.hasQuotedMsg){
        let quotedMsg = await msg.getQuotedMessage();
        data = await carbon(quotedMsg.body);
        msg = quotedMsg;
    }
    else {
        data = await carbon(args.join(' '));
    }

    if (data == "error") {
        await client.sendMessage(msg.to, `🙇‍♂️ *Error*\n\n` + "```Something Unexpected Happened to create the Carbon.```");
    } else {
        await client.sendMessage(msg.to, new MessageMedia(data.mimetype, data.data, data.filename), { caption: `Carbon for 👇\n` + "```" + msg.body.replace("!carbon ", "") + "```" });
    }

};


module.exports = {
    name: 'Carbon',
    description: 'Creates a crabon.sh image from text',
    command: '!carbon',
    commandType: 'plugin',
    isDependent: false,
    help: '',
    execute};