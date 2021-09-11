//jshint esversion:8
const {MessageMedia} = require('whatsapp-web.js');
const qr = require('qr-image');

async function qrgen(text) {

    const data = ({
        mimetype: "image/png",
        data: await (qr.imageSync(text, { type: 'png' }).toString('base64')),
        filename: text + ".png"
    });
    return data;
}

const run = async (client,msg) => {

    let data;
    msg.delete(true);

    if(msg.hasQuotedMsg) {
        let quotedMsg = await msg.getQuotedMessage();
        data = await qrgen(quotedMsg.body);
        msg = quotedMsg;
    }
    else {
        data = await qrgen(msg.body.replace("!qr ", ""));
    }
    
    client.sendMessage(msg.to, new MessageMedia(data.mimetype, data.data, data.filename), { caption: `QR code for 👇\n` + "```" + msg.body + "```" });
};

module.exports = {run};
