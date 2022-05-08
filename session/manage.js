const fs = require("fs");
const AdmZip = require("adm-zip");

let base = `${__dirname}/../.wwebjs_auth/`;

let excludedDir = [
  "session-whatsbot/Default/Cache",
  "session-whatsbot/Default/Code Cache",
  "session-whatsbot/Default/Code Storage",
  "session-whatsbot/Default/blob_storage",
  "session-whatsbot/Default/Service Worker",
];

module.exports = {
  clean: function clean() {
    try {
      // delete dir if exists
      if (fs.existsSync(`${__dirname}/../.wwebjs_auth`)) {
        fs.rmSync(`${__dirname}/../.wwebjs_auth`, { recursive: true });
        console.log("Session directory cleaned");
      }
    } catch (_) {}
  },
  write: async function write() {
    excludedDir.forEach((dir) => {
      try {
        fs.rmSync(`${base}${dir}/`, { recursive: true });
      } catch (_) {}
    });
    const zip = new AdmZip();
    zip.addLocalFolder(base);
    await zip.writeZipPromise(`${__dirname}/../session.zip`);
  },
  replicate: function replicate() {
    try {
      let zipped = fs.readFileSync(`${__dirname}/../session.zip`);
      let unzip = new AdmZip(zipped);
      unzip.extractAllToAsync(base, true);
      console.log("Session files replicated");
    } catch (error) {
      throw new Error(
        `Session file not found or corrupted. ${error.toString()}`
      );
    }
  },
};
