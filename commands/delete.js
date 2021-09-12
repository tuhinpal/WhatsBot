//jshint esversion:8

const execute = async (client,msg) => {
    if(msg.hasQuotedMsg) {
        msg.delete(true);
        let quotedMsg = await msg.getQuotedMessage();
        if (quotedMsg.fromMe) {
            quotedMsg.delete(true);
        } 
        else {
            await client.sendMessage(msg.to, "Sorry, I can't delete that message.");
        }
    }
};

module.exports = {
    name: 'delete',
    description: 'Deletes the selected message if it is sent by the User',
    command: '!delete',
    help: '',
    execute};