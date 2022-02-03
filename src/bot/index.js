import "dotenv/config.js";
import "../api/web.js";

import { Client, Intents } from "discord.js";

import { Purge } from "./db.js";

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
});
const PORT = 3000;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  Purge(client);
});

client.on("guildCreate", () => {
  Purge(client);
});

client.login(process.env.TOKEN);
//app.listen(PORT);
//console.log(`server rocking on: http://localhost:${PORT}`);
