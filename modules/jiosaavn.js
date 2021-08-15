const axios = require('axios');
const downloadserverurl = "https://mder.pages.dev/download/"

async function mainF(url) {

    var mainconfig = {
        method: 'get',
        url: `https://jiosaavn-api.vercel.app/link?query=${url}`
    }
    return axios(mainconfig)
        .then(async function(response) {
            var data = response.data
            var out = ({
                title: data.song,
                album: data.album,
                released_year: data.year,
                singers: data.singers,
                image: await imageencode(data.image),
                url: downloadserverurl + data.id
            })
            return out
        })
        .catch(function(error) {
            return "error"
        })
}

async function imageencode(link) {
    var respoimage = await axios.get(link, { responseType: 'arraybuffer' });

    return ({
        mimetype: "image/jpeg",
        data: Buffer.from(respoimage.data).toString('base64'),
        filename: "jiosaavn"
    })
}

module.exports = {
    mainF,
}