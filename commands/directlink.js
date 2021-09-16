//jshint esversion:8
const axios = require('axios');
const FormData = require('form-data');
let mime = require('mime-to-extensions');

async function telegraph(attachmentData) {
    let form = new FormData();
    form.append('file', Buffer.from(attachmentData.data, 'base64'), {
        filename: `telegraph.${mime.extension(attachmentData.mimetype)}`

    });

    return axios.create({
        headers: form.getHeaders()
    }).post('https://telegra.ph/upload', form).then(response => {
        return "https://telegra.ph" + response.data[0].src;
    }).catch(error => {
        return "error";
    });

}
const execute = async (client,msg) => {
    msg.delete(true);
    if(msg.hasQuotedMsg){
        let quotedMsg = await msg.getQuotedMessage();
        let attachmentData = await quotedMsg.downloadMedia();
        let data = await telegraph(attachmentData);
        if (data == "error") {
            quotedMsg.reply(`Error occured while create direct link.`);
        } else {
            quotedMsg.reply(`🔗 *Direct Link 👇*\n\n` + "```" + data + "```");
        }
    }
    else{
        await client.sendMessage(msg.to,"Please reply to a media file");
    }
};


module.exports = {
    name: 'Direct Link',
    description: 'uploads media toh telegra.ph and creates a direct download link',
    command: '!directlink',
    commandType: 'plugin',
    isDependent: false,
    help: `*Directlink*\n\nIt will generate photo's directlink for you.\n\nReply a photo with *!directlink* to Create`,
    execute};