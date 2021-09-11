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
    if(msg.hasQuotedMsg) {
        msg.delete(true);
        let quotedMsg = await msg.getQuotedMessage();
        let data = await qrgen(quotedMsg.body);
        client.sendMessage(msg.to, new MessageMedia(data.mimetype, data.data, data.filename), { caption: `QR code for 👇\n` + "```" + quotedMsg.body + "```" });
    }
    else {
        msg.delete(true);
        let data = await qrgen(msg.body.replace("!qr ", ""));
        client.sendMessage(msg.to, new MessageMedia(data.mimetype, data.data, data.filename), { caption: `QR code for 👇\n` + "```" + msg.body.replace("!qr ", "") + "```" });
    }
};

module.exports = {run};
