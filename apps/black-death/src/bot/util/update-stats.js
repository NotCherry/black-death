import Prisma from "@prisma/client";

const { PrismaClient } = Prisma;
const prisma = new PrismaClient();

export function UpdateStats(
  serverId,
  emojiCounter,
  rolesCounter,
  killCounter,
  textChannelCounter,
  voiceChannelCounter
) {
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
}
