//jshint esversion:8
// Coded by Sumanjay (https://github.com/cyberboysumanjay)
const {MessageMedia} = require('whatsapp-web.js');
const axios = require('axios');

async function getDetails(title) {
    let mainconfig = {
        method: 'get',
        url: `https://sumanjay.vercel.app/watch/${title}` //Feel free to use this API 
    };
    return axios(mainconfig)
        .then(async function (response) {
            let data = response.data;
            if (data.length > 0) {
                let respoimage = await axios.get(data[0].movie_thumb, { responseType: 'arraybuffer' }).catch(function(error) {
                    return "error";
                });
                let watchdata = data[0];
                let caption = `Here is the details of the ${watchdata.type} 👇\nTitle: *${watchdata.title}*\n`;
                if (watchdata.release_year){
                    caption += `Released in Year: *${watchdata.release_year}*\n`;
                }
                if(watchdata.score){
                    if (watchdata.score.imdb){
                        caption += `IMDB Rating: *${watchdata.score.imdb}*\n`;
                    }
                    if (watchdata.score.tmdb){
                        caption += `TMDB Rating: *${watchdata.score.tmdb}*\n`;
                    }
                }
                if (watchdata.providers){
                    caption += `\n${watchdata.title} ${watchdata.type} is available to watch on:\n`;
                    let providers = watchdata.providers;
                    for(let provider in providers) {
                        let providerTitle = provider.charAt(0).toUpperCase() + provider.substring(1).toLowerCase();
                        caption += `*${providerTitle}*: ${providers[provider]}\n`;
                    }
                }
                let out = ({
                    mimetype: "image/jpg",
                    thumbdata: Buffer.from(respoimage.data).toString('base64'),
                    caption: caption,
                    filename: "watch"
                });
                return out;
            } else {
                return "No Results";
            }
        })
        .catch(function (error) {
            console.log(error);
            return "error";
        });
}
const execute = async (client,msg,args) => {
    msg.delete(true);
    let data = await getDetails(args.join(' '));
    if (data == "error") {
        await client.sendMessage(msg.to, `🙇‍♂️ *Error*\n\n` + "```Something Unexpected Happened while fetching Movie/TV Show Details.```");
    }
    else if (data == "No Results") {
        await client.sendMessage(msg.to, `🙇‍♂️ *No Results Found!*\n\n` + "```Please check the name of Movie/TV Show you have entered.```");
    }
    else {
        await client.sendMessage(msg.to, new MessageMedia(data.mimetype, data.thumbdata, data.filename), { caption: data.caption });
    }
    
};

module.exports = {
    name: 'Watch',
    description: 'Get show/movie details',
    command: '!watch',
    commandType: 'plugin',
    isDependent: false,
    help: `*Watch*\n\nGet information about where to watch a Movie/Show. \n\n*!watch [movie-name]*\n`,
    execute};