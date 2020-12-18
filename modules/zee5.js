const axios = require('axios');
const playserverurl = "https://zee5-player.vercel.app/player?id="

async function mainF(url) {
    var id = url.split("/").pop()
    var tok = await token()
    if (tok == "error") {
        return "error"
    } else {
        var mainconfig = {
            method: 'get',
            url: `https://gwapi.zee5.com/content/details/${id}?translation=en&country=IN&version=2`,
            headers: {
                'x-access-token': tok,
                'Content-Type': 'application/json'
            }
        }
        return axios(mainconfig)
            .then(async function(response) {
                var data = response.data
                var out = ({
                    title: data.title,
                    genre: data.genre[0].value,
                    image: await imageencode(data.image_url.replace("270x152", "1170x658")),
                    description: data.description,
                    url: playserverurl + id
                })
                return out
            })
            .catch(function(error) {
                return "error"
            })
    }
}

async function token() {
    var tokc = {
        method: 'get',
        url: 'https://useraction.zee5.com/token/platform_tokens.php?platform_name=web_app'
    }
    return axios(tokc)
        .then(function(respo) {
            return respo.data.token
        })
        .catch(function(err) {
            return "error"
        })
}

async function imageencode(link) {
    var respoimage = await axios.get(link, { responseType: 'arraybuffer' });

    return ({
        mimetype: "image/webp",
        data: Buffer.from(respoimage.data).toString('base64'),
        filename: "zee5"
    })
}

module.exports = {
    mainF,
}