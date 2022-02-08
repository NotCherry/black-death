import Prisma from "@prisma/client";
import { io } from "socket.io-client";

const { PrismaClient } = Prisma;
const prisma = new PrismaClient();
const socket = io(`ws://localhost:${process.env.API_PORT || 4000}`);

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
  }`;

  console.log(log);
  socket.emit("log", { text: log, key: process.env.SOCKET_KEY || "" });

  await prisma.log.create({
    data: {
      msg: log,
    },
  });
}
