module.exports = async (client, text) => {
  try {
    await client.sendMessage(
      `${client.info.wid.user}@c.us`,
      "```" + text + "```"
    );
    return true;
  } catch (error) {
    return false;
  }
};

// Example:
// await logger(client, "message");
