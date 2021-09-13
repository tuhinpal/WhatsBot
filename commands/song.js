//jshint esversion:8
const {search} = require('../modules/song');
const execute = async (client,msg,args) => {
    msg.delete(true);
    let getdata = await search(args.join(' '));
    let sendmessage = await client.sendMessage(msg.to, getdata.content); // have to grab the message ID 
    if (getdata.status) {
        fs.writeFileSync(`${__dirname}/tempdata/song~${sendmessage.id.id}.json`, JSON.stringify(getdata.songarray));
    }
};

module.exports = {
    name: 'Search Song',
    description: 'Search songs on jiosaavn',
    command: '!song',
    help: '',
    execute};