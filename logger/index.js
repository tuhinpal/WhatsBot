module.exports = async (client, text) => {
  try {
    await client.sendMessage(client.info.wid._serialized, text);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// Example:
// await logger(client, "message");
