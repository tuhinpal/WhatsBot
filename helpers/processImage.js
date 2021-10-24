const axios = require("axios");

module.exports = async (link) => {
  if (!link) throw new Error("No link provided");
  try {
    let image = await axios.get(link, { responseType: "arraybuffer" });

    return {
      mimetype: "image/jpeg",
      data: Buffer.from(image.data).toString("base64"),
      filename: "whatsbotimage",
      error: null,
    };
  } catch (error) {
    return {
      mimetype: "image/jpeg",
      data: "",
      filename: "whatsbotimage",
      error: error.message,
    };
  }
};
