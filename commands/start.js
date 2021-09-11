
const run = (client,msg) => {
    client.sendMessage(msg.to,"bot started");
};

module.exports = {run};