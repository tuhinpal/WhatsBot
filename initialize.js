//jshint esversion:11
const fs = require("fs");
const path = require("path");
const database = require("../db");

async function setDb() {
  try {
    const db = await database("user");
    return db;
  } catch (error) {
    return {};
  }
}

async function read(type) {
  let { conn, coll } = await setDb();
  try {
    let data = await coll.findOne({type});
    if (data) {
      fs.writeFileSync(
        path.join(__dirname, `../cache/AFK.json`),
        JSON.stringify(data)
      );
    }
    return data ? data : null;
  } catch (error) {
    return null;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

async function write(type,fields) {
    let { conn, coll } = await setDb();
    try {
      let data = await coll.insertOne({type,...fields});
      if (data) {
        fs.writeFileSync(
          path.join(__dirname, `../cache/AFK.json`),
          JSON.stringify(data)
        );
      }
      return data;
    } catch (error) {
      return null;
    } finally {
      if (conn) {
        await conn.close();
      }
    }
  }
