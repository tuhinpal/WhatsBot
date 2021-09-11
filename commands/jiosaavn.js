//jshint esversion:8
const {MessageMedia} = require('whatsapp-web.js');
const axios = require('axios');
const downloadserverurl = "https://mder.pages.dev/download/";

async function imageencode(link) {
    var respoimage = await axios.get(link, { responseType: 'arraybuffer' });

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

const run = async (client,msg) => {
    if(msg.hasQuotedMsg) {
        msg.delete(true);
        var quotedMsg = await msg.getQuotedMessage();
        var data = await saavn(quotedMsg.body);
        if (data == "error") {
            client.sendMessage(msg.to, `🙇‍♂️ *Error*\n\n` + "```Something Unexpected Happened to fetch this Jiosaavn Link, Maybe it's a wrong url.```");
        } 
        else {
            client.sendMessage(msg.to, new MessageMedia(data.image.mimetype, data.image.data, data.image.filename), { caption: `🎶 *${data.title}* _(${data.released_year})_\n\n📀 *Artist :*  ` + "```" + data.singers + "```\n📚 *Album :*  " + "```" + data.album + "```" + `\n\n*Download Url* 👇\n${data.url}` });
        }
    }
    else {
        msg.delete(true);
        let data = await saavn(msg.body.replace("!jiosaavn ", ""));
        if (data == "error") {
            client.sendMessage(msg.to, `🙇‍♂️ *Error*\n\n` + "```Something Unexpected Happened to fetch this Jiosaavn Link, Maybe it's a wrong url.```");
        } else {
            client.sendMessage(msg.to, new MessageMedia(data.image.mimetype, data.image.data, data.image.filename), { caption: `🎶 *${data.title}* _(${data.released_year})_\n\n📀 *Artist :*  ` + "```" + data.singers + "```\n📚 *Album :*  " + "```" + data.album + "```" + `\n\n*Download Url* 👇\n${data.url}` });
        }
    }
};


module.exports = {run};
