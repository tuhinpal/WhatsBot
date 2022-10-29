//jshint esversion:11
const { MongoClient } = require("mongodb");
const { mongodb_url } = require("../config");

module.exports = async (collection) => {
  try {
    let conn = await MongoClient.connect(mongodb_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return {
      conn,
      coll: conn.db("whatsbot").collection(collection),
    };
  } catch (e) {
    return {};
  }
};
