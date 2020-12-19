const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const client = new Client({ puppeteer: { headless: true, args: ['--no-sandbox'] } });
client.initialize();

client.on('qr', (qr) => {
    console.log(`Scan this QR Code and copy the JSON\n`)
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', (session) => {
    console.log(JSON.stringify(session))
    fs.readFile(__dirname + '/session.json', { encoding: 'utf8' }, function(err, data) {
        if (err) {
            fs.writeFileSync(__dirname + '/session.json', JSON.stringify(session))
            console.log("\n\nToken also saved on a file named session.json in this directory. Please delete this file after copy if you will use enviroment variable.")
            process.exit()
        } else {
            fs.unlinkSync(__dirname + '/session.json')
            fs.writeFileSync(__dirname + '/session.json', JSON.stringify(session))
            console.log("\n\nToken also saved on a file named session.json in this directory. Please delete this file after copy if you will use enviroment variable.")
            process.exit()
        }
    })
});
