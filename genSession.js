const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({ puppeteer: { headless: true, args: ['--no-sandbox'] } });
client.initialize();

client.on('qr', (qr) => {
    console.log(`Scan this QR Code and copy the JSON\n`)
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', (session) => {
    console.log(JSON.stringify(session))
    process.exit()
});