//jshint esversion:8
const translate = require('@k3rn31p4nic/google-translate-api');
const config = require('../config');

async function translator(langReq,text) {
    let lang;
    if (!langReq || langReq == "def") {
        lang = config.default_tr_lang;
    } else {
        lang = langReq;
    }

    return translate(text, { to: lang }).then(res => {
        return ({
            original: text,
            ori_lang: res.from.language.iso,
            translated: res.text,
            trans_lang: lang
        });
    }).catch(err => {
        return "error";
    });
}

const execute = async (client,msg,args) => {
    let data;
    msg.delete(true);
    if(msg.hasQuotedMsg) {
        let quotedMsg = await msg.getQuotedMessage();
        data = await translator(args[0], quotedMsg.body);
    }
    else {
        let langReq = args.shift();
        data = await translator(langReq,args.join(' '));
    }

    if (data == "error") {
        await client.sendMessage(msg.to, `🙇‍♂️ *Error*\n\n` + "```Something Unexpected Happened while translate```");
    } else {
        await client.sendMessage(msg.to, `*Original (${data.ori_lang}) :* ` + "```" + data.original + "```\n\n" + `*Translation (${data.trans_lang}) :* ` + "```" + data.translated + "```");
    }
};



module.exports = {
    name: 'Translate',
    description: 'Translates given text to requested language',
    command: '!tr',
    help:'',
    execute};