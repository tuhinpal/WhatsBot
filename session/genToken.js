const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const logger = require("../logger");

const client = new Client({
  puppeteer: { headless: true, args: ["--no-sandbox"] },
});
client.initialize();

client.on("qr", (qr) => {
  console.log(`Scan this QR Code and copy the JSON\n`);
  qrcode.generate(qr, { small: true });
});

var token = "";

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
