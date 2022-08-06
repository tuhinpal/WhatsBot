//jshint esversion:8
const express = require("express");
const app = express();
const { Client, LocalAuth } = require("whatsapp-web.js");
const pmpermit = require("./helpers/pmpermit");
const config = require("./config");
const fs = require("fs");
const logger = require("./logger");
const { afkStatus } = require("./helpers/afkWrapper");

const client = new Client({
  puppeteer: { headless: true, args: ["--no-sandbox"] },
  authStrategy: new LocalAuth({ clientId: "whatsbot" }),
});

client.commands = new Map();

fs.readdir("./commands", (err, files) => {
  if (err) return console.error(e);
  files.forEach((commandFile) => {
    if (commandFile.endsWith(".js")) {
      let commandName = commandFile.replace(".js", "");
      const command = require(`./commands/${commandName}`);
      client.commands.set(commandName, command);
    }
  });
});

client.initialize();

client.on("auth_failure", () => {
  console.error(
    "There is a problem in authentication, Kindly set the env var again and restart the app"
  );
});

client.on("ready", () => {
  console.log("Bot has been started");
});

client.on("message", async (msg) => {
  if (!msg.author && config.pmpermit_enabled === "true") {
    // Pm check for pmpermit module
    var checkIfAllowed = await pmpermit.handler(msg.from.split("@")[0]); // get status
    if (!checkIfAllowed.permit) {
      // if not permitted
      if (checkIfAllowed.block) {
        await msg.reply(checkIfAllowed.msg);
        setTimeout(async () => {
          await (await msg.getContact()).block();
        }, 3000);
      } else if (!checkIfAllowed.block) {
        msg.reply(checkIfAllowed.msg);
      }
    } else {
      await checkAndApplyAfkMode();
    }
  }

  if (!msg.author && config.pmpermit_enabled !== "true") {
    await checkAndApplyAfkMode();
  }

  async function checkAndApplyAfkMode() {
    if (!msg.author) {
      try {
        let getstatus = await afkStatus();
        if (getstatus.on) {
          await msg.reply(`${getstatus.message}\n\n_Powered by WhatsBot_`);
        }
      } catch (e) {
        await logger(
          client,
          `Incoming afk message error from ${msg.from.split("@")[0]}.\n\n${
            e?.message
          }`
        );
      }
    }
  }
});

client.on("message_create", async (msg) => {
  // auto pmpermit
  try {
    if (config.pmpermit_enabled == "true") {
      var otherChat = await (await msg.getChat()).getContact();
      if (
        msg.fromMe &&
        msg.type !== "notification_template" &&
        otherChat.isUser &&
        !(await pmpermit.isPermitted(otherChat.number)) &&
        !otherChat.isMe &&
        !msg.body.startsWith("!") &&
        !msg.body.endsWith("_Powered by WhatsBot_")
      ) {
        await pmpermit.permit(otherChat.number);
        await msg.reply(
          `You are automatically permitted for message !\n\n_Powered by WhatsBot_`
        );
      }
    }
  } catch (ignore) {}

  if (msg.fromMe && msg.body.startsWith("!")) {
    let args = msg.body.slice(1).trim().split(/ +/g);
    let command = args.shift().toLowerCase();

    console.log({ command, args });

    if (client.commands.has(command)) {
      try {
        await client.commands.get(command).execute(client, msg, args);
      } catch (error) {
        console.log(error);
      }
    } else {
      await client.sendMessage(
        msg.to,
        "No such command found. Type !help to get the list of available commands"
      );
    }
  }
});

client.on("message_revoke_everyone", async (after, before) => {
  if (before) {
    if (
      before.fromMe !== true &&
      before.hasMedia !== true &&
      before.author == undefined &&
      config.enable_delete_alert == "true"
    ) {
      client.sendMessage(
        before.from,
        "_You deleted this message_ 👇👇\n\n" + before.body
      );
    }
  }
});

client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
});

app.get("/", (req, res) => {
  res.send(
    '<h1>This server is powered by Whatsbot<br><a href="https://github.com/tuhinpal/WhatsBot">https://github.com/tuhinpal/WhatsBot</a></h1>'
  );
});

app.use(
  "/public",
  express.static("public"),
  require("serve-index")("public", { icons: true })
); // public directory will be publicly available

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server listening at Port: ${process.env.PORT || 8080}`);
});
