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
    name: 'Delete Message',
    description: 'Deletes the selected message if it is sent by the User',
    command: '!delete',
    commandType: 'admin',
    isDependent: false,
    help: `*Delete Message*\n\n Deletes the selected messages for all users.\n\n to execute, reply to a message with !delete.\n\n NOTE:- It deletes only those messages which are sent by you.`,
    execute};