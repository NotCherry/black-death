import { Permissions } from "discord.js";
import Prisma from "@prisma/client";

const { PrismaClient } = Prisma;
const prisma = new PrismaClient();
const BOT_ID = process.env.BOT_ID || "936295987499122788";

export async function UpdateUserRanking(
  client,
  g,
  emojiCounter,
  rolesCounter,
  killCounter,
  textChannelCounter,
  voiceChannelCounter
) {
  let server;

  if (g.me.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
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
            avatar: await serchedUser.avatarURL(),
            removedMembers: { increment: killCounter },
            removedTextChannels: { increment: textChannelCounter },
            removedVoiceChannels: { increment: voiceChannelCounter },
          },
          create: {
            username: serchedUser.username,
            userId: serchedUser.id,
            killedServersCount: 1,
            avatar: await serchedUser.avatarURL(),
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
    let deathbringer = await prisma.deathbringer.upsert({
      where: {
        userId: "1",
      },
      update: {
        killedServersCount: { increment: 1 },
        removedTextChannels: { increment: textChannelCounter },
        removedVoiceChannels: { increment: voiceChannelCounter },
      },
      create: {
        username: "unknown",
        userId: "1",
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
  return server.id;
}
