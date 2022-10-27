//jshint esversion:11
const fs = require("fs");
const path = require("path");
const database = require("../db");
const calcTime = require('./timediff');

async function setDb() {
  try {
    const db = await database('afk');
    return db;
  } catch (error) {
    return {};
  }
}

async function read() {
  let { conn, coll } = await setDb();
  try {
    let data = await coll.findOne({ afk: true });
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

async function getAFKData() {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(path.join(__dirname, `../cache/AFK.json`)));
  } catch (error) {
    data = await read();
  }

  return data;
}

async function updateChatList(chat) {
  const {conn,coll} = await database('afk');
  try {
    let data = await getAFKData();
    let chatlist = new Map(data?.chats);
    chatlist.set(chat,Date.now());
    console.log(chatlist);
    data.chats = Array.from(chatlist);
    fs.writeFileSync(
      path.join(__dirname, `../cache/AFK.json`),
      JSON.stringify(data)
    );
    await coll.updateOne({afk:true},{$set:{chats : Array.from(chatlist)}});
    return true;
  } catch (error) {
    return false;
  } finally {
    if(conn){
      await conn.close();
    }
  }

}

function getAfkString(){
  const afkStrings =[
    "I'm busy right now. Please talk in a bag and when I come back you can just give me the bag!",
    "I'm away right now. If you need anything, leave a message after the beep:\n```beeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeep!```",
    "You missed me, next time aim better.",
    "I'll be back in a few minutes and if I'm not...,\nwait longer.",
    "I'm not here right now, so I'm probably somewhere else.",
    "Roses are red,\nViolets are blue,\nLeave me a message,\nAnd I'll get back to you.",
    "Sometimes the best things in life are worth waiting for…\nI'll be right back.",
    "I'll be right back,\nbut if I'm not right back,\nI'll be back later.",
    "If you haven't figured it out already,\nI'm not here.",
    "I'm away over 7 seas and 7 countries,\n7 waters and 7 continents,\n7 mountains and 7 hills,\n7 plains and 7 mounds,\n7 pools and 7 lakes,\n7 springs and 7 meadows,\n7 cities and 7 neighborhoods,\n7 blocks and 7 houses...\nWhere not even your messages can reach me!",
    "I'm away from the keyboard at the moment, but if you'll scream loud enough at your screen,\nI might just hear you.",
    "I went that way\n>>>>>",
    "I went this way\n<<<<<",
    "Please leave a message and make me feel even more important than I already am.",
    "If I were here,\nI'd tell you where I am.\n\nBut I'm not,\nso ask me when I return...",
    "I am away!\nI don't know when I'll be back!\nHopefully a few minutes from now!",
    "I'm not available right now so please leave your name, number, and address and I will stalk you later. :P",
    "Sorry, I'm not here right now.\nFeel free to talk to my userbot as long as you like.\nI'll get back to you later.",
    "I bet you were expecting an away message!",
    "Life is so short, there are so many things to do...\nI'm away doing one of them..",
    "I am not here right now...\nbut if I was...\n\nwouldn't that be awesome?",
  ];

  return afkStrings[Math.floor(Math.random()*afkStrings.length)];
}

async function setAfk(reason) {

  let data = await getAFKData();
  console.log(data);

  if(data)
    return data;

  const { conn, coll } = await setDb();
  const time = Math.floor(Date.now());
  data = { afk: true, reason, time, chats: [] };

  try {
    console.log(await coll.insertOne(data));
    fs.writeFileSync(
      path.join(__dirname, `../cache/AFK.json`),
      JSON.stringify(data)
    );
    return {set: true};
  } catch (error) {
    return {set: false};
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

async function setOnline() {

  let data = await getAFKData();

  if(data){
    const { conn, coll } = await setDb();
    let timediff = calcTime(data.time,Date.now());
    try {
      fs.unlinkSync(path.join(__dirname, `../cache/AFK.json`));
      console.log(`Deleting afk data`);
    } catch (nofile) {}
    
    try {
      await coll.deleteOne({ afk: true });
      return {
        chats: data.chats.map((ele) => ele[0]),
        timediff
      };
    } catch (error) {
      return null;
    } finally {
      if (conn) {
        await conn.close();
      }
    }
  }
  else{
    return null;
  }
  
}

async function handler(sender) {
  let data = await getAFKData();
  
  if(data) {
    let timediff = calcTime(data.time,Date.now());
    let chatlist = new Map(data?.chats);
    let [,,min] = calcTime(chatlist.get(sender) || Date.now(),Date.now());
    if(!chatlist.has(sender) || min >= 15)
    {
      await updateChatList(sender);
      return {
        notify: true,
        reason: data.reason,
        timediff,
        msg: getAfkString()
      };
    }
    return {notify:false};  
  }
  else {
    return null;
  }
}

module.exports = {
  setAfk,
  setOnline,
  handler
};