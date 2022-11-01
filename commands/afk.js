//jshint esversion:11
const config = require("../config");
const logger = require("../logger");
const { setAfk, setOnline, getAFKData } = require("../helpers/afkWrapper");

const formatTime = (time) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: config.timezone,
  }).format(time);

const afkOn = async (client, chatid, reason) => {
  let data = await setAfk(reason);
  if (data?.afk) {
    await client.sendMessage(
      chatid,
      `You've already marked yourself offline at ${formatTime(
        data.time
      )}. If you want to set yourself back online, use *!afk off*`
    );
  } else if (data?.set) {
    await client.sendMessage(
      chatid,
      `You've marked yourself offline! To mark yourself back online use *!afk off*`
    );
    await logger(client,`You've marked yourself offline at ${formatTime(Date.now())}`);
  } else {
    await client.sendMessage(chatid, `Some error occured.`);
  }
};

const afkOff = async (client, chatid) => {
  let data = await setOnline();
  if (data) {
    let msg = `You're now back online. `;
    if (data.chats.length)
      msg += `While you were offline you recieved messages from \n\n${data.chats.reduce(
        (list, chat) => list + `${chat[0]} --> ${formatTime(chat[1])}\n`,
        ""
      )}`;
    await client.sendMessage(chatid, msg);
    await logger(client,`You came online at ${formatTime(Date.now())}`);
  } else {
    await client.sendMessage(chatid, `Your aren't afk.`);
  }
};

const afkStatus = async (client, chatid) => {
  const data = await getAFKData();
  if (data) {
    await client.sendMessage(
      chatid,
      `You've marked yourself offline at ${formatTime(data.time)}.\nReason: ${
        data.reason
      }\n\nIf you want to set yourself back online, use *!afk aff*`
    );
  } else {
    await client.sendMessage(chatid, `You're online.`);
  }
};

const execute = async (client, msg, args) => {
  msg.delete(true);
  let mode = args.shift();
  switch (mode) {
    case "on":
      await afkOn(client, msg.to, args.join(" "));
      break;
    case "off":
      await afkOff(client, msg.to);
      break;
    case "status":
      await afkStatus(client, msg.to);
      break;
    default:
      await client.sendMessage(
        msg.to,
        `Invalid option provide. Please refer to help.`
      );
      await client.sendMessage(msg.to, "!help afk");
  }
};

module.exports = {
  name: "Away",
  description: "Mark yourself as offline.",
  command: "!afk",
  commandType: "admin",
  isDependent: false,
  help: "*Afk*\n\n1. *!afk on Message* to turn on afk.\n2. *!afk off* to turn off afk.\n3. *!afk status* to check current status of afk.",
  execute,
};
