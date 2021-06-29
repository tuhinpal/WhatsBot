// Coded by Sumanjay (https://github.com/cyberboysumanjay)
const axios = require('axios');

async function getDetails(title) {
    var mainconfig = {
        method: 'get',
        url: `https://sumanjay.vercel.app/watch/${title}` //Feel free to use this API 
    }
    return axios(mainconfig)
        .then(async function (response) {
            var data = response.data
            if (data.length>0) {
                var respoimage = await axios.get(data[0].movie_thumb, { responseType: 'arraybuffer' }).catch(function(error) {
                    return "error"
                })
                var watchdata = data[0]
                var caption = `Here is the details of the ${watchdata.type} 👇\nTitle: *${watchdata.title}*\n`
                if (watchdata.release_year){
                    caption += `Released in Year: *${watchdata.release_year}*\n`
                }
                if (watchdata.score.imdb){
                    caption += `IMDB Rating: *${watchdata.score.imdb}*\n`
                }
                if (watchdata.score.tmdb){
                    caption += `TMDB Rating: *${watchdata.score.tmdb}*\n`
                }
                var providers = watchdata.providers
                if (Object.keys([providers]).length>0){
                    caption += `\n${watchdata.title} ${watchdata.type} is available to watch on:\n`
                }
                for(var provider in providers) {
                    var providerTitle = provider.charAt(0).toUpperCase() + provider.substring(1).toLowerCase();
                    caption += `*${providerTitle}*: ${providers[provider]}\n`
                }
                var out = ({
                    mimetype: "image/jpg",
                    thumbdata: Buffer.from(respoimage.data).toString('base64'),
                    caption: caption,
                    filename: "watch"
                })
                return out
            } else {
                return "No Results"
            }
        })
        .catch(function (error) {
            return "error"
        })
}

module.exports = {
    getDetails
}