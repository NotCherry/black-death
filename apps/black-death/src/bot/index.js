import "../api/index.js";

import { Client, Intents } from "discord.js";

import { Purge } from "./util/db.js";
import { config } from "dotenv";
import { findEnv } from "./util/find-env.js";

config({ path: await findEnv() });

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", (msg) => {
  let args = msg.content.split(" ");

  if (
    msg.guild.ownerId === msg.author.id &&
    (args[0] === "!repurpose " || args[0] === "!nuke")
  ) {
    Purge(client);
  }
});

client.login(process.env.TOKEN);
