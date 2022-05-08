const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { write, clean } = require("./manage");
const readline = require("readline");
const app = require("express")();

clean();

const client = new Client({
  puppeteer: { headless: true, args: ["--no-sandbox"] },
  authStrategy: new LocalAuth({ clientId: "whatsbot" }),
});

let password = null;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  "Enter password to encrypt session (You need to put this in ENV): ",
  (answer) => {
    password = answer;
    console.log("Password set to:", password);
    console.log("Generating QR Code...");
    rl.close();
    client.initialize();
  }
);

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
    await write(password);
    app.listen(8080, () => {
      console.log(
        "Go to http://{app_url}/session.secure to download the session"
      );
    });
  }, 3000);
});

app.get("/session.secure", (req, res) => {
  res.download("./session.secure");
});
