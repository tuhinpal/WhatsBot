const translate = require('@k3rn31p4nic/google-translate-api')
const config = require('../config')

async function single(body) {

    var text = body.replace(body.split(" ")[0] + " ", "")
    var langReq = body.split(" ")[0]
    if (langReq == "!tr") {
        var lang = config.default_tr_lang
    } else {
        var lang = langReq.replace("!tr", "")
    }

    return translate(text, { to: lang }).then(res => {
        return ({
            original: text,
            ori_lang: res.from.language.iso,
            translated: res.text,
            trans_lang: lang
        })
    }).catch(err => {
        return "error"
    })
}
async function argu(text, body) {
    if (body == "!tr") {
        var lang = config.default_tr_lang
    } else {
        var lang = body.replace("!tr", "")
    }
    return translate(text, { to: lang }).then(res => {
        return ({
            original: text,
            ori_lang: res.from.language.iso,
            translated: res.text,
            trans_lang: lang
        })
    }).catch(err => {
        return "error"
    })
}

module.exports = {
    single,
    argu
}