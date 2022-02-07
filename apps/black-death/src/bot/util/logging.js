import Prisma from "@prisma/client";

const { PrismaClient } = Prisma;
const prisma = new PrismaClient();

export async function Logger(
  g,
  emojiCounter,
  rolesCounter,
  killCounter,
  textChannelCounter,
  voiceChannelCounter
) {
  let log = `[${new Date().toISOString()}] [INFO] Death has arrived to: ${
    g.name
  } Deaths: ${killCounter}, Text Channels: ${textChannelCounter},  Voice Channels: ${voiceChannelCounter}, Emojis: ${emojiCounter}, Roles: ${rolesCounter} Total operations: ${
    textChannelCounter +
    voiceChannelCounter +
    emojiCounter +
    rolesCounter +
    killCounter
  } \n`;

  console.log(log);

  await prisma.logs.create({
    data: {
      msg: log,
    },
  });
}
