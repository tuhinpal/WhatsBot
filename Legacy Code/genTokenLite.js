const { Client } = require('whatsapp-web.js');
var QRCode = require("qrcode-svg");
const fs = require('fs');
const app = require('express')()

const client = new Client({ puppeteer: { headless: true, args: ['--no-sandbox'] } });
client.initialize();

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/modules/tempdata/qr.html`)
})

app.get('/qr.svg', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    try {
        fs.readFileSync(`${__dirname}/modules/tempdata/qr.svg`, 'utf8')
        res.sendFile(`${__dirname}/modules/tempdata/qr.svg`)
    } catch (error) {
        res.sendFile(`${__dirname}/modules/tempdata/loading.gif`)
    }
})

app.listen(8000, () => {
    console.log("Please make your Port 8000 public and open that in your browser")
    client.on('qr', (qr) => {
        console.log("QR Refreshed")
        var svg = new QRCode(qr).svg();
        fs.writeFileSync(`${__dirname}/modules/tempdata/qr.svg`, svg)
    });

    client.on('authenticated', (session) => {
        console.log(`\nYour Session string:\n`)
        console.log(JSON.stringify(session))
        fs.writeFileSync(__dirname + '/session.json', JSON.stringify(session))
        console.log("\n\nToken also saved on a file named session.json in this directory. Please delete this file after copy if you will use enviroment variable.")
        process.exit(0);
    })
})