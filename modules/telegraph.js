const axios = require('axios');
const FormData = require('form-data');
var mime = require('mime-to-extensions')

async function mainF(attachmentData) {
    let form = new FormData();
    form.append('file', Buffer.from(attachmentData.data, 'base64'), {
        filename: `telegraph.${mime.extension(attachmentData.mimetype)}`

    });

    return axios.create({
        headers: form.getHeaders()
    }).post('https://telegra.ph/upload', form).then(response => {
        return "https://telegra.ph" + response.data[0].src
    }).catch(error => {
        return "error"
    });

}

module.exports = {
    mainF
}