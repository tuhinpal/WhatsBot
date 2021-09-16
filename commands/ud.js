//jshint esversion:8
const dictionary = require('urban-dictionary');

async function ud(term) {

    return dictionary.term(term).then((result) => {
        const entries = result.entries;
        return ({
            term: entries[0].word,
            def: entries[0].definition,
            example: entries[0].example
        });
    }).catch((error) => {
        return "error";
    });
}

const execute = async (client,msg,args) => {
    msg.delete(true);
    let data = await ud(args.join(' '));
    if (data == "error") {
        await client.sendMessage(msg.to, `🙇‍♂️ *Error*\n\n` + "```Something Unexpected Happened while Lookup on Urban Dictionary```");
    } else {
        await client.sendMessage(msg.to, "*Term:* ```" + data.term + "```\n\n" + "*Definition:* ```" + data.def + "```\n\n" + "*Example:* ```" + data.example + "```");
    }
};

module.exports = {
    name: 'Urban Dictionary',
    description: 'Gets dictionary meanings of words',
    command: '!ud',
    commandType: 'plugin',
    isDependent: false,
    help: `*Urban Dictionary*\n\nUrban Dictionary is a crowdsourced online dictionary for slang words and phrases.\n\n*!ud [Word]*\nto search a word using Urban Dictionary`,
    execute};