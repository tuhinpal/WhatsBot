const { Client } = require("whatsapp-web.js");
var QRCode = require("qrcode-svg");
const fs = require("fs");
const app = require("express")();
const logger = require("../logger");

const client = new Client({
  puppeteer: { headless: true, args: ["--no-sandbox"] },
});
client.initialize();

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/assets/qr.html`);
});

app.get("/qr.svg", (req, res) => {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  try {
    fs.readFileSync(`${__dirname}/assets/qr.svg`, "utf8");
    res.sendFile(`${__dirname}/assets/qr.svg`);
  } catch (error) {
    res.sendFile(`${__dirname}/assets/loading.gif`);
  }
});

var token = "";

app.listen(8000, () => {
  console.log(
    "Please make your Port 8000 public and open that in your browser"
  );
  client.on("qr", (qr) => {
    console.log("QR Refreshed");
    var svg = new QRCode(qr).svg();
    fs.writeFileSync(`${__dirname}/assets/qr.svg`, svg);
  });

  client.on("authenticated", (session) => {
    token = session;
  });

  client.on("ready", async () => {
    // console.log(JSON.stringify(token));

    await logger(
      client,
      `Here is your session token. Please keep is as a secret. You can delete the file if you don't need it.\n\n*Generated at:* ${new Date()}`
    );
    await logger(client, JSON.stringify(token));

    console.log(
      "\n\nPlease open your Whatsapp and see your chat. Your session token will be saved there."
    );

    setTimeout(() => {
      process.exit();
    }, 5000);
  });
});
