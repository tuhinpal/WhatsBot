//jshint esversion:8
const {MessageMedia} = require('whatsapp-web.js');
const axios = require('axios');
const downloadserverurl = "https://musicder.t-ps.net/download/";

async function imageencode(link) {
    let respoimage = await axios.get(link, { responseType: 'arraybuffer' });

    return ({
        mimetype: "image/jpeg",
        data: Buffer.from(respoimage.data).toString('base64'),
        filename: "jiosaavn"
    });
}

async function saavn(url) {

    let mainconfig = {
        method: 'get',
        url: `https://jiosaavn-api.vercel.app/link?query=${url}`
    };
    return axios(mainconfig)
        .then(async function(response) {
            let data = response.data;
            let out = ({
                title: data.song,
                album: data.album,
                released_year: data.year,
                singers: data.singers,
                image: await imageencode(data.image),
                url: downloadserverurl + data.id
            });
            return out;
        })
        .catch(function(error) {
            return "error";
        });
}

const execute = async (client,msg,args) => {
    let data;

    if(msg.hasQuotedMsg) {
        let quotedMsg = await msg.getQuotedMessage();
        data = await saavn(quotedMsg.body);
    }
    else {
        data = await saavn(args[0]);
    }

    msg.delete(true);
    if (data == "error") {
        await client.sendMessage(msg.to, `🙇‍♂️ *Error*\n\n` + "```Something Unexpected Happened to fetch this Jiosaavn Link, Maybe it's a wrong url.```");
    } 
    else {
        await client.sendMessage(msg.to, new MessageMedia(data.image.mimetype, data.image.data, data.image.filename), { caption: `🎶 *${data.title}* _(${data.released_year})_\n\n📀 *Artist :*  ` + "```" + data.singers + "```\n📚 *Album :*  " + "```" + data.album + "```" + `\n\n*Download Url* 👇\n${data.url}` });
    }
};


module.exports = {
    name: 'Jiosaavn Song Download',
    description: 'Provides Download link for song via Jiosaavn',
    command: '!jiosaavn',
    commandType: 'plugin',
    isDependent: false,
    help: `*Jiosaavn*\n\nDownload a Jiosaavn song with this module. \n\n*!jiosaavn [Jiosaavn-Link]*\nor,\nReply a message with *!jiosaavn* to Download`,
    execute};