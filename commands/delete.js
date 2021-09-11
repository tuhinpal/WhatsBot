//jshint esversion:8

const run = async (client,msg) => {
    if(msg.hasQuotedMsg) {
        msg.delete(true);
        let quotedMsg = await msg.getQuotedMessage();
        console.log(quotedMsg);
        if (quotedMsg.fromMe) {
            quotedMsg.delete(true);
        } 
        else {
            client.sendMessage(msg.to, "Sorry, I can't delete that message.");
        }
    }
};

module.exports = {run};