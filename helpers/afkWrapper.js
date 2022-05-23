const fs = require("fs");
const path = require("path");

function startAfk(message) {
  fs.writeFileSync(
    path.join(__dirname, `../cache/afk.json`),
    JSON.stringify({
      on: true,
      message: message || "Currently I'm away. I will be back soon!",
    })
  );
}

function afkStatus() {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(__dirname, `../cache/afk.json`))
    );
  } catch (error) {
    return {
      on: false,
      message: null,
    };
  }
}

function stopAfk() {
  fs.writeFileSync(
    path.join(__dirname, `../cache/afk.json`),
    JSON.stringify({
      on: false,
      message: null,
    })
  );
}

module.exports = {
  startAfk,
  afkStatus,
  stopAfk,
};
