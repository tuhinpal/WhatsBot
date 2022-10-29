//jshint esversion:11
const logger = require("../logger");
const { setAfk, setOnline, getAFKData } = require("../helpers/afkhandler");

const formatTime = (time) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(time);

const afkOn = async (client, reason) => {
  let data = await setAfk(reason);
  if (data?.afk) {
    await logger(
      client,
      `You've already marked yourself offline at ${formatTime(
        data.time
      )}. If you want to set yourself back online, use *!afk off*`
    );
  } else if (data?.set) {
    await logger(
      client,
      `You've marked yourself offline! To mark yourself back online use *!afk off*`
    );
  } else {
    await logger(client, `Some error occured.`);
  }
};

const afkOff = async (client) => {
  let data = await setOnline();
  if (data) {
    let msg = `You're now back online. `;
    if (data.chats.length) console.log(data.chats);
    msg += `While you were offline you recieved messages from \n\n${data.chats.reduce(
      (list, chat) => list + `${chat[0]} --> ${formatTime(chat[1])}\n`,
      ""
    )}`;
    await logger(client, msg);
  } else {
    await logger(client, `Your aren't afk.`);
  }
};

const afkStatus = async (client) => {
  const data = await getAFKData();
  if (data) {
    await logger(
      client,
      `You've marked yourself offline at ${formatTime(data.time)}.\nReason: ${
        data.reason
      }\n\nIf you want to set yourself back online, use *!afk aff*`
    );
  } else {
    await logger(client, `You're online.`);
  }
};

const execute = async (client, msg, args) => {
  msg.delete(true);
  let mode = args.shift();
  switch (mode) {
    case "on":
      await afkOn(client, args.join(" "));
      break;
    case "off":
      await afkOff(client);
      break;
    case "status":
      await afkStatus(client);
      break;
    default:
      await logger(client, `Invalid option provide. Please refer to help.`);
      await logger(client, "!help afk");
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
