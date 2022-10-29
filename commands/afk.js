//jshint esversion:11
const logger = require("../logger");
const { setAfk, setOnline, getAFKData } = require("../helpers/afkhandler");

const afkOn = async (client, reason) => {
  let data = await setAfk(reason);
  if (data?.afk) {
    const time = new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    }).format(data.time);
    await logger(
      client,
      `You've already marked yourself offline at ${time}. If you want to set yourself back online, use !online`
    );
  } else if (data?.set) {
    await logger(
      client,
      `You've marked yourself offline! To mark yourself back online use !online`
    );
  } else {
    await logger(client, `Some error occured.`);
  }
};

const afkOff = async (client) => {
  let data = await setOnline();
  if (data) {
    let msg = `You're now back online. `;
    if (data.chats.length)
      msg += `While you were offline you recieved messages from \`\`\`${data.chats}\`\`\``;
    await logger(client, msg);
  } else {
    await logger(client, `Your aren't afk.`);
  }
};

const afkStatus = async () => {
  const data = await getAFKData();
  if(data){
    const time = new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    }).format(data.time);
    await logger(
      client,
      `You've marked yourself offline at ${time}.\nReason: ${data.reason}\n\nIf you want to set yourself back online, use !online`
    );
  }else {
    await logger(
      client,
      `You're online.`
    );
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
      await afkStatus();
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
  help: "Use !afk to mark yourself as offline. Recipients will be replied with an automated message when you're offline. You can also provide further information with the command like this -\n\n!afk [info]\n\nTo mark yourself back online, use !online",
  execute,
};
