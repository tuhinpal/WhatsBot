// Special thanks to Sumanjay for his carbon api

const axios = require('axios');

async function mainF(text) {

    var respoimage = await axios.get(`https://carbonnowsh.herokuapp.com/?code=${text.replace(/ /gi,"+")}&theme=darcula&backgroundColor=rgba(36, 75, 115)`, { responseType: 'arraybuffer' }).catch(function(error) {
        return "error"
    })

    return ({
        mimetype: "image/png",
        data: Buffer.from(respoimage.data).toString('base64'),
        filename: "carbon"
    })
}

module.exports = {
    mainF
}