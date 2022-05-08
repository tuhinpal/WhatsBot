const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { write, clean } = require("./manage");

clean();
const client = new Client({
  puppeteer: { headless: true, args: ["--no-sandbox"] },
  authStrategy: new LocalAuth({ clientId: "whatsbot" }),
});
client.initialize();

client.on("qr", (qr) => {
  console.log(`Scan this QR Code and copy the JSON\n`);
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  client.destroy();
  console.log("Please wait...");
  // wait because filesystem is busy
  setTimeout(async () => {
    console.log("Session has been created");
    await write();
    process.exit();
  }, 3000);
});
