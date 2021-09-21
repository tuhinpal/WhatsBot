//jshint esversion:8
//jshint -W033
const fs = require("fs");
const path = require("path");
const database = require("../db");

async function insert(id) {
  try {
    var { conn, coll } = await database("pmpermit");
    await coll.insertOne({ number: id, times: 1, permit: false });
    return true;
  } catch (error) {
    return false;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

async function updateviolant(id, timesvio) {
  try {
    var { conn, coll } = await database("pmpermit");
    await coll.updateOne({ number: id }, { $set: { times: timesvio } });
    return true;
  } catch (error) {
    return false;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

async function read(id) {
  try {
    var { conn, coll } = await database("pmpermit");
    var data = await coll.findOne({ number: id });
    if (data && data.permit) {
      // save the cache for later usage
      fs.writeFileSync(
        path.join(__dirname, `../cache/${id}.json`),
        JSON.stringify({ ...data, found: true })
      );
    }
    return data ? { ...data, found: true } : { found: false };
  } catch (error) {
    return { found: false };
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

async function permit(id) {
  try {
    var { conn, coll } = await database("pmpermit");
    await coll.updateOne({ number: id }, { $set: { times: 1, permit: true } });
    fs.writeFileSync(
      path.join(__dirname, `../cache/${id}.json`),
      JSON.stringify({ found: true, number: id, times: 1, permit: true })
    );
    return true;
  } catch (error) {
    return false;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

async function nopermit(id) {
  try {
    var { conn, coll } = await database("pmpermit");
    await coll.updateOne({ number: id }, { $set: { times: 1, permit: false } });

    try {
      fs.unlinkSync(`${__dirname}/../cache/${id}.json`);
      console.log(`Deleting cache file for: ${id}`);
    } catch (nofile) {}

    return true;
  } catch (error) {
    return false;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

async function handler(id) {
  // first check for cache

  try {
    var checkPermit = JSON.parse(
      fs.readFileSync(path.join(__dirname, `../cache/${id}.json`), "utf8")
    );
  } catch (error) {
    var checkPermit = await read(id);
  }

  if (!checkPermit.found) {
    await insert(id);
    return {
      permit: false,
      block: false,
      msg: `*✋ Wait*\n\n Please wait until I will get back to Online, Kindly don't send another message.\n\n _Powered by WhatsBot_`,
    };
  } else if (checkPermit.found && !checkPermit.permit) {
    if (checkPermit.times > 3) {
      return {
        permit: false,
        block: true,
        msg: `*❌ Blocked*\n\n You have been blocked for spamming.\n\n _Powered by WhatsBot_`,
      };
    } else {
      var updateIt = await updateviolant(id, checkPermit.times + 1);
      if (!updateIt) {
        console.log(
          `That's an error, Possible reason is your MongoDB url is not working ❌`
        );
      }
      return {
        permit: false,
        block: false,
        msg: `*✋ Wait*\n\nPlease wait until I will get back to Online, Kindly don't send another message. You have ${checkPermit.times} warning(s).\n\n _Powered by WhatsBot_`,
      };
    }
  } else {
    return { permit: true, block: false, msg: null };
  }
}

async function isPermitted(id) {
  try {
    try {
      var checkPermit = JSON.parse(
        fs.readFileSync(path.join(__dirname, `../cache/${id}.json`), "utf8")
      );
    } catch (error) {
      var checkPermit = await read(id);
    }
    return checkPermit.permit;
  } catch (e) {
    return true;
  }
}

module.exports = {
  handler,
  permit,
  nopermit,
  isPermitted,
};
