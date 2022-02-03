const { Client, Intents } = require("discord.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
});
const { DbInit, Purge } = require("./db");
const app = require("../api/web");
require("dotenv").config();
require("../api/web.js")

const PORT = 3000;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  DbInit();
  Purge(client);
});

client.on("guildCreate", () => {
  Purge(client);
});

client.login(process.env.TOKEN);
//app.listen(PORT);
//console.log(`server rocking on: http://localhost:${PORT}`);
