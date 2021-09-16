//jshint esversion:8
const {MessageMedia} = require('whatsapp-web.js');
const axios = require('axios');
const config = require('../config');
const savefromdotnet = "https://en.savefrom.net/18/#url=https://www.youtube.com/watch?v=";

async function youtube(url) {
    let videoId;
    if (url.startsWith("https://youtu.be/")) {
        videoId = url.split("/").pop();
    } else if (url.startsWith("https://www.youtube.com/watch?v=")) {
        videoId = url.replace("https://www.youtube.com/watch?v=", "").replace("&" + url.split("&")[1], "");
    }
    return axios({
            method: 'get',
            url: `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${config.yt_data_api_key}&part=snippet,statistics`
        })
        .then(async function(r) {
            let out = ({
                title: r.data.items[0].snippet.title,
                likes: format(r.data.items[0].statistics.likeCount),
                views: format(r.data.items[0].statistics.viewCount),
                comments: format(r.data.items[0].statistics.commentCount),
                image: await imageencode(r.data.items[0].snippet.thumbnails.high.url),
                download_link: savefromdotnet + videoId
            });
            return out;
        })
        .catch(function(error) {
            return "error";
        });
}

async function imageencode(link) {
    let respoimage = await axios.get(link, { responseType: 'arraybuffer' });

    return ({
        mimetype: "image/jpeg",
        data: Buffer.from(respoimage.data).toString('base64'),
        filename: "youtube"
    });
}

function format(num) {
    let out;
    if (Math.abs(num) < 999) {
        out = num;
    }
    if (Math.abs(num) >= 999) {
        out = Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k+';
    }
    if (Math.abs(num) >= 999999) {
        out = Math.sign(num) * ((Math.abs(num) / 1000000).toFixed(1)) + 'm+';
    }
    if (Math.abs(num) >= 999999999) {
        out = Math.sign(num) * ((Math.abs(num) / 1000000000).toFixed(1)) + 'b+';
    }
    return out;
}

const execute = async (client,msg,args) => {

    let data;

    msg.delete(true);

    if(msg.hasQuotedMsg) {
        let quotedMsg = await msg.getQuotedMessage();
        data = await youtube(quotedMsg.body);
    }
    else {
        data = await youtube(args[0]);
    }

    if (data == "error") {
        await client.sendMessage(msg.to, `🙇‍♂️ *Error*\n\n` + "```Something Unexpected Happened to fetch the YouTube video```");
    } else {
        await client.sendMessage(msg.to, new MessageMedia(data.image.mimetype, data.image.data, data.image.filename), { caption: `*${data.title}*\n\nViews: ` + "```" + data.views + "```\nLikes: " + "```" + data.likes + "```\nComments: " + "```" + data.comments + "```\n\n*Download Link* 👇\n" + "```" + data.download_link + "```" });
    }

};



module.exports = {
    name: 'YouTube Download',
    description: 'Gets download link for youtube video',
    command: '!yt',
    commandType: 'plugin',
    isDependent: false,
    help: `*Youtube*\n\nDownload a Youtube video with this command.\n\n*!yt [Youtube-Link]*\nor,\nReply a message with *!yt* to Download`,
    execute};